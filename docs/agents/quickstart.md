---
nav: Get started
description: Go from zero to a working AI agent in less than five minutes.
hide:
- toc
---

# Build your first agent in 5 minutes

You can build an agent for Superhuman Go in only a few minutes, without leaving your browser. This quick tutorial walks you through building, deploying, and testing your agent end-to-end.


## :material-pause-box: Before you begin

Before you can start coding, there are a few things you need:

**Grammarly Account**

:   If you don't already have one, sign up for a free account here: [grammarly.com/signup][grammarly_signup]

    ??? warning "Individual accounts only"

        At the moment, you can only use agents with *individual* Grammarly accounts. If you have an account on a team plan (Pro or Enterprise), it won't be compatible. As a workaround, select another email address and create a new Grammarly account on the Free plan.

**Coda account**

:   If you don't already have one, sign up for a free account here: [coda.io/signup][coda_signup]

    ??? tip "Ensure the emails match"

        Please ensure that you use the same email address to sign up for both Coda and Grammarly. The email address is the key being used to link both accounts.

**Grammarly for Chrome**

:   Install it from the [Chrome web store][extension]. Once installed, click on the Grammarly icon :grammarly: in the extension toolbar and enable the option **Use Superhuman Go**.

    ??? info "Google Chrome only"

        Although other browsers support Chrome extensions (Arc, Opera, etc), only Google Chrome is supported at this time.


## :fontawesome-solid-laptop-code: Create the agent

Superhuman Go agents are built using Coda Packs. Follow the steps below to create a Coda Pack that will work as an agent.

=== ":material-numeric-1-circle: Create Pack"

    <section class="tutorial-row" markdown>
    <div markdown>

    Visit [https://pack.new](https://pack.new) to open the Pack Studio web editor and create a new Pack. Select the option **Start with an empty Pack**.

    The Pack Studio is an online IDE for building and managing Packs. It's also possible to build them locally and upload them with the Packs CLI.

    </div>
    <div markdown>

    <img src="site:images/agent_quickstart_template.png" srcset="site:images/agent_quickstart_template_2x.png 2x" class="screenshot" alt="A screenshot initial dialog shown in the Pack Studio.">

    </div>
    </section>

=== ":material-numeric-2-circle: Replace code"

    <section class="tutorial-row" markdown>
    <div markdown>

    Delete all of the original code and replace it with the code shown.

    This code:

    - Imports the SDK
    - Initializes a Pack definition
    - Adds a skill, which the agent can use to answer questions

    </div>
    <div markdown>

    ```ts
    import * as coda from "@codahq/packs-sdk";

    export const pack = coda.newPack();

    pack.addSkill({
      name: "SecretPassword",
      displayName: "Secret password",
      description: "Tell the secret password.",
      prompt: `
        When the user asks for the secret password,
        tell them it's "foobar".
      `,
      tools: [],
    });
    ```

    </div>
    </section>

=== ":material-numeric-3-circle: Build Pack"

    <section class="tutorial-row" markdown>
    <div markdown>

    Click the **Build** button to compile and upload the Pack.

    Building the Pack creates a new version, which acts as a checkpoint for your code.

    </div>
    <div markdown>

    <img src="site:images/agent_quickstart_build.png" srcset="site:images/agent_quickstart_build_2x.png 2x" class="screenshot" alt="A screenshot of the Pack Studio, highlighting the location of the build button.">

    </div>
    </section>

=== ":material-numeric-4-circle: Close dialog"

    <section class="tutorial-row" markdown>
    <div markdown>

    When prompted to **Create a test doc**, dismiss the dialog with the **X** icon in the upper right.

    It can be useful to test your agent's tools in a Coda doc, where you can more precisely control the inputs and view the outputs, but this agent doesn't have any tools.

    </div>
    <div markdown>

    <img src="site:images/agent_quickstart_close.png" srcset="site:images/agent_quickstart_close_2x.png 2x" class="screenshot" alt="A screenshot of the Pack Studio, showing the dialog presented after building the first version.">

    </div>
    </section>

=== ":material-numeric-5-circle: Rename Pack"

    <section class="tutorial-row" markdown>
    <div markdown>

    Click on the name of the Pack in the upper left, and rename it to "**Secret**".

    The **Listing** and **Agent Listing** tabs have additional fields you can set, such as the icon, description, etc.

    </div>
    <div markdown>

    <img src="site:images/agent_quickstart_name.png" srcset="site:images/agent_quickstart_name_2x.png 2x" class="screenshot" alt="A screenshot of the Pack Studio, highlighting where to click to rename the Pack.">

    </div>
    </section>

---

Your Pack is now built, deployed, and ready to use as an agent. You can close the Coda Pack Studio.


## :material-download-box: Install the agent

Follow the steps below to install your agent in Superhuman Go.

=== ":material-numeric-1-circle: Open Superhuman Go"

    <section class="tutorial-row" markdown>
    <div markdown>

    Open any website ([textarea.org](https://textarea.org) is great for testing agents).

    Slide your mouse to the right of the page, and click the Superhuman Go icon :superhuman-go: that slides out.

    </div>
    <div markdown>

    <img src="site:images/agent_quickstart_go.png" srcset="site:images/agent_quickstart_go_2x.png 2x" class="screenshot" alt="A screenshot of the Superhuman Go logo sliding out from the right of the screen.">

    </div>
    </section>

=== ":material-numeric-2-circle: Add agent"

    <section class="tutorial-row" markdown>
    <div markdown>

    Click the **+** icon labeled **More agents**.

    </div>
    <div markdown>

    <img src="site:images/agent_quickstart_add.png" srcset="site:images/agent_quickstart_add_2x.png 2x" class="screenshot" alt="A screenshot of Superhuman Go, highlighting the button to add new agents.">

    </div>
    </section>

=== ":material-numeric-3-circle: Find agent"

    <section class="tutorial-row" markdown>
    <div markdown>

    In the search box, type **Secret**.

    Click on the tile for the **Secret** agent.

    </div>
    <div markdown>

    <img src="site:images/agent_quickstart_search.png" srcset="site:images/agent_quickstart_search_2x.png 2x" class="screenshot" alt="A screenshot of Superhuman Go, highlighting the search box and the agent tile.">

    </div>
    </section>

=== ":material-numeric-4-circle: Install agent"

    <section class="tutorial-row" markdown>
    <div markdown>

    Click the **Agree and open agent** button at the bottom.

    </div>
    <div markdown>

    <img src="site:images/agent_quickstart_install.png" srcset="site:images/agent_quickstart_install_2x.png 2x" class="screenshot" alt="A screenshot of Superhuman Go, highlighting the button to install an agent.">

    </div>
    </section>

---

The agent should be added to your bench and selected, with a puzzle piece icon :puzzle: and the label **Secret**.


## :material-chat-processing-outline: Test the agent

Start chatting with your agent and test if it responds correctly.

=== ":material-numeric-1-circle: Who are you?"

    <section class="tutorial-row" markdown>
    <div markdown>

    In the chat box, type:

    ```
    Who are you?
    ```

    It should respond saying that it is the "Secret agent".

    </div>
    <div markdown>

    <img src="site:images/agent_quickstart_who.png" srcset="site:images/agent_quickstart_who_2x.png 2x" class="screenshot" alt="A screenshot of a conversation with the Secret agent, responding with it's name.">

    </div>
    </section>

=== ":material-numeric-2-circle: What is the password?"

    <section class="tutorial-row" markdown>
    <div markdown>

    Reply with the message:

    ```
    What is the password?
    ```

    It should respond with "foobar"

    </div>
    <div markdown>

    <img src="site:images/agent_quickstart_password.png" srcset="site:images/agent_quickstart_password_2x.png 2x" class="screenshot" alt="A screenshot of a conversation with the Secret agent, responding with the password.">

    </div>
    </section>

---

You've built and tested your fist agent, congrats! 🎉


## :material-fast-forward: Next steps

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
