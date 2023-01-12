---
nav: With GitHub Codespaces
description: Build your first Pack using GitHub Codespacs and the CLI.
icon: octicons-mark-github-16
---

# Get started with GitHub Codespaces

GitHub is a popular tool for storing and managing code, and their [Codespaces][github_codespaces] offering allows you to edit and run that code in a hosted environment. Using GitHub Codespaces to build a Pack gives you all of the same the power and flexibility that comes with building on your local machine, but without needing to worry about installing tooling or dependencies.

!!! info
    While GitHub Codespaces comes with a generous free tier, be aware that it is a paid offering at higher usage levels.


## Before you get started

You will need a GitHub account in order to create a Pack using Codespaces. If you don't already have one you can [sign up][github_signup] for free on their website.

--8<-- "tutorials/get-started/.cli/before.md"


## Create codespace

<section class="tutorial-row" markdown>
<div markdown>

Click the button below to create a new repository from the [Packs starter project][github_packs_starter] template.

[Create repository][github_use_template]{ .md-button .md-button--primary target="_blank" }

Name the new repository "hello-pack", set the visibility to **Private**, and then click the button **Create repository from template**.

</div>
<div markdown>

<img src="../../../images/tutorial_github_repo.png" srcset="../../../images/tutorial_github_repo_2x.png 2x" class="screenshot" alt="Create a repository from the template.">

</div>
</section>

---

<section class="tutorial-row" markdown>
<div markdown>

From you new repository click the button **Code**. In the resulting dropdown menu select the tab **Codespaces** tab and then click the button **Create codespace on main**.

</div>
<div markdown>

<img src="../../../images/tutorial_github_codespace.png" srcset="../../../images/tutorial_github_codespace_2x.png 2x" class="screenshot" alt="Create a codespace for your repo.">

</div>
</section>

---

It may take a few minutes for the codespace to fully initialize and install the dependencies.


### Project contents

Your codespace will contain the following files:

--8<-- "tutorials/get-started/.cli/contents.md"
- `test/pack_test.ts` - A suite of unit tests that ensure the Pack works as expected. You can run them using `npm run test`.

Other files in the project are not required to build a Pack and you can remove or adapt them as needed.


--8<-- "tutorials/get-started/.cli/core.md"

!!! info "Save your work"
    Your Pack code will be preserved in the codespace, but it's a good idea to publish it to a GitHub repository as well. You can read more about this in the [GitHub documentation][github_codespace_template].


[github_codespaces]: https://github.com/features/codespaces
[github_signup]: https://github.com/signup
[github_new]: https://github.com/new
[github_use_template]: https://github.com/coda/packs-starter/generate
[github_packs_starter]: https://github.com/coda/packs-starter
[rebuild]: ../../images/cli_rebuild.gif
[github_codespace_template]: https://docs.github.com/en/codespaces/developing-in-codespaces/creating-a-codespace-from-a-template#publishing-to-a-repository-on-github
