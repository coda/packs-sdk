# Type alias: ParameterOptions<T\>

Ƭ **ParameterOptions**<`T`\>: `Omit`<[`ParamDef`](../interfaces/ParamDef.md)<`ParameterTypeMap`[`T`]\>, ``"type"`` \| ``"autocomplete"``\> & { `autocomplete?`: [`MetadataFormulaDef`](MetadataFormulaDef.md) \| (`string` \| `number` \| [`SimpleAutocompleteOption`](../interfaces/SimpleAutocompleteOption.md))[] ; `type`: `T`  }

Options you can specify when defining a parameter using [makeParameter](../functions/makeParameter.md).

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`ParameterType`](../enums/ParameterType.md) |

#### Defined in

[api.ts:263](https://github.com/coda/packs-sdk/blob/main/api.ts#L263)
