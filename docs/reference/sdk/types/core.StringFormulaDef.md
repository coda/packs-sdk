---
nav: "StringFormulaDef"
---
# Type alias: StringFormulaDef<ParamDefsT\>

[core](../modules/core.md).StringFormulaDef

Ƭ **StringFormulaDef**<`ParamDefsT`\>: [`BaseFormulaDef`](../interfaces/core.BaseFormulaDef.md)<`ParamDefsT`, `string`\> & { `resultType`: [`String`](../enums/core.ValueType.md#string) ; `execute`: (`params`: [`ParamValues`](core.ParamValues.md)<`ParamDefsT`\>, `context`: [`ExecutionContext`](../interfaces/core.ExecutionContext.md)) => `string` \| `Promise`<`string`\>  } & { `schema?`: [`StringSchema`](core.StringSchema.md)  } \| { `codaType?`: [`StringHintTypes`](core.StringHintTypes.md)  }

A definition accepted by [makeFormula](../functions/core.makeFormula.md) for a formula that returns a string.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ParamDefsT` | extends [`ParamDefs`](core.ParamDefs.md) |

#### Defined in

[api.ts:971](https://github.com/coda/packs-sdk/blob/main/api.ts#L971)
