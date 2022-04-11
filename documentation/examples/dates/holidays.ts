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
