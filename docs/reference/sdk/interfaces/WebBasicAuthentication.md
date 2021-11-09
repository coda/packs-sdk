# Interface: WebBasicAuthentication

Authenticate using HTTP Basic authorization. The user provides a username and password
(sometimes optional) which are included as an HTTP header according to the Basic auth standard.

See https://en.wikipedia.org/wiki/Basic_access_authentication

## Hierarchy

- `BaseAuthentication`

  ↳ **`WebBasicAuthentication`**

## Properties

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

### type

• **type**: [`WebBasic`](../enums/AuthenticationType.md#webbasic)

#### Defined in

[types.ts:408](https://github.com/coda/packs-sdk/blob/main/types.ts#L408)

___

### uxConfig

• `Optional` **uxConfig**: `Object`

Configuration for labels to show in the UI when the user sets up a new acount.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `placeholderPassword?` | `string` | A placeholder value for the text input where the user will enter a password. |
| `placeholderUsername?` | `string` | A placeholder value for the text input where the user will enter a username. |
| `usernameOnly?` | `boolean` | If true, only a username input will be shown to the user. Some services pass API keys in the username field and do not require a password. |

#### Defined in

[types.ts:412](https://github.com/coda/packs-sdk/blob/main/types.ts#L412)
