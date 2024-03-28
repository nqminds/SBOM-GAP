#!/usr/bin/env sh
#
# Runs NPM install and NPM generate-proto-docs before any Docker command
# This is just in case we're using a bind-mount in Docker

npm install && npm run generate-proto-docs

# Runs the actual command
exec "$@"
