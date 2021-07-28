import * as coda from '../../../index';

const pack = coda.newPack();

// BEGIN
// Replace all <text> with your own text
pack.addSyncTable({
  // The display name for the table, shown in the UI.
  name: '<MySyncTable>',
  // The unique identifier for the table.
  identityName: '<TableName>',
  schema: coda.makeObjectSchema({
    type: coda.ValueType.Object,
    // The property name from the properties object below that represents the unique
    // identifier of this item. A sync table MUST have a stable unique identifier. Without
    // one, each subsequent sync will wipe away all rows and recreate them from scratch.
    id: '<idColumn>',
    // The property name from the properties object below that should label this item
    // in the UI. All properties can be seen when hovering over a synced item in the UI,
    // but the primary property value is shown on the chip representing the full object.
    primary: '<displayColumn>',
    // The actual schema properties.
    properties: {
      // Add your properties here e.g.
      // idColumn: {type: coda.ValueType.String},
      // displayColumn: {type: coda.ValueType.String},
      // otherColumn: {type: coda.ValueType.Number},
    },
  }),
  formula: {
    // This is the name that will be called in the formula builder.
    // Remember, your formula name cannot have spaces in it.
    name: '<SyncTable>',
    description: '<Creates a sync table>',

    // If your formula requires one or more inputs, you’ll define them here.
    // You can change the coda.Type to anything but object.
    parameters: [
      coda.makeParameter({
        type: coda.ParameterType.String,
        name: '<myParam>',
        description: '<My description>',
      }),
    ],
    // Everything inside this statement will execute anytime your Coda function is called in a doc.
    execute: async function ([myParam], context) {
      const response = await context.fetcher.fetch({method: 'GET', url: '<your url>'});
      return {
        result: [
          {
            // idColumn: 'Example1',
            // displayColumn: response.body,
            // otherColumn: myParam,
          },
        ],
      };
    },
  },
});
