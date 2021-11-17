# Interface: SyncFormulaDef<K, L, ParamDefsT, SchemaT\>

Inputs for creating the formula that implements a sync table.

## Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends `string` |
| `L` | extends `string` |
| `ParamDefsT` | extends [`ParamDefs`](../types/ParamDefs.md) |
| `SchemaT` | extends [`ObjectSchemaDefinition`](ObjectSchemaDefinition.md)<`K`, `L`\> |

## Hierarchy

- `CommonPackFormulaDef`<`ParamDefsT`\>

  ↳ **`SyncFormulaDef`**

## Properties

### cacheTtlSecs

• `Optional` `Readonly` **cacheTtlSecs**: `number`

How long formulas running with the same values should cache their results for.

#### Inherited from

CommonPackFormulaDef.cacheTtlSecs

#### Defined in

[api_types.ts:318](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L318)

___

### connectionRequirement

• `Optional` `Readonly` **connectionRequirement**: [`ConnectionRequirement`](../enums/ConnectionRequirement.md)

Does this formula require a connection (aka an account)?

#### Inherited from

CommonPackFormulaDef.connectionRequirement

#### Defined in

[api_types.ts:310](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L310)

___

### description

• `Readonly` **description**: `string`

A brief description of what the formula does.

#### Inherited from

CommonPackFormulaDef.description

#### Defined in

[api_types.ts:284](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L284)

___

### examples

• `Optional` `Readonly` **examples**: { `params`: [`PackFormulaValue`](../types/PackFormulaValue.md)[] ; `result`: [`PackFormulaResult`](../types/PackFormulaResult.md)  }[]

Sample inputs and outputs demonstrating usage of this formula.

#### Inherited from

CommonPackFormulaDef.examples

#### Defined in

[api_types.ts:299](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L299)

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

[api_types.ts:340](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L340)

___

### isAction

• `Optional` `Readonly` **isAction**: `boolean`

Does this formula take an action (vs retrieve data or make a calculation)?
Actions are presented as buttons in the Coda UI.

#### Inherited from

CommonPackFormulaDef.isAction

#### Defined in

[api_types.ts:305](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L305)

___

### isExperimental

• `Optional` `Readonly` **isExperimental**: `boolean`

If specified, the formula will not be suggested to users in Coda's formula autocomplete.
The formula can still be invoked by manually typing its full name.

#### Inherited from

CommonPackFormulaDef.isExperimental

#### Defined in

[api_types.ts:324](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L324)

___

### isSystem

• `Optional` `Readonly` **isSystem**: `boolean`

Whether this is a formula that will be used by Coda internally and not exposed directly to users.
Not for use by packs that are not authored by Coda.

#### Inherited from

CommonPackFormulaDef.isSystem

#### Defined in

[api_types.ts:330](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L330)

___

### name

• `Readonly` **name**: `string`

The name of the formula, used to invoke it.

#### Inherited from

CommonPackFormulaDef.name

#### Defined in

[api_types.ts:279](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L279)

___

### network

• `Optional` `Readonly` **network**: [`Network`](Network.md)

**`deprecated`** use `isAction` and `connectionRequirement` instead

#### Inherited from

CommonPackFormulaDef.network

#### Defined in

[api_types.ts:313](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L313)

___

### parameters

• `Readonly` **parameters**: `ParamDefsT`

The parameter inputs to the formula, if any.

#### Inherited from

CommonPackFormulaDef.parameters

#### Defined in

[api_types.ts:289](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L289)

___

### varargParameters

• `Optional` `Readonly` **varargParameters**: [`ParamDefs`](../types/ParamDefs.md)

Variable argument parameters, used if this formula should accept arbitrary
numbers of inputs.

#### Inherited from

CommonPackFormulaDef.varargParameters

#### Defined in

[api_types.ts:294](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L294)

## Methods

### execute

▸ **execute**(`params`, `context`): `Promise`<[`SyncFormulaResult`](SyncFormulaResult.md)<`K`, `L`, `SchemaT`\>\>

The JavaScript function that implements this sync.

This function takes in parameters and a sync context which may have a continuation
from a previous invocation, and fetches and returns one page of results, as well
as another continuation if there are more result to fetch.

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`ParamValues`](../types/ParamValues.md)<`ParamDefsT`\> |
| `context` | [`SyncExecutionContext`](SyncExecutionContext.md) |

#### Returns

`Promise`<[`SyncFormulaResult`](SyncFormulaResult.md)<`K`, `L`, `SchemaT`\>\>

#### Defined in

[api.ts:584](https://github.com/coda/packs-sdk/blob/main/api.ts#L584)
