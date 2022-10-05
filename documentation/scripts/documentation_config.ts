import type {AutocompleteSnippet} from '../types';
import type {Example} from '../types';
import {ExampleCategory} from '../types';
import {UrlType} from '../types';

export const Snippets: AutocompleteSnippet[] = [
  {
    triggerTokens: ['addFormula:string', 'addStringFormula', 'makeStringFormula', 'StringFormula', 'addFormula'],
    content: 'Adds a Coda formula which will return a text string in the doc.',
    codeFile: './snippets/formula/string_formula.ts',
  },
  {
    triggerTokens: ['addFormula:array', 'addArrayFormula', 'makeArrayFormula', 'ArrayFormula'],
    content: 'Adds a Coda formula which will return a text string in the doc.',
    codeFile: './snippets/formula/array_formula.ts',
  },
  {
    triggerTokens: ['addFormula:boolean', 'addBooleanFormula', 'makeBooleanFormula', 'BooleanFormula'],
    content: 'Adds a Coda formula which will return true or false in the doc.',
    codeFile: './snippets/formula/boolean_formula.ts',
  },
  {
    triggerTokens: ['addFormula:number', 'addNumericFormula', 'makeNumericFormula', 'NumericFormula'],
    content: 'Adds a Coda formula which will return a number in the doc.',
    codeFile: './snippets/formula/numeric_formula.ts',
  },
  {
    triggerTokens: ['addFormula:object', 'addObjectFormula', 'makeObjectFormula', 'ObjectFormula'],
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
    content: 'Sets per-user authentication for the Pack.',
    codeFile: './snippets/authentication/user.ts',
  },
  {
    triggerTokens: ['setUserAuthentication:OAuth2', 'OAuth2Authentication'],
    content: 'Sets per-user OAuth2 authentication for the Pack.',
    codeFile: './snippets/authentication/oauth2.ts',
  },
  {
    triggerTokens: ['setSystemAuthentication', 'addSystemAuthentication', 'SystemAuthentication'],
    content: 'Sets system-wide authentication for the Pack.',
    codeFile: './snippets/authentication/system.ts',
  },
  {
    triggerTokens: ['addNetworkDomain', 'makeNetworkDomain', 'NetworkDomain'],
    content: 'Allows the pack to make requests to listed domains.',
    codeFile: './snippets/network_domain.ts',
  },
  {
    triggerTokens: ['makeParameter:string', 'makeStringParameter', 'addStringParameter', 'StringParameter'],
    content: 'Creates a string parameter.',
    codeFile: './snippets/parameter/string_parameter.ts',
  },
  {
    triggerTokens: ['makeParameter:boolean', 'makeBooleanParameter', 'addBooleanParameter', 'BooleanParameter'],
    content: 'Creates a boolean parameter.',
    codeFile: './snippets/parameter/boolean_parameter.ts',
  },
  {
    triggerTokens: ['makeParameter:date', 'makeDateParameter', 'addDateParameter', 'DateParameter'],
    content: 'Creates a date parameter.',
    codeFile: './snippets/parameter/date_parameter.ts',
  },
  {
    triggerTokens: ['makeParameter:html', 'makeHtmlParameter', 'addHtmlParameter', 'HtmlParameter'],
    content: 'Creates a html parameter.',
    codeFile: './snippets/parameter/html_parameter.ts',
  },
  {
    triggerTokens: ['makeParameter:image', 'makeImageParameter', 'addImageParameter', 'ImageParameter'],
    content: 'Creates an image parameter.',
    codeFile: './snippets/parameter/image_parameter.ts',
  },
  {
    triggerTokens: ['makeParameter:file', 'makeFileParameter', 'addFileParameter', 'FileParameter'],
    content: 'Creates a file parameter.',
    codeFile: './snippets/parameter/file_parameter.ts',
  },
  {
    triggerTokens: ['makeParameter:number', 'makeNumberParameter', 'addNumberParameter', 'NumberParameter'],
    content: 'Creates a number parameter.',
    codeFile: './snippets/parameter/number_parameter.ts',
  },
  {
    triggerTokens: [
      'makeParameter:string[]',
      'makeStringArrayParameter',
      'addStringArrayParameter',
      'StringArrayParameter',
    ],
    content: 'Creates a string array parameter.',
    codeFile: './snippets/parameter/array/string_array_parameter.ts',
  },
  {
    triggerTokens: [
      'makeParameter:boolean[]',
      'makeBooleanArrayParameter',
      'addBooleanArrayParameter',
      'BooleanArrayParameter',
    ],
    content: 'Creates a boolean array parameter.',
    codeFile: './snippets/parameter/array/boolean_array_parameter.ts',
  },
  {
    triggerTokens: ['makeParameter:date[]', 'makeDateArrayParameter', 'addDateArrayParameter', 'DateArrayParameter'],
    content: 'Creates a date array parameter.',
    codeFile: './snippets/parameter/array/date_array_parameter.ts',
  },
  {
    triggerTokens: ['makeParameter:html[]', 'makeHtmlArrayParameter', 'addHtmlArrayParameter', 'HtmlArrayParameter'],
    content: 'Creates a html array parameter.',
    codeFile: './snippets/parameter/array/html_array_parameter.ts',
  },
  {
    triggerTokens: [
      'makeParameter:image[]',
      'makeImageArrayParameter',
      'addImageArrayParameter',
      'ImageArrayParameter',
    ],
    content: 'Creates a image array parameter.',
    codeFile: './snippets/parameter/array/image_array_parameter.ts',
  },
  {
    triggerTokens: [
      'makeParameter:number[]',
      'makeNumberArrayParameter',
      'addNumberArrayParameter',
      'NumberArrayParameter',
    ],
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
    description: 'Samples that show how to create a column format.',
    icon: 'material/table-column',
    category: ExampleCategory.Topic,
    triggerTokens: ['addColumnFormat'],
    contentFile: './examples/column-format/README.md',
    linkData: {
      type: UrlType.SdkReferencePath,
      url: '/guides/blocks/column-formats',
    },
    exampleSnippets: [
      {
        name: 'Template',
        content: 'The basic structure of a column format.',
        codeFile: './snippets/column_format.ts',
      },
      {
        name: 'Text (Reverse)',
        content: 'A column format that formats text. This sample displays the text in the cell in reverse.',
        codeFile: './examples/column-format/reverse.ts',
      },
      {
        name: 'Text (Roman Numeral)',
        content:
          'A column format that formats a number as text. This sample displays the number in the cell as a Roman numeral.',
        codeFile: './examples/column-format/roman_numeral.ts',
      },
      {
        name: 'Text (Progress Bar)',
        content:
          'A column format that formats a number as graphic. This sample displays the number in the cell as a progress bar.',
        codeFile: './examples/column-format/progress_bar.ts',
      },
      {
        name: 'Image (Cats)',
        content:
          'A column format that formats text as an image. This sample displays the text in the cell as an overlay on a random image of a cat.',
        codeFile: './examples/cats/column_format.ts',
      },
      {
        name: 'Rich data (Todoist)',
        content:
          'A column format that formats a URL as rich data. This sample displays the URL of the Todoist task in the cell as a rich data chip.',
        codeFile: './examples/todoist/column_format.ts',
      },
    ],
  },
  {
    name: 'Authentication',
    description: 'Samples that show how to authenticate with an API.',
    icon: 'material/account-key',
    category: ExampleCategory.Topic,
    triggerTokens: ['setSystemAuthentication', 'setUserAuthentication'],
    contentFile: './examples/authentication/README.md',
    linkData: {
      type: UrlType.SdkReferencePath,
      url: '/guides/basics/authentication',
    },
    exampleSnippets: [
      {
        name: 'Template (Per-user)',
        content: 'The basic structure of per-user authentication.',
        codeFile: './snippets/authentication/user.ts',
      },
      {
        name: 'Template (System-wide)',
        content: 'The basic structure of system-wide authentication.',
        codeFile: './snippets/authentication/system.ts',
      },
      {
        name: 'Authorization header',
        content:
          'Authentication that passes a long-lived token in the Authorization header using the "Bearer" scheme. This sample connects to the Todoist API.',
        codeFile: './examples/todoist/auth_bearer.ts',
      },
      {
        name: 'Custom header',
        content: 'Authentication that passes a long-lived token in a custom header. This sample connects to RapidAPI.',
        codeFile: './examples/authentication/rapidapi.ts',
      },
      {
        name: 'Query parameter',
        content:
          'Authentication that passes a long-lived token in a query parameter. This sample connects to the Giphy API.',
        codeFile: './examples/authentication/giphy.ts',
      },
      {
        name: 'Username and password',
        content:
          'Authentication that passes a username and password in the Authorization header using the "Basic" scheme. This sample connects to the Twilio API.',
        codeFile: './examples/authentication/twilio.ts',
      },
      {
        name: 'OAuth2',
        content: 'Authentication that uses an OAuth2 flow. This sample connects to the Todoist API.',
        codeFile: './examples/todoist/auth_oauth2.ts',
      },
      {
        name: 'Manual endpoint',
        content:
          'Authentication that requires users to enter the endpoint URL for their account. This sample connects to the Okta API.',
        codeFile: './examples/authentication/okta.ts',
      },
      {
        name: 'Automatic endpoint',
        content:
          'Authentication that automatically determines the account-specific endpoint URL during the OAuth2 flow. This sample connects to the Salesforce API.',
        codeFile: './examples/authentication/salesforce.ts',
      },
      {
        name: 'User-selected endpoint',
        content:
          'Authentication that presents a list of endpoints to the user for them to select one. This sample connects to the Jira API.',
        codeFile: './examples/authentication/jira.ts',
      },
    ],
  },
  {
    name: 'Dynamic sync tables',
    description: 'Samples that show how to create a dynamic sync table.',
    icon: 'material/cloud-sync-outline',
    category: ExampleCategory.Topic,
    triggerTokens: ['addDynamicSyncTable'],
    contentFile: './examples/dynamic-sync-table/README.md',
    linkData: {
      type: UrlType.SdkReferencePath,
      url: '/guides/blocks/sync-tables/dynamic',
    },
    exampleSnippets: [
      {
        name: 'Template',
        content: '',
        codeFile: './snippets/dynamic_sync_table.ts',
      },
      {
        name: 'With URL list',
        content:
          'A sync table that presents a list of URLs to select from. This sample shows responses to a Typeform form.',
        codeFile: './examples/dynamic-sync-table/typeform.ts',
      },
      {
        name: 'With grouped URL list',
        content:
          'A sync table that presents a list of URLs to select from, grouped into folders. This sample shows data from Open Data NY (data.ny.gov), which is powered by Socrata.',
        codeFile: './examples/dynamic-sync-table/open_data_ny.ts',
      },
    ],
  },
  {
    name: 'Formulas',
    description: 'Samples that show how to create a formula.',
    icon: 'material/function',
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
        content:
          'The basic structure of a formula. This sample takes in a single string parameter and returns a string result.',
        codeFile: './snippets/formula/string_formula.ts',
      },
      {
        name: 'Image result',
        content:
          'A formula that returns an image. This sample gets a random cat image with an optional text overlay or filter applied.',
        codeFile: './examples/cats/formula.ts',
      },
      {
        name: 'Rich data result',
        content:
          'A formula that returns rich data (a schema). This sample gets information about a task in the Todoist application.',
        codeFile: './examples/todoist/formula.ts',
      },
      {
        name: 'With examples',
        content:
          'A formula that includes examples of how to use it. This sample formats text to look like screaming, with a optional parameters to override how many exclamation points to use and an alternate character to use.',
        codeFile: './examples/parameter/scream.ts',
      },
    ],
  },
  {
    name: 'Actions',
    description: 'Samples that show how to create an action formula, for use in a button or automation.',
    icon: 'material/cursor-default-click-outline',
    category: ExampleCategory.Topic,
    triggerTokens: ['isAction'],
    contentFile: './examples/action/README.md',
    linkData: {
      type: UrlType.SdkReferencePath,
      url: '/guides/blocks/actions',
    },
    exampleSnippets: [
      {
        name: 'Template',
        content:
          'The basic structure of an action. This sample takes in a single string parameter and returns the string "OK" when the action is complete.',
        codeFile: './snippets/formula/action_formula.ts',
      },
      {
        name: 'Random value',
        content: 'A formula that returns a random value. This sample rolls virtual dice and returns the results.',
        codeFile: './examples/action/dice.ts',
      },
      {
        name: 'Post to API',
        content: 'A formula that posts data to an external API. This sample creates a new task in the Todoist app.',
        codeFile: './examples/todoist/action.ts',
      },
      {
        name: 'Update row in sync table',
        content:
          'A formula that updates an item on the server, and the existing row in a sync table if it exists. This sample updates the name of a task in the Todoist app.',
        codeFile: './examples/todoist/update.ts',
      },
    ],
  },
  {
    name: 'Parameters',
    description: 'Samples that show how to accept parameters from the user.',
    icon: 'material/format-textbox',
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
        content: 'A formula without any parameters. This sample returns the name of the current day of the week.',
        codeFile: './examples/parameter/weekday.ts',
      },
      {
        name: 'String parameter',
        content: 'A formula that takes plain text as a parameter. This sample returns a greeting to the name provided.',
        codeFile: './examples/hello_world/minimal.ts',
      },
      {
        name: 'Number parameter',
        content:
          'A formula that takes a number as a parameter. This sample converts a number of slices of pizza into a percentage eaten.',
        codeFile: './examples/data-type/pizza_eaten.ts',
      },
      {
        name: 'Date parameter',
        content:
          'A formula that takes a date as a parameter. This sample determines if the year of a given date would make for good New Years Eve glasses (has two or more zeros).',
        codeFile: './examples/dates/nye_glasses.ts',
      },
      {
        name: 'Image parameter',
        content: 'A formula that takes an image as a parameter. This sample returns the file size of an image.',
        codeFile: './examples/image/file_size.ts',
      },
      {
        name: 'Array parameter',
        content:
          'A formula that takes a string array as a parameter. This sample returns the longest string in the list.',
        codeFile: './examples/parameter/longest.ts',
      },
      {
        name: 'Sparse array parameter',
        content:
          'A formula that takes sparse number arrays as a parameter, useful when passing table columns. This sample returns the total cost for an order of items.',
        codeFile: './examples/parameter/total_cost.ts',
      },
      {
        name: 'Optional parameters',
        content:
          'A formula with some required and some optional parameters. This sample formats text to look like screaming, with a optional parameters to override how many exclamation points to use and an alternate character to use.',
        codeFile: './examples/parameter/scream.ts',
      },
      {
        name: 'Parameter suggested value',
        content:
          'A formula with a parameter that defines a suggested value. This sample rolls virtual dice and returns the results.',
        codeFile: './examples/action/dice.ts',
      },
      {
        name: 'Variable argument parameters',
        content:
          'A formula that accepts a variable number of arguments. This sample draws a simple diagram using text, with an unknown number of arrow labels and steps.',
        codeFile: './examples/parameter/steps.ts',
      },
      {
        name: 'Reusing parameters',
        content:
          'A Pack that reuses a parameter across multiple formulas. This sample includes mathematical formulas that operate on a list of numbers.',
        codeFile: './examples/math/math.ts',
      },
    ],
  },
  {
    name: 'Autocomplete',
    description: 'Samples that show how to provide autocomplete options for a parameter.',
    icon: 'material/form-dropdown',
    category: ExampleCategory.Topic,
    triggerTokens: ['autocomplete'],
    contentFile: './examples/autocomplete/README.md',
    linkData: {
      type: UrlType.SdkReferencePath,
      url: '/guides/basics/parameters/autocomplete',
    },
    exampleSnippets: [
      {
        name: 'Simple autocomplete',
        content:
          'A formula with a parameter that provides autocomplete for acceptable values. This sample returns the noise that an animal makes, for a limited set of animals.',
        codeFile: './examples/autocomplete/animal_noise.ts',
      },
      {
        name: 'Dynamic autocomplete',
        content:
          'A formula with a parameter that provides autocomplete for acceptable values, where the options are pulled dynamically from an API. This sample returns the price for a board game listed on the site Board Game Atlas.',
        codeFile: './examples/autocomplete/board_game_atlas.ts',
      },
      {
        name: 'Autocomplete on previous parameter',
        content:
          'A formula with a parameter that provides autocomplete for acceptable values, where the options depend on the value of a previous parameter. This sample generates a greeting in either English or Spanish.',
        codeFile: './examples/autocomplete/greeting.ts',
      },
      {
        name: 'Autocomplete on vararg key-value pairs',
        content:
          'A formula with vararg parameters that represent key-value pairs, which provides autocomplete for available keys and for acceptable values based on the selected key. This sample generates a fictitious ice cream order. Note: This technique will not work when using vararg parameters in the builder UIs.',
        codeFile: './examples/autocomplete/ice_cream.ts',
      },
    ],
  },
  {
    name: 'Sync tables',
    description: 'Samples that show how to create a sync table.',
    icon: 'material/table-sync',
    category: ExampleCategory.Topic,
    triggerTokens: ['addSyncTable'],
    contentFile: './examples/sync-table/README.md',
    linkData: {
      type: UrlType.SdkReferencePath,
      url: '/guides/blocks/sync-tables',
    },
    exampleSnippets: [
      {
        name: 'Template',
        content: 'The basic structure of a sync table.',
        codeFile: './snippets/sync_table.ts',
      },
      {
        name: 'With parameter',
        content: 'A sync table that uses a parameter. This sample syncs cat photos from the CatAAS API.',
        codeFile: './examples/cats/sync_table.ts',
      },
      {
        name: 'With continuation',
        content:
          'A sync table that uses continuations to sync data using multiple executions. This sample syncs the spells available in Dungeons and Dragons.',
        codeFile: './examples/dnd/sync_table.ts',
      },
      {
        name: 'With authentication',
        content:
          "A sync table that pulls from an API using authentication. This sample syncs the tasks from a user's Todoist account.",
        codeFile: './examples/todoist/sync_table.ts',
      },
      {
        name: 'With row references',
        content:
          "A sync table that contains a reference to a row in another sync table. This sample syncs the tasks from a user's Todoist account.",
        codeFile: './examples/todoist/reference.ts',
      },
    ],
  },
  {
    name: 'Fetcher',
    description: 'Samples that show how to fetch data from an external source.',
    icon: 'fontawesome/solid/cloud-arrow-down',
    category: ExampleCategory.Topic,
    triggerTokens: ['fetch'],
    contentFile: './examples/fetcher/README.md',
    linkData: {
      type: UrlType.SdkReferencePath,
      url: '/guides/basics/fetcher',
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
    name: 'Data types',
    description: 'Samples that show how to return values of various data types.',
    icon: 'material/order-alphabetical-ascending',
    category: ExampleCategory.Topic,
    triggerTokens: ['resultType', 'type'],
    contentFile: './examples/data-type/README.md',
    linkData: {
      type: UrlType.SdkReferencePath,
      url: '/guides/basics/data-types',
    },
    exampleSnippets: [
      {
        name: 'Template (String)',
        content: 'The basic structure of a formula that returns a string.',
        codeFile: './snippets/formula/string_formula.ts',
      },
      {
        name: 'Template (Number)',
        content: 'The basic structure of a formula that returns a number.',
        codeFile: './snippets/formula/numeric_formula.ts',
      },
      {
        name: 'Template (Boolean)',
        content: 'The basic structure of a formula that returns a boolean.',
        codeFile: './snippets/formula/boolean_formula.ts',
      },
      {
        name: 'Template (Array)',
        content: 'The basic structure of a formula that returns an array.',
        codeFile: './snippets/formula/array_formula.ts',
      },
      {
        name: 'Template (Object)',
        content: 'The basic structure of a formula that returns an object.',
        codeFile: './snippets/formula/object_formula.ts',
      },
      {
        name: 'Percent',
        content:
          'A formula that returns a number formatted as a percent value. This sample converts a number of slices of pizza into a percentage eaten.',
        codeFile: './examples/data-type/pizza_eaten.ts',
      },
      {
        name: 'Currency',
        content:
          'A formula that returns a number formatted as a currency value. This sample converts from another currency to US dollars.',
        codeFile: './examples/data-type/to_usd.ts',
      },
      {
        name: 'Date and time',
        content:
          'A formula that returns a date and time, passed as a string. This sample adds five minutes onto the given date and time.',
        codeFile: './examples/dates/five_mins_late.ts',
      },
      {
        name: 'Markdown',
        content:
          'A formula that returns markdown content. This sample returns the contents of the README.md file from a GitHub repository.',
        codeFile: './examples/data-type/readme.ts',
      },
      {
        name: 'HTML',
        content:
          'A formula that returns HTML content. This sample returns HTML with every word of the input string bolded.',
        codeFile: './examples/data-type/alt_bold.ts',
      },
      {
        name: 'Embed',
        content:
          'A formula that a URL to embed. This sample returns an embed of the infamous YouTube video for "Never Gonna Give You Up" by Rick Astley.',
        codeFile: './examples/data-type/rick_roll.ts',
      },
      {
        name: 'Image',
        content: 'A formula that returns an image, as a reference. This sample returns a random photo of a cat.',
        codeFile: './examples/cats/formula.ts',
      },
    ],
  },
  {
    name: 'Schemas',
    description: 'Samples that show how to define a schema, to represent rich objects.',
    icon: 'material/format-list-group',
    category: ExampleCategory.Topic,
    triggerTokens: ['makeSchema', 'makeObjectSchema'],
    contentFile: './examples/schema/README.md',
    linkData: {
      type: UrlType.SdkReferencePath,
      url: '/guides/advanced/schemas',
    },
    exampleSnippets: [
      {
        name: 'Template (Object Schema)',
        content: 'The basic structure of an object schema.',
        codeFile: './snippets/object_schema.ts',
      },
      {
        name: 'For formula',
        content:
          'An object schema used by a formula. This sample defines the schema for information about the daylight at a given location.',
        codeFile: './examples/daylight/schema.ts',
      },
      {
        name: 'For sync table',
        content:
          'An object schema used by a sync table. This sample defines the schema for the information about a spell in Dungeons and Dragons.',
        codeFile: './examples/dnd/schema.ts',
      },
      {
        name: 'With self-reference',
        content:
          'An object schema used by a sync table, that includes a row reference to itself. This sample defines the schema for a task in Todoist, where tasks can have parent tasks.',
        codeFile: './examples/todoist/schema.ts',
      },
    ],
  },
  {
    name: 'Dates and times',
    description: 'Samples that show how to work with dates and times.',
    icon: 'material/calendar-clock',
    category: ExampleCategory.Topic,
    triggerTokens: ['Date', 'Time', 'DateTime'],
    contentFile: './examples/dates/README.md',
    linkData: {
      type: UrlType.SdkReferencePath,
      url: '/guides/advanced/timezones',
    },
    exampleSnippets: [
      {
        name: 'Local date',
        content:
          "A formula that requires getting a date in the document's timezone. This sample determines if the year of a given date would make for good New Years Eve glasses (has two or more zeros).",
        codeFile: './examples/dates/nye_glasses.ts',
      },
      {
        name: 'Local time',
        content:
          'A formula that requires getting a time in the document\'s timezone. This sample shows a time using the military format (ex: "0900 hours").',
        codeFile: './examples/dates/military_time.ts',
      },
      {
        name: 'Local date and time',
        content:
          "A formula that requires getting a date and time in the document's timezone. This sample determines if all of the digits are the same (ex: 1/1/11 1:11).",
        codeFile: './examples/dates/same_digit.ts',
      },
      {
        name: 'Send to API',
        content:
          'A formula that requires sending a date to an API. This sample use the Calendarific API to get the holidays on a given date.',
        codeFile: './examples/dates/holidays.ts',
      },
      {
        name: 'Time math',
        content: 'A formula that computes a relative time. This sample adds five minutes onto an input date and time.',
        codeFile: './examples/dates/five_mins_late.ts',
      },
    ],
  },
  {
    name: 'Images',
    description: 'Samples that show how to work with images.',
    icon: 'material/image',
    category: ExampleCategory.Topic,
    triggerTokens: ['ImageReference', 'ImageAttachment', 'Image', 'ImageArray'],
    contentFile: './examples/image/README.md',
    linkData: {
      type: UrlType.SdkReferencePath,
      url: '/guides/advanced/images',
    },
    exampleSnippets: [
      {
        name: 'Image parameter',
        content: 'A formula that takes an image as a parameter. This sample returns the file size of an image.',
        codeFile: './examples/image/file_size.ts',
      },
      {
        name: 'Image result',
        content: 'A formula that return an external image. This sample returns a random photo of a cat.',
        codeFile: './examples/cats/formula.ts',
      },
      {
        name: 'Image result from temporary URL',
        content:
          'A formula that returns an image uploaded to `temporaryBlobStorage`. This sample returns a random avatar using an API that returns SVG code used to generate an avatar. You could also imagine procedurally generating a SVG or image in your packs code and uploading it to `temporaryBlobStorage`.',
        codeFile: './examples/image/boring_avatar.ts',
      },
      {
        name: 'Upload images',
        content:
          'An action that downloads images from Coda and uploads them to another service. This sample uploads a list of files to Google Photos.',
        codeFile: './examples/image/google_photos.ts',
      },
      {
        name: 'Attach image data',
        content:
          'A sync table that includes images sourced from raw data. This sample syncs files from Dropbox, including their thumbnail images.',
        codeFile: './examples/image/dropbox.ts',
      },
      {
        name: 'Attach private images',
        content:
          'A sync table that includes images sourced from private URLs. This sample syncs files from Google Drive, including their thumbnail images.',
        codeFile: './examples/image/google_drive.ts',
      },
      {
        name: 'Generated SVG',
        content:
          'A formula that generated an SVG, and returns it as a data URI. This sample generates an image from the text provided.',
        codeFile: './examples/image/text_to_image.ts',
      },
      {
        name: 'Dark mode SVG',
        content:
          'A formula that generates an SVG that adapts if dark mode is enabled. This sample generates an image with static text, which changes color when dark mode is enabled.',
        codeFile: './examples/image/hello_dark_mode.ts',
      },
    ],
  },
  {
    name: 'API setup',
    description: 'Samples that show how to configure a Pack to connect to various popular APIs.',
    icon: 'material/api',
    category: ExampleCategory.Topic,
    triggerTokens: [],
    contentFile: './examples/apis/README.md',
    linkData: {
      type: UrlType.SamplePage,
    },
    exampleSnippets: [
      {
        name: 'Asana',
        content: 'The Asana API uses OAuth2 to authenticate users, and requires the use of PKCE.',
        codeFile: './examples/apis/asana.ts',
      },
      {
        name: 'Board Game Atlas',
        content: 'The Board Game Atlas API requires the developer to provide their client ID as query parameter.',
        codeFile: './examples/apis/board_game_atlas.ts',
      },
      {
        name: 'ClickUp',
        content: 'The ClickUp API uses OAuth2 to authenticate users.',
        codeFile: './examples/apis/clickup.ts',
      },
      {
        name: 'Dropbox',
        content: 'The Dropbox API uses OAuth2 to authenticate users, prompting them to approve a specific set of scopes. Additional parameters are requires on the authorization URL to ensure that offline access is granted.',
        codeFile: './examples/apis/dropbox.ts',
      },
      {
        name: 'Facebook (Meta)',
        content: 'The Facebook (Meta) APIs use OAuth2 to authenticate users, prompting them to approve a specific set of scopes.',
        codeFile: './examples/apis/facebook.ts',
      },
      {
        name: 'Giphy',
        content: 'The Giphy API requires the developer to provide their API key as query parameter.',
        codeFile: './examples/authentication/giphy.ts',
      },
      {
        name: 'GitHub',
        content: 'The GitHub API uses OAuth2 to authenticate users, prompting them to approve a specific set of scopes. The authorization header uses the non-standard prefix "token" instead of the default "Bearer".',
        codeFile: './examples/github/auth.ts',
      },
      {
        name: 'Google',
        content: 'The Google APIs use OAuth2 to authenticate users, prompting them to approve a specific set of scopes. Additional parameters are requires on the authorization URL to ensure that offline access is granted. Note: It currently isn\'t possible to complete Google\'s OAuth verification process with a Pack. See the [FAQ](https://coda.io/packs/build/latest/guides/faq/#google) for more information.',
        codeFile: './examples/apis/google.ts',
      },
      {
        name: 'Jira',
        content: 'The Jira API uses OAuth2 to authenticate users. After authenticating users must select which Jira instance to associate the account with, and all further API requests are sent to that instance\'s URL.',
        codeFile: './examples/authentication/jira.ts',
      },
      {
        name: 'Microsoft',
        content: 'The Microsoft APIs use OAuth2 to authenticate users, prompting them to approve a specific set of scopes. Additional parameters are requires on the authorization URL to ensure that offline access is granted, and PKCE is recommended.',
        codeFile: './examples/apis/microsoft.ts',
      },
      {
        name: 'Okta',
        content: 'The Okta API requires the user to provide an API key, passed as an Authorization header with a custom prefix. The user must also specify which Okta domain to connect to.',
        codeFile: './examples/authentication/okta.ts',
      },
      {
        name: 'Rapid API',
        content: 'Rapid APIs require that the developer provide an API key, passed in a custom header.',
        codeFile: './examples/authentication/rapidapi.ts',
      },
      {
        name: 'Salesforce',
        content: 'The Salesforce API uses OAuth2 to authenticate users, prompting them to approve a specific set of scopes. Additional parameters are requires on the authorization URL to ensure that offline access is granted. The URL to send API requests is returned in the OAuth2 response, and passed to other formulas.',
        codeFile: './examples/authentication/salesforce.ts',
      },
      {
        name: 'Todoist',
        content: 'The Todoist API uses OAuth2 to authenticate users, prompting them to approve a specific set of scopes.',
        codeFile: './examples/todoist/auth_oauth2.ts',
      },
      {
        name: 'Typeform',
        content: 'The Typeform API uses OAuth2 to authenticate users, prompting them to approve a specific set of scopes.',
        codeFile: './examples/apis/typeform.ts',
      },
      {
        name: 'Twilio',
        content: 'The Twilio API requires the user to provide the SID and token for their account, passed using the Web Basic scheme.',
        codeFile: './examples/authentication/twilio.ts',
      },
      {
        name: 'Webflow',
        content: 'The Typeform API uses OAuth2 to authenticate users, and requires the developer to specify the API version in a custom header.',
        codeFile: './examples/apis/webflow.ts',
      },
      {
        name: 'Yahoo',
        content: 'The Yahoo APIs uses OAuth2 to authenticate users.',
        codeFile: './examples/apis/yahoo.ts',
      },
    ],
  },
  {
    name: 'Hello World',
    description: 'A simple "Hello World" Pack.',
    icon: 'material/hand-wave-outline',
    category: ExampleCategory.Full,
    triggerTokens: [],
    contentFile: './examples/hello_world/README.md',
    linkData: {
      type: UrlType.SamplePage,
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
    description: 'A Pack that fetches data about the expected hours of daylight at a location.',
    icon: 'fontawesome/regular/sun',
    category: ExampleCategory.Full,
    triggerTokens: [],
    contentFile: './examples/daylight/README.md',
    linkData: {
      type: UrlType.SamplePage,
    },
    exampleSnippets: [
      {
        name: 'pack.ts',
        content: '',
        codeFile: './examples/daylight/daylight.ts',
      },
    ],
  },
  {
    name: 'Math',
    description: 'A Pack that provides various math operations.',
    icon: 'material/calculator-variant',
    category: ExampleCategory.Full,
    triggerTokens: [],
    contentFile: './examples/math/README.md',
    linkData: {
      type: UrlType.SamplePage,
    },
    exampleSnippets: [
      {
        name: 'pack.ts',
        content: '',
        codeFile: './examples/math/math.ts',
      },
    ],
  },
  {
    name: 'Todoist',
    description: 'A Pack that integrates with the application Todoist.',
    icon: 'octicons/tasklist-16',
    category: ExampleCategory.Full,
    triggerTokens: [],
    contentFile: './examples/todoist/README.md',
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
    description: 'A Pack that generates images of cats.',
    icon: 'fontawesome/solid/cat',
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
  {
    name: 'Dungeons & Dragons',
    description: 'A Pack that uses an API to retrieve information about the game Dungeons & Dragons.',
    icon: 'fontawesome/solid/dragon',
    category: ExampleCategory.Full,
    triggerTokens: [],
    contentFile: './examples/dnd/README.md',
    linkData: {
      type: UrlType.SamplePage,
    },
    exampleSnippets: [
      {
        name: 'pack.ts',
        content: '',
        codeFile: './examples/dnd/full.ts',
      },
    ],
  },
  {
    name: 'GitHub',
    description: 'A Pack that integrates with GitHub.',
    icon: 'fontawesome/brands/github',
    category: ExampleCategory.Full,
    triggerTokens: [],
    contentFile: './examples/github/README.md',
    linkData: {
      type: UrlType.SamplePage,
    },
    exampleSnippets: [
      {
        name: 'pack.ts',
        content: '',
        codeFile: './examples/github/full.ts',
      },
    ],
  },
];
