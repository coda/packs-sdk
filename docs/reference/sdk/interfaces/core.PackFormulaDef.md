---
nav: "PackFormulaDef"
---
# Interface: PackFormulaDef<ParamsT, ResultT\>

[core](../modules/core.md).PackFormulaDef

Base type for the inputs for creating a pack formula.

## Type parameters

| Name | Type |
| :------ | :------ |
| `ParamsT` | extends [`ParamDefs`](../types/core.ParamDefs.md) |
| `ResultT` | extends [`PackFormulaResult`](../types/core.PackFormulaResult.md) |

## Hierarchy

- `CommonPackFormulaDef`<`ParamsT`\>

  ↳ **`PackFormulaDef`**

  ↳↳ [`BaseFormulaDef`](core.BaseFormulaDef.md)

## Properties

### cacheTtlSecs

• `Optional` `Readonly` **cacheTtlSecs**: `number`

How long formulas running with the same values should cache their results for.

#### Inherited from

CommonPackFormulaDef.cacheTtlSecs

#### Defined in

[api_types.ts:409](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L409)

___

### connectionRequirement

• `Optional` `Readonly` **connectionRequirement**: [`ConnectionRequirement`](../enums/core.ConnectionRequirement.md)

Does this formula require a connection (aka an account)?

#### Inherited from

CommonPackFormulaDef.connectionRequirement

#### Defined in

[api_types.ts:401](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L401)

___

### description

• `Readonly` **description**: `string`

A brief description of what the formula does.

#### Inherited from

CommonPackFormulaDef.description

#### Defined in

[api_types.ts:375](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L375)

___

### examples

• `Optional` `Readonly` **examples**: { `params`: (`undefined` \| [`PackFormulaValue`](../types/core.PackFormulaValue.md))[] ; `result`: [`PackFormulaResult`](../types/core.PackFormulaResult.md)  }[]

Sample inputs and outputs demonstrating usage of this formula.

#### Inherited from

CommonPackFormulaDef.examples

#### Defined in

[api_types.ts:390](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L390)

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

CommonPackFormulaDef.extraOAuthScopes

#### Defined in

[api_types.ts:431](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L431)

___

### isAction

• `Optional` `Readonly` **isAction**: `boolean`

Does this formula take an action (vs retrieve data or make a calculation)?
Actions are presented as buttons in the Coda UI.

#### Inherited from

CommonPackFormulaDef.isAction

#### Defined in

[api_types.ts:396](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L396)

___

### isExperimental

• `Optional` `Readonly` **isExperimental**: `boolean`

If specified, the formula will not be suggested to users in Coda's formula autocomplete.
The formula can still be invoked by manually typing its full name.

#### Inherited from

CommonPackFormulaDef.isExperimental

#### Defined in

[api_types.ts:415](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L415)

___

### isSystem

• `Optional` `Readonly` **isSystem**: `boolean`

Whether this is a formula that will be used by Coda internally and not exposed directly to users.
Not for use by packs that are not authored by Coda.

#### Inherited from

CommonPackFormulaDef.isSystem

#### Defined in

[api_types.ts:421](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L421)

___

### name

• `Readonly` **name**: `string`

The name of the formula, used to invoke it.

#### Inherited from

CommonPackFormulaDef.name

#### Defined in

[api_types.ts:370](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L370)

___

### network

• `Optional` `Readonly` **network**: [`Network`](core.Network.md)

**`Deprecated`**

use `isAction` and `connectionRequirement` instead

#### Inherited from

CommonPackFormulaDef.network

#### Defined in

[api_types.ts:404](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L404)

___

### parameters

• `Readonly` **parameters**: `ParamsT`

The parameter inputs to the formula, if any.

#### Inherited from

CommonPackFormulaDef.parameters

#### Defined in

[api_types.ts:380](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L380)

___

### varargParameters

• `Optional` `Readonly` **varargParameters**: [`ParamDefs`](../types/core.ParamDefs.md)

Variable argument parameters, used if this formula should accept arbitrary
numbers of inputs.

#### Inherited from

CommonPackFormulaDef.varargParameters

#### Defined in

[api_types.ts:385](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L385)

## Methods

### execute

▸ **execute**(`params`, `context`): `ResultT` \| `Promise`<`ResultT`\>

The JavaScript function that implements this formula

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`ParamValues`](../types/core.ParamValues.md)<`ParamsT`\> |
| `context` | [`ExecutionContext`](core.ExecutionContext.md) |

#### Returns

`ResultT` \| `Promise`<`ResultT`\>

#### Defined in

[api.ts:563](https://github.com/coda/packs-sdk/blob/main/api.ts#L563)
