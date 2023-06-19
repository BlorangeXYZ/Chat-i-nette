#!/bin/bash

# Colors
RED=$(tput setaf 1) # used for errors
GREEN=$(tput setaf 2) # used for success
RESET=$(tput sgr0)

# Error if any command fails
set -e

echo "${GREEN}Downloading docs...${RESET}"

mkdir data 2>/dev/null || true
mkdir pre-slack 2>/dev/null || true
cd data

# Array of PDF URLs
PDF_URLS=(
  'https://cdn.intra.42.fr/pdf/pdf/70131/en.subject.pdf'
  'https://cdn.intra.42.fr/pdf/pdf/81372/en.subject.pdf'
  'https://cdn.intra.42.fr/pdf/pdf/81792/en.subject.pdf'
  'https://cdn.intra.42.fr/pdf/pdf/70135/en.subject.pdf'
  'https://cdn.intra.42.fr/pdf/pdf/56849/en.subject.pdf'
  'https://cdn.intra.42.fr/pdf/pdf/66249/en.subject.pdf'
  'https://cdn.intra.42.fr/pdf/pdf/83099/en.subject.pdf'
  'https://cdn.intra.42.fr/pdf/pdf/70122/en.subject.pdf'
  'https://cdn.intra.42.fr/pdf/pdf/65475/en.subject.pdf'
  'https://cdn.intra.42.fr/pdf/pdf/65486/en.subject.pdf'
  'https://cdn.intra.42.fr/pdf/pdf/65661/en.subject.pdf'
  'https://cdn.intra.42.fr/pdf/pdf/76525/en.subject.pdf'
  'https://cdn.intra.42.fr/pdf/pdf/81798/en.subject.pdf'
)

# Download PDF files with colored output and incremental file names
counter=1
for url in "${PDF_URLS[@]}"; do
  filename="${counter}.pdf"
  
  # Check if the file already exists
  if [ -f "$filename" ]; then
    echo "${RED}File ${counter}.pdf already exists!${RESET}"
    ((counter++))
  else
    echo "Downloading $filename..."
    if wget "$url" -O "$filename" >/dev/null 2>&1; then
      echo "${GREEN}Downloaded $filename${RESET}"
      ((counter++))
    else
      echo "${RED}Failed to download $filename${RESET}"
    fi
  fi
done

cd ../pre-slack

# Check if slack_data.json already exists
if [ -f "slack_data.json" ]; then
  echo "${RED}File slack_data.json already exists!${RESET}"
else
  # Download slack_data.json with colored output
  echo "Downloading slack_data.json..."
  if wget -q https://based-department.xyz/slack_data.json >/dev/null 2>&1; then
    echo "${GREEN}Downloaded slack_data.json${RESET}"
  else
    echo "${RED}Failed to download slack_data.json${RESET}"
  fi
fi
