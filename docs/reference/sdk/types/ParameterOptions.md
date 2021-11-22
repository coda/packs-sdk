# Type alias: ParameterOptions<T, AutoCompleteResultT\>

Ƭ **ParameterOptions**<`T`, `AutoCompleteResultT`\>: `Omit`<[`ParamDef`](../interfaces/ParamDef.md)<`ParameterTypeMap`[`T`]\>, ``"type"`` \| ``"autocomplete"``\> & { `autocomplete?`: `T` extends [`Number`](../enums/ParameterType.md#number) \| [`String`](../enums/ParameterType.md#string) ? `AutoCompleteParamType`<`AutoCompleteResultT`\> : `undefined` ; `type`: `T`  }

Options you can specify when defining a parameter using [makeParameter](../functions/makeParameter.md).

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`ParameterType`](../enums/ParameterType.md) |
| `AutoCompleteResultT` | extends `T` extends [`Number`](../enums/ParameterType.md#number) \| [`String`](../enums/ParameterType.md#string) ? `AutocompleteReturnType`<`T`\> : `any` |

#### Defined in

[api.ts:283](https://github.com/coda/packs-sdk/blob/main/api.ts#L283)
