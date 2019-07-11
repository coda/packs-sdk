"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const api_types_1 = require("./api_types");
const api_types_2 = require("./api_types");
const api_types_3 = require("./api_types");
const ensure_1 = require("./helpers/ensure");
const handler_templates_1 = require("./handler_templates");
const handler_templates_2 = require("./handler_templates");
const api_types_4 = require("./api_types");
const api_types_5 = require("./api_types");
const schema_1 = require("./schema");
const api_types_6 = require("./api_types");
const api_types_7 = require("./api_types");
class UserVisibleError extends Error {
    constructor(message, internalError) {
        super(message);
        this.internalError = internalError;
        this.isUserVisible = true;
    }
}
exports.UserVisibleError = UserVisibleError;
class StatusCodeError extends Error {
    constructor(statusCode) {
        super(`statusCode: ${statusCode}`);
        this.statusCode = statusCode;
    }
}
exports.StatusCodeError = StatusCodeError;
function isUserVisibleError(error) {
    return 'isUserVisible' in error && error.isUserVisible;
}
exports.isUserVisibleError = isUserVisibleError;
// NOTE[roger] remove once not needed.
exports.PARAM_DESCRIPTION_DOES_NOT_EXIST = 'NO PARAMETER DESCRIPTION HAS BEEN ADDED. For guidance, see https://coda.link/param-docs';
function makeStringParameter(name, description, args = {}) {
    return Object.freeze(Object.assign({}, args, { name, description, type: api_types_1.Type.string }));
}
exports.makeStringParameter = makeStringParameter;
function makeStringArrayParameter(name, description, args = {}) {
    return Object.freeze(Object.assign({}, args, { name, description, type: api_types_7.stringArray }));
}
exports.makeStringArrayParameter = makeStringArrayParameter;
function makeNumericParameter(name, description, args = {}) {
    return Object.freeze(Object.assign({}, args, { name, description, type: api_types_1.Type.number }));
}
exports.makeNumericParameter = makeNumericParameter;
function makeNumericArrayParameter(name, description, args = {}) {
    return Object.freeze(Object.assign({}, args, { name, description, type: api_types_6.numberArray }));
}
exports.makeNumericArrayParameter = makeNumericArrayParameter;
function makeBooleanParameter(name, description, args = {}) {
    return Object.freeze(Object.assign({}, args, { name, description, type: api_types_1.Type.boolean }));
}
exports.makeBooleanParameter = makeBooleanParameter;
function makeBooleanArrayParameter(name, description, args = {}) {
    return Object.freeze(Object.assign({}, args, { name, description, type: api_types_2.booleanArray }));
}
exports.makeBooleanArrayParameter = makeBooleanArrayParameter;
function makeDateParameter(name, description, args = {}) {
    return Object.freeze(Object.assign({}, args, { name, description, type: api_types_1.Type.date }));
}
exports.makeDateParameter = makeDateParameter;
function makeDateArrayParameter(name, description, args = {}) {
    return Object.freeze(Object.assign({}, args, { name, description, type: api_types_3.dateArray }));
}
exports.makeDateArrayParameter = makeDateArrayParameter;
function makeHtmlParameter(name, description, args = {}) {
    return Object.freeze(Object.assign({}, args, { name, description, type: api_types_1.Type.html }));
}
exports.makeHtmlParameter = makeHtmlParameter;
function makeHtmlArrayParameter(name, description, args = {}) {
    return Object.freeze(Object.assign({}, args, { name, description, type: api_types_4.htmlArray }));
}
exports.makeHtmlArrayParameter = makeHtmlArrayParameter;
function makeImageParameter(name, description, args = {}) {
    return Object.freeze(Object.assign({}, args, { name, description, type: api_types_1.Type.html }));
}
exports.makeImageParameter = makeImageParameter;
function makeImageArrayParameter(name, description, args = {}) {
    return Object.freeze(Object.assign({}, args, { name, description, type: api_types_5.imageArray }));
}
exports.makeImageArrayParameter = makeImageArrayParameter;
function makeUserVisibleError(msg) {
    return new UserVisibleError(msg);
}
exports.makeUserVisibleError = makeUserVisibleError;
function check(condition, msg) {
    if (!condition) {
        throw makeUserVisibleError(msg);
    }
}
exports.check = check;
function isObjectPackFormula(fn) {
    return fn.resultType === api_types_1.Type.object;
}
exports.isObjectPackFormula = isObjectPackFormula;
function isStringPackFormula(fn) {
    return fn.resultType === api_types_1.Type.string;
}
exports.isStringPackFormula = isStringPackFormula;
function isSyncPackFormula(fn) {
    return Boolean(fn.isSyncFormula);
}
exports.isSyncPackFormula = isSyncPackFormula;
function makeNumericFormula(definition) {
    return Object.assign({}, definition, { resultType: api_types_1.Type.number });
}
exports.makeNumericFormula = makeNumericFormula;
function makeStringFormula(definition) {
    const { response } = definition;
    return Object.assign({}, definition, Object.assign({ resultType: api_types_1.Type.string }, (response && { schema: response.schema })));
}
exports.makeStringFormula = makeStringFormula;
function makeGetConnectionNameFormula(execute) {
    return makeStringFormula({
        name: 'getConnectionName',
        description: 'Return name for new connection.',
        execute([codaUserName], context) {
            return execute(context, codaUserName);
        },
        parameters: [
            makeStringParameter('codaUserName', 'The username of the Coda account to use.'),
            makeStringParameter('authParams', 'The parameters to use for this connection.'),
        ],
        examples: [],
        network: {
            hasSideEffect: false,
            hasConnection: true,
            requiresConnection: true,
        },
    });
}
exports.makeGetConnectionNameFormula = makeGetConnectionNameFormula;
function makeConnectionMetadataFormula(execute) {
    return makeObjectFormula({
        name: 'getConnectionMetadata',
        description: 'Gets metadata from the connection',
        execute: (params, context) => execute(context, params),
        parameters: [makeStringParameter('search', 'Metadata to search for', { optional: true })],
        examples: [],
        network: {
            hasSideEffect: false,
            hasConnection: true,
            requiresConnection: true,
        },
    });
}
exports.makeConnectionMetadataFormula = makeConnectionMetadataFormula;
function isResponseHandlerTemplate(obj) {
    return obj && obj.schema;
}
function isResponseExampleTemplate(obj) {
    return obj && obj.example;
}
function makeObjectFormula(_a) {
    var { response } = _a, definition = __rest(_a, ["response"]) // tslint:disable-line: trailing-comma
    ;
    let schema;
    if (response) {
        if (isResponseHandlerTemplate(response) && response.schema) {
            response.schema = schema_1.normalizeSchema(response.schema);
            schema = response.schema;
        }
        else if (isResponseExampleTemplate(response)) {
            // TODO(alexd): Figure out what to do with examples.
            // schema = generateSchema(response.example);
        }
    }
    let execute = definition.execute;
    if (isResponseHandlerTemplate(response)) {
        const { onError } = response;
        const wrappedExecute = execute;
        const responseHandler = handler_templates_1.generateObjectResponseHandler(response);
        execute = function exec(params, context) {
            return __awaiter(this, void 0, void 0, function* () {
                let result;
                try {
                    result = yield wrappedExecute(params, context);
                }
                catch (err) {
                    if (onError) {
                        result = onError(err);
                    }
                    else {
                        throw err;
                    }
                }
                return responseHandler({ body: ensure_1.ensureExists(result), status: 200, headers: {} });
            });
        };
    }
    return Object.assign({}, definition, {
        resultType: api_types_1.Type.object,
        execute,
        schema,
    });
}
exports.makeObjectFormula = makeObjectFormula;
function makeSyncTable(name, schema, _a, getSchema) {
    var { schema: formulaSchema, execute: wrappedExecute } = _a, definition = __rest(_a, ["schema", "execute"]);
    formulaSchema = formulaSchema ? schema_1.normalizeSchema(formulaSchema) : undefined;
    const { identity, id, primary } = schema;
    if (!(primary && id && identity)) {
        throw new Error(`Sync table schemas should have defined properties for identity, id and primary`);
    }
    const responseHandler = handler_templates_1.generateObjectResponseHandler({ schema: formulaSchema, excludeExtraneous: true });
    const execute = function exec(params, context, input, runtimeSchema) {
        return __awaiter(this, void 0, void 0, function* () {
            const { result, continuation } = yield wrappedExecute(params, context, input);
            return {
                result: responseHandler({ body: ensure_1.ensureExists(result), status: 200, headers: {} }, runtimeSchema ? JSON.parse(runtimeSchema) : undefined),
                continuation,
            };
        });
    };
    return {
        name,
        schema: schema_1.normalizeSchema(schema),
        getter: Object.assign({}, definition, { cacheTtlSecs: 0, execute, schema: formulaSchema, isSyncFormula: true, resultType: api_types_1.Type.object }),
        getSchema,
    };
}
exports.makeSyncTable = makeSyncTable;
function makeTranslateObjectFormula(_a) {
    var { response } = _a, definition = __rest(_a, ["response"]) // tslint:disable-line: trailing-comma
    ;
    const { request, parameters } = definition;
    response.schema = response.schema ? schema_1.normalizeSchema(response.schema) : undefined;
    const { onError } = response;
    const requestHandler = handler_templates_2.generateRequestHandler(request, parameters);
    const responseHandler = handler_templates_1.generateObjectResponseHandler(response);
    function execute(params, context) {
        return context
            .fetcher.fetch(requestHandler(params))
            .catch(err => {
            if (onError) {
                return onError(err);
            }
            throw err;
        })
            .then(responseHandler);
    }
    return Object.assign({}, definition, {
        execute,
        resultType: api_types_1.Type.object,
        schema: response.schema,
    });
}
exports.makeTranslateObjectFormula = makeTranslateObjectFormula;
function makeEmptyFormula(definition) {
    const { request, parameters } = definition;
    const requestHandler = handler_templates_2.generateRequestHandler(request, parameters);
    function execute(params, context) {
        return context.fetcher.fetch(requestHandler(params)).then(() => '');
    }
    return Object.assign({}, definition, {
        execute,
        resultType: api_types_1.Type.string,
    });
}
exports.makeEmptyFormula = makeEmptyFormula;
