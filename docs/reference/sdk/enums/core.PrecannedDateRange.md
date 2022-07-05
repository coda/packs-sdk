---
title: "PrecannedDateRange"
---
# Enumeration: PrecannedDateRange

[core](../modules/core.md).PrecannedDateRange

Special "live" date range values that can be used as the [suggestedValue](../interfaces/core.ParamDef.md#suggestedvalue)
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

## Enumeration Members

### Everything

• **Everything** = ``"everything"``

Indicates a date range beginning in the very distant past (e.g. 1/1/1, aka 1 A.D.)
and ending in the distant future (e.g. 12/31/3999). Exact dates are subject to change.

#### Defined in

[api_types.ts:779](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L779)

___

### Last30Days

• **Last30Days** = ``"last_30_days"``

#### Defined in

[api_types.ts:748](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L748)

___

### Last3Months

• **Last3Months** = ``"last_3_months"``

#### Defined in

[api_types.ts:751](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L751)

___

### Last6Months

• **Last6Months** = ``"last_6_months"``

#### Defined in

[api_types.ts:752](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L752)

___

### Last7Days

• **Last7Days** = ``"last_7_days"``

#### Defined in

[api_types.ts:747](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L747)

___

### LastMonth

• **LastMonth** = ``"last_month"``

#### Defined in

[api_types.ts:750](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L750)

___

### LastWeek

• **LastWeek** = ``"last_week"``

#### Defined in

[api_types.ts:749](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L749)

___

### LastYear

• **LastYear** = ``"last_year"``

#### Defined in

[api_types.ts:753](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L753)

___

### Next30Days

• **Next30Days** = ``"next_30_days"``

#### Defined in

[api_types.ts:768](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L768)

___

### Next3Months

• **Next3Months** = ``"next_3_months"``

#### Defined in

[api_types.ts:771](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L771)

___

### Next6Months

• **Next6Months** = ``"next_6_months"``

#### Defined in

[api_types.ts:772](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L772)

___

### Next7Days

• **Next7Days** = ``"next_7_days"``

#### Defined in

[api_types.ts:767](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L767)

___

### NextMonth

• **NextMonth** = ``"next_month"``

#### Defined in

[api_types.ts:770](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L770)

___

### NextWeek

• **NextWeek** = ``"next_week"``

#### Defined in

[api_types.ts:769](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L769)

___

### NextYear

• **NextYear** = ``"next_year"``

#### Defined in

[api_types.ts:773](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L773)

___

### ThisMonth

• **ThisMonth** = ``"this_month"``

#### Defined in

[api_types.ts:759](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L759)

___

### ThisMonthStart

• **ThisMonthStart** = ``"this_month_start"``

#### Defined in

[api_types.ts:760](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L760)

___

### ThisWeek

• **ThisWeek** = ``"this_week"``

#### Defined in

[api_types.ts:757](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L757)

___

### ThisWeekStart

• **ThisWeekStart** = ``"this_week_start"``

#### Defined in

[api_types.ts:758](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L758)

___

### ThisYear

• **ThisYear** = ``"this_year"``

#### Defined in

[api_types.ts:763](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L763)

___

### ThisYearStart

• **ThisYearStart** = ``"this_year_start"``

#### Defined in

[api_types.ts:761](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L761)

___

### Today

• **Today** = ``"today"``

#### Defined in

[api_types.ts:756](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L756)

___

### Tomorrow

• **Tomorrow** = ``"tomorrow"``

#### Defined in

[api_types.ts:766](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L766)

___

### YearToDate

• **YearToDate** = ``"year_to_date"``

#### Defined in

[api_types.ts:762](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L762)

___

### Yesterday

• **Yesterday** = ``"yesterday"``

#### Defined in

[api_types.ts:746](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L746)
