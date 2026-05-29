---
nav: Cards
description: Samples that show how to create cards to preview content.
icon: material/card-text
---

# Card samples

A card is a visual way to display key information about an item, typically represented by a URL in an external application.


[Learn More](../../guides/blocks/cards.md){ .md-button }

## Template
The basic structure of a card.

```ts
{% raw %}
// A schema that defines the data shown in the card.
const ThingSchema = sdk.makeObjectSchema({
  properties: {
    name: { type: sdk.ValueType.String },
    description: { type: sdk.ValueType.String },
    picture: {
      type: sdk.ValueType.String,
      hintType: sdk.ValueHintType.ImageReference,
    },
    link: {
      type: sdk.ValueType.String,
      hintType: sdk.ValueHintType.Url,
    },
    // TODO: Add more properties.
  },
  displayProperty: "$2",
  titleProperty: "$2",
  snippetProperty: "$3",
  imageProperty: "$4",
  linkProperty: "$5",
  subtitleProperties: [
    // TODO: List the properties to show under the title.
  ],
});

// A formula that accepts a URL and returns an object matching the schema above.
pack.addFormula({
  name: "$1",
  description: "My description.",
  parameters: [
    sdk.makeParameter({
      type: sdk.ParameterType.String,
      name: "url",
      description: " My parameter description.",
    }),
  ],
  resultType: sdk.ValueType.Object,
  schema: $1Schema,
  execute: async function (args, context) {
    let [url] = args;
    // TODO: Fetch information about the item represented by the URL.
    return {
      // TODO: Populate with fetched information.
      $5: url,
    };
  },
});

// A column format that defines which URL patterns the formula should match.
pack.addColumnFormat({
  name: "$1",
  instructions: "My instructions.",
  formulaName: "$1",
  matchers: [
    new RegExp("https://example.com/.*"),
    // TODO: Optionally add more URL patterns.
  ],
});
{% endraw %}
```
## Basic card
A formula that returns a card containing an title, subtitle, and snippet. This sample returns a card with information about a spell in the game Dungeons &amp; Dragons.

```ts
{% raw %}
import * as sdk from "@codahq/packs-sdk";
export const pack = sdk.newPack();

// A schema defining the card, including all of metadata what specifically to
// highlight in the card.
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

// Formula that renders a card for a spell given its name. This will be shown
// a "Card" in the Pack's list of building blocks, but is also a regular formula
// that can be used elsewhere.
pack.addFormula({
  name: "Spell",
  description: "Gets information about a spell, given its name.",
  parameters: [
    sdk.makeParameter({
      type: sdk.ParameterType.String,
      name: "name",
      description: "The name of the spell.",
      suggestedValue: "Acid Arrow",
    }),
  ],
  resultType: sdk.ValueType.Object,
  schema: SpellSchema,
  execute: async function ([name], context) {
    // Search for spells that match the name provided.
    let searchUrl = sdk.withQueryParams(
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
      throw new sdk.UserVisibleError("Unknown spell: " + name);
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
async function fetchSpells(fetcher: sdk.Fetcher, spellResults) {
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
{% endraw %}
```
## With image
A formula that returns a card that includes an image. This samples returns a card with the current weather at a given location in the United States.

```ts
{% raw %}
import * as sdk from "@codahq/packs-sdk";
export const pack = sdk.newPack();

// Define the schema that will be used to render the card.
const WeatherSchema = sdk.makeObjectSchema({
  properties: {
    summary: { type: sdk.ValueType.String, fromKey: "shortForecast" },
    forecast: { type: sdk.ValueType.String, fromKey: "detailedForecast" },
    temperature: { type: sdk.ValueType.String },
    wind: { type: sdk.ValueType.String, fromKey: "windSpeed" },
    icon: {
      type: sdk.ValueType.String,
      hintType: sdk.ValueHintType.ImageReference,
    },
    link: {
      type: sdk.ValueType.String,
      hintType: sdk.ValueHintType.Url,
    },
  },
  displayProperty: "summary",
  subtitleProperties: [
    // Only show the value for the temperature property.
    { property: "temperature", label: "" },
    "wind",
  ],
  snippetProperty: "forecast",
  imageProperty: "icon",
  linkProperty: "link",
});

// Add a formula that fetches the weather and returns it as a card.
pack.addFormula({
  name: "CurrentWeather",
  description: "Get the current weather at a specific location (US only).",
  parameters: [
    sdk.makeParameter({
      type: sdk.ParameterType.Number,
      name: "latitude",
      description: "The latitude of the location.",
    }),
    sdk.makeParameter({
      type: sdk.ParameterType.Number,
      name: "longitude",
      description: "The longitude of the location.",
    }),
    sdk.makeParameter({
      type: sdk.ParameterType.Boolean,
      name: "isMetric",
      description: "Whether to use metric units. Default: false.",
      optional: true,
    }),
  ],
  resultType: sdk.ValueType.Object,
  schema: WeatherSchema,
  execute: async function ([latitude, longitude, isMetric], context) {
    let url = await getForecastUrl(latitude, longitude, context);
    if (isMetric) {
      url = sdk.withQueryParams(url, { units: "si" });
    }
    let response = await context.fetcher.fetch({
      method: "GET",
      url: url,
    });
    let data = response.body;
    let weather = data.properties.periods[0];
    // Add the unit onto the temperature.
    weather.temperature = `${weather.temperature}°${weather.temperatureUnit}`;
    weather.link =
      sdk.withQueryParams("https://forecast.weather.gov/MapClick.php", {
        lat: latitude,
        lon: longitude,
      });
    return weather;
  },
});

// A helper function that gets the forecast URL for a given location.
async function getForecastUrl(latitude: number, longitude: number,
  context: sdk.ExecutionContext): Promise<string> {
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
      let statusError = error as sdk.StatusCodeError;
      let message = statusError.body?.detail;
      if (message) {
        throw new sdk.UserVisibleError(message);
      }
    }
    throw error;
  }
}

pack.addNetworkDomain("weather.gov");
{% endraw %}
```
## With link matching
A card that can be created manually or automatically when pasting a link. This sample returns a card with the details of a task in Todoist.

```ts
{% raw %}
import * as sdk from "@codahq/packs-sdk";
export const pack = sdk.newPack();

// A schema defining the card, including all of metadata what specifically to
// highlight in the card.
const TaskSchema = sdk.makeObjectSchema({
  properties: {
    name: {
      description: "The name of the task.",
      type: sdk.ValueType.String,
      required: true,
    },
    description: {
      description: "A detailed description of the task.",
      type: sdk.ValueType.String,
    },
    url: {
      description: "A link to the task in the Todoist app.",
      type: sdk.ValueType.String,
      hintType: sdk.ValueHintType.Url,
    },
    priority: {
      description: "The priority of the task.",
      type: sdk.ValueType.String,
    },
    id: {
      description: "The ID of the task.",
      type: sdk.ValueType.String,
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
});

// Formula that renders a card for a task given its URL. This will be shown a
// "Card" in the Pack's list of building blocks, but is also a regular formula
// that can be used elsewhere.
pack.addFormula({
  name: "Task",
  description: "Gets a Todoist task by URL",
  parameters: [
    sdk.makeParameter({
      type: sdk.ParameterType.String,
      name: "url",
      description: "The URL of the task",
    }),
  ],
  resultType: sdk.ValueType.Object,
  schema: TaskSchema,

  execute: async function ([url], context) {
    let taskId = extractTaskId(url);
    let response = await context.fetcher.fetch({
      url: "https://api.todoist.com/rest/v2/tasks/" + taskId,
      method: "GET",
    });
    let task = response.body;
    return {
      name: task.content,
      description: task.description,
      url: task.url,
      priority: task.priority,
      id: task.id,
    };
  },
});

// Regular expressions that match Todoist task URLs. Used to match and parse
// relevant URLs.
const TaskUrlPatterns: RegExp[] = [
  new RegExp("^https://todoist.com/app/task/([0-9]+)$"),
  new RegExp("^https://todoist.com/app/project/[0-9]+/task/([0-9]+)$"),
  new RegExp("^https://todoist.com/showTask\\?id=([0-9]+)"),
];

// Add a column format for the Task formula, to define which URLs it should
// trigger for. This also makes it easier to use the formula in a table column.
pack.addColumnFormat({
  // How the option will show in the link and column type dialogs.
  name: "Task",
  // The formula that generates the card.
  formulaName: "Task",
  // The set of regular expressions that match Todoist task URLs.
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
  throw new sdk.UserVisibleError("Invalid task URL: " + taskUrl);
}

// Allow the pack to make requests to Todoist.
pack.addNetworkDomain("todoist.com");

// Setup authentication using a Todoist API token.
pack.setUserAuthentication({
  type: sdk.AuthenticationType.HeaderBearerToken,
  instructionsUrl: "https://todoist.com/app/settings/integrations",
});
{% endraw %}
```

