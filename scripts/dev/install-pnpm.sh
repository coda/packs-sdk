#!/usr/bin/env bash

PNPM_VERSION=$(jq -r .engines.pnpm package.json)

# Install in a local directory to avoid conflicts with the local or global node_modules/
npm install --prefix=./.pnpm_install -g "@pnpm/exe@${PNPM_VERSION}"
