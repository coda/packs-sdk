---
title: In the browser
---

# Get started in the browser 

The fastest and easiest way to create a Pack is to use our web-based editor. You don't need to download any code or tools, just make sure you have:

1. A Coda account, with
2. [Doc Maker access](https://help.coda.io/en/articles/3388781-members-and-roles) in your workspace.

If you're new to Coda, [sign up](https://{{coda.domain}}/signup) for a free account and you'll automatically be made a Doc Maker in your personal workspace.

## Navigate to the Pack editor

The Pack editor is built right in to the Coda application. To get there:

1. Open [Coda](https://{{coda.domain}}/docs) in your browser.
1. Click on the name of your workspace in the navigation menu on the left.
1. Click on **Packs** in the header.
1. Click the **New Pack** button in the upper right.

You are now in the Pack editor, ready to start building!

[![How to navigate to the Packs editor][web_ide_navigate]{: .screenshot}][web_ide_navigate]
[web_ide_navigate]: ../images/web_ide_navigate.gif

## Create a Pack from sample code

All new Packs created in the editor start off with the basic [Hello World](../samples/hello_world.md) sample code. Take a moment to read through the code and comments to get an understanding of how a Pack is structured.

Next we'll use the Packs editor to build that code and get it ready to use:

1. Click on the Pack name **Untitled Pack** in the upper left, and change it to "Hello World".

1. Click the **Build** button in the upper right.

    This checks your Pack for errors and Packages it up for use in a Coda doc. It can take a few seconds for the build to complete.

1. When the confirmation screen appears, click **Create a blank test doc**.

Your Pack is now built and ready to use!

[![How to build your Pack][web_ide_build]{: .screenshot}][web_ide_build]
[web_ide_build]: ../images/web_ide_build.gif

## Install and use the Pack

Your new Pack is now available to use in all your docs, and you can install it just like a Coda-made Pack:

1. In your doc, click **Explore**, then **Packs & import**.
1. Find your new Pack, **Hello World**, and click on it.

    This will open a dialog with more information about the Pack.

1. Click the **Install** button in the upper right.
1. Drag the **Hello** formula from the sidebar on the right into your doc.

    ??? info "Alternative: Type the formula"
        Place your cursor in the doc and type `=Hello`, and then press the tab key to select formula from your Pack.

1. Complete the formula by passing in a **name** parameter, such as `Hello("World")`, and hit enter.

If everything has gone right you should see the result `Hello World` as the output of your formula.

[![!How to install and use the Pack][web_ide_use]{: .screenshot}][web_ide_use]
[web_ide_use]: ../images/web_ide_use.gif

!!! tip
    For a more personalized message, try changing the formula to `Hello(User())`.

## Update the Pack

Now that you have your Pack up and running let's make a change to how it works.

1. Back in the Pack editor, update your code to say "Howdy" instead of "Hello":

    ```ts hl_lines="2"
    execute: function ([name]) {
      return "Howdy " + name + "!";
    },
    ```

1. Click the **Build** button again to rebuild your Pack with this change.
1. When the Build has completed, switch back to you test document.

    You'll notice that the formula is still returning `Hello World`, and that's because formulas aren't automatically recalculated when you update your pack code.

1. In the Pack's sidebar, click the **Settings** tab.

    The **Currently Installed** version of the pack should now read **Version 2**.

    ??? info "Getting back to the Pack's sidebar"
        If you have navigated away from the Pack's sidebar, click **Explore**, **Packs & import**, and then your Pack name.

1. Click the **Refresh now** :material-refresh: button.

    A **Syncing...** indicator will appear at the top of the screen while the formulas are being refreshed.

Your formula result should now be `Howdy World`.

[![!How to make a change to your Pack][web_ide_rebuild]{: .screenshot}][web_ide_rebuild]
[web_ide_rebuild]: ../images/web_ide_rebuild.gif

!!! tip
    To skip having to hit the refresh button on every update, toggle on the setting **Auto-Refresh When Version Changes**.
