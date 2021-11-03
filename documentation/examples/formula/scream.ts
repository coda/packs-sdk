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
      defaultValue: 3,
    }),
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "character",
      description: "The character to repeat.",
      optional: true,
      defaultValue: "!",
    }),
  ],
  resultType: coda.ValueType.String,
  execute: async function ([text, volume = 3, character = "!"], context) {
    return text.toUpperCase() + character.repeat(volume);
  },
});
