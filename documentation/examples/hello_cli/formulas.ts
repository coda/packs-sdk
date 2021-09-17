import type {Format} from '@codahq/packs-sdk';
import type {Formula} from '@codahq/packs-sdk';
import type {GenericSyncTable} from '@codahq/packs-sdk';
import {ParameterType} from '@codahq/packs-sdk';
import {ValueType} from '@codahq/packs-sdk';
import {makeFormula} from '@codahq/packs-sdk';
import {makeParameter} from '@codahq/packs-sdk';

export const formulas: Formula[] = [
  makeFormula({
    // This is the name that will be called in the formula builder.
    // Remember, your formula name cannot have spaces in it.
    name: 'Hello',
    description: 'A Hello World example.',

    // If your formula requires one or more inputs, you’ll define them here.
    // Here, we're creating a string input called “name”.
    parameters: [
      makeParameter({
        type: ParameterType.String,
        name: 'name',
        description: 'The name you\'d like to say hello to.'
      }),
    ],

    // Everything inside this execute statement will happen anytime your Coda function is called in a doc.
    // An array of all user inputs is always the 1st parameter.
    execute: function ([name]) {
      return 'Hello ' + name + '!';
    },

    // The resultType defines what will be returned in your Coda doc. Here, we're returning a simple text string.
    resultType: ValueType.String,
  }),
];

export const syncTables: GenericSyncTable[] = [
  // Sync table definitions go here, e.g.
  // makeSyncTable({...}),
];

export const formats: Format[] = [
  // Column formats go here, e.g.
  // {name: 'MyFormat', formulaNamespace: 'MyPack', formulaName: 'MyFormula'}
];
