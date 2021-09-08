## Hierarchy

- `Omit`<[`Format`](Format.md), ``"matchers"``\>

  ↳ **`PackFormatMetadata`**

## Properties

### formulaName

• **formulaName**: `string`

The name of the formula to invoke for values in columns using this format.
This must correspond to the name of a regular, public formula defined in this pack.

#### Inherited from

Omit.formulaName

#### Defined in

[types.ts:580](https://github.com/coda/packs-sdk/blob/main/types.ts#L580)

___

### formulaNamespace

• **formulaNamespace**: `string`

**`deprecated`** Namespaces are being removed from the product.

#### Inherited from

Omit.formulaNamespace

#### Defined in

[types.ts:575](https://github.com/coda/packs-sdk/blob/main/types.ts#L575)

___

### hasNoConnection

• `Optional` **hasNoConnection**: `boolean`

**`deprecated`** No longer needed, will be inferred from the referenced formula.

#### Inherited from

Omit.hasNoConnection

#### Defined in

[types.ts:582](https://github.com/coda/packs-sdk/blob/main/types.ts#L582)

___

### instructions

• `Optional` **instructions**: `string`

A brief, optional explanation of how users should use this format, for example, what kinds
of values they should put in columns using this format.

#### Inherited from

Omit.instructions

#### Defined in

[types.ts:587](https://github.com/coda/packs-sdk/blob/main/types.ts#L587)

___

### matchers

• **matchers**: `string`[]

#### Defined in

[compiled_types.ts:27](https://github.com/coda/packs-sdk/blob/main/compiled_types.ts#L27)

___

### name

• **name**: `string`

The name of this column format. This will show to users in the column type chooser.

#### Inherited from

Omit.name

#### Defined in

[types.ts:573](https://github.com/coda/packs-sdk/blob/main/types.ts#L573)

___

### placeholder

• `Optional` **placeholder**: `string`

**`deprecated`** Currently unused.

#### Inherited from

Omit.placeholder

#### Defined in

[types.ts:596](https://github.com/coda/packs-sdk/blob/main/types.ts#L596)
