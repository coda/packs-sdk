---
title: "SystemAuthentication"
---
# Type alias: SystemAuthentication

Ƭ **SystemAuthentication**: [`HeaderBearerTokenAuthentication`](../interfaces/HeaderBearerTokenAuthentication.md) \| [`CustomHeaderTokenAuthentication`](../interfaces/CustomHeaderTokenAuthentication.md) \| [`QueryParamTokenAuthentication`](../interfaces/QueryParamTokenAuthentication.md) \| [`MultiQueryParamTokenAuthentication`](../interfaces/MultiQueryParamTokenAuthentication.md) \| [`WebBasicAuthentication`](../interfaces/WebBasicAuthentication.md) \| [`AWSAccessKeyAuthentication`](../interfaces/AWSAccessKeyAuthentication.md) \| [`AWSAssumeRoleAuthentication`](../interfaces/AWSAssumeRoleAuthentication.md) \| [`CustomAuthentication`](../interfaces/CustomAuthentication.md)

The union of authentication methods that are supported for system authentication,
where the pack author provides credentials used in HTTP requests rather than the user.

#### Defined in

[types.ts:664](https://github.com/coda/packs-sdk/blob/main/types.ts#L664)
