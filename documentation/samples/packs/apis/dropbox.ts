import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Set per-user authentication using Dropbox's OAuth2.
// See https://developers.dropbox.com/oauth-guide
pack.setUserAuthentication({
  type: coda.AuthenticationType.OAuth2,
  authorizationUrl: "https://www.dropbox.com/oauth2/authorize",
  tokenUrl: "https://api.dropbox.com/oauth2/token",
  scopes: ["files.content.read"],

  // Additional parameters to ensure a refresh_token is returned.
  additionalParams: {
    token_access_type: "offline",
  },

  // Send the authentication information to both domains.
  // Note: Using auth with multiple domains requires approval from Coda.
  networkDomain: ["api.dropboxapi.com", "content.dropboxapi.com"],
});

// Allow access to the Dropbox domains.
// Note: Using multiple domains in a Pack requires approval from Coda.
pack.addNetworkDomain("api.dropboxapi.com");
pack.addNetworkDomain("content.dropboxapi.com");
