import * as sdk from "@codahq/packs-sdk";

const pack = sdk.newPack();

// BEGIN

// When registering your app in the API's developer console set the redirect URL
// to: https://docs.superhuman.com/packsAuth/oauth2/{PACK ID}
// After building your Pack, remember to visit the Settings tab to set your
// client ID and secret.
pack.setUserAuthentication({
  type: sdk.AuthenticationType.OAuth2,
  // The following two URLs will be found in the API's documentation.
  authorizationUrl: "${1:https://example.com/authorize}",
  tokenUrl: "${2:https://example.com/token}",
  scopes: [
    // TODO: List the API scopes to request, if any.
  ],
  getConnectionName: async function (context) {
    // TODO: Fetch the name of the account.
    let name = "";
    return name;
  },
});
