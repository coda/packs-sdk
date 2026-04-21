---
nav: Autocomplete
description: Samples that show how to provide autocomplete options for a parameter.
icon: material/form-dropdown
---

# Autocomplete samples

Autocomplete can be configured for a parameter to provide a defined set of options for the user to select from. You can pass either a static array or use a function to dynamically generate the options.


[Learn More](../../guides/basics/parameters/autocomplete.md){ .md-button }

## Simple autocomplete
A formula with a parameter that provides autocomplete for acceptable values. This sample returns the noise that an animal makes, for a limited set of animals.

```ts
{% raw %}
import * as sdk from "@codahq/packs-sdk";
export const pack = sdk.newPack();

// Returns the noise an animal makes. Ex) "cow" => "moo".
pack.addFormula({
  name: "AnimalNoise",
  description: "Gets the noise than an animal makes.",
  parameters: [
    sdk.makeParameter({
      type: sdk.ParameterType.String,
      name: "animal",
      description: "The selected animal.",
      autocomplete: ["cow", "pig", "sheep"],
    }),
  ],
  resultType: sdk.ValueType.String,
  execute: async function ([animal], context) {
    switch (animal) {
      case "cow":
        return "moo";
      case "pig":
        return "oink";
      case "sheep":
        return "baa";
      default:
        throw new sdk.UserVisibleError("Unknown animal: " + animal);
    }
  },
});
{% endraw %}
```
## Dynamic autocomplete
A formula with a parameter that provides autocomplete for acceptable values, where the options are pulled dynamically from an API. This sample returns the price for a board game listed on the site Board Game Atlas.

```ts
{% raw %}
import * as sdk from "@codahq/packs-sdk";
export const pack = sdk.newPack();

// Gets the price of a board game by ID, with autocomplete on the ID.
pack.addFormula({
  name: "GetPrice",
  description: "Gets the price of a board game.",
  parameters: [
    sdk.makeParameter({
      type: sdk.ParameterType.String,
      name: "gameId",
      description: "The ID of the game on boardgameatlas.com",
      autocomplete: async function (context, search, parameters) {
        let url = sdk.withQueryParams(
          "https://api.boardgameatlas.com/api/search",
          { fuzzy_match: true, name: search });
        let response = await context.fetcher.fetch({ method: "GET", url: url });
        let results = response.body.games;
        // Generate an array of autocomplete objects, using the game's name as
        // the label and its ID for the value.
        return sdk.autocompleteSearchObjects(search, results, "name", "id");
      },
    }),
  ],
  resultType: sdk.ValueType.Number,
  codaType: sdk.ValueHintType.Currency,
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
  type: sdk.AuthenticationType.QueryParamToken,
  paramName: "client_id",
});
{% endraw %}
```
## Autocomplete on previous parameter
A formula with a parameter that provides autocomplete for acceptable values, where the options depend on the value of a previous parameter. This sample generates a greeting in either English or Spanish.

```ts
{% raw %}
import * as sdk from "@codahq/packs-sdk";
export const pack = sdk.newPack();

// Greet someone in their language, with the greeting autocomplete adjusting
// based on the language selected.
pack.addFormula({
  name: "Greeting",
  description: "Greet someone.",
  parameters: [
    sdk.makeParameter({
      type: sdk.ParameterType.String,
      name: "language",
      description: "The language to greet them in.",
      autocomplete: [
        { display: "English", value: "en" },
        { display: "Spanish", value: "es" },
      ],
    }),
    sdk.makeParameter({
      type: sdk.ParameterType.String,
      name: "greeting",
      description: "The greeting to use.",
      autocomplete: async function (context, search, { language }) {
        let options;
        if (language === "es") {
          options = ["Hola", "Buenos días"];
        } else {
          options = ["Hello", "Howdy"];
        }
        return sdk.simpleAutocomplete(search, options);
      },
    }),
    sdk.makeParameter({
      type: sdk.ParameterType.String,
      name: "name",
      description: "The name to greet.",
    }),
  ],
  resultType: sdk.ValueType.String,
  connectionRequirement: sdk.ConnectionRequirement.None,
  execute: async function ([language, greeting, name], context) {
    let result = greeting + " " + name + "!";
    if (language === "es") {
      // Add upside-down exclamation point in the front.
      result = "¡" + result;
    }
    return result;
  },
});
{% endraw %}
```
## Autocomplete on vararg key-value pairs
A formula with vararg parameters that represent key-value pairs, which provides autocomplete for available keys and for acceptable values based on the selected key. This sample generates a fictitious ice cream order. Note: This technique will not work when using vararg parameters in the builder UIs.

```ts
{% raw %}
import * as sdk from "@codahq/packs-sdk";
export const pack = sdk.newPack();

// Generates a fictitious ice cream order, using a flexible set of choices.
pack.addFormula({
  name: "OrderIcecream",
  description: "Put in your ice cream order.",
  parameters: [
    sdk.makeParameter({
      type: sdk.ParameterType.Number,
      name: "scoops",
      description: "How many scoops do you want?",
    }),
  ],
  varargParameters: [
    sdk.makeParameter({
      type: sdk.ParameterType.String,
      name: "choice",
      description: "Which choice to set.",
      autocomplete: ["flavor", "topping", "vessel"],
    }),
    sdk.makeParameter({
      type: sdk.ParameterType.String,
      name: "value",
      description: "The value of that choice.",
      autocomplete: async function (context, search, params) {
        switch (params.choice) {
          case "flavor":
            return ["vanilla", "chocolate", "strawberry"];
          case "topping":
            return ["sprinkles", "whipped cream", "chocolate shell"];
          case "vessel":
            return ["cone", "cup"];
          default:
            return [];
        }
      },
    }),
  ],
  resultType: sdk.ValueType.String,
  execute: async function ([scoops, ...args], context) {
    let result = `${scoops}: scoops`;
    let choice, value;
    while (args.length > 0) {
      [choice, value, ...args] = args;
      result += `, ${choice}: ${value}`;
    }
    return result;
  },
});
{% endraw %}
```

