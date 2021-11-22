# Type alias: NumericFormulaDef<ParamDefsT\>

Ƭ **NumericFormulaDef**<`ParamDefsT`\>: [`BaseFormulaDef`](../interfaces/BaseFormulaDef.md)<`ParamDefsT`, `number`\> & { `resultType`: [`Number`](../enums/ValueType.md#number) ; `execute`: (`params`: [`ParamValues`](ParamValues.md)<`ParamDefsT`\>, `context`: [`ExecutionContext`](../interfaces/ExecutionContext.md)) => `number` \| `Promise`<`number`\>  } & { `schema?`: [`NumberSchema`](NumberSchema.md)  } \| { `codaType?`: [`NumberHintTypes`](NumberHintTypes.md)  }

A definition accepted by [makeFormula](../functions/makeFormula.md) for a formula that returns a number.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ParamDefsT` | extends [`ParamDefs`](ParamDefs.md) |

#### Defined in

<<<<<<< HEAD
[api.ts:828](https://github.com/coda/packs-sdk/blob/main/api.ts#L828)
=======
[api.ts:836](https://github.com/coda/packs-sdk/blob/main/api.ts#L836)
>>>>>>> 33154897 (restrict param autocomplete to only string & number, and respect param type in autocomplete shape (#1572))
