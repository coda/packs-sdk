---
nav: With Gitpod
description: Build your first Pack using Gitpod and the CLI.
icon: simple-gitpod
---

# Get started with Gitpod

[Gitpod][gitpod_home] is an open source developer platform that allows you to write and run that code in a hosted environment. Using Gitpod to build a Pack gives you all of the same the power and flexibility that comes with building on your local machine, but without needing to worry about installing tooling or dependencies.

!!! info
    While Gitpod comes with a generous free tier, be aware that it is a paid offering at higher usage levels.


## Before you get started

You will need a Gitpod account in order to create a Pack using it. If you don't already have one you can [sign up][gitpod_signup] for free on their website.

--8<-- "tutorials/get-started/.cli/before.md"


## Create a workspace

A project in Gitpod is called a workspace, and to start you'll need to create one. Click the button below to create a new workspace from the [Packs starter project][github_packs_starter] template.

[Create workspace][gitpod_from_github]{ .md-button .md-button--primary target="_blank" }

It may take a few minutes for the workspace to fully initialize. When it's complete you will see a `pack.ts` file in your workspace, and you should take a moment to read through it.


## Test the Pack

--8<-- "tutorials/get-started/.cli/test.md"


--8<-- "tutorials/get-started/.cli/core.md"


[gitpod_home]: https://www.gitpod.io/
[gitpod_signup]: https://gitpod.io/workspaces/
[gitpod_from_github]: https://gitpod.io/#https://github.com/coda/packs-starter
[github_packs_starter]: https://github.com/coda/packs-starter
[rebuild]: ../../images/cli_rebuild.webp
