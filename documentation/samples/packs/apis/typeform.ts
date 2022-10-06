import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Configure per-user authentication for the Typeform API, using OAuth2.
// See: https://developer.typeform.com/get-started/applications/
pack.setUserAuthentication({
  type: coda.AuthenticationType.OAuth2,
  authorizationUrl: "https://api.typeform.com/oauth/authorize",
  tokenUrl: "https://api.typeform.com/oauth/token",

  // See: https://developer.typeform.com/get-started/scopes/
  scopes: ["forms:read", "responses:read", "accounts:read"],

  // Determines the display name of the connected account.
  getConnectionName: async function (context) {
    let url = "https://api.typeform.com/me";
    let response = await context.fetcher.fetch({
      method: "GET",
      url: url,
    });
    let profile = response.body;
    return profile.alias;
  },
});

// Allow requests to Typeform.
pack.addNetworkDomain("typeform.com");
