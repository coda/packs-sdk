---
title: Autocomplete
description: Samples that show how to provide autocomplete options for a parameter.
icon: material/form-dropdown
---

# Autocomplete samples

Autocomplete can be configured for a parameter to provide a defined set of options for the user to select from. You can can pass either a static array or use a function to dynamically generate the options.


[Learn More](../../../guides/basics/parameters/autocomplete){ .md-button }

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
        throw new coda.UserVisibleError("Unknown animal: " + animal);
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
      autocomplete: async function (context, search, parameters) {
        let url = coda.withQueryParams(
          "https://api.boardgameatlas.com/api/search",
          { fuzzy_match: true, name: search });
        let response = await context.fetcher.fetch({ method: "GET", url: url });
        let results = response.body.games;
        // Generate an array of autocomplete objects, using the game's name as
        // the label and its ID for the value.
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
      autocomplete: async function (context, search, { language }) {
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

