import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Per-user authentication to the ClickUp API, using OAuth2.
// See https://clickup.com/api
pack.setUserAuthentication({
  type: coda.AuthenticationType.OAuth2,
  authorizationUrl: "https://app.clickup.com/api",
  tokenUrl: "https://app.clickup.com/api/v2/oauth/token",

  // Determines the display name of the connected account.
  getConnectionName: async function (context) {
    let response = await context.fetcher.fetch({
      method: "GET",
      url: "https://api.clickup.com/api/v2/user",
    });
    let user = response.body.user;
    return user.username;
  },
});

// Allow the pack to make requests to the ClickUp.
pack.addNetworkDomain("clickup.com");
