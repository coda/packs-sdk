---
title: Authentication
---

# Authentication samples

Adding authentication to your Pack allows you to pass credentials with your API requests. Simply specify the type of authentication to use and Coda will collect the credentials from the user, store them, and apply them to Fetcher requests. Per-user authentication is the most common, where each user connects to their own account, while system-wide authentication is used in cases where the Pack maker's keys are used for all users.

Coda supports a fixed set of authentication types which cover the most common patterns that APIs use. In addition you can define your own form of custom token authentication to support more complex scenarios. It's not possible to write completely custom authentication code however, as Coda alone has access to the user's credentials.


[Learn More](../../../guides/advanced/authentication){ .md-button }

## Template (Per-user)
The basic structure of per-user authentication.

```ts
pack.setUserAuthentication({
  type: coda.AuthenticationType.HeaderBearerToken,
});
```
## Template (System-wide)
The basic structure of system-wide authentication.

```ts
pack.setSystemAuthentication({
  type: coda.AuthenticationType.HeaderBearerToken,
});
```
## Authorization header
Authentication that passes a long-lived token in the Authorization header using the &quot;Bearer&quot; scheme. This sample connects to the Todoist API.

```ts
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Per-user authentication to the Todoist API, using a personal API token in
// an "Authorization: Bearer ..." header.
pack.setUserAuthentication({
  type: coda.AuthenticationType.HeaderBearerToken,
  instructionsUrl: "https://todoist.com/app/settings/integrations",

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
```
## Custom header
Authentication that passes a long-lived token in a custom header. This sample connects to RapidAPI.

```ts
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// System-wide authentication to RapidAPI, using an API key in a custom header.
// See https://docs.rapidapi.com/docs/keys#how-to-find-your-api-key.
pack.setSystemAuthentication({
  type: coda.AuthenticationType.CustomHeaderToken,
  headerName: "X-RapidAPI-Key",
});

// Allow the pack to make requests to RapidAPI.
pack.addNetworkDomain("rapidapi.com");
```
## Query parameter
Authentication that passes a long-lived token in a query parameter. This sample connects to the Giphy API.

```ts
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// System-wide authentication to the Giphy API, using an API key in the query
// string. See https://support.giphy.com/hc/en-us/articles/360020283431.
pack.setSystemAuthentication({
  type: coda.AuthenticationType.QueryParamToken,
  paramName: "api_key",
});

// Allow the pack to make requests to Giphy.
pack.addNetworkDomain("giphy.com");
```
## Username and password
Authentication that passes a username and password in the Authorization header using the &quot;Basic&quot; scheme. This sample connects to the Twilio API.

```ts
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Per-user authentication to the Twilio API, using an Account SID and token in
// an "Authorization: Basic ..." header.
pack.setUserAuthentication({
  type: coda.AuthenticationType.WebBasic,
  instructionsUrl: "https://www.twilio.com/docs/sms/api#sms-api-authentication",

  // Use Twilio-specific placeholders for the username and password fields.
  uxConfig: {
    placeholderUsername: "Account SID",
    placeholderPassword: "Auth Token",
  },

  // Determines the display name of the connected account.
  getConnectionName: async function(context) {
    let response = await context.fetcher.fetch({
      method: "GET",
      url: "https://api.twilio.com/2010-04-01/Accounts.json",
    });
    // Return the name of the main account.
    return response.body.accounts[0].friendly_name;
  },
});

// Allow the pack to make requests to Twilio.
pack.addNetworkDomain("twilio.com");
```
## OAuth2
Authentication that uses an OAuth2 flow. This sample connects to the Todoist API.

```ts
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
```
## Manual endpoint
Authentication that requires users to enter the endpoint URL for their account. This sample connects to the Okta API.

```ts
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Per-user authentication to the Okta API, using a custom token prefix and
// account-specific endpoints.
pack.setUserAuthentication({
  type: coda.AuthenticationType.CustomHeaderToken,
  headerName: "Authorization",
  tokenPrefix: "SSWS",

  // Ask users for their Okta subdomain.
  requiresEndpointUrl: true,
  endpointDomain: "okta.com",

  // Determines the display name of the connected account.
  getConnectionName: async function(context) {
    // Retrieve the endpoint that the user set.
    let endpoint = context.endpoint;
    let url = endpoint + "/api/v1/org";
    let response = await context.fetcher.fetch({
      method: "GET",
      url: url,
    });
    return response.body.companyName;
  },
});

// Allow the pack to make requests to Okta.
pack.addNetworkDomain("okta.com");
```
## Automatic endpoint
Authentication that automatically determines the account-specific endpoint URL during the OAuth2 flow. This sample connects to the Salesforce API.

```ts
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Per-user authentication to the Salesforce API, using OAuth2 and an
// automatically determined account-specific endpoint.
pack.setUserAuthentication({
  type: coda.AuthenticationType.OAuth2,
  authorizationUrl: "https://login.salesforce.com/services/oauth2/authorize",
  tokenUrl: "https://login.salesforce.com/services/oauth2/token",
  scopes: ["id", "api", "refresh_token"],
  additionalParams: {
    prompt: "consent",
  },

  // Each account is associated with an instance URL, returned in the OAuth
  // token response.
  requiresEndpointUrl: true,
  endpointDomain: "salesforce.com",
  endpointKey: "instance_url",

  // Determines the display name of the connected account.
  getConnectionName: async function (context) {
    // Relative URLs have the endpoint URL automatically prepended.
    let url = "/services/oauth2/userinfo";
    let response = await context.fetcher.fetch({
      method: "GET",
      url: url,
    });
    return response.body.name;
  },
});

// Allow the pack to make requests to Salesforce.
pack.addNetworkDomain("salesforce.com");
```
## User-selected endpoint
Authentication that presents a list of endpoints to the user for them to select one. This sample connects to the Jira API.

```ts
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Per-user authentication to the Jira API, using OAuth2 with a post-submit step
// to select the instance to connect to.
pack.setUserAuthentication({
  type: coda.AuthenticationType.OAuth2,
  authorizationUrl: "https://auth.atlassian.com/authorize",
  tokenUrl: "https://auth.atlassian.com/oauth/token",
  scopes: ["offline_access", "read:jira-user", "read:jira-work"],
  additionalParams: {
    audience: "api.atlassian.com",
    prompt: "consent",
    response_type: "code",
  },

  // After approving access, the user should select which instance they want to
  // connect to.
  requiresEndpointUrl: true,
  endpointDomain: "atlassian.com",
  postSetup: [{
    type: coda.PostSetupType.SetEndpoint,
    name: "SelectEndpoint",
    description: "Select the site to connect to:",
    // Determine the list of sites they have access to.
    getOptions: async function (context) {
      let url = "https://api.atlassian.com/oauth/token/accessible-resources";
      let response = await context.fetcher.fetch({
        method: "GET",
        url: url,
      });
      let sites = response.body;
      return sites.map(site => {
        // Constructing an endpoint URL from the site ID.
        let url = "https://api.atlassian.com/ex/jira/" + site.id;
        return { display: site.name, value: url };
      });
    },
  }],

  // Determines the display name of the connected account.
  getConnectionName: async function (context) {
    // This function is run twice: once before the site has been selected and
    // again after. When the site hasn't been selected yet, return a generic
    // name.
    if (!context.endpoint) {
      return "Jira";
    }
    // Include both the name of the user and server.
    let server = await getServer(context);
    let user = await getUser(context);
    return `${user.displayName} (${server.serverTitle})`;
  },
});

// Get information about the Jira server.
async function getServer(context: coda.ExecutionContext) {
  let url = "/rest/api/3/serverInfo";
  let response = await context.fetcher.fetch({
    method: "GET",
    url: url,
  });
  return response.body;
}

// Get information about the Jira user.
async function getUser(context: coda.ExecutionContext) {
  let url = "/rest/api/3/myself";
  let response = await context.fetcher.fetch({
    method: "GET",
    url: url,
  });
  return response.body;
}

// Allow the pack to make requests to Jira.
pack.addNetworkDomain("atlassian.com");
```

