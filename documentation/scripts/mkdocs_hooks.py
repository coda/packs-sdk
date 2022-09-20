
from mkdocs.utils import get_markdown_title

# Adjust the nav once the markdown is read.
def on_page_markdown(markdown, page, **kwargs):
  # Set the meta title to the page's H1 title, if not already specified.
  meta_title = get_markdown_title(markdown)
  if 'title' not in page.meta and meta_title is not None:
    page.meta['title'] = get_markdown_title(markdown)
  # If the meta tags include a "nav" element, use that value as the nav entry
  # for the page and remove it from the meta.
  if 'nav' in page.meta:
    page.title = page.meta['nav']
    del page.meta['nav']
  return markdown

