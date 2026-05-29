import * as sdk from "@codahq/packs-sdk";
export const pack = sdk.newPack();

// Define the schema that will be used to render the card.
const WeatherSchema = sdk.makeObjectSchema({
  properties: {
    summary: { type: sdk.ValueType.String, fromKey: "shortForecast" },
    forecast: { type: sdk.ValueType.String, fromKey: "detailedForecast" },
    temperature: { type: sdk.ValueType.String },
    wind: { type: sdk.ValueType.String, fromKey: "windSpeed" },
    icon: {
      type: sdk.ValueType.String,
      hintType: sdk.ValueHintType.ImageReference,
    },
    link: {
      type: sdk.ValueType.String,
      hintType: sdk.ValueHintType.Url,
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
    sdk.makeParameter({
      type: sdk.ParameterType.Number,
      name: "latitude",
      description: "The latitude of the location.",
    }),
    sdk.makeParameter({
      type: sdk.ParameterType.Number,
      name: "longitude",
      description: "The longitude of the location.",
    }),
    sdk.makeParameter({
      type: sdk.ParameterType.Boolean,
      name: "isMetric",
      description: "Whether to use metric units. Default: false.",
      optional: true,
    }),
  ],
  resultType: sdk.ValueType.Object,
  schema: WeatherSchema,
  execute: async function ([latitude, longitude, isMetric], context) {
    let url = await getForecastUrl(latitude, longitude, context);
    if (isMetric) {
      url = sdk.withQueryParams(url, { units: "si" });
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
      sdk.withQueryParams("https://forecast.weather.gov/MapClick.php", {
        lat: latitude,
        lon: longitude,
      });
    return weather;
  },
});

// A helper function that gets the forecast URL for a given location.
async function getForecastUrl(latitude: number, longitude: number,
  context: sdk.ExecutionContext): Promise<string> {
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
      let statusError = error as sdk.StatusCodeError;
      let message = statusError.body?.detail;
      if (message) {
        throw new sdk.UserVisibleError(message);
      }
    }
    throw error;
  }
}

pack.addNetworkDomain("weather.gov");
