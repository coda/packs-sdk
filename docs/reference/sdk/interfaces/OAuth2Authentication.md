# Interface: OAuth2Authentication

Authenticate using OAuth2. You must specify the authorization URL, token exchange URL, and
scopes here as part of the pack definition. You'll provide the application's client ID and
client secret in the pack management UI, so that these can be stored securely.

The API must use a (largely) standards-compliant implementation of OAuth2.

## Hierarchy

- `BaseAuthentication`

  ↳ **`OAuth2Authentication`**

## Properties

### additionalParams

• `Optional` **additionalParams**: `Object`

Option custom URL parameters and values that should be included when redirecting the
user to the [authorizationUrl](OAuth2Authentication.md#authorizationurl).

#### Index signature

▪ [key: `string`]: `any`

#### Defined in

[types.ts:381](https://github.com/coda/packs-sdk/blob/main/types.ts#L381)

___

### authorizationUrl

• **authorizationUrl**: `string`

The URL to which the user will be redirected in order to authorize this pack.
This is typically just a base url with no parameters. Coda will append the `scope`
parameter automatically. If the authorization flow requires additional parameters,
they may be specified using [additionalParams](OAuth2Authentication.md#additionalparams).

#### Defined in

[types.ts:356](https://github.com/coda/packs-sdk/blob/main/types.ts#L356)

___

### defaultConnectionType

• `Optional` **defaultConnectionType**: [`DefaultConnectionType`](../enums/DefaultConnectionType.md)

Indicates the defualt manner in which a user's account is expected to be used by this pack,
e.g. is this account used for retrieving data, taking actions, or both.
See https://help.coda.io/en/articles/4587167-what-can-coda-access-with-packs#h_40472431f0

#### Inherited from

BaseAuthentication.defaultConnectionType

#### Defined in

[types.ts:221](https://github.com/coda/packs-sdk/blob/main/types.ts#L221)

___

### endpointDomain

• `Optional` **endpointDomain**: `string`

When requiresEndpointUrl is set to true this should be the root domain that all endpoints share.
For example, this value would be "example.com" if specific endpoints looked like {custom-subdomain}.example.com.

For packs that make requests to multiple domains (uncommon), this should be the domain within
[networkDomains](PackDefinition.md#networkdomains) that this configuration applies to.

#### Inherited from

BaseAuthentication.endpointDomain

#### Defined in

[types.ts:243](https://github.com/coda/packs-sdk/blob/main/types.ts#L243)

___

### endpointKey

• `Optional` **endpointKey**: `string`

In rare cases, OAuth providers will return the specific API endpoint domain for the user as
part of the OAuth token exchange response. If so, this is the property in the OAuth
token exchange response JSON body that points to the endpoint.

The endpoint will be saved along with the account and will be available during execution
as [ExecutionContext.endpoint](ExecutionContext.md#endpoint).

#### Defined in

[types.ts:391](https://github.com/coda/packs-sdk/blob/main/types.ts#L391)

___

### getConnectionName

• `Optional` **getConnectionName**: [`MetadataFormula`](../types/MetadataFormula.md)

#### Inherited from

BaseAuthentication.getConnectionName

#### Defined in

[types.ts:213](https://github.com/coda/packs-sdk/blob/main/types.ts#L213)

___

### getConnectionUserId

• `Optional` **getConnectionUserId**: [`MetadataFormula`](../types/MetadataFormula.md)

#### Inherited from

BaseAuthentication.getConnectionUserId

#### Defined in

[types.ts:214](https://github.com/coda/packs-sdk/blob/main/types.ts#L214)

___

### instructionsUrl

• `Optional` **instructionsUrl**: `string`

A link to a help article or other page with more instructions about how to set up an account for this pack.

#### Inherited from

BaseAuthentication.instructionsUrl

#### Defined in

[types.ts:226](https://github.com/coda/packs-sdk/blob/main/types.ts#L226)

___

### postSetup

• `Optional` **postSetup**: `SetEndpoint`[]

One or more setup steps to run after the user has set up the account, before completing installation of the pack.
This is not common.

#### Inherited from

BaseAuthentication.postSetup

#### Defined in

[types.ts:249](https://github.com/coda/packs-sdk/blob/main/types.ts#L249)

___

### requiresEndpointUrl

• `Optional` **requiresEndpointUrl**: `boolean`

If true, indicates this has pack has a specific endpoint domain for each account, that is used
as the basis of HTTP requests. For example, API requests are made to <custom-subdomain>.example.com
rather than example.com. If true, the user will be prompted to provide their specific endpoint domain
when creating a new account.

#### Inherited from

BaseAuthentication.requiresEndpointUrl

#### Defined in

[types.ts:234](https://github.com/coda/packs-sdk/blob/main/types.ts#L234)

___

### scopes

• `Optional` **scopes**: `string`[]

Scopes that are required to use this pack.

Each API defines its own list of scopes, or none at all. You should consult
the documentation for the API you are connecting to.

#### Defined in

[types.ts:368](https://github.com/coda/packs-sdk/blob/main/types.ts#L368)

___

### tokenPrefix

• `Optional` **tokenPrefix**: `string`

A custom prefix to be used when passing the access token in the HTTP Authorization
header when making requests. Typically this prefix is `Bearer` which is what will be
used if this value is omitted. However, some services require a different prefix.
When sending authenticated requests, a HTTP header of the form
`Authorization: <tokenPrefix> <token>` will be used.

#### Defined in

[types.ts:376](https://github.com/coda/packs-sdk/blob/main/types.ts#L376)

___

### tokenQueryParam

• `Optional` **tokenQueryParam**: `string`

In rare cases, OAuth providers ask that a token is passed as a URL parameter
rather than an HTTP header. If so, this is the name of the URL query parameter
that should contain the token.

#### Defined in

[types.ts:398](https://github.com/coda/packs-sdk/blob/main/types.ts#L398)

___

### tokenUrl

• **tokenUrl**: `string`

The URL that Coda will hit in order to exchange the temporary code for an access token
at the end of the OAuth handshake flow.

#### Defined in

[types.ts:361](https://github.com/coda/packs-sdk/blob/main/types.ts#L361)

___

### type

• **type**: [`OAuth2`](../enums/AuthenticationType.md#oauth2)

#### Defined in

[types.ts:349](https://github.com/coda/packs-sdk/blob/main/types.ts#L349)
