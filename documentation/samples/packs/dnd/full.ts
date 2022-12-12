import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// How many spells to fetch in each sync formula execution.
const BATCH_SIZE = 20;

// Allow requests to the DND API.
pack.addNetworkDomain("dnd5eapi.co");

// Schema that defines the metadata to return for each spell. Shared by the
// formula, column format, and sync table.
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

// A formula that looks up a spell given a name, returning the first result.
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

// A column format that displays information about the spell with the given
// name.
pack.addColumnFormat({
  name: "Spell",
  instructions: "Displays information about the spell with this name.",
  formulaName: "Spell",
});

// A sync table that displays all spells available in the API.
pack.addSyncTable({
  name: "Spells",
  identityName: "Spell",
  schema: SpellSchema,
  connectionRequirement: coda.ConnectionRequirement.None,
  formula: {
    name: "SyncSpells",
    description: "Sync all the spells.",
    parameters: [],
    execute: async function ([], context) {
      // Get the list of all spells.
      let listUrl = "https://www.dnd5eapi.co/api/spells";
      let response = await context.fetcher.fetch({
        method: "GET",
        url: listUrl,
      });
      let results = response.body.results;

      // If there is a previous continuation, start from the index contained
      // within, otherwise start at zero.
      let index: number = (context.sync.continuation?.index as number) || 0;

      // Get a batch of results, starting from the index determined above.
      let batch = results.slice(index, index + BATCH_SIZE);

      // Fetch the spells for the batch of results.
      let spells = await fetchSpells(context.fetcher, batch);

      // Move the index forward.
      index += BATCH_SIZE;

      // If there are more results to process, create a new continuation.
      let continuation;
      if (index <= results.length) {
        continuation = {
          index: index,
        };
      }

      // Return the batch of spells and the next continuation, if any.
      return {
        result: spells,
        continuation: continuation,
      };
    },
  },
});

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
