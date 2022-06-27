---
title: "ParameterOptions"
---
# Type alias: ParameterOptions<T\>

[core](../modules/core.md).ParameterOptions

Ƭ **ParameterOptions**<`T`\>: `Omit`<[`ParamDef`](../interfaces/core.ParamDef.md)<`ParameterTypeMap`[`T`]\>, ``"type"`` \| ``"autocomplete"``\> & { `autocomplete?`: `T` extends [`Number`](../enums/core.ParameterType.md#number) \| [`String`](../enums/core.ParameterType.md#string) ? [`MetadataFormulaDef`](core.MetadataFormulaDef.md) \| (`TypeMap`[`ParameterTypeMap`[`T`]] \| [`SimpleAutocompleteOption`](../interfaces/core.SimpleAutocompleteOption.md)<`T`\>)[] : `undefined` ; `type`: `T`  }

Options you can specify when defining a parameter using [makeParameter](../functions/core.makeParameter.md).

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`ParameterType`](../enums/core.ParameterType.md) |

#### Defined in

[api.ts:338](https://github.com/coda/packs-sdk/blob/main/api.ts#L338)
