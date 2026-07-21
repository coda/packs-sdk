---
nav: MCP
description: Samples that show how to incorporate tools from an MCP server.
icon: material/connection
---

# MCP samples

The **Model Context Protocol (MCP)** is an open standard for exposing tools to LLMs, and many applications now host MCP servers. A connector can integrate with a hosted MCP server to make its tools available in Superhuman Go, without having to implement each one yourself. Adding a server takes only a few lines of code, along with whatever authentication it requires.

The samples below show how to connect to an MCP server using each of the supported authentication types, as well as how to combine an MCP server with other building blocks like sync tables.


[Learn More](../../guides/blocks/mcp.md){ .md-button }

## Template
The basic structure of an MCP server integration.

```ts
{% raw %}
pack.addMCPServer({
  name: "MyMCPServer",
  endpointUrl: "https://my-mcp-server.com/mcp",
});
{% endraw %}
```
## No auth
An MCP integration that doesn&#x27;t require authentication. This sample connects to Icons8&#x27;s MCP server.

```ts
{% raw %}
import * as coda from "@codahq/packs-sdk";

export const pack = coda.newPack();

pack.addMCPServer({
  name: "Icons8",
  endpointUrl: "https://mcp.icons8.com/mcp/",
});

pack.addNetworkDomain("icons8.com");
{% endraw %}
```
## Token auth
An MCP integration that authenticates using a static token. This sample connects to the Ref.tools MCP server.

```ts
{% raw %}
import * as coda from "@codahq/packs-sdk";

export const pack = coda.newPack();

pack.addMCPServer({
  name: "Ref.tools",
  endpointUrl: "https://api.ref.tools/mcp",
});

pack.setUserAuthentication({
  type: coda.AuthenticationType.CustomHeaderToken,
  headerName: "x-ref-api-key",
  instructionsUrl: "https://ref.tools/keys",
});

pack.addNetworkDomain("ref.tools");
{% endraw %}
```
## Static OAuth client
An MCP integration that authenticates using OAuth, with a static client. This sample connects to the Google Calendar MCP server.

```ts
{% raw %}
import * as sdk from "@codahq/packs-sdk";

export const pack = sdk.newPack();

pack.addMCPServer({
  name: "GoogleCalendar",
  endpointUrl: "https://calendarmcp.googleapis.com/mcp/v1",
});

pack.setUserAuthentication({
  type: sdk.AuthenticationType.OAuth2,
  authorizationUrl: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenUrl: "https://oauth2.googleapis.com/token",
  scopes: ["https://www.googleapis.com/auth/calendar"],
  useProofKeyForCodeExchange: true,

  // Additional parameters to ensure a refresh_token is returned.
  additionalParams: {
    access_type: "offline",
    prompt: "consent",
  },
});

pack.addNetworkDomain("googleapis.com");
{% endraw %}
```
## Dynamic OAuth client
An MCP integration that authenticates using OAuth, with a dynamically registered client. This sample connects to the Miro MCP server.

```ts
{% raw %}
import * as sdk from "@codahq/packs-sdk";

export const pack = sdk.newPack();

pack.addMCPServer({
  name: "Miro",
  endpointUrl: "https://mcp.miro.com/",
});

pack.setUserAuthentication({
  type: sdk.AuthenticationType.OAuth2,
  useDynamicClientRegistration: true,
  useProofKeyForCodeExchange: true,
  scopes: ["boards:read", "boards:write"],
});

pack.addNetworkDomain("miro.com");
{% endraw %}
```
## With other building blocks
A Pack that uses an MCP for most tools, but includes a sync table for indexing. This sample syncs information from Todoist.

```ts
{% raw %}
import * as sdk from "@codahq/packs-sdk";
export const pack = sdk.newPack();

// The REST API and MCP server are hosted on different domains.
// Note: Connecting to multiple domains requires approval.
pack.addNetworkDomain("todoist.com");
pack.addNetworkDomain("todoist.net");

// The REST API and MCP server use the same OAuth credentials.
pack.setUserAuthentication({
  type: sdk.AuthenticationType.OAuth2,
  useDynamicClientRegistration: true,

  // Allow the credentials to be sent to both domains.
  networkDomain: ["todoist.com", "todoist.net"],

  // Determines the display name of the connected account.
  getConnectionName: async function (context) {
    let response = await context.fetcher.fetch({
      method: "GET",
      url: "https://api.todoist.com/api/v1/user",
    });
    return response.body.full_name;
  },
});

pack.addMCPServer({
  name: "Todoist",
  endpointUrl: "https://ai.todoist.net/mcp",
});

const TaskSchema = sdk.makeObjectSchema({
  properties: {
    name: {
      description: "The name of the task.",
      type: sdk.ValueType.String,
      fromKey: "content",
    },
    description: {
      description: "A detailed description of the task.",
      type: sdk.ValueType.String,
      codaType: sdk.ValueHintType.Markdown,
    },
    url: {
      description: "A link to the task in the Todoist app.",
      type: sdk.ValueType.String,
      codaType: sdk.ValueHintType.Url,
    },
    priority: {
      description: "The priority of the task.",
      type: sdk.ValueType.String,
      codaType: sdk.ValueHintType.SelectList,
      options: ["P1", "P2", "P3", "P4"],
    },
    due: {
      description: "When the task is due.",
      type: sdk.ValueType.String,
      codaType: sdk.ValueHintType.DateTime,
    },
    id: {
      description: "The ID of the task.",
      type: sdk.ValueType.String,
      required: true,
    },
  },
  displayProperty: "name",
  // Sync table metadata.
  idProperty: "id",
  featuredProperties: ["url", "priority", "due"],
  // Indexing metadata.
  titleProperty: "name",
  linkProperty: "url",
  index: {
    properties: ["description"],
    filterableProperties: ["priority"],
  },
});

// Index tasks into the knowledge layer.
pack.addSyncTable({
  name: "Tasks",
  schema: TaskSchema,
  identityName: "Task",
  formula: {
    name: "SyncTasks",
    description: "Sync tasks",
    parameters: [
      sdk.makeParameter({
        type: sdk.ParameterType.String,
        name: "filter",
        description: "A supported filter string. See the Todoist help center.",
        optional: true,
      }),
    ],
    execute: async function (args, context) {
      let [filter] = args;
      let url = sdk.withQueryParams("https://api.todoist.com/rest/v2/tasks", {
        filter: filter,
      });
      let response = await context.fetcher.fetch({
        method: "GET",
        url: url,
      });
      let rows = response.body.map(task => {
          return {
            ...task,
            // Convert the priority to a string like "P1".
            priority: "P" + (5 - task.priority),
          };
      });
      return {
        result: rows,
      };
    },
  },
});
{% endraw %}
```

