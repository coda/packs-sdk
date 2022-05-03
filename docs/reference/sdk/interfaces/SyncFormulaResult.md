---
title: "SyncFormulaResult"
---
# Interface: SyncFormulaResult<K, L, SchemaT\>

The return value from the formula that implements a sync table. Each sync formula invocation
returns one reasonable size page of results. The formula may also return a continuation, indicating
that the sync formula should be invoked again to get a next page of results. Sync functions
are called repeatedly until there is no continuation returned.

## Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends `string` |
| `L` | extends `string` |
| `SchemaT` | extends [`ObjectSchemaDefinition`](ObjectSchemaDefinition.md)<`K`, `L`\> |

## Properties

### continuation

• `Optional` **continuation**: [`Continuation`](Continuation.md)

A marker indicating where the next sync formula invocation should pick up to get the next page of results.
The contents of this object are entirely of your choosing. Sync formulas are called repeatedly
until there is no continuation returned.

#### Defined in

[api.ts:647](https://github.com/coda/packs-sdk/blob/main/api.ts#L647)

___

### result

• **result**: `ObjectSchemaDefinitionType`<`K`, `L`, `SchemaT`\>[]

The list of results from this page.

#### Defined in

[api.ts:641](https://github.com/coda/packs-sdk/blob/main/api.ts#L641)
