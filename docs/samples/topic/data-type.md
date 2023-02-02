---
nav: Data types
description: Samples that show how to return values of various data types.
icon: material/order-alphabetical-ascending
---

# Data type samples

Packs can return various types of values, and apply hints that tell Coda how to display that data. Formulas and schema properties must declare the these types upfront, and the values you return in your code must match.


[Learn More](../../../guides/basics/data-types){ .md-button }

## Template (String)
The basic structure of a formula that returns a string.

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
## Template (Number)
The basic structure of a formula that returns a number.

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
  resultType: coda.ValueType.Number,
  execute: async function ([param], context) {
    return param.length;
  },
});
{% endraw %}
```
## Template (Boolean)
The basic structure of a formula that returns a boolean.

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
  resultType: coda.ValueType.Boolean,
  execute: async function ([param], context) {
    return param === "true";
  },
});
{% endraw %}
```
## Template (Array)
The basic structure of a formula that returns an array.

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
  resultType: coda.ValueType.Array,
  items: coda.makeSchema({
    type: coda.ValueType.String,
  }),
  execute: async function ([param], context) {
    return ["Hello", param];
  },
});
{% endraw %}
```
## Template (Object)
The basic structure of a formula that returns an object.

```ts
{% raw %}
const MySchema = coda.makeObjectSchema({
  properties: {
    property1: { type: coda.ValueType.String },
    property2: { type: coda.ValueType.Number },
    // Add more properties here.
  },
  displayProperty: "property1", // Which property above to display by default.
});

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
  resultType: coda.ValueType.Object,
  schema: MySchema,
  execute: async function ([param], context) {
    return {
      property1: param,
      property2: 123,

    };
  },
});
{% endraw %}
```
## Percent
A formula that returns a number formatted as a percent value. This sample converts a number of slices of pizza into a percentage eaten.

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
## Currency
A formula that returns a number formatted as a currency value. This sample converts from another currency to US dollars.

```ts
{% raw %}
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

pack.addNetworkDomain("exchangerate.host");

pack.addFormula({
  name: "ToUSD",
  description: "Convert from a different currency to US dollars.",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.Number,
      name: "amount",
      description: "The amount to convert.",
    }),
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "from",
      description: "The currency to convert from.",
    }),
  ],
  resultType: coda.ValueType.Number,
  schema: {
    type: coda.ValueType.Number,
    codaType: coda.ValueHintType.Currency,
    // Ensure the currency symbol displayed with the result is "$".
    currencyCode: "USD",
    // Only show two decimal places (no fractional pennies).
    precision: 2,
  },
  execute: async function ([amount, from], context) {
    let url = coda.withQueryParams("https://api.exchangerate.host/latest", {
      base: from,
      amount: amount,
    });
    let response = await context.fetcher.fetch({
      method: "GET",
      url: url,
    });
    let rates = response.body.rates;
    return rates.USD;
  },
});
{% endraw %}
```
## Date and time
A formula that returns a date and time, passed as a string. This sample adds five minutes onto the given date and time.

```ts
{% raw %}
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Formula that adds five minutes to an input date and time.
pack.addFormula({
  name: "FiveMinsLate",
  description: "Adds five minutes to the input date and time.",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.Date,
      name: "input",
      description: "The input date and time.",
    }),
  ],
  // Return the result as the number of seconds since the epoch.
  resultType: coda.ValueType.Number,
  codaType: coda.ValueHintType.Time,
  execute: async function ([input], context) {
    let seconds = input.getTime() / 1000;
    seconds += 5 * 60; // Add five minutes, as seconds.
    return seconds;
  },
});
{% endraw %}
```
## Markdown
A formula that returns markdown content. This sample returns the contents of the README.md file from a GitHub repository.

```ts
{% raw %}
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Returns the contents of GitHub repo's README.md file as markdown.
pack.addFormula({
  name: "GetReadme",
  description: "Gets the content of a GitHub repo's README.md file.",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "repo",
      description: "The repo to read from.",
      suggestedValue: "coda/packs-sdk",
    }),
  ],
  resultType: coda.ValueType.String,
  codaType: coda.ValueHintType.Markdown,
  execute: async function ([repo], context) {
    let url = `https://raw.githubusercontent.com/${repo}/HEAD/README.md`;
    let result = await context.fetcher.fetch({
      method: "GET",
      url: url,
    });
    return result.body;
  },
});

pack.addNetworkDomain("raw.githubusercontent.com");
{% endraw %}
```
## HTML
A formula that returns HTML content. This sample returns HTML with every word of the input string bolded.

```ts
{% raw %}
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Returns HTML with every other word of the input text bolded.
pack.addFormula({
  name: "AlternatingBold",
  description: "Bold every other word.",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "text",
      description: "The text to bold.",
    }),
  ],
  resultType: coda.ValueType.String,
  codaType: coda.ValueHintType.Html,
  execute: async function ([text], context) {
    let words = text.split(" ");
    for (let i = 0; i < words.length; i++) {
      if (i % 2 === 0) {
        words[i] = `<b>${words[i]}</b>`;
      }
    }
    return words.join(" ");
  },
});
{% endraw %}
```
## Embed
A formula that a URL to embed. This sample returns an embed of the infamous YouTube video for &quot;Never Gonna Give You Up&quot; by Rick Astley.

```ts
{% raw %}
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Returns the infamous YouTube video by Rick Astley as an embed.
pack.addFormula({
  name: "Rickroll",
  description: "Embeds the video \"Never Gonna Give You Up\".",
  parameters: [],
  resultType: coda.ValueType.String,
  codaType: coda.ValueHintType.Embed,
  execute: async function ([], context) {
    return "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
  },
});
{% endraw %}
```
## Image
A formula that returns an image, as a reference. This sample returns a random photo of a cat.

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

