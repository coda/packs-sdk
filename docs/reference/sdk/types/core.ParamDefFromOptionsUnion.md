---
title: "ParamDefFromOptionsUnion"
---
# Type alias: ParamDefFromOptionsUnion<T, O\>

[core](../modules/core.md).ParamDefFromOptionsUnion

Ƭ **ParamDefFromOptionsUnion**<`T`, `O`\>: `Omit`<`O`, ``"type"`` \| ``"autcomplete"``\> & { `autocomplete`: [`MetadataFormula`](core.MetadataFormula.md) ; `type`: `O` extends [`ParameterOptions`](core.ParameterOptions.md)<infer S\> ? `ParameterTypeMap`[`S`] : `never`  }

Equivalent to [ParamDef](../interfaces/core.ParamDef.md). A helper type to generate a param def based
on the inputs to [makeParameter](../functions/core.makeParameter.md).

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`ParameterType`](../enums/core.ParameterType.md) |
| `O` | extends [`ParameterOptions`](core.ParameterOptions.md)<`T`\> |

#### Defined in

[api.ts:379](https://github.com/coda/packs-sdk/blob/main/api.ts#L379)
