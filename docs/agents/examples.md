---
nav: Examples
description: Sample code for agents running on Superhuman Go.
---

# Example agents

The code samples below show various ways you can build agents and the features they can use.


## 🅰️ Gen Alpha

An agent that suggests ways to incorporate more Gen Alpha slang into the user's writing.

```ts
--8<-- "samples/packs/agents/gen_alpha.ts"
```


## 🧙 Gandalf

This example shows how you can override the `defaultChat` skill to build custom routing between the other skills in your Pack.

```ts
--8<-- "samples/packs/agents/gandalf.ts"
```
