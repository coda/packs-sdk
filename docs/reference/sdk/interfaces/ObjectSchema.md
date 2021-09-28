# Interface: ObjectSchema<K, L\>

## Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends `string` |
| `L` | extends `string` |

## Hierarchy

- `ObjectSchemaDefinition`<`K`, `L`\>

  ↳ **`ObjectSchema`**

## Properties

### codaType

• `Optional` **codaType**: [`Person`](../enums/ValueHintType.md#person) \| [`Reference`](../enums/ValueHintType.md#reference)

#### Inherited from

ObjectSchemaDefinition.codaType

#### Defined in

[schema.ts:242](https://github.com/coda/packs-sdk/blob/main/schema.ts#L242)

___

### description

• `Optional` **description**: `string`

#### Inherited from

ObjectSchemaDefinition.description

#### Defined in

[schema.ts:75](https://github.com/coda/packs-sdk/blob/main/schema.ts#L75)

___

### featured

• `Optional` **featured**: `L`[]

#### Inherited from

ObjectSchemaDefinition.featured

#### Defined in

[schema.ts:243](https://github.com/coda/packs-sdk/blob/main/schema.ts#L243)

___

### id

• `Optional` **id**: `K`

#### Inherited from

ObjectSchemaDefinition.id

#### Defined in

[schema.ts:240](https://github.com/coda/packs-sdk/blob/main/schema.ts#L240)

___

### identity

• `Optional` **identity**: [`Identity`](Identity.md)

#### Overrides

ObjectSchemaDefinition.identity

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
[schema.ts:237](https://github.com/coda/packs-sdk/blob/main/schema.ts#L237)
=======
[schema.ts:228](https://github.com/coda/packs-sdk/blob/main/schema.ts#L228)
>>>>>>> 40f7a22 (Tweak our zod validation to complain when invalid property schemas ar eprovided)
=======
[schema.ts:248](https://github.com/coda/packs-sdk/blob/main/schema.ts#L248)
>>>>>>> 46bf97b (fix typing)

___

### primary

• `Optional` **primary**: `K`

#### Inherited from

ObjectSchemaDefinition.primary

#### Defined in

[schema.ts:241](https://github.com/coda/packs-sdk/blob/main/schema.ts#L241)

___

### properties

• **properties**: [`ObjectSchemaProperties`](../types/ObjectSchemaProperties.md)<`K` \| `L`\>

#### Inherited from

ObjectSchemaDefinition.properties

#### Defined in

[schema.ts:239](https://github.com/coda/packs-sdk/blob/main/schema.ts#L239)

___

### type

• **type**: [`Object`](../enums/ValueType.md#object)

#### Inherited from

ObjectSchemaDefinition.type

#### Defined in

[schema.ts:238](https://github.com/coda/packs-sdk/blob/main/schema.ts#L238)
