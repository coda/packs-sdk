"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
exports.executeMetadataFormula = exports.executeSyncFormulaFromPackDefSingleIteration = exports.executeSyncFormulaFromPackDef = exports.executeFormulaOrSyncWithRawParams = exports.VMError = exports.executeFormulaOrSyncWithVM = exports.executeFormulaOrSyncFromCLI = exports.executeFormulaFromPackDef = void 0;
const types_1 = require("../runtime/types");
const coercion_1 = require("./coercion");
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
const auth_1 = require("./auth");
const auth_2 = require("./auth");
const thunk = __importStar(require("../runtime/thunk/thunk"));
const helpers_6 = require("../runtime/common/helpers");
const util_1 = __importDefault(require("util"));
const validation_1 = require("./validation");
const validation_2 = require("./validation");
const MaxSyncIterations = 100;
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
async function findAndExecutePackFunction(params, formulaSpec, manifest, executionContext, { validateParams: shouldValidateParams = true, validateResult: shouldValidateResult = true } = {}) {
    let formula;
    switch (formulaSpec.type) {
        case types_1.FormulaType.Standard:
            formula = helpers_1.findFormula(manifest, formulaSpec.formulaName);
            break;
        case types_1.FormulaType.Sync:
            formula = helpers_2.findSyncFormula(manifest, formulaSpec.formulaName);
            break;
    }
    if (shouldValidateParams && formula) {
        validation_1.validateParams(formula, params);
    }
    const result = await thunk.findAndExecutePackFunction(params, formulaSpec, manifest, executionContext, false);
    if (shouldValidateResult && formula) {
        const resultToValidate = formulaSpec.type === types_1.FormulaType.Sync ? result.result : result;
        validation_2.validateResult(formula, resultToValidate);
    }
    return result;
}
async function executeFormulaFromPackDef(packDef, formulaNameWithNamespace, params, context, options, { useRealFetcher, manifestPath } = {}) {
    let executionContext = context;
    if (!executionContext && useRealFetcher) {
        const credentials = getCredentials(manifestPath);
        executionContext = fetcher_1.newFetcherExecutionContext(buildUpdateCredentialsCallback(manifestPath), helpers_3.getPackAuth(packDef), packDef.networkDomains, credentials);
    }
    return findAndExecutePackFunction(params, { type: types_1.FormulaType.Standard, formulaName: resolveFormulaNameWithNamespace(formulaNameWithNamespace) }, packDef, executionContext || mocks_1.newMockExecutionContext(), options);
}
exports.executeFormulaFromPackDef = executeFormulaFromPackDef;
async function executeFormulaOrSyncFromCLI({ formulaName, params, manifest, manifestPath, vm, dynamicUrl, bundleSourceMapPath, bundlePath, contextOptions = {}, }) {
    try {
        const { useRealFetcher } = contextOptions;
        const credentials = useRealFetcher && manifestPath ? getCredentials(manifestPath) : undefined;
        // A sync context would work for both formula / syncFormula execution for now.
        // TODO(jonathan): Pass the right context, just to set user expectations correctly for runtime values.
        const executionContext = useRealFetcher
            ? fetcher_2.newFetcherSyncExecutionContext(buildUpdateCredentialsCallback(manifestPath), helpers_3.getPackAuth(manifest), manifest.networkDomains, credentials)
            : mocks_2.newMockSyncExecutionContext();
        executionContext.sync.dynamicUrl = dynamicUrl || undefined;
        const syncFormula = helpers_6.tryFindSyncFormula(manifest, formulaName);
        const formulaSpecification = {
            type: syncFormula ? types_1.FormulaType.Sync : types_1.FormulaType.Standard,
            formulaName,
        };
        if (formulaSpecification.type === types_1.FormulaType.Sync) {
            const result = [];
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
            } while (executionContext.sync.continuation);
            helpers_5.print(result);
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
            helpers_5.print(result);
        }
    }
    catch (err) {
        helpers_5.print(err);
        process.exit(1);
    }
}
exports.executeFormulaOrSyncFromCLI = executeFormulaOrSyncFromCLI;
async function executeFormulaOrSyncWithVM({ formulaName, params, bundlePath, executionContext = mocks_2.newMockSyncExecutionContext(), }) {
    // TODO(huayang): importing manifest makes this method not usable in production, where we are not
    // supposed to load a manifest outside of the VM context.
    const manifest = await helpers_4.importManifest(bundlePath);
    const syncFormula = helpers_6.tryFindSyncFormula(manifest, formulaName);
    const formulaSpecification = {
        type: syncFormula ? types_1.FormulaType.Sync : types_1.FormulaType.Standard,
        formulaName,
    };
    const ivmContext = await ivmHelper.setupIvmContext(bundlePath, executionContext);
    return bootstrap_1.executeThunk(ivmContext, { params, formulaSpec: formulaSpecification }, bundlePath, bundlePath + '.map');
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
async function executeFormulaOrSyncWithRawParamsInVM({ formulaSpecification, params: rawParams, bundlePath, bundleSourceMapPath, executionContext = mocks_2.newMockSyncExecutionContext(), }) {
    const ivmContext = await ivmHelper.setupIvmContext(bundlePath, executionContext);
    const manifest = await helpers_4.importManifest(bundlePath);
    let params;
    if (formulaSpecification.type === types_1.FormulaType.Standard) {
        const formula = helpers_1.findFormula(manifest, formulaSpecification.formulaName);
        params = coercion_1.coerceParams(formula, rawParams);
    }
    else {
        const syncFormula = helpers_2.findSyncFormula(manifest, formulaSpecification.formulaName);
        params = coercion_1.coerceParams(syncFormula, rawParams);
    }
    return bootstrap_1.executeThunk(ivmContext, { params, formulaSpec: formulaSpecification }, bundlePath, bundleSourceMapPath);
}
async function executeFormulaOrSyncWithRawParams({ formulaSpecification, params: rawParams, manifest, executionContext, }) {
    let params;
    if (formulaSpecification.type === types_1.FormulaType.Standard) {
        const formula = helpers_1.findFormula(manifest, formulaSpecification.formulaName);
        params = coercion_1.coerceParams(formula, rawParams);
    }
    else {
        const syncFormula = helpers_2.findSyncFormula(manifest, formulaSpecification.formulaName);
        params = coercion_1.coerceParams(syncFormula, rawParams);
    }
    return findAndExecutePackFunction(params, formulaSpecification, manifest, executionContext);
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
async function executeSyncFormulaFromPackDef(packDef, syncFormulaName, params, context, { validateParams: shouldValidateParams = true, validateResult: shouldValidateResult = true } = {}, { useRealFetcher, manifestPath } = {}) {
    const formula = helpers_2.findSyncFormula(packDef, syncFormulaName);
    if (shouldValidateParams && formula) {
        validation_1.validateParams(formula, params);
    }
    let executionContext = context;
    if (!executionContext) {
        if (useRealFetcher) {
            const credentials = getCredentials(manifestPath);
            executionContext = fetcher_2.newFetcherSyncExecutionContext(buildUpdateCredentialsCallback(manifestPath), helpers_3.getPackAuth(packDef), packDef.networkDomains, credentials);
        }
        else {
            executionContext = mocks_2.newMockSyncExecutionContext();
        }
    }
    const result = [];
    let iterations = 1;
    do {
        if (iterations > MaxSyncIterations) {
            throw new Error(`Sync is still running after ${MaxSyncIterations} iterations, this is likely due to an infinite loop.`);
        }
        const response = await findAndExecutePackFunction(params, { formulaName: syncFormulaName, type: types_1.FormulaType.Sync }, packDef, executionContext, { validateParams: false, validateResult: false });
        result.push(...response.result);
        executionContext.sync.continuation = response.continuation;
        iterations++;
    } while (executionContext.sync.continuation);
    if (shouldValidateResult && formula) {
        validation_2.validateResult(formula, result);
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
        executionContext = fetcher_2.newFetcherSyncExecutionContext(buildUpdateCredentialsCallback(manifestPath), helpers_3.getPackAuth(packDef), packDef.networkDomains, credentials);
    }
    return findAndExecutePackFunction(params, { formulaName: syncFormulaName, type: types_1.FormulaType.Sync }, packDef, executionContext || mocks_2.newMockSyncExecutionContext(), options);
}
exports.executeSyncFormulaFromPackDefSingleIteration = executeSyncFormulaFromPackDefSingleIteration;
async function executeMetadataFormula(formula, metadataParams = {}, context = mocks_1.newMockExecutionContext()) {
    const { search, formulaContext } = metadataParams;
    return formula.execute([search || '', formulaContext ? JSON.stringify(formulaContext) : ''], context);
}
exports.executeMetadataFormula = executeMetadataFormula;
function getCredentials(manifestPath) {
    if (manifestPath) {
        const manifestDir = path.dirname(manifestPath);
        return auth_1.readCredentialsFile(manifestDir);
    }
}
function buildUpdateCredentialsCallback(manifestPath) {
    return newCredentials => {
        if (manifestPath) {
            auth_2.storeCredential(path.dirname(manifestPath), newCredentials);
        }
    };
}
