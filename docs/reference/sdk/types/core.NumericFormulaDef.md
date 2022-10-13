---
nav: "NumericFormulaDef"
---
# Type alias: NumericFormulaDef<ParamDefsT\>

[core](../modules/core.md).NumericFormulaDef

Ƭ **NumericFormulaDef**<`ParamDefsT`\>: [`BaseFormulaDef`](../interfaces/core.BaseFormulaDef.md)<`ParamDefsT`, `number`\> & { `resultType`: [`Number`](../enums/core.ValueType.md#number) ; `execute`: (`params`: [`ParamValues`](core.ParamValues.md)<`ParamDefsT`\>, `context`: [`ExecutionContext`](../interfaces/core.ExecutionContext.md)) => `number` \| `Promise`<`number`\>  } & { `schema?`: [`NumberSchema`](core.NumberSchema.md)  } \| { `codaType?`: [`NumberHintTypes`](core.NumberHintTypes.md)  }

A definition accepted by [makeFormula](../functions/core.makeFormula.md) for a formula that returns a number.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ParamDefsT` | extends [`ParamDefs`](core.ParamDefs.md) |

#### Defined in

[api.ts:963](https://github.com/coda/packs-sdk/blob/main/api.ts#L963)
