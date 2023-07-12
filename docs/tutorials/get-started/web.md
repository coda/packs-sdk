---
nav: In the browser
description: Build your first Pack in minutes using the Pack Studio web editor.
icon: octicons/browser-16
---

# Get started in the browser

The fastest and easiest way to create a Pack is to use our web-based Pack Studio. You don't need to download any code or tools, just make sure you have:

1. A Coda account, with
2. [Doc Maker access][hc_doc_maker] in your workspace.

If you're new to Coda, [sign up][coda_sign_up] for a free account and you'll automatically be made a Doc Maker in your personal workspace.

<iframe width="560" height="315" src="https://www.youtube.com/embed/nZVb8w77yqY" title="YouTube video player: Get started in the browser" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>


## Navigate to the Pack Studio

The Pack Studio is built right in to the Coda application. To get there:

1. Open [Coda][coda_home] in your browser.
1. Click on **Packs** in the navigation menu on the left. If you are a member of multiple workspaces you will need to select a workspace first.
1. Click the **Create a Pack** button in the upper right.

!!! tip
    Type **[pack.new](https://pack.new)** into your browser to quickly create a new Pack.

You are now in the Pack Studio, ready to start building!

[![How to navigate to the Pack Studio][web_ide_navigate]{: .screenshot}][web_ide_navigate]


## Create a Pack from an example

When starting a new Pack you have the choice to begin with an existing example or or start from scratch. In this tutorial we'll use the basic [Hello World][samples_hello_world] sample code. Take a moment to read through the code and comments and get an understanding of how a Pack is structured.

Next we'll use the Pack Studio to build that code and get it ready to use:

1. Click on the **Hello World** example to add in the sample code.

1. Click on the Pack name **Untitled Pack** in the upper left, and change it to "Hello World".

1. Click the **Build** button in the bottom left.

    This checks your Pack for errors and Packages it up for use in a Coda doc. It can take a few seconds for the build to complete.

1. When the confirmation screen appears, click **Create a test doc**.

Your Pack is now built and ready to use!

[![How to build your Pack][web_ide_build]{: .screenshot}][web_ide_build]


## Use the Pack

The Pack can now be installed in any of your docs, and the test doc you created comes with the Pack pre-installed. Now let's use your new Pack in the document.

--8<-- "tutorials/get-started/.use.md"


## Update the Pack

Now that you have your Pack up and running let's make a change to how it works.

1. Back in the Pack Studio, update your code to say "Howdy" instead of "Hello":

    ```ts hl_lines="2"
    execute: async function ([name]) {
        return "Howdy " + name + "!";
    },
    ```

1. Click the **Build** button again to rebuild your Pack with this change.
1. When the Build has completed, switch back to your test document.

    You'll notice that the formula is still returning `Hello World!`, and that's because formulas aren't automatically recalculated when you update your Pack code.

--8<-- "tutorials/get-started/.rebuild.md"


## Next steps

You've built your fist Pack, congrats! 🎉 Now that you have some experience with the mechanics of building and using Packs, here are some recommended next steps:

- Learn about Pack basics by reading through the [available guides][guides].
- Check out the [code samples][samples] to see examples of specific Pack features as well as complete sample Packs.


[coda_sign_up]: https://coda.io/signup
[hc_doc_maker]: https://help.coda.io/en/articles/3388781-members-and-roles
[coda_home]: https://coda.io/docs
[web_ide_navigate]: ../../images/web_ide_navigate.webp
[web_ide_build]: ../../images/web_ide_build.webp
[samples_hello_world]: ../../samples/full/hello-world.md
[rebuild]: ../../images/web_ide_rebuild.webp
[samples]: ../../samples/topic/formula.md
[guides]: ../../guides/blocks/formulas.md
