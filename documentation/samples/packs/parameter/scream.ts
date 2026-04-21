import * as sdk from "@codahq/packs-sdk";
export const pack = sdk.newPack();

// Formats text to look like screaming. For example, "Hello" => "HELLO!!!".
pack.addFormula({
  name: "Scream",
  description: "Make text uppercase and add exclamation points.",
  parameters: [
    sdk.makeParameter({
      type: sdk.ParameterType.String,
      name: "text",
      description: "The text to scream.",
    }),
    sdk.makeParameter({
      type: sdk.ParameterType.Number,
      name: "volume",
      description: "The number of exclamation points to add.",
      optional: true,
    }),
    sdk.makeParameter({
      type: sdk.ParameterType.String,
      name: "character",
      description: "The character to repeat.",
      optional: true,
    }),
  ],
  resultType: sdk.ValueType.String,
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
