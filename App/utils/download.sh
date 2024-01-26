#!/bin/bash

# Colors
RED=$(tput setaf 1) # used for errors
GREEN=$(tput setaf 2) # used for success
RESET=$(tput sgr0)

# Error if any command fails
set -e

echo "${GREEN}Downloading docs...${RESET}"

mkdir data 2>/dev/null || true
cd data

# Array of PDF URLs
PDF_URLS=(
  'https://cdn.intra.42.fr/pdf/pdf/115781/en.subject.pdf'
  'https://cdn.intra.42.fr/pdf/pdf/106616/en.subject.pdf'
  'https://cdn.intra.42.fr/pdf/pdf/115778/en.subject.pdf'
  'https://cdn.intra.42.fr/pdf/pdf/106618/en.subject.pdf'
  'https://cdn.intra.42.fr/pdf/pdf/106591/en.subject.pdf'
  'https://cdn.intra.42.fr/pdf/pdf/121932/en.subject.pdf'
  'https://cdn.intra.42.fr/pdf/pdf/118145/en.subject.pdf'
  'https://cdn.intra.42.fr/pdf/pdf/118139/en.subject.pdf'
  'https://cdn.intra.42.fr/pdf/pdf/118116/en.subject.pdf'
  'https://cdn.intra.42.fr/pdf/pdf/114765/en.subject.pdf'
  'https://cdn.intra.42.fr/pdf/pdf/111470/en.subject.pdf'
  'https://cdn.intra.42.fr/pdf/pdf/111469/en.subject.pdf'
  'https://cdn.intra.42.fr/pdf/pdf/110420/en.subject.pdf'
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
