---
nav: Formulas
description: Samples that show how to create a formula.
icon: material/function
---

# Formula samples

A formula is a JavaScript function that is exposed as a Coda formula, that you can use anywhere in a Coda doc that you can use any built-in formula. Formulas take basic types as input, like strings, numbers, dates, booleans, and arrays of these types, and return any of these types or objects whose properties are any of these types.


[Learn More](../../../guides/blocks/formulas){ .md-button }

## Template
The basic structure of a formula. This sample takes in a single string parameter and returns a string result.

```ts
{% raw %}
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
  execute: async function ([param], context) {
    return "Hello " + param;
  },
});
{% endraw %}
```
## Image result
A formula that returns an image. This sample gets a random cat image with an optional text overlay or filter applied.

```ts
{% raw %}
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Formula that fetches a random cat image, with various options.
pack.addFormula({
  name: "CatImage",
  description: "Gets a random cat image.",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "text",
      description: "Text to display over the image.",
      optional: true,
    }),
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "filter",
      description: "A filter to apply to the image.",
      autocomplete: ["blur", "mono", "sepia", "negative", "paint", "pixel"],
      optional: true,
    }),
  ],
  resultType: coda.ValueType.String,
  codaType: coda.ValueHintType.ImageReference,
  execute: async function ([text, filter], context) {
    let url = "https://cataas.com/cat";
    if (text) {
      url += "/says/" + encodeURIComponent(text);
    }
    url = coda.withQueryParams(url, {
      filter: filter,
      json: true,
    });
    let response = await context.fetcher.fetch({
      method: "GET",
      url: url,
      cacheTtlSecs: 0, // Don't cache the result, so we can get a fresh cat.
    });
    return "https://cataas.com" + response.body.url;
  },
});

// Allow the pack to make requests to Cat-as-a-service API.
pack.addNetworkDomain("cataas.com");
{% endraw %}
```
## Rich data result
A formula that returns rich data (a schema). This sample gets information about a task in the Todoist application.

```ts
{% raw %}
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// A schema defining the rich metadata to be returned about each task.
const TaskSchema = coda.makeObjectSchema({
  properties: {
    name: {
      description: "The name of the task.",
      type: coda.ValueType.String,
      required: true,
    },
    description: {
      description: "A detailed description of the task.",
      type: coda.ValueType.String,
    },
    url: {
      description: "A link to the task in the Todoist app.",
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.Url,
    },
    taskId: {
      description: "The ID of the task.",
      type: coda.ValueType.String,
      required: true,
    },
  },
  displayProperty: "name",
  idProperty: "taskId",
});

// Formula that looks up rich metadata about a task given it's ID.
pack.addFormula({
  name: "Task",
  description: "Gets a Todoist task by ID",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "taskId",
      description: "The ID of the task",
    }),
  ],
  resultType: coda.ValueType.Object,
  schema: TaskSchema,

  execute: async function ([taskId], context) {
    let response = await context.fetcher.fetch({
      url: "https://api.todoist.com/rest/v2/tasks/" + taskId,
      method: "GET",
    });
    let task = response.body;
    return {
      name: task.content,
      description: task.description,
      url: task.url,
      taskId: task.id,
    };
  },
});

// Allow the pack to make requests to Todoist.
pack.addNetworkDomain("todoist.com");

// Setup authentication using a Todoist API token.
pack.setUserAuthentication({
  type: coda.AuthenticationType.HeaderBearerToken,
  instructionsUrl: "https://todoist.com/app/settings/integrations",
});
{% endraw %}
```
## With examples
A formula that includes examples of how to use it. This sample formats text to look like screaming, with a optional parameters to override how many exclamation points to use and an alternate character to use.

```ts
{% raw %}
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Formats text to look like screaming. For example, "Hello" => "HELLO!!!".
pack.addFormula({
  name: "Scream",
  description: "Make text uppercase and add exclamation points.",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "text",
      description: "The text to scream.",
    }),
    coda.makeParameter({
      type: coda.ParameterType.Number,
      name: "volume",
      description: "The number of exclamation points to add.",
      optional: true,
    }),
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "character",
      description: "The character to repeat.",
      optional: true,
    }),
  ],
  resultType: coda.ValueType.String,
  examples: [
    { params: ["Hello"], result: "HELLO!!!" },
    { params: ["Hello", 5], result: "HELLO!!!!!" },
    { params: ["Hello", undefined, "?"], result: "HELLO???" },
    { params: ["Hello", 5, "?"], result: "HELLO?????" },
  ],
  execute: async function ([text, volume = 3, character = "!"], context) {
    return text.toUpperCase() + character.repeat(volume);
  },
});
{% endraw %}
```

