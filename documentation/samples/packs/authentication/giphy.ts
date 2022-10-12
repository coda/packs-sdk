import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// System-wide authentication to the Giphy API, using an API key in the query
// string. See https://support.giphy.com/hc/en-us/articles/360020283431.
pack.setSystemAuthentication({
  type: coda.AuthenticationType.QueryParamToken,
  paramName: "api_key",
});

// Allow the pack to make requests to Giphy.
pack.addNetworkDomain("giphy.com");
