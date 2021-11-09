# Type alias: AuthenticationDef

Ƭ **AuthenticationDef**: [`NoAuthentication`](../interfaces/NoAuthentication.md) \| `VariousAuthentication` \| `AsAuthDef`<[`HeaderBearerTokenAuthentication`](../interfaces/HeaderBearerTokenAuthentication.md)\> \| `AsAuthDef`<[`CodaApiBearerTokenAuthentication`](../interfaces/CodaApiBearerTokenAuthentication.md)\> \| `AsAuthDef`<[`CustomHeaderTokenAuthentication`](../interfaces/CustomHeaderTokenAuthentication.md)\> \| `AsAuthDef`<[`QueryParamTokenAuthentication`](../interfaces/QueryParamTokenAuthentication.md)\> \| `AsAuthDef`<[`MultiQueryParamTokenAuthentication`](../interfaces/MultiQueryParamTokenAuthentication.md)\> \| `AsAuthDef`<[`OAuth2Authentication`](../interfaces/OAuth2Authentication.md)\> \| `AsAuthDef`<[`WebBasicAuthentication`](../interfaces/WebBasicAuthentication.md)\> \| `AsAuthDef`<[`CustomAuthentication`](../interfaces/CustomAuthentication.md)\> \| `AsAuthDef`<`AWSSignature4Authentication`\>

The union of supported authentication definitions. These represent simplified configurations
a pack developer can specify when calling [setUserAuthentication](../classes/PackDefinitionBuilder.md#setuserauthentication) when using
a pack definition builder. The builder massages these definitions into the form of
an [Authentication](Authentication.md) value, which is the value Coda ultimately cares about.

#### Defined in

[types.ts:556](https://github.com/coda/packs-sdk/blob/main/types.ts#L556)
