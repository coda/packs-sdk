---
title: "SystemAuthenticationDef"
---
# Type alias: SystemAuthenticationDef

Ƭ **SystemAuthenticationDef**: `AsAuthDef`<[`HeaderBearerTokenAuthentication`](../interfaces/HeaderBearerTokenAuthentication.md)\> \| `AsAuthDef`<[`CustomHeaderTokenAuthentication`](../interfaces/CustomHeaderTokenAuthentication.md)\> \| `AsAuthDef`<[`QueryParamTokenAuthentication`](../interfaces/QueryParamTokenAuthentication.md)\> \| `AsAuthDef`<[`MultiQueryParamTokenAuthentication`](../interfaces/MultiQueryParamTokenAuthentication.md)\> \| `AsAuthDef`<[`WebBasicAuthentication`](../interfaces/WebBasicAuthentication.md)\> \| `AsAuthDef`<[`AWSAccessKeyAuthentication`](../interfaces/AWSAccessKeyAuthentication.md)\> \| `AsAuthDef`<[`AWSAssumeRoleAuthentication`](../interfaces/AWSAssumeRoleAuthentication.md)\> \| `AsAuthDef`<[`CustomAuthentication`](../interfaces/CustomAuthentication.md)\>

The union of supported system authentication definitions. These represent simplified
onfigurations a pack developer can specify when calling [setSystemAuthentication](../classes/PackDefinitionBuilder.md#setsystemauthentication)
when using a pack definition builder. The builder massages these definitions into the form of
an [SystemAuthentication](SystemAuthentication.md) value, which is the value Coda ultimately cares about.

#### Defined in

[types.ts:678](https://github.com/coda/packs-sdk/blob/main/types.ts#L678)
