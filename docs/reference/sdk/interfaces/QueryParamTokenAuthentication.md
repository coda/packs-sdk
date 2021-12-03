# Interface: QueryParamTokenAuthentication

Authenticate using a token that is passed as a URL parameter with each request, e.g.
https://example.com/api?paramName=token

The parameter name is defined in the [paramName](QueryParamTokenAuthentication.md#paramname) property.

## Hierarchy

- [`BaseAuthentication`](BaseAuthentication.md)

  ↳ **`QueryParamTokenAuthentication`**

## Properties

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

### paramName

• **paramName**: `string`

The name of the query parameter that will include the token,
e.g. "foo" if a token is passed as "foo=bar".

#### Defined in

[types.ts:349](https://github.com/coda/packs-sdk/blob/main/types.ts#L349)

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

### type

• **type**: [`QueryParamToken`](../enums/AuthenticationType.md#queryparamtoken)

Identifies this as QueryParamToken authentication.

#### Defined in

[types.ts:344](https://github.com/coda/packs-sdk/blob/main/types.ts#L344)
