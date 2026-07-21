import * as coda from "@codahq/packs-sdk";

export const pack = coda.newPack();

pack.addMCPServer({
  name: "Ref.tools",
  endpointUrl: "https://api.ref.tools/mcp",
});

pack.setUserAuthentication({
  type: coda.AuthenticationType.CustomHeaderToken,
  headerName: "x-ref-api-key",
  instructionsUrl: "https://ref.tools/keys",
});

pack.addNetworkDomain("ref.tools");
