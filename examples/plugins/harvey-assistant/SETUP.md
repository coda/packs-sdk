# Setup

Connect two accounts. Harvey's REST API and hosted MCP server use different authentication, so they stay separate Packs.

1. **Harvey API** (private connector): create an API token with `Assistant access`, `Assistant access via API`, `View workspace projects`, `Vault API`, and `Modify workspace projects`. Assistant completion is limited to 20 requests per minute. Vault endpoints are limited to 10 requests per minute.
2. **Harvey MCP** (public connector): sign in with the Harvey account OAuth flow. Hosted MCP must be enabled for the user. MCP tools include legal Q&A, Vault listing and questions, and research knowledge sources.

`AskHarvey` can attach a file or ground in a Vault folder, not both. Set `stream` to consume Harvey's SSE completion stream; the formula still returns one assembled string because Pack formulas do not stream tokens to the chat UI.
