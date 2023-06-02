#!/usr/bin/env bash

# We can't install pnpm using node because pnpm 8 isn't compatible with node 14, which is what
# we use on lambda. Instead, we can install a standalone binary that doesn't depend on node.

npm install --prefix=./.pnpm_install -g @pnpm/exe@~8.5.1