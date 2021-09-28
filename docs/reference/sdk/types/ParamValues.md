# Type alias: ParamValues<ParamDefsT\>

Ƭ **ParamValues**<`ParamDefsT`\>: { [K in keyof ParamDefsT]: ParamDefsT[K] extends ParamDef<infer T\> ? TypeOfMap<T\> : never } & `any`[]

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ParamDefsT` | extends [`ParamDefs`](ParamDefs.md) |

#### Defined in

[api_types.ts:183](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L183)
