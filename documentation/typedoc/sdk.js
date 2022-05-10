const common = require("./common.js");

module.exports = {
  ...common,
  name: "Pack SDK Reference",
  intentionallyNotExported: [
    // Internal intermediate or helper types that we probably don't care to export or document.
    '$Values',
    'AsAuthDef',
    'GenericObjectSchema',
    'NumberHintValueTypes',
    'ObjectHintValueTypes',
    'ObjectSchema',
    'ObjectSchemaDefinitionType',
    'ObjectSchemaType',
    'ParameterTypeMap',
    'SimpleStringHintTypes',
    'StringHintTypeToSchemaType',
    'StringHintValueTypes',
    'TypeMap',
    'TypeOf',
    'TypeOfMap',
    'UnionType',

    // Deprecated features we should remove from the SDK
    'FeatureSet',
    'PackCategory',
    'Quota',
    'RateLimits',
  ],
};
