---
title: Parameters
---

# Parameter samples

Coda formulas, actions, and sync tables receive take in user input via parameters. They are required by default, but can by made optional. Variable argument (vararg) parameters can be used to allow for parameters to be set more than once.


[Learn More](../../../guides/basics/parameters){ .md-button }

## Template
The basic structure of a parameter. This sample is for a string parameter.

```ts
coda.makeParameter({
  type: coda.ParameterType.String,
  name: "<User-visible name of parameter>",
  description: "<Help text for the parameter>",
}),
```
## No parameters
A formula without any parameters. This sample returns the name of the current day of the week.

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
    let formatter = Intl.DateTimeFormat("us-US", {weekday: "long"});
    return formatter.format(now);
  },
});
```
## Optional parameters
A formula with some required and some optional parameters. This sample formats text to look like screaming, with a optional parameters to override how many exclamation points to use and an alternate character to use.

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
    }),
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "character",
      description: "The character to repeat.",
      optional: true,
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
      let label; let step;
      // Pull the first set of varargs off the list, and leave the rest.
      [label, step, ...varargs] = varargs;
      result += ` --${label}--> ${step}`;
    }
    return result;
  },
});
```

