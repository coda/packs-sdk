import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// A schema defining the card, including all of metadata what specifically to
// highlight in the card.
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
  // Sync table fields.
  idProperty: "index",
  featuredProperties: ["description", "level", "range"],
  // Card fields.
  subtitleProperties: [
    "level",
    "range",
    "duration",
    "damage_type",
  ],
  snippetProperty: "description",
});

// Formula that renders a card for a spell given it's name. This will be shown
// a "Card" in the Pack's list of building blocks, but is also a regular formula
// that can be used elsewhere.
pack.addFormula({
  name: "Spell",
  description: "Gets information about a spell, given its name.",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "name",
      description: "The name of the spell.",
      suggestedValue: "Acid Arrow",
    }),
  ],
  resultType: coda.ValueType.Object,
  schema: SpellSchema,
  execute: async function ([name], context) {
    // Search for spells that match the name provided.
    let searchUrl = coda.withQueryParams(
      "https://www.dnd5eapi.co/api/spells/",
      { name: name },
      );
    let response = await context.fetcher.fetch({
      method: "GET",
      url: searchUrl,
    });
    let results = response.body.results;

    // If no spells match, throw an error.
    if (!results?.length) {
      throw new coda.UserVisibleError("Unknown spell: " + name);
    }

    // Fetch the spell details for the first result.
    let topResult = results.slice(0, 1);
    let spells = await fetchSpells(context.fetcher, topResult);

    // Return the spell data for the result.
    return spells[0];
  },
});

// Allow requests to the DND API.
pack.addNetworkDomain("dnd5eapi.co");

// Fetch a batch of spells from the API and return them formatted to match the
// schema. This utility function is shared by the formula and sync table.
async function fetchSpells(fetcher: coda.Fetcher, spellResults) {
  let requests = [];
  for (let spellResult of spellResults) {
    // Add on the domain.
    let url = "https://www.dnd5eapi.co" + spellResult.url;
    // Put the request in the list. Don"t use await here, since we want them to
    // run at the same time.
    let request = fetcher.fetch({
      method: "GET",
      url: url,
    });
    requests.push(request);
  }

  // Wait for all of the requests to finish.
  let responses = await Promise.all(requests);

  // Format the API responses and return them.
  let spells = [];
  for (let response of responses) {
    spells.push(formatSpell(response.body));
  }
  return spells;
}


// Reformat the API response for a spell to fit the schema.
function formatSpell(spell) {
  return {
    // Start with all of the properties in the API response.
    ...spell,
    description: spell.desc?.join("\n"),
    higher_level: spell.higher_level?.join("\n"),
    damage_type: spell.damage?.damage_type?.name,
  };
}
