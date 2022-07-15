# Contributing to the Coda Pack SDK

👍🎉 First off, thanks for taking the time to contribute! 🎉👍

Changes to the core SDK itself can only be made by Coda engineers, and they must be coordinated with changes to the core Coda product. We do however welcome contributions to the [SDK documentation][docs], which can be done without access to or knowledge of the private codebase.


## Documentation changes

For small contributions, such fixing a typo or adding a clarifying sentence, you can directly submit a pull request to this repo. For larger changes, such as adding a new page or code sample, first make a post to the [Coda Community][community] with your intentions to get feedback from a Codan. This helps ensure that you don't waste effort for a change which may not be approved.


### Style guide

When contributing to the documentation, please ensure your changes comply with the [style guide][style_guide]. Some elements of the style guide are enforced automatically using lint rules, but many others must be caught manually.


### Environment setup

While some documentation changes require only a single edit, others require building or validating your changes using the scripts in this repo's `Makefile`. This build system is designed to work on Unix-like command lines (Linux, Mac OSX, etc) and has a lot of dependencies.

An easy way to get setup is to use [Google Cloud Shell][cloud_shell], an hosted command-line environment and web IDE that comes with most of the dependencies already installed. You can launch Google Cloud Shell and clone this repo using the button below:

[![Open in Cloud Shell](https://gstatic.com/cloudssh/images/open-btn.svg)](https://shell.cloud.google.com/cloudshell/editor?cloudshell_git_repo=https://github.com/coda/packs-sdk.git&cloudshell_workspace=.&cloudshell_open_in_editor=docs/index.md)

The only dependency that needs to be installed manually in Google Cloud Shell is `pipenv`:

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

The following section includes information about how to contribute to the SDK itself, which is only done by Coda engineers.


### Publishing Changes Process

Adjustments to the `CHANGELOG.md` file should be marked under `### Not yet released` until a release commit is made that updates `package.json` and `CHANGELOG.md` file with a new, later version, and publishes the new version to NPM using `make release`.

Our `CHANGELOG.md` follows the [Keep a Changelog][keepachangelog] standards, where there is a “Unreleased” section at the top for any unreleased changes. Upon release, it is named according to a semantic versioning system and dated.


[docs]: https://coda.io/packs/build
[community]: https://community.coda.io/c/developers-central/making-packs/15
[cloud_shell]: https://cloud.google.com/shell
[style_guide]: https://coda.io/packs/build/latest/support/contributing/style/
[keepachangelog]: https://keepachangelog.com/en/1.0.0/
