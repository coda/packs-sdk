---
nav: Examples
description: Sample code for agents running on Superhuman Go.
---

# Example agents

The code samples below show various ways you can build agents and the features they can use.


## 💵 Currency converter

Converts an amount of money from one currency to another, using the [ExchangeRate API](https://www.exchangerate-api.com/) to get the latest exchange rate. Has a skill that looks for placeholders in their writing and fills them in automatically.

```ts
--8<-- "samples/packs/agents/currency.ts"
```


## 💎 Google Gemini

An agent that passes all messages to Google Gemini for a reply. To verify that Gemini, and not the built-in LLM, is answering a question, it answers in rhyme and appends a gemstone emoji (💎) to each reply.

This pattern can be helpful if you want to develop an agent on your own infrastructure and expose it in Superhuman Go.

```ts
--8<-- "samples/packs/agents/gemini.ts"
```


## ✅ Todoist

An agent that allows you to work with your tasks in the app Todoist. It uses the Todoist MCP server to perform CRUD operations, and the REST API to index tasks into the knowledge layer for semantic search.

```ts
--8<-- "samples/packs/agents/todoist.ts"
```


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


## 🪙 Coin flip

Demonstrates how to handle a long-running process by using one formula to start the process and another to check the status, run in a loop by the LLM.

```ts
--8<-- "samples/packs/agents/coin_flip.ts"
```


## 🔳 QR code generator

Demonstrates how to configure an agent to start running when its icon is clicked and utilize the web page URL available in the context.

```ts
--8<-- "samples/packs/agents/qr.ts"
```

## 🗽 NY Senate

Demonstrates how to index PDF content and contacts.

```ts
--8<-- "samples/packs/agents/ny_senate.ts"
```
