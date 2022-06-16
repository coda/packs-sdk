[![npm release](https://img.shields.io/npm/v/@codahq/packs-sdk?color=%23F8AD40&logo=coda&logoColor=%23EE5A29&style=flat-square)](https://www.npmjs.com/package/@codahq/packs-sdk)
[![Downloads](https://img.shields.io/npm/dt/@codahq/packs-sdk?color=%23F8AD40&label=npm%20downloads&style=flat-square)](https://coda.io/gallery?filter=Packs)
[![Community](https://img.shields.io/discourse/users?color=%23F8AD40&label=community&logo=coda&server=https%3A%2F%2Fcommunity.coda.io%2F&style=flat-square)](https://community.coda.io)

# Coda Packs SDK

Coda Packs allow you to extend Coda by building new building blocks that can operate directly on Coda docs' canvas. You can write these extensions in JavaScript/TypeScript, using them to create functions that let you re-use a formula's complex logic across documents or even communicate with third-party APIs, with or without user authentication.

To learn more, see [our SDK documentation](https://coda.io/packs/build).

## Contribution Guide

### Updating docs, site, and generated code

Run `make build`

### Publishing Changes Process

Adjustments to the `CHANGELOG.md` file should be marked under `### Unreleased` until a release commit is made that updates `package.json` and `CHANGELOG.md` file with a new, later version, and publishes the new version to NPM using `make release`.

#### CHANGELOG

Our `CHANGELOG.md` follows the [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) standards, where there is a “Unreleased” section at the top for any unreleased changes. Upon release, it is named according to a semantic versioning system and dated.
