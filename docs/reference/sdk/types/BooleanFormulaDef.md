# Type alias: BooleanFormulaDef<ParamDefsT\>

Ƭ **BooleanFormulaDef**<`ParamDefsT`\>: [`BaseFormulaDef`](../interfaces/BaseFormulaDef.md)<`ParamDefsT`, `boolean`\> & { `resultType`: [`Boolean`](../enums/ValueType.md#boolean) ; `execute`: (`params`: [`ParamValues`](ParamValues.md)<`ParamDefsT`\>, `context`: [`ExecutionContext`](../interfaces/ExecutionContext.md)) => `boolean` \| `Promise`<`boolean`\>  }

A definition accepted by [makeFormula](../functions/makeFormula.md) for a formula that returns a boolean.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ParamDefsT` | extends [`ParamDefs`](ParamDefs.md) |

#### Defined in

<<<<<<< HEAD
[api.ts:836](https://github.com/coda/packs-sdk/blob/main/api.ts#L836)
=======
[api.ts:844](https://github.com/coda/packs-sdk/blob/main/api.ts#L844)
>>>>>>> 33154897 (restrict param autocomplete to only string & number, and respect param type in autocomplete shape (#1572))
