# Bash script to ingest data
# This involves scraping the data from the web and then cleaning up and putting in Weaviate.
# Error if any command fails
set -e
echo Downloading docs...
mkdir data 2>/dev/null || true
mkdir pre-slack 2>/dev/null || true
cd data
#wget -q -r -A.html https://langchain.readthedocs.io/en/latest/
#wget -q -r -A.html https://42.fr/
cd ../pre-slack
wget -q https://based-department.xyz/slack_data.json
