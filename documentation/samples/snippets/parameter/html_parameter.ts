import * as coda from "@codahq/packs-sdk";

let parameters = [
  // BEGIN
  coda.makeParameter({
    type: coda.ParameterType.Html,
    name: "${1:myParameter}",
    description: "${2:My description.}",
  }),
  // END
];
