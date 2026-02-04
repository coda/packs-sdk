---
nav: Autocomplete
description: Simplify entering parameters by providing choices users can select from.
---

# Autocomplete parameter options

If you have a parameter that accepts a defined set of values it's usually best to provide those options using autocomplete. These options are presented to the user in the Coda UI and they can simply click on one instead of entering the value manually. Autocomplete can be used with `String` and `Number` parameters.

[View Sample Code][samples]{ .md-button }


## Using autocomplete

In the formula editor, parameter options show up in the same pane used for the autocompletion of built-in elements of the Coda Formula Language. In the actions builder and sync table settings options are presented in a drop down.

=== "In the formula editor"
    <img src="site:images/autocomplete_formula.png" srcset="site:images/autocomplete_formula_2x.png 2x" class="screenshot" alt="Autocomplete in the formula editor">
=== "In the action builder"
    <img src="site:images/autocomplete_action.png" srcset="site:images/autocomplete_action_2x.png 2x" class="screenshot" alt="Autocomplete in the action builder">
=== "In the sync table settings"
    <img src="site:images/autocomplete_sync.png" srcset="site:images/autocomplete_sync_2x.png 2x" class="screenshot" alt="Autocomplete in the sync table settings">


## Simple options

The simplest way to set this up is to set the `autocomplete` property of the parameter to an array of valid options.

```ts
coda.makeParameter({
  type: coda.ParameterType.String,
  name: "animal",
  description: "The selected animal.",
  autocomplete: ["cow", "pig", "sheep"],
});
```


## Custom labels

If you want the options to have a different label you can provide an array of [`SimpleAutocompleteOption`][SimpleAutocompleteOption] objects, each containing a `display` and `value` property. The `display` label will be what's shown in the list of choices, but once they select a choice it will be replaced by the `value` which is what is passed into your `execute` function.

```ts
coda.makeParameter({
  type: coda.ParameterType.String,
  name: "animal",
  description: "The selected animal.",
  autocomplete: [
    { display: "Friendly Cow", value: "cow" },
    { display: "Messy Pig", value: "pig" },
    { display: "Quiet Sheep", value: "sheep" },
  ],
});
```

The values can be either strings or numbers, and should match the type of the parameter.


## Dynamic options

When the autocomplete options can't be known upfront you can instead use a function to generate them dynamically. Define an `autocomplete` function that returns an array of autocomplete objects, usually generated from the results of an API call. The function has access to the formula context (and fetcher) as well as the user's current input for the parameter, which you can use to filter the results. The helper function [`coda.autocompleteSearchObjects`][autocompleteSearchObjects] is useful for converting an API response into an array of [`SimpleAutocompleteOption`][SimpleAutocompleteOption] objects.

```ts
coda.makeParameter({
  type: coda.ParameterType.String,
  name: "gameId",
  description: "The ID of the game on boardgameatlas.com",
  autocomplete: async function(context, search) {
    let url = coda.withQueryParams(
      "https://api.boardgameatlas.com/api/search",
      { fuzzy_match: true, name: search });
    let response = await context.fetcher.fetch({ method: "GET", url: url });
    let results = response.body.games;
    // Generate an array of autocomplete objects, using the game's name as the
    // label and its ID for the value.
    return coda.autocompleteSearchObjects(search, results, "name", "id");
  },
});
```


## Accessing previous parameter values {: #parameters}

The `autocomplete` function also has access to the values entered for previous parameters. Unlike in the `execute` function where these are passed in as an array and accessed by position, in `autocomplete` functions they are passed as an object of key/value pairs and accessed by name.

```ts
const LanguageParameter = coda.makeParameter({
  type: coda.ParameterType.String,
  name: "language",
  description: "The language to use.",
  autocomplete: [
    { display: "English", value: "en" },
    { display: "Spanish", value: "es" },
  ],
});

const GreetingParameter = coda.makeParameter({
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
});
```

??? info "Object destructuring"
    In the code above we used [object destructuring][destructuring_assignment] to pull values out of the parameters object and assign them to variables. You could alternatively do that within the body of the `autocomplete` function.

    ```ts
    autocomplete: async function (context, search, parameters) {
      let language = parameters.language;
      // ...
    },
    ```

!!! warning "Manual refresh required for `StringArray` parameters"
    When using `StringArray` parameters in the builder UIs, the autocomplete values are only fetched once when the parameter UI is loaded. The autocomplete options can be manually refreshed by the user with a menu item, but this limitation doesn't make them a great fit for use cases where the options depend on the values of previous parameters. <!-- o/bug/25402 -->

    <img src="site:images/autocomplete_list_refresh.png" srcset="site:images/autocomplete_list_refresh_2x.png 2x" class="screenshot" alt="Autocomplete of list parameters requires manual refresh">

!!! bug "Previous vararg values not available"
    When using [vararg parameters][parameters_vararg] in the builder UIs, the autocomplete function will not be able to access the values of previous vararg parameters. This means it isn't possible to build a set of key/value vararg parameters where the possible values depend on the key selected. <!-- o/bug/25373 -->


## Validation

Users are not forced to select one of the provided autocomplete options and may instead enter their own custom value. If your formula logic requires that the user only select from the autocomplete options you will need to add code to validate the parameter value.

```ts
const AnimalOptions = ["cow", "pig", "sheep"];

pack.addFormula({
  // ...
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "animal",
      description: "The selected animal.",
      autocomplete: AnimalOptions,
    }),
  ],
  // ...
  execute: async function([animal], context) {
    if (!AnimalOptions.includes(animal)) {
      throw new coda.UserVisibleError("Unknown animal: " + animal);
    }
  },
});
```


[samples]: ../../../samples/topic/autocomplete.md
[destructuring_assignment]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
[SimpleAutocompleteOption]: ../../../reference/sdk/core/interfaces/SimpleAutocompleteOption.md
[autocompleteSearchObjects]: ../../../reference/sdk/core/functions/autocompleteSearchObjects.md
[parameters_vararg]: index.md#vararg
