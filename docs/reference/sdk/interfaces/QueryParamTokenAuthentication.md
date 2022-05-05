---
title: "QueryParamTokenAuthentication"
---
# Interface: QueryParamTokenAuthentication

Authenticate using a token that is passed as a URL parameter with each request, e.g.
https://example.com/api?paramName=token

The parameter name is defined in the [paramName](QueryParamTokenAuthentication.md#paramname) property.

## Hierarchy

- [`BaseAuthentication`](BaseAuthentication.md)

  ↳ **`QueryParamTokenAuthentication`**

## Properties

### endpointDomain

• `Optional` **endpointDomain**: `string`

When requiresEndpointUrl is set to true this should be the root domain that all endpoints share.
For example, this value would be "example.com" if specific endpoints looked like {custom-subdomain}.example.com.

For packs that make requests to multiple domains (uncommon), this should be the domain within
[networkDomains](PackDefinition.md#networkdomains) that this configuration applies to.

#### Inherited from

[BaseAuthentication](BaseAuthentication.md).[endpointDomain](BaseAuthentication.md#endpointdomain)

#### Defined in

[types.ts:247](https://github.com/coda/packs-sdk/blob/main/types.ts#L247)

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

[types.ts:215](https://github.com/coda/packs-sdk/blob/main/types.ts#L215)

___

### instructionsUrl

• `Optional` **instructionsUrl**: `string`

A link to a help article or other page with more instructions about how to set up an account for this pack.

#### Inherited from

[BaseAuthentication](BaseAuthentication.md).[instructionsUrl](BaseAuthentication.md#instructionsurl)

#### Defined in

[types.ts:230](https://github.com/coda/packs-sdk/blob/main/types.ts#L230)

___

### networkDomain

• `Optional` **networkDomain**: `string` \| `string`[]

Which domain(s) should get auth credentials, when a pack is configured with multiple domains.
Packs configured with only one domain or with requiredsEndpointUrl set to true can omit this.

Using multiple authenticated network domains is uncommon and requires Coda approval.

#### Inherited from

[BaseAuthentication](BaseAuthentication.md).[networkDomain](BaseAuthentication.md#networkdomain)

#### Defined in

[types.ts:261](https://github.com/coda/packs-sdk/blob/main/types.ts#L261)

___

### paramName

• **paramName**: `string`

The name of the query parameter that will include the token,
e.g. "foo" if a token is passed as "foo=bar".

#### Defined in

[types.ts:331](https://github.com/coda/packs-sdk/blob/main/types.ts#L331)

___

### postSetup

• `Optional` **postSetup**: [`SetEndpoint`](SetEndpoint.md)[]

One or more setup steps to run after the user has set up the account, before completing installation of the pack.
This is not common.

#### Inherited from

[BaseAuthentication](BaseAuthentication.md).[postSetup](BaseAuthentication.md#postsetup)

#### Defined in

[types.ts:253](https://github.com/coda/packs-sdk/blob/main/types.ts#L253)

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

[types.ts:238](https://github.com/coda/packs-sdk/blob/main/types.ts#L238)

___

### type

• **type**: [`QueryParamToken`](../enums/AuthenticationType.md#queryparamtoken)

Identifies this as QueryParamToken authentication.

#### Defined in

[types.ts:326](https://github.com/coda/packs-sdk/blob/main/types.ts#L326)
