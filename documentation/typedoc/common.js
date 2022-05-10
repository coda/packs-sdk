// Typedoc settings.
// See: https://typedoc.org/guides/options/
module.exports = {
  excludeExternals: true,
  excludePrivate: true,
  excludeProtected: true,
  plugin: ['typedoc-plugin-markdown'],
  // Don't include the repo's README in the generated docs.
  readme: 'none',

  // Markdown-specific options.
  hideBreadcrumbs: true,
  hideInPageTOC: true,
  allReflectionsHaveOwnDocument: true,
};
