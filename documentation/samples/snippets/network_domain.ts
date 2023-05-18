import * as coda from "@codahq/packs-sdk";

const pack = coda.newPack();

// BEGIN
pack.addNetworkDomain("${1:example.com}");
