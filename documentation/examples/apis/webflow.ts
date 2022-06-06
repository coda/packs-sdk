import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// The version of the Webflow API to use.
const WebflowApiVersion = "1.0.0";

// Per-user authentication to the ClickUp API, using OAuth2.
// See https://developers.webflow.com/oauth
pack.setUserAuthentication({
  type: coda.AuthenticationType.OAuth2,
  authorizationUrl: "https://webflow.com/oauth/authorize",
  tokenUrl: "https://api.webflow.com/oauth/access_token",

  // Determines the display name of the connected account.
  getConnectionName: async function (context) {
    let response = await context.fetcher.fetch({
      method: "GET",
      url: "https://api.webflow.com/user",
      headers: {
        "Accept-Version": WebflowApiVersion,
      },
    });
    let user = response.body.user;
    return `${user.firstName} ${user.lastName}`;
  },
});

// Allow the pack to make requests to Webflow.
pack.addNetworkDomain("webflow.com");
