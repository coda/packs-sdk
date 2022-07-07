---
title: "SetEndpoint"
---
# Interface: SetEndpoint

[core](../modules/core.md).SetEndpoint

Configuration for a step that will run after the user sets up a new account
that fetches a set of endpoint domains that the user has access to and prompts
the user to select the one that should apply to this account.

The selected endpoint domain is bound to this account and used as the root domain
of HTTP requests made by the fetcher. (Whenever an endpoint is associated with
an account, it is available at execution time as `context.endpoint`, and alternatively
can make fetcher requests using relative URLs and the fetcher will apply the endpoint
to the URL automatically.)

As an example, we use this in the Jira pack to set up the Jira instance endpoint
to use with the user's account. A Jira account may have access to multiple
Jira instances; after authorizing the user account, this step makes an API call to
fetch all of the Jira instances that the user has access to, which are rendered as
options for the user, and the endpoint domain of the select option
(of the form <instance>.atlassian.net) is stored along with this account.

## Properties

### description

• **description**: `string`

A description to render to the user describing the selection they should be making,
for example, "Choose an instance to use with this account".

#### Defined in

[types.ts:153](https://github.com/coda/packs-sdk/blob/main/types.ts#L153)

___

### getOptions

• `Optional` **getOptions**: [`MetadataFormula`](../types/core.MetadataFormula.md)

The formula that fetches endpoints for the user
to select from. Like any [MetadataFormula](../types/core.MetadataFormula.md), this formula should return
an array of options, either strings or objects of the form
`{display: '<display name>', value: '<endpoint>'}` if wanting to render a display
label to the user rather than rendering the underlying value directly.

#### Defined in

[types.ts:161](https://github.com/coda/packs-sdk/blob/main/types.ts#L161)

___

### getOptionsFormula

• `Optional` **getOptionsFormula**: [`MetadataFormula`](../types/core.MetadataFormula.md)

**`Deprecated`**

Use [getOptions](core.SetEndpoint.md#getoptions)

#### Defined in

[types.ts:163](https://github.com/coda/packs-sdk/blob/main/types.ts#L163)

___

### name

• **name**: `string`

An arbitrary name for this step, to distinguish from other steps of the same type
(exceedingly rare).

#### Defined in

[types.ts:148](https://github.com/coda/packs-sdk/blob/main/types.ts#L148)

___

### type

• **type**: [`SetEndpoint`](../enums/core.PostSetupType.md#setendpoint)

Identifies this as a SetEndpoint step.

#### Defined in

[types.ts:143](https://github.com/coda/packs-sdk/blob/main/types.ts#L143)
