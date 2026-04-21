import path from 'path';
import * as sdk from '../..';

export const pack = sdk.newPack();

pack.addNetworkDomain('googleapis.com');
pack.addNetworkDomain('httpbin.org');

pack.setUserAuthentication({
  type: sdk.AuthenticationType.OAuth2,
  authorizationUrl: 'https://accounts.google.com/o/oauth2/auth',
  tokenUrl: 'https://accounts.google.com/o/oauth2/token',
  scopes: ['https://www.googleapis.com/auth/calendar', 'profile', 'email'],
  additionalParams: {
    access_type: 'offline',
    prompt: 'consent select_account',
    session: false,
  },

  async getConnectionName(context) {
    const response = await context.fetcher.fetch({
      method: 'GET',
      url: 'https://www.googleapis.com/oauth2/v2/userinfo',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.body.email;
  },
});

pack.addFormula({
  name: 'GoogleMe',
  description: 'Me returned by google api',
  parameters: [],
  resultType: sdk.ValueType.String,
  execute: async ([], context) => {
    const response = await context.fetcher.fetch({
      method: 'GET',
      url: 'https://www.googleapis.com/oauth2/v2/userinfo',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.body.email;
  },
});

const fakePersonSchema = sdk.makeObjectSchema({
  type: sdk.ValueType.Object,
  primary: 'name',
  id: 'name',
  properties: {
    name: {type: sdk.ValueType.String, required: true},
  },
});

function doThrow() {
  throw new Error('test');
}

pack.addFormula({
  name: 'Person',
  description: 'A formula that returns an object',
  parameters: [
    sdk.makeParameter({
      type: sdk.ParameterType.String,
      name: 'name',
      description: 'the name of the person',
      autocomplete: async (_context, _search, formulaContext) => {
        return [{display: formulaContext!.foo, value: formulaContext!.bar}];
      },
    }),
  ],
  resultType: sdk.ValueType.Object,
  schema: fakePersonSchema,
  execute: async ([name]) => {
    return {name};
  },
});

pack.addFormula({
  name: 'Throw',
  description: 'A Hello World example.',
  parameters: [
    sdk.makeParameter({
      type: sdk.ParameterType.String,
      name: 'name',
      description: 'The name you would like to say hello to.',
    }),
  ],
  resultType: sdk.ValueType.String,
  async execute([name]) {
    doThrow();
    return 'Hello ' + name + '!';
  },
});

pack.addColumnFormat({
  name: 'test',
  formulaName: 'Throw',
  formulaNamespace: 'deprecated',
  matchers: [/https:\/\/testregex/],
});

pack.addSyncTable({
  name: 'Foos',
  description: 'FooDesc',
  identityName: 'FooObject',
  schema: sdk.makeObjectSchema({
    type: sdk.ValueType.Object,
    id: 'foo',
    primary: 'foo',
    properties: {
      foo: {
        type: sdk.ValueType.String,
        autocomplete: () => {
          return ['hi', {display: 'Goodbye!', value: 'bye'}];
        },
      },
      bar: {
        type: sdk.ValueType.Number,
        autocomplete: () => {
          return [123, 456, {display: 'another', value: 3}];
        },
      },
      baz: {
        type: sdk.ValueType.Object,
        properties: {
          bazProp: {type: sdk.ValueType.String},
        },
        autocomplete: () => {
          return [{bazProp: 'hmm'}];
        },
      },
      inlineAutocomplete: {
        type: sdk.ValueType.Number,
        autocomplete: [1, 2, 3, 4],
      },
    },
  }),
  formula: {
    name: 'Ignored',
    description: '',
    parameters: [],
    execute: async () => {
      return {result: []};
    },
  },
});

pack.addDynamicSyncTable({
  name: 'FooDyns',
  identityName: 'Foo',
  description: 'FooDynDesc',
  getName: async () => 'name',
  getDisplayUrl: async () => 'display url',
  getSchema: async () => {
    return {
      type: sdk.ValueType.Object,
      primary: 'name',
      id: 'name',
      properties: {
        name: {type: sdk.ValueType.String, required: true} as any,
      },
    };
  },
  formula: {
    name: 'Ignored',
    description: '',
    parameters: [],
    execute: async () => {
      return {result: [{name: 'alice'}, {name: 'bob'}]};
    },
  },
});

pack.addFormula({
  name: 'Sum',
  description: 'A formula that adds all params together',
  parameters: [
    sdk.makeParameter({
      type: sdk.ParameterType.SparseNumberArray,
      name: 'numbers',
      description: 'A list of numbers',
    }),
  ],
  resultType: sdk.ValueType.Number,
  execute: async ([numbers]) => {
    let sum = 0;
    for (const number of numbers) {
      if (number) {
        sum += number;
      }
    }
    return sum;
  },
});

pack.addFormula({
  name: 'StoreBufferFromText',
  description: '',
  parameters: [],
  resultType: sdk.ValueType.String,
  execute: async ([], context) => {
    const buffer = Buffer.from('Hello World!');
    const url = await context.temporaryBlobStorage.storeBlob(buffer, 'text/plain');
    return url;
  },
  cacheTtlSecs: 0,
});

pack.addFormula({
  name: 'StatusCode',
  description: '',
  parameters: [
    sdk.makeParameter({
      type: sdk.ParameterType.Number,
      name: 'status',
      description: '',
    }),
  ],
  resultType: sdk.ValueType.String,
  cacheTtlSecs: 0,
  async execute([param], context) {
    try {
      const response = await context.fetcher.fetch({url: `https://httpbin.org/status/${param}`, method: 'GET'});
      return `${response.status}`;
    } catch (err) {
      if (err instanceof sdk.StatusCodeError) {
        return `Error is StatusCodeError with code ${err.statusCode}`;
      } else {
        return `Unrecogonized error ${JSON.stringify(err)}`;
      }
    }
  },
});

pack.addFormula({
  name: 'NodeUtils',
  description: '',
  parameters: [
    sdk.makeParameter({
      type: sdk.ParameterType.String,
      name: 'name',
      description: '',
    }),
  ],
  resultType: sdk.ValueType.String,
  execute: async ([name]) => {
    return path.join('baseDir', name);
  },
  cacheTtlSecs: 0,
});

pack.addFormula({
  name: 'Random',
  description: 'calls crypto random',
  parameters: [],
  resultType: sdk.ValueType.Number,
  execute: async () => {
    return crypto.getRandomValues(new Uint32Array(10))[0];
  },
  cacheTtlSecs: 0,
});
