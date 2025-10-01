// Typedoc settings.
// See: https://typedoc.org/options/
module.exports = {
  name: 'Modules',
  excludeExternals: true,
  excludePrivate: true,
  excludeProtected: true,
  plugin: 'typedoc-plugin-markdown',
  // Don't include the repo's README in the generated docs.
  readme: 'documentation/reference/README.md',

  // NOTE(patrick): I'm not sure why this is necessary, but without it, we saw a strange
  // resolution of PackVersionDefinition links being resolved as PackDefinition links in
  // the generated docs.
  useTsLinkResolution: false,

  // Markdown-specific options.
  hideBreadcrumbs: true,
  hideInPageTOC: true,
  allReflectionsHaveOwnDocument: true,
  entryDocument: 'index.md',

  intentionallyNotExported: [
    // Internal intermediate or helper types that we probably don't care to export or document.
    '$Values',
    'AsAuthDef',
    'AutocompleteParameterTypeMapping',
    'AutocompleteParameterTypes',
    'BooleanHintValueTypes',
    'Exact',
    'GenericObjectSchema',
    'NumberHintValueTypes',
    'OptionsReference',
    'ObjectHintValueTypes',
    'ObjectSchema',
    'ObjectSchemaDefinitionType',
    'ObjectSchemaType',
    'ParameterTypeMap',
    'PropertyOptionsMetadataFormula',
    'SimpleStringHintTypes',
    'StringHintTypeToSchemaType',
    'StringHintValueTypes',
    'TypeMap',
    'TypeOf',
    'TypeOfMap',
    'UnionType',

    // Internal only types.
    'GoogleServiceAccountAuthentication',
    'AllowedAuthentication',
    'AllowedAuthenticationDef',
    'VariousAuthentication',
    'CodaInternalRichTextSchema',

    // In-development types that we're not ready to expose yet
    'SyncPassthroughData',

    // Deprecated features we should remove from the SDK.
    'FeatureSet',
    'PackCategory',
    'Quota',
    'RateLimits',
  ],
};
