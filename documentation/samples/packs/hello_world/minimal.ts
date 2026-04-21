import * as sdk from "@codahq/packs-sdk";
export const pack = sdk.newPack();

// Say Hello to the given name.
pack.addFormula({
  name: "Hello",
  description: "A Hello World example.",
  parameters: [
    sdk.makeParameter({
      type: sdk.ParameterType.String,
      name: "name",
      description: "The person's name you would like to say hello to.",
    }),
  ],
  resultType: sdk.ValueType.String,
  execute: async function ([name]) {
    return "Hello " + name + "!";
  },
});
