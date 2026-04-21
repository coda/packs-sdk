import * as sdk from "@codahq/packs-sdk";
export const pack = sdk.newPack();

// A schema to represent a holiday.
const HolidaySchema = sdk.makeObjectSchema({
  properties: {
    name: { type: sdk.ValueType.String },
    description: { type: sdk.ValueType.String },
    locations: { type: sdk.ValueType.String },
    type: {
      type: sdk.ValueType.Array,
      items: { type: sdk.ValueType.String },
    },
  },
  displayProperty: "name",
});

// Gets the holidays happening in the selected country on a given day.
pack.addFormula({
  name: "Holidays",
  description: "Get the holidays (if any) on a given day.",
  parameters: [
    sdk.makeParameter({
      type: sdk.ParameterType.String,
      name: "country",
      description: "Which country's holidays to return (ex: US).",
      // Auto-complete the valid country identifiers using the API.
      autocomplete: async function (context, search) {
        let response = await context.fetcher.fetch({
          method: "GET",
          url: "https://calendarific.com/api/v2/countries",
        });
        let countries = response.body.response.countries;
        return sdk.autocompleteSearchObjects(
          search,
          countries,
          "country_name",
          "iso-3166",
          );
      },
    }),
    sdk.makeParameter({
      type: sdk.ParameterType.Date,
      name: "date",
      description: "Which date to lookup.",
    }),
  ],
  resultType: sdk.ValueType.Array,
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
    let url = sdk.withQueryParams("https://calendarific.com/api/v2/holidays", {
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
  type: sdk.AuthenticationType.QueryParamToken,
  paramName: "api_key",
});

pack.addNetworkDomain("calendarific.com");
