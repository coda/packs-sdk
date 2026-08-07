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
