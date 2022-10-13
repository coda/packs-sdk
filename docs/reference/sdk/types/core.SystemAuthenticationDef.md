# Type alias: SystemAuthenticationDef

[core](../modules/core.md).SystemAuthenticationDef

Ƭ **SystemAuthenticationDef**: `AsAuthDef`<[`HeaderBearerTokenAuthentication`](../interfaces/core.HeaderBearerTokenAuthentication.md)\> \| `AsAuthDef`<[`CustomHeaderTokenAuthentication`](../interfaces/core.CustomHeaderTokenAuthentication.md)\> \| `AsAuthDef`<[`QueryParamTokenAuthentication`](../interfaces/core.QueryParamTokenAuthentication.md)\> \| `AsAuthDef`<[`MultiQueryParamTokenAuthentication`](../interfaces/core.MultiQueryParamTokenAuthentication.md)\> \| `AsAuthDef`<[`WebBasicAuthentication`](../interfaces/core.WebBasicAuthentication.md)\> \| `AsAuthDef`<[`AWSAccessKeyAuthentication`](../interfaces/core.AWSAccessKeyAuthentication.md)\> \| `AsAuthDef`<[`AWSAssumeRoleAuthentication`](../interfaces/core.AWSAssumeRoleAuthentication.md)\> \| `AsAuthDef`<[`CustomAuthentication`](../interfaces/core.CustomAuthentication.md)\>

The union of supported system authentication definitions. These represent simplified
configurations a pack developer can specify when calling [setSystemAuthentication](../classes/core.PackDefinitionBuilder.md#setsystemauthentication)
when using a pack definition builder. The builder massages these definitions into the form of
an [SystemAuthentication](core.SystemAuthentication.md) value, which is the value Coda ultimately cares about.

#### Defined in

[types.ts:683](https://github.com/coda/packs-sdk/blob/main/types.ts#L683)
