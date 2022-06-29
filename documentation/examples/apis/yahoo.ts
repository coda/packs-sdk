import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Setup per-user authentication using Yahoo's OAuth2.
// Remember to set your client ID and secret in the "Settings" tab.
// See https://developer.yahoo.com/oauth2/guide/flows_authcode/
pack.setUserAuthentication({
  type: coda.AuthenticationType.OAuth2,
  authorizationUrl: "https://api.login.yahoo.com/oauth2/request_auth",
  tokenUrl: "https://api.login.yahoo.com/oauth2/get_token",
  scopes: ["openid"],

  // Determines the name of the Yahoo account that was connected.
  getConnectionName: async function (context) {
    let response = await context.fetcher.fetch({
      method: "GET",
      url: "https://api.login.yahoo.com/openid/v1/userinfo",
    });
    let user = response.body;
    return user.name;
  },
});

// Allow the Pack to access the Yahoo domain.
pack.addNetworkDomain("yahoo.com");
