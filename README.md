# Coda Packs SDK

Coda Packs allow you to extend Coda by building new building blocks that can operate directly on Coda docs' canvas. You can write these extensions in JavaScript/TypeScript, using them to create functions that let you re-use a formula's complex logic across documents or even communicate with third-party APIs, with or without user authentication.

To learn more, see [our SDK documentation](https://coda.io/packs/build) or join the [Packs Studio Beta](https://coda.io/packsbeta).

## Publishing Changes Process
Adjustments to the `CHANGELOG.md` file should be marked under `### Unreleased` until a release commit is made that updates `package.json` and `CHANGELOG.md` file with a new, later version, and publishes the new version to NPM using `make npm-publish`.
