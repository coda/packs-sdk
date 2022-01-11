---
title: "OAuth2Authentication"
---
# Interface: OAuth2Authentication

Authenticate using OAuth2. You must specify the authorization URL, token exchange URL, and
scopes here as part of the pack definition. You'll provide the application's client ID and
client secret in the pack management UI, so that these can be stored securely.

The API must use a (largely) standards-compliant implementation of OAuth2.

## Hierarchy

- [`BaseAuthentication`](BaseAuthentication.md)

  ↳ **`OAuth2Authentication`**

## Properties

### additionalParams

• `Optional` **additionalParams**: `Object`

Option custom URL parameters and values that should be included when redirecting the
user to the [authorizationUrl](OAuth2Authentication.md#authorizationurl).

#### Index signature

▪ [key: `string`]: `any`

#### Defined in

[types.ts:424](https://github.com/coda/packs-sdk/blob/main/types.ts#L424)

___

### authorizationUrl

• **authorizationUrl**: `string`

The URL to which the user will be redirected in order to authorize this pack.
This is typically just a base url with no parameters. Coda will append the `scope`
parameter automatically. If the authorization flow requires additional parameters,
they may be specified using [additionalParams](OAuth2Authentication.md#additionalparams).

#### Defined in

[types.ts:392](https://github.com/coda/packs-sdk/blob/main/types.ts#L392)

___

### defaultConnectionType

• `Optional` **defaultConnectionType**: [`DefaultConnectionType`](../enums/DefaultConnectionType.md)

Indicates the default manner in which a user's account is expected to be used by this pack,
e.g. is this account used for retrieving data, taking actions, or both.
See https://help.coda.io/en/articles/4587167-what-can-coda-access-with-packs#h_40472431f0

#### Inherited from

[BaseAuthentication](BaseAuthentication.md).[defaultConnectionType](BaseAuthentication.md#defaultconnectiontype)

#### Defined in

[types.ts:251](https://github.com/coda/packs-sdk/blob/main/types.ts#L251)

___

### endpointDomain

• `Optional` **endpointDomain**: `string`

When requiresEndpointUrl is set to true this should be the root domain that all endpoints share.
For example, this value would be "example.com" if specific endpoints looked like {custom-subdomain}.example.com.

For packs that make requests to multiple domains (uncommon), this should be the domain within
[networkDomains](PackDefinition.md#networkdomains) that this configuration applies to.

#### Inherited from

[BaseAuthentication](BaseAuthentication.md).[endpointDomain](BaseAuthentication.md#endpointdomain)

#### Defined in

[types.ts:273](https://github.com/coda/packs-sdk/blob/main/types.ts#L273)

___

### endpointKey

• `Optional` **endpointKey**: `string`

In rare cases, OAuth providers will return the specific API endpoint domain for the user as
part of the OAuth token exchange response. If so, this is the property in the OAuth
token exchange response JSON body that points to the endpoint.

The endpoint will be saved along with the account and will be available during execution
as [ExecutionContext.endpoint](ExecutionContext.md#endpoint).

#### Defined in

[types.ts:434](https://github.com/coda/packs-sdk/blob/main/types.ts#L434)

___

### getConnectionName

• `Optional` **getConnectionName**: [`MetadataFormula`](../types/MetadataFormula.md)

A function that is called when a user sets up a new account, that returns a name for
the account to label that account in the UI. The users credentials are applied to any
fetcher requests that this function makes. Typically, this function makes an API call
to an API's "who am I" endpoint and returns a username.

If omitted, or if the function returns an empty value, the account will be labeled
with the creating user's Coda username.

#### Inherited from

[BaseAuthentication](BaseAuthentication.md).[getConnectionName](BaseAuthentication.md#getconnectionname)

#### Defined in

[types.ts:234](https://github.com/coda/packs-sdk/blob/main/types.ts#L234)

___

### instructionsUrl

• `Optional` **instructionsUrl**: `string`

A link to a help article or other page with more instructions about how to set up an account for this pack.

#### Inherited from

[BaseAuthentication](BaseAuthentication.md).[instructionsUrl](BaseAuthentication.md#instructionsurl)

#### Defined in

[types.ts:256](https://github.com/coda/packs-sdk/blob/main/types.ts#L256)

___

### postSetup

• `Optional` **postSetup**: [`SetEndpoint`](SetEndpoint.md)[]

One or more setup steps to run after the user has set up the account, before completing installation of the pack.
This is not common.

#### Inherited from

[BaseAuthentication](BaseAuthentication.md).[postSetup](BaseAuthentication.md#postsetup)

#### Defined in

[types.ts:279](https://github.com/coda/packs-sdk/blob/main/types.ts#L279)

___

### requiresEndpointUrl

• `Optional` **requiresEndpointUrl**: `boolean`

If true, indicates this has pack has a specific endpoint domain for each account, that is used
as the basis of HTTP requests. For example, API requests are made to <custom-subdomain>.example.com
rather than example.com. If true, the user will be prompted to provide their specific endpoint domain
when creating a new account.

#### Inherited from

[BaseAuthentication](BaseAuthentication.md).[requiresEndpointUrl](BaseAuthentication.md#requiresendpointurl)

#### Defined in

[types.ts:264](https://github.com/coda/packs-sdk/blob/main/types.ts#L264)

___

### scopeDelimiter

• `Optional` **scopeDelimiter**: ``" "`` \| ``","`` \| ``";"``

The delimiter to use when joining [scopes](OAuth2Authentication.md#scopes) when generating authorization URLs.

The OAuth2 standard is to use spaces to delimit scopes, and Coda will do that by default.
If the API you are using requires a different delimiter, say a comma, specify it here.

#### Defined in

[types.ts:411](https://github.com/coda/packs-sdk/blob/main/types.ts#L411)

___

### scopes

• `Optional` **scopes**: `string`[]

Scopes that are required to use this pack.

Each API defines its own list of scopes, or none at all. You should consult
the documentation for the API you are connecting to.

#### Defined in

[types.ts:404](https://github.com/coda/packs-sdk/blob/main/types.ts#L404)

___

### tokenPrefix

• `Optional` **tokenPrefix**: `string`

A custom prefix to be used when passing the access token in the HTTP Authorization
header when making requests. Typically this prefix is `Bearer` which is what will be
used if this value is omitted. However, some services require a different prefix.
When sending authenticated requests, a HTTP header of the form
`Authorization: <tokenPrefix> <token>` will be used.

#### Defined in

[types.ts:419](https://github.com/coda/packs-sdk/blob/main/types.ts#L419)

___

### tokenQueryParam

• `Optional` **tokenQueryParam**: `string`

In rare cases, OAuth providers ask that a token is passed as a URL parameter
rather than an HTTP header. If so, this is the name of the URL query parameter
that should contain the token.

#### Defined in

[types.ts:441](https://github.com/coda/packs-sdk/blob/main/types.ts#L441)

___

### tokenUrl

• **tokenUrl**: `string`

The URL that Coda will hit in order to exchange the temporary code for an access token
at the end of the OAuth handshake flow.

#### Defined in

[types.ts:397](https://github.com/coda/packs-sdk/blob/main/types.ts#L397)

___

### type

• **type**: [`OAuth2`](../enums/AuthenticationType.md#oauth2)

Identifies this as OAuth2 authentication.

#### Defined in

[types.ts:385](https://github.com/coda/packs-sdk/blob/main/types.ts#L385)
