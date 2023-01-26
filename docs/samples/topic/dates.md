---
nav: Dates and times
description: Samples that show how to work with dates and times.
icon: material/calendar-clock
---

# Dates and time samples

Working with dates and times can be tricky, especially in Coda due to documents and operating in different timezones. These samples demonstrate some patterns you can use when taking them are parameters or returning them as results.


[Learn More](../../../guides/advanced/timezones){ .md-button }

## Local date
A formula that requires getting a date in the document&#x27;s timezone. This sample determines if the year of a given date would make for good New Years Eve glasses (has two or more zeros).

```ts
{% raw %}
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

pack.addFormula({
  name: "GoodNYEGlasses",
  description: "Determines if a date is good for New Years Eve glasses " +
    "(the year contains two zeros).",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.Date,
      name: "date",
      description: "The input date.",
    }),
  ],
  resultType: coda.ValueType.Boolean,
  execute: async function ([date], context) {
    // Format the JavaScript Date into a four-digit year.
    let formatted = date.toLocaleDateString("en", {
      timeZone: context.timezone, // Use the timezone of the doc (important!).
      year: "numeric",
    });
    // Extract all of the zeros from the year.
    let zeros = formatted.match(/0/g);
    return zeros?.length >= 2;
  },
});
{% endraw %}
```
## Local time
A formula that requires getting a time in the document&#x27;s timezone. This sample shows a time using the military format (ex: &quot;0900 hours&quot;).

```ts
{% raw %}
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Displays a time using military conventions. The result is a string (text)
// value.
pack.addFormula({
  name: "ToMilitaryTime",
  description: "Displays a time in military time.",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.Date,
      name: "time",
      description: "The input time.",
    }),
  ],
  resultType: coda.ValueType.String,
  execute: async function ([time], context) {
    // Format the JavaScript Date into 2-digit, 24 hour time.
    let formatted = time.toLocaleTimeString("en-US", {
      timeZone: context.timezone,  // Use the timezone of the doc (important!).
      hour12: false, // Use 24 hour time.
      hour: "2-digit",
      minute: "2-digit",
    });
    // Remove the colon separating the hours and minutes.
    formatted = formatted.replace(":", "");
    return formatted + " hours";
  },
});
{% endraw %}
```
## Local date and time
A formula that requires getting a date and time in the document&#x27;s timezone. This sample determines if all of the digits are the same (ex: 1/1/11 1:11).

```ts
{% raw %}
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

pack.addFormula({
  name: "SameDigit",
  description: "Determines if a date and time only contain a single digit." +
    "For example, 1/1/11 1:11.",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.Date,
      name: "dateAndTime",
      description: "The input date and time.",
    }),
  ],
  resultType: coda.ValueType.Boolean,
  execute: async function ([dateAndTime], context) {
    // Format the JavaScript Date to only include the monday, day, year, hour
    // and minute as numbers.
    let formatted = dateAndTime.toLocaleString("en-US", {
      timeZone: context.timezone, // Use the timezone of the doc (important!).
      month: "numeric",
      day: "numeric",
      year: "2-digit",
      hour: "numeric",
      minute: "numeric",
    });
    // Extract the digits from the formatted date.
    let digits = formatted.match(/\d/g);
    // Get the unique set of digits.
    let unique = new Set(digits);
    return unique.size === 1;
  },
});
{% endraw %}
```
## Send to API
A formula that requires sending a date to an API. This sample use the Calendarific API to get the holidays on a given date.

```ts
{% raw %}
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// A schema to represent a holiday.
const HolidaySchema = coda.makeObjectSchema({
  properties: {
    name: { type: coda.ValueType.String },
    description: { type: coda.ValueType.String },
    locations: { type: coda.ValueType.String },
    type: {
      type: coda.ValueType.Array,
      items: { type: coda.ValueType.String },
    },
  },
  displayProperty: "name",
});

// Gets the holidays happening in the selected country on a given day.
pack.addFormula({
  name: "Holidays",
  description: "Get the holidays (if any) on a given day.",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "country",
      description: "Which country's holidays to return (ex: US).",
      // Auto-complete the valid country identifiers using the API.
      autocomplete: async function (context, search) {
        let response = await context.fetcher.fetch({
          method: "GET",
          url: "https://calendarific.com/api/v2/countries",
        });
        let countries = response.body.response.countries;
        return coda.autocompleteSearchObjects(
          search,
          countries,
          "country_name",
          "iso-3166",
          );
      },
    }),
    coda.makeParameter({
      type: coda.ParameterType.Date,
      name: "date",
      description: "Which date to lookup.",
    }),
  ],
  resultType: coda.ValueType.Array,
  items: HolidaySchema,
  execute: async function ([country, date], context) {
    // Create a formatter that outputs a numeric day, month, and year.
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

    // Make a request to the Calendarific API.
    let url = coda.withQueryParams("https://calendarific.com/api/v2/holidays", {
      country: country,
      year: year,
      month: month,
      day: day,
    });
    let response = await context.fetcher.fetch({
      method: "GET",
      url: url,
    });

    // Return the results.
    return response.body.response.holidays;
  },
});

// Calendarific requires an API key as a query parameter.
pack.setSystemAuthentication({
  type: coda.AuthenticationType.QueryParamToken,
  paramName: "api_key",
});

pack.addNetworkDomain("calendarific.com");
{% endraw %}
```
## Time math
A formula that computes a relative time. This sample adds five minutes onto an input date and time.

```ts
{% raw %}
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Formula that adds five minutes to an input date and time.
pack.addFormula({
  name: "FiveMinsLate",
  description: "Adds five minutes to the input date and time.",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.Date,
      name: "input",
      description: "The input date and time.",
    }),
  ],
  // Return the result as the number of seconds since the epoch.
  resultType: coda.ValueType.Number,
  codaType: coda.ValueHintType.Time,
  execute: async function ([input], context) {
    let seconds = input.getTime() / 1000;
    seconds += 5 * 60; // Add five minutes, as seconds.
    return seconds;
  },
});
{% endraw %}
```

