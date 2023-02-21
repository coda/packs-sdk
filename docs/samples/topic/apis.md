---
nav: API setup
description: Samples that show how to configure a Pack to connect to various popular APIs.
icon: material/api
---

# API setup samples

When connecting to an external API the most difficult part can be translating their technical documentation to the configuration options available in Packs, specifically the authentication required. This set of examples shows how to setup a Pack to connect to various popular APIs.



## Asana
The Asana API uses OAuth2 to authenticate users, and requires the use of PKCE.

```ts
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Per-user authentication to the Asana API, using OAuth2.
// See https://developers.asana.com/docs/oauth
pack.setUserAuthentication({
  type: coda.AuthenticationType.OAuth2,
  authorizationUrl: "https://app.asana.com/-/oauth_authorize",
  tokenUrl: "https://app.asana.com/-/oauth_token",

  // Enable PKCE (required).
  useProofKeyForCodeExchange: true,

  // Determines the display name of the connected account.
  getConnectionName: async function (context) {
    let response = await context.fetcher.fetch({
      method: "GET",
      url: "https://app.asana.com/api/1.0/users/me",
    });
    let user = response.body.data;
    return user.name;
  },
});

// Allow the pack to make requests to Asana.
pack.addNetworkDomain("asana.com");
```
## Board Game Atlas
The Board Game Atlas API requires the developer to provide their client ID as query parameter.

```ts
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Authenticate using a client ID.
// See: https://www.boardgameatlas.com/api/docs/apps
pack.setSystemAuthentication({
  type: coda.AuthenticationType.QueryParamToken,
  paramName: "client_id",
});

pack.addNetworkDomain("boardgameatlas.com");
```
## ClickUp
The ClickUp API uses OAuth2 to authenticate users.

```ts
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Per-user authentication to the ClickUp API, using OAuth2.
// See https://clickup.com/api
pack.setUserAuthentication({
  type: coda.AuthenticationType.OAuth2,
  authorizationUrl: "https://app.clickup.com/api",
  tokenUrl: "https://app.clickup.com/api/v2/oauth/token",

  // Determines the display name of the connected account.
  getConnectionName: async function (context) {
    let response = await context.fetcher.fetch({
      method: "GET",
      url: "https://api.clickup.com/api/v2/user",
    });
    let user = response.body.user;
    return user.username;
  },
});

// Allow the pack to make requests to the ClickUp.
pack.addNetworkDomain("clickup.com");
```
## Coda API
The Coda API requires the user to provide an API token, passed in an Authorization header. Packs include a specific authentication type optimized for the Coda API.

```ts
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
```
## Dropbox
The Dropbox API uses OAuth2 to authenticate users, prompting them to approve a specific set of scopes. Additional parameters are requires on the authorization URL to ensure that offline access is granted.

```ts
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
```
## Facebook (Meta)
The Facebook (Meta) APIs use OAuth2 to authenticate users, prompting them to approve a specific set of scopes.

```ts
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Per-user authentication to Facebook (Meta) APIs, using OAuth2.
// eslint-disable-next-line max-len
// See https://developers.facebook.com/docs/facebook-login/guides/advanced/manual-flow
pack.setUserAuthentication({
  type: coda.AuthenticationType.OAuth2,
  authorizationUrl: "https://www.facebook.com/v14.0/dialog/oauth",
  tokenUrl: "https://graph.facebook.com/v14.0/oauth/access_token",

  // All scopes: https://developers.facebook.com/docs/permissions/reference
  scopes: [
    "public_profile",
  ],

  // Determines the display name of the connected account.
  getConnectionName: async function (context) {
    let response = await context.fetcher.fetch({
      method: "GET",
      url: "https://graph.facebook.com/v14.0/me",
    });
    let user = response.body;
    return user.name;
  },
});

// Allow the pack to make requests to Facebook.
pack.addNetworkDomain("facebook.com");
```
## Giphy
The Giphy API requires the developer to provide their API key as query parameter.

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
## GitHub
The GitHub API uses OAuth2 to authenticate users, prompting them to approve a specific set of scopes. The authorization header uses the non-standard prefix &quot;token&quot; instead of the default &quot;Bearer&quot;.

```ts
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Setup per-user authentication using GitHub's OAuth2.
// Remember to set your client ID and secret in the "Settings" tab.
// See https://docs.github.com/en/developers/apps/building-oauth-apps
pack.setUserAuthentication({
  type: coda.AuthenticationType.OAuth2,
  authorizationUrl: "https://github.com/login/oauth/authorize",
  tokenUrl: "https://github.com/login/oauth/access_token",
  tokenPrefix: "token",
  scopes: ["repo", "user"],

  // Determines the name of the GitHub account that was connected.
  getConnectionName: async function (context) {
    let response = await context.fetcher.fetch({
      method: "GET",
      url: "https://api.github.com/user",
    });
    return response.body.login;
  },
});

// Allow the Pack to access the GitHub domain.
pack.addNetworkDomain("github.com");
```
## Google
The Google APIs use OAuth2 to authenticate users, prompting them to approve a specific set of scopes. Additional parameters are requires on the authorization URL to ensure that offline access is granted. Note: It currently isn&#x27;t possible to complete Google&#x27;s OAuth verification process with a Pack. See the [FAQ](https://coda.io/packs/build/latest/guides/faq/#google) for more information.

```ts
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Per-user authentication to Google APIs, using OAuth2.
// See https://developers.google.com/identity/protocols/oauth2/web-server
pack.setUserAuthentication({
  type: coda.AuthenticationType.OAuth2,
  authorizationUrl: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenUrl: "https://oauth2.googleapis.com/token",

  // All scopes: https://developers.google.com/identity/protocols/oauth2/scopes
  scopes: [
    "profile",
  ],

  // Additional parameters to ensure a refresh_token is returned.
  additionalParams: {
    access_type: "offline",
    prompt: "consent",
  },

  // Determines the display name of the connected account.
  getConnectionName: async function (context) {
    let response = await context.fetcher.fetch({
      method: "GET",
      url: "https://www.googleapis.com/oauth2/v1/userinfo",
    });
    let user = response.body;
    return user.name;
  },
});

// Allow the pack to make requests to Google.
pack.addNetworkDomain("googleapis.com");
```
## Jira
The Jira API uses OAuth2 to authenticate users. After authenticating users must select which Jira instance to associate the account with, and all further API requests are sent to that instance&#x27;s URL.

```ts
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Per-user authentication to the Jira API, using OAuth2 with a post-submit step
// to select the instance to connect to.
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
## Microsoft
The Microsoft APIs use OAuth2 to authenticate users, prompting them to approve a specific set of scopes. Additional parameters are requires on the authorization URL to ensure that offline access is granted, and PKCE is recommended.

```ts
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Per-user authentication to Microsoft APIs, using OAuth2.
// eslint-disable-next-line max-len
// See https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-auth-code-flow
pack.setUserAuthentication({
  type: coda.AuthenticationType.OAuth2,
  authorizationUrl:
    "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
  tokenUrl: "https://login.microsoftonline.com/common/oauth2/v2.0/token",

  // eslint-disable-next-line max-len
  // Learn more: https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent
  scopes: [
    "offline_access",
    "user.read",
  ],

  // Additional parameters to ensure a refresh_token is returned.
  additionalParams: {
    prompt: "consent",
  },

  // Enable PKCE (optional but recommended).
  useProofKeyForCodeExchange: true,

  // Determines the display name of the connected account.
  getConnectionName: async function (context) {
    let response = await context.fetcher.fetch({
      method: "GET",
      url: "https://graph.microsoft.com/v1.0/me",
    });
    let user = response.body;
    return user.displayName;
  },
});

// Allow the pack to make requests to Microsoft.
pack.addNetworkDomain("microsoft.com");
```
## Okta
The Okta API requires the user to provide an API key, passed as an Authorization header with a custom prefix. The user must also specify which Okta domain to connect to.

```ts
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
```
## Rapid API
Rapid APIs require that the developer provide an API key, passed in a custom header.

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
## Salesforce
The Salesforce API uses OAuth2 to authenticate users, prompting them to approve a specific set of scopes. Additional parameters are requires on the authorization URL to ensure that offline access is granted. The URL to send API requests is returned in the OAuth2 response, and passed to other formulas.

```ts
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
```
## Todoist
The Todoist API uses OAuth2 to authenticate users, prompting them to approve a specific set of scopes.

```ts
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
```
## Typeform
The Typeform API uses OAuth2 to authenticate users, prompting them to approve a specific set of scopes.

```ts
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Configure per-user authentication for the Typeform API, using OAuth2.
// See: https://developer.typeform.com/get-started/applications/
pack.setUserAuthentication({
  type: coda.AuthenticationType.OAuth2,
  authorizationUrl: "https://api.typeform.com/oauth/authorize",
  tokenUrl: "https://api.typeform.com/oauth/token",

  // See: https://developer.typeform.com/get-started/scopes/
  scopes: ["forms:read", "responses:read", "accounts:read"],

  // Determines the display name of the connected account.
  getConnectionName: async function (context) {
    let url = "https://api.typeform.com/me";
    let response = await context.fetcher.fetch({
      method: "GET",
      url: url,
    });
    let profile = response.body;
    return profile.alias;
  },
});

// Allow requests to Typeform.
pack.addNetworkDomain("typeform.com");
```
## Twilio
The Twilio API requires the user to provide the SID and token for their account, passed using the Web Basic scheme.

```ts
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
```
## Webflow
The Typeform API uses OAuth2 to authenticate users, and requires the developer to specify the API version in a custom header.

```ts
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// The version of the Webflow API to use.
const WebflowApiVersion = "1.0.0";

// Per-user authentication to the ClickUp API, using OAuth2.
// See https://developers.webflow.com/oauth
pack.setUserAuthentication({
  type: coda.AuthenticationType.OAuth2,
  authorizationUrl: "https://webflow.com/oauth/authorize",
  tokenUrl: "https://api.webflow.com/oauth/access_token",

  // Determines the display name of the connected account.
  getConnectionName: async function (context) {
    let response = await context.fetcher.fetch({
      method: "GET",
      url: "https://api.webflow.com/user",
      headers: {
        "Accept-Version": WebflowApiVersion,
      },
    });
    let user = response.body.user;
    return `${user.firstName} ${user.lastName}`;
  },
});

// Allow the pack to make requests to Webflow.
pack.addNetworkDomain("webflow.com");
```
## Yahoo
The Yahoo APIs uses OAuth2 to authenticate users.

```ts
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Setup per-user authentication using Yahoo's OAuth2.
// Remember to set your client ID and secret in the "Settings" tab.
// See https://developer.yahoo.com/oauth2/guide/flows_authcode/
pack.setUserAuthentication({
  type: coda.AuthenticationType.OAuth2,
  authorizationUrl: "https://api.login.yahoo.com/oauth2/request_auth",
  tokenUrl: "https://api.login.yahoo.com/oauth2/get_token",
  scopes: ["openid"],

  // Determines the name of the Yahoo account that was connected.
  getConnectionName: async function (context) {
    let response = await context.fetcher.fetch({
      method: "GET",
      url: "https://api.login.yahoo.com/openid/v1/userinfo",
    });
    let user = response.body;
    return user.name;
  },
});

// Allow the Pack to access the Yahoo domain.
pack.addNetworkDomain("yahoo.com");
```

