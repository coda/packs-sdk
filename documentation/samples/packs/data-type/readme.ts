import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Returns the contents of GitHub repo's README.md file as markdown.
pack.addFormula({
  name: "GetReadme",
  description: "Gets the content of a GitHub repo's README.md file.",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "repo",
      description: "The repo to read from.",
      suggestedValue: "coda/packs-sdk",
    }),
  ],
  resultType: coda.ValueType.String,
  codaType: coda.ValueHintType.Markdown,
  execute: async function ([repo], context) {
    let url = `https://raw.githubusercontent.com/${repo}/HEAD/README.md`;
    let result = await context.fetcher.fetch({
      method: "GET",
      url: url,
    });
    return result.body;
  },
});

pack.addNetworkDomain("raw.githubusercontent.com");
