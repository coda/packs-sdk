---
title: Formulas
---

# Formula samples

A formula is a JavaScript function that is exposed as a Coda formula, that you can use anywhere in a Coda doc that you can use any built-in formula. Formulas take basic types as input, like strings, numbers, dates, booleans, and arrays of these types, and return any of these types or objects whose properties are any of these types.


## Template
The basic structure of a formula. This sample takes in a single string parameter and returns a string result.
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
  execute: async function ([param], context) {
    return "Hello " + param;
  },
});
```
## No parameters
A formula without any parameters. This sample return the name of the current day of the week.
```ts
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Formula that gets the current weekday, for example "Monday".
pack.addFormula({
  name: "CurrentWeekday",
  description: "Get the current day of the week.",
  parameters: [],
  resultType: coda.ValueType.String,
  execute: async function ([], context) {
    let now = new Date();
    let formatter = Intl.DateTimeFormat('us-US', {weekday: 'long'});
    return formatter.format(now);
  },
});
```
## Optional parameters
A formula with some require and some optional parameters. This sample formats text to look like screaming, with a optional parameters to override how many exclamation points to use and an alternate character to use.
```ts
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
      defaultValue: 3,
    }),
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "character",
      description: "The character to repeat.",
      optional: true,
      defaultValue: "!",
    }),
  ],
  resultType: coda.ValueType.String,
  execute: async function ([text, volume = 3, character = "!"], context) {
    return text.toUpperCase() + character.repeat(volume);
  },
});
```
## Variable argument parameters
A formula that accepts a variable number of arguments. This sample draws a simple diagram using text, with an unknown number of arrow labels and steps.
```ts
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Takes an unknown number of steps and labels and outputs a simple diagram.
// Example: Steps("Idea", "Experiment", "Prototype", "Refine", "Product")
// Result: Idea --Experiment--> Prototype --Refine--> Product
pack.addFormula({
  name: "Steps",
  description: "Draws a simple step diagram using text.",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "start",
      description: "The starting step.",
    }),
  ],
  varargParameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "label",
      description: "The label for the arrow.",
    }),
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "step",
      description: "The next step.",
    }),
  ],
  resultType: coda.ValueType.String,
  execute: async function ([start, ...varargs], context) {
    let result = start;
    while (varargs.length > 0) {
      let label, step;
      // Pull the first set of varargs off the list, and leave the rest.
      [label, step, ...varargs] = varargs;
      result += ` --${label}--> ${step}`;
    }
    return result;
  },
});
```
## Simple autocomplete
A formula with a parameter that provides autocomplete for acceptable values. This sample returns the noise that an animal makes, for a limited set of animals.
```ts
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Returns the noise an animal makes. Ex) "cow" => "moo".
pack.addFormula({
  name: "AnimalNoise",
  description: "Gets the noise than an animal makes.",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "animal",
      description: "The selected animal.",
      autocomplete: ["cow", "pig", "sheep"],
    }),
  ],
  resultType: coda.ValueType.String,
  execute: async function ([animal], context) {
    switch (animal) {
      case "cow":
        return "moo";
      case "pig":
        return "oink";
      case "sheep":
        return "baa";
      default:
        throw new coda.UserVisibleError('Unknown animal: ' + animal);
    }
  },
});
```
## Dynamic autocomplete
A formula with a parameter that provides autocomplete for acceptable values, where the options are pulled dynamically from an API. This sample returns the price for a board game listed on the site Board Game Atlas.
```ts
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Gets the price of a board game by ID, with autocomplete on the ID.
pack.addFormula({
  name: "GetPrice",
  description: "Gets the price of a board game.",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "gameId",
      description: "The ID of the game on boardgameatlas.com",
      autocomplete: async function (context, search, metadata) {
        let url = coda.withQueryParams(
          "https://api.boardgameatlas.com/api/search",
          { fuzzy_match: true, name: search });
        let response = await context.fetcher.fetch({ method: "GET", url: url });
        let results = response.body.games;
        // Generate an array of autocomplete objects, using the game's name as
        // the label and it's ID for the value.
        return coda.autocompleteSearchObjects(search, results, "name", "id");
      },
    }),
  ],
  resultType: coda.ValueType.Number,
  codaType: coda.ValueHintType.Currency,
  execute: async function ([gameId], context) {
    let response = await context.fetcher.fetch({
      method: "GET",
      url: "https://api.boardgameatlas.com/api/search?ids=" + gameId,
    });
    return response.body.games[0].price;
  },
});

pack.addNetworkDomain("boardgameatlas.com");

// Authenticate using a client ID.
// See: https://www.boardgameatlas.com/api/docs/apps
pack.setSystemAuthentication({
  type: coda.AuthenticationType.QueryParamToken,
  paramName: "client_id",
});
```
## Autocomplete on previous parameter
A formula with a parameter that provides autocomplete for acceptable values, where the options depend on the value of a previous parameter. This sample generates a greeting in either English or Spanish.
```ts
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Greet someone in their language, with the greeting autocomplete adjusting
// based on the language selected.
pack.addFormula({
  name: "Greeting",
  description: "Greet someone.",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "language",
      description: "The language to greet them in.",
      autocomplete: [
        { display: "English", value: "en" },
        { display: "Spanish", value: "es" },
      ],
    }),
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "greeting",
      description: "The greeting to use.",
      autocomplete: async function (context, search, {language}) {
        let options;
        if (language === "es") {
          options = ["Hola", "Buenos días"];
        } else {
          options = ["Hello", "Howdy"];
        }
        return coda.simpleAutocomplete(search, options);
      },
    }),
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "name",
      description: "The name to greet.",
    }),
  ],
  resultType: coda.ValueType.String,
  connectionRequirement: coda.ConnectionRequirement.None,
  execute: async function ([language, greeting, name], context) {
    let result = greeting + " " + name + "!";
    if (language === "es") {
      // Add upside-down exclamation point in the front.
      result = "¡" + result;
    }
    return result;
  },
});
```
## Image result
A formula that returns an image. This sample gets a random cat image with an optional text overlay or filter applied.
```ts
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
```
## Rich data result
A formula that returns rich data (a schema). This sample gets information about a task in the Todoist application.
```ts
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// A schema defining the rich metadata to be returned about each task.
const TaskSchema = coda.makeObjectSchema({
  type: coda.ValueType.Object,
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
      codaType: coda.ValueHintType.Url
    },
    taskId: {
      description: "The ID of the task.",
      type: coda.ValueType.Number,
      required: true,
    },
  },
  primary: "name",
  id: "taskId",
  identity: {
    name: "Task",
  },
});

// Formula that looks up rich metadata about a task given it's URL.
pack.addFormula({
  name: "GetTaskById",
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
      url: "https://api.todoist.com/rest/v1/tasks/" + taskId,
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
```

