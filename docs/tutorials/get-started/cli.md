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

To create a Pack you will need a Coda account, with [Doc Maker access][hc_doc_maker] in your workspace. If you're new to Coda, [sign up][sign_up] for a free account and you'll automatically be made a Doc Maker in your personal workspace.

Make sure you have `node` and `npm` available on your machine. These two tools often come bundled together, and more information on how to install them is available in the [npm docs][npm_install].

The instructions below assume some familiarity with the terminal / command prompt. If you aren't used to using this interface consult the help material for your operating system.


## Set up the Pack structure

1. Create a directory for your new Pack.

    ```sh
    mkdir my-pack
    cd my-pack
    ```

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

Your directory should now contain the following files:

- `node_modules` - The dependencies downloaded from NPM (standard for Node.js projects).
- `pack.ts` - The core Pack definition, where all of the formulas, sync tables, and other building blocks are added.
- `package-lock.json` - The versions of the dependencies downloaded from NPM (standard for Node.js projects).
- `package.json` - The project's dependencies from NPM (standard for Node.js projects).
- `tsconfig.json` - The TypeScript settings for the project (standard for TypeScript projects).


## Add code to the Pack

Now that you've got the basic structure of a Pack it's time to add some code. In this tutorial you'll be creating a simple "Hello World" Pack with a single formula.

Replace the contents of `pack.ts` with the following code, which adds a "Hello" formula:

=== "pack.ts"
    ```ts
    --8<-- "samples/packs/hello_world/hello_world.ts"
    ```

Take a moment to read through the code and comments and get an understanding of how a formula is structured.


## Test the Pack locally

One of the advantages of developing locally is that you can test your Pack code without having to upload it to Coda's servers. Let's test the new `Hello` formula you just added:

```shell
npx coda execute pack.ts Hello "World"
```

If everything works correctly this should output `Hello World!`.


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
    If you use a version control system you will likely want to make sure this file isn't check in, as the token within provides access to your account. For example, if using Git, add `.coda.json` to your [`.gitignore` file][gitignore].


### Create the Pack

Now that you have the access configured you can create the new Pack on Coda's servers. This setup step that needs to be done for each Pack you create.

```shell
npx coda create pack.ts --name "Hello World" --description "My first Pack."
```

??? info "Edit your branding later"
    The `name` and `description` arguments are optional and can be changed later in the Pack Studio's **Listing** tab, along with a variety of other branding options.

This will create a new, empty Pack on Coda's servers and output its URL in the Pack Studio. It stores the Pack's ID in the new file `.coda-pack.json`.


### Upload the first version

Now that you've established access and created the empty Pack, you're finally ready to upload your code.

```shell
npx coda upload pack.ts --notes "Initial version."
```

??? warning "Source code not available"
    If you open your Pack in the online Pack Studio code editor you'll see a message like:

    ```ts
    // Failed to load source code.
    ```

    This is expected, since the CLI will only upload the built Pack and not the source code.


## Install and use the Pack

Your new Pack is now available to use in all your docs, and you can install it just any other Pack. Let's create a new document and install it:

1. Open [Coda][coda_home] in your browser.

1. Click the **+ New doc** button and select **Start with a blank page**.

1. In your doc, click **Insert**, then **Packs**.
2. Find your new Pack, **Hello World**, and click on it.

    This will open a dialog with more information about the Pack.

3. Click the **Install** button in the upper right.

--8<-- "tutorials/get-started/.use.md"


## Update the Pack

Now that you have your Pack up and running let's make a change to how it works.

1. Back in your code editor, open `pack.ts` and update it to say "Howdy" instead of "Hello":

    === "formulas.ts"
        ```ts hl_lines="2"
        execute: function ([name]) {
          return "Howdy " + name + "!";
        },
        ```

1. Run your code locally to ensure it works:

    ```shell
    npx coda execute pack.ts Hello "World"
    ```

    This should output `Howdy World!`.

1. Run `coda upload` again to upload a new version.

    ```shell
    npx coda upload pack.ts --notes "Changed to Howdy."
    ```

1. When the upload has completed, switch back to your test document.

    You'll notice that the formula is still returning `Hello World!`, and that's because formulas aren't automatically recalculated when you update your Pack code.

--8<-- "tutorials/get-started/.rebuild.md"


## Next steps

You've built your fist Pack, congrats! 🎉 Now that you have some experience with the mechanics of building and using Packs, here are some recommended next steps:

- Learn about Pack basics by reading through the [available guides][guides].
- Check out the [example Packs][github_examples] built using the CLI, as well as the other [code samples][samples].
- Dive deeper into the command line tool by reading the [CLI guide][cli].



[vs_code]: https://code.visualstudio.com/
[github]: https://github.com
[npm]: https://www.npmjs.com/
[libraries]: ../../guides/development/libraries.md
[hc_doc_maker]: https://help.coda.io/en/articles/3388781-members-and-roles
[sign_up]: https://coda.io/signup
[npm_install]: https://docs.npmjs.com/downloading-and-installing-node-js-and-npm
[isolated_vm_requirements]: https://github.com/laverdet/isolated-vm#requirements
[template_pack]: https://github.com/coda/packs-examples/tree/main/examples/template
[gitignore]: https://git-scm.com/docs/gitignore
[coda_home]: https://coda.io/docs
[rebuild]: ../../images/cli_rebuild.gif
[cli]: ../../guides/development/cli.md
[github_examples]: https://github.com/coda/packs-examples
[samples]: ../../samples/topic/formula.md
[guides]: ../../guides/blocks/formulas.md
