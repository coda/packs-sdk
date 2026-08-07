---
nav: Skills
description: Samples that show how to define a skill.
icon: material/school-outline
---

# Skill samples

A **skill** is an optional set of instructions that guides the LLM on how to perform a specific task. The LLM reads each skill's description and loads the ones useful to the task at hand, along with any tools the skill suggests.

Skills are only supported in Superhuman Go.


[Learn More](../../guides/blocks/skills.md){ .md-button }

## Template
The basic structure of a skill.

```ts
{% raw %}
pack.addSkill({
  name: "MySkill",
  displayName: "My skill",
  description: "My skill description.",
  prompt: `
    My prompt
  `,
  tools: [
    // Optionally: Add tools.
  ],
});
{% endraw %}
```
## With MCP tools
A skill that orchestrates several MCP tools to perform a task. This sample uses the Alpha Vantage MCP server.

```ts
{% raw %}
import * as sdk from "@codahq/packs-sdk";

export const pack = sdk.newPack();

pack.addSkill({
  name: "CompanySummary",
  displayName: "Company summary",
  description: "Gets a summary of a company, including stock performance.",
  prompt: `
    First, use the SYMBOL_SEARCH tool to search for the ticker symbol,
    preferring the US variant.
    Then, call the following tools using that symbol: COMPANY_OVERVIEW,
    COMPANY_LOGO, TIME_SERIES_DAILY, NEWS_SENTIMENT
    Finally, output the company logo, a brief overview, a summary of recent
    performance, and a summary of key news items affecting the company.
  `,
  tools: [
    { type: sdk.ToolType.MCP },
  ],
});

pack.addMCPServer({
  name: "AlphaVantage",
  endpointUrl: "https://mcp.alphavantage.co/mcp",
});

pack.setUserAuthentication({
  type: sdk.AuthenticationType.QueryParamToken,
  paramName: "apikey",
  instructionsUrl: "https://www.alphavantage.co/support/#api-key",
});

pack.addNetworkDomain("alphavantage.co");
{% endraw %}
```
## With Pack tools
A skill that uses Pack tools to perform a task. This sample uses the ExchangeRate-API and the screen annotation tool.

```ts
{% raw %}
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

pack.addSkill({
  name: "PlaceholderFiller",
  displayName: "Placeholder Filler",
  description:
    "Finds placeholders for currency values in the writing, and fills them in.",
  prompt: `
    Look for text like "$100 (or X CAD)" in the user's writing.
    Use the ExchangeRate tool to convert from one currency to another.
    Create a suggestion using the rewrite tool to replace the placeholder with
    the value.
  `,
  tools: [
    { type: coda.ToolType.Pack },
    {
      type: coda.ToolType.ScreenAnnotation,
      annotation: { type: coda.ScreenAnnotationType.Rewrite },
    },
  ],
});

pack.addFormula({
  name: "ExchangeRate",
  description: "Gets the current exchange rate between two currencies.",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "from",
      description: "The ISO 4217 country code to convert from.",
    }),
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "to",
      description: "The ISO 4217 country code to convert to.",
    }),
  ],
  resultType: coda.ValueType.Number,
  execute: async function (args, context) {
    let [fromCountry, toCountry] = args;
    let response = await context.fetcher.fetch({
      method: "GET",
      url: `https://v6.exchangerate-api.com/v6/latest/${fromCountry}`,
    });
    // The JSON response is automatically parsed into an object.
    let rates = response.body.conversion_rates;
    let rate = rates[toCountry];
    if (!rate) {
      throw new coda.UserVisibleError("Exchange rate not available.");
    }
    return rate;
  },
});

// Use the same API key for all users, passed in the Authorization header.
pack.setSystemAuthentication({
  type: coda.AuthenticationType.HeaderBearerToken,
  instructionsUrl: "https://app.exchangerate-api.com/dashboard",
});

pack.addNetworkDomain("exchangerate-api.com");
{% endraw %}
```

