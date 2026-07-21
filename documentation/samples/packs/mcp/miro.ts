import * as sdk from "@codahq/packs-sdk";

export const pack = sdk.newPack();

pack.addMCPServer({
  name: "Miro",
  endpointUrl: "https://mcp.miro.com/",
});

pack.setUserAuthentication({
  type: sdk.AuthenticationType.OAuth2,
  useDynamicClientRegistration: true,
  useProofKeyForCodeExchange: true,
  scopes: ["boards:read", "boards:write"],
});

pack.addNetworkDomain("miro.com");
