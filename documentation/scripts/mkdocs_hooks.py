from mkdocs.utils import get_markdown_title
from mkdocs.plugins import event_priority

# Run after the markdown is loaded.
def on_page_markdown(markdown, page, **kwargs):
    # Set the meta title to the page's H1 title, if not already specified.
    meta_title = get_markdown_title(markdown)
    if 'title' not in page.meta and meta_title is not None:
        page.meta['title'] = get_markdown_title(markdown)

# Run after the page is rendered (and other plugins have completed this step).
@event_priority(-100)
def on_page_content(markdown, page, **kwargs):
    # If the meta tags include a "nav" element, use that value as the nav entry
    # for the page and remove it from the meta.
    if 'nav' in page.meta:
        page.title = page.meta['nav']
        del page.meta['nav']
    return markdown
