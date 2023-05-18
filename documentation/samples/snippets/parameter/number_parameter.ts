import * as coda from "@codahq/packs-sdk";

let parameters = [
  // BEGIN
  coda.makeParameter({
    type: coda.ParameterType.Number,
    name: "${1:myParameter}",
    description: "${2:My description.}",
  }),
  // END
];
