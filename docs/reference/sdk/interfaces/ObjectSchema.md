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

[schema.ts:269](https://github.com/coda/packs-sdk/blob/main/schema.ts#L269)

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

[schema.ts:270](https://github.com/coda/packs-sdk/blob/main/schema.ts#L270)

___

### id

• `Optional` **id**: `K`

#### Inherited from

ObjectSchemaDefinition.id

#### Defined in

[schema.ts:267](https://github.com/coda/packs-sdk/blob/main/schema.ts#L267)

___

### identity

• `Optional` **identity**: [`Identity`](Identity.md)

#### Overrides

ObjectSchemaDefinition.identity

#### Defined in

[schema.ts:281](https://github.com/coda/packs-sdk/blob/main/schema.ts#L281)

___

### primary

• `Optional` **primary**: `K`

#### Inherited from

ObjectSchemaDefinition.primary

#### Defined in

[schema.ts:268](https://github.com/coda/packs-sdk/blob/main/schema.ts#L268)

___

### properties

• **properties**: [`ObjectSchemaProperties`](../types/ObjectSchemaProperties.md)<`K` \| `L`\>

#### Inherited from

ObjectSchemaDefinition.properties

#### Defined in

[schema.ts:266](https://github.com/coda/packs-sdk/blob/main/schema.ts#L266)

___

### type

• **type**: [`Object`](../enums/ValueType.md#object)

#### Inherited from

ObjectSchemaDefinition.type

#### Defined in

[schema.ts:265](https://github.com/coda/packs-sdk/blob/main/schema.ts#L265)
