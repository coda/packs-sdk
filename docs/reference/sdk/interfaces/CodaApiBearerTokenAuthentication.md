# Interface: CodaApiBearerTokenAuthentication

Authenticate using a Coda REST API token, sent as an HTTP header.

This is identical to [HeaderBearerToken](../enums/AuthenticationType.md#headerbearertoken) except the user wil be presented
with a UI to generate an API token rather than needing to paste an arbitrary API
token into a text input.

This is primarily for use by Coda-authored packs, as it is only relevant for interacting with the
Coda REST API.

## Hierarchy

- `BaseAuthentication`

  ↳ **`CodaApiBearerTokenAuthentication`**

## Properties

### defaultConnectionType

• `Optional` **defaultConnectionType**: [`DefaultConnectionType`](../enums/DefaultConnectionType.md)

Indicates the defualt manner in which a user's account is expected to be used by this pack,
e.g. is this account used for retrieving data, taking actions, or both.
See https://help.coda.io/en/articles/4587167-what-can-coda-access-with-packs#h_40472431f0

#### Inherited from

BaseAuthentication.defaultConnectionType

#### Defined in

[types.ts:212](https://github.com/coda/packs-sdk/blob/main/types.ts#L212)

___

### deferConnectionSetup

• `Optional` **deferConnectionSetup**: `boolean`

If true, does not require a connection to be configured in
order to install the pack.

#### Defined in

[types.ts:266](https://github.com/coda/packs-sdk/blob/main/types.ts#L266)

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

[types.ts:234](https://github.com/coda/packs-sdk/blob/main/types.ts#L234)

___

### getConnectionName

• `Optional` **getConnectionName**: [`MetadataFormula`](../types/MetadataFormula.md)

#### Inherited from

BaseAuthentication.getConnectionName

#### Defined in

[types.ts:204](https://github.com/coda/packs-sdk/blob/main/types.ts#L204)

___

### getConnectionUserId

• `Optional` **getConnectionUserId**: [`MetadataFormula`](../types/MetadataFormula.md)

#### Inherited from

BaseAuthentication.getConnectionUserId

#### Defined in

[types.ts:205](https://github.com/coda/packs-sdk/blob/main/types.ts#L205)

___

### instructionsUrl

• `Optional` **instructionsUrl**: `string`

A link to a help article or other page with more instructions about how to set up an account for this pack.

#### Inherited from

BaseAuthentication.instructionsUrl

#### Defined in

[types.ts:217](https://github.com/coda/packs-sdk/blob/main/types.ts#L217)

___

### postSetup

• `Optional` **postSetup**: `SetEndpoint`[]

One or more setup steps to run after the user has set up the account, before completing installation of the pack.
This is not common.

#### Inherited from

BaseAuthentication.postSetup

#### Defined in

[types.ts:240](https://github.com/coda/packs-sdk/blob/main/types.ts#L240)

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

[types.ts:225](https://github.com/coda/packs-sdk/blob/main/types.ts#L225)

___

### shouldAutoAuthSetup

• `Optional` **shouldAutoAuthSetup**: `boolean`

If true, automatically creates and configures an account with a Coda API token with
default settings when installing the pack: a scoped read-write token, added to the doc
as a shared account that allows actions.

#### Defined in

[types.ts:272](https://github.com/coda/packs-sdk/blob/main/types.ts#L272)

___

### type

• **type**: [`CodaApiHeaderBearerToken`](../enums/AuthenticationType.md#codaapiheaderbearertoken)

#### Defined in

[types.ts:261](https://github.com/coda/packs-sdk/blob/main/types.ts#L261)
