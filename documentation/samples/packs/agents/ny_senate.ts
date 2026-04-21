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
      return {
        result: rows,
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
  description: "",
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
          name: document.title,
          number: document.docLevelId,
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
