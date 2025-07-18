---
nav: Authentication
description: Samples that show how to authenticate with an API.
icon: material/account-key
---

# Authentication samples

Adding authentication to your Pack allows you to pass credentials with your API requests. Simply specify the type of authentication to use and Coda will collect the credentials from the user, store them, and apply them to Fetcher requests. Per-user authentication is the most common, where each user connects to their own account, while system-wide authentication is used in cases where the Pack maker's keys are used for all users.

Coda supports a fixed set of authentication types which cover the most common patterns that APIs use. In addition you can define your own form of custom token authentication to support more complex scenarios. It's not possible to write completely custom authentication code however, as Coda alone has access to the user's credentials.


[Learn More](../../guides/basics/authentication/index.md){ .md-button }

## Authorization header
Authentication that passes a long-lived token in the Authorization header using the &quot;Bearer&quot; scheme. This sample connects to the Todoist API.

```ts
{% raw %}
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Per-user authentication to the Todoist API, using a personal API token in
// an "Authorization: Bearer ..." header.
pack.setUserAuthentication({
  type: coda.AuthenticationType.HeaderBearerToken,
  instructionsUrl: "https://todoist.com/app/settings/integrations",

  // Determines the display name of the connected account.
  getConnectionName: async function (context) {
    let url = coda.withQueryParams("https://api.todoist.com/sync/v9/sync", {
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
{% endraw %}
```
## Custom header
Authentication that passes a long-lived token in a custom header. This sample connects to RapidAPI.

```ts
{% raw %}
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
{% endraw %}
```
## Multiple headers
Authentication that passes multiple long-lived token in a HTTP headers. This sample connects to the Copper API.

```ts
{% raw %}
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Per-user authentication to the Copper API, using multiple HTTP headers.
// See https://developer.copper.com/introduction/requests.html#headers.
pack.setUserAuthentication({
  type: coda.AuthenticationType.MultiHeaderToken,
  headers: [
    { name: "X-PW-AccessToken", description: "API key" },
    { name: "X-PW-UserEmail", description: "Email address" },
  ],

  // Determines the display name of the connected account.
  getConnectionName: async function (context) {
    let response = await context.fetcher.fetch({
      method: "GET",
      url: "https://api.copper.com/developer_api/v1/account",
      headers: {
        "X-PW-Application": "developer_api",
      },
    });
    let account = response.body;
    return account.name;
  },
});

// Allow the pack to make requests to Copper.
pack.addNetworkDomain("copper.com");
{% endraw %}
```
## Query parameter
Authentication that passes a long-lived token in a query parameter. This sample connects to the Giphy API.

```ts
{% raw %}
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
{% endraw %}
```
## Multiple query parameters
Authentication that passes multiple long-lived tokens in query parameters. This sample connects to the Smarty API.

```ts
{% raw %}
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Per-user authentication to the Smarty API, using multiple query parameters.
// See https://www.smarty.com/docs/cloud/authentication#keypairs
pack.setUserAuthentication({
  type: coda.AuthenticationType.MultiQueryParamToken,
  params: [
    { name: "auth-id", description: "The Auth ID of the secret key." },
    { name: "auth-token", description: "The Auth Token of the secret key." },
  ],
});

// Allow the pack to make requests to Smarty.
pack.addNetworkDomain("smartystreets.com");
{% endraw %}
```
## Custom tokens
Authentication that passes any number of custom tokens in the URL, headers, or request body. This sample connects to the Vonage SMS API.

```ts
{% raw %}
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Per-user authentication to the Vonage API, using an API key and secret
// in the request body.
// See https://developer.vonage.com/en/api/sms
pack.setUserAuthentication({
  type: coda.AuthenticationType.Custom,
  params: [
    { name: "api_key", description: "API key." },
    { name: "api_secret", description: "API secret." },
  ],
});

pack.addFormula({
  name: "SendSMS",
  description: "Sends an SMS message.",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "from",
      description: "The phone number to send from.",
    }),
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "to",
      description: "The phone number to send to.",
    }),
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "text",
      description: "The text of the message.",
    }),
  ],
  resultType: coda.ValueType.String,
  isAction: true,
  execute: async function ([from, to, text], context) {
    // Create the placeholders for the API key and secret.
    let invocationToken = context.invocationToken;
    let apiKeyPlaceholder = "{{api_key-" + invocationToken + "}}";
    let apiSecretPlaceholder = "{{api_secret-" + invocationToken + "}}";

    // Construct the JSON request body.
    let body = {
      from: from,
      to: to,
      text: text,
      // These placeholders will be automatically replaced with the user's key
      // and secret before the request is made.
      api_key: apiKeyPlaceholder,
      api_secret: apiSecretPlaceholder,
    };

    let response = await context.fetcher.fetch({
      method: "POST",
      url: "https://rest.nexmo.com/sms/json",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    let message = response.body.messages[0];
    if (message.status !== "0") {
      throw new coda.UserVisibleError(message["error-text"]);
    }
    return message["message-id"];
  },
});

// Allow the pack to make requests to Vonage (former Nexmo).
pack.addNetworkDomain("nexmo.com");
{% endraw %}
```
## Username and password
Authentication that passes a username and password in the Authorization header using the &quot;Basic&quot; scheme. This sample connects to the Twilio API.

```ts
{% raw %}
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Per-user authentication to the Twilio API, using an Account SID and token in
// an "Authorization: Basic ..." header.
// See https://www.twilio.com/docs/usage/requests-to-twilio
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
{% endraw %}
```
## Coda API token
Authentication optimized for connecting to the Coda API, which is a token passed in the Authorization header.

```ts
{% raw %}
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Per-user authentication to the Coda API, using a token in the Authorization
// header.
// See https://coda.io/developers/apis/v1
pack.setUserAuthentication({
  type: coda.AuthenticationType.CodaApiHeaderBearerToken,

  // Creates the token automatically when the Pack is installed.
  shouldAutoAuthSetup: true,
});

// Allow the pack to make requests to Coda.
pack.addNetworkDomain("coda.io");
{% endraw %}
```
## AWS Signature Version 4
Authentication that supports Amazon Web Services (AWS), using an access key and secret. This sample connects to the S3 service.

```ts
{% raw %}
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Per-user authentication to the AWS S3 service, using AWS Signature Version 4.
// The user provides the URL of their S3 bucket as the endpoint, along with an
// access key and secret.
pack.setUserAuthentication({
  type: coda.AuthenticationType.AWSAccessKey,
  instructionsUrl:
    "https://aws.amazon.com/premiumsupport/knowledge-center/create-access-key/",

  // The AWS service to connect to.
  service: "s3",

  // Prompt the user from their S3 bucket URL.
  requiresEndpointUrl: true,
  endpointDomain: "amazonaws.com",

  // Use the bucket name as the display name for the account.
  getConnectionName: async function (context) {
    return context.endpoint.split("//")[1].split(".")[0];
  },
});

pack.addNetworkDomain("amazonaws.com");
{% endraw %}
```
## OAuth2
Authentication that uses the Authorization Code OAuth2 flow. This sample connects to the Todoist API.

```ts
{% raw %}
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Per-user authentication to the Todoist API, using an OAuth2 flow.
// See https://developer.todoist.com/guides/#oauth
pack.setUserAuthentication({
  type: coda.AuthenticationType.OAuth2,
  authorizationUrl: "https://todoist.com/oauth/authorize",
  tokenUrl: "https://todoist.com/oauth/access_token",
  scopes: ["data:read_write"],

  // Determines the display name of the connected account.
  getConnectionName: async function (context) {
    let url = coda.withQueryParams("https://api.todoist.com/sync/v9/sync", {
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
{% endraw %}
```
## OAuth2 client credentials
Authentication that uses the Client Credentials OAuth2 flow. This sample connects to Blizzard&#x27;s Battle.net APIs.

```ts
{% raw %}
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// System-wide authentication to Blizzard's Battle.net APIs, using the OAuth2
// client_credentials flow.
// eslint-disable-next-line max-len
// See https://develop.battle.net/documentation/guides/using-oauth/client-credentials-flow.
pack.setSystemAuthentication({
  type: coda.AuthenticationType.OAuth2ClientCredentials,
  tokenUrl: "https://oauth.battle.net/token",
});

// Allow the pack to make requests to Battle.net.
pack.addNetworkDomain("blizzard.com");
{% endraw %}
```
## Manual endpoint
Authentication that requires users to enter the endpoint URL for their account. This sample connects to the Okta API.

```ts
{% raw %}
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Per-user authentication to the Okta API, using a custom token prefix and
// account-specific endpoints.
// See https://developer.okta.com/docs/reference/core-okta-api/#authentication
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
{% endraw %}
```
## Automatic endpoint
Authentication that automatically determines the account-specific endpoint URL during the OAuth2 flow. This sample connects to the Salesforce API.

```ts
{% raw %}
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Per-user authentication to the Salesforce API, using OAuth2 and an
// automatically determined account-specific endpoint.
// eslint-disable-next-line max-len
// See https://help.salesforce.com/s/articleView?id=sf.remoteaccess_authenticate.htm&type=5
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
{% endraw %}
```
## User-selected endpoint
Authentication that presents a list of endpoints to the user for them to select one. This sample connects to the Jira API.

```ts
{% raw %}
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Per-user authentication to the Jira Cloud API, using OAuth2 with a
// post-submit step to select the instance to connect to. Note that this code
// isn't compatible with Jira Data Center.
// See https://developer.atlassian.com/cloud/confluence/oauth-2-3lo-apps
pack.setUserAuthentication({
  type: coda.AuthenticationType.OAuth2,
  authorizationUrl: "https://auth.atlassian.com/authorize",
  tokenUrl: "https://auth.atlassian.com/oauth/token",
  scopes: ["offline_access", "read:jira-user", "read:jira-work"],
  additionalParams: {
    audience: "api.atlassian.com",
    prompt: "consent",
  },

  // After approving access, the user should select which instance they want to
  // connect to.
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
{% endraw %}
```

