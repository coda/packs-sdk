---
date: 2026-05-15
slug: sdk-rename
description: The Coda Packs SDK is now the Superhuman Packs SDK, reflecting its expanding role across Superhuman.
authors:
  - eric.koleda
categories:
  - Updates
---

# The Coda Packs SDK is now the Superhuman Packs SDK

The Coda Packs SDK has a new name: the **Superhuman Packs SDK**. It started out as the way to extend Coda, but over the past year it's grown into something bigger. It's also how you build agents for [Superhuman Go][go], and going forward it will be the integration layer for everything we're building across Superhuman. The new name reflects what the SDK has already become.


## What's changing

The most visible change is the one you're already looking at. The site has a new name, a new icon, and a new color palette to match the broader Superhuman brand.

You'll also notice that new code examples in our documentation import the library as `sdk` rather than `coda`:

```ts
import * as sdk from "@codahq/packs-sdk";

export const pack = sdk.newPack();
```

This is just a local alias, so your existing code that imports it as `coda` will continue to work without any changes. There's nothing to migrate, but if you do want to switch to match the new style, it's a simple find-and-replace.

## What's not changing

Packs for Coda are alive and well. You can keep building them, publishing them, and shipping updates with the same workflow you've always used. All your existing Packs continue to run unchanged.

You'll also see the old name stick around in a few places. The npm package is still published as [`@codahq/packs-sdk`][npm], the source still lives at [`coda/packs-sdk`][repo] on GitHub. Renaming these artifacts isn't as straightforward, so they'll likely keep the old branding for some time.


[go]: ../../agents/index.md
[npm]: https://www.npmjs.com/package/@codahq/packs-sdk
[repo]: https://github.com/coda/packs-sdk
