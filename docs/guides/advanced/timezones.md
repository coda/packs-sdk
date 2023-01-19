---
nav: Timezones
description: Work with dates and times across the various timezone contexts in a Pack.
cSpell:words: Luxon
---

# Timezones in Coda

Every Coda document has a **Timezone** setting in the **Region** section of the settings menu, that defaults to the timezone of the device that created it. All dates and times entered in the document are interpreted in the context of that timezone. Users often don't need to be aware this, since all of their interactions with the dates and times take place in the context of that doc.

Packs don't have a configurable timezone however, and all date and time operations in Pack code run in [Coordinated Universal Time (UTC)][wikipedia_utc]. The timezone of the document is passed to Pack formulas as [`context.timezone`][ExecutionContext_timezone], containing an [IANA timezone identifier][wikipedia_tz] (ex: `America/New_York`).


## Timezone shifting {: #shifting}

Any date or time values passed into a Pack are shifted from the doc's timezone to UTC. For example, the value "11/12/1955, 10:04 PM" in a document with the timezone set to "America/Los Angeles" will be passed to a Pack as `1955-11-13T06:04:00.000Z`. While this accurately represents the exact same moment in time, you'll notice that the day and hour values have changed due to the change in timezone.

!!! info
    Timezone shifting of parameters happens even for date-only (ex: `11/12/1955`) and time-only (`10:04 PM`) values. As per the [Parameters guide][parameters_date], these values are passed to Packs as full `Date` objects.

Likewise when returning a date or time value Coda will shift the value back. When the value represents an exact moment in time (either a number of seconds since the epoch or a full date and time string with a timezone identifier) it will be shifted to that equivalent moment in the document's timezone. However, if the Pack returns a string which represents a relative date or time (it's just a date or time, or has no timezone identifier) it will be assumed that it's already in the timezone of the document and won't be shifted.


## Working with timezones {: #working}

Because of timezone shifting you often can't use the `Date` objects in Packs like you would in other environments. Getter methods like `getHour()` or `getDate()` will return those values in a UTC context, which may be different than what the user has entered. Likewise setter methods like `setHour()` or `setDate()` won't work correctly, as they aren't aware of the daylight savings time rules in the document's timezone.

Unfortunately JavaScript's native `Date` class doesn't provide the ability to easily work with dates across timezones. For instance, you can't change the timezone of a Date object or pass a timezone to methods like `getHours()`. Listed below are some approaches to deal with this limitation.


### Localized strings

You can get a string version of a date object localized to the timezone of the document by using the `toLocaleString()` method and the `timeZone` option:

```ts
let formatted = date.toLocaleString("en-US", {
  timeZone: context.timezone,
});
```

There are also equivalent `getLocaleDateString()` and `getLocaleTimeString()` methods for getting just the date or time component respectively.


### Localized parts

The JavaScript class `Intl.DateTimeFormat` allows for formatting a date using a [variety of options][DateTimeFormat_parameters]. Instead of formatting a date into a single string, it also has the ability to format it into a set of named parts. This allows you to more easily extract various portions of the date or time, within the document's timezone.

```ts
let formatter = new Intl.DateTimeFormat("en", {
  timeZone: context.timezone, // Use the doc's timezone (important!)
  year: "numeric",
  month: "numeric",
  day: "numeric",
});

// Format the date into individual parts.
let parts = formatter.formatToParts(date);

// Find the day, month, and year parts.
let day = parts.find(part => part.type === "day").value;
let month = parts.find(part => part.type === "month").value;
let year = parts.find(part => part.type === "year").value;
```


### Libraries

If you are building a Pack using the CLI you may want to consider utilizing more robust date libraries. The JavaScript community has a number of them, with some of the most popular being [Moment.js][moment], [Luxon][luxon], [Day.js][dayjs], and [date-fns][date_fns]. In addition to allowing you to work across timezones, they also often include helper functions and utilities that make it easier to do common tasks.



[wikipedia_utc]: https://en.wikipedia.org/wiki/Coordinated_Universal_Time
[wikipedia_tz]: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
[moment]: https://momentjs.com/
[luxon]: https://moment.github.io/luxon/#/
[dayjs]: https://day.js.org/
[date_fns]: https://date-fns.org/
[DateTimeFormat_parameters]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#parameters
[luxon_math]: https://moment.github.io/luxon/#/math?id=calendar-math-vs-time-math
[parameters_date]: ../basics/parameters/index.md#dates
[data_types_date]: ../basics/data_types.md#dates
[data_types_duration]: ../basics/data_types.md#durations
[ExecutionContext_timezone]: ../../reference/sdk/interfaces/core.ExecutionContext.md#timezone
