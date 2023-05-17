import * as coda from "@codahq/packs-sdk";

const pack = coda.newPack();

// BEGIN

pack.setUserAuthentication({
  type: coda.AuthenticationType.MultiQueryParamToken,
  params: [
    { name: "${1:myToken}", description: "${2:My token description}" },
    { name: "${3:myKey}", description: "${4:My key description}" },
    // TODO: Add more parameters, if needed.
  ],
  instructionsUrl: "${5:https://help.example.com/api-tokens}",
  getConnectionName: async function (context) {
    // TODO: Fetch the name of the account.
    let name = "";
    return name;
  },
});
