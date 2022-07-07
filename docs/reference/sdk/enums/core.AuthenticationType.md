---
title: "AuthenticationType"
---
# Enumeration: AuthenticationType

[core](../modules/core.md).AuthenticationType

Authentication types supported by Coda Packs.

## Enumeration Members

### AWSAccessKey

• **AWSAccessKey** = ``"AWSAccessKey"``

Authenticate to Amazon Web Services using an IAM access key id & secret access key pair.
See https://docs.aws.amazon.com/AmazonS3/latest/API/sig-v4-authenticating-requests.html

#### Defined in

[types.ts:90](https://github.com/coda/packs-sdk/blob/main/types.ts#L90)

___

### AWSAssumeRole

• **AWSAssumeRole** = ``"AWSAssumeRole"``

Authenticate to Amazon Web Services by assuming an IAM role.
See https://docs.aws.amazon.com/AmazonS3/latest/API/sig-v4-authenticating-requests.html

This is not yet supported.

#### Defined in

[types.ts:97](https://github.com/coda/packs-sdk/blob/main/types.ts#L97)

___

### CodaApiHeaderBearerToken

• **CodaApiHeaderBearerToken** = ``"CodaApiHeaderBearerToken"``

Authenticate using a Coda REST API token, sent as an HTTP header.

This is identical to [HeaderBearerToken](core.AuthenticationType.md#headerbearertoken) except the user wil be presented
with a UI to generate an API token rather than needing to paste an arbitrary API
token into a text input.

This is primarily for use by Coda-authored packs, as it is only relevant for interacting with the
Coda REST API.

#### Defined in

[types.ts:108](https://github.com/coda/packs-sdk/blob/main/types.ts#L108)

___

### Custom

• **Custom** = ``"Custom"``

Authenticate in a custom way by having one or more arbitrary secret values inserted into the request URL, body,
headers, or the form data using template replacement. See [CustomAuthentication](../interfaces/core.CustomAuthentication.md).

#### Defined in

[types.ts:85](https://github.com/coda/packs-sdk/blob/main/types.ts#L85)

___

### CustomHeaderToken

• **CustomHeaderToken** = ``"CustomHeaderToken"``

Authenticate using an HTTP header with a custom name and token prefix that you specify.
The header name is defined in the [headerName](../interfaces/core.CustomHeaderTokenAuthentication.md#headername) property.

#### Defined in

[types.ts:51](https://github.com/coda/packs-sdk/blob/main/types.ts#L51)

___

### HeaderBearerToken

• **HeaderBearerToken** = ``"HeaderBearerToken"``

Authenticate using an HTTP header of the form `Authorization: Bearer <token>`.

#### Defined in

[types.ts:46](https://github.com/coda/packs-sdk/blob/main/types.ts#L46)

___

### MultiQueryParamToken

• **MultiQueryParamToken** = ``"MultiQueryParamToken"``

Authenticate using multiple tokens, each passed as a different URL parameter, e.g.
https://example.com/api?param1=token1&param2=token2

The parameter names are defined in the [params](../interfaces/core.MultiQueryParamTokenAuthentication.md#params) array property.

#### Defined in

[types.ts:65](https://github.com/coda/packs-sdk/blob/main/types.ts#L65)

___

### None

• **None** = ``"None"``

Indicates this pack does not use authentication. You may also omit an authentication declaration entirely.

#### Defined in

[types.ts:42](https://github.com/coda/packs-sdk/blob/main/types.ts#L42)

___

### OAuth2

• **OAuth2** = ``"OAuth2"``

Authenticate using OAuth2. You must specify the authorization URL, token exchange URL, and
scopes here as part of the pack definition. You'll provide the application's client ID and
client secret in the pack management UI, so that these can be stored securely.

The API must use a (largely) standards-compliant implementation of OAuth2.

#### Defined in

[types.ts:73](https://github.com/coda/packs-sdk/blob/main/types.ts#L73)

___

### QueryParamToken

• **QueryParamToken** = ``"QueryParamToken"``

Authenticate using a token that is passed as a URL parameter with each request, e.g.
https://example.com/api?paramName=token

The parameter name is defined in the [paramName](../interfaces/core.QueryParamTokenAuthentication.md#paramname) property.

#### Defined in

[types.ts:58](https://github.com/coda/packs-sdk/blob/main/types.ts#L58)

___

### Various

• **Various** = ``"Various"``

Only for use by Coda-authored packs.

#### Defined in

[types.ts:112](https://github.com/coda/packs-sdk/blob/main/types.ts#L112)

___

### WebBasic

• **WebBasic** = ``"WebBasic"``

Authenticate using HTTP Basic authorization. The user provides a username and password
(sometimes optional) which are included as an HTTP header according to the Basic auth standard.

See https://en.wikipedia.org/wiki/Basic_access_authentication

#### Defined in

[types.ts:80](https://github.com/coda/packs-sdk/blob/main/types.ts#L80)
