# Interface: CustomAuthHeaderDigestTransform

An optional header hext digest transform for the [CustomAuthentication](CustomAuthentication.md) authentication type.

## Properties

### algorithm

• **algorithm**: ``"md5"`` \| ``"sha1"`` \| ``"sha256"`` \| ``"sha512"``

The hash digest algorithm to apply to the header value.

#### Defined in

[types.ts:493](https://github.com/coda/packs-sdk/blob/main/types.ts#L493)

___

### header

• **header**: `string`

The header on which the hex digest should be applied.

#### Defined in

[types.ts:489](https://github.com/coda/packs-sdk/blob/main/types.ts#L489)
