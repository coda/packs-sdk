# Interface: InvocationLocation

Information about the Coda environment and doc this formula was invoked from.
This is mostly for Coda internal use and we do not recommend relying on it.

## Properties

### docId

• `Optional` **docId**: `string`

The ID of the Coda doc this formula was invoked from, if any.
This may be removed in a future version of the SDK so should not be relied upon.

#### Defined in

[api_types.ts:574](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L574)

___

### protocolAndHost

• **protocolAndHost**: `string`

The base URL of the Coda environment executing this formula. Only for Coda internal use.

#### Defined in

[api_types.ts:569](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L569)
