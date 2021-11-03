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

[schema.ts:425](https://github.com/coda/packs-sdk/blob/main/schema.ts#L425)

___

### description

• `Optional` **description**: `string`

#### Inherited from

ObjectSchemaDefinition.description

#### Defined in

[schema.ts:186](https://github.com/coda/packs-sdk/blob/main/schema.ts#L186)

___

### featured

• `Optional` **featured**: `L`[]

#### Inherited from

ObjectSchemaDefinition.featured

#### Defined in

[schema.ts:426](https://github.com/coda/packs-sdk/blob/main/schema.ts#L426)

___

### id

• `Optional` **id**: `K`

#### Inherited from

ObjectSchemaDefinition.id

#### Defined in

[schema.ts:423](https://github.com/coda/packs-sdk/blob/main/schema.ts#L423)

___

### identity

• `Optional` **identity**: [`Identity`](Identity.md)

#### Overrides

ObjectSchemaDefinition.identity

#### Defined in

[schema.ts:437](https://github.com/coda/packs-sdk/blob/main/schema.ts#L437)

___

### primary

• `Optional` **primary**: `K`

#### Inherited from

ObjectSchemaDefinition.primary

#### Defined in

[schema.ts:424](https://github.com/coda/packs-sdk/blob/main/schema.ts#L424)

___

### properties

• **properties**: [`ObjectSchemaProperties`](../types/ObjectSchemaProperties.md)<`K` \| `L`\>

#### Inherited from

ObjectSchemaDefinition.properties

#### Defined in

[schema.ts:422](https://github.com/coda/packs-sdk/blob/main/schema.ts#L422)

___

### type

• **type**: [`Object`](../enums/ValueType.md#object)

#### Inherited from

ObjectSchemaDefinition.type

#### Defined in

[schema.ts:421](https://github.com/coda/packs-sdk/blob/main/schema.ts#L421)
