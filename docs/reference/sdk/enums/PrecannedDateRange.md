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

[api_types.ts:715](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L715)

___

### Last30Days

• **Last30Days** = `"last_30_days"`

#### Defined in

[api_types.ts:684](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L684)

___

### Last3Months

• **Last3Months** = `"last_3_months"`

#### Defined in

[api_types.ts:687](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L687)

___

### Last6Months

• **Last6Months** = `"last_6_months"`

#### Defined in

[api_types.ts:688](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L688)

___

### Last7Days

• **Last7Days** = `"last_7_days"`

#### Defined in

[api_types.ts:683](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L683)

___

### LastMonth

• **LastMonth** = `"last_month"`

#### Defined in

[api_types.ts:686](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L686)

___

### LastWeek

• **LastWeek** = `"last_week"`

#### Defined in

[api_types.ts:685](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L685)

___

### LastYear

• **LastYear** = `"last_year"`

#### Defined in

[api_types.ts:689](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L689)

___

### Next30Days

• **Next30Days** = `"next_30_days"`

#### Defined in

[api_types.ts:704](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L704)

___

### Next3Months

• **Next3Months** = `"next_3_months"`

#### Defined in

[api_types.ts:707](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L707)

___

### Next6Months

• **Next6Months** = `"next_6_months"`

#### Defined in

[api_types.ts:708](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L708)

___

### Next7Days

• **Next7Days** = `"next_7_days"`

#### Defined in

[api_types.ts:703](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L703)

___

### NextMonth

• **NextMonth** = `"next_month"`

#### Defined in

[api_types.ts:706](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L706)

___

### NextWeek

• **NextWeek** = `"next_week"`

#### Defined in

[api_types.ts:705](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L705)

___

### NextYear

• **NextYear** = `"next_year"`

#### Defined in

[api_types.ts:709](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L709)

___

### ThisMonth

• **ThisMonth** = `"this_month"`

#### Defined in

[api_types.ts:695](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L695)

___

### ThisMonthStart

• **ThisMonthStart** = `"this_month_start"`

#### Defined in

[api_types.ts:696](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L696)

___

### ThisWeek

• **ThisWeek** = `"this_week"`

#### Defined in

[api_types.ts:693](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L693)

___

### ThisWeekStart

• **ThisWeekStart** = `"this_week_start"`

#### Defined in

[api_types.ts:694](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L694)

___

### ThisYear

• **ThisYear** = `"this_year"`

#### Defined in

[api_types.ts:699](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L699)

___

### ThisYearStart

• **ThisYearStart** = `"this_year_start"`

#### Defined in

[api_types.ts:697](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L697)

___

### Today

• **Today** = `"today"`

#### Defined in

[api_types.ts:692](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L692)

___

### Tomorrow

• **Tomorrow** = `"tomorrow"`

#### Defined in

[api_types.ts:702](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L702)

___

### YearToDate

• **YearToDate** = `"year_to_date"`

#### Defined in

[api_types.ts:698](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L698)

___

### Yesterday

• **Yesterday** = `"yesterday"`

#### Defined in

[api_types.ts:682](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L682)
