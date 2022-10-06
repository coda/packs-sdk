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
