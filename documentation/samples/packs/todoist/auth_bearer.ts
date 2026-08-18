import * as sdk from "@codahq/packs-sdk";
export const pack = sdk.newPack();

// Per-user authentication to the Todoist API, using a personal API token in
// an "Authorization: Bearer ..." header.
pack.setUserAuthentication({
  type: sdk.AuthenticationType.HeaderBearerToken,
  instructionsUrl: "https://todoist.com/app/settings/integrations",

  // Determines the display name of the connected account.
  getConnectionName: async function (context) {
    let response = await context.fetcher.fetch({
      method: "GET",
      url: "https://api.todoist.com/api/v1/user",
    });
    return response.body.full_name;
  },
});

// Allow the pack to make requests to Todoist.
pack.addNetworkDomain("todoist.com");
