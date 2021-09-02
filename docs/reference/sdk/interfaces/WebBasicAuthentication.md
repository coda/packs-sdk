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

[types.ts:158](https://github.com/coda/packs-sdk/blob/main/types.ts#L158)

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

[types.ts:180](https://github.com/coda/packs-sdk/blob/main/types.ts#L180)

___

### getConnectionName

• `Optional` **getConnectionName**: [`MetadataFormula`](../types/MetadataFormula.md)

#### Inherited from

BaseAuthentication.getConnectionName

#### Defined in

[types.ts:150](https://github.com/coda/packs-sdk/blob/main/types.ts#L150)

___

### getConnectionUserId

• `Optional` **getConnectionUserId**: [`MetadataFormula`](../types/MetadataFormula.md)

#### Inherited from

BaseAuthentication.getConnectionUserId

#### Defined in

[types.ts:151](https://github.com/coda/packs-sdk/blob/main/types.ts#L151)

___

### instructionsUrl

• `Optional` **instructionsUrl**: `string`

A link to a help article or other page with more instructions about how to set up an account for this pack.

#### Inherited from

BaseAuthentication.instructionsUrl

#### Defined in

[types.ts:163](https://github.com/coda/packs-sdk/blob/main/types.ts#L163)

___

### postSetup

• `Optional` **postSetup**: `SetEndpoint`[]

One or more setup steps to run after the user has set up the account, before completing installation of the pack.
This is not common.

#### Inherited from

BaseAuthentication.postSetup

#### Defined in

[types.ts:186](https://github.com/coda/packs-sdk/blob/main/types.ts#L186)

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

[types.ts:171](https://github.com/coda/packs-sdk/blob/main/types.ts#L171)

___

### type

• **type**: [`WebBasic`](../enums/AuthenticationType.md#webbasic)

#### Defined in

[types.ts:260](https://github.com/coda/packs-sdk/blob/main/types.ts#L260)

___

### uxConfig

• `Optional` **uxConfig**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `placeholderPassword?` | `string` |
| `placeholderUsername?` | `string` |
| `usernameOnly?` | `boolean` |

#### Defined in

[types.ts:261](https://github.com/coda/packs-sdk/blob/main/types.ts#L261)
