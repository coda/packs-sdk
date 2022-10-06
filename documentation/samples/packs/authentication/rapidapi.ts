import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// System-wide authentication to RapidAPI, using an API key in a custom header.
// See https://docs.rapidapi.com/docs/keys#how-to-find-your-api-key.
pack.setSystemAuthentication({
  type: coda.AuthenticationType.CustomHeaderToken,
  headerName: "X-RapidAPI-Key",
});

// Allow the pack to make requests to RapidAPI.
pack.addNetworkDomain("rapidapi.com");
