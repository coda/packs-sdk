---
title: "BaseAuthentication"
---
# Interface: BaseAuthentication

Base interface for authentication definitions.

## Hierarchy

- **`BaseAuthentication`**

  ↳ [`AWSAccessKeyAuthentication`](AWSAccessKeyAuthentication.md)

  ↳ [`AWSAssumeRoleAuthentication`](AWSAssumeRoleAuthentication.md)

  ↳ [`CodaApiBearerTokenAuthentication`](CodaApiBearerTokenAuthentication.md)

  ↳ [`CustomAuthentication`](CustomAuthentication.md)

  ↳ [`CustomHeaderTokenAuthentication`](CustomHeaderTokenAuthentication.md)

  ↳ [`HeaderBearerTokenAuthentication`](HeaderBearerTokenAuthentication.md)

  ↳ [`MultiQueryParamTokenAuthentication`](MultiQueryParamTokenAuthentication.md)

  ↳ [`OAuth2Authentication`](OAuth2Authentication.md)

  ↳ [`QueryParamTokenAuthentication`](QueryParamTokenAuthentication.md)

  ↳ [`WebBasicAuthentication`](WebBasicAuthentication.md)

## Properties

### endpointDomain

• `Optional` **endpointDomain**: `string`

When requiresEndpointUrl is set to true this should be the root domain that all endpoints share.
For example, this value would be "example.com" if specific endpoints looked like {custom-subdomain}.example.com.

For packs that make requests to multiple domains (uncommon), this should be the domain within
[networkDomains](PackDefinition.md#networkdomains) that this configuration applies to.

#### Defined in

[types.ts:244](https://github.com/coda/packs-sdk/blob/main/types.ts#L244)

___

### getConnectionName

• `Optional` **getConnectionName**: [`MetadataFormula`](../types/MetadataFormula.md)

A function that is called when a user sets up a new account, that returns a name for
the account to label that account in the UI. The users credentials are applied to any
fetcher requests that this function makes. Typically, this function makes an API call
to an API's "who am I" endpoint and returns a username.

If omitted, or if the function returns an empty value, the account will be labeled
with the creating user's Coda username.

#### Defined in

[types.ts:212](https://github.com/coda/packs-sdk/blob/main/types.ts#L212)

___

### instructionsUrl

• `Optional` **instructionsUrl**: `string`

A link to a help article or other page with more instructions about how to set up an account for this pack.

#### Defined in

[types.ts:227](https://github.com/coda/packs-sdk/blob/main/types.ts#L227)

___

### networkDomain

• `Optional` **networkDomain**: `string`

Which domain should get auth credentials, when a pack is configured with multiple domains.
Packs configured with only one domain or with requiredsEndpointUrl set to true can omit this.

#### Defined in

[types.ts:256](https://github.com/coda/packs-sdk/blob/main/types.ts#L256)

___

### postSetup

• `Optional` **postSetup**: [`SetEndpoint`](SetEndpoint.md)[]

One or more setup steps to run after the user has set up the account, before completing installation of the pack.
This is not common.

#### Defined in

[types.ts:250](https://github.com/coda/packs-sdk/blob/main/types.ts#L250)

___

### requiresEndpointUrl

• `Optional` **requiresEndpointUrl**: `boolean`

If true, indicates this has pack has a specific endpoint domain for each account, that is used
as the basis of HTTP requests. For example, API requests are made to <custom-subdomain>.example.com
rather than example.com. If true, the user will be prompted to provide their specific endpoint domain
when creating a new account.

#### Defined in

[types.ts:235](https://github.com/coda/packs-sdk/blob/main/types.ts#L235)
