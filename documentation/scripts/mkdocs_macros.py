import os
import socket
from datetime import date
from urllib.parse import urljoin

def define_env(env):
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
