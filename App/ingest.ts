import { WeaviateStore } from "langchain/vectorstores/weaviate";
import { OpenAIEmbeddings } from "langchain/embeddings";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import * as fs from "fs";
import { Document } from "langchain/document";
import { BaseDocumentLoader } from "langchain/document_loaders";
import path from "path";
import { load } from "cheerio";
import pdfParse from "pdf-parse/lib/pdf-parse";
import weaviate, { WeaviateClient } from "weaviate-ts-client";
import { SCHEMA_NAME } from "./pages/utils/constants";

async function processFile(filePath: string): Promise<Document> {
  const fileContents = await fs.promises.readFile(filePath, "utf8");
  const text = load(fileContents).text();
  const metadata = { source: filePath };
  const doc = new Document({ pageContent: text, metadata: metadata });
  return doc;
}

async function processPdfFile(filePath: string): Promise<Document> {
  return await new Promise<Document>((resolve, reject) => {
    fs.readFile(filePath, (err, buffer) => {
      if (err) {
        reject(err);
      } else {
        pdfParse(buffer).then((data) => {
          const text = data.text;
          const metadata = { source: filePath };
          const doc = new Document({ pageContent: text, metadata: metadata });
          resolve(doc);
        }).catch((err) => {
          reject(err);
        });
      }
    });
  });
}

async function walk(root: string): Promise<(string | undefined)[]> {
  let stack = (await fs.promises.readdir(root)).map(child => path.join(root, child));
  let files = [];

  while (stack.length > 0) {
    const node = stack.pop();
    const info = await fs.promises.stat(node);

    if (info.isFile()) {
      files.push(node);
    } else if (info.isDirectory()) {
      stack.push(...(await fs.promises.readdir(node)).map(child => path.join(node, child)));
    }
  }

  return files;
}

async function processDirectory(): Promise<Document[]> {
  const docs: Document[] = [];
  const files: (string | undefined)[] = await walk('./data');

  await Promise.all(files.map(async (filePath: any) => {
    if (filePath.endsWith(".pdf")) {
      const newDoc = processPdfFile(filePath);
      const doc = await newDoc;
      docs.push(doc);
    } else {
      const newDoc = processFile(filePath);
      const doc = await newDoc;
      docs.push(doc);
    }
  }));

  return docs;
}

class ReadTheDocsLoader extends BaseDocumentLoader {
  constructor() {
    super();
  }
  async load(): Promise<Document[]> {
    return await processDirectory();
  }
}

const directoryPath = "data/text";
const loader = new ReadTheDocsLoader();

export const run = async () => {
  const rawDocs = await loader.load();
  console.log("Loader created.");
  /* Split the text into chunks */
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  const docs = await textSplitter.splitDocuments(rawDocs);

  console.log("Docs splitted.");
  console.log("Creating vector store...");
  /* Create the vectorstore */
  const client = weaviate.client({ scheme: 'http', host: '127.0.0.1:8080' });
  try {
    await client.schema.classCreator().withClass({
      "class": SCHEMA_NAME,
      "vectorizer": "text2vec-openai",
      "moduleConfig": {
        "text2vec-openai": {
          "model": "ada",
          "modelVersion": "002",
          "type": "text"
        }
      }
    }).do();
  } catch (e) { console.warn(e); }
  const vectorStore = await WeaviateStore.fromExistingIndex(new OpenAIEmbeddings(), { client, indexName: SCHEMA_NAME, textKey: 'text' });
  await vectorStore.addDocuments(docs);
  console.log('Done!');
};

run().catch(error => console.error(error));
