import os
import socket
from datetime import date

def define_env(env):
  @env.macro
  def getRelativePath(page, rootPage):
    rootDirectory = os.path.dirname(rootPage.file.src_uri)
    return os.path.relpath(page.file.src_uri, rootDirectory)

  @env.macro
  def resolveIps(host):
    results = socket.gethostbyname_ex(host)
    return results[2]

  @env.macro
  def today():
    return date.today()
