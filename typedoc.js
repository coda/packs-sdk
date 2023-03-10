// Typedoc settings.
// See: https://typedoc.org/guides/options/
module.exports = {
  name: "Modules",
  excludeExternals: true,
  excludePrivate: true,
  excludeProtected: true,
  plugin: 'typedoc-plugin-markdown',
  // Don't include the repo's README in the generated docs.
  readme: 'documentation/reference/README.md',

  // Markdown-specific options.
  hideBreadcrumbs: true,
  hideInPageTOC: true,
  allReflectionsHaveOwnDocument: true,
  entryDocument: "index.md",

  intentionallyNotExported: [
    // Internal intermediate or helper types that we probably don't care to export or document.
    '$Values',
    'AsAuthDef',
    'AutocompleteParameterTypeMapping',
    'AutocompleteParameterTypes',
    'BooleanHintValueTypes',
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

    // Internal only types.
    'AWSAssumeRoleAuthentication',
    'VariousAuthentication',

    // Deprecated features we should remove from the SDK.
    'FeatureSet',
    'PackCategory',
    'Quota',
    'RateLimits',
  ],
};
