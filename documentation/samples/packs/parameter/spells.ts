import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

const PageSize = 100;

const SpellSchema = coda.makeObjectSchema({
  type: coda.ValueType.Object,
  properties: {
    name: { type: coda.ValueType.String },
    description: { type: coda.ValueType.String },
    level: { type: coda.ValueType.Number },
    school: { type: coda.ValueType.String },
    index: { type: coda.ValueType.String },
  },
  displayProperty: "name",
  idProperty: "index",
  featuredProperties: ["description", "level", "school"],
});

pack.addNetworkDomain("dnd5eapi.co");

pack.addSyncTable({
  name: "Spells",
  identityName: "Spell",
  schema: SpellSchema,
  formula: {
    name: "SyncSpells",
    description: "Sync all the spells.",
    parameters: [
      coda.makeParameter({
        type: coda.ParameterType.Number,
        name: "level",
        description: "Only include spells with the given level.",
        optional: true,
      }),
      coda.makeParameter({
        type: coda.ParameterType.String,
        name: "school",
        description: "Only include spells with the given magic school.",
        optional: true,
        autocomplete: async function (context, search) {
          let schools = await getMagicSchools(context);
          return coda.autocompleteSearchObjects(
            search, schools, "name", "index");
        },
      }),
    ],
    // Validate the parameter values.
    validateParameters: async function (context, _, args) {
      let { level, school } = args;
      let errors: coda.ParameterValidationDetail[] = [];
      if (level && (level < 0 || level > 9)) {
        errors.push({
          message: "The level must be in the range 0-9.",
          parameterName: "level",
        });
      }
      if (school) {
        let schools = await getMagicSchools(context);
        let found = schools.some(s => s.index === school);
        if (!found) {
          errors.push({
            message: "Unknown school: " + school,
            parameterName: "school",
          });
        }
      }
      if (errors.length > 0) {
        return {
          isValid: false,
          message: "Please fix the errors.",
          errors: errors,
        };
      }
      return {
        isValid: true,
      };
    },
    execute: async function (args, context) {
      let skip = context.sync.continuation?.skip ?? 0;
      let [level, school] = args;
      let query = `
        query($limit: Int, $skip: Int, $level: [Int!], $school: [String!]) {
          spells(limit: $limit, skip: $skip, level: $level, school: $school) {
            index
            name
            desc
            level
            school { name }
          }
        }
      `;
      let payload = {
        query: query,
        variables: {
          limit: PageSize,
          skip: skip,
          level: level,
          school: school,
        },
      };
      let response = await context.fetcher.fetch({
        method: "POST",
        url: "https://www.dnd5eapi.co/graphql/2014",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      let spells = response.body.data.spells;
      let rows = spells?.map(spell => {
        return {
          ...spell,
          description: spell.desc?.join("\n"),
          school: spell.school?.name,
        };
      });
      let continuation;
      if (spells?.length > 0) {
        continuation = {
          skip: skip + PageSize,
        };
      }
      return {
        result: rows,
        continuation: continuation,
      };
    },
  },
});

async function getMagicSchools(context: coda.ExecutionContext) {
  let response = await context.fetcher.fetch({
    method: "GET",
    url: "https://www.dnd5eapi.co/api/2014/magic-schools",
  });
  return response.body.results;
}
