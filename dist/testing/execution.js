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
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeMetadataFormula = exports.executeSyncFormulaFromPackDef = exports.executeFormulaOrSyncWithRawParams = exports.executeFormulaOrSyncWithRawParamsInVM = exports.executeFormulaOrSyncWithVM = exports.executeFormulaOrSyncFromCLI = exports.executeFormulaFromPackDef = void 0;
const build_1 = require("../cli/build");
const helpers_1 = require("./helpers");
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
async function executeFormulaFromPackDef(packDef, formulaNameWithNamespace, params, context, options, { useRealFetcher, manifestPath } = {}) {
    let executionContext = context;
    if (!executionContext && useRealFetcher) {
        const credentials = getCredentials(manifestPath);
        executionContext = fetcher_1.newFetcherExecutionContext(buildUpdateCredentialsCallback(manifestPath), packDef.defaultAuthentication, packDef.networkDomains, credentials);
    }
    const formula = helper.findFormula(packDef, formulaNameWithNamespace);
    return helper.executeFormula(formula, params, executionContext || mocks_1.newMockExecutionContext(), options);
}
exports.executeFormulaFromPackDef = executeFormulaFromPackDef;
async function executeFormulaOrSyncFromCLI({ formulaName, params, manifestPath, vm, contextOptions = {}, }) {
    try {
        const module = await Promise.resolve().then(() => __importStar(require(manifestPath)));
        const manifest = helpers_1.getManifestFromModule(module);
        const { useRealFetcher } = contextOptions;
        const credentials = useRealFetcher && manifestPath ? getCredentials(manifestPath) : undefined;
        // A sync context would work for both formula / syncFormula execution for now.
        // TODO(jonathan): Pass the right context, just to set user expectations correctly for runtime values.
        const executionContext = useRealFetcher
            ? fetcher_2.newFetcherSyncExecutionContext(buildUpdateCredentialsCallback(manifestPath), manifest.defaultAuthentication, manifest.networkDomains, credentials)
            : mocks_2.newMockSyncExecutionContext();
        const result = vm
            ? await executeFormulaOrSyncWithRawParamsInVM({ formulaName, params, manifestPath, executionContext })
            : await executeFormulaOrSyncWithRawParams({ formulaName, params, module, executionContext });
        helpers_2.print(result);
    }
    catch (err) {
        helpers_2.print(err);
        process.exit(1);
    }
}
exports.executeFormulaOrSyncFromCLI = executeFormulaOrSyncFromCLI;
async function executeFormulaOrSyncWithVM({ formulaName, params, manifestPath, executionContext = mocks_2.newMockSyncExecutionContext(), }) {
    const bundlePath = await build_1.build(manifestPath);
    const ivmContext = await ivmHelper.setupIvmContext(bundlePath, executionContext);
    return ivmHelper.executeFormulaOrSync(ivmContext, formulaName, params);
}
exports.executeFormulaOrSyncWithVM = executeFormulaOrSyncWithVM;
async function executeFormulaOrSyncWithRawParamsInVM({ formulaName, params: rawParams, manifestPath, executionContext = mocks_2.newMockSyncExecutionContext(), }) {
    const bundlePath = await build_1.build(manifestPath);
    const ivmContext = await ivmHelper.setupIvmContext(bundlePath, executionContext);
    return ivmHelper.executeFormulaOrSyncWithRawParams(ivmContext, formulaName, rawParams);
}
exports.executeFormulaOrSyncWithRawParamsInVM = executeFormulaOrSyncWithRawParamsInVM;
async function executeFormulaOrSyncWithRawParams({ formulaName, params: rawParams, module, executionContext, }) {
    const manifest = helpers_1.getManifestFromModule(module);
    return helper.executeFormulaOrSyncWithRawParams(manifest, formulaName, rawParams, executionContext);
}
exports.executeFormulaOrSyncWithRawParams = executeFormulaOrSyncWithRawParams;
async function executeSyncFormulaFromPackDef(packDef, syncFormulaName, params, context, options, { useRealFetcher, manifestPath } = {}) {
    let executionContext = context;
    if (!executionContext && useRealFetcher) {
        const credentials = getCredentials(manifestPath);
        executionContext = fetcher_2.newFetcherSyncExecutionContext(buildUpdateCredentialsCallback(manifestPath), packDef.defaultAuthentication, packDef.networkDomains, credentials);
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
