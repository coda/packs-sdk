import * as sdk from "@codahq/packs-sdk";

const pack = sdk.newPack();

// BEGIN
pack.addNetworkDomain("${1:example.com}");
