---
nav: OAuth
description: Configure authentication for an API that uses OAuth2.
---

# Authenticating using OAuth

[OAuth 2.0][oauth_definition] is a modern, more secure alternative to passing usernames and passwords that has been adopted by many APIs. The details of this protocol can get complicated, but when building a Pack you only need to specify some configuration options and Coda handles the token exchange, storage, refresh, etc.

Read the [Authentication guide][authentication] for more information about how to authenticate users in Packs.

[Try Tutorial][tutorial_oauth2]{ .md-button .md-button--primary }
[View Sample Code][sample_oauth2]{ .md-button }

!!! warning "OAuth 1.0 not supported"
    Coda doesn't currently support the older 1.0 or 1.0a versions of the OAuth specification. If you would like to connect to an API that only supports these versions of the standard please [contact support][support] so that we can continue to gauge interest.


## Setup OAuth authentication

To enable your Pack to authenticate users with OAuth you need to configure the OAuth flow and enter your developer credentials.


### Add configuration code

To configure [`OAuth2`][OAuth] authentication you must specify the authorization URL and the token URL. These URLs are found in the technical documentation of the API you are connecting to, and will be different for each API.

```ts
pack.setUserAuthentication({
  type: coda.AuthenticationType.OAuth2,
  // These URLs come from the API's developer documentation.
  authorizationUrl: "https://example.com/authorize",
  tokenUrl: "https://api.example.com/token",
});
```

Many APIs also support granular scopes, allowing you to request a limited set of permissions from the user. These can be specified as an array in the `scopes` field:

```ts
pack.setUserAuthentication({
  type: coda.AuthenticationType.OAuth2,
  // These URLs come from the API's developer documentation.
  authorizationUrl: "https://example.com/authorize",
  tokenUrl: "https://api.example.com/token",
  scopes: ["user", "projects", "tasks"],
});
```

There are many subtle variations to the OAuth2 flow, and Coda can accommodate a variety of them. You can find the additional configuration options in the [`OAuth2Authentication`][OAuth2Authentication] documentation, as well as [sample code][sample_apis] showing how to setup OAuth for the most popular APIs.

However if the API provider deviates too far from the OAuth 2.0 specification it may not be possible to find a configuration that will work. Additionally, Coda currently only supports the [Authorization Code][oauth2_code] grant type, and others like [Client Credentials][oauth2_client] can't be used. If you get stuck please [contact support][support] to explore other options.

??? note "Flexible authentication during token exchange"
    The OAuth2 specification doesn't require a specific authentication schema your app must use when exchanging tokens. Coda supports the two most popular variants:

    1. Sending the `client_secret` in the JSON body
    1. Sending an `Authorization: Basic` header using the client ID and secret.

    No configuration is required, Coda will try them both to see what works.

### Set developer credentials

After you add the configuration code, build a new version of your Pack and then navigate to the **Settings** tab. There you'll see an **Add OAuth Credentials** button you can use to set the Pack's credentials.

<img src="../../../../images/auth_oauth.png" srcset="../../../../images/auth_oauth_2x.png 2x" class="screenshot" alt="Setting the OAuth client ID and secret">

These credentials identify your application and are the same for every user that uses your Pack. You need to obtain these credentials from the API provider, typically by registering your application in the provider's developer console or portal. These values are typically called the client ID and secret, but may in some cases be referred to using terms like "consumer" or "application".


#### Redirect URL

When registering you application in the API provider's console you will be asked to provide a redirect URL. This is where the provider should redirect the user to after they have signed in and approved access.

The **Add OAuth credentials** dialog discussed above will show the redirect URL to use for your Pack and allow you to copy it to your clipboard. In general it follows the pattern:

```
https://coda.io/packsAuth/oauth2/{PACK ID}
```

!!! warning "Legacy redirect URLs"
    Previously the redirect URL for a Pack didn't include the Pack ID. We still support this using the **Legacy** option in the dropdown menu, but for greater security Packs should migrate to using the newer Pack-specific URLs.


## Token expiry and refresh

Many APIs return short-lived access tokens which expire after a few hours. Coda doesn't track the expiration of these tokens, but instead waits for an API request using the token to fail before attempting to refresh it. Specifically, Coda only does a refresh when:

- The Pack execution fails with a [`StatusCodeError`][statuscodeerror] with a 401 status (Unauthorized)
- The OAuth provider returned a `refresh_token` during a previous token exchange

If you have error handling in your Pack, make sure to re-throw these 401 errors so that the token refresh process takes place.

```ts
try {
  let response = await context.fetcher.fetch({
    // ...
  });
  // ...
} catch (error) {
  if (error.statusCode == 401) {
    // Perhaps the token has expired, re-throw the error to attempt a refresh.
    throw error;
  }
  // Else handle or throw the error as normal.
}
```


## Additional scopes

As your pack grows you may find that you need to request more OAuth scopes than you initially did when your existing users connected. Coda allows new scopes to be added to Pack OAuth settings in a non-breaking way: we don't prompt the user to re-authorize until they try to use a Pack feature that fails. Once that happens, we notice that the connection the user was using was created with a stale list of OAuth scopes and we prompt them to re-authenticate it to get your new scopes.


### Triggering a prompt

Normally the user will be prompted to approve new scopes if the Pack fails with a [`StatusCodeError`][statuscodeerror] with a 403 status (Forbidden). However some APIs may fail with different status codes, or only return partial information, if scopes are missing. In those cases you can detect the problem in your code and throw a [`MissingScopesError`][missingscopeserror] to trigger the prompt.

```ts
try {
  let response = context.fetcher.fetch({
    // ...
  });
} catch (error) {
  // Determine if the error is due to missing scopes.
  if (error.statusCode == 400 && error.body?.message.includes("permission")) {
    throw new coda.MissingScopesError();
  }
  // Else handle or throw the error as normal.
}
```


### Incremental authorization

Even when you do know all of the scopes you need, you may not want to request them all at once. An approval screen with a long list of permissions can be intimidating to new users and some my choose to abandon your Pack. In these cases you may want to use incremental authorization, made possible in Packs by the formula field [`extraOAuthScopes`][extraOAuthScopes]. You can use it to specify additional scopes that are needed in order to run a specific formula.

```ts
pack.setUserAuthentication({
  type: coda.AuthenticationType.OAuth2,
  // ...
  scopes: ["read"],
});

// ...

pack.addFormula({
  name: "UpdateItem",
  // ...
  isAction: true,
  extraOAuthScopes: ["update"],
  // ...
});
```

When the Pack above is installed the user will only be required to grant access to the `read` scope. However, when they try to use the `UpdateItem` action formula and it fails they will then be prompted to grant additional access to the `write` scope. This prompt is displayed as a pop-up dialog at the bottom of the doc:

<img src="../../../../images/auth_oauth_incremental.png" srcset="../../../../images/auth_oauth_incremental_2x.png 2x" class="screenshot" alt="Prompting the user for additional permissions">

When the user signs in again they will be prompted to approve the additional scopes, after which they will be able to use the formula successfully.


## URL limitations {: #url-limitations}

Some services host a unique domain or subdomain for each account, and require that API requests be sent there. The [account-specific endpoints][auth_endpoints] feature can be used to determine the endpoint for a given account, but it assumes that the user has already authenticated using a common set of OAuth URLs.

It currently isn't possible to change the `authorizationUrl` and `tokenUrl` dynamically or prompt the user to specify them. One workaround is to create a copy of the Pack for each domain you want to connect to, but that obviously doesn't scale well.

Additionally, in order to prevent abuse, Coda enforces the `authorizationUrl` and `tokenUrl` configured have the same domain. This is almost always true, but in rare cases an API provider may use a different URL for each. To request an exemption from this restriction fill out the [Approval request form][support_network_domains].

!!! info "OAuth domain and network domain"
    The domain of the OAuth configuration URLs does not need to match the [network domain][fetcher_network_domains] configured for fetcher requests. This is convenient for services where the OAuth provider is a 3rd party (Okta, Auth0, etc).


## Advanced settings

Depending on the OAuth provider you are connecting to, you may need to utilize these additional settings when configuring OAuth.


### Proof Key for Code Exchange (PKCE)

Some OAuth providers offer or require the use of [Proof Key for Code Exchange (PKCE)][oauth_pkce] during the OAuth flow. It is an additional flow layered on top of the standard Authorization Code flow that increases security by helping prevent against certain forms of attack. To use it in a Pack you simply need to enable the feature using the `useProofKeyForCodeExchange` field of the authentication configuration.

```{.ts hl_lines="4"}
pack.setUserAuthentication({
  type: coda.AuthenticationType.OAuth2,
  // ...
  useProofKeyForCodeExchange: true,
});
```

The PKCE standard supports two different ways of creating a challenge from the verifier: `S256` (the default) and `plain`. Coda will use the more secure `S256` method by default, but you can override it using the `pkceChallengeMethod` field.

```{.ts hl_lines="5"}
pack.setUserAuthentication({
  type: coda.AuthenticationType.OAuth2,
  // ...
  useProofKeyForCodeExchange: true,
  pkceChallengeMethod: "plain",
});
```


[oauth_definition]: https://oauth.net/2/
[authentication]: index.md
[OAuth]: ../../../reference/sdk/enums/core.AuthenticationType.md#oauth2
[OAuth2Authentication]: ../../../reference/sdk/interfaces/core.OAuth2Authentication.md
[oauth2_code]: https://www.oauth.com/oauth2-servers/server-side-apps/authorization-code/
[oauth2_client]: https://www.oauth.com/oauth2-servers/access-tokens/client-credentials/
[extraOAuthScopes]: ../../../reference/sdk/interfaces/core.BaseFormulaDef.md#extraoauthscopes
[support]: ../../../support/index.md
[support_network_domains]: ../../../support/index.md#network-domains
[sample_oauth2]: ../../../samples/topic/authentication.md#oauth2
[sample_apis]: ../../../samples/topic/apis.md
[tutorial_oauth2]: ../../../tutorials/build/oauth.md
[statuscodeerror]: ../../../reference/sdk/classes/core.StatusCodeError.md
[missingscopeserror]: ../../../reference/sdk/classes/core.MissingScopesError.md
[auth_endpoints]: index.md#endpoints
[fetcher_network_domains]: ../fetcher.md#network-domains
[oauth_pkce]: https://www.oauth.com/oauth2-servers/pkce/
