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

[api_types.ts:644](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L644)

___

### Last30Days

• **Last30Days** = `"last_30_days"`

#### Defined in

[api_types.ts:613](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L613)

___

### Last3Months

• **Last3Months** = `"last_3_months"`

#### Defined in

[api_types.ts:616](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L616)

___

### Last6Months

• **Last6Months** = `"last_6_months"`

#### Defined in

[api_types.ts:617](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L617)

___

### Last7Days

• **Last7Days** = `"last_7_days"`

#### Defined in

[api_types.ts:612](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L612)

___

### LastMonth

• **LastMonth** = `"last_month"`

#### Defined in

[api_types.ts:615](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L615)

___

### LastWeek

• **LastWeek** = `"last_week"`

#### Defined in

[api_types.ts:614](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L614)

___

### LastYear

• **LastYear** = `"last_year"`

#### Defined in

[api_types.ts:618](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L618)

___

### Next30Days

• **Next30Days** = `"next_30_days"`

#### Defined in

[api_types.ts:633](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L633)

___

### Next3Months

• **Next3Months** = `"next_3_months"`

#### Defined in

[api_types.ts:636](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L636)

___

### Next6Months

• **Next6Months** = `"next_6_months"`

#### Defined in

[api_types.ts:637](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L637)

___

### Next7Days

• **Next7Days** = `"next_7_days"`

#### Defined in

[api_types.ts:632](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L632)

___

### NextMonth

• **NextMonth** = `"next_month"`

#### Defined in

[api_types.ts:635](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L635)

___

### NextWeek

• **NextWeek** = `"next_week"`

#### Defined in

[api_types.ts:634](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L634)

___

### NextYear

• **NextYear** = `"next_year"`

#### Defined in

[api_types.ts:638](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L638)

___

### ThisMonth

• **ThisMonth** = `"this_month"`

#### Defined in

[api_types.ts:624](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L624)

___

### ThisMonthStart

• **ThisMonthStart** = `"this_month_start"`

#### Defined in

[api_types.ts:625](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L625)

___

### ThisWeek

• **ThisWeek** = `"this_week"`

#### Defined in

[api_types.ts:622](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L622)

___

### ThisWeekStart

• **ThisWeekStart** = `"this_week_start"`

#### Defined in

[api_types.ts:623](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L623)

___

### ThisYear

• **ThisYear** = `"this_year"`

#### Defined in

[api_types.ts:628](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L628)

___

### ThisYearStart

• **ThisYearStart** = `"this_year_start"`

#### Defined in

[api_types.ts:626](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L626)

___

### Today

• **Today** = `"today"`

#### Defined in

[api_types.ts:621](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L621)

___

### Tomorrow

• **Tomorrow** = `"tomorrow"`

#### Defined in

[api_types.ts:631](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L631)

___

### YearToDate

• **YearToDate** = `"year_to_date"`

#### Defined in

[api_types.ts:627](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L627)

___

### Yesterday

• **Yesterday** = `"yesterday"`

#### Defined in

[api_types.ts:611](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L611)
