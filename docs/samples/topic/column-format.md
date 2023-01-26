---
nav: Column formats
description: Samples that show how to create a column format.
icon: material/table-column
---

# Column format samples

A **column format** is a custom column type that you apply to any column in any Coda table. A column format tells Coda to interpret the value in a cell by executing a **formula** using that value, typically looking up data related to that value from an external API.

For example, the Weather pack has a column format `Current Weather`; when applied to a column, if you type a city or address into a cell in that column, that location will be used as an input to a formula that fetches the current weather at that location, and the resulting object with weather info will be shown in the cell.


[Learn More](../../../guides/blocks/column-formats){ .md-button }

## Template
The basic structure of a column format.

```ts
{% raw %}
pack.addColumnFormat({
  name: "<User-visible name>",
  instructions: "<Help text for the format>",
  formulaName: "<Name of the formula to run>",
  matchers: [
    // If formatting a URL, a regular expression that matches that URL.
  ],
});
{% endraw %}
```
## Text (Reverse)
A column format that formats text. This sample displays the text in the cell in reverse.

```ts
{% raw %}
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Adds a column format to the Pack, which will display the contents of the
// column in reverse order.
pack.addColumnFormat({
  name: "Reversed Text",
  instructions: "Whatever text you enter into this column will be reversed.",
  // The formula "Reverse()" (defined below) will be run on the content of the
  // column to determine it's display value.
  formulaName: "Reverse",
});

// Adds a formula to this Pack to reverse text. It is used by the column format
// above, but can also be used on it's own anywhere in the doc.
pack.addFormula({
  resultType: coda.ValueType.String,
  name: "Reverse",
  description: "Reverses text.",
  parameters: [
    // Formulas used in column formats can have only one required parameter.
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "input",
      description: "The text to reverse.",
    }),
    // Optional parameters can't be set when run as a column format.
    coda.makeParameter({
      type: coda.ParameterType.Boolean,
      name: "byWord",
      description: "Reverse the text word-by-word.",
      suggestedValue: false,
      optional: true,
    }),
  ],
  execute: async function ([input, byWord = false]) {
    let separator = "";
    if (byWord) {
      separator = " ";
    }
    return input.split(separator).reverse().join(separator);
  },
});
{% endraw %}
```
## Text (Roman Numeral)
A column format that formats a number as text. This sample displays the number in the cell as a Roman numeral.

```ts
{% raw %}
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Adds a column format to the Pack, which will display the contents of the
// column as Roman numerals.
pack.addColumnFormat({
  name: "Roman Numeral",
  instructions: "Displays the number as a Roman numeral.",
  formulaName: "RomanNumeral",
});

// Adds a formula to this Pack to convert a number to a Roman numeral. It is
// used by the column format above, but can also be used on it's own anywhere in
// the doc.
pack.addFormula({
  name: "RomanNumeral",
  description: "Converts a number to the equivalent Roman numeral.",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.Number,
      name: "value",
      description: "The number to convert.",
    }),
  ],
  resultType: coda.ValueType.String,
  execute: async function ([value], context) {
    let pairs = Object.entries(NumberMapping);
    // Sort the pairs by the number, largest to smallest.
    pairs.sort((a, b) => b[1] - a[1]);
    let result = "";
    for (let [roman, num] of pairs) {
      while (value >= num) {
        result += roman;
        value -= num;
      }
    }
    return result;
  },
});

const NumberMapping = {
  I: 1, IV: 4, V: 5, IX: 9, X: 10, XL: 40, L: 50, XC: 90, C: 100, CD: 400,
  D: 500, CM: 900, M: 1000,
};
{% endraw %}
```
## Text (Progress Bar)
A column format that formats a number as graphic. This sample displays the number in the cell as a progress bar.

```ts
{% raw %}
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Adds a column format to the Pack, which will display the contents of the
// column as a progress bar.
pack.addColumnFormat({
  name: "Progress Bar",
  instructions: "Draws a progress bar with the given percentage.",
  formulaName: "ProgressBar",
});

// Adds a formula to this Pack to draw a number as a progress bar. It is used by
// the column format above, but can also be used on it's own anywhere in the
// doc.
pack.addFormula({
  name: "ProgressBar",
  description: "Draws a progress bar.",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.Number,
      name: "percentage",
      description: "The percentage complete, as a number between 0 and 1.",
    }),
  ],
  resultType: coda.ValueType.String,
  execute: async function ([percentage], context) {
    if (percentage < 0 || percentage > 1) {
      throw new coda.UserVisibleError("Percentage must be between 0 and 1.");
    }
    let chars = Math.floor(percentage * 10);
    return "⬛".repeat(chars) + "⬜".repeat(10 - chars);
  },
});
{% endraw %}
```
## Image (Cats)
A column format that formats text as an image. This sample displays the text in the cell as an overlay on a random image of a cat.

```ts
{% raw %}
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Column format that displays the cell's value within a random cat image,
// using the CatImage() formula defined above.
pack.addColumnFormat({
  name: "Cat Image",
  instructions: "Displays the text over the image of a random cat.",
  formulaName: "CatImage",
});

// Formula that fetches a random cat image, with various options.
pack.addFormula({
  name: "CatImage",
  description: "Gets a random cat image.",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "text",
      description: "Text to display over the image.",
    }),
  ],
  resultType: coda.ValueType.String,
  codaType: coda.ValueHintType.ImageReference,
  execute: async function ([text], context) {
    let url = "https://cataas.com/cat/says/" + encodeURIComponent(text);
    url = coda.withQueryParams(url, {
      json: true,
    });
    let response = await context.fetcher.fetch({
      method: "GET",
      url: url,
      cacheTtlSecs: 0, // Don't cache the result, so we can get a fresh cat.
    });
    return "https://cataas.com" + response.body.url;
  },
});

// Allow the pack to make requests to Cat-as-a-service API.
pack.addNetworkDomain("cataas.com");
{% endraw %}
```
## Rich data (Todoist)
A column format that formats a URL as rich data. This sample displays the URL of the Todoist task in the cell as a rich data chip.

```ts
{% raw %}
import * as coda from "@codahq/packs-sdk";

// Regular expressions that match Todoist task URLs. Used by the column format
// and also the formula that powers it.
const TaskUrlPatterns: RegExp[] = [
  new RegExp("^https://todoist.com/app/task/([0-9]+)$"),
  new RegExp("^https://todoist.com/app/project/[0-9]+/task/([0-9]+)$"),
  new RegExp("^https://todoist.com/showTask\\?id=([0-9]+)"),
];

export const pack = coda.newPack();

// Add a column format that displays a task URL as rich metadata.
pack.addColumnFormat({
  name: "Task",
  // The formula "Task" below will get run on the cell value.
  formulaName: "Task",
  // If the first values entered into a new column match these patterns then
  // this column format will be automatically applied.
  matchers: TaskUrlPatterns,
});

// A schema defining the rich metadata to be returned.
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
    taskId: {
      description: "The ID of the task.",
      type: coda.ValueType.String,
      required: true,
    },
  },
  displayProperty: "name",
  idProperty: "taskId",
});

// Formula that looks up rich metadata about a task given it's URL. This is used
// by the "Task" column format above, but is also a regular formula that can be
// used elsewhere.
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
      url: "https://api.todoist.com/rest/v2/tasks/" + taskId,
      method: "GET",
    });
    let task = response.body;
    return {
      name: task.content,
      description: task.description,
      url: task.url,
      taskId: task.id,
    };
  },
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
{% endraw %}
```

