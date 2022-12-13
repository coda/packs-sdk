---
nav: Cards
description: Samples that show how to create cards to preview content.
icon: material/card-text
---

# Card samples

A card is an visual way to display key information about an item, typically represented by a URL in an external application.


[Learn More](../../../guides/blocks/cards){ .md-button }

## Basic card
A formula that returns a card containing an title, subtitle, and snippet. This sample returns a card with information about a spell in the game Dungeons &amp; Dragons.

```ts
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
  identity: {
    name: "Spell",
  },
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
```
## With image
A formula that returns a card that includes an image. This samples returns a card with the current weather at a given location in the United States.

```ts
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Define the schema that will be used to render the card.
const WeatherSchema = coda.makeObjectSchema({
  properties: {
    summary: { type: coda.ValueType.String, fromKey: "shortForecast" },
    forecast: { type: coda.ValueType.String, fromKey: "detailedForecast" },
    temperature: { type: coda.ValueType.String },
    wind: { type: coda.ValueType.String, fromKey: "windSpeed" },
    icon: { 
      type: coda.ValueType.String, 
      codaType: coda.ValueHintType.ImageReference,
    },
  },
  displayProperty: "summary",
  subtitleProperties: [
    // Only show the value for the temperature property.
    { property: "temperature", label: `${coda.PropertyLabelValueTemplate}` },
    "wind",
  ],
  snippetProperty: "forecast",
  imageProperty: "icon",
  identity: {
    name: "Weather",
  },
});

// Add a formula that fetches the weather and returns it as a card.
pack.addFormula({
  name: "CurrentWeather",
  description: "Get the current weather at a specific location (US only).",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.Number,
      name: "latitude",
      description: "The latitude of the location.",
    }),
    coda.makeParameter({
      type: coda.ParameterType.Number,
      name: "longitude",
      description: "The longitude of the location.",
    }),
    coda.makeParameter({
      type: coda.ParameterType.Boolean,
      name: "isMetric",
      description: "Whether to use metric units. Default: false.",
      optional: true,
    }),
  ],
  resultType: coda.ValueType.Object,
  schema: WeatherSchema,
  execute: async function ([latitude, longitude, isMetric], context) {
    let url = await getForecastUrl(latitude, longitude, context);
    if (isMetric) {
      url = coda.withQueryParams(url, { units: "si" });
    }
    let response = await context.fetcher.fetch({
      method: "GET",
      url: url,
    });
    let data = response.body;
    let weather = data.properties.periods[0];
    // Add the unit onto the temperature.
    weather.temperature = `${weather.temperature}°${weather.temperatureUnit}`;
    return weather;
  },
});

// A helper function that gets the forecast URL for a given location.
async function getForecastUrl(latitude: number, longitude: number, 
  context: coda.ExecutionContext): Promise<string> {
  try {
    let response = await context.fetcher.fetch({
      method: "GET",
      url: `https://api.weather.gov/points/${latitude},${longitude}`,
    });
    let data = response.body;
    return data.properties.forecast;
  } catch (error) {
    // Check if the error is due to the location being outside the US.
    if (error.statusCode === 404) {
      let statusError = error as coda.StatusCodeError;
      let message = statusError.body?.detail;
      if (message) {
        throw new coda.UserVisibleError(message);
      }
    }
    throw error;
  }
}

pack.addNetworkDomain("weather.gov");
```
## With link upgrade
A card that can be created manually or from upgrading a link. This sample returns a card with the details of a task in Todoist.

```ts
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// A schema defining the card, including all of metadata what specifically to 
// highlight in the card.
const TaskSchema = coda.makeObjectSchema({
  properties: {
    name: {
      description: "The name of the task.",
      type: coda.ValueType.String,
      required: true,
    },
    description: {
      description: "A detailed description of the task.",
      type: coda.ValueType.String,
    },
    url: {
      description: "A link to the task in the Todoist app.",
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.Url,
    },
    priority: {
      description: "The priority of the task.",
      type: coda.ValueType.String,
    },
    taskId: {
      description: "The ID of the task.",
      type: coda.ValueType.Number,
      required: true,
    },
  },
  // Which property's content to show in the title of the card.
  displayProperty: "name",
  // Which property contains the link to open when the card is clicked.
  linkProperty: "url",
  // Which property's content to show in the body of the card.
  snippetProperty: "description",
  // Which properties' content to show in the subtitle of the card.
  subtitleProperties: ["priority"],
  // The unique identity of this schema, required to render as a card.
  identity: {
    name: "Task",
  },
});

// Formula that renders a card for a task given it's URL. This will be shown a 
// "Card" in the Pack's list of building blocks, but is also a regular formula
// that can be used elsewhere.
pack.addFormula({
  name: "Task",
  description: "Gets a Todoist task by URL",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "url",
      description: "The URL of the task",
    }),
  ],
  resultType: coda.ValueType.Object,
  schema: TaskSchema,

  execute: async function ([url], context) {
    let taskId = extractTaskId(url);
    let response = await context.fetcher.fetch({
      url: "https://api.todoist.com/rest/v1/tasks/" + taskId,
      method: "GET",
    });
    let task = response.body;
    return {
      name: task.content,
      description: task.description,
      url: task.url,
      priority: task.priority,
      taskId: task.id,
    };
  },
});

// Regular expressions that match Todoist task URLs. Used to match and parse 
// relevant URLs.
const TaskUrlPatterns: RegExp[] = [
  new RegExp("^https://todoist.com/app/project/[0-9]+/task/([0-9]+)$"),
  new RegExp("^https://todoist.com/showTask\\?id=([0-9]+)"),
];

// Add a column format for the Task formula, to define which URLs it should
// trigger for. This also makes it easier to use the formula in a table column.
pack.addColumnFormat({
  // How the option will show in the URL upgrade dialog.
  name: "Task",
  // The formula that generates the card.
  formulaName: "Task",
  // The set of regular expressions that if matched will trigger the URL upgrade
  // dialog.
  matchers: TaskUrlPatterns,
});

// Helper function to extract the Task ID from the URL.
function extractTaskId(taskUrl: string) {
  for (let pattern of TaskUrlPatterns) {
    let matches = taskUrl.match(pattern);
    if (matches && matches[1]) {
      return matches[1];
    }
  }
  throw new coda.UserVisibleError("Invalid task URL: " + taskUrl);
}

// Allow the pack to make requests to Todoist.
pack.addNetworkDomain("todoist.com");

// Setup authentication using a Todoist API token.
pack.setUserAuthentication({
  type: coda.AuthenticationType.HeaderBearerToken,
  instructionsUrl: "https://todoist.com/app/settings/integrations",
});
```

