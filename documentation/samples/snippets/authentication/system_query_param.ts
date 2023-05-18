import * as coda from "@codahq/packs-sdk";

const pack = coda.newPack();

// BEGIN

pack.setSystemAuthentication({
  type: coda.AuthenticationType.QueryParamToken,
  paramName: "${1:myToken}",
});
