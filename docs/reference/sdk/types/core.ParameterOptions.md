---
nav: "ParameterOptions"
---
# Type alias: ParameterOptions<T\>

[core](../modules/core.md).ParameterOptions

Ƭ **ParameterOptions**<`T`\>: `Omit`<[`ParamDef`](../interfaces/core.ParamDef.md)<`ParameterTypeMap`[`T`]\>, ``"type"`` \| ``"autocomplete"`` \| ``"description"``\> & { `autocomplete?`: `T` extends `AutocompleteParameterTypes` ? [`MetadataFormulaDef`](core.MetadataFormulaDef.md) \| (`TypeMap`[`AutocompleteParameterTypeMapping`[`T`]] \| [`SimpleAutocompleteOption`](../interfaces/core.SimpleAutocompleteOption.md)<`T`\>)[] : `undefined` ; `description`: `string` ; `type`: `T`  }

Options you can specify when defining a parameter using [makeParameter](../functions/core.makeParameter.md).

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`ParameterType`](../enums/core.ParameterType.md) |

#### Defined in

[api.ts:376](https://github.com/coda/packs-sdk/blob/main/api.ts#L376)
