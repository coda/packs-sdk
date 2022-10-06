import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Per-user authentication to Facebook (Meta) APIs, using OAuth2.
// eslint-disable-next-line max-len
// See https://developers.facebook.com/docs/facebook-login/guides/advanced/manual-flow
pack.setUserAuthentication({
  type: coda.AuthenticationType.OAuth2,
  authorizationUrl: "https://www.facebook.com/v14.0/dialog/oauth",
  tokenUrl: "https://graph.facebook.com/v14.0/oauth/access_token",

  // All scopes: https://developers.facebook.com/docs/permissions/reference
  scopes: [
    "public_profile",
  ],

  // Determines the display name of the connected account.
  getConnectionName: async function (context) {
    let response = await context.fetcher.fetch({
      method: "GET",
      url: "https://graph.facebook.com/v14.0/me",
    });
    let user = response.body;
    return user.name;
  },
});

// Allow the pack to make requests to Facebook.
pack.addNetworkDomain("facebook.com");
