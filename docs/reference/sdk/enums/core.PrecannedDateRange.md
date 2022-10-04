---
nav: "PrecannedDateRange"
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

[api_types.ts:838](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L838)

___

### Last30Days

• **Last30Days** = ``"last_30_days"``

#### Defined in

[api_types.ts:807](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L807)

___

### Last3Months

• **Last3Months** = ``"last_3_months"``

#### Defined in

[api_types.ts:810](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L810)

___

### Last6Months

• **Last6Months** = ``"last_6_months"``

#### Defined in

[api_types.ts:811](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L811)

___

### Last7Days

• **Last7Days** = ``"last_7_days"``

#### Defined in

[api_types.ts:806](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L806)

___

### LastMonth

• **LastMonth** = ``"last_month"``

#### Defined in

[api_types.ts:809](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L809)

___

### LastWeek

• **LastWeek** = ``"last_week"``

#### Defined in

[api_types.ts:808](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L808)

___

### LastYear

• **LastYear** = ``"last_year"``

#### Defined in

[api_types.ts:812](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L812)

___

### Next30Days

• **Next30Days** = ``"next_30_days"``

#### Defined in

[api_types.ts:827](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L827)

___

### Next3Months

• **Next3Months** = ``"next_3_months"``

#### Defined in

[api_types.ts:830](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L830)

___

### Next6Months

• **Next6Months** = ``"next_6_months"``

#### Defined in

[api_types.ts:831](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L831)

___

### Next7Days

• **Next7Days** = ``"next_7_days"``

#### Defined in

[api_types.ts:826](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L826)

___

### NextMonth

• **NextMonth** = ``"next_month"``

#### Defined in

[api_types.ts:829](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L829)

___

### NextWeek

• **NextWeek** = ``"next_week"``

#### Defined in

[api_types.ts:828](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L828)

___

### NextYear

• **NextYear** = ``"next_year"``

#### Defined in

[api_types.ts:832](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L832)

___

### ThisMonth

• **ThisMonth** = ``"this_month"``

#### Defined in

[api_types.ts:818](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L818)

___

### ThisMonthStart

• **ThisMonthStart** = ``"this_month_start"``

#### Defined in

[api_types.ts:819](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L819)

___

### ThisWeek

• **ThisWeek** = ``"this_week"``

#### Defined in

[api_types.ts:816](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L816)

___

### ThisWeekStart

• **ThisWeekStart** = ``"this_week_start"``

#### Defined in

[api_types.ts:817](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L817)

___

### ThisYear

• **ThisYear** = ``"this_year"``

#### Defined in

[api_types.ts:822](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L822)

___

### ThisYearStart

• **ThisYearStart** = ``"this_year_start"``

#### Defined in

[api_types.ts:820](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L820)

___

### Today

• **Today** = ``"today"``

#### Defined in

[api_types.ts:815](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L815)

___

### Tomorrow

• **Tomorrow** = ``"tomorrow"``

#### Defined in

[api_types.ts:825](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L825)

___

### YearToDate

• **YearToDate** = ``"year_to_date"``

#### Defined in

[api_types.ts:821](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L821)

___

### Yesterday

• **Yesterday** = ``"yesterday"``

#### Defined in

[api_types.ts:805](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L805)
