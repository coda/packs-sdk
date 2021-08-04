"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Examples = exports.Snippets = void 0;
const types_1 = require("./types");
exports.Snippets = [
    {
        triggerWords: ['addStringFormula', 'makeStringFormula', 'StringFormula', 'addFormula'],
        content: 'Adds a Coda formula which will return a text string in the doc.',
        codeFile: './snippets/formula/string_formula.ts',
    },
    {
        triggerWords: ['addArrayFormula', 'makeArrayFormula', 'ArrayFormula'],
        content: 'Adds a Coda formula which will return a text string in the doc.',
        codeFile: './snippets/formula/array_formula.ts',
    },
    {
        triggerWords: ['addBooleanFormula', 'makeBooleanFormula', 'BooleanFormula'],
        content: 'Adds a Coda formula which will return true or false in the doc.',
        codeFile: './snippets/formula/boolean_formula.ts',
    },
    {
        triggerWords: ['addNumericFormula', 'makeNumericFormula', 'NumericFormula'],
        content: 'Adds a Coda formula which will return a number in the doc.',
        codeFile: './snippets/formula/numeric_formula.ts',
    },
    {
        triggerWords: ['addObjectFormula', 'makeObjectFormula', 'ObjectFormula'],
        content: 'Adds a Coda formula which will return an object in the doc.',
        codeFile: './snippets/formula/object_formula.ts',
    },
    {
        triggerWords: ['addColumnFormat', 'makeColumnFormat', 'ColumnFormat'],
        content: 'Adds a custom column type that you apply to any column in any Coda table.',
        codeFile: './snippets/column_format.ts',
    },
    {
        triggerWords: ['setUserAuthentication', 'addUserAuthentication', 'UserAuthentication'],
        content: 'Adds a Coda formula which will return an object in the doc.',
        codeFile: './snippets/user_authentication.ts',
    },
    {
        triggerWords: ['setSystemAuthentication', 'addSystemAuthentication', 'SystemAuthentication'],
        content: 'Adds a Coda formula which will return an object in the doc.',
        codeFile: './snippets/system_authentication.ts',
    },
    {
        triggerWords: ['addNetworkDomain', 'makeNetworkDomain', 'NetworkDomain'],
        content: 'Allows the pack to make requests to listed domains.',
        codeFile: './snippets/network_domain.ts',
    },
    {
        triggerWords: ['makeStringParameter', 'addStringParameter', 'StringParameter'],
        content: 'Creates a string parameter.',
        codeFile: './snippets/parameter/string_parameter.ts',
    },
    {
        triggerWords: ['makeBooleanParameter', 'addBooleanParameter', 'BooleanParameter'],
        content: 'Creates a boolean parameter.',
        codeFile: './snippets/parameter/boolean_parameter.ts',
    },
    {
        triggerWords: ['makeDateParameter', 'addDateParameter', 'DateParameter'],
        content: 'Creates a date parameter.',
        codeFile: './snippets/parameter/date_parameter.ts',
    },
    {
        triggerWords: ['makeHtmlParameter', 'addHtmlParameter', 'HtmlParameter'],
        content: 'Creates a html parameter.',
        codeFile: './snippets/parameter/html_parameter.ts',
    },
    {
        triggerWords: ['makeImageParameter', 'addImageParameter', 'ImageParameter'],
        content: 'Creates a image parameter.',
        codeFile: './snippets/parameter/image_parameter.ts',
    },
    {
        triggerWords: ['makeNumberParameter', 'addNumberParameter', 'NumberParameter'],
        content: 'Creates a number parameter.',
        codeFile: './snippets/parameter/number_parameter.ts',
    },
    {
        triggerWords: ['makeStringArrayParameter', 'addStringArrayParameter', 'StringArrayParameter'],
        content: 'Creates a string array parameter.',
        codeFile: './snippets/parameter/array/string_array_parameter.ts',
    },
    {
        triggerWords: ['makeBooleanArrayParameter', 'addBooleanArrayParameter', 'BooleanArrayParameter'],
        content: 'Creates a boolean array parameter.',
        codeFile: './snippets/parameter/array/boolean_array_parameter.ts',
    },
    {
        triggerWords: ['makeDateArrayParameter', 'addDateArrayParameter', 'DateArrayParameter'],
        content: 'Creates a date array parameter.',
        codeFile: './snippets/parameter/array/date_array_parameter.ts',
    },
    {
        triggerWords: ['makeHtmlArrayParameter', 'addHtmlArrayParameter', 'HtmlArrayParameter'],
        content: 'Creates a html array parameter.',
        codeFile: './snippets/parameter/array/html_array_parameter.ts',
    },
    {
        triggerWords: ['makeImageArrayParameter', 'addImageArrayParameter', 'ImageArrayParameter'],
        content: 'Creates a image array parameter.',
        codeFile: './snippets/parameter/array/image_array_parameter.ts',
    },
    {
        triggerWords: ['makeNumberArrayParameter', 'addNumberArrayParameter', 'NumberArrayParameter'],
        content: 'Creates a number array parameter.',
        codeFile: './snippets/parameter/array/number_array_parameter.ts',
    },
    {
        triggerWords: ['addSyncTable', 'addSyncTable', 'SyncTable'],
        content: 'Adds a sync table.',
        codeFile: './snippets/sync_table.ts',
    },
    {
        triggerWords: ['addDynamicSyncTable', 'makeDynamicSyncTable', 'DynamicSyncTable'],
        content: 'Adds a dynamic sync table.',
        codeFile: './snippets/dynamic_sync_table.ts',
    },
];
exports.Examples = [
    {
        contentFile: './examples/column-format/column_format.md',
        codeFiles: ['./examples/column-format/no_matchers.ts'],
        categories: [types_1.Category.ColumnFormat],
        triggerTokens: ['addColumnFormat'],
    },
    {
        contentFile: './examples/authentication/authentication.md',
        codeFiles: [
            './examples/authentication/system_authentication.ts',
            './examples/authentication/user_authentication.ts',
        ],
        categories: [types_1.Category.Authentication],
        triggerTokens: ['setSystemAuthentication', 'setUserAuthentication'],
    },
    {
        contentFile: './examples/dynamic-sync-table/dynamic_sync_table.md',
        codeFiles: ['./examples/dynamic-sync-table/basic_dynamic_sync_table.ts'],
        categories: [types_1.Category.DynamicSyncTable],
        triggerTokens: ['addDynamicSyncTable'],
    },
    {
        contentFile: './examples/formula/formula.md',
        codeFiles: ['./examples/formula/basic_formula.ts'],
        categories: [types_1.Category.Formula],
        triggerTokens: ['addFormula'],
    },
    {
        contentFile: './examples/sync-table/sync_table.md',
        codeFiles: ['./examples/sync-table/basic_sync_table.ts'],
        categories: [types_1.Category.SyncTable],
        triggerTokens: ['addSyncTable'],
    },
];
