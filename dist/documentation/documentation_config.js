"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Examples = exports.Snippets = void 0;
exports.Snippets = [
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
exports.Examples = [
    {
        name: 'addColumnFormat()',
        triggerTokens: ['addColumnFormat'],
        contentFile: './examples/column-format/column_format.md',
        sdkReferencePath: '/classes/PackDefinitionBuilder.html#addColumnFormat',
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
        triggerTokens: ['setSystemAuthentication', 'setUserAuthentication'],
        contentFile: './examples/authentication/authentication.md',
        sdkReferencePath: '/classes/PackDefinitionBuilder.html#setSystemAuthentication',
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
        name: 'addDynmaicSyncTable()',
        triggerTokens: ['addDynamicSyncTable'],
        contentFile: './examples/dynamic-sync-table/dynamic_sync_table.md',
        sdkReferencePath: '/classes/PackDefinitionBuilder.html#addDynamicSyncTable',
        exampleSnippets: [
            {
                name: 'Basic Dynamic Sync Table',
                content: '',
                codeFile: './examples/dynamic-sync-table/basic_dynamic_sync_table.ts',
            },
        ],
    },
    {
        name: 'addFormula()',
        triggerTokens: ['addFormula'],
        contentFile: './examples/formula/formula.md',
        sdkReferencePath: '/classes/PackDefinitionBuilder.html#addFormula',
        exampleSnippets: [
            {
                name: 'Basic Formula',
                content: '',
                codeFile: './examples/formula/basic_formula.ts',
            },
        ],
    },
    {
        name: 'addSyncTable()',
        triggerTokens: ['addSyncTable'],
        contentFile: './examples/sync-table/sync_table.md',
        sdkReferencePath: '/classes/PackDefinitionBuilder.html#addSyncTable',
        exampleSnippets: [
            {
                name: 'Basic Sync Table',
                content: '',
                codeFile: './examples/sync-table/basic_sync_table.ts',
            },
        ],
    },
];
