import * as sdk from "@codahq/packs-sdk";

let parameters = [
  // BEGIN
  sdk.makeParameter({
    type: sdk.ParameterType.Html,
    name: "${1:myParameter}",
    description: "${2:My description.}",
  }),
  // END
];
