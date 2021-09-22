# Enumeration: DefaultConnectionType

Ways in which a user account can be used with a doc.

## Enumeration members

### ProxyActionsOnly

• **ProxyActionsOnly** = `3`

The account can only be used by the Coda user who set up the account, and only to take
actions (i.e. push buttons). Each Coda user that uses the pack will be prompted to
connect their own private (AKA proxy) account. Private accounts can't be used to retrieve
data, because all users in the doc must be able to retrieve the same data.

#### Defined in

[types.ts:129](https://github.com/coda/packs-sdk/blob/main/types.ts#L129)

___

### Shared

• **Shared** = `2`

The account can be used by any user in the doc both to retrieve data and to take actions.

#### Defined in

[types.ts:122](https://github.com/coda/packs-sdk/blob/main/types.ts#L122)

___

### SharedDataOnly

• **SharedDataOnly** = `1`

The account can be used by any user in the a doc, but only to read data. The account can't be
used to take actions (i.e. push buttons).

#### Defined in

[types.ts:118](https://github.com/coda/packs-sdk/blob/main/types.ts#L118)
