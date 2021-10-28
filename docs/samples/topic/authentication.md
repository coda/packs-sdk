---
title: Authentication
---

# Authentication samples

The SDK broadly divides authentication into two categories: authentication that is tied to the user of the pack vs authentication that is managed by the system, aka the pack author. In the pack definition the former is known as `defaultAuthentication` and the latter `systemConnectionAuthentication`. You will typically specify one or the other in your pack definition, or neither if your pack does not make http requests or those requests do not require authentication.

Default authentication is the most common. Specify this if each user of your pack should log in with OAuth, or have their own API key, or whatever user-specific token is necessary for the pack to be able to retrieve data that is specific to that user.

Use system authentication if you as the pack author will provide the necessary tokens to successfully make http requests within your pack. An example would be if your pack returns weather forecasts and the API involved requires an API key, but individual users need not provide their own API key. You as the pack author will register an API key and provide it to Coda, and Coda will apply it to all pack requests regardless of the user.

=== "Template"
    ```ts
    pack.setUserAuthentication({
      type: coda.AuthenticationType.HeaderBearerToken,
    });
    ```
=== "OAuth2 (Todoist)"
    ```ts
    import * as coda from "@codahq/packs-sdk";
    export const pack = coda.newPack();

    // Allow the pack to make requests to Todoist.
    pack.addNetworkDomain("todoist.com");

    // Adds OAuth2 authentication for the Todoist API.
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
    ```
