const common = require("./common.js");

module.exports = {
  ...common,
  name: "Pack Testing Reference",

  intentionallyNotExported: [
    // Types from the core SDK that we don't want to generate again.
    'BasicPackDefinition',
    'ExecutionContext',
    'FetchResponse',
    'GenericSyncFormulaResult',
    'InvocationLocation',
    'MetadataContext',
    'MetadataFormula',
    'PackFormulaResult',
    'ParamDefs',
    'ParamValues',
    'Sync',
    'SyncExecutionContext',
  ],
};
