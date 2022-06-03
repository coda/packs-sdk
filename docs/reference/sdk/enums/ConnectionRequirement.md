---
title: "ConnectionRequirement"
---
# Enumeration: ConnectionRequirement

Enumeration of requirement states for whether a given formula or sync table requires
a connection (account) to use.

## Enumeration Members

### None

• **None**

Indicates this building block does not make use of an account.

#### Defined in

[api_types.ts:431](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L431)

___

### Optional

• **Optional**

Indicates that this building block can be used with or without an account.

An optional parameter will be added to the formula (or sync formula) for the calling user
to specify an account to use.

#### Defined in

[api_types.ts:438](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L438)

___

### Required

• **Required**

Indicates that this building block must be used with an account.

A required parameter will be added to the formula (or sync formula) for the calling user
to specify an account to use.

#### Defined in

[api_types.ts:445](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L445)
