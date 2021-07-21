"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Examples = exports.Snippets = void 0;
const types_1 = require("./types");
exports.Snippets = [
    {
        name: 'String Formula',
        triggerWords: ['StringFormula', 'newFormula', 'addFormula'],
        content: 'Adds a Coda formula which will return a text string in the doc.',
        codeFile: './snippets/formula/string_formula.ts',
    },
    {
        name: 'Array Formula',
        triggerWords: ['ArrayFormula', 'newFormula', 'addFormula'],
        content: 'Adds a Coda formula which will return a text string in the doc.',
        codeFile: './snippets/formula/array_formula.ts',
    },
    {
        name: 'Boolean Formula',
        triggerWords: ['BooleanFormula', 'newFormula', 'addFormula'],
        content: 'Adds a Coda formula which will return true or false in the doc.',
        codeFile: './snippets/formula/boolean_formula.ts',
    },
    {
        name: 'Numeric Formula',
        triggerWords: ['NumericFormula', 'newFormula', 'addFormula'],
        content: 'Adds a Coda formula which will return a number in the doc.',
        codeFile: './snippets/formula/numeric_formula.ts',
    },
    {
        name: 'Object Formula',
        triggerWords: ['ObjectFormula', 'newFormula', 'addFormula'],
        content: 'Adds a Coda formula which will return an object in the doc.',
        codeFile: './snippets/formula/object_formula.ts',
    },
    {
        name: 'Column Format',
        triggerWords: ['ColumnFormat', 'addColumnFormat', 'newColumnFormat'],
        content: 'Adds a custom column type that you apply to any column in any Coda table.',
        codeFile: './snippets/column_format.ts',
    },
    {
        name: 'User Authentication',
        triggerWords: ['UserAuthentication', 'addUserAuthentication', 'newUserAuthentication'],
        content: 'Adds a Coda formula which will return an object in the doc.',
        codeFile: './snippets/user_authentication.ts',
    },
    {
        name: 'System Authentication',
        triggerWords: ['SystemAuthentication', 'addSystemAuthentication', 'newSystemAuthentication'],
        content: 'Adds a Coda formula which will return an object in the doc.',
        codeFile: './snippets/system_authentication.ts',
    },
    {
        name: 'Network Domain',
        triggerWords: ['NetworkDomain', 'addNetworkDomain', 'newNetworkDomain'],
        content: 'Allows the pack to make requests to listed domains.',
        codeFile: './snippets/network_domain.ts',
    },
    {
        name: 'String Parameter',
        triggerWords: ['StringParameter', 'addParameter', 'newParameter'],
        content: 'Creates a string parameter.',
        codeFile: './snippets/parameter/string_parameter.ts',
    },
    {
        name: 'Boolean Parameter',
        triggerWords: ['BooleanParameter', 'addParameter', 'newParameter'],
        content: 'Creates a boolean parameter.',
        codeFile: './snippets/parameter/boolean_parameter.ts',
    },
    {
        name: 'Date Parameter',
        triggerWords: ['DateParameter', 'addParameter', 'newParameter'],
        content: 'Creates a date parameter.',
        codeFile: './snippets/parameter/date_parameter.ts',
    },
    {
        name: 'Html Parameter',
        triggerWords: ['HtmlParameter', 'addParameter', 'newParameter'],
        content: 'Creates a html parameter.',
        codeFile: './snippets/parameter/html_parameter.ts',
    },
    {
        name: 'Image Parameter',
        triggerWords: ['ImageParameter', 'addParameter', 'newParameter'],
        content: 'Creates a image parameter.',
        codeFile: './snippets/parameter/image_parameter.ts',
    },
    {
        name: 'Number Parameter',
        triggerWords: ['NumberParameter', 'addParameter', 'newParameter'],
        content: 'Creates a number parameter.',
        codeFile: './snippets/parameter/number_parameter.ts',
    },
    {
        name: 'String Array Parameter',
        triggerWords: ['StringArrayParameter', 'addArrayParameter', 'newArrayParameter'],
        content: 'Creates a string array parameter.',
        codeFile: './snippets/parameter/array/string_array_parameter.ts',
    },
    {
        name: 'Boolean Array Parameter',
        triggerWords: ['BooleanArrayParameter', 'addArrayParameter', 'newArrayParameter'],
        content: 'Creates a boolean array parameter.',
        codeFile: './snippets/parameter/array/boolean_array_parameter.ts',
    },
    {
        name: 'Date Array Parameter',
        triggerWords: ['DateArrayParameter', 'addArrayParameter', 'newArrayParameter'],
        content: 'Creates a date array parameter.',
        codeFile: './snippets/parameter/array/date_array_parameter.ts',
    },
    {
        name: 'Html Array Parameter',
        triggerWords: ['HtmlArrayParameter', 'addArrayParameter', 'newArrayParameter'],
        content: 'Creates a html array parameter.',
        codeFile: './snippets/parameter/array/html_array_parameter.ts',
    },
    {
        name: 'Image Array Parameter',
        triggerWords: ['ImageArrayParameter', 'addArrayParameter', 'newArrayParameter'],
        content: 'Creates a image array parameter.',
        codeFile: './snippets/parameter/array/image_array_parameter.ts',
    },
    {
        name: 'Number Array Parameter',
        triggerWords: ['NumberArrayParameter', 'addArrayParameter', 'newArrayParameter'],
        content: 'Creates a number array parameter.',
        codeFile: './snippets/parameter/array/number_array_parameter.ts',
    },
    {
        name: 'Sync Table',
        triggerWords: ['SyncTable', 'addSyncTable', 'newSyncTable'],
        content: 'Adds a sync table.',
        codeFile: './snippets/sync_table.ts',
    },
    {
        name: 'Dynamic Sync Table',
        triggerWords: ['DynamicSyncTable', 'addDynamicSyncTable', 'newDynamicSyncTable'],
        content: 'Adds a dynamic sync table.',
        codeFile: './snippets/dynamic_sync_table.ts',
    },
];
exports.Examples = [
    {
        contentFile: './examples/column-format/column_format.md',
        codeFiles: ['./examples/column-format/no_matchers.ts'],
        categories: [types_1.Category.ColumnFormat],
    },
];
