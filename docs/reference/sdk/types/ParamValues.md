---
title: "ParamValues"
---
# Type alias: ParamValues<ParamDefsT\>

Ƭ **ParamValues**<`ParamDefsT`\>: { [K in keyof ParamDefsT]: ParamDefsT[K] extends ParamDef<infer T\> ? TypeOfMap<T\> : never } & `any`[]

The type for the set of argument values that are passed to formula's `execute` function, based on
the parameter defintion for that formula.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ParamDefsT` | extends [`ParamDefs`](ParamDefs.md) |

#### Defined in

[api_types.ts:341](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L341)
