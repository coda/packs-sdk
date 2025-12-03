import * as coda from "@codahq/packs-sdk";

const pack = coda.newPack();

// BEGIN

pack.addMCPServer({
  name: "${1:MyMCPServer}",
  endpointUrl: "${2:https://my-mcp-server.com/mcp}",
});
