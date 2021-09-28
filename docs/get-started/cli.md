---
title: On your local machine
---

# Get started on your local machine

Although it takes a little longer to get started, building Packs on your local machine has some advantages over the the web-based editor:

- You can use your own code editing tools, such as [Visual Studio Code](https://code.visualstudio.com/).
- You can use your own version control system, such as [GitHub](https://github.com).
- You can use popular JavaScript libraries[^1], such as those in [NPM](https://www.npmjs.com/).

[^1]: Not all libraries available on NPM are compatible with the Packs SDK. See the [Using libraries](../guides/advanced/libraries.md) guide for more information.

Local development is enabled through the `coda` command line tool (CLI). Keep reading to learn how to install the CLI and use it to build a Pack.

## Before you get started

To create a Pack you will need a Coda account, with [Doc Maker access](https://help.coda.io/en/articles/3388781-members-and-roles) in your workspace. If you're new to Coda, [sign up](https://coda.io/signup) for a free account and you'll automatically be made a Doc Maker in your personal workspace.

Make sure you have `node` and `npm` available on your machine. These two tools often come bundled together, and more information on how to install them is available in the [npm docs](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

The instructions below assume some familiarity with the terminal / command prompt. If you aren't used to using this interface consult the help material for your operating system.

## Set up the Pack structure

1. Create a directory for your new Pack.

    ```sh
    mkdir my-pack
    cd my-pack
    ```

1. Install the Packs SDK.

    ```sh
    npm install @codahq/packs-sdk
    ```

    The Packs SDK includes both the `coda` CLI as well as the libraries and type definitions needed to build Packs.

1. Create the file structure for your Pack.

    ```sh
    npx coda init
    ```

    The `coda init` command creates the basic skeleton of a Pack based off of our [template Pack](https://github.com/coda/packs-examples/tree/main/examples/template). It's not required, but it's a fast way to get started.

Your directory should now contain the following files:

* `formulas.ts` - A place to define the Coda formulas, including those that power sync tables and column formats.
* `manifest.ts` - Defines the metadata and contents of your Pack.
* `node_modules` - The dependencies downloaded from NPM (standard for Node.js projects).
* `package-lock.json` - The versions of the dependencies downloaded from NPM (standard for Node.js projects).
* `package.json` - The project's dependencies from NPM (standard for Node.js projects).
* `schemas.ts` - A place to define the schemas (structured data types) used by your Pack.
* `types.ts` - A place to define TypeScript types for the data used by your Pack.

## Add code to the Pack

Now that you've got the basic structure of a Pack it's time to add some code. In this tutorial you'll be creating a simple "Hello World" Pack with a single formula.

Edit `formulas.ts` to include the definition of a new "Hello" formula:

=== "formulas.ts"
    ```ts hl_lines="4-7 10-34"
    --8<-- "examples/hello_cli/formulas.ts"
    ```

Take a moment to read through the code and comments and get an understanding of how a formula is structured.

## Test the Pack locally

One of the advantages of developing locally is that you can test your Pack code without having to upload it to Coda's servers. Let's test the new `Hello` formula you just added:

```shell
npx coda execute manifest.ts Hello "world"  
```

If everything works correctly this should output `Hello world!`.

## Upload the Pack

So far everything you've built only exists on your local machine, and Coda has no knowledge of it. To see it working in a real doc you'll need to upload your Pack to Coda's servers.

### Register an API token

The `coda` CLI uses the Coda API under the hood to upload your code, and likewise needs an API token to operate. Registering an API token is a one-time setup step.

1. Register an API key for Pack uploads:

    ```shell
    npx coda register
    ```

1. When prompted to create a new API token, type `y` and hit enter.

    This will open your browser to the API token creation dialog.

1. In the **Name** field enter "Hello World Pack" and then click **Generate API token**.

1. In the **Coda API tokens** section, find the token you just created, and click the **Copy token** link.

1. Switch back to your terminal, paste your token into the prompt, and hit enter.

This will create a new file `.coda.json` in your working directory that contains the API token.

??? warning "Don't check in .coda.json"
    If you use a version control system you will likely want to make sure this file isn't check in, as the token within provides access to your account. For example, if using Git, add `.coda.json` to your [`.gitignore` file](https://git-scm.com/docs/gitignore).

### Create the Pack

Now that you have the access configured you can create the new Pack on Coda's servers. This setup step that needs to be done for each Pack you create.

```shell
npx coda create manifest.ts --name "Hello World" --description "My first Pack."
```

??? info "Edit your branding later"
    The `name` and `description` arguments are optional and can be changed later in the Pack Studio's **Listing** tab, along with a variety of other branding options.

This will create a new, empty Pack on Coda's servers and output its URL in the Pack Studio. It stores the Pack's ID in the new file `.coda-pack.json`.

### Upload the first version

Now that you've established access and created the empty Pack, you're finally ready to upload your code.

```shell
npx coda upload manifest.ts --notes "Initial version."
```

??? warning "Source code not avilable"
    If you open your Pack in the online Pack Studio code editor you'll see a message like:
    
    ```ts
    // Some boilerplate when failed to load source code
    ```

    This is expected, since the CLI will only upload the built Pack and not the source code.

## Install and use the Pack

Your new Pack is now available to use in all your docs, and you can install it just any other Pack. Let's create a new document and install it:
1. Open [Coda](https://coda.io/docs) in your browser.
1. Click the **+ New doc** button and select **Start with a blank page**.

--8<-- "get-started/.use.md"

## Update the Pack

Now that you have your Pack up and running let's make a change to how it works.

1. Back in your code editor, open `formulas.ts` and update it to say "Howdy" instead of "Hello":

    === "formulas.ts"
        ```ts hl_lines="2"
        execute: function ([name]) {
          return "Howdy " + name + "!";
        },
        ```

1. Run your code locally to ensure it works:

    ```shell
    npx coda execute manifest.ts Hello "world"  
    ```

    This should output `Howdy world!`.


1. Open `manifest.ts` and change the version number to "1.0.1":

    === "manifest.ts"
        ```ts hl_lines="2"
        export const manifest: PackVersionDefinition = {
          version: '1.0.1',
          formulaNamespace: 'HelloWorld',
          // The substance of the pack, imported from other files.
          formulas,
          syncTables,
          formats,
        };
        ```

    In order for to upload a new version you must increase the version number.

    ??? info "SemVer versioning"
        The Packs SDK uses the [SemVer](https://semver.org/) versioning spec. Small changes like this only require a change to the patch version (third number), but larger or more breaking changes require a change to the minor or major version.

1. Run `coda upload` again to upload the new version.

    ```shell
    npx coda upload manifest.ts --notes "Changed to Howdy."
    ```

1. When the upload has completed, switch back to your test document.

    You'll notice that the formula is still returning `Hello World`, and that's because formulas aren't automatically recalculated when you update your Pack code.

1. In the Pack's panel, click the **Settings** tab.

    The **Currently Installed** version of the Pack should now read **Version 1.0.1**.

    ??? info "Re-opening the Pack's panel"
        If you have navigated away from the Pack's panel, click **Explore**, **Packs & import**, and then your Pack name.

1. Click the **Refresh now** :material-refresh: button.

    A **Syncing...** indicator will appear at the top of the screen while the formulas are being refreshed.

Your formula result should now be `Howdy World`.

!!! tip
    To avoid having to hit the refresh button on every update, toggle on the setting **Auto-Refresh When Version Changes**.
