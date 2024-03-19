"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newRealFetcherSyncExecutionContext = exports.newRealFetcherExecutionContext = exports.executeMetadataFormula = exports.executeSyncFormulaFromPackDefSingleIteration = exports.executeSyncFormulaFromPackDef = exports.executeFormulaOrSyncWithRawParams = exports.VMError = exports.executeFormulaOrSyncWithVM = exports.makeFormulaSpec = exports.executeFormulaOrSyncFromCLI = exports.executeFormulaFromPackDef = exports.DEFAULT_MAX_ROWS = void 0;
const types_1 = require("../runtime/types");
const types_2 = require("../runtime/types");
const buffer_1 = require("buffer/");
const coercion_1 = require("./coercion");
const ensure_1 = require("../helpers/ensure");
const ensure_2 = require("../helpers/ensure");
const bootstrap_1 = require("../runtime/bootstrap");
const helpers_1 = require("../runtime/common/helpers");
const helpers_2 = require("../runtime/common/helpers");
const helpers_3 = require("../cli/helpers");
const helpers_4 = require("../cli/helpers");
const ivmHelper = __importStar(require("./ivm_helper"));
const fetcher_1 = require("./fetcher");
const fetcher_2 = require("./fetcher");
const mocks_1 = require("./mocks");
const mocks_2 = require("./mocks");
const path = __importStar(require("path"));
const helpers_5 = require("./helpers");
const helpers_6 = require("./helpers");
const auth_1 = require("./auth");
const auth_2 = require("./auth");
const thunk = __importStar(require("../runtime/thunk/thunk"));
const handler_templates_1 = require("../handler_templates");
const helpers_7 = require("../runtime/common/helpers");
const helpers_8 = require("../runtime/common/helpers");
const util_1 = __importDefault(require("util"));
const validation_1 = require("./validation");
const validation_2 = require("./validation");
const z = __importStar(require("zod"));
const MaxSyncIterations = 100;
exports.DEFAULT_MAX_ROWS = 1000;
function resolveFormulaNameWithNamespace(formulaNameWithNamespace) {
    const [namespace, name] = formulaNameWithNamespace.includes('::')
        ? formulaNameWithNamespace.split('::')
        : ['', formulaNameWithNamespace];
    if (namespace) {
        // eslint-disable-next-line no-console
        console.log(`Warning: formula was invoked with a namespace (${formulaNameWithNamespace}), but namespaces are now deprecated.`);
    }
    return name;
}
async function findAndExecutePackFunction(params, formulaSpec, manifest, executionContext, syncUpdates, getPermissionsRequest, { validateParams: shouldValidateParams = true, validateResult: shouldValidateResult = true, 
// TODO(alexd): Switch this to false or remove when we launch 1.0.0
useDeprecatedResultNormalization = true, } = {}) {
    var _a, _b;
    let formula;
    switch (formulaSpec.type) {
        case types_1.FormulaType.Standard:
            formula = (0, helpers_1.findFormula)(manifest, formulaSpec.formulaName);
            break;
        case types_1.FormulaType.Sync:
        case types_1.FormulaType.SyncUpdate:
        case types_1.FormulaType.GetPermissions:
            formula = (0, helpers_2.findSyncFormula)(manifest, formulaSpec.formulaName);
            break;
    }
    if (shouldValidateParams && formula) {
        (0, validation_1.validateParams)(formula, params);
    }
    let result = await thunk.findAndExecutePackFunction({
        params,
        formulaSpec,
        manifest,
        executionContext,
        shouldWrapError: false,
        updates: syncUpdates,
        getPermissionsRequest,
    });
    if (formulaSpec.type === types_1.FormulaType.SyncUpdate) {
        return result;
    }
    if (formulaSpec.type === types_1.FormulaType.GetPermissions) {
        return result;
    }
    if (useDeprecatedResultNormalization && formula) {
        const resultToNormalize = formulaSpec.type === types_1.FormulaType.Sync ? result.result : result;
        // Matches legacy behavior within handler_templates:generateObjectResponseHandler where we never
        // called transform body on non-object responses.
        if (typeof resultToNormalize === 'object') {
            const schema = (_b = (_a = executionContext === null || executionContext === void 0 ? void 0 : executionContext.sync) === null || _a === void 0 ? void 0 : _a.schema) !== null && _b !== void 0 ? _b : formula.schema;
            const normalizedResult = (0, handler_templates_1.transformBody)(resultToNormalize, schema);
            if (formulaSpec.type === types_1.FormulaType.Sync) {
                result.result = normalizedResult;
            }
            else {
                result = normalizedResult;
            }
        }
    }
    if (shouldValidateResult && formula) {
        const resultToValidate = formulaSpec.type === types_1.FormulaType.Sync ? result.result : result;
        (0, validation_2.validateResult)(formula, resultToValidate);
    }
    return result;
}
async function executeFormulaFromPackDef(packDef, formulaNameWithNamespace, params, context, options, { useRealFetcher, manifestPath } = {}) {
    let executionContext = context;
    if (!executionContext && useRealFetcher) {
        const credentials = getCredentials(manifestPath);
        executionContext = (0, fetcher_1.newFetcherExecutionContext)(buildUpdateCredentialsCallback(manifestPath), (0, helpers_3.getPackAuth)(packDef), packDef.networkDomains, credentials);
    }
    return findAndExecutePackFunction(params, { type: types_1.FormulaType.Standard, formulaName: resolveFormulaNameWithNamespace(formulaNameWithNamespace) }, packDef, executionContext || (0, mocks_1.newMockExecutionContext)(), undefined, undefined, options);
}
exports.executeFormulaFromPackDef = executeFormulaFromPackDef;
async function executeFormulaOrSyncFromCLI({ formulaName, params, manifest, manifestPath, vm, dynamicUrl, maxRows = exports.DEFAULT_MAX_ROWS, bundleSourceMapPath, bundlePath, contextOptions = {}, }) {
    try {
        if (maxRows <= 0) {
            throw new Error('The value of maxRows must be greater than zero.');
        }
        const { useRealFetcher } = contextOptions;
        const credentials = useRealFetcher && manifestPath ? getCredentials(manifestPath) : undefined;
        // A sync context would work for both formula / syncFormula execution for now.
        // TODO(jonathan): Pass the right context, just to set user expectations correctly for runtime values.
        const executionContext = useRealFetcher
            ? (0, fetcher_2.newFetcherSyncExecutionContext)(buildUpdateCredentialsCallback(manifestPath), (0, helpers_3.getPackAuth)(manifest), manifest.networkDomains, credentials)
            : (0, mocks_2.newMockSyncExecutionContext)();
        executionContext.sync.dynamicUrl = dynamicUrl || undefined;
        const formulaSpecification = makeFormulaSpec(manifest, formulaName);
        if (formulaSpecification.type === types_1.FormulaType.Sync) {
            let result = [];
            let iterations = 1;
            do {
                if (iterations > MaxSyncIterations) {
                    throw new Error(`Sync is still running after ${MaxSyncIterations} iterations, this is likely due to an infinite loop.`);
                }
                const response = vm
                    ? await executeFormulaOrSyncWithRawParamsInVM({
                        formulaSpecification,
                        params,
                        bundleSourceMapPath,
                        bundlePath,
                        executionContext,
                    })
                    : await executeFormulaOrSyncWithRawParams({ formulaSpecification, params, manifest, executionContext });
                result.push(...response.result);
                executionContext.sync.continuation = response.continuation;
                iterations++;
            } while (executionContext.sync.continuation && result.length < maxRows);
            if (result.length > maxRows) {
                result = result.slice(0, maxRows);
            }
            (0, helpers_6.printFull)(result);
        }
        else {
            const result = vm
                ? await executeFormulaOrSyncWithRawParamsInVM({
                    formulaSpecification,
                    params,
                    bundleSourceMapPath,
                    bundlePath,
                    executionContext,
                })
                : await executeFormulaOrSyncWithRawParams({ formulaSpecification, params, manifest, executionContext });
            (0, helpers_6.printFull)(result);
        }
    }
    catch (err) {
        (0, helpers_5.print)(err.message || err);
        process.exit(1);
    }
}
exports.executeFormulaOrSyncFromCLI = executeFormulaOrSyncFromCLI;
const SyncMetadataFormulaTokens = Object.freeze({
    [types_2.MetadataFormulaType.SyncListDynamicUrls]: 'listDynamicUrls',
    [types_2.MetadataFormulaType.SyncSearchDynamicUrls]: 'searchDynamicUrls',
    [types_2.MetadataFormulaType.SyncGetDisplayUrl]: 'getDisplayUrl',
    [types_2.MetadataFormulaType.SyncGetTableName]: 'getName',
    [types_2.MetadataFormulaType.SyncGetSchema]: 'getSchema',
});
const GlobalMetadataFormulaTokens = Object.freeze({
    [types_2.MetadataFormulaType.GetConnectionName]: 'getConnectionName',
    [types_2.MetadataFormulaType.GetConnectionUserId]: 'getConnectionUserId',
});
const PostSetupMetadataFormulaTokens = Object.freeze({
    [types_2.MetadataFormulaType.PostSetupSetEndpoint]: 'setEndpoint',
});
function invert(obj) {
    return Object.fromEntries(Object.entries(obj).map(([key, value]) => [value, key]));
}
// Exported for tests.
function makeFormulaSpec(manifest, formulaNameInput) {
    const [formulaOrSyncName, ...parts] = formulaNameInput.split(':');
    if (formulaOrSyncName === 'Auth' && parts.length > 0) {
        if (parts.length === 1) {
            const metadataFormulaTypeStr = parts[0];
            const authFormulaType = invert(GlobalMetadataFormulaTokens)[metadataFormulaTypeStr];
            if (authFormulaType) {
                if (!manifest.defaultAuthentication) {
                    throw new Error(`Pack definition has no user authentication.`);
                }
                return {
                    type: types_1.FormulaType.Metadata,
                    metadataFormulaType: authFormulaType,
                };
            }
        }
        else if (parts.length >= 2 && parts[0] === 'postSetup') {
            const setupStepTypeStr = parts[1];
            const setupStepType = invert(PostSetupMetadataFormulaTokens)[setupStepTypeStr];
            if (!setupStepType) {
                throw new Error(`Unrecognized setup step type "${setupStepTypeStr}".`);
            }
            const stepName = parts[2];
            if (!stepName) {
                throw new Error(`Expected a step name after "${setupStepTypeStr}".`);
            }
            return {
                type: types_1.FormulaType.Metadata,
                metadataFormulaType: setupStepType,
                stepName,
            };
        }
    }
    const syncFormula = (0, helpers_8.tryFindSyncFormula)(manifest, formulaOrSyncName);
    const standardFormula = (0, helpers_7.tryFindFormula)(manifest, formulaOrSyncName);
    if (!(syncFormula || standardFormula)) {
        throw new Error(`Could not find a formula or sync named "${formulaOrSyncName}".`);
    }
    const formula = (0, ensure_1.ensureExists)(syncFormula || standardFormula);
    if (parts.length === 0) {
        return {
            type: syncFormula ? types_1.FormulaType.Sync : types_1.FormulaType.Standard,
            formulaName: formulaOrSyncName,
        };
    }
    if (parts.length === 1) {
        const metadataFormulaTypeStr = parts[0];
        if (metadataFormulaTypeStr === 'update') {
            if (!syncFormula) {
                throw new Error(`Two-way sync formula "${metadataFormulaTypeStr}" is only supported for sync formulas.`);
            }
            return {
                type: types_1.FormulaType.SyncUpdate,
                formulaName: formulaOrSyncName,
            };
        }
        else if (metadataFormulaTypeStr === 'autocomplete') {
            throw new Error(`No parameter name specified for autocomplete metadata formula.`);
        }
        if (metadataFormulaTypeStr === 'permissions') {
            if (!syncFormula) {
                throw new Error(`Permissions formula "${metadataFormulaTypeStr}" is only supported for sync formulas.`);
            }
            return {
                type: types_1.FormulaType.GetPermissions,
                formulaName: formulaOrSyncName,
            };
        }
        const metadataFormulaType = invert(SyncMetadataFormulaTokens)[metadataFormulaTypeStr];
        if (!metadataFormulaType) {
            throw new Error(`Unrecognized metadata formula type "${metadataFormulaTypeStr}".`);
        }
        if (!syncFormula) {
            throw new Error(`Metadata formula "${metadataFormulaTypeStr}" is only supported for sync formulas.`);
        }
        return {
            type: types_1.FormulaType.Metadata,
            metadataFormulaType,
            syncTableName: formulaOrSyncName,
        };
    }
    if (parts.length === 2) {
        if (parts[0] !== 'autocomplete') {
            throw new Error(`Unrecognized formula type "${parts[0]}", expected "autocomplete".`);
        }
        const parameterName = parts[1];
        const paramDef = formula.parameters.find(p => p.name === parameterName);
        if (!paramDef) {
            throw new Error(`Formula "${formulaOrSyncName}" has no parameter named "${parameterName}".`);
        }
        return {
            type: types_1.FormulaType.Metadata,
            metadataFormulaType: types_2.MetadataFormulaType.ParameterAutocomplete,
            parentFormulaName: formulaOrSyncName,
            parentFormulaType: syncFormula ? types_1.FormulaType.Sync : types_1.FormulaType.Standard,
            parameterName,
        };
    }
    throw new Error(`Unrecognized execution command: "${formulaNameInput}".`);
}
exports.makeFormulaSpec = makeFormulaSpec;
// This method is used to execute a (sync) formula in testing with VM. Don't use it in lambda or calc service.
async function executeFormulaOrSyncWithVM({ formulaName, params, bundlePath, executionContext = (0, mocks_2.newMockSyncExecutionContext)(), }) {
    const manifest = await (0, helpers_4.importManifest)(bundlePath);
    const syncFormula = (0, helpers_8.tryFindSyncFormula)(manifest, formulaName);
    const formulaSpecification = {
        type: syncFormula ? types_1.FormulaType.Sync : types_1.FormulaType.Standard,
        formulaName,
    };
    const ivmContext = await ivmHelper.setupIvmContext(bundlePath, executionContext);
    return (0, bootstrap_1.executeThunk)(ivmContext, { params, formulaSpec: formulaSpecification }, bundlePath, bundlePath + '.map');
}
exports.executeFormulaOrSyncWithVM = executeFormulaOrSyncWithVM;
class VMError {
    constructor(name, message, stack) {
        this.name = name;
        this.message = message;
        this.stack = stack;
    }
    [util_1.default.inspect.custom]() {
        return `${this.name}: ${this.message}\n${this.stack}`;
    }
}
exports.VMError = VMError;
async function executeFormulaOrSyncWithRawParamsInVM({ formulaSpecification, params: rawParams, bundlePath, bundleSourceMapPath, executionContext = (0, mocks_2.newMockSyncExecutionContext)(), }) {
    var _a;
    const ivmContext = await ivmHelper.setupIvmContext(bundlePath, executionContext);
    const manifest = await (0, helpers_4.importManifest)(bundlePath);
    let params;
    let syncUpdates;
    let permissionRequest;
    switch (formulaSpecification.type) {
        case types_1.FormulaType.Standard: {
            const formula = (0, helpers_1.findFormula)(manifest, formulaSpecification.formulaName);
            params = (0, coercion_1.coerceParams)(formula, rawParams);
            break;
        }
        case types_1.FormulaType.Sync: {
            const syncFormula = (0, helpers_2.findSyncFormula)(manifest, formulaSpecification.formulaName);
            params = (0, coercion_1.coerceParams)(syncFormula, rawParams);
            break;
        }
        case types_1.FormulaType.Metadata: {
            // Interestingly we don't need special handling for the formula context dict (the optional second arg
            // to an autocomplete metadata formula), because at execution time it gets passed as a serialized
            // JSON string anyway which is already parsed by the compiled pack definition.
            params = rawParams;
            // Default the search string (first arg) to an empty string.
            (_a = params[0]) !== null && _a !== void 0 ? _a : (params[0] = '');
            break;
        }
        case types_1.FormulaType.SyncUpdate: {
            ({ params, syncUpdates } = parseSyncUpdates(manifest, formulaSpecification, rawParams));
            break;
        }
        case types_1.FormulaType.GetPermissions: {
            ({ params, permissionRequest } = parseGetPermissionRequest(manifest, formulaSpecification, rawParams));
            break;
        }
        default:
            (0, ensure_2.ensureUnreachable)(formulaSpecification);
    }
    return (0, bootstrap_1.executeThunk)(ivmContext, { params, formulaSpec: formulaSpecification, updates: syncUpdates, permissionRequest }, bundlePath, bundleSourceMapPath);
}
async function executeFormulaOrSyncWithRawParams({ formulaSpecification, params: rawParams, manifest, executionContext, }) {
    var _a;
    // Use non-native buffer if we're testing this without using isolated-vm, because otherwise
    // we could hit issues like Buffer.isBuffer() returning false if a non-native buffer was created
    // in pack code and we're checking it using native buffers somewhere like node_fetcher.ts
    global.Buffer = buffer_1.Buffer;
    let params;
    let syncUpdates;
    let permissionRequest;
    switch (formulaSpecification.type) {
        case types_1.FormulaType.Standard: {
            const formula = (0, helpers_1.findFormula)(manifest, formulaSpecification.formulaName);
            params = (0, coercion_1.coerceParams)(formula, rawParams);
            break;
        }
        case types_1.FormulaType.Sync: {
            const syncFormula = (0, helpers_2.findSyncFormula)(manifest, formulaSpecification.formulaName);
            params = (0, coercion_1.coerceParams)(syncFormula, rawParams);
            break;
        }
        case types_1.FormulaType.Metadata: {
            // Interestingly we don't need special handling for the formula context dict (the optional second arg
            // to an autocomplete metadata formula), because at execution time it gets passed as a serialized
            // JSON string anyway which is already parsed by the compiled pack definition.
            params = rawParams;
            // Default the search string (first arg) to an empty string.
            (_a = params[0]) !== null && _a !== void 0 ? _a : (params[0] = '');
            break;
        }
        case types_1.FormulaType.SyncUpdate: {
            ({ params, syncUpdates } = parseSyncUpdates(manifest, formulaSpecification, rawParams));
            break;
        }
        case types_1.FormulaType.GetPermissions: {
            ({ params, permissionRequest } = parseGetPermissionRequest(manifest, formulaSpecification, rawParams));
            break;
        }
        default:
            (0, ensure_2.ensureUnreachable)(formulaSpecification);
    }
    return findAndExecutePackFunction(params, formulaSpecification, manifest, executionContext, syncUpdates, permissionRequest);
}
exports.executeFormulaOrSyncWithRawParams = executeFormulaOrSyncWithRawParams;
/**
 * Executes multiple iterations of a sync formula in a loop until there is no longer
 * a `continuation` returned, aggregating each page of results and returning an array
 * with results of all iterations combined and flattened.
 *
 * NOTE: This currently runs all the iterations in a simple loop, which does not
 * adequately simulate the fact that in a real execution environment each iteration
 * will be run in a completely isolated environment, with absolutely no sharing
 * of state or global variables between iterations.
 *
 * For now, use `coda execute --vm` to simulate that level of isolation.
 */
async function executeSyncFormulaFromPackDef(packDef, syncFormulaName, params, context, { validateParams: shouldValidateParams = true, validateResult: shouldValidateResult = true, useDeprecatedResultNormalization = true, } = {}, { useRealFetcher, manifestPath } = {}) {
    const formula = (0, helpers_2.findSyncFormula)(packDef, syncFormulaName);
    if (shouldValidateParams && formula) {
        (0, validation_1.validateParams)(formula, params);
    }
    let executionContext = context;
    if (!executionContext) {
        if (useRealFetcher) {
            const credentials = getCredentials(manifestPath);
            executionContext = (0, fetcher_2.newFetcherSyncExecutionContext)(buildUpdateCredentialsCallback(manifestPath), (0, helpers_3.getPackAuth)(packDef), packDef.networkDomains, credentials);
        }
        else {
            executionContext = (0, mocks_2.newMockSyncExecutionContext)();
        }
    }
    const result = [];
    let iterations = 1;
    do {
        if (iterations > MaxSyncIterations) {
            throw new Error(`Sync is still running after ${MaxSyncIterations} iterations, this is likely due to an infinite loop.`);
        }
        const response = await findAndExecutePackFunction(params, { formulaName: syncFormulaName, type: types_1.FormulaType.Sync }, packDef, executionContext, undefined, undefined, { validateParams: false, validateResult: false, useDeprecatedResultNormalization });
        result.push(...response.result);
        executionContext.sync.continuation = response.continuation;
        iterations++;
    } while (executionContext.sync.continuation);
    if (shouldValidateResult && formula) {
        (0, validation_2.validateResult)(formula, result);
    }
    return result;
}
exports.executeSyncFormulaFromPackDef = executeSyncFormulaFromPackDef;
/**
 * Executes a single sync iteration, and returns the return value from the sync formula
 * including the continuation, for inspection.
 */
async function executeSyncFormulaFromPackDefSingleIteration(packDef, syncFormulaName, params, context, options, { useRealFetcher, manifestPath } = {}) {
    let executionContext = context;
    if (!executionContext && useRealFetcher) {
        const credentials = getCredentials(manifestPath);
        executionContext = (0, fetcher_2.newFetcherSyncExecutionContext)(buildUpdateCredentialsCallback(manifestPath), (0, helpers_3.getPackAuth)(packDef), packDef.networkDomains, credentials);
    }
    return findAndExecutePackFunction(params, { formulaName: syncFormulaName, type: types_1.FormulaType.Sync }, packDef, executionContext || (0, mocks_2.newMockSyncExecutionContext)(), undefined, undefined, options);
}
exports.executeSyncFormulaFromPackDefSingleIteration = executeSyncFormulaFromPackDefSingleIteration;
async function executeMetadataFormula(formula, metadataParams = {}, context = (0, mocks_1.newMockExecutionContext)()) {
    const { search, formulaContext } = metadataParams;
    return formula.execute([search || '', formulaContext ? JSON.stringify(formulaContext) : ''], context);
}
exports.executeMetadataFormula = executeMetadataFormula;
function getCredentials(manifestPath) {
    if (manifestPath) {
        const manifestDir = path.dirname(manifestPath);
        return (0, auth_1.readCredentialsFile)(manifestDir);
    }
}
function buildUpdateCredentialsCallback(manifestPath) {
    return newCredentials => {
        if (manifestPath) {
            (0, auth_2.storeCredential)(path.dirname(manifestPath), newCredentials);
        }
    };
}
function newRealFetcherExecutionContext(packDef, manifestPath) {
    return (0, fetcher_1.newFetcherExecutionContext)(buildUpdateCredentialsCallback(manifestPath), (0, helpers_3.getPackAuth)(packDef), packDef.networkDomains, getCredentials(manifestPath));
}
exports.newRealFetcherExecutionContext = newRealFetcherExecutionContext;
function newRealFetcherSyncExecutionContext(packDef, manifestPath) {
    const context = newRealFetcherExecutionContext(packDef, manifestPath);
    return { ...context, sync: {} };
}
exports.newRealFetcherSyncExecutionContext = newRealFetcherSyncExecutionContext;
const SyncUpdateSchema = z.object({
    previousValue: z.object({}).passthrough(),
    newValue: z.object({}).passthrough(),
    updatedFields: z.array(z.string()),
});
const SyncUpdatesSchema = z.array(SyncUpdateSchema);
function parseSyncUpdates(manifest, formulaSpecification, rawParams) {
    const paramsCopy = [...rawParams];
    const syncUpdatesStr = paramsCopy.pop();
    if (!syncUpdatesStr) {
        throw new Error(`Expected sync updates as last parameter.`);
    }
    const parseResult = SyncUpdatesSchema.safeParse(JSON.parse(syncUpdatesStr));
    if (!parseResult.success) {
        throw new Error(`Invalid sync updates: ${parseResult.error.message}`);
    }
    const syncFormula = (0, helpers_2.findSyncFormula)(manifest, formulaSpecification.formulaName);
    return { syncUpdates: parseResult.data, params: (0, coercion_1.coerceParams)(syncFormula, paramsCopy) };
}
const GetPermissionSchema = z.object({
    rows: z.array(z.object({}).passthrough()),
});
function parseGetPermissionRequest(manifest, formulaSpecification, rawParams) {
    const paramsCopy = [...rawParams];
    const rowsString = paramsCopy.pop();
    if (!rowsString) {
        throw new Error(`Expected rows as last parameter.`);
    }
    const parseResult = GetPermissionSchema.safeParse(JSON.parse(rowsString));
    if (!parseResult.success) {
        throw new Error(`Invalid get permission request: ${parseResult.error.message}`);
    }
    const syncFormula = (0, helpers_2.findSyncFormula)(manifest, formulaSpecification.formulaName);
    return { permissionRequest: parseResult.data, params: (0, coercion_1.coerceParams)(syncFormula, paramsCopy) };
}
