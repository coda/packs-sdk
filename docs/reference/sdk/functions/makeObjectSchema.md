# Function: makeObjectSchema

▸ **makeObjectSchema**<`K`, `L`, `T`\>(`schemaDef`): `T` & { `identity?`: [`Identity`](../interfaces/Identity.md) ; `type`: [`Object`](../enums/ValueType.md#object)  }

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends `string` |
| `L` | extends `string` |
| `T` | extends `Omit`<`ObjectSchemaDefinition`<`K`, `L`\>, ``"type"``\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `schemaDef` | `T` & { `type?`: [`Object`](../enums/ValueType.md#object)  } |

#### Returns

`T` & { `identity?`: [`Identity`](../interfaces/Identity.md) ; `type`: [`Object`](../enums/ValueType.md#object)  }

#### Defined in

[schema.ts:735](https://github.com/coda/packs-sdk/blob/main/schema.ts#L735)
