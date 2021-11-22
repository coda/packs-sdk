# Type alias: ParameterOptions<T\>

<<<<<<< HEAD
Ƭ **ParameterOptions**<`T`\>: `Omit`<[`ParamDef`](../interfaces/ParamDef.md)<`ParameterTypeMap`[`T`]\>, ``"type"`` \| ``"autocomplete"``\> & { `autocomplete?`: `T` extends [`Number`](../enums/ParameterType.md#number) \| [`String`](../enums/ParameterType.md#string) ? [`MetadataFormulaDef`](MetadataFormulaDef.md) \| (`TypeMap`[`ParameterTypeMap`[`T`]] \| [`SimpleAutocompleteOption`](../interfaces/SimpleAutocompleteOption.md)<`T`\>)[] : `undefined` ; `type`: `T`  }
=======
Ƭ **ParameterOptions**<`T`\>: `Omit`<[`ParamDef`](../interfaces/ParamDef.md)<`ParameterTypeMap`[`T`]\>, ``"type"`` \| ``"autocomplete"``\> & { `autocomplete?`: `T` extends [`Number`](../enums/ParameterType.md#number) \| [`String`](../enums/ParameterType.md#string) ? [`MetadataFormula`](MetadataFormula.md)<`AutocompleteReturnType`<`T`\>\> \| [`MetadataFunction`](MetadataFunction.md)<`string`, `string`, `AutocompleteReturnType`<`T`\>\> \| `AutocompleteReturnType`<`T`\> : `undefined` ; `type`: `T`  }
>>>>>>> 33154897 (restrict param autocomplete to only string & number, and respect param type in autocomplete shape (#1572))

Options you can specify when defining a parameter using [makeParameter](../functions/makeParameter.md).

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`ParameterType`](../enums/ParameterType.md) |

#### Defined in

<<<<<<< HEAD
[api.ts:269](https://github.com/coda/packs-sdk/blob/main/api.ts#L269)
=======
[api.ts:274](https://github.com/coda/packs-sdk/blob/main/api.ts#L274)
>>>>>>> 33154897 (restrict param autocomplete to only string & number, and respect param type in autocomplete shape (#1572))
