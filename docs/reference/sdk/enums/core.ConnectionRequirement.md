# Enumeration: ConnectionRequirement

[core](../modules/core.md).ConnectionRequirement

Enumeration of requirement states for whether a given formula or sync table requires
a connection (account) to use.

## Enumeration Members

### None

• **None** = ``"none"``

Indicates this building block does not make use of an account.

#### Defined in

[api_types.ts:442](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L442)

___

### Optional

• **Optional** = ``"optional"``

Indicates that this building block can be used with or without an account.

An optional parameter will be added to the formula (or sync formula) for the calling user
to specify an account to use.

#### Defined in

[api_types.ts:449](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L449)

___

### Required

• **Required** = ``"required"``

Indicates that this building block must be used with an account.

A required parameter will be added to the formula (or sync formula) for the calling user
to specify an account to use.

#### Defined in

[api_types.ts:456](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L456)
