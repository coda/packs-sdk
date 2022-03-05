---
title: "InvocationLocation"
---
# Interface: InvocationLocation

Information about the Coda environment and doc this formula was invoked from, for Coda internal use.

## Properties

### docId

• `Optional` **docId**: `string`

**`deprecated`** This will be removed in a future version of the SDK.

#### Defined in

[api_types.ts:570](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L570)

___

### packId

• `Optional` **packId**: `number`

The ID of the pack executing this formula.

#### Defined in

[api_types.ts:573](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L573)

___

### protocolAndHost

• **protocolAndHost**: `string`

The base URL of the Coda environment executing this formula. Only for Coda internal use.

#### Defined in

[api_types.ts:566](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L566)
