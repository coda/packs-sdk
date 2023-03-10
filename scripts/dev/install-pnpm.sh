#!/usr/bin/env bash

if [[ $OSTYPE == 'darwin'* ]]; then
  echo 'This script is intended to be run on Linux only'
  exit 1
fi

# The pnpm cdn seems to be quite flakey, so let's retry a few times before
# erroring out.

MAX_RETRIES=5
RETRY_DELAY_SECS=15
RETRY=0

while true; do
  curl -sSfL https://pnpm.js.org/pnpm.js | sudo node - add --global pnpm@7 && break
  ERROR=$?
  RETRY=$((RETRY + 1))
  if [ "${RETRY}" -gt ${MAX_RETRIES} ]; then
    log error "Bailing out after ${RETRY} retries... ¯\_(ツ)_/¯"
    exit ${ERROR}
  fi
  log warn "Waiting to retry ${RETRY} of ${MAX_RETRIES}..."
  sleep ${RETRY_DELAY_SECS}
done
