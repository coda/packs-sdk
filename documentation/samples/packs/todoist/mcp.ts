import * as sdk from "@codahq/packs-sdk";
export const pack = sdk.newPack();

pack.addMCPServer({
  name: "Todoist",
  endpointUrl: "https://ai.todoist.net/mcp",
});

pack.setUserAuthentication({
  type: sdk.AuthenticationType.OAuth2,
  useDynamicClientRegistration: true,
  useProofKeyForCodeExchange: true,
});

pack.addNetworkDomain("todoist.net");
