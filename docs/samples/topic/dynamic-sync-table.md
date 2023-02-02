---
nav: Dynamic sync tables
description: Samples that show how to create a dynamic sync table.
icon: material/cloud-sync-outline
---

# Dynamic sync table samples

Dynamic sync tables allow you to bring data from an external data source into your doc, even when the structure of that data is not known in advance. Instead of including a static schema in your sync table definition, you include a `getSchema` function that returns a schema based on the dataset the user selects. It can use the fetcher to make authenticated HTTP requests to an API so that you can determine the shape of the data.

Dynamic sync tables typically provide a list all of the datasets that the user has access to, using the `listDynamicUrls` function. Once a user selects a dataset from the side panel it will be available to other functions in `context.sync.dynamicUrl`. The dynamic sync table must also provide a user-visible URL for the selected dataset (using `getDisplayUrl`) and a name for the resulting table on the page (using `getName`).


[Learn More](../../../guides/blocks/sync-tables/dynamic){ .md-button }

## Template


```ts
{% raw %}
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
{% endraw %}
```
## With URL list
A sync table that presents a list of URLs to select from. This sample shows responses to a Typeform form.

```ts
{% raw %}
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
{% endraw %}
```
## With grouped URL list
A sync table that presents a list of URLs to select from, grouped into folders. This sample shows data from Open Data NY (data.ny.gov), which is powered by Socrata.

```ts
{% raw %}
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// The domain to connect to. Can be swapped for other domains hosting Socrata.
const Domain = "data.ny.gov";

// The max number of columns to include in the sync table by default.
const MaxFeaturedColumns = 50;

// How many rows to scan when determining the which columns to feature.
const TableScanMaxRows = 100;

// How many rows to fetch per-page.
const PageSize = 100;

// A regular expression matching a dataset.
const DatasetUrlRegex = new RegExp(`^https?://${Domain}/.*/([^?#]+)`);

// Schema for an address (part of a location).
const AddressSchema = coda.makeObjectSchema({
  properties: {
    address: { type: coda.ValueType.String },
    city: { type: coda.ValueType.String },
    state: { type: coda.ValueType.String },
    zip: { type: coda.ValueType.String },
  },
  displayProperty: "address",
});

// Schema for a location (used for locations and points).
const LocationSchema = coda.makeObjectSchema({
  properties: {
    coordinates: {
      type: coda.ValueType.Array,
      items: { type: coda.ValueType.Number },
    },
    latitude: { type: coda.ValueType.Number },
    longitude: { type: coda.ValueType.Number },
    address: { ...AddressSchema, fromKey: "human_address" },
  },
  displayProperty: "coordinates",
});

// A mapping from Socrata types to Coda schemas.
const TypeSchemaMap: Record<string, coda.Schema> = {
  text: { type: coda.ValueType.String },
  number: { type: coda.ValueType.Number },
  checkbox: { type: coda.ValueType.Boolean },
  calendar_date: {
    type: coda.ValueType.String,
    codaType: coda.ValueHintType.Date,
  },
  location: LocationSchema,
  point: LocationSchema,
  url: { type: coda.ValueType.String, codaType: coda.ValueHintType.Url },
};

// A base row schema, extended for each dataset.
const BaseRowSchema = coda.makeObjectSchema({
  properties: {
    rowId: { type: coda.ValueType.String, fromKey: ":id" },
  },
  idProperty: "rowId",
  displayProperty: "rowId",
});


// Allow requests to the domain.
pack.addNetworkDomain(Domain);

// Use a system-wide application token to get additional quota.
// https://dev.socrata.com/docs/app-tokens.html
pack.setSystemAuthentication({
  type: coda.AuthenticationType.CustomHeaderToken,
  headerName: "X-App-Token",
});

// A dynamic sync table for the rows of a dataset.
pack.addDynamicSyncTable({
  name: "PublicDataset",
  identityName: "DatasetRow",
  entityName: "Row",
  // If new columns are added later, don't automatically feature them.
  defaultAddDynamicColumns: false,

  // Allow the user to browse the datasets by category.
  listDynamicUrls: async function (context, category) {
    if (!category) {
      // Return the list of categories.
      let categories = await getCategories(context);
      return categories.map(category => {
        return {
          display: category,
          value: category,
          hasChildren: true,
        };
      });
    }

    // Return all the datasets in that category.
    let datasets = await searchDatasets(context, {
      only: "datasets",
      domains: Domain,
      order: "page_views_last_month",
      limit: 10000,
      categories: category,
      search_context: Domain,
    });
    if (!datasets?.length) {
      return [];
    }
    return datasets.map(dataset => {
      return {
        display: dataset.name,
        value: dataset.link,
      };
    });
  },

  getName: async function (context) {
    let dataset = await getDataset(context);
    return dataset.name;
  },

  getSchema: async function (context) {
    let dataset = await getDataset(context);

    // Copy the base schema.
    let schema: coda.GenericObjectSchema = {
      ...BaseRowSchema,
    };

    // Add a schema property for each column.
    for (let column of dataset.columns) {
      let fieldName = column.fieldName;
      let dataType = column.dataTypeName;
      let description = column.description;

      if (fieldName.startsWith(":")) {
        // Skip internal fields.
        continue;
      }

      let fieldSchema = TypeSchemaMap[dataType];
      if (!fieldSchema) {
        throw new Error("Couldn't find schema for column type: " + dataType);
      }

      schema.properties[fieldName] = {
        ...fieldSchema,
        description: description,
      };
    }

    // Determine which columns to feature.
    schema.featuredProperties = await getFeatured(dataset, context);

    // Add attribution information.
    schema.attribution = getAttribution(dataset);

    return schema;
  },

  getDisplayUrl: async function (context) {
    return context.sync.dynamicUrl;
  },

  formula: {
    name: "SyncDataset",
    description: "Syncs the dataset.",
    parameters: [
      coda.makeParameter({
        type: coda.ParameterType.String,
        name: "search",
        description: "If specified, only rows containing this search term " +
          "will be included.",
        optional: true,
      }),
      coda.makeParameter({
        type: coda.ParameterType.String,
        name: "filter",
        description: "A SoQL $where clause to use to filter the results. " +
          "https://dev.socrata.com/docs/queries/where.html",
        optional: true,
      }),
    ],
    execute: async function ([search, filter], context) {
      let dataset = await getDataset(context);
      let offset = context.sync.continuation?.offset as number || 0;

      // Only fetch the selected columns.
      let fields = coda.getEffectivePropertyKeysFromSchema(context.sync.schema);

      // Fetch the row data.
      let baseUrl = `https://${Domain}/resource/${dataset.id}.json`;
      let url = coda.withQueryParams(baseUrl, {
        $select: fields.join(","),
        $q: search,
        $where: filter,
        $limit: PageSize,
        $offset: offset,
      });
      let response = await context.fetcher.fetch({
        method: "GET",
        url: url,
      });
      let rows = response.body;

      // Transform the rows to match the schema.
      for (let row of rows) {
        for (let [key, value] of Object.entries(row)) {
          row[key] = formatValue(value);
        }
      }

      let continution = null;
      if (rows.length > 0) {
        // Keep fetching rows until we get an empty page.
        continution = { offset: offset + PageSize };
      }

      return {
        result: rows,
        continuation: continution,
      };
    },
  },
});

/**
 * Reformat a row value to match the schema.
 */
function formatValue(value) {
  if (typeof value === "object") {
    let obj = value as Record<string, any>;
    if (obj.url) {
      // Pull up the URL.
      value = obj.url;
    } else if (obj.type === "Point") {
      // Format point to LocationSchema.
      value = {
        latitude: obj.coordinates[1],
        longitude: obj.coordinates[0],
        // A point's coordinates are returned as x,y instead of lat,long.
        coordinates: obj.coordinates.reverse(),
      };
    } else if (obj.latitude && obj.longitude) {
      // Format location to LocationSchema.
      value = {
        ...obj,
        coordinates: [obj.latitude, obj.longitude],
      };
    }
  }
  return value;
}

/**
 * Get the list of dataset categories.
 */
async function getCategories(context: coda.ExecutionContext):
  Promise<string[]> {
  let baseUrl = `https://${Domain}/api/catalog/v1/domain_categories`;
  let url = coda.withQueryParams(baseUrl, {
    domains: Domain,
  });
  let response = await context.fetcher.fetch({
    method: "GET",
    url: url,
  });
  return response.body.results.map(result => result.domain_category);
}

/**
 * Search for datasets, using a flexible set of parameters.
 */
async function searchDatasets(context: coda.ExecutionContext,
  params: Record<string, any>): Promise<DatasetResult[]> {
  let url = coda.withQueryParams(`https://${Domain}/api/catalog/v1`, params);
  let response = await context.fetcher.fetch({
    method: "GET",
    url: url,
  });
  return response.body.results.map(result => {
    return {
      ...result.resource,
      ...result,
    };
  });
}

/**
 * Get a dataset by ID.
 */
async function getDataset(context: coda.ExecutionContext): Promise<Dataset> {
  let datasetUrl = context.sync.dynamicUrl;
  let datasetId = getDatasetId(datasetUrl);
  let url = `https://${Domain}/api/views/${datasetId}.json`;
  let response = await context.fetcher.fetch({
    method: "GET",
    url: url,
  });
  return response.body;
}

/**
 * Extract the ID of the dataset from it's URL.
 */
function getDatasetId(url: string): string {
  let match = url.match(DatasetUrlRegex);
  if (!match) {
    throw new coda.UserVisibleError("Invalid dataset URL: " + url);
  }
  return match[1];
}

/**
 * Determine which rows to feature (include in the table by default) for a given
 * dataset.
 */
async function getFeatured(dataset: Dataset, context: coda.ExecutionContext):
  Promise<string[]> {
  // Fetch some of the first rows from the dataset.
  let baseUrl = `https://${Domain}/resource/${dataset.id}.json`;
  let url = coda.withQueryParams(baseUrl, {
    $limit: TableScanMaxRows,
  });
  let response = await context.fetcher.fetch({
    method: "GET",
    url: url,
  });
  let rows = response.body;

  // Count how many times each column has a value.
  let columnCount: Record<string, number> = {};
  for (let row of rows) {
    for (let [key, value] of Object.entries(row)) {
      if (!columnCount[key]) {
        columnCount[key] = 0;
      }
      if (value) {
        columnCount[key]++;
      }
    }
  }

  // Return the list of columns that have at least one value in the scanned
  // rows, up to a defined maximum.
  return dataset.columns.map(column => column.fieldName)
    .filter(column => columnCount[column] > 0)
    .filter(column => !column.startsWith(":"))
    .slice(0, MaxFeaturedColumns);
}

/**
 * Get the attribution node for a given dataset.
 */
function getAttribution(dataset: Dataset): coda.AttributionNode[] {
  if (!dataset.attribution) {
    return null;
  }
  let node;
  if (dataset.attributionLink) {
    node = coda.makeAttributionNode({
      type: coda.AttributionNodeType.Link,
      anchorText: dataset.attribution,
      anchorUrl: dataset.attributionLink,
    });
  } else {
    node = coda.makeAttributionNode({
      type: coda.AttributionNodeType.Text,
      text: dataset.attribution,
    });
  }
  return [node];
}


// A dataset search result.
interface DatasetResult {
  name: string;
  link: string;
}

// The dataset metadata.
interface Dataset {
  id: string;
  name: string;
  description: string;
  columns: DatasetColumn[];
  attribution: string;
  attributionLink: string;
}

// A dataset column definition.
interface DatasetColumn {
  name: string;
  description: string;
  fieldName: string;
  dataTypeName: string;
}
{% endraw %}
```

