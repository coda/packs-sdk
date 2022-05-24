---
title: "BooleanFormulaDef"
---
# Type alias: BooleanFormulaDef<ParamDefsT\>

Ƭ **BooleanFormulaDef**<`ParamDefsT`\>: [`BaseFormulaDef`](../interfaces/BaseFormulaDef.md)<`ParamDefsT`, `boolean`\> & { `resultType`: [`Boolean`](../enums/ValueType.md#boolean) ; `execute`: (`params`: [`ParamValues`](ParamValues.md)<`ParamDefsT`\>, `context`: [`ExecutionContext`](../interfaces/ExecutionContext.md)) => `boolean` \| `Promise`<`boolean`\>  } & { `schema?`: [`BooleanSchema`](../interfaces/BooleanSchema.md)  } \| { `codaType?`: [`BooleanHintTypes`](BooleanHintTypes.md)  }

A definition accepted by [makeFormula](../functions/makeFormula.md) for a formula that returns a boolean.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ParamDefsT` | extends [`ParamDefs`](ParamDefs.md) |

#### Defined in

[api.ts:906](https://github.com/coda/packs-sdk/blob/main/api.ts#L906)
