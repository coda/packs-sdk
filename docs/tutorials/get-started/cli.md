---
nav: On your local machine
description: Build your first Pack on your local machine using the CLI.
icon: octicons/terminal-16
---

# Get started on your local machine

Although it takes a little longer to get started, building Packs on your local machine has some advantages over the the web-based editor:

- You can use your own code editing tools, such as [Visual Studio Code][vs_code].
- You can use your own version control system, such as [GitHub][github].
- You can use popular JavaScript libraries[^1], such as those in [NPM][npm].

[^1]: Not all libraries available on NPM are compatible with the Pack SDK. See the [Using libraries][libraries] guide for more information.

Local development is enabled through the `coda` command line tool (CLI). Keep reading to learn how to install the CLI and use it to build a Pack.


## Before you get started

Make sure you have `node` and `npm` available on your machine. These two tools often come bundled together, and more information on how to install them is available in the [npm docs][npm_install].

--8<-- "tutorials/get-started/.cli/before.md"


## Create a directory

Installing the SDK and creating a Pack creates multiple files, so you'll want to make sure you are working in a clean directory.

```sh
mkdir my-pack
cd my-pack
```

## Initialize the Pack

1. Initialize the project.

    ```sh
    npm init
    ```

1. Install the Pack SDK.

    ```sh
    npm install --save @codahq/packs-sdk
    ```

    The Pack SDK includes both the `coda` CLI as well as the libraries and type definitions needed to build Packs.

1. Create the file structure for your Pack.

    ```sh
    npx coda init
    ```

    The `coda init` command creates the basic skeleton of a Pack based off of our [template Pack][template_pack]. It's not required, but it's a fast way to get started.


When it's complete you should see a `pack.ts` file in your directory.


## Add code to the Pack

Now that you've got the basic structure of a Pack it's time to add some code. In this tutorial you'll be creating a simple "Hello World" Pack with a single formula.

Replace the contents of `pack.ts` with the following code, which adds a "Hello" formula:

=== "pack.ts"
    ```ts
    --8<-- "samples/packs/hello_world/hello_world.ts"
    ```

Take a moment to read through the code and comments and get an understanding of how a formula is structured.


## Test the Pack

--8<-- "tutorials/get-started/.cli/test.md"


--8<-- "tutorials/get-started/.cli/core.md"


[vs_code]: https://code.visualstudio.com/
[github]: https://github.com
[npm]: https://www.npmjs.com/
[libraries]: ../../guides/development/libraries.md
[npm_install]: https://docs.npmjs.com/downloading-and-installing-node-js-and-npm
[isolated_vm_requirements]: https://github.com/laverdet/isolated-vm#requirements
[template_pack]: https://github.com/coda/packs-examples/tree/main/examples/template
[rebuild]: ../../images/cli_rebuild.webp
