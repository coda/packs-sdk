---
title: In the browser
---

# Get started in the browser

The fastest and easiest way to create a Pack is to use our web-based Pack Studio. You don't need to download any code or tools, just make sure you have:

1. A Coda account, with
2. [Doc Maker access](https://help.coda.io/en/articles/3388781-members-and-roles) in your workspace.

If you're new to Coda, [sign up](https://coda.io/signup) for a free account and you'll automatically be made a Doc Maker in your personal workspace.

## Navigate to the Pack Studio

The Pack Studio is built right in to the Coda application. To get there:

1. Open [Coda](https://coda.io/docs) in your browser.
1. Click on **Packs** in the navigation menu on the left. If you are a member of multiple workspaces you will need to select a workspace first.
1. Click the **New Pack** button in the upper right.

You are now in the Pack Studio, ready to start building!

[![How to navigate to the Pack Studio][web_ide_navigate]{: .screenshot}][web_ide_navigate]
[web_ide_navigate]: ../images/web_ide_navigate.gif

## Create a Pack from sample code

All new Packs created in the Pack Studio start off with the basic [Hello World](../samples/full/hello-world.md) sample code. Take a moment to read through the code and comments and get an understanding of how a Pack is structured.

Next we'll use the Pack Studio to build that code and get it ready to use:

1. Click on the Pack name **Untitled Pack** in the upper left, and change it to "Hello World".

1. Click the **Build** button in the bottom left.

    This checks your Pack for errors and Packages it up for use in a Coda doc. It can take a few seconds for the build to complete.

1. When the confirmation screen appears, click **Create a blank test doc**.

Your Pack is now built and ready to use!

[![How to build your Pack][web_ide_build]{: .screenshot}][web_ide_build]
[web_ide_build]: ../images/web_ide_build.gif

## Install and use the Pack

Your new Pack is now available to use in all your docs, and you can install it just any other Pack.

--8<-- "get-started/.use.md"

## Update the Pack

Now that you have your Pack up and running let's make a change to how it works.

1. Back in the Pack Studio, update your code to say "Howdy" instead of "Hello":

    ```ts hl_lines="2"
    execute: function ([name]) {
      return "Howdy " + name + "!";
    },
    ```

1. Click the **Build** button again to rebuild your Pack with this change.
1. When the Build has completed, switch back to your test document.

    You'll notice that the formula is still returning `Hello World`, and that's because formulas aren't automatically recalculated when you update your Pack code.

1. In the Pack's panel, click the **Settings** tab.

    The **INSTALLED** version of the Pack should now read **v2**.

    ??? info "Re-opening the Pack's panel"
        If you have navigated away from the Pack's panel, click **Explore**, **Packs & import**, and then your Pack name.

1. Click the **Open Pack maker tools** button.
1. In the Pack maker tools bar, click the three dots icon :material-dots-vertical: and then **:material-refresh: Refresh Pack formulas and tables**.

    A **Syncing...** indicator will appear at the top of the screen while the formulas are being refreshed.

Your formula result should now be `Howdy World`.

[![!How to make a change to your Pack][web_ide_rebuild]{: .screenshot}][web_ide_rebuild]
[web_ide_rebuild]: ../images/web_ide_rebuild.gif

!!! tip
    To avoid having to manually refresh the formulas on every update, click the gear icon :material-cog-outline: in the Pack maker toolbar and toggle on the **AUTO-REFRESH**  setting.
