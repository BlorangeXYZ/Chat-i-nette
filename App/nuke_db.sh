#!/bin/bash

# Search for a container which includes the string 'weaviate' somewhere and get its ID
DB_CONTAINER=$(docker container ls -a | grep weaviate) || {
    echo 'error: No matching container was found';
    exit 1;
}
DB_CONTAINER=$(echo "$DB_CONTAINER" | cut -d' ' -f1)

# Annoy the user
echo '-------------------------------------------------'
echo 'WARNING: You are about to NUKE a Docker container'
echo "         with the following ID: $DB_CONTAINER"
echo '-------------------------------------------------'

read -n 1 -p "Do you want to proceed? [y/n] " reply;
echo
if [ "$reply" != 'y' ]; then
    exit 1
fi

# Delete, recreate and initialize
docker container stop "$DB_CONTAINER"
docker container rm "$DB_CONTAINER"
docker-compose up -d
exec ./initialize.sh
