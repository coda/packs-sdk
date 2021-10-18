import type {AutocompleteSnippet} from './types';
import type {Example} from './types';
import {ExampleCategory} from './types';
import {UrlType} from './types';

export const Snippets: AutocompleteSnippet[] = [
  {
    triggerTokens: ['addStringFormula', 'makeStringFormula', 'StringFormula', 'addFormula'],
    content: 'Adds a Coda formula which will return a text string in the doc.',
    codeFile: './snippets/formula/string_formula.ts',
  },
  {
    triggerTokens: ['addArrayFormula', 'makeArrayFormula', 'ArrayFormula'],
    content: 'Adds a Coda formula which will return a text string in the doc.',
    codeFile: './snippets/formula/array_formula.ts',
  },
  {
    triggerTokens: ['addBooleanFormula', 'makeBooleanFormula', 'BooleanFormula'],
    content: 'Adds a Coda formula which will return true or false in the doc.',
    codeFile: './snippets/formula/boolean_formula.ts',
  },
  {
    triggerTokens: ['addNumericFormula', 'makeNumericFormula', 'NumericFormula'],
    content: 'Adds a Coda formula which will return a number in the doc.',
    codeFile: './snippets/formula/numeric_formula.ts',
  },
  {
    triggerTokens: ['addObjectFormula', 'makeObjectFormula', 'ObjectFormula'],
    content: 'Adds a Coda formula which will return an object in the doc.',
    codeFile: './snippets/formula/object_formula.ts',
  },
  {
    triggerTokens: ['addColumnFormat', 'makeColumnFormat', 'ColumnFormat'],
    content: 'Adds a custom column type that you apply to any column in any Coda table.',
    codeFile: './snippets/column_format.ts',
  },
  {
    triggerTokens: ['setUserAuthentication', 'addUserAuthentication', 'UserAuthentication'],
    content: 'Adds a Coda formula which will return an object in the doc.',
    codeFile: './snippets/user_authentication.ts',
  },
  {
    triggerTokens: ['setSystemAuthentication', 'addSystemAuthentication', 'SystemAuthentication'],
    content: 'Adds a Coda formula which will return an object in the doc.',
    codeFile: './snippets/system_authentication.ts',
  },
  {
    triggerTokens: ['addNetworkDomain', 'makeNetworkDomain', 'NetworkDomain'],
    content: 'Allows the pack to make requests to listed domains.',
    codeFile: './snippets/network_domain.ts',
  },
  {
    triggerTokens: ['makeStringParameter', 'addStringParameter', 'StringParameter'],
    content: 'Creates a string parameter.',
    codeFile: './snippets/parameter/string_parameter.ts',
  },
  {
    triggerTokens: ['makeBooleanParameter', 'addBooleanParameter', 'BooleanParameter'],
    content: 'Creates a boolean parameter.',
    codeFile: './snippets/parameter/boolean_parameter.ts',
  },
  {
    triggerTokens: ['makeDateParameter', 'addDateParameter', 'DateParameter'],
    content: 'Creates a date parameter.',
    codeFile: './snippets/parameter/date_parameter.ts',
  },
  {
    triggerTokens: ['makeHtmlParameter', 'addHtmlParameter', 'HtmlParameter'],
    content: 'Creates a html parameter.',
    codeFile: './snippets/parameter/html_parameter.ts',
  },
  {
    triggerTokens: ['makeImageParameter', 'addImageParameter', 'ImageParameter'],
    content: 'Creates a image parameter.',
    codeFile: './snippets/parameter/image_parameter.ts',
  },
  {
    triggerTokens: ['makeNumberParameter', 'addNumberParameter', 'NumberParameter'],
    content: 'Creates a number parameter.',
    codeFile: './snippets/parameter/number_parameter.ts',
  },
  {
    triggerTokens: ['makeStringArrayParameter', 'addStringArrayParameter', 'StringArrayParameter'],
    content: 'Creates a string array parameter.',
    codeFile: './snippets/parameter/array/string_array_parameter.ts',
  },
  {
    triggerTokens: ['makeBooleanArrayParameter', 'addBooleanArrayParameter', 'BooleanArrayParameter'],
    content: 'Creates a boolean array parameter.',
    codeFile: './snippets/parameter/array/boolean_array_parameter.ts',
  },
  {
    triggerTokens: ['makeDateArrayParameter', 'addDateArrayParameter', 'DateArrayParameter'],
    content: 'Creates a date array parameter.',
    codeFile: './snippets/parameter/array/date_array_parameter.ts',
  },
  {
    triggerTokens: ['makeHtmlArrayParameter', 'addHtmlArrayParameter', 'HtmlArrayParameter'],
    content: 'Creates a html array parameter.',
    codeFile: './snippets/parameter/array/html_array_parameter.ts',
  },
  {
    triggerTokens: ['makeImageArrayParameter', 'addImageArrayParameter', 'ImageArrayParameter'],
    content: 'Creates a image array parameter.',
    codeFile: './snippets/parameter/array/image_array_parameter.ts',
  },
  {
    triggerTokens: ['makeNumberArrayParameter', 'addNumberArrayParameter', 'NumberArrayParameter'],
    content: 'Creates a number array parameter.',
    codeFile: './snippets/parameter/array/number_array_parameter.ts',
  },
  {
    triggerTokens: ['addSyncTable', 'addSyncTable', 'SyncTable'],
    content: 'Adds a sync table.',
    codeFile: './snippets/sync_table.ts',
  },
  {
    triggerTokens: ['addDynamicSyncTable', 'makeDynamicSyncTable', 'DynamicSyncTable'],
    content: 'Adds a dynamic sync table.',
    codeFile: './snippets/dynamic_sync_table.ts',
  },
  {
    triggerTokens: ['makeObjectSchema', 'addObjectSchema', 'ObjectSchema'],
    content: 'Creates an object schema definition.',
    codeFile: './snippets/object_schema.ts',
  },
];

export const Examples: Example[] = [
  {
    name: 'Column Formats',
    category: ExampleCategory.Topic,
    triggerTokens: ['addColumnFormat'],
    contentFile: './examples/column-format/column_format.md',
    linkData: {
      type: UrlType.SdkReferencePath,
      url: '/reference/sdk/classes/PackDefinitionBuilder#addColumnFormat',
    },
    exampleSnippets: [
      {
        name: 'Column Format with No Matchers',
        content: 'Basic **Column Format** example without any matchers. ',
        codeFile: './examples/column-format/no_matchers.ts',
      },
    ],
  },
  {
    name: 'Authentication',
    category: ExampleCategory.Topic,
    triggerTokens: ['setSystemAuthentication', 'setUserAuthentication'],
    contentFile: './examples/authentication/authentication.md',
    linkData: {
      type: UrlType.SdkReferencePath,
      url: '/reference/sdk/classes/PackDefinitionBuilder#setSystemAuthentication',
    },
    exampleSnippets: [
      {
        name: 'System Authentication',
        content: '',
        codeFile: './examples/authentication/system_authentication.ts',
      },
      {
        name: 'User Authentication',
        content: '',
        codeFile: './examples/authentication/user_authentication.ts',
      },
    ],
  },
  {
    name: 'Dynamic Sync Tables',
    category: ExampleCategory.Topic,
    triggerTokens: ['addDynamicSyncTable'],
    contentFile: './examples/dynamic-sync-table/dynamic_sync_table.md',
    linkData: {
      type: UrlType.SdkReferencePath,
      url: '/reference/sdk/classes/PackDefinitionBuilder#addDynamicSyncTable',
    },
    exampleSnippets: [
      {
        name: 'Basic Dynamic Sync Table',
        content: '',
        codeFile: './examples/dynamic-sync-table/basic_dynamic_sync_table.ts',
      },
    ],
  },
  {
    name: 'Formulas',
    category: ExampleCategory.Topic,
    triggerTokens: ['addFormula'],
    contentFile: './examples/formula/formula.md',
    linkData: {
      type: UrlType.SdkReferencePath,
      url: '/reference/sdk/classes/PackDefinitionBuilder#addFormula',
    },
    exampleSnippets: [
      {
        name: 'Basic Formula',
        content: '',
        codeFile: './examples/formula/basic_formula.ts',
      },
    ],
  },
  {
    name: 'Sync Tables',
    category: ExampleCategory.Topic,
    triggerTokens: ['addSyncTable'],
    contentFile: './examples/sync-table/sync_table.md',
    linkData: {
      type: UrlType.SdkReferencePath,
      url: '/reference/sdk/classes/PackDefinitionBuilder#addSyncTable',
    },
    exampleSnippets: [
      {
        name: 'Basic Sync Table',
        content: '',
        codeFile: './examples/sync-table/basic_sync_table.ts',
      },
    ],
  },
  {
    name: 'Hello World',
    category: ExampleCategory.Full,
    triggerTokens: [],
    contentFile: './examples/hello_world/hello_world.md',
    linkData: {
      type: UrlType.Web,
      url: 'https://coda.io/@coda/make-a-pack-private-alpha/hello-world-16',
    },
    exampleSnippets: [
      {
        name: 'Hello World',
        content: '',
        codeFile: './examples/hello_world/hello_world.ts',
      },
    ],
  },
  {
    name: 'Daylight',
    category: ExampleCategory.Full,
    triggerTokens: [],
    contentFile: './examples/daylight/daylight.md',
    linkData: {
      type: UrlType.Web,
      url: 'https://coda.io/@coda/make-a-pack-private-alpha/daylight-29',
    },
    exampleSnippets: [
      {
        name: 'Daylight',
        content: '',
        codeFile: './examples/daylight/daylight.ts',
      },
    ],
  },
  {
    name: 'Hello Fetcher',
    category: ExampleCategory.Full,
    triggerTokens: [],
    contentFile: './examples/hello_fetcher/hello_fetcher.md',
    linkData: {
      type: UrlType.Web,
      url: 'https://coda.io/@coda/make-a-pack-private-alpha/hello-fetcher-28',
    },
    exampleSnippets: [
      {
        name: 'Hello Fetcher',
        content: '',
        codeFile: './examples/hello_fetcher/hello_fetcher.ts',
      },
    ],
  },
  {
    name: 'Number Array',
    category: ExampleCategory.Full,
    triggerTokens: [],
    contentFile: './examples/number_array/number_array.md',
    linkData: {
      type: UrlType.Web,
      url: 'https://coda.io/@coda/make-a-pack-private-alpha/number-array-27',
    },
    exampleSnippets: [
      {
        name: 'Number Array',
        content: '',
        codeFile: './examples/number_array/number_array.ts',
      },
    ],
  },
  {
    name: 'Todoist',
    category: ExampleCategory.Full,
    triggerTokens: [],
    contentFile: './examples/todoist/full.md',
    linkData: {
      type: UrlType.SamplePage,
    },
    exampleSnippets: [
      {
        name: 'pack.ts',
        content: '',
        codeFile: './examples/todoist/full.ts',
      },
    ],
  },
];
