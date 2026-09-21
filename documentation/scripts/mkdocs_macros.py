import html
import logging
import os
import socket
from datetime import date
from urllib.parse import urljoin

log = logging.getLogger("mkdocs.plugins.macros")

def define_env(env):
  @env.macro
  def screenshot(path, alt, shadow=True, **attributes):
    """Generates an <img> tag for an image in the docs directory.

    Screenshots are captured at 2x and downsized to create the 1x version (see
    `make generate-1x-images`). Pass the path to the 1x image, relative to the
    docs directory, and the matching `_2x` file is added as a srcset if present.

    Set shadow=False for cropped fragments of the UI, which are shown inline
    without the rounded corners and drop shadow of a full screenshot.
    """
    docsDir = os.path.normpath(env.conf["docs_dir"])
    if path.startswith("/"):
      path = path[1:]

    # The site: URL below can only resolve to something the site serves, so
    # reject paths that point outside of the docs directory.
    fullPath = os.path.normpath(os.path.join(docsDir, path))
    if not fullPath.startswith(docsDir + os.sep):
      raise ValueError(f"Image path is outside of the docs directory: {path}")
    if not os.path.isfile(fullPath):
      log.warning(f"Image not found: {path}")
    root, extension = os.path.splitext(path)
    retinaPath = f"{root}_2x{extension}"

    # The site-urls plugin resolves the site: prefix into a relative URL.
    parts = [f'src="site:{path}"']
    if os.path.isfile(os.path.join(docsDir, retinaPath)):
      parts.append(f'srcset="site:{retinaPath} 2x"')
    if shadow:
      parts.append('class="screenshot"')
    parts.append(f'alt="{html.escape(alt)}"')
    for name, value in attributes.items():
      parts.append(f'{name}="{html.escape(str(value))}"')
    return f"<img {' '.join(parts)}>"

  @env.macro
  def getRelativePath(page, rootPage):
    rootDirectory = os.path.dirname(rootPage.file.src_uri)
    return os.path.relpath(page.file.src_uri, rootDirectory)

  @env.macro
  def getSiteRelativeUrl(path):
    site_url = env.conf.get("site_url")
    if not site_url.endswith("/"):
        site_url += "/"
    if path.startswith("/"):
      path = path[1:]
    return urljoin(site_url, path)

  @env.macro
  def resolveIps(host):
    results = socket.gethostbyname_ex(host)
    return results[2]

  @env.macro
  def today():
    return date.today()
