import * as coda from "@codahq/packs-sdk";

// BEGIN

coda.makeParameter({
  type: coda.ParameterType.Image,
  name: "<User-visible name of parameter>",
  description: "<Help text for the parameter>",
});
