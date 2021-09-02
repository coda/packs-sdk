// Typedoc settings.
// See: https://typedoc.org/guides/options/
module.exports = {
  excludeExternals: true,
  excludePrivate: true,
  excludeProtected: true,
  gitRevision: 'main',
  plugin: 'typedoc-plugin-markdown',
  readme: 'none',
  
  // Markdown-specific options.
  hideBreadcrumbs: true,
  hideInPageTOC: true,
  allReflectionsHaveOwnDocument: true,
  hidePageTitle: true,
};
