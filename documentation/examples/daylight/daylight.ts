/**
 * This Pack provides a "Daylight" formula that determines the daylight,
 * sunrise, and sunset at a given location using the Sunrise Sunset API.
 * The results are returns as a rich object.
 * @see {@link https://sunrise-sunset.org/api|Sunrise Sunset API}
 */

// This import statement provides access to all parts of the Coda Packs SDK.
import * as coda from "@codahq/packs-sdk";

// This line creates the new Pack.
export const pack = coda.newPack();

// The domain that the Pack will match fetcher requests to.
pack.addNetworkDomain("sunrise-sunset.org");

// Define a schema that will be used to bundle up the multiple pieces of data
// our formula will return. In the Coda doc this will be displayed as a chip.
const SunSchema = coda.makeObjectSchema({
  properties: {
    // The values we return are simple strings, but we use the codaType field to
    // to tell Coda to interpret them as durations and time values.
    daylight: {
      description: "How much daylight there will be.",
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.Duration,
    },
    sunrise: {
      description: "When the sun will rise (in the document's timezone).",
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.Time,
    },
    sunset: {
      description: "When the sun will set (in the document's timezone).",
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.Time,
    },
  },
  // Which of the properties defined above will be shown inside the chip.
  displayProperty: "daylight",
});

// Add a "Daylight" formula to the Pack.
pack.addFormula({
  name: "Daylight",
  description: "Returns the sunrise and sunset for a given location.",

  // This formula takes two required numeric inputs (the latitude and longitude)
  // and one optional date.
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.Number,
      name: "lat",
      description: "The latitude to use.",
    }),
    coda.makeParameter({
      type: coda.ParameterType.Number,
      name: "lng",
      description: "The longitude to use.",
    }),
    coda.makeParameter({
      type: coda.ParameterType.Date,
      name: "date",
      description: "The date to use. Defaults to today.",
      // This date parameter is an optional input.
      optional: true,
    }),
  ],

  // In this formula, we're returning an object with multiple properties.
  resultType: coda.ValueType.Object,

  // This object will be defined according to the schema written above.
  schema: SunSchema,

  // Everything inside this execute statement will happen anytime the Coda
  // formula is called in a doc. An array of all user inputs is passed as the
  // first parameter. The context object is always the second parameter and is
  // used for fetching data.
  execute: async function ([lat, lng, date], context) {
    // Default to today if no date is provided.
    let lookupDate = date || new Date();

    // Format the date parameter to a date string in the correct timezone.
    let formattedDate = lookupDate.toLocaleDateString("en", {
      timeZone: context.timezone, // Use the timezone of the doc (important!).
    });

    // Create the URL to fetch, using the helper function coda.withQueryParams
    // to add on query parameters (ex: "?lat=40.123...").
    let url = coda.withQueryParams("https://api.sunrise-sunset.org/json", {
      lat: lat,
      lng: lng,
      date: formattedDate,
      formatted: 0,
    });

    // Fetch the URL and get the response.
    let response = await context.fetcher.fetch({
      method: "GET",
      url: url,
    });

    // The JSON returned by the API is parsed automatically and available in
    // `response.body`. Here we pull out the content in the "results" key.
    let results = response.body.results;

    // Return the final object. The keys here must match with the properties
    // defined above in the schema.
    return {
      daylight: results.day_length + " seconds",
      sunrise: results.sunrise,
      sunset: results.sunset,
    };
  },
});
