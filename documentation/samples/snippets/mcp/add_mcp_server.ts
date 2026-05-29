import * as sdk from "@codahq/packs-sdk";

const pack = sdk.newPack();

// BEGIN

pack.addMCPServer({
  name: "${1:MyMCPServer}",
  endpointUrl: "${2:https://my-mcp-server.com/mcp}",
});
