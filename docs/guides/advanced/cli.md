---
title: Using the CLI
---

# Using the command line interface

The web editor built into the Pack Studio is quick and convenient, but as you work on larger or more complex Packs you may want to adopt a more traditional software development workflow. Building Packs on your local machine has some advantages:

- You can use your own code editing tools, such as Visual Studio Code.
- You can use your own version control system, such as GitHub.
- You can use popular [JavaScript libraries][libraries], such as those in NPM.
- You can write tests to ensure that you don't introduce bugs as you make changes.

Local development is enabled through the `coda` command line tool (CLI). It comes bundled with the Pack SDK and makes it easy to build and manage Packs from the command line.


## Getting started

The easiest way to get started it to follow the tutorial [Get started on your local machine][quickstart_cli], which will walk you through the setup and basic usage of the CLI.

[View Tutorial][quickstart_cli]{ .md-button }


### Requirements

The CLI requires that you have `node` and `npm` installed. We also recommend developing with TypeScript, in which case, make sure that you have TypeScript and `ts-node` installed.

The CLI makes use of the NPM package `isolated-vm` to provide emulation of the Packs execution environment. This package has it's [own requirements][isolated_vm_requirements] that you may also need to install.


### Installing

The `coda` CLI comes bundled with the Pack SDK. There are a few options for how to install it.


#### Single-project install (recommended)

It’s easier to manage dependencies and avoid version conflicts across projects if you create an npm project for your Pack and install the SDK and other dependencies locally.

Create a new project directory if you haven’t already and initialize your project:

```sh
# Initialize npm and follow prompts.
npm init

# Install the Coda Packs SDK locally in your project
npm install --save @codahq/packs-sdk
```

You can now access the CLI within this directory, using the command `npx coda`.


#### Global install

Alternatively you can install the SDK globally and access the CLI everywhere:

```sh
npm install --global @codahq/packs-sdk
```

You can now access the CLI in any directory by typing the command `coda`.


### Create Pack definition

Run `coda init` to initialize an empty project with the recommended file structure and install the suggested npm dependencies.


## Running code locally

Once published, your Pack functionality will be executed on Coda servers after being invoked from a Coda doc. During the development process, you can call your formulas directly from the command line, to simulate this process for rapid development. When you’re nearing the end of authoring your Pack, you can upload your Pack to Coda and run it in a real doc to verify it works as intended.


### Running formulas

The `coda` CLI utility helps you execute formulas, via the `coda execute` sub-command. You can run `coda execute --help` at any time to refresh yourself on usage. The syntax is:

```sh
npx coda execute path/to/pack.ts <formula> [params..]
```

So for example, if your Pack definition was in `src/pack.ts` and you wanted to call a function named MyFormula that takes one argument, you’d run:

```sh
npx coda execute src/pack.ts Hello "World"
```

This will execute the formula and print the output to the terminal. (A quick reminder, if your arguments have spaces or special characters in them, put them in quotation marks when specifying them on the command line.)

The `coda execute` utility will look at your Pack definition to determine the types of your parameters and will interpret your arguments accordingly. For example, if your formula takes a string and you pass `123` as an argument on the command line, it will know to interpret that as a string. But if your formula takes a number, it will interpret `123` as a number before executing the formula.

To pass array parameters to `coda execute`, use a comma separated string. For example, [1,2,3] should be passed with this format:

```sh
npx coda execute src/pack.ts GetAverage "1,2,3"
```


### Running Syncs

The above example shows how to execute a regular Pack formula. Executing a sync is almost identical:

```sh
npx coda execute path/to/pack.ts <sync name> [params..]
```

So for example, if you had a sync called Items, that took a start date as a parameter, you would execute this as:

```sh
npx coda execute path/to/pack.ts Items "2020-12-15"
```

This will execute your sync formula repeatedly until there are no more results, and print the output array of all result objects to the terminal. See the [Sync tables guide][sync_tables] for more information about how and why sync formulas are invoked repeatedly for paginated results.

To run a sync for a dynamic sync table, use the `--dynamicUrl` parameter to specify which URL to sync from.

```sh
npx coda execute path/to/pack.ts Items --dynamicUrl=https://example.com/api/table
```


## Authentication {: #authentication}

The SDK will help you set up authentication in your development environment so that you can execute Pack formulas with authentication applied to them. This allows you to run your code end-to-end including making fetcher requests to external APIs.

The `coda auth` utility is used to set up authentication for a Pack. Run `coda auth --help` at any time for a refresher on how to use the utility. Mostly, it’s as simple as running

```sh
npx coda auth path/to/pack.ts
```

The utility will inspect your Pack definition to see what kind of authentication you have defined, and then it will prompt you to provide in the console the necessary token(s) or other parameters required by your authorization type. The resulting credentials you provide will be stored in a file `.coda-credentials.json` in the same directory as your Pack definition.

!!! info "Local OAuth2 flow"
    If you are using `OAuth2` authentication, after you provide the client ID and secret it will launch an OAuth flow in your browser. This flow runs a temporary, local server at `http://localhost:3000/oauth` to handle the redirect. You will need to ensure that your client ID is configured to allow this redirect URL.

The credentials will be automatically applied to your fetch requests when you execute a Pack from the CLI or a test. For more information on using the fetcher in tests, see the [Integration tests][integration] section.


## Uploading Packs

All of the commands shown so far have only affected your local machine. To get the Pack running on Coda's servers you'll need to use some of the commands below.


### Registering an API Key

All of the Pack upload commands work with the Coda API to upload your Pack, and hence require an API key to identify you as the user. Simply run this command, and you’ll be given a link to the Coda Account page to create an API token, which you can then paste in the terminal. You API key will be saved in a hidden local file named `.coda.json` in your current directory, to be used with future commands.

```sh
npx coda register
```


### Creating a new Pack

When you’ve implemented your Pack and are ready to upload it to Coda for the first time, you’ll need to create new Pack on Coda’s servers to get assigned a Pack ID. Run this command just once for each Pack you create:

```sh
npx coda create path/to/pack.ts
```

This will create a new empty Pack on Coda’s servers. It will print out the url of the Pack Studio page in the Coda UI, and store the newly-assigned Pack ID in a hidden file `.coda-pack.json` in the same directory as your Pack definition. (This allows you to put multiple Pack definitions in the same repo, as long as they’re in different directories.) The ID in this file will be used in subsequent CLI commands for managing your Pack.

This command accepts optional flags for specifying a name and description for the Pack. You can always set or update the name and description in the Pack management UI later.

```sh
npx coda create path/to/pack.ts --name "My Pack" --description "My pack description."
```


### Uploading a Pack version

As you make changes to your Pack, when you’re ready to upload them to Coda so that you can try them in a real doc, use this command to upload a new version of your Pack based on your latest code.

```sh
npx coda upload path/to/pack.ts
```

Once uploaded, as an editor of the Pack, you’ll be able to install this specific version of your Pack in any of your docs, without affecting the live release version of your Pack that other users may be using, giving you an opportunity to test out your latest changes in your docs before making them live to users.

<!-- TODO: Un-hide this text when notes are displayed somewhere.
This command accepts an optional flag where you can provide notes about the contents of the version, helping you track changes from version to version.

```sh
npx coda upload path/to/pack.ts --notes "Added the formula MyNewFormula."
```
-->

!!! info
    At this time, this command will not upload your source code, only your compiled Pack. You will not see your source code in the web editor as you would if you had used the web code editor to compose your Pack.


### Creating a release

When you’ve tested a Pack version and want to make that version live for users of your Pack, create a release. The Pack version that you release will become the version that is used by new installations of your Pack, and existing installations will gradually be upgraded to this version.

```sh
npx coda release path/to/pack.ts <optional-version>
```

If you don’t pass a version argument, and don't explicitly set a version in your Pack definition, you will be prompted to use the latest version. The version must always be greater than that of any of your previous releases.

Alternatively, you can easily create releases from the Pack Studio.

<!-- TODO: Un-hide this text when notes are displayed somewhere.
This command accepts an optional flag where you can provide notes about the contents of the release, helping you and users of your Pack understand what changed from release to release.

```sh
npx coda release path/to/pack.ts --notes "Added the formula MyNewFormula."
```
-->


## When to use Pack Studio

Although a lot of Pack management can be done through the CLI, there are still some tasks that require you to visit the Pack Studio web interface. These include:

- Setting the authorization credentials.
- Setting rate limits.
- Editing your Pack's listing page (name, icon, etc).



[libraries]: libraries.md
[quickstart_cli]: ../../get-started/cli.md
[sync_tables]: ../blocks/sync-tables.md
[integration]: testing.md#integration
[isolated_vm_requirements]: https://github.com/laverdet/isolated-vm#requirements
