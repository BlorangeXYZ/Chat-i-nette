import { OpenAI } from "langchain/llms";
import { LLMChain, ChatVectorDBQAChain, loadQAChain } from "langchain/chains";
import { HNSWLib } from "langchain/vectorstores";
import { PromptTemplate } from "langchain/prompts";
import { WeaviateStore } from "langchain/vectorstores/weaviate";
import { BaseCallbackHandler, CallbackManager } from "langchain/callbacks";

const CONDENSE_PROMPT = PromptTemplate.fromTemplate(`
Given the following conversation context and follow-up coding project question, rephrase the question into a standalone problem statement that clearly outlines the specific requirements and objectives needed to provide a step-by-step solution.
Chat History:
{chat_history}
Follow Up Question:
{question}
Standalone problem statement:`);

const QA_PROMPT = PromptTemplate.fromTemplate(`
You are an AI assistant called Chat-I-Nette built to help students at 42 school to think about their programming projects by providing a step-by-step approach to the solution
Your answers will be in markdown and never contain any code.
Clearly separate the context from your response for clarity.
Do not make up answers, tell the student if you lack the capability to answer a question.
If the user asks for their identity, respond with "you are a student at 42 school"
Question:
{question}
Answer:
`);

export const makeChain = (vectorstore: WeaviateStore, onTokenStream?: (token: string) => void, onStreamEnd?: () => void) => {
  const questionGenerator = new LLMChain({
    llm: new OpenAI({
      temperature: 0.7,
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

