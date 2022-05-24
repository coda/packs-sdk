---
title: "BaseFormulaDef"
---
# Interface: BaseFormulaDef<ParamDefsT, ResultT\>

Base type for formula definitions accepted by [makeFormula](../functions/makeFormula.md).

## Type parameters

| Name | Type |
| :------ | :------ |
| `ParamDefsT` | extends [`ParamDefs`](../types/ParamDefs.md) |
| `ResultT` | extends `string` \| `number` \| `boolean` \| `object` |

## Hierarchy

- [`PackFormulaDef`](PackFormulaDef.md)<`ParamDefsT`, `ResultT`\>

  ↳ **`BaseFormulaDef`**

## Properties

### cacheTtlSecs

• `Optional` `Readonly` **cacheTtlSecs**: `number`

How long formulas running with the same values should cache their results for.

#### Inherited from

[PackFormulaDef](PackFormulaDef.md).[cacheTtlSecs](PackFormulaDef.md#cachettlsecs)

#### Defined in

[api_types.ts:398](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L398)

___

### connectionRequirement

• `Optional` `Readonly` **connectionRequirement**: [`ConnectionRequirement`](../enums/ConnectionRequirement.md)

Does this formula require a connection (aka an account)?

#### Inherited from

[PackFormulaDef](PackFormulaDef.md).[connectionRequirement](PackFormulaDef.md#connectionrequirement)

#### Defined in

[api_types.ts:390](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L390)

___

### description

• `Readonly` **description**: `string`

A brief description of what the formula does.

#### Inherited from

[PackFormulaDef](PackFormulaDef.md).[description](PackFormulaDef.md#description)

#### Defined in

[api_types.ts:364](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L364)

___

### examples

• `Optional` `Readonly` **examples**: { `params`: (`undefined` \| [`PackFormulaValue`](../types/PackFormulaValue.md))[] ; `result`: [`PackFormulaResult`](../types/PackFormulaResult.md)  }[]

Sample inputs and outputs demonstrating usage of this formula.

#### Inherited from

[PackFormulaDef](PackFormulaDef.md).[examples](PackFormulaDef.md#examples)

#### Defined in

[api_types.ts:379](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L379)

___

### extraOAuthScopes

• `Optional` `Readonly` **extraOAuthScopes**: `string`[]

OAuth scopes that the formula needs that weren't requested in the pack's overall authentication
config. For example, a Slack pack can have one formula that needs admin privileges, but non-admins
can use the bulk of the pack without those privileges. Coda will give users help in understanding
that they need additional authentication to use a formula with extra OAuth scopes. Note that
these scopes will always be requested in addition to the default scopes for the pack,
so an end user must have both sets of permissions.

#### Inherited from

[PackFormulaDef](PackFormulaDef.md).[extraOAuthScopes](PackFormulaDef.md#extraoauthscopes)

#### Defined in

[api_types.ts:420](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L420)

___

### isAction

• `Optional` `Readonly` **isAction**: `boolean`

Does this formula take an action (vs retrieve data or make a calculation)?
Actions are presented as buttons in the Coda UI.

#### Inherited from

[PackFormulaDef](PackFormulaDef.md).[isAction](PackFormulaDef.md#isaction)

#### Defined in

[api_types.ts:385](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L385)

___

### isExperimental

• `Optional` `Readonly` **isExperimental**: `boolean`

If specified, the formula will not be suggested to users in Coda's formula autocomplete.
The formula can still be invoked by manually typing its full name.

#### Inherited from

[PackFormulaDef](PackFormulaDef.md).[isExperimental](PackFormulaDef.md#isexperimental)

#### Defined in

[api_types.ts:404](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L404)

___

### isSystem

• `Optional` `Readonly` **isSystem**: `boolean`

Whether this is a formula that will be used by Coda internally and not exposed directly to users.
Not for use by packs that are not authored by Coda.

#### Inherited from

[PackFormulaDef](PackFormulaDef.md).[isSystem](PackFormulaDef.md#issystem)

#### Defined in

[api_types.ts:410](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L410)

___

### name

• `Readonly` **name**: `string`

The name of the formula, used to invoke it.

#### Inherited from

[PackFormulaDef](PackFormulaDef.md).[name](PackFormulaDef.md#name)

#### Defined in

[api_types.ts:359](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L359)

___

### network

• `Optional` `Readonly` **network**: [`Network`](Network.md)

**`deprecated`** use `isAction` and `connectionRequirement` instead

#### Inherited from

[PackFormulaDef](PackFormulaDef.md).[network](PackFormulaDef.md#network)

#### Defined in

[api_types.ts:393](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L393)

___

### parameters

• `Readonly` **parameters**: `ParamDefsT`

The parameter inputs to the formula, if any.

#### Inherited from

[PackFormulaDef](PackFormulaDef.md).[parameters](PackFormulaDef.md#parameters)

#### Defined in

[api_types.ts:369](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L369)

___

### varargParameters

• `Optional` `Readonly` **varargParameters**: [`ParamDefs`](../types/ParamDefs.md)

Variable argument parameters, used if this formula should accept arbitrary
numbers of inputs.

#### Inherited from

[PackFormulaDef](PackFormulaDef.md).[varargParameters](PackFormulaDef.md#varargparameters)

#### Defined in

[api_types.ts:374](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L374)

## Methods

### execute

▸ **execute**(`params`, `context`): `ResultT` \| `Promise`<`ResultT`\>

The JavaScript function that implements this formula

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`ParamValues`](../types/ParamValues.md)<`ParamDefsT`\> |
| `context` | [`ExecutionContext`](ExecutionContext.md) |

#### Returns

`ResultT` \| `Promise`<`ResultT`\>

#### Inherited from

[PackFormulaDef](PackFormulaDef.md).[execute](PackFormulaDef.md#execute)

#### Defined in

[api.ts:498](https://github.com/coda/packs-sdk/blob/main/api.ts#L498)

___

### onError

▸ `Optional` **onError**(`error`): `any`

If specified, will catch errors in the [execute](BaseFormulaDef.md#execute) function and call this
function with the error, instead of letting them throw and the formula failing.

This is helpful for writing common error handling into a singular helper function
that can then be applied to many different formulas in a pack.

#### Parameters

| Name | Type |
| :------ | :------ |
| `error` | `Error` |

#### Returns

`any`

#### Defined in

[api.ts:884](https://github.com/coda/packs-sdk/blob/main/api.ts#L884)
