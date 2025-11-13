import {MarkdownPageEvent} from 'typedoc-plugin-markdown';
import {ReflectionKind} from 'typedoc';

export function load(app) {
  app.renderer.on(MarkdownPageEvent.BEGIN, page => {
    // Customize the frontmatter.
    if (!page.model) {return;}
    const {kind, name} = page.model;
    let nav = name;
    let title = `${ReflectionKind.singularString(kind)}: ${name}`
    const status = page.model.isDeprecated() ? 'deprecated' : undefined;
    if (kind === ReflectionKind.Module) {
      nav = 'Overview';
      title = `${name} module`;
    } else if (kind === ReflectionKind.Project) {
      nav = 'Overview';
    }
    page.frontmatter = {
      title,
      nav,
      status,
      ...page.frontmatter,
    };
  });

  app.renderer.on(MarkdownPageEvent.END, page => {
    // Replace absolute links with relative ones.
    page.contents = page.contents?.replaceAll(
      'https://coda.io/packs/build/latest/',
      '{{ config.site_url }}');
  });
}
