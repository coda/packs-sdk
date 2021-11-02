# Interface: TemporaryBlobStorage

## Methods

### storeBlob

▸ **storeBlob**(`blobData`, `contentType`, `opts?`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `blobData` | `Buffer` |
| `contentType` | `string` |
| `opts?` | `Object` |
| `opts.expiryMs?` | `number` |

#### Returns

`Promise`<`string`\>

#### Defined in

[api_types.ts:330](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L330)

___

### storeUrl

▸ **storeUrl**(`url`, `opts?`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |
| `opts?` | `Object` |
| `opts.expiryMs?` | `number` |

#### Returns

`Promise`<`string`\>

#### Defined in

[api_types.ts:329](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L329)
