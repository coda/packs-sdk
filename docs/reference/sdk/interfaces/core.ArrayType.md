---
nav: "ArrayType"
---
# Interface: ArrayType<T\>

[core](../modules/core.md).ArrayType

The type of a parameter or return value that is an array.

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`Type`](../enums/core.Type.md) |

## Properties

### allowEmpty

• `Optional` **allowEmpty**: `boolean`

If true, this array will accept empty or unrecognized values as `undefined`.

#### Defined in

[api_types.ts:84](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L84)

___

### items

• **items**: `T`

The type of the items in this array.

#### Defined in

[api_types.ts:82](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L82)

___

### type

• **type**: ``"array"``

Identifies this type as an array.

#### Defined in

[api_types.ts:80](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L80)
