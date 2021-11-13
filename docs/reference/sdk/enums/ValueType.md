# Enumeration: ValueType

The set of primitive value types that can be used as return values for formulas
or in object schemas.

## Enumeration members

### Array

• **Array** = `"array"`

Indicates a JavaScript array should be returned. The schema of the array items must also be specified.

#### Defined in

[schema.ts:30](https://github.com/coda/packs-sdk/blob/main/schema.ts#L30)

___

### Boolean

• **Boolean** = `"boolean"`

Indicates a JavaScript boolean (true/false) should be returned.

#### Defined in

[schema.ts:18](https://github.com/coda/packs-sdk/blob/main/schema.ts#L18)

___

### Number

• **Number** = `"number"`

Indicates a JavaScript number should be returned.

#### Defined in

[schema.ts:22](https://github.com/coda/packs-sdk/blob/main/schema.ts#L22)

___

### Object

• **Object** = `"object"`

Indicates a JavaScript object should be returned. The schema of each object property must also be specified.

#### Defined in

[schema.ts:34](https://github.com/coda/packs-sdk/blob/main/schema.ts#L34)

___

### String

• **String** = `"string"`

Indicates a JavaScript string should be returned.

#### Defined in

[schema.ts:26](https://github.com/coda/packs-sdk/blob/main/schema.ts#L26)
