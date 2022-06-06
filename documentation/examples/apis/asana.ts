import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Per-user authentication to the Asana API, using OAuth2.
// See https://developers.asana.com/docs/oauth
pack.setUserAuthentication({
  type: coda.AuthenticationType.OAuth2,
  authorizationUrl: "https://app.asana.com/-/oauth_authorize",
  tokenUrl: "https://app.asana.com/-/oauth_token",

  // Enable PKCE (required).
  useProofKeyForCodeExchange: true,

  // Determines the display name of the connected account.
  getConnectionName: async function (context) {
    let response = await context.fetcher.fetch({
      method: "GET",
      url: "https://app.asana.com/api/1.0/users/me",
    });
    let user = response.body.data;
    return user.name;
  },
});

// Allow the pack to make requests to Asana.
pack.addNetworkDomain("asana.com");
