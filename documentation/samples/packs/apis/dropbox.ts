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
});

// Allow access to the Dropbox domain.
pack.addNetworkDomain("dropboxapi.com");
