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
exports.executeMetadataFormula = exports.executeSyncFormulaFromPackDefSingleIteration = exports.executeSyncFormulaFromPackDef = exports.executeFormulaOrSyncWithRawParams = exports.executeFormulaOrSyncWithRawParamsInVM = exports.VMError = exports.executeFormulaOrSyncWithVM = exports.executeFormulaOrSyncFromCLI = exports.executeFormulaFromPackDef = void 0;
const types_1 = require("../runtime/types");
const compile_1 = require("./compile");
const helpers_1 = require("../cli/helpers");
const helper = __importStar(require("./execution_helper"));
const helpers_2 = require("../cli/helpers");
const ivmHelper = __importStar(require("./ivm_helper"));
const fetcher_1 = require("./fetcher");
const fetcher_2 = require("./fetcher");
const mocks_1 = require("./mocks");
const mocks_2 = require("./mocks");
const path = __importStar(require("path"));
const helpers_3 = require("./helpers");
const auth_1 = require("./auth");
const auth_2 = require("./auth");
const execution_1 = require("../runtime/execution");
const util_1 = __importDefault(require("util"));
const MaxSyncIterations = 100;
async function executeFormulaFromPackDef(packDef, formulaNameWithNamespace, params, context, options, { useRealFetcher, manifestPath } = {}) {
    let executionContext = context;
    if (!executionContext && useRealFetcher) {
        const credentials = getCredentials(manifestPath);
        executionContext = fetcher_1.newFetcherExecutionContext(buildUpdateCredentialsCallback(manifestPath), helpers_1.getPackAuth(packDef), packDef.networkDomains, credentials);
    }
    return helper.executeFormulaOrSync(packDef, { type: types_1.FormulaType.Standard, formulaName: formulaNameWithNamespace }, params, executionContext || mocks_1.newMockExecutionContext(), options);
}
exports.executeFormulaFromPackDef = executeFormulaFromPackDef;
async function executeFormulaOrSyncFromCLI({ formulaName, params, manifest, manifestPath, vm, dynamicUrl, contextOptions = {}, }) {
    try {
        const { useRealFetcher } = contextOptions;
        const credentials = useRealFetcher && manifestPath ? getCredentials(manifestPath) : undefined;
        // A sync context would work for both formula / syncFormula execution for now.
        // TODO(jonathan): Pass the right context, just to set user expectations correctly for runtime values.
        const executionContext = useRealFetcher
            ? fetcher_2.newFetcherSyncExecutionContext(buildUpdateCredentialsCallback(manifestPath), helpers_1.getPackAuth(manifest), manifest.networkDomains, credentials)
            : mocks_2.newMockSyncExecutionContext();
        executionContext.sync.dynamicUrl = dynamicUrl || undefined;
        const syncFormula = helper.tryFindSyncFormula(manifest, formulaName);
        const formulaSpecification = {
            type: syncFormula ? types_1.FormulaType.Sync : types_1.FormulaType.Standard,
            formulaName,
        };
        if (syncFormula) {
            const result = [];
            let iterations = 1;
            do {
                if (iterations > MaxSyncIterations) {
                    throw new Error(`Sync is still running after ${MaxSyncIterations} iterations, this is likely due to an infinite loop.`);
                }
                const response = vm
                    ? await executeFormulaOrSyncWithRawParamsInVM({ formulaSpecification, params, manifestPath, executionContext })
                    : await executeFormulaOrSyncWithRawParams({ formulaSpecification, params, manifest, executionContext });
                result.push(...response.result);
                executionContext.sync.continuation = response.continuation;
                iterations++;
            } while (executionContext.sync.continuation);
            helpers_3.print(result);
        }
        else {
            const result = vm
                ? await executeFormulaOrSyncWithRawParamsInVM({ formulaSpecification, params, manifestPath, executionContext })
                : await executeFormulaOrSyncWithRawParams({ formulaSpecification, params, manifest, executionContext });
            helpers_3.print(result);
        }
    }
    catch (err) {
        helpers_3.print(err);
        process.exit(1);
    }
}
exports.executeFormulaOrSyncFromCLI = executeFormulaOrSyncFromCLI;
async function executeFormulaOrSyncWithVM({ formulaName, params, bundlePath, executionContext = mocks_2.newMockSyncExecutionContext(), }) {
    // TODO(huayang): importing manifest makes this method not usable in production, where we are not
    // supposed to load a manifest outside of the VM context.
    const manifest = await helpers_2.importManifest(bundlePath);
    const syncFormula = helper.tryFindSyncFormula(manifest, formulaName);
    const formulaSpecification = {
        type: syncFormula ? types_1.FormulaType.Sync : types_1.FormulaType.Standard,
        formulaName,
    };
    const ivmContext = await ivmHelper.setupIvmContext(bundlePath, executionContext);
    return ivmHelper.executeFormulaOrSync(ivmContext, formulaSpecification, params);
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
async function executeFormulaOrSyncWithRawParamsInVM({ formulaSpecification, params: rawParams, manifestPath, executionContext = mocks_2.newMockSyncExecutionContext(), }) {
    const { bundleSourceMapPath, bundlePath } = await compile_1.compilePackBundle({ manifestPath, minify: false });
    const ivmContext = await ivmHelper.setupIvmContext(bundlePath, executionContext);
    try {
        return await ivmHelper.executeFormulaOrSyncWithRawParams(ivmContext, formulaSpecification, rawParams);
    }
    catch (err) {
        throw new VMError(err.name, err.message, (await execution_1.translateErrorStackFromVM({ stacktrace: err.stack, bundleSourceMapPath, vmFilename: bundlePath })) || '');
    }
}
exports.executeFormulaOrSyncWithRawParamsInVM = executeFormulaOrSyncWithRawParamsInVM;
async function executeFormulaOrSyncWithRawParams({ formulaSpecification, params: rawParams, manifest, executionContext, }) {
    return helper.executeFormulaOrSyncWithRawParams(manifest, formulaSpecification, rawParams, executionContext);
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
async function executeSyncFormulaFromPackDef(packDef, syncFormulaName, params, context, options, { useRealFetcher, manifestPath } = {}) {
    let executionContext = context;
    if (!executionContext) {
        if (useRealFetcher) {
            const credentials = getCredentials(manifestPath);
            executionContext = fetcher_2.newFetcherSyncExecutionContext(buildUpdateCredentialsCallback(manifestPath), helpers_1.getPackAuth(packDef), packDef.networkDomains, credentials);
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
        const response = await helper.executeFormulaOrSync(packDef, { formulaName: syncFormulaName, type: types_1.FormulaType.Sync }, params, executionContext, options);
        result.push(...response.result);
        executionContext.sync.continuation = response.continuation;
        iterations++;
    } while (executionContext.sync.continuation);
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
        executionContext = fetcher_2.newFetcherSyncExecutionContext(buildUpdateCredentialsCallback(manifestPath), helpers_1.getPackAuth(packDef), packDef.networkDomains, credentials);
    }
    return helper.executeFormulaOrSync(packDef, { formulaName: syncFormulaName, type: types_1.FormulaType.Sync }, params, executionContext || mocks_2.newMockSyncExecutionContext(), options);
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
