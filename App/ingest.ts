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
  return await new Promise<Document>((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, fileContents) => {
      if (err) {
        reject(err);
      } else {
        const text = load(fileContents).text();
        const metadata = { source: filePath };
        const doc = new Document({ pageContent: text, metadata: metadata });
        resolve(doc);
      }
    });
  });
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

function walk(root: string) {
  let stack = fs.readdirSync(root).map(child => path.join(root, child));
  let files = [];

  while (stack.length > 0) {
      const node = <string> stack.pop();
      const info = fs.statSync(node);

      if (info.isFile()) {
          files.push(node);
      }
      else if (info.isDirectory()) {
          stack.push(...fs.readdirSync(node).map(child => path.join(node, child)));
      }
  }
  return files;
}

async function processDirectory(): Promise<Document[]> {
  const docs: Document[] = [];
  let files: string[] = walk('./data');
  for (const filePath of files) {
    if (filePath.endsWith(".pdf")) {
      const newDoc = processPdfFile(filePath);
      const doc = await newDoc;
      docs.push(doc);
    } else {
      const newDoc = processFile(filePath);
      const doc = await newDoc;
      docs.push(doc);
    }
  }
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
  } catch (_) {}
  const vectorStore = await WeaviateStore.fromExistingIndex(new OpenAIEmbeddings(), { client, indexName: SCHEMA_NAME, textKey: 'text' });
  vectorStore.addDocuments(docs);
  
};

(async () => {
  await run();
  console.log("done");
})();
