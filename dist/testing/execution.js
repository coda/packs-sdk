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
exports.executeMetadataFormula = exports.executeSyncFormulaFromPackDef = exports.executeFormulaOrSyncWithRawParams = exports.executeFormulaOrSyncWithRawParamsInVM = exports.VMError = exports.executeFormulaOrSyncWithVM = exports.executeFormulaOrSyncFromCLI = exports.executeFormulaFromPackDef = void 0;
const compile_1 = require("./compile");
const helpers_1 = require("../cli/helpers");
const helper = __importStar(require("./execution_helper"));
const ivmHelper = __importStar(require("./ivm_helper"));
const fetcher_1 = require("./fetcher");
const fetcher_2 = require("./fetcher");
const mocks_1 = require("./mocks");
const mocks_2 = require("./mocks");
const path = __importStar(require("path"));
const helpers_2 = require("./helpers");
const auth_1 = require("./auth");
const auth_2 = require("./auth");
const execution_1 = require("../runtime/execution");
const util_1 = __importDefault(require("util"));
async function executeFormulaFromPackDef(packDef, formulaNameWithNamespace, params, context, options, { useRealFetcher, manifestPath } = {}) {
    let executionContext = context;
    if (!executionContext && useRealFetcher) {
        const credentials = getCredentials(manifestPath);
        executionContext = fetcher_1.newFetcherExecutionContext(buildUpdateCredentialsCallback(manifestPath), helpers_1.getPackAuth(packDef), packDef.networkDomains, credentials);
    }
    const formula = helper.findFormula(packDef, formulaNameWithNamespace);
    return helper.executeFormula(formula, params, executionContext || mocks_1.newMockExecutionContext(), options);
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
        const result = vm
            ? await executeFormulaOrSyncWithRawParamsInVM({ formulaName, params, manifestPath, executionContext })
            : await executeFormulaOrSyncWithRawParams({ formulaName, params, manifest, executionContext });
        helpers_2.print(result);
    }
    catch (err) {
        helpers_2.print(err);
        process.exit(1);
    }
}
exports.executeFormulaOrSyncFromCLI = executeFormulaOrSyncFromCLI;
async function executeFormulaOrSyncWithVM({ formulaName, params, bundlePath, executionContext = mocks_2.newMockSyncExecutionContext(), }) {
    const ivmContext = await ivmHelper.setupIvmContext(bundlePath, executionContext);
    return ivmHelper.executeFormulaOrSync(ivmContext, formulaName, params);
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
async function executeFormulaOrSyncWithRawParamsInVM({ formulaName, params: rawParams, manifestPath, executionContext = mocks_2.newMockSyncExecutionContext(), }) {
    const { bundleSourceMapPath, bundlePath } = await compile_1.compilePackBundle({ manifestPath, minify: false });
    const ivmContext = await ivmHelper.setupIvmContext(bundlePath, executionContext);
    try {
        return await ivmHelper.executeFormulaOrSyncWithRawParams(ivmContext, formulaName, rawParams);
    }
    catch (err) {
        throw new VMError(err.name, err.message, await execution_1.translateErrorStackFromVM({ stacktrace: err.stack, bundleSourceMapPath, vmFilename: bundlePath }) || '');
    }
}
exports.executeFormulaOrSyncWithRawParamsInVM = executeFormulaOrSyncWithRawParamsInVM;
async function executeFormulaOrSyncWithRawParams({ formulaName, params: rawParams, manifest, executionContext, }) {
    return helper.executeFormulaOrSyncWithRawParams(manifest, formulaName, rawParams, executionContext);
}
exports.executeFormulaOrSyncWithRawParams = executeFormulaOrSyncWithRawParams;
async function executeSyncFormulaFromPackDef(packDef, syncFormulaName, params, context, options, { useRealFetcher, manifestPath } = {}) {
    let executionContext = context;
    if (!executionContext && useRealFetcher) {
        const credentials = getCredentials(manifestPath);
        executionContext = fetcher_2.newFetcherSyncExecutionContext(buildUpdateCredentialsCallback(manifestPath), helpers_1.getPackAuth(packDef), packDef.networkDomains, credentials);
    }
    const formula = helper.findSyncFormula(packDef, syncFormulaName);
    return helper.executeSyncFormula(formula, params, executionContext || mocks_2.newMockSyncExecutionContext(), options);
}
exports.executeSyncFormulaFromPackDef = executeSyncFormulaFromPackDef;
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
