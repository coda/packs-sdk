import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Greet someone in their language, with the greeting autocomplete adjusting
// based on the language selected.
pack.addFormula({
  name: "Greeting",
  description: "Greet someone.",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "language",
      description: "The language to greet them in.",
      autocomplete: [
        { display: "English", value: "en" },
        { display: "Spanish", value: "es" },
      ],
    }),
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "greeting",
      description: "The greeting to use.",
      autocomplete: async function (context, search, { language }) {
        let options;
        if (language === "es") {
          options = ["Hola", "Buenos días"];
        } else {
          options = ["Hello", "Howdy"];
        }
        return coda.simpleAutocomplete(search, options);
      },
    }),
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "name",
      description: "The name to greet.",
    }),
  ],
  resultType: coda.ValueType.String,
  connectionRequirement: coda.ConnectionRequirement.None,
  execute: async function ([language, greeting, name], context) {
    let result = greeting + " " + name + "!";
    if (language === "es") {
      // Add upside-down exclamation point in the front.
      result = "¡" + result;
    }
    return result;
  },
});
