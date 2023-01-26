---
nav: Parameters
description: Samples that show how to accept parameters from the user.
icon: material/format-textbox
---

# Parameter samples

Coda formulas, actions, and sync tables receive take in user input via parameters. They are required by default, but can by made optional. Variable argument (vararg) parameters can be used to allow for parameters to be set more than once.


[Learn More](../../../guides/basics/parameters){ .md-button }

## Template
The basic structure of a parameter. This sample is for a string parameter.

```ts
{% raw %}
coda.makeParameter({
  type: coda.ParameterType.String,
  name: "<User-visible name of parameter>",
  description: "<Help text for the parameter>",
}),
{% endraw %}
```
## No parameters
A formula without any parameters. This sample returns the name of the current day of the week.

```ts
{% raw %}
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
    let formatter = Intl.DateTimeFormat("us-US", {
      timeZone: context.timezone,
      weekday: "long",
    });
    return formatter.format(now);
  },
});
{% endraw %}
```
## String parameter
A formula that takes plain text as a parameter. This sample returns a greeting to the name provided.

```ts
{% raw %}
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Say Hello to the given name.
pack.addFormula({
  name: "Hello",
  description: "A Hello World example.",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "name",
      description: "The person's name you would like to say hello to.",
    }),
  ],
  resultType: coda.ValueType.String,
  execute: async function ([name]) {
    return "Hello " + name + "!";
  },
});
{% endraw %}
```
## Number parameter
A formula that takes a number as a parameter. This sample converts a number of slices of pizza into a percentage eaten.

```ts
{% raw %}
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Formula that converts slices of a pizza into a percentage eaten.
pack.addFormula({
  name: "PizzaEaten",
  description: "Calculates what percentage of a pizza was eaten.",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.Number,
      name: "slices",
      description: "How many slices were eaten.",
    }),
  ],
  resultType: coda.ValueType.Number,
  codaType: coda.ValueHintType.Percent,
  execute: async function ([slices], context) {
    return slices / 8;
  },
});
{% endraw %}
```
## Date parameter
A formula that takes a date as a parameter. This sample determines if the year of a given date would make for good New Years Eve glasses (has two or more zeros).

```ts
{% raw %}
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

pack.addFormula({
  name: "GoodNYEGlasses",
  description: "Determines if a date is good for New Years Eve glasses " +
    "(the year contains two zeros).",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.Date,
      name: "date",
      description: "The input date.",
    }),
  ],
  resultType: coda.ValueType.Boolean,
  execute: async function ([date], context) {
    // Format the JavaScript Date into a four-digit year.
    let formatted = date.toLocaleDateString("en", {
      timeZone: context.timezone, // Use the timezone of the doc (important!).
      year: "numeric",
    });
    // Extract all of the zeros from the year.
    let zeros = formatted.match(/0/g);
    return zeros?.length >= 2;
  },
});
{% endraw %}
```
## Image parameter
A formula that takes an image as a parameter. This sample returns the file size of an image.

```ts
{% raw %}
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Regular expression that matches Coda-hosted images.
const HostedImageUrlRegex = new RegExp("^https://(?:[^/]*\.)?codahosted.io/.*");

// Formula that calculates the file size of an image.
pack.addFormula({
  name: "FileSize",
  description: "Gets the file size of an image, in bytes.",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.Image,
      name: "image",
      description:
        "The image to operate on. Not compatible with Image URL columns.",
    }),
  ],
  resultType: coda.ValueType.Number,
  execute: async function ([imageUrl], context) {
    // Throw an error if the image isn't Coda-hosted. Image URL columns can
    // contain images on any domain, but by default Packs can only access image
    // attachments hosted on codahosted.io.
    if (!imageUrl.match(HostedImageUrlRegex)) {
      throw new coda.UserVisibleError("Not compatible with Image URL columns.");
    }
    // Fetch the image content.
    let response = await context.fetcher.fetch({
      method: "GET",
      url: imageUrl,
      isBinaryResponse: true, // Required when fetching binary content.
    });
    // The binary content of the response is returned as a Node.js Buffer.
    // See: https://nodejs.org/api/buffer.html
    let buffer = response.body as Buffer;
    // Return the length, in bytes.
    return buffer.length;
  },
});
{% endraw %}
```
## Array parameter
A formula that takes a string array as a parameter. This sample returns the longest string in the list.

```ts
{% raw %}
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

pack.addFormula({
  name: "Longest",
  description: "Given a list of strings, returns the longest one.",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.StringArray,
      name: "strings",
      description: "The input strings.",
    }),
  ],
  resultType: coda.ValueType.String,
  execute: async function ([strings], context) {
    if (strings.length === 0) {
      throw new coda.UserVisibleError("No options provided.");
    }
    let result;
    for (let str of strings) {
      if (!result || str.length > result.length) {
        result = str;
      }
    }
    return result;
  },
});
{% endraw %}
```
## Sparse array parameter
A formula that takes sparse number arrays as a parameter, useful when passing table columns. This sample returns the total cost for an order of items.

```ts
{% raw %}
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

pack.addFormula({
  name: "TotalCost",
  description: "Calculates the total cost for an order.",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.SparseNumberArray,
      name: "prices",
      description: "The prices for each item.",
    }),
    coda.makeParameter({
      type: coda.ParameterType.SparseNumberArray,
      name: "quantities",
      description: "The quantities of each item. Default: 1.",
      optional: true,
    }),
    coda.makeParameter({
      type: coda.ParameterType.SparseNumberArray,
      name: "taxRates",
      description: "The tax rates for each item. Default: 0.",
      optional: true,
    }),
  ],
  resultType: coda.ValueType.Number,
  codaType: coda.ValueHintType.Currency,
  execute: async function ([prices, quantities=[], taxRates=[]], context) {
    if ((quantities.length > 0 && quantities.length !== prices.length) ||
        (taxRates.length > 0 && taxRates.length !== prices.length)) {
      throw new coda.UserVisibleError("All lists must be the same length.");
    }
    let result = 0;
    for (let i = 0; i < prices.length; i++) {
      let price = prices[i];
      let quantity = quantities[i];
      let taxRate = taxRates[i];
      if (price == null) {
        // If the price is blank, continue on to the next row.
        continue;
      }
      if (quantity != null) {
        price *= quantity;
      }
      if (taxRate != null) {
        price += price * taxRate;
      }
      result += price;
    }
    return result;
  },
});
{% endraw %}
```
## Optional parameters
A formula with some required and some optional parameters. This sample formats text to look like screaming, with a optional parameters to override how many exclamation points to use and an alternate character to use.

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
## Parameter suggested value
A formula with a parameter that defines a suggested value. This sample rolls virtual dice and returns the results.

```ts
{% raw %}
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
{% endraw %}
```
## Variable argument parameters
A formula that accepts a variable number of arguments. This sample draws a simple diagram using text, with an unknown number of arrow labels and steps.

```ts
{% raw %}
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
{% endraw %}
```
## Reusing parameters
A Pack that reuses a parameter across multiple formulas. This sample includes mathematical formulas that operate on a list of numbers.

```ts
{% raw %}
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// A "numbers" parameter shared by both formulas.
const NumbersParameter = coda.makeParameter({
  type: coda.ParameterType.NumberArray,
  name: "numbers",
  description: "The numbers to perform the calculation on.",
});

pack.addFormula({
  name: "GCD",
  description: "Returns the greatest common divisor for a list of numbers.",
  parameters: [
    // Use the shared parameter created above.
    NumbersParameter,
  ],
  resultType: coda.ValueType.Number,
  execute: async function ([numbers]) {
    // Handle the error case where the list is empty.
    if (numbers.length === 0) {
      throw new coda.UserVisibleError("The list cannot be empty.");
    }

    // Handle the error case where all the numbers are zeros.
    if (numbers.every(number => number === 0)) {
      throw new coda.UserVisibleError(
        "The list must contain a non-zero number.");
    }

    let result = numbers[0];
    for (let i = 1; i < numbers.length; i++) {
      let number = numbers[i];
      result = gcd(number, result);
    }
    return result;
  },
});

pack.addFormula({
  name: "LCM",
  description: "Returns the least common multiple for a list of numbers.",
  parameters: [
    // Use the shared parameter created above.
    NumbersParameter,
  ],
  resultType: coda.ValueType.Number,
  execute: async function ([numbers]) {
    // Handle the error case where the list is empty.
    if (numbers.length === 0) {
      throw new coda.UserVisibleError("The list cannot be empty.");
    }

    // Handle the error case where the list contains a zero.
    if (numbers.some(number => number === 0)) {
      throw new coda.UserVisibleError("The list must not contain a zero.");
    }

    let result = numbers[0];
    for (let i = 1; i < numbers.length; i++) {
      let number = numbers[i];
      result = Math.abs(number * result) / gcd(number, result);
    }
    return result;
  },
});

// Helper function that calculates the greatest common divisor of two
// numbers.
function gcd(a, b) {
  if (a === 0) {
    return b;
  }
  return gcd(b % a, a);
}
{% endraw %}
```

