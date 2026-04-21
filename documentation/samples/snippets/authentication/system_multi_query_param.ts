import * as sdk from "@codahq/packs-sdk";

const pack = sdk.newPack();

// BEGIN

pack.setSystemAuthentication({
  type: sdk.AuthenticationType.MultiQueryParamToken,
  params: [
    { name: "${1:myToken}", description: "${2:My token description}" },
    { name: "${3:myKey}", description: "${4:My key description}" },
    // TODO: Add more parameters, if needed.
  ],
});
