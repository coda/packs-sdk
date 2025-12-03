import * as coda from "@codahq/packs-sdk";

const pack = coda.newPack();

// BEGIN

pack.addMCPServer({
  name: "${1:Example}",
  endpointUrl: "${2:https://example.com/mcp}",
});
