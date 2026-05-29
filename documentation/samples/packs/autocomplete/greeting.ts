import * as sdk from "@codahq/packs-sdk";
export const pack = sdk.newPack();

// Greet someone in their language, with the greeting autocomplete adjusting
// based on the language selected.
pack.addFormula({
  name: "Greeting",
  description: "Greet someone.",
  parameters: [
    sdk.makeParameter({
      type: sdk.ParameterType.String,
      name: "language",
      description: "The language to greet them in.",
      autocomplete: [
        { display: "English", value: "en" },
        { display: "Spanish", value: "es" },
      ],
    }),
    sdk.makeParameter({
      type: sdk.ParameterType.String,
      name: "greeting",
      description: "The greeting to use.",
      autocomplete: async function (context, search, { language }) {
        let options;
        if (language === "es") {
          options = ["Hola", "Buenos días"];
        } else {
          options = ["Hello", "Howdy"];
        }
        return sdk.simpleAutocomplete(search, options);
      },
    }),
    sdk.makeParameter({
      type: sdk.ParameterType.String,
      name: "name",
      description: "The name to greet.",
    }),
  ],
  resultType: sdk.ValueType.String,
  connectionRequirement: sdk.ConnectionRequirement.None,
  execute: async function ([language, greeting, name], context) {
    let result = greeting + " " + name + "!";
    if (language === "es") {
      // Add upside-down exclamation point in the front.
      result = "¡" + result;
    }
    return result;
  },
});
