#!/bin/bash

# Pre-push hook to verify that package.json version has been updated

set -e

# Get the main branch name (could be 'main' or 'master')
MAIN_BRANCH="main"

# Get current branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

# Skip check if we're on the main branch
if [ "$CURRENT_BRANCH" = "$MAIN_BRANCH" ]; then
  exit 0
fi

# Get the version from the current branch
CURRENT_VERSION=$(node -p "require('./package.json').version" 2>/dev/null)

if [ -z "$CURRENT_VERSION" ]; then
  echo "Error: Could not read version from package.json"
  exit 1
fi

# Get the version from the main branch
MAIN_VERSION=$(git show "origin/$MAIN_BRANCH:package.json" 2>/dev/null | node -p "JSON.parse(require('fs').readFileSync('/dev/stdin', 'utf8')).version" 2>/dev/null)

if [ -z "$MAIN_VERSION" ]; then
  echo "Warning: Could not read version from origin/$MAIN_BRANCH, skipping version check"
  exit 0
fi

# Compare versions
if [ "$CURRENT_VERSION" = "$MAIN_VERSION" ]; then
  echo "❌ Semantic version check failed."
  echo ""
  echo "The version in package.json has not been updated."
  echo "Current version: $CURRENT_VERSION"
  echo "Version on $MAIN_BRANCH: $MAIN_VERSION"
  echo ""
  echo "Please update the version in package.json before pushing."
  echo "Either create a new prerelease version like 1.2.3-prerelease.1, or increment the prerelease version."
  echo ""
  echo "A new semantic version on every change is a hygiene measure that prevents occasional"
  echo "issues in downstream repos like 'coda' caused by bumping a commit hash without a change"
  echo "in the semantic version."
  echo ""
  echo "Manual changes should always result in a new prerelease version. A real semantic version"
  echo "like 1.2.3 is only created when using tooling to create an official release via"
  echo "make release-manual"
  exit 1
fi

echo "✓ Version check passed (current: $CURRENT_VERSION, $MAIN_BRANCH: $MAIN_VERSION)"
exit 0
