# Type alias: ParameterOptions<T\>

Ƭ **ParameterOptions**<`T`\>: `Omit`<[`ParamDef`](../interfaces/ParamDef.md)<`ParameterTypeMap`[`T`]\>, ``"type"`` \| ``"autocomplete"``\> & { `autocomplete?`: `T` extends [`Number`](../enums/ParameterType.md#number) \| [`String`](../enums/ParameterType.md#string) ? [`MetadataFormulaDef`](MetadataFormulaDef.md)<`AutoCompleteFunctionDefReturnType`<`TypeMap`[`ParameterTypeMap`[`T`]]\>\> \| `AutoCompleteFunctionDefReturnType`<`TypeMap`[`ParameterTypeMap`[`T`]]\> : `undefined` ; `type`: `T`  }

Options you can specify when defining a parameter using [makeParameter](../functions/makeParameter.md).

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`ParameterType`](../enums/ParameterType.md) |

#### Defined in

[api.ts:270](https://github.com/coda/packs-sdk/blob/main/api.ts#L270)
