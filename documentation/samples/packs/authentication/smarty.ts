import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Per-user authentication to the Smarty API, using multiple query parameters.
// See https://www.smarty.com/docs/cloud/authentication#keypairs
pack.setUserAuthentication({
  type: coda.AuthenticationType.MultiQueryParamToken,
  params: [
    { name: "auth-id", description: "The Auth ID of the secret key." },
    { name: "auth-token", description: "The Auth Token of the secret key." },
  ],
});

// Allow the pack to make requests to Smarty.
pack.addNetworkDomain("smartystreets.com");
