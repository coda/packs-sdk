## Upload the Pack

So far everything you've built only exists on your local machine, and Coda has no knowledge of it. To see it working in a real doc you'll need to upload your Pack to Coda's servers.


### Register an API token

The `coda` CLI uses the Coda API under the hood to upload your code, and likewise needs an API token to operate. Registering an API token is a one-time setup step.

1. Register an API key for Pack uploads:

    ```shell
    npx coda register
    ```

1. When prompted to create a new API token, type `y` and hit enter.

    This will open your browser to the API token creation dialog. If your browser fails to open, [click this link][coda_api_token]{ target="_blank" } instead.

1. In the **Name** field enter "Hello World Pack" and then click **Generate API token**.

1. In the **Coda API tokens** section, find the token you just created, and click the **Copy token** link.

1. Switch back to your terminal, paste your token into the prompt, and hit enter.

This will create a new file `.coda.json` in your working directory that contains the API token.


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
    // Source code is not available for Pack versions uploaded from the command line interface (CLI).
    ```

    This is expected, since the CLI will only upload the built Pack and not the source code.


## Install and use the Pack

Your new Pack is now available to use in all your docs, and you can install it just like any other Pack. Let's create a new document and install it:

1. Open [Coda][coda_home] in your browser.

1. Click the **+ New doc** button and select **Start blank doc**.

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


[template_pack]: https://github.com/coda/packs-examples/tree/main/examples/template
[coda_home]: https://coda.io/docs
[cli]: ../../guides/development/cli.md
[github_examples]: https://github.com/coda/packs-examples
[samples]: ../../samples/topic/formula.md
[guides]: ../../guides/blocks/formulas.md
[coda_api_token]: https://coda.io/account?openDialog=CREATE_API_TOKEN&scopeType=pack#apiSettings
