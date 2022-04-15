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

[api_types.ts:688](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L688)

___

### Last30Days

• **Last30Days** = `"last_30_days"`

#### Defined in

[api_types.ts:657](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L657)

___

### Last3Months

• **Last3Months** = `"last_3_months"`

#### Defined in

[api_types.ts:660](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L660)

___

### Last6Months

• **Last6Months** = `"last_6_months"`

#### Defined in

[api_types.ts:661](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L661)

___

### Last7Days

• **Last7Days** = `"last_7_days"`

#### Defined in

[api_types.ts:656](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L656)

___

### LastMonth

• **LastMonth** = `"last_month"`

#### Defined in

[api_types.ts:659](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L659)

___

### LastWeek

• **LastWeek** = `"last_week"`

#### Defined in

[api_types.ts:658](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L658)

___

### LastYear

• **LastYear** = `"last_year"`

#### Defined in

[api_types.ts:662](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L662)

___

### Next30Days

• **Next30Days** = `"next_30_days"`

#### Defined in

[api_types.ts:677](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L677)

___

### Next3Months

• **Next3Months** = `"next_3_months"`

#### Defined in

[api_types.ts:680](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L680)

___

### Next6Months

• **Next6Months** = `"next_6_months"`

#### Defined in

[api_types.ts:681](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L681)

___

### Next7Days

• **Next7Days** = `"next_7_days"`

#### Defined in

[api_types.ts:676](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L676)

___

### NextMonth

• **NextMonth** = `"next_month"`

#### Defined in

[api_types.ts:679](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L679)

___

### NextWeek

• **NextWeek** = `"next_week"`

#### Defined in

[api_types.ts:678](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L678)

___

### NextYear

• **NextYear** = `"next_year"`

#### Defined in

[api_types.ts:682](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L682)

___

### ThisMonth

• **ThisMonth** = `"this_month"`

#### Defined in

[api_types.ts:668](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L668)

___

### ThisMonthStart

• **ThisMonthStart** = `"this_month_start"`

#### Defined in

[api_types.ts:669](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L669)

___

### ThisWeek

• **ThisWeek** = `"this_week"`

#### Defined in

[api_types.ts:666](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L666)

___

### ThisWeekStart

• **ThisWeekStart** = `"this_week_start"`

#### Defined in

[api_types.ts:667](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L667)

___

### ThisYear

• **ThisYear** = `"this_year"`

#### Defined in

[api_types.ts:672](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L672)

___

### ThisYearStart

• **ThisYearStart** = `"this_year_start"`

#### Defined in

[api_types.ts:670](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L670)

___

### Today

• **Today** = `"today"`

#### Defined in

[api_types.ts:665](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L665)

___

### Tomorrow

• **Tomorrow** = `"tomorrow"`

#### Defined in

[api_types.ts:675](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L675)

___

### YearToDate

• **YearToDate** = `"year_to_date"`

#### Defined in

[api_types.ts:671](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L671)

___

### Yesterday

• **Yesterday** = `"yesterday"`

#### Defined in

[api_types.ts:655](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L655)
