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
    'RequestHandlerTemplate',
    'ResponseHandlerTemplate',

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
