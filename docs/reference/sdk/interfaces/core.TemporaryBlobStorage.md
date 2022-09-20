---
nav: "TemporaryBlobStorage"
---
# Interface: TemporaryBlobStorage

[core](../modules/core.md).TemporaryBlobStorage

A utility for temporarily storing files and images that either require authentication
or are too large to return inline.

When syncing data from certain APIs, a response object may include the URL of a file or
image that can only be downloaded with the user's authentication credentials. Normally,
you can just return an image or file URL from a formula invocation, and if the schema
indicates that the value represents an attachment, Coda will ingest the data at that URL
and host it from Coda. However, if the URL requires authentication, Coda will be unable
to download the data since this ingestion does not happen within the packs execution
environment.

The solution is for your pack code to fetch the data at the URL, since the pack
execution environment will apply the user's authentication, and then you can
stash the downloaded value in `TemporaryBlobStorage`, which will return a temporary
URL that you can return from the pack. Coda will be able to ingest the data from
that temporary URL.

Similarly, suppose your formula generates a very large value like a dynamically-generated
image that you wish to return and have Coda render. Pack return values are meant to be
fairly small, representing human-readable data. Large values like images are meant to
be returned as URLs referencing that data. So rather than return the raw image data,
your pack should use [storeBlob](core.TemporaryBlobStorage.md#storeblob) to upload that large data to temporary storage.
You will be returned a URL that you can then return with your formula response, and
Coda will ingest the data from that URL into permanent storage.

## Methods

### storeBlob

▸ **storeBlob**(`blobData`, `contentType`, `opts?`): `Promise`<`string`\>

Stores the given data as a file with the given content type in Coda-hosted temporary storage.
Returns a URL for the temporary file that you should return in your formula response.

The URL expires after 15 minutes by default, but you may pass a custom expiry, however
Coda reserves the right to ignore long expirations.

If the `downloadFilename` parameter is specified, the data will be interpreted as a file (`attachment` content
disposition) that will be downloaded when accessed as the file name provided.

#### Parameters

| Name | Type |
| :------ | :------ |
| `blobData` | `Buffer` |
| `contentType` | `string` |
| `opts?` | `Object` |
| `opts.downloadFilename?` | `string` |
| `opts.expiryMs?` | `number` |

#### Returns

`Promise`<`string`\>

#### Defined in

[api_types.ts:617](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L617)

___

### storeUrl

▸ **storeUrl**(`url`, `opts?`, `fetchOpts?`): `Promise`<`string`\>

Fetches the data at the given URL, applying user authentication credentials as appropriate,
and stores it in Coda-hosted temporary storage. Returns a URL for the temporary file
that you should return in your formula response.

The URL expires after 15 minutes by default, but you may pass a custom expiry, however
Coda reserves the right to ignore long expirations.

If the `downloadFilename` parameter is specified, the data will be interpreted as a file (`attachment` content
disposition) that will be downloaded when accessed as the file name provided.

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |
| `opts?` | `Object` |
| `opts.downloadFilename?` | `string` |
| `opts.expiryMs?` | `number` |
| `fetchOpts?` | `Pick`<[`FetchRequest`](core.FetchRequest.md), ``"disableAuthentication"``\> |

#### Returns

`Promise`<`string`\>

#### Defined in

[api_types.ts:602](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L602)
