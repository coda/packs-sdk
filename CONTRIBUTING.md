# Contributing to the Superhuman Pack SDK

👍🎉 First off, thanks for taking the time to contribute! 🎉👍

Changes to the core SDK itself can only be made by Superhuman engineers, and they must be coordinated with changes to the Superhuman products. We do however welcome contributions to the [SDK documentation][docs], which can be done without access to or knowledge of the private codebase.


## Documentation changes

For small contributions, such fixing a typo or adding a clarifying sentence, you can directly submit a pull request to this repo. For larger changes, such as adding a new page or code sample, first make a post to the [Superhuman Community][community] with your intentions to get feedback from a Superhuman engineer. This helps ensure that you don't waste effort for a change which may not be approved.


### Style guide

When contributing to the documentation, please ensure your changes comply with the [style guide][style_guide]. Some elements of the style guide are enforced automatically using lint rules, but many others must be caught manually.


### Environment setup

While some documentation changes require only a single edit, others require building or validating your changes using the scripts in this repo's `Makefile`. This build system is designed to work on Unix-like command lines (Linux, Mac OSX, etc) and has a lot of dependencies.

The development and release tools require Node.js `^22.22.2 || ^24.15.0 || >=26.0.0`.
Use the version pinned in `.nvmrc`. On your own computer, install
[nvm](https://github.com/nvm-sh/nvm#installing-and-updating) and run the following
each time you open a terminal in the packs-sdk directory:

```sh
source setup-env.sh
```

Dependency installation uses pnpm 10.28.2, pinned in `package.json`.
`make bootstrap` installs that version locally and uses it to install dependencies.

An easy way to get setup is to use [Google Cloud Shell][cloud_shell], an hosted command-line environment and web IDE that comes with most of the dependencies already installed. You can launch Google Cloud Shell and clone this repo using the button below:

[![Open in Cloud Shell](https://gstatic.com/cloudssh/images/open-btn.svg)](https://shell.cloud.google.com/cloudshell/editor?cloudshell_git_repo=https://github.com/coda/packs-sdk.git&cloudshell_workspace=.&cloudshell_open_in_editor=docs/index.md)

In Google Cloud Shell, also install `pipenv`:

```sh
pip install --user pipenv
export PATH=$HOME/.local/bin:$PATH
```

You can then install the other dependencies using the Makefile using the bootstrap script:

```sh
make bootstrap
```

### Preview documentation

You can preview your changes to the documentation locally by running the MkDocs preview server:

```sh
make view-docs
```

This will serve the documentation on localhost:8000. If you are using Google Cloud Shell, use the **Web Preview** icon at the top, changing the port to "8000", to view the documentation.


### Changes to reference docs

The reference documentation (under `docs/reference/sdk`) is automatically generated from the TypeScript definitions. Don't edit these markdown files directly, but instead make the change to the comment in the corresponding TypeScript file. Then to rebuild the markdown files run:

```sh
make docs
```


### Validating your changes

Before opening a pull request we recommend that you first do a full build of the SDK. This will ensure that none of your changes break the core functionality of the SDK.

```sh
make build
```

That should succeed, and any changed files that result from it (usually in the `dist` directory) should be added to your PR.

Additionally, you should run the `lint` check to ensure that all of your changes meet our style rules:

```sh
make lint
```


## SDK changes

The following section includes information about how to contribute to the SDK itself, which is only done by Superhuman engineers.


### Publishing Changes Process

Add every new `CHANGELOG.md` entry only under `## [Unreleased]`, within an appropriate [Keep a Changelog][keepachangelog] category such as `### Added`, `### Changed`, or `### Fixed`. Category headings belong inside Unreleased; standalone bullets directly beneath the release heading fail `make lint-changelog`. Never add new entries to a versioned release section.

Only the release process moves Unreleased entries into a dated version section, updates `package.json`, and publishes to NPM using `make release`. Run `make lint-changelog` before committing a changelog edit.


[docs]: https://docs.superhuman.com/packs/build
[community]: https://connect.superhuman.com/c/making-packs/15
[cloud_shell]: https://cloud.google.com/shell
[style_guide]: https://docs.superhuman.com/packs/build/latest/support/contributing/style/
[keepachangelog]: https://keepachangelog.com/en/1.0.0/
