# Enumeration: PrecannedDateRange

Special "live" date range values that can be used as the [defaultValue](../interfaces/ParamDef.md#defaultvalue)
for a date array parameter.

Date array parameters are meant to represent date ranges. A date range can
be a fixed range, e.g. April 1, 2020 - May 15, 2020, or it can be a "live"
range, like "last 30 days".

At execution time, a date range will always be passed to a pack as an
array of two specific dates, but for many use cases, it is necessary
to provide a default value that is a "live" range rather than hardcoded
one. For example, if your pack has a table that syncs recent emails,
you might want to have a date range parameter that default to
"last 7 days". Defaulting to a hardcoded date range would not be useful
and requiring the user to always specify a date range may be inconvenient.

## Enumeration members

### Everything

• **Everything** = `"everything"`

Indicates a date range beginning in the very distant past (e.g. 1/1/1, aka 1 A.D.)
and ending in the distant future (e.g. 12/31/3999). Exact dates are subject to change.

#### Defined in

[api_types.ts:677](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L677)

___

### Last30Days

• **Last30Days** = `"last_30_days"`

#### Defined in

[api_types.ts:646](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L646)

___

### Last3Months

• **Last3Months** = `"last_3_months"`

#### Defined in

[api_types.ts:649](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L649)

___

### Last6Months

• **Last6Months** = `"last_6_months"`

#### Defined in

[api_types.ts:650](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L650)

___

### Last7Days

• **Last7Days** = `"last_7_days"`

#### Defined in

[api_types.ts:645](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L645)

___

### LastMonth

• **LastMonth** = `"last_month"`

#### Defined in

[api_types.ts:648](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L648)

___

### LastWeek

• **LastWeek** = `"last_week"`

#### Defined in

[api_types.ts:647](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L647)

___

### LastYear

• **LastYear** = `"last_year"`

#### Defined in

[api_types.ts:651](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L651)

___

### Next30Days

• **Next30Days** = `"next_30_days"`

#### Defined in

[api_types.ts:666](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L666)

___

### Next3Months

• **Next3Months** = `"next_3_months"`

#### Defined in

[api_types.ts:669](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L669)

___

### Next6Months

• **Next6Months** = `"next_6_months"`

#### Defined in

[api_types.ts:670](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L670)

___

### Next7Days

• **Next7Days** = `"next_7_days"`

#### Defined in

[api_types.ts:665](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L665)

___

### NextMonth

• **NextMonth** = `"next_month"`

#### Defined in

[api_types.ts:668](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L668)

___

### NextWeek

• **NextWeek** = `"next_week"`

#### Defined in

[api_types.ts:667](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L667)

___

### NextYear

• **NextYear** = `"next_year"`

#### Defined in

[api_types.ts:671](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L671)

___

### ThisMonth

• **ThisMonth** = `"this_month"`

#### Defined in

[api_types.ts:657](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L657)

___

### ThisMonthStart

• **ThisMonthStart** = `"this_month_start"`

#### Defined in

[api_types.ts:658](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L658)

___

### ThisWeek

• **ThisWeek** = `"this_week"`

#### Defined in

[api_types.ts:655](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L655)

___

### ThisWeekStart

• **ThisWeekStart** = `"this_week_start"`

#### Defined in

[api_types.ts:656](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L656)

___

### ThisYear

• **ThisYear** = `"this_year"`

#### Defined in

[api_types.ts:661](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L661)

___

### ThisYearStart

• **ThisYearStart** = `"this_year_start"`

#### Defined in

[api_types.ts:659](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L659)

___

### Today

• **Today** = `"today"`

#### Defined in

[api_types.ts:654](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L654)

___

### Tomorrow

• **Tomorrow** = `"tomorrow"`

#### Defined in

[api_types.ts:664](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L664)

___

### YearToDate

• **YearToDate** = `"year_to_date"`

#### Defined in

[api_types.ts:660](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L660)

___

### Yesterday

• **Yesterday** = `"yesterday"`

#### Defined in

[api_types.ts:644](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L644)
