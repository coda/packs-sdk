---
title: Data types
---

# Data type samples

Packs can return various types of values, and apply hints that tell Coda how to display that data. Formulas and schema properties must declare the these types upfront, and the values you return in your code must match.


[Learn More](../../../guides/basics/data-types){ .md-button }

## Template (String)
The basic structure of a formula that returns a string.

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
## Template (Number)
The basic structure of a formula that returns a number.

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
  resultType: coda.ValueType.Number,
  execute: async function ([param], context) {
    return param.length;
  },
});
```
## Template (boolean)
The basic structure of a formula that returns a boolean.

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
  resultType: coda.ValueType.Boolean,
  execute: async function ([param], context) {
    return param === "true";
  },
});
```
## Template (Array)
The basic structure of a formula that returns an array.

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
  resultType: coda.ValueType.Array,
  items: {
    type: coda.ValueType.String,
  },
  execute: async function ([param], context) {
    return ["Hello", param];
  },
});
```
## Template (Object)
The basic structure of a formula that returns an object.

```ts
const MySchema = coda.makeObjectSchema({
  properties: {
    property1: {type: coda.ValueType.Number},
    property2: {type: coda.ValueType.String},
    // Add more properties here.
  },
  id: "property1", // Which property above is a unique ID.
  primary: "property2", // Which property above to display by default.
  identity: {
    name: "<User-visible name>",
  },
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
      property1: 123,
      property2: param,
    };
  },
});
```
## Markdown
A formula that returns markdown content. This sample returns the contents of the README.md file from a GitHub repository.

```ts
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
      defaultValue: "coda/packs-sdk"
    }),
  ],
  resultType: coda.ValueType.String,
  codaType: coda.ValueHintType.Markdown,
  execute: async function ([repo], context) {
    let url = `https://raw.githubusercontent.com/${repo}/HEAD/README.md`
    let result = await context.fetcher.fetch({
      method: "GET",
      url: url,
    });
    return result.body;
  },
});

pack.addNetworkDomain("raw.githubusercontent.com");
```
## HTML
A formula that returns HTML content. This sample returns HTML with every word of the input string bolded.

```ts
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
      if (i % 2 == 0) {
        words[i] = `<b>${words[i]}</b>`
      }
    }
    return words.join(" ");
  },
});
```

