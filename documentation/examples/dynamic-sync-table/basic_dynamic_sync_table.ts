import * as coda from '../../../index';

const pack = coda.newPack();

// BEGIN
// Replace all <text> with your own names
pack.addDynamicSyncTable({
  // The static name for this category of sync table
  name: '<MyDynamicSynctable>',
  // The display name for the table, shown in the UI.
  getName: async context => {
    const response = await context.fetcher.fetch({method: 'GET', url: context.sync.dynamicUrl});
    // Return whatever represents the name of the entity you're syncing.
    return response.body.name;
  },
  // A label for the kind of entities that you are syncing.
  // Using Google Sheets as example you might use "Row" here, as each synced entity is a row from the source sheet.
  entityName: '<RowName>',
  getSchema: async () => {
    return coda.makeSchema({
      type: coda.ValueType.Array,
      items: coda.makeObjectSchema({
        type: coda.ValueType.Object,
        // The property name from the properties object below that represents the unique
        // identifier of this item. A sync table MUST have a stable unique identifier. Without
        // one, each subsequent sync will wipe away all rows and recreate them from scratch.
        id: '<idColumn>',
        // The property name from the properties object below that should label this item
        // in the UI. All properties can be seen when hovering over a synced item in the UI,
        // but the primary property value is shown on the chip representing the full object.
        primary: '<displayColumn>',
        // The columns that will be displayed on the table
        featured: ['<otherColumn>'],
        // The actual schema properties.
        properties: {
          // Add your properties here e.g.
          // idColumn: {type: coda.ValueType.Number},
          // displayColumn: {type: coda.ValueType.String},
          // otherColumn: {type: coda.ValueType.String},
        },
      }),
    });
  },
  // A user-friendly url representing the entity being synced. The table UI in the doc will provide
  // a convenience link to this url so the user can easily click through to the source of data in that table.
  getDisplayUrl: async context => {
    const response = await context.fetcher.fetch({method: 'GET', url: context.sync.dynamicUrl});
    // Return whatever represents a browser-friendly version of the dynamic url.
    return response.body.browserLink;
  },
  formula: {
    // This is the name that will be called in the formula builder.
    // Remember, your formula name cannot have spaces in it.
    name: '<DynamicSyncTable>',
    description: '<Creates a dynamic sync table>',

    // If your formula requires one or more inputs, you’ll define them here.
    parameters: [
      coda.makeParameter({
        type: coda.ParameterType.String,
        name: '<myParam>',
        description: '<My description>',
      }),
    ],
    // Everything inside this statement will execute anytime your Coda function is called in a doc.
    execute: async function ([myParam], context) {
      return {
        result: [
          // {
          //   idPropertyName: 1,
          //   displayPropertyName: '<Example1>',
          //   otherPropertyName: myParam,
          // },
        ],
      };
    },
  },
});
