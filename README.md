# 42 AI Peer Assistant

## Overview
The 42 AI Peer Assistant is an open-source project aimed at providing 24/7 assistance to students at 42. This AI-powered assistant is designed to complement the support provided by human peers by offering instant and reliable help whenever students need it. With a wide range of features and a comprehensive knowledge base, the assistant aims to enhance the learning experience and provide valuable guidance to students.

## Features
- Chat Interface: The project includes a user-friendly chat interface where students can interact with the AI Peer Assistant.
- Knowledge Base: The assistant is equipped with an extensive knowledge base that covers various topics, including 42 rules (Norminette, Moulinette), UNIX knowledge, Bash scripting, and more.
- User Profiles: Each student can create a personalized profile to customize their experience and track their interactions with the assistant.
- Persistent Chats: The chat interface allows users to save a limited number of conversations for future reference, reducing the need for repetitive inquiries and minimizing database costs.
- Authentication: The assistant provides secure user registration and login functionality using JWT tokens. Additionally, students can use single sign-on (SSO) login options via the 42 API and Google.
- LLM Chatbot Integration: The project integrates a Long-Term Memory (LLM) chatbot, powered by schema, models, prompts, indexes, memory, chains, and agents. This enables the assistant to handle complex queries and provide more accurate responses.
- Mobile App (Beyond MVP): The project aims to develop a mobile app using Flutter for iOS and Android platforms, allowing students to access the assistant on their smartphones.
- Blockchain NFT Gated Content and Rewards (Beyond MVP): The assistant will leverage blockchain technology to gate certain content and provide rewards to users, enhancing engagement and incentivizing interactions within the app.

## Getting Started

First, create a new `.env` file from `.env.example` and add your OpenAI API key found [here](https://platform.openai.com/account/api-keys).

```bash
cp .env.example .env
```

### Prerequisites

- [Node.js](https://nodejs.org/en/download/) (v16 or higher)
- [Yarn](https://classic.yarnpkg.com/en/docs/install/#mac-stable)
- `wget` (on macOS, you can install this with `brew install wget`)
- [Docker](https://nodejs.org/en/download/](https://www.docker.com/products/docker-desktop/)

### Install Required Packages
```bash
yarn 
```
### Build and start the Container

```bash
docker compose up -d 
```

Next, we'll need to load our data source.

### Data Ingestion

Data ingestion happens in two steps.

### Data Parsing
Parses github repo clones into txt for rapid processing of LLM into ./data directory

Run 
```bash
yarn parseGit
```

This will download our data source (in this case the Langchain docs ).

Next, install dependencies and run the ingestion script:

```bash
yarn ingest
```

_Note: If on Node v16, use `NODE_OPTIONS='--experimental-fetch' yarn ingest`_

This will parse the data, split text, create embeddings, store them in a vectorstore, and
then save it to the `data/` directory.

We save it to a directory because we only want to run the (expensive) data ingestion process once.

The Next.js server relies on the presence of the `data/` directory. Please
make sure to run this before moving on to the next step.

### Running the Server

Then, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Deploying the server

The production version of this repo is hosted on
[fly](https://chat-langchainjs.fly.dev/). To deploy your own server on Fly, you
can use the provided `fly.toml` and `Dockerfile` as a starting point.

**Note:** As a Next.js app it seems like Vercel is a natural place to
host this site. Unfortunately there are
[limitations](https://github.com/websockets/ws/issues/1786#issuecomment-678315435)
to secure websockets using `ws` with Next.js which requires using a custom
server which cannot be hosted on Vercel. Even using server side events, it
seems, Vercel's serverless functions seem to prohibit streaming responses
(e.g. see
[here](https://github.com/vercel/next.js/issues/9965#issuecomment-820156947))

## Contributing
Contributions to the 42 AI Peer Assistant project are welcome! If you have any ideas, bug fixes, or improvements, feel free to open an issue or submit a pull request.

## License
This project is licensed under the [MIT License](https://opensource.org/licenses/MIT). You are free to use, modify, and distribute the code in accordance with the terms of the license.

## Contact
For any questions or inquiries regarding the 42 AI Peer Assistant project, please contact [@juansimmendinger](https://github.com/juansimmendinger) [@mdabir1203](https://github.com/mdabir1203) [@jnspr](https://github.com/jnspr) [@nachoGonz](https://github.com/nachoGonz) 

