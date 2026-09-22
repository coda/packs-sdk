# Platform boundaries

The Harvey example contains product logic and infrastructure that should not all live in the same Pack.

## Plugin platform

The plugin platform should:

- resolve component names to Pack IDs when publishing;
- write the agent-to-connector bindings and private connector allowlists;
- collect separate component reviews under one publish operation;
- install required connectors, complete each connector's auth, then create the agent; and
- preserve each connector instance when an install is retried.

The agent should not hardcode connector Pack IDs or coordinate connector installation. The connectors should not know which agent installed them.

## Packs SDK

The spike provides reusable SDK helpers for:

- downloading a `File` parameter with its filename and content type;
- encoding text fields and files as `multipart/form-data`; and
- parsing an SSE response into typed events.

The helpers are `downloadFile()`, `makeMultipartBody()`, and `parseServerSentEvents()`. The connector still decides which form fields to send and how Harvey's event payloads combine into a result.

## Harvey code

The Harvey connector should continue to own:

- Harvey endpoints and authentication;
- completion and Vault parameters;
- the rule that a request cannot include both a file and a Vault folder;
- Harvey's response schemas and citation behavior; and
- Harvey rate-limit guidance.

The agent should own its legal-assistant instructions, tool-selection guidance, and user-facing safety language.
