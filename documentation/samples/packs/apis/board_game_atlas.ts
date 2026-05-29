import * as sdk from "@codahq/packs-sdk";
export const pack = sdk.newPack();

// Authenticate using a client ID.
// See: https://www.boardgameatlas.com/api/docs/apps
pack.setSystemAuthentication({
  type: sdk.AuthenticationType.QueryParamToken,
  paramName: "client_id",
});

pack.addNetworkDomain("boardgameatlas.com");
