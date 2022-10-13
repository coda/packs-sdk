---
nav: Using the CLI
description: The CLI allows for local development, using libraries, and more.
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


### Requirements {: #requirements}

The CLI requires that you have `node` and `npm` installed. We also recommend developing with TypeScript, in which case, make sure that you have TypeScript and `ts-node` installed.

The CLI makes use of the NPM package `isolated-vm` to provide emulation of the Packs execution environment. This package has its [own requirements][isolated_vm_requirements] that you may also need to install. If these requirements aren't met the SDK will still install, but `coda execute` will run Packs directly in Node instead of the emulated runtime.


### Installing {: #install}

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

Run `npx coda init` to initialize an empty project with the recommended settings and dependencies.


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

This will execute the formula and print the output to the terminal.


### Passing parameters

To pass parameters to a formula when using `coda execute`, include them as separate arguments after the formula name. Like with all Coda formulas, parameters are passed positionally.

```sh
npx coda execute src/pack.ts MyFormula "one" "two" "three"
```

!!! note "Wrap arguments in quotes"
    If your arguments have spaces or special characters in them, make sure to put them in quotation marks when specifying them on the command line.

The CLI will look at your Pack definition to determine the types of your parameters and will interpret your arguments accordingly. For example, if your formula takes a string and you pass `123` as an argument on the command line, it will know to interpret that as a string. But if your formula takes a number, it will interpret `123` as a number before executing the formula.

```sh
# String
npx coda execute src/pack.ts MyFormula "Hello"
# Number
npx coda execute src/pack.ts MyFormula "42"
# Boolean
npx coda execute src/pack.ts MyFormula "true"
# Date
npx coda execute src/pack.ts MyFormula "1955-11-12T22:04:00-08:00"
# Image
npx coda execute src/pack.ts MyFormula "https://codahosted.io/..."
# HTML
npx coda execute src/pack.ts MyFormula "Hello <b>World</b>"
```

To pass array parameters, use a single argument for the parameter separating the values by a comma. For example, the argument `[1, 2, 3]` should be passed as `"1,2,3"`.

```sh
# StringArray
npx coda execute src/pack.ts MyFormula "apple,banana,carrot"
# NumberArray
npx coda execute src/pack.ts MyFormula "1,1,2,3,5,8"
# BooleanArray
npx coda execute src/pack.ts MyFormula "true,false,true"
# DateArray
npx coda execute src/pack.ts MyFormula "1985-10-26,1955-11-12"
```

!!! warning "Can't escape commas"
    It currently isn't possible to escape commas in `StringArray` parameter values. To test your formula with arrays of strings containing commas you'll need to either [write a test case][testing] or [upload](#upload) it to Coda's servers and try it in a real doc.


### Running Syncs

The above examples shows how to execute a regular Pack formula. Executing a sync is almost identical:

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


## Uploading Packs {: #upload}

All of the commands shown so far have only affected your local machine. To get the Pack running on Coda's servers you'll need to use some of the commands below.


### Registering an API token {: #register}

All of the Pack upload commands work with the Coda API to upload your Pack, and hence require an API token to identify you as the user. Simply run this command, and you’ll be given a link to the Coda Account page to create an API token, which you can then paste in the terminal. You API token will be saved in a hidden local file named `.coda.json` in your current directory, to be used with future commands.

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
npx coda release path/to/pack.ts <optional-version> --notes "<Description of the release>"
```

If you don’t pass a version argument, and don't explicitly set a version in your Pack definition, you will be prompted to use the latest version. The version must always be greater than that of any of your previous releases.  Each release must include notes that describe the changes, which are shown the Pack listing page.

Alternatively, you can create releases from within the Pack Studio.


## Recommended file structure

When using the CLI to build a Pack you can split your code into multiple files, which can be really useful for large or complex Packs. You can organize your code however you like, as long as there is a file that exports the Pack definition with the name `pack` (typically named `pack.ts`).

Coda engineers have built dozens of Packs over the years, and have settled on a the recommended file structure below:

* `helpers.ts` - A place to define helper functions used by your Pack.
* `pack.ts` - The core Pack definition, where all of the formulas, sync tables, and other building blocks are added.
* `schemas.ts` - A place to define the schemas (structured data types) used by your Pack.
* `types.ts` - A place to define TypeScript types for the data used by your Pack.

To see this pattern in action check out the [CLI example Packs][github_examples] on GitHub.


## When to use Pack Studio

Although a lot of Pack management can be done through the CLI, there are still some tasks that require you to visit the Pack Studio web interface. These include:

- Setting the authorization credentials.
- Setting rate limits.
- Editing your Pack's listing page (name, icon, etc).


## Migrating from the web editor

It's possible to start development of a Pack in the Pack Studio web editor and later migrate to using the CLI. For example, to take advantage of an NPM library, which isn't possible in the web editor.

To migrate, first make sure you have the [required software](#requirements) installed. Then create a new directory for the Pack, [install the SDK](#install), and [register an API token](#register). Finally run `coda clone` passing in the URL of the Pack.

```sh
npx coda clone "https://coda.io/p/123456"
```

This will initialize the directory with the recommended settings and dependencies, download your existing Pack code into `pack.ts`, and create a `.coda-pack.json` file that links them together.

!!! info "Link only"
    If you've already setup your local project and just need to link it to the existing Pack use the `coda link` command instead. It will create the `.coda-pack.json` file and nothing else.

    ```sh
    npx coda link "https://coda.io/p/123456"
    ```

The next time you run `coda upload` your Pack will be updated to use the local code. You can always get back to the previous code you wrote in the Pack Studio by visiting the [**History** tab][versions_history].



[libraries]: libraries.md
[quickstart_cli]: ../../tutorials/get-started/cli.md
[sync_tables]: ../blocks/sync-tables/index.md
[integration]: testing.md#integration
[isolated_vm_requirements]: https://github.com/laverdet/isolated-vm#requirements
[testing]: testing.md#local
[versions_history]: versions.md#history
[github_examples]: https://github.com/coda/packs-examples
