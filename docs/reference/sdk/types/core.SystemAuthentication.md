---
title: "SystemAuthentication"
---
# Type alias: SystemAuthentication

[core](../modules/core.md).SystemAuthentication

Ƭ **SystemAuthentication**: [`HeaderBearerTokenAuthentication`](../interfaces/core.HeaderBearerTokenAuthentication.md) \| [`CustomHeaderTokenAuthentication`](../interfaces/core.CustomHeaderTokenAuthentication.md) \| [`QueryParamTokenAuthentication`](../interfaces/core.QueryParamTokenAuthentication.md) \| [`MultiQueryParamTokenAuthentication`](../interfaces/core.MultiQueryParamTokenAuthentication.md) \| [`WebBasicAuthentication`](../interfaces/core.WebBasicAuthentication.md) \| [`AWSAccessKeyAuthentication`](../interfaces/core.AWSAccessKeyAuthentication.md) \| [`AWSAssumeRoleAuthentication`](../interfaces/core.AWSAssumeRoleAuthentication.md) \| [`CustomAuthentication`](../interfaces/core.CustomAuthentication.md)

The union of authentication methods that are supported for system authentication,
where the pack author provides credentials used in HTTP requests rather than the user.

#### Defined in

[types.ts:662](https://github.com/coda/packs-sdk/blob/main/types.ts#L662)
