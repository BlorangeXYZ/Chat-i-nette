#!/bin/bash

# Step 1: Download
echo 'Downloading all the projects PDF files, slack channel and Documentation..'
yarn download

# Step 2: Git Download
echo 'Downloading Github Repositories..'
yarn gitdownload

# Step 3: Parse Git
echo 'Parsing Repositories to text format..'
yarn parseGit

# Step 4: Filter Slack
echo 'Filtering slack user messages only..'
yarn filterSlack

mv 42PDFs data
# Step 5: Ingest
echo 'Ingesting data to LLM..'
yarn ingest

