---
nav: Get started
description: Go from zero to a working AI agent in less than five minutes.
---

# Build your first agent in 5 minutes

You can build an agent for {{ custom.agent_product_name }} in only a few minutes, without leaving your browser. This quick tutorial will walk you through how to build, deploy, and test your agent end-to-end.


## Before you begin

Before you can start coding, there are a few things you need:

**Grammarly Account**

:   If you don’t already have one, sign up for a free account here: [grammarly.com/signup][grammarly_signup]

    ??? warning "Individual accounts only"

        At the moment you can only use agents with *individual* Grammarly accounts. If you have an account that is part of a team on the Pro or Enterprise plans, it won’t be compatible. As a workaround, select another email address and create a new Grammarly account on the Free plan.

**Coda account**

:   If you don't already have one, sign up for a free account here: [coda.io/signup][coda_signup]

    ??? tip "Ensure the emails match"

        Please ensure that you use the same email address to sign up for both Coda and Grammarly. The email address is the key being used to link both accounts.

**Grammarly Chrome Extension**

:   Install it from the [Chrome web store][extension]. Once installed, click on the Grammarly icon :grammarly: in the extension toolbar and enable the option **Use {{ custom.agent_product_name }}**.

    ??? info "Google Chrome only"

        Although other browsers support Chrome extensions (Arc, Opera, etc), only Google Chrome is supported at this time.



## Create the agent

1.  Visit [https://pack.new](https://pack.new) to open the Pack Studio web editor and create a new Pack.
1.  Select the option **Start with an empty Pack**.
1.  Replace the initial code with the following:

    ```ts
    import * as coda from "@codahq/packs-sdk";

    export const pack = coda.newPack();

    pack.addSkill({
      name: "SecretPassword",
      displayName: "Secret password",
      description: "Tells the user the secret password.",
      prompt: `
        When the user asks what the secret password is, tell them it's "foobar".
      `,
      tools: [],
    });
    ```

1.  Click the **Build** button to compile and upload the Pack.
1.  When prompted to **Create a test doc**, dismiss the dialog with the **X** icon in the upper right.
1.  Click on the name of the Pack in the upper left, and rename it to “**Secret**”.


## Install the agent

1.  Open any website ([textarea.org](https://textarea.org) is great for testing agents).
1.  Slide your mouse to the right of the page, and click the {{ custom.agent_product_name }} icon :{{ custom.agent_icon_name }}: that slides out.
1.  Click the **+** icon labeled **More agents**.
1.  In the search box type **Secret**, look for the matching agent with you listed as the author, and click on the tile.
1.  Click the **Add agent** button at the bottom.

The agent should be added to your bench and selected, with a puzzle piece icon :puzzle: and the label **Secret**.


## Test the agent

1.  In the chat box type:

    ```
    Who are you?
    ```

    It should respond saying that it is the “Secret agent”.

1.  Reply with the message:

    ```
    What is the password?
    ```

    It should respond back with “foobar”.



## Next steps

The agent you just built was pretty simple, but agents can do so much more. Explore the full set of features using the resources below:

- Try some of the [Example agents][examples] to explore what else you can build.
- Read the documentation on [Skills][skills], [Tools][tools], and [Context][context] to learn more about the capabilities of the platform.


[grammarly_signup]: https://www.grammarly.com/signup
[coda_signup]: https://coda.io/signup
[extension]: https://chromewebstore.google.com/detail/grammarly-ai-writing-assi/kbfnbcaeplbcioakkpcpgfkobkghlhen
[examples]: ./examples.md
[skills]: ./features/skills.md
[tools]: ./features/tools.md
[context]: ./features/context.md
