import * as sdk from "@codahq/packs-sdk";
export const pack = sdk.newPack();

pack.addFormula({
  name: "Longest",
  description: "Given a list of strings, returns the longest one.",
  parameters: [
    sdk.makeParameter({
      type: sdk.ParameterType.StringArray,
      name: "strings",
      description: "The input strings.",
    }),
  ],
  resultType: sdk.ValueType.String,
  execute: async function ([strings], context) {
    if (strings.length === 0) {
      throw new sdk.UserVisibleError("No options provided.");
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
