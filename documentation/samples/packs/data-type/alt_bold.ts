import * as sdk from "@codahq/packs-sdk";
export const pack = sdk.newPack();

// Returns HTML with every other word of the input text bolded.
pack.addFormula({
  name: "AlternatingBold",
  description: "Bold every other word.",
  parameters: [
    sdk.makeParameter({
      type: sdk.ParameterType.String,
      name: "text",
      description: "The text to bold.",
    }),
  ],
  resultType: sdk.ValueType.String,
  hintType: sdk.ValueHintType.Html,
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
