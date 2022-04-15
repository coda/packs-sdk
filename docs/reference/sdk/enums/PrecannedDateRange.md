---
title: "PrecannedDateRange"
---
# Enumeration: PrecannedDateRange

Special "live" date range values that can be used as the [suggestedValue](../interfaces/ParamDef.md#suggestedvalue)
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

[api_types.ts:696](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L696)

___

### Last30Days

• **Last30Days** = `"last_30_days"`

#### Defined in

[api_types.ts:665](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L665)

___

### Last3Months

• **Last3Months** = `"last_3_months"`

#### Defined in

[api_types.ts:668](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L668)

___

### Last6Months

• **Last6Months** = `"last_6_months"`

#### Defined in

[api_types.ts:669](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L669)

___

### Last7Days

• **Last7Days** = `"last_7_days"`

#### Defined in

[api_types.ts:664](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L664)

___

### LastMonth

• **LastMonth** = `"last_month"`

#### Defined in

[api_types.ts:667](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L667)

___

### LastWeek

• **LastWeek** = `"last_week"`

#### Defined in

[api_types.ts:666](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L666)

___

### LastYear

• **LastYear** = `"last_year"`

#### Defined in

[api_types.ts:670](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L670)

___

### Next30Days

• **Next30Days** = `"next_30_days"`

#### Defined in

[api_types.ts:685](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L685)

___

### Next3Months

• **Next3Months** = `"next_3_months"`

#### Defined in

[api_types.ts:688](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L688)

___

### Next6Months

• **Next6Months** = `"next_6_months"`

#### Defined in

[api_types.ts:689](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L689)

___

### Next7Days

• **Next7Days** = `"next_7_days"`

#### Defined in

[api_types.ts:684](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L684)

___

### NextMonth

• **NextMonth** = `"next_month"`

#### Defined in

[api_types.ts:687](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L687)

___

### NextWeek

• **NextWeek** = `"next_week"`

#### Defined in

[api_types.ts:686](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L686)

___

### NextYear

• **NextYear** = `"next_year"`

#### Defined in

[api_types.ts:690](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L690)

___

### ThisMonth

• **ThisMonth** = `"this_month"`

#### Defined in

[api_types.ts:676](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L676)

___

### ThisMonthStart

• **ThisMonthStart** = `"this_month_start"`

#### Defined in

[api_types.ts:677](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L677)

___

### ThisWeek

• **ThisWeek** = `"this_week"`

#### Defined in

[api_types.ts:674](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L674)

___

### ThisWeekStart

• **ThisWeekStart** = `"this_week_start"`

#### Defined in

[api_types.ts:675](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L675)

___

### ThisYear

• **ThisYear** = `"this_year"`

#### Defined in

[api_types.ts:680](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L680)

___

### ThisYearStart

• **ThisYearStart** = `"this_year_start"`

#### Defined in

[api_types.ts:678](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L678)

___

### Today

• **Today** = `"today"`

#### Defined in

[api_types.ts:673](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L673)

___

### Tomorrow

• **Tomorrow** = `"tomorrow"`

#### Defined in

[api_types.ts:683](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L683)

___

### YearToDate

• **YearToDate** = `"year_to_date"`

#### Defined in

[api_types.ts:679](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L679)

___

### Yesterday

• **Yesterday** = `"yesterday"`

#### Defined in

[api_types.ts:663](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L663)
