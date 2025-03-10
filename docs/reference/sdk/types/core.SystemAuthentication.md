---
nav: "SystemAuthentication"
note: "This file is autogenerated from TypeScript definitions. Make edits to the comments in the TypeScript file and then run `make docs` to regenerate this file."
search:
  boost: 0.1
---
# Type alias: SystemAuthentication

[core](../modules/core.md).SystemAuthentication

Ƭ **SystemAuthentication**: [`HeaderBearerTokenAuthentication`](../interfaces/core.HeaderBearerTokenAuthentication.md) \| [`CustomHeaderTokenAuthentication`](../interfaces/core.CustomHeaderTokenAuthentication.md) \| [`MultiHeaderTokenAuthentication`](../interfaces/core.MultiHeaderTokenAuthentication.md) \| [`QueryParamTokenAuthentication`](../interfaces/core.QueryParamTokenAuthentication.md) \| [`MultiQueryParamTokenAuthentication`](../interfaces/core.MultiQueryParamTokenAuthentication.md) \| [`WebBasicAuthentication`](../interfaces/core.WebBasicAuthentication.md) \| [`AWSAccessKeyAuthentication`](../interfaces/core.AWSAccessKeyAuthentication.md) \| [`AWSAssumeRoleAuthentication`](../interfaces/core.AWSAssumeRoleAuthentication.md) \| `GoogleServiceAccountAuthentication` \| [`CustomAuthentication`](../interfaces/core.CustomAuthentication.md) \| [`OAuth2ClientCredentialsAuthentication`](../interfaces/core.OAuth2ClientCredentialsAuthentication.md)

The union of authentication methods that are supported for system authentication,
where the pack author provides credentials used in HTTP requests rather than the user.
