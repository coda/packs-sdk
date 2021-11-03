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

[api_types.ts:476](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L476)

___

### Last30Days

• **Last30Days** = `"last_30_days"`

#### Defined in

[api_types.ts:445](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L445)

___

### Last3Months

• **Last3Months** = `"last_3_months"`

#### Defined in

[api_types.ts:448](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L448)

___

### Last6Months

• **Last6Months** = `"last_6_months"`

#### Defined in

[api_types.ts:449](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L449)

___

### Last7Days

• **Last7Days** = `"last_7_days"`

#### Defined in

[api_types.ts:444](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L444)

___

### LastMonth

• **LastMonth** = `"last_month"`

#### Defined in

[api_types.ts:447](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L447)

___

### LastWeek

• **LastWeek** = `"last_week"`

#### Defined in

[api_types.ts:446](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L446)

___

### LastYear

• **LastYear** = `"last_year"`

#### Defined in

[api_types.ts:450](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L450)

___

### Next30Days

• **Next30Days** = `"next_30_days"`

#### Defined in

[api_types.ts:465](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L465)

___

### Next3Months

• **Next3Months** = `"next_3_months"`

#### Defined in

[api_types.ts:468](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L468)

___

### Next6Months

• **Next6Months** = `"next_6_months"`

#### Defined in

[api_types.ts:469](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L469)

___

### Next7Days

• **Next7Days** = `"next_7_days"`

#### Defined in

[api_types.ts:464](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L464)

___

### NextMonth

• **NextMonth** = `"next_month"`

#### Defined in

[api_types.ts:467](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L467)

___

### NextWeek

• **NextWeek** = `"next_week"`

#### Defined in

[api_types.ts:466](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L466)

___

### NextYear

• **NextYear** = `"next_year"`

#### Defined in

[api_types.ts:470](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L470)

___

### ThisMonth

• **ThisMonth** = `"this_month"`

#### Defined in

[api_types.ts:456](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L456)

___

### ThisMonthStart

• **ThisMonthStart** = `"this_month_start"`

#### Defined in

[api_types.ts:457](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L457)

___

### ThisWeek

• **ThisWeek** = `"this_week"`

#### Defined in

[api_types.ts:454](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L454)

___

### ThisWeekStart

• **ThisWeekStart** = `"this_week_start"`

#### Defined in

[api_types.ts:455](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L455)

___

### ThisYear

• **ThisYear** = `"this_year"`

#### Defined in

[api_types.ts:460](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L460)

___

### ThisYearStart

• **ThisYearStart** = `"this_year_start"`

#### Defined in

[api_types.ts:458](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L458)

___

### Today

• **Today** = `"today"`

#### Defined in

[api_types.ts:453](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L453)

___

### Tomorrow

• **Tomorrow** = `"tomorrow"`

#### Defined in

[api_types.ts:463](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L463)

___

### YearToDate

• **YearToDate** = `"year_to_date"`

#### Defined in

[api_types.ts:459](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L459)

___

### Yesterday

• **Yesterday** = `"yesterday"`

#### Defined in

[api_types.ts:443](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L443)
