import * as sdk from "@codahq/packs-sdk";

export const pack = sdk.newPack();

pack.addMCPServer({
  name: "GoogleCalendar",
  endpointUrl: "https://calendarmcp.googleapis.com/mcp/v1",
});

pack.setUserAuthentication({
  type: sdk.AuthenticationType.OAuth2,
  authorizationUrl: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenUrl: "https://oauth2.googleapis.com/token",
  scopes: ["https://www.googleapis.com/auth/calendar"],
  useProofKeyForCodeExchange: true,

  // Additional parameters to ensure a refresh_token is returned.
  additionalParams: {
    access_type: "offline",
    prompt: "consent",
  },
});

pack.addNetworkDomain("googleapis.com");
