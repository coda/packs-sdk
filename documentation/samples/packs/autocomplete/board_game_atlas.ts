import * as sdk from "@codahq/packs-sdk";
export const pack = sdk.newPack();

// Gets the price of a board game by ID, with autocomplete on the ID.
pack.addFormula({
  name: "GetPrice",
  description: "Gets the price of a board game.",
  parameters: [
    sdk.makeParameter({
      type: sdk.ParameterType.String,
      name: "gameId",
      description: "The ID of the game on boardgameatlas.com",
      autocomplete: async function (context, search, parameters) {
        let url = sdk.withQueryParams(
          "https://api.boardgameatlas.com/api/search",
          { fuzzy_match: true, name: search });
        let response = await context.fetcher.fetch({ method: "GET", url: url });
        let results = response.body.games;
        // Generate an array of autocomplete objects, using the game's name as
        // the label and its ID for the value.
        return sdk.autocompleteSearchObjects(search, results, "name", "id");
      },
    }),
  ],
  resultType: sdk.ValueType.Number,
  codaType: sdk.ValueHintType.Currency,
  execute: async function ([gameId], context) {
    let response = await context.fetcher.fetch({
      method: "GET",
      url: "https://api.boardgameatlas.com/api/search?ids=" + gameId,
    });
    return response.body.games[0].price;
  },
});

pack.addNetworkDomain("boardgameatlas.com");

// Authenticate using a client ID.
// See: https://www.boardgameatlas.com/api/docs/apps
pack.setSystemAuthentication({
  type: sdk.AuthenticationType.QueryParamToken,
  paramName: "client_id",
});
