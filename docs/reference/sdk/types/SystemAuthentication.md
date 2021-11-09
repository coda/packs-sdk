# Type alias: SystemAuthentication

Ƭ **SystemAuthentication**: `HeaderBearerTokenAuthentication` \| `CustomHeaderTokenAuthentication` \| `QueryParamTokenAuthentication` \| `MultiQueryParamTokenAuthentication` \| [`WebBasicAuthentication`](../interfaces/WebBasicAuthentication.md) \| `AWSAccessKeyAuthentication` \| `AWSAssumeRoleAuthentication`

The union of authentication methods that are supported for system authentication,
where the pack author provides credentials used in HTTP requests rather than the user.

#### Defined in

[types.ts:522](https://github.com/coda/packs-sdk/blob/main/types.ts#L522)
