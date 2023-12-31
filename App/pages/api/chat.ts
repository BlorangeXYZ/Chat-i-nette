// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import { WeaviateStore } from "langchain/vectorstores/weaviate";
import { OpenAIEmbeddings } from "langchain/embeddings";
import { makeChain } from "./util";
import weaviate, { WeaviateClient } from "weaviate-ts-client";
import { SCHEMA_NAME } from "../utils/constants";

const client = weaviate.client({ scheme: 'http', host: '127.0.0.1:8080' });

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const body = request.body;

  const vectorStore = await WeaviateStore.fromExistingIndex(new OpenAIEmbeddings(), {
    client,
    indexName: SCHEMA_NAME,
    textKey: 'text'
  });

  response.writeHead(200, {
    "Content-Type": "text/event-stream",
    // Important to set no-transform to avoid compression, which will delay
    // writing response chunks to the client.
    // See https://github.com/vercel/next.js/issues/9965
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
  });

  const sendData = (data: string) => {
    response.write(`data: ${data}\n\n`);
  };

  sendData(JSON.stringify({ data: "" }));

  const chain = makeChain(vectorStore, (token: string) => {
    sendData(JSON.stringify({ data: token }));
  });

  try {
    await chain.call({
      question: body.question,
      chat_history: body.history,
    });
  } catch (err) {
    console.error(err);
    // Ignore error
  } finally {
    sendData("[DONE]");
    response.end();
  }
}
