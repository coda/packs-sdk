import * as coda from "@codahq/packs-sdk";

const pack = coda.newPack();

// BEGIN

pack.setSystemAuthentication({
  type: coda.AuthenticationType.Custom,
  params: [
    {
      name: "${1:myToken}",
      description: "${2:My description}",
    },
    // TODO: Add more parameters, if needed.
  ],
});
