# Interface: Format

## Properties

### embedUrl

• `Optional` **embedUrl**: `string`

#### Defined in

[types.ts:743](https://github.com/coda/packs-sdk/blob/main/types.ts#L743)

___

### formulaName

• **formulaName**: `string`

The name of the formula to invoke for values in columns using this format.
This must correspond to the name of a regular, public formula defined in this pack.

#### Defined in

[types.ts:740](https://github.com/coda/packs-sdk/blob/main/types.ts#L740)

___

### formulaNamespace

• **formulaNamespace**: `string`

**`deprecated`** Namespaces are being removed from the product.

#### Defined in

[types.ts:721](https://github.com/coda/packs-sdk/blob/main/types.ts#L721)

___

### hasNoConnection

• `Optional` **hasNoConnection**: `boolean`

**`deprecated`** No longer needed, will be inferred from the referenced formula.

#### Defined in

[types.ts:742](https://github.com/coda/packs-sdk/blob/main/types.ts#L742)

___

### instructions

• `Optional` **instructions**: `string`

A brief, optional explanation of how users should use this format, for example, what kinds
of values they should put in columns using this format.

#### Defined in

[types.ts:726](https://github.com/coda/packs-sdk/blob/main/types.ts#L726)

___

### matchers

• `Optional` **matchers**: `RegExp`[]

A list of regular expressions that match URLs that the formula implementing this format
is capable of handling. As described in [Format](Format.md), this is a discovery mechanism.

#### Defined in

[types.ts:731](https://github.com/coda/packs-sdk/blob/main/types.ts#L731)

___

### name

• **name**: `string`

The name of this column/control format. This will show to users in the column type chooser.

#### Defined in

[types.ts:719](https://github.com/coda/packs-sdk/blob/main/types.ts#L719)

___

### placeholder

• `Optional` **placeholder**: `string`

**`deprecated`** Currently unused.

#### Defined in

[types.ts:735](https://github.com/coda/packs-sdk/blob/main/types.ts#L735)

___

### type

• `Optional` **type**: [`FormatType`](../enums/FormatType.md)

#### Defined in

[types.ts:715](https://github.com/coda/packs-sdk/blob/main/types.ts#L715)
