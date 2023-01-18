---
nav: With Replit
description: Build your first Pack using Replit and the CLI.
icon: simple-replit
---

# Get started with Replit

[Replit][replit_home] is a collaborative, browser-based platform that allows you to write and run that code in a hosted environment. Using Replit to build a Pack gives you all of the same the power and flexibility that comes with building on your local machine, but without needing to worry about installing tooling or dependencies.

!!! info
    While Replit comes with a generous free tier, be aware that it is a paid offering at higher usage levels.


## Before you get started

You will need a Replit account in order to create a Pack using it. If you don't already have one you can [sign up][replit_signup] for free on their website.

--8<-- "tutorials/get-started/.cli/before.md"


## Create a repl

A project in Replit is called a "repl", and to start you'll need to create one. Click the button below to create a new repl from the [Packs starter project][github_packs_starter] template.

[Create repl][replit_from_github]{ .md-button .md-button--primary target="_blank" }

It may take a few minutes for the repl to fully initialize. When it's complete you should see a `pack.ts` file in your repl, and you should take a moment to read through it.


## Test the Pack

To finish the setup and test the Pack, click the **Run** button in the Replit UI. This will install the Node dependencies and run following command in the console:

```shell
npx coda execute pack.ts Hello "World"
```

If everything works correctly this should output `Hello World!`.


--8<-- "tutorials/get-started/.cli/core.md"


[replit_home]: https://replit.com/
[replit_signup]: https://replit.com/signup
[replit_from_github]: https://replit.com/new/github/coda/packs-starter
[github_packs_starter]: https://github.com/coda/packs-starter
[rebuild]: ../../images/cli_rebuild.gif
