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
Object.defineProperty(exports, "__esModule", { value: true });
exports.newRealFetcherSyncExecutionContext = exports.newRealFetcherExecutionContext = exports.executeMetadataFormula = exports.executeUpdateFormulaFromPackDef = exports.executeGetPermissionsFormulaFromPackDef = exports.executeSyncFormulaFromPackDefSingleIteration = exports.executeSyncFormulaFromPackDef = exports.executeSyncFormula = exports.executeFormulaOrSyncWithRawParams = exports.executeFormulaOrSyncWithVM = exports.makeFormulaSpec = exports.executeFormulaOrSyncFromCLI = exports.executeFormulaFromPackDef = exports.DEFAULT_MAX_ROWS = void 0;
const types_1 = require("./types");
const types_2 = require("./types");
const types_3 = require("../runtime/types");
const types_4 = require("../runtime/types");
const buffer_1 = require("buffer/");
const helpers_1 = require("./helpers");
const coercion_1 = require("./coercion");
const ensure_1 = require("../helpers/ensure");
const ensure_2 = require("../helpers/ensure");
const bootstrap_1 = require("../runtime/bootstrap");
const helpers_2 = require("../runtime/common/helpers");
const helpers_3 = require("../runtime/common/helpers");
const helpers_4 = require("../cli/helpers");
const helpers_5 = require("../cli/helpers");
const ivmHelper = __importStar(require("./ivm_helper"));
const fetcher_1 = require("./fetcher");
const fetcher_2 = require("./fetcher");
const mocks_1 = require("./mocks");
const mocks_2 = require("./mocks");
const path = __importStar(require("path"));
const helpers_6 = require("./helpers");
const helpers_7 = require("./helpers");
const auth_1 = require("./auth");
const auth_2 = require("./auth");
const thunk = __importStar(require("../runtime/thunk/thunk"));
const handler_templates_1 = require("../handler_templates");
const helpers_8 = require("../runtime/common/helpers");
const helpers_9 = require("../runtime/common/helpers");
const handler_templates_2 = require("../handler_templates");
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
        case types_3.FormulaType.Standard:
            formula = (0, helpers_2.findFormula)(manifest, formulaSpec.formulaName, executionContext.authenticationName);
            break;
        case types_3.FormulaType.Sync:
        case types_3.FormulaType.SyncUpdate:
        case types_3.FormulaType.GetPermissions:
            formula = (0, helpers_3.findSyncFormula)(manifest, formulaSpec.formulaName, executionContext.authenticationName);
            break;
    }
    if (shouldValidateParams && formula) {
        (0, validation_1.validateParams)(formula, params);
    }
    let result;
    try {
        result = await thunk.findAndExecutePackFunction({
            params,
            formulaSpec,
            manifest,
            executionContext,
            shouldWrapError: false,
            updates: syncUpdates,
            getPermissionsRequest,
        });
    }
    catch (err) {
        throw new DeveloperError(err);
    }
    if (formulaSpec.type === types_3.FormulaType.SyncUpdate) {
        return result;
    }
    if (formulaSpec.type === types_3.FormulaType.GetPermissions) {
        return result;
    }
    if (formula) {
        const resultToNormalize = formulaSpec.type === types_3.FormulaType.Sync ? result.result : result;
        let resultToValidate = resultToNormalize;
        // Matches legacy behavior within handler_templates:generateObjectResponseHandler where we never
        // called transform body on non-object responses.
        if (typeof resultToNormalize === 'object') {
            const schema = (_b = (_a = executionContext === null || executionContext === void 0 ? void 0 : executionContext.sync) === null || _a === void 0 ? void 0 : _a.schema) !== null && _b !== void 0 ? _b : formula.schema;
            let normalizedResult = (0, handler_templates_1.transformBody)(resultToNormalize, schema);
            resultToValidate = normalizedResult;
            if (!useDeprecatedResultNormalization) {
                normalizedResult = (0, handler_templates_2.untransformBody)(normalizedResult, schema);
            }
            if (formulaSpec.type === types_3.FormulaType.Sync) {
                result.result = normalizedResult;
            }
            else {
                result = normalizedResult;
            }
        }
        if (shouldValidateResult) {
            (0, validation_2.validateResult)(formula, resultToValidate);
        }
    }
    return result;
}
async function executeFormulaFromPackDef(packDef, formulaNameWithNamespace, params, context, options, { useRealFetcher, manifestPath } = {}) {
    let executionContext = context;
    if (!executionContext && useRealFetcher) {
        const credentials = getCredentials(manifestPath);
        executionContext = (0, fetcher_1.newFetcherExecutionContext)(buildUpdateCredentialsCallback(manifestPath), (0, helpers_4.getPackAuth)(packDef), packDef.networkDomains, credentials);
    }
    return findAndExecutePackFunction(params, { type: types_3.FormulaType.Standard, formulaName: resolveFormulaNameWithNamespace(formulaNameWithNamespace) }, packDef, executionContext || (0, mocks_1.newMockExecutionContext)(), undefined, undefined, options);
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
            ? (0, fetcher_2.newFetcherSyncExecutionContext)(buildUpdateCredentialsCallback(manifestPath), (0, helpers_4.getPackAuth)(manifest), manifest.networkDomains, credentials)
            : (0, mocks_2.newMockSyncExecutionContext)();
        executionContext.sync.dynamicUrl = dynamicUrl || undefined;
        const { formulaSpecification, chainedCommand } = getFormulaSpecAndChainedCommand(manifest, formulaName);
        if (formulaSpecification.type === types_3.FormulaType.Sync) {
            const result = await executeSyncFormulaWithOptionalChaining({
                formulaSpecification,
                chainedCommand,
                params,
                manifest,
                executionContext,
                vm,
                bundleSourceMapPath,
                bundlePath,
                maxRows,
            });
            (0, helpers_7.printFull)(result);
        }
        else if (formulaSpecification.type === types_3.FormulaType.GetPermissions) {
            const result = await executeGetPermissionsFormulaWithContinuations({
                formulaSpecification,
                params,
                manifest,
                executionContext,
                vm,
                bundleSourceMapPath,
                bundlePath,
            });
            (0, helpers_7.printFull)(result);
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
            (0, helpers_7.printFull)(result);
        }
    }
    catch (err) {
        if (err instanceof DeveloperError) {
            // The error came from the Pack code. Print the inner error, including the stack trace.
            (0, helpers_6.print)(err.cause);
            // If source maps are not enabled, print a warning.
            if (!vm && !isSourceMapsEnabled()) {
                (0, helpers_6.print)(`
Enable the Node flag --enable-source-maps to get an accurate stack trace. For example:
NODE_OPTIONS="--enable-source-maps" npx coda execute ...`);
            }
        }
        else {
            // Just print the error message.
            (0, helpers_6.print)(err.message);
        }
        process.exit(1);
    }
}
exports.executeFormulaOrSyncFromCLI = executeFormulaOrSyncFromCLI;
const SyncMetadataFormulaTokens = Object.freeze({
    [types_4.MetadataFormulaType.SyncListDynamicUrls]: 'listDynamicUrls',
    [types_4.MetadataFormulaType.SyncSearchDynamicUrls]: 'searchDynamicUrls',
    [types_4.MetadataFormulaType.SyncGetDisplayUrl]: 'getDisplayUrl',
    [types_4.MetadataFormulaType.SyncGetTableName]: 'getName',
    [types_4.MetadataFormulaType.SyncGetSchema]: 'getSchema',
});
const GlobalMetadataFormulaTokens = Object.freeze({
    [types_4.MetadataFormulaType.GetConnectionName]: 'getConnectionName',
    [types_4.MetadataFormulaType.GetConnectionUserId]: 'getConnectionUserId',
});
const PostSetupMetadataFormulaTokens = Object.freeze({
    [types_4.MetadataFormulaType.PostSetupSetEndpoint]: 'setEndpoint',
});
function invert(obj) {
    return Object.fromEntries(Object.entries(obj).map(([key, value]) => [value, key]));
}
/**
 * Given a formula name with a > delimited chained command, returns the formula specification and the chained command.
 *
 * Chained commands can either be:
 * - interleaved (runs in the same loop as continuations)
 * - subsequent (runs in the completion loop, after the first completion is returned)
 *
 * We will only return at most a single command across these two types
 *
 * @param manifest The manifest of the pack.
 * @param formulaNameInput The formula name with a chained command.
 * @returns The formula specification and the chained command.
 */
function getFormulaSpecAndChainedCommand(manifest, formulaNameInput) {
    const chainedCommands = formulaNameInput.split('>');
    const formulaSpecification = makeFormulaSpec(manifest, chainedCommands[0]);
    if (chainedCommands[0].includes(':incremental')) {
        // TODO(zack): Allow direct calling of incremental sync while providing a completion via CLI
        throw new Error('Direct calling of incremental sync is not supported. Use the > syntax instead.');
    }
    if (chainedCommands.length === 1) {
        return { formulaSpecification };
    }
    if (formulaSpecification.type !== types_3.FormulaType.Sync) {
        throw new Error(`Chained commands are only supported for sync formulas. Received: ${formulaSpecification.type}`);
    }
    const chainedCommandFormulaSpecification = makeFormulaSpec(manifest, [formulaSpecification.formulaName, chainedCommands[1]].join(':'));
    if (!chainedCommandFormulaSpecification) {
        throw new Error(`Could not find a formula or sync named "${chainedCommands[1]}".`);
    }
    switch (chainedCommandFormulaSpecification.type) {
        case types_3.FormulaType.GetPermissions:
            return {
                formulaSpecification,
                chainedCommand: {
                    type: types_2.ChainedCommandType.Interleaved,
                    formulaSpec: chainedCommandFormulaSpecification,
                    commandType: types_1.ChainableCommandType.GetPermissions,
                },
            };
        case types_3.FormulaType.Sync:
            return {
                formulaSpecification,
                chainedCommand: {
                    type: types_2.ChainedCommandType.Subsequent,
                    formulaSpec: chainedCommandFormulaSpecification,
                    commandType: types_1.ChainableCommandType.IncrementalSync,
                },
            };
        default:
            throw new Error(`Chained commands are only supported for GetPermissions and Sync formulas. Received: ${chainedCommandFormulaSpecification.type}`);
    }
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
                    type: types_3.FormulaType.Metadata,
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
                type: types_3.FormulaType.Metadata,
                metadataFormulaType: setupStepType,
                stepName,
            };
        }
    }
    const syncFormula = (0, helpers_9.tryFindSyncFormula)(manifest, formulaOrSyncName);
    const standardFormula = (0, helpers_8.tryFindFormula)(manifest, formulaOrSyncName);
    if (!(syncFormula || standardFormula)) {
        throw new Error(`Could not find a formula or sync named "${formulaOrSyncName}".`);
    }
    const formula = (0, ensure_1.ensureExists)(syncFormula || standardFormula);
    if (parts.length === 0) {
        return {
            type: syncFormula ? types_3.FormulaType.Sync : types_3.FormulaType.Standard,
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
                type: types_3.FormulaType.SyncUpdate,
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
                type: types_3.FormulaType.GetPermissions,
                formulaName: formulaOrSyncName,
            };
        }
        if (metadataFormulaTypeStr === 'incremental') {
            if (!syncFormula) {
                throw new Error(`Incremental sync formula "${metadataFormulaTypeStr}" is only supported for sync formulas.`);
            }
            return {
                type: types_3.FormulaType.Sync,
                formulaName: formulaOrSyncName,
            };
        }
        if (metadataFormulaTypeStr === 'validateParameters') {
            return {
                type: types_3.FormulaType.Metadata,
                metadataFormulaType: types_4.MetadataFormulaType.ValidateParameters,
                parentFormulaName: formulaOrSyncName,
                parentFormulaType: syncFormula ? types_3.FormulaType.Sync : types_3.FormulaType.Standard,
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
            type: types_3.FormulaType.Metadata,
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
            type: types_3.FormulaType.Metadata,
            metadataFormulaType: types_4.MetadataFormulaType.ParameterAutocomplete,
            parentFormulaName: formulaOrSyncName,
            parentFormulaType: syncFormula ? types_3.FormulaType.Sync : types_3.FormulaType.Standard,
            parameterName,
        };
    }
    throw new Error(`Unrecognized execution command: "${formulaNameInput}".`);
}
exports.makeFormulaSpec = makeFormulaSpec;
// This method is used to execute a (sync) formula in testing with VM. Don't use it in lambda or calc service.
async function executeFormulaOrSyncWithVM({ formulaName, params, bundlePath, executionContext = (0, mocks_2.newMockSyncExecutionContext)(), }) {
    const manifest = await (0, helpers_5.importManifest)(bundlePath);
    const syncFormula = (0, helpers_9.tryFindSyncFormula)(manifest, formulaName);
    const formulaSpecification = {
        type: syncFormula ? types_3.FormulaType.Sync : types_3.FormulaType.Standard,
        formulaName,
    };
    const ivmContext = await ivmHelper.setupIvmContext(bundlePath, executionContext);
    try {
        return (await (0, bootstrap_1.executeThunk)(ivmContext, { params, formulaSpec: formulaSpecification }, bundlePath, bundlePath + '.map'));
    }
    catch (err) {
        throw new DeveloperError(err);
    }
}
exports.executeFormulaOrSyncWithVM = executeFormulaOrSyncWithVM;
async function executeFormulaOrSyncWithRawParamsInVM({ formulaSpecification, params: rawParams, bundlePath, bundleSourceMapPath, executionContext = (0, mocks_2.newMockSyncExecutionContext)(), }) {
    var _a;
    const ivmContext = await ivmHelper.setupIvmContext(bundlePath, executionContext);
    const manifest = await (0, helpers_5.importManifest)(bundlePath);
    let params;
    let syncUpdates;
    let permissionRequest;
    switch (formulaSpecification.type) {
        case types_3.FormulaType.Standard: {
            const formula = (0, helpers_2.findFormula)(manifest, formulaSpecification.formulaName, executionContext.authenticationName);
            params = (0, coercion_1.coerceParams)(formula, rawParams);
            break;
        }
        case types_3.FormulaType.Sync: {
            const syncFormula = (0, helpers_3.findSyncFormula)(manifest, formulaSpecification.formulaName, executionContext.authenticationName);
            params = (0, coercion_1.coerceParams)(syncFormula, rawParams);
            break;
        }
        case types_3.FormulaType.Metadata: {
            // Interestingly we don't need special handling for the formula context dict (the optional second arg
            // to an autocomplete metadata formula), because at execution time it gets passed as a serialized
            // JSON string anyway which is already parsed by the compiled pack definition.
            params = rawParams;
            // Default the search string (first arg) to an empty string.
            (_a = params[0]) !== null && _a !== void 0 ? _a : (params[0] = '');
            break;
        }
        case types_3.FormulaType.SyncUpdate: {
            ({ params, syncUpdates } = parseSyncUpdates(manifest, formulaSpecification, rawParams));
            break;
        }
        case types_3.FormulaType.GetPermissions: {
            ({ params, permissionRequest } = parseGetPermissionRequest(manifest, formulaSpecification, rawParams));
            break;
        }
        default:
            (0, ensure_2.ensureUnreachable)(formulaSpecification);
    }
    try {
        return (await (0, bootstrap_1.executeThunk)(ivmContext, { params, formulaSpec: formulaSpecification, updates: syncUpdates, permissionRequest }, bundlePath, bundleSourceMapPath));
    }
    catch (err) {
        throw new DeveloperError(err);
    }
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
        case types_3.FormulaType.Standard: {
            const formula = (0, helpers_2.findFormula)(manifest, formulaSpecification.formulaName, executionContext.authenticationName);
            params = (0, coercion_1.coerceParams)(formula, rawParams);
            break;
        }
        case types_3.FormulaType.Sync: {
            const syncFormula = (0, helpers_3.findSyncFormula)(manifest, formulaSpecification.formulaName, executionContext.authenticationName);
            params = (0, coercion_1.coerceParams)(syncFormula, rawParams);
            break;
        }
        case types_3.FormulaType.Metadata: {
            // Interestingly we don't need special handling for the formula context dict (the optional second arg
            // to an autocomplete metadata formula), because at execution time it gets passed as a serialized
            // JSON string anyway which is already parsed by the compiled pack definition.
            params = rawParams;
            // Default the search string (first arg) to an empty string.
            (_a = params[0]) !== null && _a !== void 0 ? _a : (params[0] = '');
            break;
        }
        case types_3.FormulaType.SyncUpdate: {
            ({ params, syncUpdates } = parseSyncUpdates(manifest, formulaSpecification, rawParams));
            break;
        }
        case types_3.FormulaType.GetPermissions: {
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
async function executeSyncFormula(packDef, syncFormulaName, params, context, { validateParams: shouldValidateParams = true, validateResult: shouldValidateResult = true, useDeprecatedResultNormalization = true, } = {}, { useRealFetcher, manifestPath } = {}) {
    const formula = (0, helpers_3.findSyncFormula)(packDef, syncFormulaName, context === null || context === void 0 ? void 0 : context.authenticationName);
    if (shouldValidateParams && formula) {
        (0, validation_1.validateParams)(formula, params);
    }
    let executionContext = context;
    if (!executionContext) {
        if (useRealFetcher) {
            const credentials = getCredentials(manifestPath);
            executionContext = (0, fetcher_2.newFetcherSyncExecutionContext)(buildUpdateCredentialsCallback(manifestPath), (0, helpers_4.getPackAuth)(packDef), packDef.networkDomains, credentials);
        }
        else {
            executionContext = (0, mocks_2.newMockSyncExecutionContext)();
        }
    }
    const result = [];
    const permissionsContext = [];
    const deletedRowIds = [];
    let iterations = 1;
    do {
        if (iterations > MaxSyncIterations) {
            throw new Error(`Sync is still running after ${MaxSyncIterations} iterations, this is likely due to an infinite loop.`);
        }
        const response = await findAndExecutePackFunction(params, { formulaName: syncFormulaName, type: types_3.FormulaType.Sync }, packDef, executionContext, undefined, undefined, { validateParams: false, validateResult: false, useDeprecatedResultNormalization });
        result.push(...response.result);
        if (response.permissionsContext) {
            permissionsContext.push(...response.permissionsContext);
        }
        if (response.deletedRowIds) {
            deletedRowIds.push(...response.deletedRowIds);
        }
        executionContext.sync.continuation = response.continuation;
        iterations++;
    } while (executionContext.sync.continuation);
    if (shouldValidateResult && formula) {
        (0, validation_2.validateResult)(formula, result);
    }
    return {
        result,
        deletedRowIds,
        permissionsContext,
    };
}
exports.executeSyncFormula = executeSyncFormula;
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
 * @deprecated Use {@link executeSyncFormula} instead.
 */
async function executeSyncFormulaFromPackDef(packDef, syncFormulaName, params, context, { validateParams: shouldValidateParams = true, validateResult: shouldValidateResult = true, useDeprecatedResultNormalization = true, } = {}, { useRealFetcher, manifestPath } = {}) {
    return Promise.resolve((await executeSyncFormula(packDef, syncFormulaName, params, context, {
        validateParams: shouldValidateParams,
        validateResult: shouldValidateResult,
        useDeprecatedResultNormalization,
    }, { useRealFetcher, manifestPath })).result);
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
        executionContext = (0, fetcher_2.newFetcherSyncExecutionContext)(buildUpdateCredentialsCallback(manifestPath), (0, helpers_4.getPackAuth)(packDef), packDef.networkDomains, credentials);
    }
    return findAndExecutePackFunction(params, { formulaName: syncFormulaName, type: types_3.FormulaType.Sync }, packDef, executionContext || (0, mocks_2.newMockSyncExecutionContext)(), undefined, undefined, options);
}
exports.executeSyncFormulaFromPackDefSingleIteration = executeSyncFormulaFromPackDefSingleIteration;
/**
 * Executes an executeGetPermissions request and returns the result.
 *
 * @hidden
 */
async function executeGetPermissionsFormulaFromPackDef(packDef, syncFormulaName, params, executeGetPermissionsRequest, context, options, { useRealFetcher, manifestPath } = {}) {
    let executionContext = context;
    if (!executionContext && useRealFetcher) {
        const credentials = getCredentials(manifestPath);
        executionContext = (0, fetcher_2.newFetcherSyncExecutionContext)(buildUpdateCredentialsCallback(manifestPath), (0, helpers_4.getPackAuth)(packDef), packDef.networkDomains, credentials);
    }
    return findAndExecutePackFunction(params, { formulaName: syncFormulaName, type: types_3.FormulaType.GetPermissions }, packDef, executionContext || (0, mocks_2.newMockSyncExecutionContext)(), undefined, executeGetPermissionsRequest, options);
}
exports.executeGetPermissionsFormulaFromPackDef = executeGetPermissionsFormulaFromPackDef;
/**
 * Executes an executeUpdate request for an update sync formula, and returns the result.
 *
 * @hidden
 */
async function executeUpdateFormulaFromPackDef(packDef, syncFormulaName, params, context, syncUpdates, options, { useRealFetcher, manifestPath } = {}) {
    let executionContext = context;
    if (!executionContext && useRealFetcher) {
        const credentials = getCredentials(manifestPath);
        executionContext = (0, fetcher_2.newFetcherSyncExecutionContext)(buildUpdateCredentialsCallback(manifestPath), (0, helpers_4.getPackAuth)(packDef), packDef.networkDomains, credentials);
    }
    return findAndExecutePackFunction(params, { formulaName: syncFormulaName, type: types_3.FormulaType.SyncUpdate }, packDef, context, syncUpdates, undefined, options);
}
exports.executeUpdateFormulaFromPackDef = executeUpdateFormulaFromPackDef;
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
    return (0, fetcher_1.newFetcherExecutionContext)(buildUpdateCredentialsCallback(manifestPath), (0, helpers_4.getPackAuth)(packDef), packDef.networkDomains, getCredentials(manifestPath));
}
exports.newRealFetcherExecutionContext = newRealFetcherExecutionContext;
function newRealFetcherSyncExecutionContext(packDef, manifestPath) {
    return (0, fetcher_2.newFetcherSyncExecutionContext)(buildUpdateCredentialsCallback(manifestPath), (0, helpers_4.getPackAuth)(packDef), packDef.networkDomains, getCredentials(manifestPath));
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
    const syncFormula = (0, helpers_3.findSyncFormula)(manifest, formulaSpecification.formulaName, undefined, {
        verifyFormulaForAuthenticationName: false,
    });
    return { syncUpdates: parseResult.data, params: (0, coercion_1.coerceParams)(syncFormula, paramsCopy) };
}
const GetPermissionSchema = z.object({
    rows: z.array(z.object({ row: z.object({}).passthrough() })),
    permissionsContext: z.array(z.object({}).passthrough()).optional(),
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
    const syncFormula = (0, helpers_3.findSyncFormula)(manifest, formulaSpecification.formulaName, undefined, {
        verifyFormulaForAuthenticationName: false,
    });
    return { permissionRequest: parseResult.data, params: (0, coercion_1.coerceParams)(syncFormula, paramsCopy) };
}
function isSourceMapsEnabled() {
    var _a, _b;
    const flags = [...process.execArgv, ...((_b = (_a = process.env.NODE_OPTIONS) === null || _a === void 0 ? void 0 : _a.split(/\s+/)) !== null && _b !== void 0 ? _b : [])];
    return flags.includes('--enable-source-maps');
}
class DeveloperError extends Error {
    constructor(err) {
        super('The Pack code threw an error: ' + err.message, {
            cause: err,
        });
        this.stack = err.stack;
        Object.setPrototypeOf(this, DeveloperError.prototype);
    }
}
/**
 * Executes a sync formula with optional chaining.
 *
 * @param formulaSpecification The formula specification we want to run, should be a Sync formula
 * @param chainedCommand The chained command to run after the formula specification.
 * @param params The params to pass to the formula
 * @param manifest The manifest of the pack
 * @param executionContext The execution context
 * @param vm Whether to run in a VM
 * @param bundleSourceMapPath The source map path
 * @param bundlePath The bundle path
 * @param maxRows The max rows to sync
 * @returns Returns either the sync result (if there is no chaining), the interleaved chained command results,
 *   or the result from the subsequent chained command.
 */
async function executeSyncFormulaWithOptionalChaining({ formulaSpecification, chainedCommand, params, manifest, executionContext, vm, bundleSourceMapPath, bundlePath, maxRows = exports.DEFAULT_MAX_ROWS, }) {
    if (formulaSpecification.type !== types_3.FormulaType.Sync) {
        throw new Error(`Expected a Sync formula, received: ${formulaSpecification.type}`);
    }
    const { result, chainedCommandResults, completion } = await executeSyncFormulaWithContinuations({
        formulaSpecification,
        chainedCommand: (chainedCommand === null || chainedCommand === void 0 ? void 0 : chainedCommand.type) === types_2.ChainedCommandType.Interleaved ? chainedCommand : undefined,
        params,
        manifest,
        executionContext,
        vm,
        bundleSourceMapPath,
        bundlePath,
        maxRows,
    });
    if (!chainedCommand) {
        return result;
    }
    if (chainedCommand.type === types_2.ChainedCommandType.Interleaved) {
        return chainedCommandResults;
    }
    switch (chainedCommand.commandType) {
        case types_1.ChainableCommandType.IncrementalSync:
            const { result: resultFromIncrementalSync } = await executeSyncFormulaWithContinuations({
                formulaSpecification: chainedCommand.formulaSpec,
                params,
                manifest,
                executionContext: completion
                    ? { ...executionContext, sync: { ...executionContext.sync, previousCompletion: completion } }
                    : executionContext,
                vm,
                bundleSourceMapPath,
                bundlePath,
                maxRows,
            });
            return resultFromIncrementalSync;
        default:
            (0, ensure_2.ensureUnreachable)(chainedCommand);
    }
}
/**
 * This function handles running a sync formula with continuations, looping until
 * we no longer have a continuation or we pass the maxRows limit.
 *
 * @param formulaSpecification The formula specification we want to run, should be a Sync formula
 * @param chainedCommand The chained command to run after the formula specification.
 * @param params The params to pass to the formula
 * @param manifest The manifest of the pack
 * @param executionContext The execution context
 * @param bundleSourceMapPath The source map path
 * @param bundlePath The bundle path
 * @param maxRows The max rows to sync
 * @param vm Whether to run in a VM
 * @param contextOptions The context options.
 * @returns Returns an object with the sync result, chained command results, and completion if they exist
 */
async function executeSyncFormulaWithContinuations({ formulaSpecification, chainedCommand, params, manifest, executionContext, bundleSourceMapPath, bundlePath, maxRows = exports.DEFAULT_MAX_ROWS, vm, }) {
    let result = [];
    const chainedCommandResults = [];
    let iterations = 1;
    let completion;
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
        if (response.permissionsContext && response.permissionsContext.length !== response.result.length) {
            throw new Error(`Got ${response.result.length} results but only ${response.permissionsContext.length} passthrough items (on page ${iterations})`);
        }
        // We may go over the maxRows limit within a single iteration, so make sure to only pass as many
        // as will actually fit into the result array through to the chained command.
        const resultSlice = response.result.slice(0, maxRows - result.length);
        result.push(...resultSlice);
        if (chainedCommand) {
            chainedCommandResults.push(...(await chainCommandOnSyncResult({
                rows: resultSlice,
                formulaSpecification,
                chainedCommand,
                params,
                manifest,
                executionContext,
                vm,
                bundleSourceMapPath,
                bundlePath,
            })));
        }
        executionContext.sync.continuation = response.continuation;
        // If we happen to have both a completion and a continuation, we ignore the completion
        if (response.completion && !response.continuation) {
            completion = response.completion;
            break;
        }
        iterations++;
    } while (executionContext.sync.continuation && result.length < maxRows);
    if (result.length > maxRows) {
        result = result.slice(0, maxRows);
    }
    return { result, chainedCommandResults, completion };
}
/**
 * Executes a get permissions formula with continuations, looping until
 * we no longer have a continuation.
 *
 * Note, there is no maxRows limit here. Limiting is expected to be handled on the actual
 * set of item rows, on the assumption that we can use that to roughly control how
 * many rowAccessDefinitions we will get back.
 *
 * @param formulaSpecification The formula specification we want to run, should be a GetPermissions formula
 * @param params The params to pass to the formula
 * @param manifest The manifest of the pack
 * @param executionContext The execution context *of the sync loop*. We clone this for the getPermissions loop
 *   to avoid polluting the continuation on the sync loop.
 * @param vm Whether to run in a VM
 * @returns Returns an object with the row access definitions
 */
async function executeGetPermissionsFormulaWithContinuations({ formulaSpecification, params, manifest, executionContext: itemsExecutionContext, bundleSourceMapPath, bundlePath, vm, }) {
    const result = [];
    let iterations = 1;
    // We need to make a copy of the execution context so we don't pollute the continuation on the Sync formula
    // if we are running inside of an actual Sync continuation loop.
    const executionContextCopy = {
        ...itemsExecutionContext,
        sync: { ...itemsExecutionContext.sync, continuation: undefined },
    };
    do {
        if (iterations > MaxSyncIterations) {
            throw new Error(`GetPermissions is still running after ${MaxSyncIterations} iterations, this is likely due to an infinite loop.`);
        }
        const response = vm
            ? await executeFormulaOrSyncWithRawParamsInVM({
                formulaSpecification,
                params,
                bundleSourceMapPath,
                bundlePath,
                executionContext: executionContextCopy,
            })
            : await executeFormulaOrSyncWithRawParams({
                formulaSpecification,
                params,
                manifest,
                executionContext: executionContextCopy,
            });
        result.push(...response.rowAccessDefinitions);
        executionContextCopy.sync.continuation = response.continuation;
        iterations++;
    } while (executionContextCopy.sync.continuation);
    return { rowAccessDefinitions: result };
}
/**
 * This function handles running a chained command formula for a given set of rows.
 *
 * @param rows The rows to run the chained command on
 * @param formulaSpecification The Sync formula specification that is driving the rows we want to run
 *    the chained command on.
 * @param chainedCommand The chained command to run after the formula specification.
 * @param params The params to pass to the formula
 * @param manifest The manifest of the pack
 * @param executionContext The execution context
 * @param vm Whether to run in a VM
 * @param bundleSourceMapPath The source map path
 * @param bundlePath The bundle path
 * @returns Returns the result from the chained command
 */
async function chainCommandOnSyncResult({ rows, formulaSpecification, chainedCommand, params, manifest, executionContext, vm, bundleSourceMapPath, bundlePath, }) {
    var _a;
    if (!chainedCommand) {
        return [];
    }
    // Denormalize the sync result before passing back into chained command
    const formula = (0, helpers_3.findSyncFormula)(manifest, formulaSpecification.formulaName, executionContext.authenticationName);
    const schema = (_a = executionContext.sync.schema) !== null && _a !== void 0 ? _a : formula === null || formula === void 0 ? void 0 : formula.schema;
    const denormalizedSyncResult = vm ? rows : (0, handler_templates_2.untransformBody)(rows, schema);
    switch (chainedCommand.formulaSpec.type) {
        case types_3.FormulaType.GetPermissions:
            const mappedRows = denormalizedSyncResult.map((row) => ({ row }));
            // 10 hardcoded as fallback to match process_csb_ingestion.ts
            const maxPermissionBatchSize = (formula === null || formula === void 0 ? void 0 : formula.maxPermissionBatchSize) || 10;
            const chunks = (0, helpers_1.chunkArray)(mappedRows, maxPermissionBatchSize);
            const chunkResponses = [];
            for (const chunk of chunks) {
                const getPermissionsParams = [...params, JSON.stringify({ rows: chunk })];
                const result = await executeGetPermissionsFormulaWithContinuations({
                    formulaSpecification: chainedCommand.formulaSpec,
                    params: getPermissionsParams,
                    manifest,
                    executionContext,
                    vm,
                    bundleSourceMapPath,
                    bundlePath,
                });
                chunkResponses.push(...result.rowAccessDefinitions);
            }
            return chunkResponses.flat();
        default:
            (0, ensure_2.ensureUnreachable)(chainedCommand.formulaSpec.type);
    }
}
