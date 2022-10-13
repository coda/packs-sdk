# Type alias: BooleanFormulaDef<ParamDefsT\>

[core](../modules/core.md).BooleanFormulaDef

Ƭ **BooleanFormulaDef**<`ParamDefsT`\>: [`BaseFormulaDef`](../interfaces/core.BaseFormulaDef.md)<`ParamDefsT`, `boolean`\> & { `resultType`: [`Boolean`](../enums/core.ValueType.md#boolean) ; `execute`: (`params`: [`ParamValues`](core.ParamValues.md)<`ParamDefsT`\>, `context`: [`ExecutionContext`](../interfaces/core.ExecutionContext.md)) => `boolean` \| `Promise`<`boolean`\>  }

A definition accepted by [makeFormula](../functions/core.makeFormula.md) for a formula that returns a boolean.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ParamDefsT` | extends [`ParamDefs`](core.ParamDefs.md) |

#### Defined in

[api.ts:965](https://github.com/coda/packs-sdk/blob/main/api.ts#L965)
