import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Define the schema that will be used to render the card.
const WeatherSchema = coda.makeObjectSchema({
  properties: {
    summary: { type: coda.ValueType.String, fromKey: "shortForecast" },
    forecast: { type: coda.ValueType.String, fromKey: "detailedForecast" },
    temperature: { type: coda.ValueType.String },
    wind: { type: coda.ValueType.String, fromKey: "windSpeed" },
    icon: {
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.ImageReference,
    },
    link: {
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.Url,
    },
  },
  displayProperty: "summary",
  subtitleProperties: [
    // Only show the value for the temperature property.
    { property: "temperature", label: "" },
    "wind",
  ],
  snippetProperty: "forecast",
  imageProperty: "icon",
  linkProperty: "link",
});

// Add a formula that fetches the weather and returns it as a card.
pack.addFormula({
  name: "CurrentWeather",
  description: "Get the current weather at a specific location (US only).",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.Number,
      name: "latitude",
      description: "The latitude of the location.",
    }),
    coda.makeParameter({
      type: coda.ParameterType.Number,
      name: "longitude",
      description: "The longitude of the location.",
    }),
    coda.makeParameter({
      type: coda.ParameterType.Boolean,
      name: "isMetric",
      description: "Whether to use metric units. Default: false.",
      optional: true,
    }),
  ],
  resultType: coda.ValueType.Object,
  schema: WeatherSchema,
  execute: async function ([latitude, longitude, isMetric], context) {
    let url = await getForecastUrl(latitude, longitude, context);
    if (isMetric) {
      url = coda.withQueryParams(url, { units: "si" });
    }
    let response = await context.fetcher.fetch({
      method: "GET",
      url: url,
    });
    let data = response.body;
    let weather = data.properties.periods[0];
    // Add the unit onto the temperature.
    weather.temperature = `${weather.temperature}°${weather.temperatureUnit}`;
    weather.link =
      coda.withQueryParams("https://forecast.weather.gov/MapClick.php", {
        lat: latitude,
        lon: longitude,
      });
    return weather;
  },
});

// A helper function that gets the forecast URL for a given location.
async function getForecastUrl(latitude: number, longitude: number,
  context: coda.ExecutionContext): Promise<string> {
  try {
    let response = await context.fetcher.fetch({
      method: "GET",
      url: `https://api.weather.gov/points/${latitude},${longitude}`,
    });
    let data = response.body;
    return data.properties.forecast;
  } catch (error) {
    // Check if the error is due to the location being outside the US.
    if (error.statusCode === 404) {
      let statusError = error as coda.StatusCodeError;
      let message = statusError.body?.detail;
      if (message) {
        throw new coda.UserVisibleError(message);
      }
    }
    throw error;
  }
}

pack.addNetworkDomain("weather.gov");
