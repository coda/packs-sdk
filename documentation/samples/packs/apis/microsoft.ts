import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Per-user authentication to Microsoft APIs, using OAuth2.
// eslint-disable-next-line max-len
// See https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-auth-code-flow
pack.setUserAuthentication({
  type: coda.AuthenticationType.OAuth2,
  authorizationUrl:
    "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
  tokenUrl: "https://login.microsoftonline.com/common/oauth2/v2.0/token",

  // eslint-disable-next-line max-len
  // Learn more: https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent
  scopes: [
    "offline_access",
    "user.read",
  ],

  // Additional parameters to ensure a refresh_token is returned.
  additionalParams: {
    prompt: "consent",
  },

  // Enable PKCE (optional but recommended).
  useProofKeyForCodeExchange: true,

  // Determines the display name of the connected account.
  getConnectionName: async function (context) {
    let response = await context.fetcher.fetch({
      method: "GET",
      url: "https://graph.microsoft.com/v1.0/me",
    });
    let user = response.body;
    return user.displayName;
  },
});

// Allow the pack to make requests to Microsoft.
pack.addNetworkDomain("microsoft.com");
