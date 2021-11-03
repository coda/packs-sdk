import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Returns the noise an animal makes. Ex) "cow" => "moo".
pack.addFormula({
  name: "AnimalNoise",
  description: "Gets the noise than an animal makes.",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "animal",
      description: "The selected animal.",
      autocomplete: ["cow", "pig", "sheep"],
    }),
  ],
  resultType: coda.ValueType.String,
  execute: async function ([animal], context) {
    switch (animal) {
      case "cow":
        return "moo";
      case "pig":
        return "oink";
      case "sheep":
        return "baa";
      default:
        throw new coda.UserVisibleError("Unknown animal: " + animal);
    }
  },
});
