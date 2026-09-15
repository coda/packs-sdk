# Agent builder API reference

These are the calls `sdk.newAgent()` returns. Everything else in `packs-sdk`'s builder API (sync
tables, formulas, `newPack()`) is for connector packs, not agents — an agent pack only uses the calls
below.

## `setInstructions(instructions: string)`

The only required call. A plain string — the agent's system instructions.

```typescript
pack.setInstructions("You help a team run async standups. Keep replies short.");
```

## `setTools({docs, mail, webSearch, connectors})`

Anything left out is off — this call replaces the tool set each time, it doesn't merge with a prior
call.

```typescript
pack.setTools({
  docs: true,
  mail: true,
  webSearch: {allowedDomains: ['docs.example.com']},   // or just `true` for unrestricted
  connectors: [
    {packId: 1234, formulas: [{formulaName: 'CreateTask'}]},  // restrict to specific formulas
    {packId: 5678},                                            // or grant the whole connector
  ],
});
```

- `docs: true` → Coda/Superhuman Docs read+write access.
- `mail: true` → Mail & Calendar (Superhuman Mail) access.
- `webSearch: true | {allowedDomains: string[]}` → web search, optionally domain-restricted.
- `connectors: Array<{packId: number, formulas?: Array<{formulaName: string}>}>` → grants access to
  other packs (e.g. Slack) by pack ID, optionally narrowed to specific formulas.

### Finding a connector's pack ID

Browse https://superhuman.com/store/connectors, open the connector's listing, and read its pack ID off
the listing page.

Use `setTools` above and the two trigger setters below to define the agent.

## `setDefaultScheduleTrigger({rruleString})`

```typescript
pack.setDefaultScheduleTrigger({
  rruleString: [
    "DTSTART;TZID=America/New_York:20260101T090000",
    "RRULE:FREQ=WEEKLY;BYDAY=MO;BYHOUR=9;BYMINUTE=0",
  ].join("\n"),
});
```

`rruleString` is one `DTSTART` line (optional) plus one `RRULE` line, RFC 5545 style. The schedule
trigger accepts:

- `FREQ` must be `HOURLY`, `DAILY`, `WEEKLY`, `MONTHLY`, or `YEARLY` — `MINUTELY`/`SECONDLY` are
  rejected outright ("must not run more frequently than once per hour"), as is any combination of
  `BYHOUR`/`BYMINUTE` that packs two runs into the same hour.
- Supported rule parts: `FREQ`, `INTERVAL`, `COUNT`, `UNTIL`, `WKST`, `BYDAY` (optionally ordinal, e.g.
  `-1FR` for "last Friday", ranged ±1–53), `BYHOUR`, `BYMINUTE`, `BYMONTH`, `BYMONTHDAY` (±1–31),
  `BYSETPOS` (±1–366). Anything else (e.g. `BYSECOND`, `BYWEEKNO`) is rejected.
- `DTSTART` takes an optional `TZID` param (validated against Node's ICU timezone data) or a bare
  date/date-time; can't combine a `TZID` with a trailing `Z`.
- Several of these parts (`BYSETPOS`, `WKST`, `COUNT`, ordinal `BYDAY`) are validated as legal by the
  SDK but may not have a corresponding field in the builder's schedule-trigger form — see "Testing
  recurrence rules" in `SKILL.md`.

## `setDefaultWhileWritingTrigger({condition, surfaces})`

```typescript
pack.setDefaultWhileWritingTrigger({
  condition: "Offer a citation when the user asserts a statistic",
  surfaces: [sdk.ContextualTriggerSurface.Docs, sdk.ContextualTriggerSurface.Email],
});
```

`condition` is a natural-language string describing when the trigger should fire. `surfaces` is an
array of `sdk.ContextualTriggerSurface` values (e.g. `Docs`, `Email`) naming where it's active.

## Full working example

```typescript
import * as sdk from "@codahq/packs-sdk";

export const pack = sdk.newAgent();
pack.setInstructions("print hello world, then send a slack message to myself for the current date");

pack.setTools({
  docs: true,
  mail: true,
  webSearch: {allowedDomains: ['status.example.com']},
  connectors: [{packId: 1000}, {packId: 1002}, {packId: 1004}],
});

pack.setDefaultScheduleTrigger({
  rruleString: [
    "DTSTART;TZID=America/New_York:20260101T090000",
    "RRULE:FREQ=WEEKLY;BYDAY=MO;BYHOUR=9;BYMINUTE=0",
  ].join("\n"),
});

pack.setDefaultWhileWritingTrigger({
  condition: "Offer a citation when the user asserts a statistic",
  surfaces: [sdk.ContextualTriggerSurface.Docs, sdk.ContextualTriggerSurface.Email],
});
```
