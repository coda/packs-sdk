// Typedoc settings.
// See: https://typedoc.org/guides/options/
module.exports = {
  excludeExternals: true,
  excludePrivate: true,
  excludeProtected: true,
  gitRevision: 'main',
  plugin: 'typedoc-plugin-markdown',
  // Don't include the repo's README in the generated docs.
  readme: 'none',

  // Markdown-specific options.
  hideBreadcrumbs: true,
  hideInPageTOC: true,
  allReflectionsHaveOwnDocument: true,

  intentionallyNotExported: [
    // TODO(jonathan): Export and document these.
    'AttributionNode',
    'FormulaDefinitionV2',
    'FormulaResultValueType',
    'GenericObjectSchema',
    'InvocationLocation',
    'MetadataFunction',
    'ObjectSchema',
    'ObjectSchemaDefinitionType',
    'ObjectSchemaType',
    'RequestHandlerTemplate',
    'ResponseHandlerTemplate',
    'StatusCodeErrorResponse',
    'ValidTypes',

    // Internal intermediate or helper types that we probably don't care to export or document.
    '$Values',
    'AsAuthDef',
    'ParameterTypeMap',
    'SimpleStringHintTypes',
    'StringHintTypeToSchemaType',
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
