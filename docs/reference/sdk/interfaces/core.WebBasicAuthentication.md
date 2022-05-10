---
title: "WebBasicAuthentication"
---
# Interface: WebBasicAuthentication

[core](../modules/core.md).WebBasicAuthentication

Authenticate using HTTP Basic authorization. The user provides a username and password
(sometimes optional) which are included as an HTTP header according to the Basic auth standard.

See https://en.wikipedia.org/wiki/Basic_access_authentication

## Hierarchy

- [`BaseAuthentication`](core.BaseAuthentication.md)

  ↳ **`WebBasicAuthentication`**

## Properties

### endpointDomain

• `Optional` **endpointDomain**: `string`

When requiresEndpointUrl is set to true this should be the root domain that all endpoints share.
For example, this value would be "example.com" if specific endpoints looked like {custom-subdomain}.example.com.

For packs that make requests to multiple domains (uncommon), this should be the domain within
[networkDomains](core.PackDefinition.md#networkdomains) that this configuration applies to.

#### Inherited from

[BaseAuthentication](core.BaseAuthentication.md).[endpointDomain](core.BaseAuthentication.md#endpointdomain)

#### Defined in

[types.ts:247](https://github.com/coda/packs-sdk/blob/main/types.ts#L247)

___

### getConnectionName

• `Optional` **getConnectionName**: [`MetadataFormula`](../types/core.MetadataFormula.md)

A function that is called when a user sets up a new account, that returns a name for
the account to label that account in the UI. The users credentials are applied to any
fetcher requests that this function makes. Typically, this function makes an API call
to an API's "who am I" endpoint and returns a username.

If omitted, or if the function returns an empty value, the account will be labeled
with the creating user's Coda username.

#### Inherited from

[BaseAuthentication](core.BaseAuthentication.md).[getConnectionName](core.BaseAuthentication.md#getconnectionname)

#### Defined in

[types.ts:215](https://github.com/coda/packs-sdk/blob/main/types.ts#L215)

___

### instructionsUrl

• `Optional` **instructionsUrl**: `string`

A link to a help article or other page with more instructions about how to set up an account for this pack.

#### Inherited from

[BaseAuthentication](core.BaseAuthentication.md).[instructionsUrl](core.BaseAuthentication.md#instructionsurl)

#### Defined in

[types.ts:230](https://github.com/coda/packs-sdk/blob/main/types.ts#L230)

___

### networkDomain

• `Optional` **networkDomain**: `string` \| `string`[]

Which domain(s) should get auth credentials, when a pack is configured with multiple domains.
Packs configured with only one domain or with requiredsEndpointUrl set to true can omit this.

Using multiple authenticated network domains is uncommon and requires Coda approval.

#### Inherited from

[BaseAuthentication](core.BaseAuthentication.md).[networkDomain](core.BaseAuthentication.md#networkdomain)

#### Defined in

[types.ts:261](https://github.com/coda/packs-sdk/blob/main/types.ts#L261)

___

### postSetup

• `Optional` **postSetup**: [`SetEndpoint`](core.SetEndpoint.md)[]

One or more setup steps to run after the user has set up the account, before completing installation of the pack.
This is not common.

#### Inherited from

[BaseAuthentication](core.BaseAuthentication.md).[postSetup](core.BaseAuthentication.md#postsetup)

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

[BaseAuthentication](core.BaseAuthentication.md).[requiresEndpointUrl](core.BaseAuthentication.md#requiresendpointurl)

#### Defined in

[types.ts:238](https://github.com/coda/packs-sdk/blob/main/types.ts#L238)

___

### type

• **type**: [`WebBasic`](../enums/core.AuthenticationType.md#webbasic)

Identifies this as WebBasic authentication.

#### Defined in

[types.ts:446](https://github.com/coda/packs-sdk/blob/main/types.ts#L446)

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

[types.ts:450](https://github.com/coda/packs-sdk/blob/main/types.ts#L450)
