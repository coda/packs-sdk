# Type alias: ParamValues<ParamDefsT\>

[core](../modules/core.md).ParamValues

Ƭ **ParamValues**<`ParamDefsT`\>: { [K in keyof ParamDefsT]: ParamDefsT[K] extends OptionalParamDef<infer S\> ? TypeOfMap<S\> \| undefined : ParamDefsT[K] extends ParamDef<infer T\> ? TypeOfMap<T\> : never } & `any`[]

The type for the set of argument values that are passed to formula's `execute` function, based on
the parameter defintion for that formula.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ParamDefsT` | extends [`ParamDefs`](core.ParamDefs.md) |

#### Defined in

[api_types.ts:348](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L348)
