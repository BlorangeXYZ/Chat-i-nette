import { OpenAI } from "langchain/llms";
import { LLMChain, ChatVectorDBQAChain, loadQAChain } from "langchain/chains";
import { HNSWLib } from "langchain/vectorstores";
import { PromptTemplate } from "langchain/prompts";
import { WeaviateStore } from "langchain/vectorstores/weaviate";
import { BaseCallbackHandler, CallbackManager } from "langchain/callbacks";

const CONDENSE_PROMPT = PromptTemplate.fromTemplate(`Given the following conversation and a follow-up question, rephrase the follow-up question to be a standalone question that is specific, detailed, and clearly states the required information.

Chat History:
{chat_history}
Follow Up Input: {question}
Standalone question:`);

const QA_PROMPT = PromptTemplate.fromTemplate(
  `You are an AI assistant called Chatinette for the 42 coding school. You must follow Norminette and Moulinette, the main project rules of 42.
You are given the following extracted parts of a long document and a question. Provide a detailed and specific conversational answer to assist the 42 student in succeeding in their coding projects. Include code examples when requested.
If the question includes a request for code, provide a complete code block and explanation in step by step.
If the question includes a request for a specific 42 project make a detailed answer with: project requirements, objectives, and a code of block demonstrating how to solve the project with real life analogy.
If you don't know the answer, just say "Hmm, I'm not sure." Don't try to make up an answer.Repeatition is prohibited
If the question is not about 42 School or coding related, politely inform them that you are tuned to only answer questions about 42 and coding.
If they ask you who they are, reply with 'You're a student at 42 School.'
Question: {question}
=========
{context}
=========
Answer in Markdown:`);

export const makeChain = (vectorstore: WeaviateStore, onTokenStream?: (token: string) => void, onStreamEnd?: () => void) => {
  const questionGenerator = new LLMChain({
    llm: new OpenAI({
      temperature: 0.3,
    }),
    prompt: CONDENSE_PROMPT,
  });
  const docChain = loadQAChain(
    new OpenAI({
      temperature: 0,
      streaming: true,
      callbacks: CallbackManager.fromHandlers({
        async handleLLMNewToken(token: string) {
          if (onTokenStream !== undefined)
            onTokenStream(token);
        },
      })
    }),
    { prompt: QA_PROMPT, type: "stuff" },
  );

  //return docChain;
  return new ChatVectorDBQAChain({
    vectorstore,
    combineDocumentsChain: docChain,
    questionGeneratorChain: questionGenerator,
    outputKey: "answer",
  });
}

