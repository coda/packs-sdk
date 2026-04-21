import * as sdk from "@codahq/packs-sdk";
export const pack = sdk.newPack();

// System-wide authentication to Blizzard's Battle.net APIs, using the OAuth2
// client_credentials flow.
// eslint-disable-next-line max-len
// See https://develop.battle.net/documentation/guides/using-oauth/client-credentials-flow.
pack.setSystemAuthentication({
  type: sdk.AuthenticationType.OAuth2ClientCredentials,
  tokenUrl: "https://oauth.battle.net/token",
});

// Allow the pack to make requests to Battle.net.
pack.addNetworkDomain("blizzard.com");
