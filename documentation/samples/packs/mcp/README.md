The **Model Context Protocol (MCP)** is an open standard for exposing tools to LLMs, and many applications now host MCP servers. A connector can integrate with a hosted MCP server to make its tools available in Superhuman Go, without having to implement each one yourself. Adding a server takes only a few lines of code, along with whatever authentication it requires.

The samples below show how to connect to an MCP server using each of the supported authentication types, as well as how to combine an MCP server with other building blocks like sync tables.
