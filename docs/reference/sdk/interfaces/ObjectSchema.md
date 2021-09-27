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

[schema.ts:222](https://github.com/coda/packs-sdk/blob/main/schema.ts#L222)

___

### description

• `Optional` **description**: `string`

#### Inherited from

ObjectSchemaDefinition.description

#### Defined in

[schema.ts:72](https://github.com/coda/packs-sdk/blob/main/schema.ts#L72)

___

### featured

• `Optional` **featured**: `L`[]

#### Inherited from

ObjectSchemaDefinition.featured

#### Defined in

[schema.ts:223](https://github.com/coda/packs-sdk/blob/main/schema.ts#L223)

___

### id

• `Optional` **id**: `K`

#### Inherited from

ObjectSchemaDefinition.id

#### Defined in

[schema.ts:220](https://github.com/coda/packs-sdk/blob/main/schema.ts#L220)

___

### identity

• `Optional` **identity**: [`Identity`](Identity.md)

#### Overrides

ObjectSchemaDefinition.identity

#### Defined in

<<<<<<< HEAD
[schema.ts:237](https://github.com/coda/packs-sdk/blob/main/schema.ts#L237)
=======
[schema.ts:228](https://github.com/coda/packs-sdk/blob/main/schema.ts#L228)
>>>>>>> 40f7a22 (Tweak our zod validation to complain when invalid property schemas ar eprovided)

___

### primary

• `Optional` **primary**: `K`

#### Inherited from

ObjectSchemaDefinition.primary

#### Defined in

[schema.ts:221](https://github.com/coda/packs-sdk/blob/main/schema.ts#L221)

___

### properties

• **properties**: [`ObjectSchemaProperties`](../types/ObjectSchemaProperties.md)<`K` \| `L`\>

#### Inherited from

ObjectSchemaDefinition.properties

#### Defined in

[schema.ts:219](https://github.com/coda/packs-sdk/blob/main/schema.ts#L219)

___

### type

• **type**: [`Object`](../enums/ValueType.md#object)

#### Inherited from

ObjectSchemaDefinition.type

#### Defined in

[schema.ts:218](https://github.com/coda/packs-sdk/blob/main/schema.ts#L218)
