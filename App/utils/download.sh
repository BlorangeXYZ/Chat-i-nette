# Bash script to ingest data
# This involves scraping the data from the web and then cleaning up and putting in Weaviate.
# Error if any command fails
set -e
echo Downloading docs...
mkdir data 2>/dev/null || true
mkdir pre-slack 2>/dev/null || true
cd data
wget -O70131.pdf 'https://cdn.intra.42.fr/pdf/pdf/70131/en.subject.pdf'
wget -O81372.pdf 'https://cdn.intra.42.fr/pdf/pdf/81372/en.subject.pdf'
wget -O81792.pdf 'https://cdn.intra.42.fr/pdf/pdf/81792/en.subject.pdf'
wget -O70135.pdf 'https://cdn.intra.42.fr/pdf/pdf/70135/en.subject.pdf'
wget -O56849.pdf 'https://cdn.intra.42.fr/pdf/pdf/56849/en.subject.pdf'
wget -O66249.pdf 'https://cdn.intra.42.fr/pdf/pdf/66249/en.subject.pdf'
wget -O83099.pdf 'https://cdn.intra.42.fr/pdf/pdf/83099/en.subject.pdf'
wget -O70122.pdf 'https://cdn.intra.42.fr/pdf/pdf/70122/en.subject.pdf'
wget -O65475.pdf 'https://cdn.intra.42.fr/pdf/pdf/65475/en.subject.pdf'
wget -O65486.pdf 'https://cdn.intra.42.fr/pdf/pdf/65486/en.subject.pdf'
wget -O65661.pdf 'https://cdn.intra.42.fr/pdf/pdf/65661/en.subject.pdf'
wget -O76525.pdf 'https://cdn.intra.42.fr/pdf/pdf/76525/en.subject.pdf'
wget -O81798.pdf 'https://cdn.intra.42.fr/pdf/pdf/81798/en.subject.pdf'
#wget -q -r -A.html https://langchain.readthedocs.io/en/latest/
#wget -q -r -A.html https://42.fr/
cd ../pre-slack
wget -q https://based-department.xyz/slack_data.json
