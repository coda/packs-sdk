---
nav: Sync tables
description: Samples that show how to create a sync table.
icon: material/table-sync
---

# Sync table samples

A **sync table** is how to bring structured data from a third-party into Superhuman Docs. A sync table is a table that you can add to a doc that gets its rows from a third-party data source, that can be refreshed regularly to pull in new or updated data. A sync table is powered by a **formula** that takes parameters that represent sync options and returns an array of objects representing row data. A sync table also includes a schema describing the structure of the returned objects.


[Learn More](../../guides/blocks/sync-tables/index.md){ .md-button }

## Template
The basic structure of a sync table.

```ts
{% raw %}
pack.addSyncTable({
  name: "MyThings",
  description: "Table description.",
  identityName: "Thing",
  schema: ThingSchema,
  formula: {
    name: "Sync$1",
    description: "Syncs the data.",
    parameters: [
      // TODO: Add parameters.
    ],
    execute: async function (args, context) {
      // TODO: Unpack the parameter values.
      let [] = args;
      // TODO: Fetch the rows.
      let rows = [];
      for (let row of rows) {
        // TODO: If required, adjust the row to match the schema.
      }
      return {
        result: rows,
      };
    },
  },
});
{% endraw %}
```
## With parameter
A sync table that uses a parameter. This sample syncs the list of emojis.

```ts
{% raw %}
import * as sdk from "@codahq/packs-sdk";
export const pack = sdk.newPack();

const EmojiSchema = sdk.makeObjectSchema({
  properties: {
    name: { type: sdk.ValueType.String, fromKey: "annotation" },
    hexcode: { type: sdk.ValueType.String },
    emoji: { type: sdk.ValueType.String },
    group: { type: sdk.ValueType.String },
    image: {
      type: sdk.ValueType.String,
      codaType: sdk.ValueHintType.ImageReference,
    },
  },
  displayProperty: "name",
  idProperty: "hexcode",
  featuredProperties: ["emoji", "group", "image"],
});

pack.addSyncTable({
  name: "Emojis",
  description: "Lists all of the emojis.",
  identityName: "Info",
  schema: EmojiSchema,
  formula: {
    name: "SyncEmojis",
    description: "Syncs the data.",
    parameters: [
      sdk.makeParameter({
        type: sdk.ParameterType.String,
        name: "group",
        description: "If specified, only include emojis in this group.",
        optional: true,
        autocomplete: [
          "smileys-emotion", "people-body", "component", "animals-nature",
          "food-drink", "travel-places", "activities", "objects", "symbols",
        ],
      }),
    ],
    execute: async function (args, context) {
      let [group] = args;
      let url = sdk.withQueryParams("https://www.emoji.family/api/emojis", {
        group: group,
      });
      let response = await context.fetcher.fetch({
        method: "GET",
        url: url,
      });
      let emojis = response.body;
      let rows = emojis.map(info => {
        return {
          // Start with all of the properties in the API response.
          ...info,
          image: `https://www.emoji.family/api/emojis/${info.emoji}/noto/png`,
        };
      });
      return {
        result: rows,
      };
    },
  },
});

pack.addNetworkDomain("emoji.family");
{% endraw %}
```
## With continuation
A sync table that uses continuations to sync data using multiple executions. This sample syncs the spells available in Dungeons and Dragons.

```ts
{% raw %}
import * as sdk from "@codahq/packs-sdk";
export const pack = sdk.newPack();

// How many spells to fetch in each sync formula execution.
const BATCH_SIZE = 20;

// Allow requests to the DND API.
pack.addNetworkDomain("dnd5eapi.co");

// Schema that defines the metadata to return for each spell. Shared by the
// formula, column format, and sync table.
let SpellSchema = sdk.makeObjectSchema({
  type: sdk.ValueType.Object,
  properties: {
    name: {
      description: "The spell name.",
      type: sdk.ValueType.String,
    },
    description: {
      description: "A description of the spell.",
      type: sdk.ValueType.String,
    },
    higher_level: {
      description: "A description for casting the spell at a higher level.",
      type: sdk.ValueType.String,
    },
    level: {
      description: "The level of the spell.",
      type: sdk.ValueType.Number,
    },
    range: {
      description: "The range of the spell.",
      type: sdk.ValueType.String,
    },
    material: {
      description: "The material component for the spell to be cast.",
      type: sdk.ValueType.String,
    },
    duration: {
      description: "How long the spell effect lasts.",
      type: sdk.ValueType.String,
      // Not using the Duration value hint, since this can contain values like
      // "Instantaneous".
    },
    casting_time: {
      description: "How long it takes for the spell to activate.",
      type: sdk.ValueType.String,
      // Not using the Duration value hint, since this can contain values like
      // "1 action".
    },
    attack_type: {
      description: "The attack type of the spell.",
      type: sdk.ValueType.String,
    },
    damage_type: {
      description: "The damage type of the spell.",
      type: sdk.ValueType.String,
    },
    index: {
      description: "A unique identifier for the spell.",
      type: sdk.ValueType.String,
    },
  },
  displayProperty: "name",
  idProperty: "index",
  featuredProperties: ["description", "level", "range"],
});

// Reformat the API response for a spell to fit the schema.
function formatSpell(spell) {
  return {
    // Start with all of the properties in the API response.
    ...spell,
    description: spell.desc?.join("\n"),
    higher_level: spell.higher_level?.join("\n"),
    damage_type: spell.damage?.damage_type?.name,
  };
}

// A sync table that displays all spells available in the API.
pack.addSyncTable({
  name: "Spells",
  identityName: "Spell",
  schema: SpellSchema,
  connectionRequirement: sdk.ConnectionRequirement.None,
  formula: {
    name: "SyncSpells",
    description: "Sync all the spells.",
    parameters: [],
    execute: async function ([], context) {
      // Get the list of all spells.
      let listUrl = "https://www.dnd5eapi.co/api/spells";
      let response = await context.fetcher.fetch({
        method: "GET",
        url: listUrl,
      });
      let results = response.body.results;

      // If there is a previous continuation, start from the index contained
      // within, otherwise start at zero.
      let index: number = (context.sync.continuation?.index as number) || 0;

      // Get a batch of results, starting from the index determined above.
      let batch = results.slice(index, index + BATCH_SIZE);

      // Fetch the spells for the batch of results.
      let spells = await fetchSpells(context.fetcher, batch);

      // Move the index forward.
      index += BATCH_SIZE;

      // If there are more results to process, create a new continuation.
      let continuation;
      if (index <= results.length) {
        continuation = {
          index: index,
        };
      }

      // Return the batch of spells and the next continuation, if any.
      return {
        result: spells,
        continuation: continuation,
      };
    },
  },
});

// Fetch a batch of spells from the API and return them formatted to match the
// schema. This utility function is shared by the formula and sync table.
async function fetchSpells(fetcher: sdk.Fetcher, spellResults) {
  let requests = [];
  for (let spellResult of spellResults) {
    // Add on the domain.
    let url = "https://www.dnd5eapi.co" + spellResult.url;
    // Put the request in the list. Don"t use await here, since we want them to
    // run at the same time.
    let request = fetcher.fetch({
      method: "GET",
      url: url,
    });
    requests.push(request);
  }

  // Wait for all of the requests to finish.
  let responses = await Promise.all(requests);

  // Format the API responses and return them.
  let spells = [];
  for (let response of responses) {
    spells.push(formatSpell(response.body));
  }
  return spells;
}
{% endraw %}
```
## With authentication
A sync table that pulls from an API using authentication. This sample syncs the tasks from a user&#x27;s Todoist account.

```ts
{% raw %}
import * as sdk from "@codahq/packs-sdk";
export const pack = sdk.newPack();

// A schema defining the data in the sync table.
const TaskSchema = sdk.makeObjectSchema({
  properties: {
    name: {
      description: "The name of the task.",
      type: sdk.ValueType.String,
      required: true,
    },
    description: {
      description: "A detailed description of the task.",
      type: sdk.ValueType.String,
    },
    url: {
      description: "A link to the task in the Todoist app.",
      type: sdk.ValueType.String,
      codaType: sdk.ValueHintType.Url,
    },
    id: {
      description: "The ID of the task.",
      type: sdk.ValueType.String,
      required: true,
    },
  },
  displayProperty: "name",
  idProperty: "id",
  featuredProperties: ["description", "url"],
});

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
      sdk.makeParameter({
        type: sdk.ParameterType.String,
        name: "project",
        description: "Limit tasks to a specific project.",
        optional: true,
        autocomplete: async function (context, search) {
          let url = "https://api.todoist.com/rest/v2/projects";
          let response = await context.fetcher.fetch({
            method: "GET",
            url: url,
          });
          let projects = response.body;
          return sdk.autocompleteSearchObjects(search, projects, "name", "id");
        },
      }),
    ],
    execute: async function ([filter, project], context) {
      let url = sdk.withQueryParams("https://api.todoist.com/rest/v2/tasks", {
        filter: filter,
        project_id: project,
      });
      let response = await context.fetcher.fetch({
        method: "GET",
        url: url,
      });

      let results = [];
      for (let task of response.body) {
        results.push({
          name: task.content,
          description: task.description,
          url: task.url,
          id: task.id,
        });
      }
      return {
        result: results,
      };
    },
  },
});

// Allow the pack to make requests to Todoist.
pack.addNetworkDomain("todoist.com");

// Setup authentication using a Todoist API token.
pack.setUserAuthentication({
  type: sdk.AuthenticationType.HeaderBearerToken,
  instructionsUrl: "https://todoist.com/app/settings/integrations",
});
{% endraw %}
```
## With row references
A sync table that contains a reference to a row in another sync table. This sample syncs the tasks from a user&#x27;s Todoist account.

```ts
{% raw %}
import * as sdk from "@codahq/packs-sdk";
export const pack = sdk.newPack();

// A schema defining the data in the Projects sync table.
const ProjectSchema = sdk.makeObjectSchema({
  properties: {
    name: {
      description: "The name of the project.",
      type: sdk.ValueType.String,
      required: true,
    },
    url: {
      description: "A link to the project in the Todoist app.",
      type: sdk.ValueType.String,
      codaType: sdk.ValueHintType.Url,
    },
    id: {
      description: "The ID of the project.",
      type: sdk.ValueType.String,
      required: true,
    },
  },
  displayProperty: "name",
  idProperty: "id",
  featuredProperties: ["url"],
});

// A reference schema, allowing other sync tables to link to rows in the
// Projects sync table. The second parameter must match the identityName field
// of the sync table being referenced.
const ProjectReferenceSchema = sdk.makeReferenceSchemaFromObjectSchema(
  ProjectSchema, "Project");

// A schema defining the data in the Tasks sync table.
const TaskSchema = sdk.makeObjectSchema({
  properties: {
    name: {
      description: "The name of the task.",
      type: sdk.ValueType.String,
      required: true,
    },
    description: {
      description: "A detailed description of the task.",
      type: sdk.ValueType.String,
    },
    url: {
      description: "A link to the task in the Todoist app.",
      type: sdk.ValueType.String,
      codaType: sdk.ValueHintType.Url,
    },
    // Reference a project from the Projects sync table.
    project: ProjectReferenceSchema,
    id: {
      description: "The ID of the task.",
      type: sdk.ValueType.String,
      required: true,
    },
  },
  displayProperty: "name",
  idProperty: "id",
  featuredProperties: ["description", "url", "project"],
});

// The definition and logic for the Projects sync table.
pack.addSyncTable({
  name: "Projects",
  schema: ProjectSchema,
  identityName: "Project",
  formula: {
    name: "SyncProjects",
    description: "Sync projects",
    parameters: [],
    execute: async function ([], context) {
      let url = "https://api.todoist.com/rest/v2/projects";
      let response = await context.fetcher.fetch({
        method: "GET",
        url: url,
      });

      let results = [];
      for (let project of response.body) {
        results.push({
          name: project.name,
          url: project.url,
          id: project.id,
        });
      }
      return {
        result: results,
      };
    },
  },
});

// The definition and logic for the Tasks sync table.
pack.addSyncTable({
  name: "Tasks",
  schema: TaskSchema,
  identityName: "Task",
  formula: {
    name: "SyncTasks",
    description: "Sync tasks",
    parameters: [],
    execute: async function ([], context) {
      let url = "https://api.todoist.com/rest/v2/tasks";
      let response = await context.fetcher.fetch({
        method: "GET",
        url: url,
      });

      let results = [];
      for (let task of response.body) {
        let item: any = {
          name: task.content,
          description: task.description,
          url: task.url,
          id: task.id,
        };
        if (task.project_id) {
          // Add a reference to the parent project in the Projects table.
          item.project = {
            id: task.project_id,
            name: "Not found", // Placeholder name, if not synced yet.
          };
        }
        results.push(item);
      }
      return {
        result: results,
      };
    },
  },
});

// Allow the pack to make requests to Todoist.
pack.addNetworkDomain("todoist.com");

// Setup authentication using a Todoist API token.
pack.setUserAuthentication({
  type: sdk.AuthenticationType.HeaderBearerToken,
  instructionsUrl: "https://todoist.com/app/settings/integrations",
});
{% endraw %}
```
## With indexing
Demonstrates how to index PDF content and contacts. This sample syncs information from the NY Senate API.

```ts
{% raw %}
import * as sdk from "@codahq/packs-sdk";

export const pack = sdk.newPack();

// How many members to sync in a single execution.
const MembersPageSize = 1000;

// How many documents to process in a single execution.
const DocumentsPageSize = 20;

// One hour in seconds, used for caching.
const OneHourSecs = 60 * 60;

// Allow requests to NY's Open Legislation API.
// https://legislation.nysenate.gov/static/docs/html/index.html
pack.addNetworkDomain("nysenate.gov");

// The API uses an API key in the query parameters.
pack.setSystemAuthentication({
  type: sdk.AuthenticationType.QueryParamToken,
  paramName: "key",
});

// The schema for a member, with contact indexing.
const MemberSchema = sdk.makeObjectSchema({
  description: "A member of the NY State Senate.",
  properties: {
    id: {
      type: sdk.ValueType.String,
      fromKey: "memberId",
      description: "A unique ID for the member.",
    },
    name: {
      type: sdk.ValueType.String,
      fromKey: "fullName",
      description: "The full name of the member.",
    },
    district: {
      type: sdk.ValueType.Number,
      fromKey: "districtCode",
      description: "The congressional district that the member represents.",
    },
    email: {
      type: sdk.ValueType.String,
      codaType: sdk.ValueHintType.Email,
      description: "The email address of the member.",
    },
  },
  displayProperty: "name",
  idProperty: "id",
  featuredProperties: ["district", "email"],
  // Contact indexing.
  userEmailProperty: "email",
});

// The schema for a law.
const LawSchema = sdk.makeObjectSchema({
  description: "A law in the New York State legal code.",
  properties: {
    id: {
      type: sdk.ValueType.String,
      fromKey: "lawId",
      required: true,
      description: "A unique ID for the law.",
    },
    name: {
      type: sdk.ValueType.String,
      required: true,
      description: "The name of the law.",
    },
    type: {
      type: sdk.ValueType.String,
      fromKey: "lawType",
      description:
        "The type of law (Consolidated, Unconsolidated, Constitution, etc)",
    },
    chapter: {
      type: sdk.ValueType.String,
      description: "The chapter designation for the law.",
    },
    link: {
      type: sdk.ValueType.String,
      codaType: sdk.ValueHintType.Url,
      description: "A link to the law on nysenate.gov.",
    },
  },
  displayProperty: "name",
  idProperty: "id",
  featuredProperties: ["type", "chapter", "link"],
});

// The schema for a document, with full-text indexing.
const DocumentSchema = sdk.makeObjectSchema({
  properties: {
    id: {
      type: sdk.ValueType.String,
      description: "A unique ID for the document.",
    },
    title: {
      type: sdk.ValueType.String,
      description: "The title of the document.",
    },
    path: {
      type: sdk.ValueType.String,
      description: `
        A breadcrumb trail of the parent documents (chapter, title, article,
        etc) that contain this document.
      `,
    },
    law: {
      ...sdk.makeReferenceSchemaFromObjectSchema(LawSchema, "Law"),
      description: "The law that this document pertains to.",
    },
    pdf: {
      type: sdk.ValueType.String,
      codaType: sdk.ValueHintType.Attachment,
      description: "The contents of the document, as a PDF.",
    },
    link: {
      type: sdk.ValueType.String,
      codaType: sdk.ValueHintType.Url,
      description: "A link to the document on nysenate.gov.",
    },
    lastModified: {
      type: sdk.ValueType.String,
      codaType: sdk.ValueHintType.Date,
      description: "When the document was last modified.",
    },
  },
  displayProperty: "title",
  idProperty: "id",
  featuredProperties: ["law", "link"],
  // Configure indexing.
  titleProperty: "title",
  linkProperty: "link",
  modifiedAtProperty: "lastModified",
  versionProperty: "lastModified",
  index: {
    properties: ["pdf"],
    contextProperties: ["title", "path"],
  },
});

// A sync table of members.
pack.addSyncTable({
  name: "Members",
  description: "Lists the current members of the senate.",
  identityName: "Member",
  schema: MemberSchema,
  formula: {
    name: "SyncMembers",
    description: "Syncs the data.",
    parameters: [],
    execute: async function (args, context) {
      let offset = context.sync.continuation?.offset as number ?? 0;

      // Get the current year in New York.
      let year = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        timeZone: "America/New_York",
      }).format(new Date());

      let url = sdk.withQueryParams(
        `https://legislation.nysenate.gov/api/3/members/${year}`,
        {
          full: true,
          limit: MembersPageSize,
          offset: offset,
        },
      );
      let response = await context.fetcher.fetch({
        method: "GET",
        url: url,
        cacheTtlSecs: OneHourSecs,
      });
      let data = response.body;
      let rows = data.result.items.map(member => {
        return {
          ...member,
          email: member.person.email,
        };
      });

      // If there are more members to sync, continue from the next offset.
      let continuation;
      if (offset + MembersPageSize < data.total) {
        continuation = { offset: offset + MembersPageSize };
      }

      return {
        result: rows,
        continuation: continuation,
      };
    },
  },
});

// A sync table of laws.
pack.addSyncTable({
  name: "Laws",
  description: "Lists the laws on the books.",
  instructions: `
    This table contains basic metadata for the laws. Use the Documents table to
    get the text of the laws.
  `,
  identityName: "Law",
  schema: LawSchema,
  formula: {
    name: "SyncLaws",
    description: "Syncs the data.",
    parameters: [],
    execute: async function (args, context) {
      let response = await context.fetcher.fetch({
        method: "GET",
        url: "https://legislation.nysenate.gov/api/3/laws",
      });
      let data = response.body;
      let rows = data.result.items.map(law => {
        return {
          ...law,
          link: `https://www.nysenate.gov/legislation/laws/${law.lawId}`,
        };
      });
      return {
        result: rows,
      };
    },
  },
});

// A sync table of documents.
pack.addSyncTable({
  name: "Documents",
  description: "Lists the documents with a section of the law.",
  identityName: "Document",
  schema: DocumentSchema,
  formula: {
    name: "SyncDocuments",
    description: "Syncs the data.",
    parameters: [
      sdk.makeParameter({
        type: sdk.ParameterType.String,
        name: "law",
        description: "The ID of the law.",
        autocomplete: async function (context, search) {
          let response = await context.fetcher.fetch({
            method: "GET",
            url: "https://legislation.nysenate.gov/api/3/laws",
            cacheTtlSecs: OneHourSecs,
          });
          let data = response.body;
          let laws = data.result.items;
          return sdk.autocompleteSearchObjects(search, laws, "name", "lawId");
        },
        // During indexing, run a sync for each law in the Laws table.
        crawlStrategy: {
          parentTable: {
            tableName: "Laws",
            propertyKey: "id",
          },
        },
      }),
    ],
    execute: async function (args, context) {
      let [lawId] = args;
      let start = context.sync.continuation?.start as number ?? 0;

      // Fetch the document tree related to a law.
      let response = await context.fetcher.fetch({
        method: "GET",
        url: `https://legislation.nysenate.gov/api/3/laws/${lawId}`,
        cacheTtlSecs: OneHourSecs,
      });
      let data = response.body;
      let root = data.result.documents;

      // Get a list of leaf documents within the tree (non-leaf documents are
      // just indices). Adds a `parents` field to the object with the array of
      // parent documents.
      let documents = getLeafDocuments(root);

      // Trim to one page of documents (we can't process all the PDFs in a
      // single execution).
      let batch = documents.slice(start, start + DocumentsPageSize);

      // Format the document into a row.
      let rows = batch.map(document => {
        let documentId = getDocumentId(document);
        return {
          id: documentId,
          title: getFormattedTitle(document),
          path: document.parents?.map(
            parent => getFormattedTitle(parent)).join(" >"),
          law: {
            lawId: lawId,
            name: document.lawName,
          },
          // The PDF contents of the document is accessed via an API endpoint.
          /* eslint-disable max-len */
          pdf: `https://legislation.nysenate.gov/pdf/laws/${documentId}?full=true`,
          link: `https://www.nysenate.gov/legislation/laws/${document.lawId}/${document.locationId}`,
          /* eslint-enable max-len */
          lastModified: document.activeDate,
        };
      });

      // Copy the PDFs to temporary blob storage, which is required for them to
      // be indexed.
      await Promise.all(rows.map(async row => {
        let tempUrl = await context.temporaryBlobStorage.storeUrl(row.pdf, {
          downloadFilename: `${row.id}.pdf`,
        });
        // Replace the API-provided URL with the new temp URL.
        row.pdf = tempUrl;
      }));

      // If there are more documents to process for this law, make a
      // continuation with the next start index.
      let continuation;
      if (documents.length > start + DocumentsPageSize) {
        continuation = { start: start + DocumentsPageSize };
      }

      return {
        result: rows,
        continuation: continuation,
      };
    },
  },
});

// Given a node in the document tree, returns an array of leaf documents.
function getLeafDocuments(document, parents?) {
  if (document.documents.size === 0) {
    // This is a leaf document, return it.
    document.parents = parents;
    return [document];
  }
  if (!parents) {
    parents = [];
  }
  // Add the current document to the current list of parents.
  parents = [...parents, document];
  let children = document.documents.items;
  // Recursively call this function on the children and return the merged array.
  return children.map(child => getLeafDocuments(child, parents)).flat();
}

// Get a unique ID for a document, which can also be used by the PDF endpoint.
function getDocumentId(document) {
  return `${document.lawId}${document.locationId}`;
}

// Get a formatted title of the document, which returns the type and identifier.
// E.g. "Section 74: Use of the great seal"
function getFormattedTitle(document) {
  let { docType, docLevelId, title } = document;
  return `${toTitleCase(docType)} ${docLevelId}: ${title}`;
}

// Converts a word to title case. E.g. "cat" => "Cat".
function toTitleCase(str) {
  return str.slice(0, 1).toUpperCase() + str.slice(1).toLowerCase();
}
{% endraw %}
```

