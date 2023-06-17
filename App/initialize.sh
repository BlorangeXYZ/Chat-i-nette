#!/bin/bash

# Step 1: Download
yarn download

# Step 2: Git Download
yarn gitdownload

# Step 3: Parse Git
yarn parseGit

# Step 4: Filter Slack
yarn filterSlack

# Step 5: Ingest
yarn ingest

