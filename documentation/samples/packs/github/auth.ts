import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Setup per-user authentication using GitHub's OAuth2.
// Remember to set your client ID and secret in the "Settings" tab.
// See https://docs.github.com/en/developers/apps/building-oauth-apps
pack.setUserAuthentication({
  type: coda.AuthenticationType.OAuth2,
  authorizationUrl: "https://github.com/login/oauth/authorize",
  tokenUrl: "https://github.com/login/oauth/access_token",
  tokenPrefix: "token",
  scopes: ["repo", "user"],

  // Determines the name of the GitHub account that was connected.
  getConnectionName: async function (context) {
    let response = await context.fetcher.fetch({
      method: "GET",
      url: "https://api.github.com/user",
    });
    return response.body.login;
  },
});

// Allow the Pack to access the GitHub domain.
pack.addNetworkDomain("github.com");
