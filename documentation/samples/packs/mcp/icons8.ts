import * as coda from "@codahq/packs-sdk";

export const pack = coda.newPack();

pack.addMCPServer({
  name: "Icons8",
  endpointUrl: "https://mcp.icons8.com/mcp/",
});

pack.addNetworkDomain("icons8.com");
