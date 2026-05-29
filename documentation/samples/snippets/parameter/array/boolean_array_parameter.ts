import * as sdk from "@codahq/packs-sdk";

let parameters = [
  // BEGIN
  sdk.makeParameter({
    type: sdk.ParameterType.BooleanArray,
    name: "${1:myParameter}",
    description: "${2:My description.}",
  }),
  // END
];
