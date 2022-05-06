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
