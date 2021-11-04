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
  {
    triggerTokens: ['fetch:get'],
    content: 'Fetches data from an API.',
    codeFile: './snippets/fetcher/get.ts',
  },
  {
    triggerTokens: ['fetch:post'],
    content: 'Send data to an API.',
    codeFile: './snippets/fetcher/post.ts',
  },
];

export const Examples: Example[] = [
  {
    name: 'Column formats',
    category: ExampleCategory.Topic,
    triggerTokens: ['addColumnFormat'],
    contentFile: './examples/column-format/column_format.md',
    linkData: {
      type: UrlType.SdkReferencePath,
      url: '/reference/sdk/classes/PackDefinitionBuilder#addColumnFormat',
    },
    exampleSnippets: [
      {
        name: 'Template',
        content: '',
        codeFile: './snippets/column_format.ts',
      },
      {
        name: 'Text (Reverse)',
        content: '',
        codeFile: './examples/column-format/reverse.ts',
      },
      {
        name: 'Image (Cats)',
        content: '',
        codeFile: './examples/cats/column_format.ts',
      },
      {
        name: 'Rich Data (Todoist)',
        content: '',
        codeFile: './examples/todoist/column_format.ts',
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
        name: 'Template',
        content: '',
        codeFile: './snippets/user_authentication.ts',
      },
      {
        name: 'OAuth2 (Todoist)',
        content: '',
        codeFile: './examples/todoist/auth.ts',
      },
    ],
  },
  {
    name: 'Dynamic sync tables',
    category: ExampleCategory.Topic,
    triggerTokens: ['addDynamicSyncTable'],
    contentFile: './examples/dynamic-sync-table/dynamic_sync_table.md',
    linkData: {
      type: UrlType.SdkReferencePath,
      url: '/reference/sdk/classes/PackDefinitionBuilder#addDynamicSyncTable',
    },
    exampleSnippets: [
      {
        name: 'Template',
        content: '',
        codeFile: './snippets/dynamic_sync_table.ts',
      },
    ],
  },
  {
    name: 'Formulas',
    category: ExampleCategory.Topic,
    triggerTokens: ['addFormula'],
    contentFile: './examples/formula/README.md',
    linkData: {
      type: UrlType.SdkReferencePath,
      url: '/guides/blocks/formulas',
    },
    exampleSnippets: [
      {
        name: 'Template',
        content: 'The basic structure of a formula. This sample takes in a single string parameter and returns a string result.',
        codeFile: './snippets/formula/string_formula.ts',
      },
      {
        name: 'Image result',
        content: 'A formula that returns an image. This sample gets a random cat image with an optional text overlay or filter applied.',
        codeFile: './examples/cats/formula.ts',
      },
      {
        name: 'Rich data result',
        content: 'A formula that returns rich data (a schema). This sample gets information about a task in the Todoist application.',
        codeFile: './examples/todoist/formula.ts',
      },
    ],
  },
  {
    name: 'Parameters',
    category: ExampleCategory.Topic,
    triggerTokens: ['makeParameter'],
    contentFile: './examples/parameter/README.md',
    linkData: {
      type: UrlType.SdkReferencePath,
      url: '/guides/basics/parameters',
    },
    exampleSnippets: [
      {
        name: 'Template',
        content: 'The basic structure of a parameter. This sample is for a string parameter.',
        codeFile: './snippets/parameter/string_parameter.ts',
      },
      {
        name: 'No parameters',
        content: 'A formula without any parameters. This sample return the name of the current day of the week.',
        codeFile: './examples/parameter/weekday.ts',
      },
      {
        name: 'Optional parameters',
        content: 'A formula with some required and some optional parameters. This sample formats text to look like screaming, with a optional parameters to override how many exclamation points to use and an alternate character to use.',
        codeFile: './examples/parameter/scream.ts',
      },
      {
        name: 'Variable argument parameters',
        content: 'A formula that accepts a variable number of arguments. This sample draws a simple diagram using text, with an unknown number of arrow labels and steps.',
        codeFile: './examples/parameter/steps.ts',
      },
    ],
  },
  {
    name: 'Autocomplete',
    category: ExampleCategory.Topic,
    triggerTokens: ['autocomplete'],
    contentFile: './examples/autocomplete/README.md',
    linkData: {
      type: UrlType.SdkReferencePath,
      url: '/guides/advanced/autocomplete',
    },
    exampleSnippets: [
      {
        name: 'Simple autocomplete',
        content: 'A formula with a parameter that provides autocomplete for acceptable values. This sample returns the noise that an animal makes, for a limited set of animals.',
        codeFile: './examples/autocomplete/animal_noise.ts',
      },
      {
        name: 'Dynamic autocomplete',
        content: 'A formula with a parameter that provides autocomplete for acceptable values, where the options are pulled dynamically from an API. This sample returns the price for a board game listed on the site Board Game Atlas.',
        codeFile: './examples/autocomplete/board_game_atlas.ts',
      },
      {
        name: 'Autocomplete on previous parameter',
        content: 'A formula with a parameter that provides autocomplete for acceptable values, where the options depend on the value of a previous parameter. This sample generates a greeting in either English or Spanish.',
        codeFile: './examples/autocomplete/greeting.ts',
      },
    ],
  },
  {
    name: 'Sync tables',
    category: ExampleCategory.Topic,
    triggerTokens: ['addSyncTable'],
    contentFile: './examples/sync-table/sync_table.md',
    linkData: {
      type: UrlType.SdkReferencePath,
      url: '/reference/sdk/classes/PackDefinitionBuilder#addSyncTable',
    },
    exampleSnippets: [
      {
        name: 'Template',
        content: '',
        codeFile: './snippets/sync_table.ts',
      },
      {
        name: 'Cats',
        content: '',
        codeFile: './examples/cats/sync_table.ts',
      },
      {
        name: 'Todoist',
        content: '',
        codeFile: './examples/todoist/sync_table.ts',
      },
    ],
  },
  {
    name: 'Fetcher',
    category: ExampleCategory.Topic,
    triggerTokens: ['fetch'],
    contentFile: './examples/fetcher/README.md',
    linkData: {
      type: UrlType.SdkReferencePath,
      url: '/reference/sdk/interfaces/Fetcher',
    },
    exampleSnippets: [
      {
        name: 'Template (GET)',
        content: '',
        codeFile: './snippets/fetcher/get.ts',
      },
      {
        name: 'Template (POST)',
        content: '',
        codeFile: './snippets/fetcher/post.ts',
      },
      {
        name: 'JSON Array (Bacon Ipsum)',
        content: '',
        codeFile: './examples/fetcher/bacon_ipsum.ts',
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
  {
    name: 'Cats',
    category: ExampleCategory.Full,
    triggerTokens: [],
    contentFile: './examples/cats/README.md',
    linkData: {
      type: UrlType.SamplePage,
    },
    exampleSnippets: [
      {
        name: 'pack.ts',
        content: '',
        codeFile: './examples/cats/full.ts',
      },
    ],
  },
];
