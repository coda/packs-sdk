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
