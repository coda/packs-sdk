# Interface: Sync

[core](../modules/core.md).Sync

Information about the current sync, part of the [SyncExecutionContext](core.SyncExecutionContext.md) passed to the
`execute` function of every sync formula.

## Properties

### continuation

• `Optional` **continuation**: [`Continuation`](core.Continuation.md)

The continuation that was returned from the prior sync invocation. The is the exact
value returned in the `continuation` property of result of the prior sync.

#### Defined in

[api_types.ts:644](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L644)

___

### dynamicUrl

• `Optional` **dynamicUrl**: `string`

The dynamic URL that backs this sync table, if this is a dynamic sync table.
The dynamic URL is likely necessary for determining which API resources to fetch.

#### Defined in

[api_types.ts:655](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L655)

___

### schema

• `Optional` **schema**: [`ArraySchema`](core.ArraySchema.md)<[`Schema`](../types/core.Schema.md)\>

The schema of this sync table, if this is a dynamic sync table. It may be useful to have
access to the dynamically-generated schema of the table instance in order to construct
the response for a dynamic sync table's `execute` function.

#### Defined in

[api_types.ts:650](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L650)
