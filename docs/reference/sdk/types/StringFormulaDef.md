---
title: "StringFormulaDef"
---
# Type alias: StringFormulaDef<ParamDefsT\>

Ƭ **StringFormulaDef**<`ParamDefsT`\>: [`BaseFormulaDef`](../interfaces/BaseFormulaDef.md)<`ParamDefsT`, `string`\> & { `resultType`: [`String`](../enums/ValueType.md#string) ; `execute`: (`params`: [`ParamValues`](ParamValues.md)<`ParamDefsT`\>, `context`: [`ExecutionContext`](../interfaces/ExecutionContext.md)) => `string` \| `Promise`<`string`\>  } & { `schema?`: [`StringSchema`](StringSchema.md)  } \| { `codaType?`: [`StringHintTypes`](StringHintTypes.md)  }

A definition accepted by [makeFormula](../functions/makeFormula.md) for a formula that returns a string.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ParamDefsT` | extends [`ParamDefs`](ParamDefs.md) |

#### Defined in

[api.ts:883](https://github.com/coda/packs-sdk/blob/main/api.ts#L883)
