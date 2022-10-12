import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Authenticate using a client ID.
// See: https://www.boardgameatlas.com/api/docs/apps
pack.setSystemAuthentication({
  type: coda.AuthenticationType.QueryParamToken,
  paramName: "client_id",
});

pack.addNetworkDomain("boardgameatlas.com");
