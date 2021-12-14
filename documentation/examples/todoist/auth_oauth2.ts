import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Per-user authentication to the Todoist API, using an OAuth2 flow.
// When registering for a client ID and secret, use the callback URL
// https://coda.io/packsAuth/oauth2.
pack.setUserAuthentication({
  type: coda.AuthenticationType.OAuth2,
  // OAuth2 URLs and scopes are found in the the Todoist OAuth guide:
  // https://developer.todoist.com/guides/#oauth
  authorizationUrl: "https://todoist.com/oauth/authorize",
  tokenUrl: "https://todoist.com/oauth/access_token",
  scopes: ["data:read_write"],

  // Determines the display name of the connected account.
  getConnectionName: async function (context) {
    let url = coda.withQueryParams("https://api.todoist.com/sync/v8/sync", {
      resource_types: JSON.stringify(["user"]),
    });
    let response = await context.fetcher.fetch({
      method: "GET",
      url: url,
    });
    return response.body.user?.full_name;
  },
});

// Allow the pack to make requests to Todoist.
pack.addNetworkDomain("todoist.com");
