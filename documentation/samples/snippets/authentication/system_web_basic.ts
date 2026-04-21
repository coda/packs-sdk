import * as sdk from "@codahq/packs-sdk";

const pack = sdk.newPack();

// BEGIN

pack.setSystemAuthentication({
  type: sdk.AuthenticationType.WebBasic,
});
