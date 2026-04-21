/* eslint-disable @typescript-eslint/no-unused-vars */
// BEGIN
import * as sdk from "@codahq/packs-sdk";
export const pack = sdk.newPack();

// Schema that defines a spell object.
let SpellSchema = sdk.makeObjectSchema({
  type: sdk.ValueType.Object,
  properties: {
    name: {
      description: "The spell name.",
      type: sdk.ValueType.String,
    },
    description: {
      description: "A description of the spell.",
      type: sdk.ValueType.String,
    },
    higher_level: {
      description: "A description for casting the spell at a higher level.",
      type: sdk.ValueType.String,
    },
    level: {
      description: "The level of the spell.",
      type: sdk.ValueType.Number,
    },
    range: {
      description: "The range of the spell.",
      type: sdk.ValueType.String,
    },
    material: {
      description: "The material component for the spell to be cast.",
      type: sdk.ValueType.String,
    },
    duration: {
      description: "How long the spell effect lasts.",
      type: sdk.ValueType.String,
      // Not using the Duration value hint, since this can contain values like
      // "Instantaneous".
    },
    casting_time: {
      description: "How long it takes for the spell to activate.",
      type: sdk.ValueType.String,
      // Not using the Duration value hint, since this can contain values like
      // "1 action".
    },
    attack_type: {
      description: "The attack type of the spell.",
      type: sdk.ValueType.String,
    },
    damage_type: {
      description: "The damage type of the spell.",
      type: sdk.ValueType.String,
    },
    index: {
      description: "A unique identifier for the spell.",
      type: sdk.ValueType.String,
    },
  },
  displayProperty: "name",
  idProperty: "index",
  featuredProperties: ["description", "level", "range"],
});
