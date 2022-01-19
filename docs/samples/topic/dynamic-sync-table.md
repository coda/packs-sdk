---
title: Dynamic sync tables
---

# Dynamic sync table samples

Most sync tables have schemas that can be statically defined. For example, if you're writing a sync of a user's Google Calendar events, the structure of an Event from the Google Calendar API is well-known and you can write a schema for what your table should contain.

In certain cases, you may want to sync data whose structure is not known in advance and may depend on the user doing the sync. For example, Coda's Jira pack allows users to sync data from their Jira instance, but Jira lets users create arbitrary custom fields for their Issue objects. So the schema of the Issues sync table is not known in advance; it depends on the Jira account that the user is syncing from.

Coda supports "dynamic" sync tables for cases like these. Instead of including a static schema in your sync table definition, you include a formula that returns a schema. This formula can use the fetcher to make authenticated http requests to your Pack's API so that you may retrieve any necessary info from that third-party service needed to construct an appropriate schema.

To define a dynamic schema, use the `makeDynamicSyncTable()` wrapper function. You will provide a `getSchema` formula that returns a schema definition. You'll also provide some supporting formulas like `getName`, to return a name in the UI for the table, in case even the name of the entities being synced is dynamic.

There are two subtle variants of dynamic sync tables. A sync table can be dynamic simply because the shape of the entities being synced vary based on who the current user is. For example, in the Jira example, Jira Issues are synced by hitting the same static Jira API url for Issues, but the schema of the issues returned will be different depending on the configuration of the Jira instance of the calling user.

Alternatively, a sync table can be dynamic because the data source is specific to each instance of the table. If you were building a sync table to sync data from a Google Sheet, the data source would be the API url of a specific sheet. In this case, the sync table will be bound to a `dynamicUrl` that defines the data source. This url will be available to all of the formulas to implement the sync table in the sync context, as `context.sync.dynamicUrl`. To create a sync table that uses dynamic urls, you must implement the `listDynamicUrls` metadata formula in your dynamic sync table definition.


[Learn More](../../../reference/sdk/classes/PackDefinitionBuilder#addDynamicSyncTable){ .md-button }

## Template


```ts
pack.addDynamicSyncTable({
  name: "<User-visible name for the sync table>",
  listDynamicUrls: async function (context) {
    // TODO: Fetch the list of data sources the user can connect to.
    return [
      { display: "<Datasource Name>", value: "<Datasource URL>" },
    ];
  },
  getName: async function (context) {
    let datasourceUrl = context.sync.dynamicUrl!;
    // TODO: Fetch metadata about the data source and return the name.
    return "<Datasource Name>";
  },
  getSchema: async function (context) {
    let datasourceUrl = context.sync.dynamicUrl!;
    // TODO: Fetch metadata about the data source and get the list of fields.
    let properties: any = {
      // TODO: Create a property for each field.
    };
    let id = "<Determine the field containing a unique ID>";
    let primary = "<Determine the field containing the display value>";
    let featured = [
      // TODO: Determine which fields to show in the table by default.
    ];
    return coda.makeSchema({
      type: coda.ValueType.Array,
      items: coda.makeObjectSchema({
        identity: {
          name: "<User-visible name for the column containing the schema>",
          dynamicUrl: datasourceUrl,
        },
        properties: properties,
        id: id,
        primary: primary,
        featured: featured,
      }),
    });
  },
  getDisplayUrl: async function (context) {
    return context.sync.dynamicUrl!;
  },
  formula: {
    name: "<Name of the sync formula, not show to the user>",
    description: "<Help text for the sync formula, not show to the user>",
    parameters: [
      coda.makeParameter({
        type: coda.ParameterType.String,
        name: "<User-visible name of parameter>",
        description: "<Help text for the parameter>",
      }),
      // Add more parameters here and in the array below.
    ],
    execute: async function ([param], context) {
      let datasourceUrl = context.sync.dynamicUrl!;
      let url = "<URL to pull data from>";
      let response = await context.fetcher.fetch({
        method: "GET",
        url: url,
      });
      let items = response.body.items;
      // Adjust the items to fit the schema if required.
      return {
        result: items,
      }
    },
  },
});
```
## With URL list
A sync table that presents a list of URLs to select from. This sample shows responses to a Typeform form.

```ts
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// How many responses to fetch per-page.
const PageSize = 100;

// Add a dynamic sync table for form responses.
pack.addDynamicSyncTable({
  name: "FormResponses",
  description: "Responses to a form.",

  // Returns the URLs of the available forms. The user will select one when they
  // add the table to their doc. The selected URL will be passed as
  // `context.sync.dynamicUrl` to other methods.
  listDynamicUrls: async function (context) {
    let response = await context.fetcher.fetch({
      method: "GET",
      url: "https://api.typeform.com/forms",
    });
    let forms = response.body.items;
    let results = [];
    for (let form of forms) {
      // Each result should include the name and URL of the form.
      results.push({
        display: form.title,
        // Using the API URL of the form, not the browser URL. This makes it
        // easier to use the URL in the code, and `getDisplayUrl` below can
        // show the browser URL to the user.
        value: form.self.href,
      });
    }
    return results;
  },

  // Returns the name of the table, given the selected URL.
  getName: async function (context) {
    let formUrl = context.sync.dynamicUrl;
    let form = await getForm(context, formUrl);
    return form.title;
  },

  // Returns the display version of the selected URL.
  getDisplayUrl: async function (context) {
    let formUrl = context.sync.dynamicUrl;
    let form = await getForm(context, formUrl);
    return form._links.display;
  },

  // Returns the schema of the table, given the selected URL.
  getSchema: async function (context) {
    let formUrl = context.sync.dynamicUrl;
    let form = await getForm(context, formUrl);

    // These properties are the same for all forms.
    let properties: any = {
      submittedAt: {
        type: coda.ValueType.String,
        codaType: coda.ValueHintType.DateTime,
      },
      responseId: {
        type: coda.ValueType.String,
      },
    };
    // Use them as the display value and ID of the rows.
    let primary = "submittedAt";
    let id = "responseId";

    // For each field in the form, add a property to the schema.
    let featured = [];
    for (let field of form.fields) {
      // Format the field name into a valid property name.
      let name = getPropertyName(field.title);
      // Generate a schema for the field and add it to the set of properties.
      properties[name] = getSchema(field);
      // Mark the property as featured (included in the table by default).
      featured.push(name);
    }

    // Assemble the schema for each row.
    let schema = coda.makeObjectSchema({
      properties: properties,
      primary: primary,
      id: id,
      featured: featured,
      identity: {
        name: "FormResponse",
        dynamicUrl: formUrl,
      },
    });

    // Return an array schema as the result.
    return coda.makeSchema({
      type: coda.ValueType.Array,
      items: schema,
    });
  },

  // The formula that syncs the records.
  formula: {
    name: "SyncResponses",
    description: "Sync the form responses",
    parameters: [],
    execute: async function ([], context) {
      let formUrl = context.sync.dynamicUrl;

      // Retrieve the token to continue from, if any.
      let pageToken = context.sync.continuation?.token || null;

      // Construct the API URL.
      let url = coda.withQueryParams(formUrl + "/responses", {
        page_size: PageSize,
        before: pageToken,
      });

      // Fetch a page of responses.
      let response = await context.fetcher.fetch({
        method: "GET",
        url: url,
        // Disable HTTP caching, so we always get the latest results.
        cacheTtlSecs: 0,
      });
      let formResponses = response.body.items;

      // Reformat each response to match the schema.
      let rows = [];
      for (let formResponse of formResponses) {
        // Include the metadata common to all forms.
        let row = {
          submittedAt: formResponse.submitted_at,
          responseId: formResponse.response_id,
        };

        // For each answer, add it to the row.
        for (let answer of formResponse.answers) {
          let value = getValue(answer);
          // Store the answer based on the field ID. See the use of `fromKey` in
          // `getSchema` below.
          row[answer.field.id] = value;
        }
        rows.push(row);
      }

      // Determine if we need to fetch more pages.
      let continuation;
      if (formResponses.length > 0) {
        // Continue onward from the token of the last response.
        let lastToken = formResponses[formResponses.length - 1].token;
        continuation = {
          token: lastToken,
        };
      }

      // Return the rows and the continuation, if any.
      return {
        result: rows,
        continuation: continuation,
      }
    },
  },
});

// Get metadata about a form given it's URL.
async function getForm(context, url) {
  let response = await context.fetcher.fetch({
    method: "GET",
    url: url,
    // Disable HTTP caching, so we always get the latest result.
    cacheTtlSecs: 0,
  });
  return response.body;
}

// Generates a property name given a field title.
function getPropertyName(title) {
  return title
    // Replace placeholders with an X.
    .replace(/\{\{.*?\}\}/g, "X")
    // Remove all characters that aren't letters, numbers or spaces.
    .replace(/[^\w\s]/g, "");
}

// Generates a property schema based on a Typeform field.
function getSchema(field) {
  let schema: any = {
    // Use the field's full title as it's description.
    description: field.title,
    // The sync formula will return the value keyed using the field's ID.
    fromKey: field.id,
  };

  // Set the schema type depending on the field type.
  switch (field.type) {
    case "yes_no":
      schema.type = coda.ValueType.Boolean;
      break;
    case "number":
    case "opinion_scale":
    case "rating":
      schema.type = coda.ValueType.Number;
      break;
    case "date":
      schema.type = coda.ValueType.String;
      schema.codaType = coda.ValueHintType.Date;
      break;
    case "multiple_choice":
      let isMultiselect = field.properties.allow_multiple_selection;
      if (isMultiselect) {
        schema.type = coda.ValueType.Array;
        schema.items = {
          type: coda.ValueType.String
        };
      } else {
        schema.type = coda.ValueType.String;
      }
      break;
    default:
      // Default to strings.
      schema.type = coda.ValueType.String;
  }

  return schema;
}

// Gets the value from a Typeform answer.
function getValue(answer) {
  switch (answer.type) {
    case "choice":
      return answer.choice.label;
    case "choices":
      return answer.choices.labels;
    default:
      // The value is stored in a field with the same name as the type of the
      // answer.
      return answer[answer.type];
  }
}

// Configure per-user authentication, using OAuth2.
pack.setUserAuthentication({
  type: coda.AuthenticationType.OAuth2,
  // See: https://developer.typeform.com/get-started/applications/
  authorizationUrl: "https://api.typeform.com/oauth/authorize",
  tokenUrl: "https://api.typeform.com/oauth/token",
  // See: https://developer.typeform.com/get-started/scopes/
  scopes: ["forms:read", "responses:read", "accounts:read"],

  // Get the name of the account from the Typeform API.
  getConnectionName: async function (context) {
    let url = "https://api.typeform.com/me";
    let response = await context.fetcher.fetch({
      method: "GET",
      url: url,
    });
    let profile = response.body;
    return profile.alias;
  },
});

// Allow requests to the typeform.com domain.
pack.addNetworkDomain("typeform.com");
```

