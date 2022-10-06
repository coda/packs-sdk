/* eslint-disable @typescript-eslint/no-unused-vars */
// BEGIN
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Schema that defines the a spell object.
let SpellSchema = coda.makeObjectSchema({
  type: coda.ValueType.Object,
  properties: {
    name: {
      description: "The spell name.",
      type: coda.ValueType.String,
    },
    description: {
      description: "A description of the spell.",
      type: coda.ValueType.String,
    },
    higher_level: {
      description: "A description for casting the spell at a higher level.",
      type: coda.ValueType.String,
    },
    level: {
      description: "The level of the spell.",
      type: coda.ValueType.Number,
    },
    range: {
      description: "The range of the spell.",
      type: coda.ValueType.String,
    },
    material: {
      description: "The material component for the spell to be cast.",
      type: coda.ValueType.String,
    },
    duration: {
      description: "How long the spell effect lasts.",
      type: coda.ValueType.String,
      // Not using the Duration value hint, since this can contain values like
      // "Instantaneous".
    },
    casting_time: {
      description: "How long it takes for the spell to activate.",
      type: coda.ValueType.String,
      // Not using the Duration value hint, since this can contain values like
      // "1 action".
    },
    attack_type: {
      description: "The attack type of the spell.",
      type: coda.ValueType.String,
    },
    damage_type: {
      description: "The damage type of the spell.",
      type: coda.ValueType.String,
    },
    index: {
      description: "A unique identifier for the spell.",
      type: coda.ValueType.String,
    },
  },
  displayProperty: "name",
  idProperty: "index",
  featuredProperties: ["description", "level", "range"],
});
