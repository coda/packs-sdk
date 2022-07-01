---
title: Dynamic sync tables
description: Samples that show how to create a dynamic sync table.
icon: material/cloud-sync-outline
---

# Dynamic sync table samples

Dynamic sync tables allow you to bring data from an external data source into your doc, even when the structure of that data is not known in advance. Instead of including a static schema in your sync table definition, you include a `getSchema` function that returns a schema based on the dataset the user selects. It can use the fetcher to make authenticated HTTP requests to an API so that you can determine the shape of the data.

Dynamic sync tables typically provide a list all of the datasets that the user has access to, using the `listDynamicUrls` function. Once a user selects a dataset from the side panel it will be available to other functions in `context.sync.dynamicUrl`. The dynamic sync table must also provide a user-visible URL for the selected dataset (using `getDisplayUrl`) and a name for the resulting table on the page (using `getName`).


[Learn More](../../../guides/blocks/sync-tables/dynamic){ .md-button }

## Template


```ts
pack.addDynamicSyncTable({
  name: "<User-visible name for the sync table>",
  listDynamicUrls: async function (context) {
    // TODO: Fetch the list of data sources the user can connect to.
    return [{ display: "<Datasource Name>", value: "<Datasource URL>" }];
  },
  getName: async function (context) {
    let datasourceUrl = context.sync.dynamicUrl!;
    // TODO: Fetch metadata about the data source and return the name.
    return "<Datasource Name>";
  },
  identityName: "<User-visible name for the column containing the schema>",
  getSchema: async function (context) {
    let datasourceUrl = context.sync.dynamicUrl!;
    // TODO: Fetch metadata about the data source and get the list of fields.
    let properties: coda.ObjectSchemaProperties = {
      // TODO: Create a property for each field.
    };
    let idProperty = "<Determine the field containing a unique ID>";
    let displayProperty = "<Determine the field containing the display value>";
    let featuredProperties = [
      // TODO: Determine which fields to show in the table by default.
    ];
    return coda.makeObjectSchema({
      properties: properties,
      idProperty: idProperty,
      displayProperty: displayProperty,
      featuredProperties: featuredProperties,
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
      };
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
  identityName: "FormResponse",

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
    let properties: coda.ObjectSchemaProperties = {
      submittedAt: {
        type: coda.ValueType.String,
        codaType: coda.ValueHintType.DateTime,
      },
      responseId: {
        type: coda.ValueType.String,
      },
    };
    // Use them as the display value and ID of the rows.
    let displayProperty = "submittedAt";
    let idProperty = "responseId";

    // For each field in the form, add a property to the schema.
    let featuredProperties = [];
    for (let field of form.fields) {
      // Format the field name into a valid property name.
      let name = getPropertyName(field);
      // Generate a schema for the field and add it to the set of properties.
      properties[name] = getPropertySchema(field);
      // Mark the property as featured (included in the table by default).
      featuredProperties.push(name);
    }

    // Return the schema for each row.
    return coda.makeObjectSchema({
      properties: properties,
      displayProperty: displayProperty,
      idProperty: idProperty,
      featuredProperties: featuredProperties,
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
          // Get the key to return the value in.
          let key = getPropertyKey(answer.field);
          let value = getPropertyValue(answer);
          row[key] = value;
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
      };
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
function getPropertyName(field) {
  return (
    field.title
      // Replace placeholders with an X.
      .replace(/\{\{.*?\}\}/g, "X")
  );
}

// Generates a property schema based on a Typeform field.
function getPropertySchema(field): coda.Schema & coda.ObjectSchemaProperty {
  let schema: any = {
    // Use the field's full title as it's description.
    description: field.title,
    // The sync formula will return the value keyed using the field's ID.
    fromKey: getPropertyKey(field),
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
          type: coda.ValueType.String,
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

// Gets the key to use for this field when returning the value in the sync
// formula.
function getPropertyKey(field) {
  return field.id;
}

// Gets the value from a Typeform answer.
function getPropertyValue(answer) {
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

