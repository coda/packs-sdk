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

[schema.ts:479](https://github.com/coda/packs-sdk/blob/main/schema.ts#L479)

___

### description

• `Optional` **description**: `string`

A explanation of this object schema property shown to the user in the UI.

If your pack has a object schema with many properties, it may be useful to
explain the purpose or contents of any property that is not self-evident.

#### Inherited from

ObjectSchemaDefinition.description

#### Defined in

[schema.ts:192](https://github.com/coda/packs-sdk/blob/main/schema.ts#L192)

___

### featured

• `Optional` **featured**: `L`[]

#### Inherited from

ObjectSchemaDefinition.featured

#### Defined in

[schema.ts:480](https://github.com/coda/packs-sdk/blob/main/schema.ts#L480)

___

### id

• `Optional` **id**: `K`

#### Inherited from

ObjectSchemaDefinition.id

#### Defined in

[schema.ts:477](https://github.com/coda/packs-sdk/blob/main/schema.ts#L477)

___

### identity

• `Optional` **identity**: [`Identity`](Identity.md)

#### Overrides

ObjectSchemaDefinition.identity

#### Defined in

[schema.ts:491](https://github.com/coda/packs-sdk/blob/main/schema.ts#L491)

___

### primary

• `Optional` **primary**: `K`

#### Inherited from

ObjectSchemaDefinition.primary

#### Defined in

[schema.ts:478](https://github.com/coda/packs-sdk/blob/main/schema.ts#L478)

___

### properties

• **properties**: [`ObjectSchemaProperties`](../types/ObjectSchemaProperties.md)<`K` \| `L`\>

#### Inherited from

ObjectSchemaDefinition.properties

#### Defined in

[schema.ts:476](https://github.com/coda/packs-sdk/blob/main/schema.ts#L476)

___

### type

• **type**: [`Object`](../enums/ValueType.md#object)

#### Inherited from

ObjectSchemaDefinition.type

#### Defined in

[schema.ts:475](https://github.com/coda/packs-sdk/blob/main/schema.ts#L475)
