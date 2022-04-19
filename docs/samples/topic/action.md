---
title: Actions
---

# Action samples

Actions are special types of formulas that power buttons and automations. They usually send data to an external API, but can also be used for other one-time calculations.


[Learn More](../../../guides/blocks/actions){ .md-button }

## Template
The basic structure of an action. This sample takes in a single string parameter and returns the string &quot;OK&quot; when the action is complete.

```ts
pack.addFormula({
  name: "<User-visible name of formula>",
  description: "<Help text for the formula>",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "<User-visible name of parameter>",
      description: "<Help text for the parameter>",
    }),
    // Add more parameters here and in the array below.
  ],
  resultType: coda.ValueType.String,
  isAction: true,
  execute: async function ([param], context) {
    // TODO: Do something.
    return "OK";
  },
});
```
## Random value
A formula that returns a random value. This sample rolls virtual dice and returns the results.

```ts
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Rolls virtual dice and returns the resulting numbers. Use it with a button in
// table and store the results in another column.
pack.addFormula({
  name: "RollDice",
  description: "Roll some virtual dice.",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.Number,
      name: "quantity",
      description: "How many dice to roll.",
      suggestedValue: 1,
    }),
    coda.makeParameter({
      type: coda.ParameterType.Number,
      name: "sides",
      description: "How many sides the dice have.",
      suggestedValue: 6,
    }),
  ],
  resultType: coda.ValueType.Array,
  items: coda.makeSchema({
    type: coda.ValueType.Number,
  }),
  isAction: true,
  execute: async function ([quantity, sides], context) {
    let results = [];
    for (let i = 0; i < quantity; i++) {
      let roll = Math.ceil(Math.random() * sides);
      results.push(roll);
    }
    return results;
  },
});
```
## Post to API
A formula that posts data to an external API. This sample creates a new task in the Todoist app.

```ts
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Action formula (for buttons and automations) that adds a new task in Todoist.
pack.addFormula({
  name: "AddTask",
  description: "Add a new task.",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "name",
      description: "The name of the task.",
    }),
  ],
  resultType: coda.ValueType.String,
  isAction: true,

  execute: async function ([name], context) {
    let response = await context.fetcher.fetch({
      url: "https://api.todoist.com/rest/v1/tasks",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: name,
      }),
    });
    // Return values are optional but recommended. Returning a URL or other
    // unique identifier is recommended when creating a new entity.
    return response.body.url;
  },
});

// Allow the pack to make requests to Todoist.
pack.addNetworkDomain("todoist.com");

// Setup authentication using a Todoist API token.
pack.setUserAuthentication({
  type: coda.AuthenticationType.HeaderBearerToken,
  instructionsUrl: "https://todoist.com/app/settings/integrations",
});
```

