import { FormulaType } from '../runtime/types';
import { coerceParams } from './coercion';
import { executeThunk } from '../runtime/bootstrap';
import { findFormula } from '../runtime/common/helpers';
import { findSyncFormula } from '../runtime/common/helpers';
import { getPackAuth } from '../cli/helpers';
import { importManifest } from '../cli/helpers';
import * as ivmHelper from './ivm_helper';
import { newFetcherExecutionContext } from './fetcher';
import { newFetcherSyncExecutionContext } from './fetcher';
import { newMockExecutionContext } from './mocks';
import { newMockSyncExecutionContext } from './mocks';
import * as path from 'path';
import { print } from './helpers';
import { readCredentialsFile } from './auth';
import { storeCredential } from './auth';
import * as thunk from '../runtime/thunk/thunk';
import { transformBody } from '../handler_templates';
import { tryFindFormula } from '../runtime/common/helpers';
import { tryFindSyncFormula } from '../runtime/common/helpers';
import util from 'util';
import { validateParams } from './validation';
import { validateResult } from './validation';
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
async function findAndExecutePackFunction(params, formulaSpec, manifest, executionContext, { validateParams: shouldValidateParams = true, validateResult: shouldValidateResult = true, 
// TODO(alexd): Switch this to false or remove when we launch 1.0.0
useDeprecatedResultNormalization = true, } = {}) {
    var _a, _b;
    let formula;
    switch (formulaSpec.type) {
        case FormulaType.Standard:
            formula = findFormula(manifest, formulaSpec.formulaName);
            break;
        case FormulaType.Sync:
            formula = findSyncFormula(manifest, formulaSpec.formulaName);
            break;
    }
    if (shouldValidateParams && formula) {
        validateParams(formula, params);
    }
    let result = await thunk.findAndExecutePackFunction(params, formulaSpec, manifest, executionContext, false);
    if (useDeprecatedResultNormalization && formula) {
        const resultToNormalize = formulaSpec.type === FormulaType.Sync ? result.result : result;
        // Matches legacy behavior within handler_templates:generateObjectResponseHandler where we never
        // called transform body on non-object responses.
        if (typeof resultToNormalize === 'object') {
            const schema = (_b = (_a = executionContext === null || executionContext === void 0 ? void 0 : executionContext.sync) === null || _a === void 0 ? void 0 : _a.schema) !== null && _b !== void 0 ? _b : formula.schema;
            const normalizedResult = transformBody(resultToNormalize, schema);
            if (formulaSpec.type === FormulaType.Sync) {
                result.result = normalizedResult;
            }
            else {
                result = normalizedResult;
            }
        }
    }
    if (shouldValidateResult && formula) {
        const resultToValidate = formulaSpec.type === FormulaType.Sync ? result.result : result;
        validateResult(formula, resultToValidate);
    }
    return result;
}
export async function executeFormulaFromPackDef(packDef, formulaNameWithNamespace, params, context, options, { useRealFetcher, manifestPath } = {}) {
    let executionContext = context;
    if (!executionContext && useRealFetcher) {
        const credentials = getCredentials(manifestPath);
        executionContext = newFetcherExecutionContext(buildUpdateCredentialsCallback(manifestPath), getPackAuth(packDef), packDef.networkDomains, credentials);
    }
    return findAndExecutePackFunction(params, { type: FormulaType.Standard, formulaName: resolveFormulaNameWithNamespace(formulaNameWithNamespace) }, packDef, executionContext || newMockExecutionContext(), options);
}
export async function executeFormulaOrSyncFromCLI({ formulaName, params, manifest, manifestPath, vm, dynamicUrl, bundleSourceMapPath, bundlePath, contextOptions = {}, }) {
    try {
        const { useRealFetcher } = contextOptions;
        const credentials = useRealFetcher && manifestPath ? getCredentials(manifestPath) : undefined;
        // A sync context would work for both formula / syncFormula execution for now.
        // TODO(jonathan): Pass the right context, just to set user expectations correctly for runtime values.
        const executionContext = useRealFetcher
            ? newFetcherSyncExecutionContext(buildUpdateCredentialsCallback(manifestPath), getPackAuth(manifest), manifest.networkDomains, credentials)
            : newMockSyncExecutionContext();
        executionContext.sync.dynamicUrl = dynamicUrl || undefined;
        const syncFormula = tryFindSyncFormula(manifest, formulaName);
        const formula = tryFindFormula(manifest, formulaName);
        if (!(syncFormula || formula)) {
            throw new Error(`Could not find a formula or sync named "${formulaName}".`);
        }
        const formulaSpecification = {
            type: syncFormula ? FormulaType.Sync : FormulaType.Standard,
            formulaName,
        };
        if (formulaSpecification.type === FormulaType.Sync) {
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
            print(result);
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
            print(result);
        }
    }
    catch (err) {
        print(err);
        process.exit(1);
    }
}
// This method is used to execute a (sync) formula in testing with VM. Don't use it in lambda or calc service.
export async function executeFormulaOrSyncWithVM({ formulaName, params, bundlePath, executionContext = newMockSyncExecutionContext(), }) {
    const manifest = await importManifest(bundlePath);
    const syncFormula = tryFindSyncFormula(manifest, formulaName);
    const formulaSpecification = {
        type: syncFormula ? FormulaType.Sync : FormulaType.Standard,
        formulaName,
    };
    const ivmContext = await ivmHelper.setupIvmContext(bundlePath, executionContext);
    return executeThunk(ivmContext, { params, formulaSpec: formulaSpecification }, bundlePath, bundlePath + '.map');
}
export class VMError {
    constructor(name, message, stack) {
        this.name = name;
        this.message = message;
        this.stack = stack;
    }
    [util.inspect.custom]() {
        return `${this.name}: ${this.message}\n${this.stack}`;
    }
}
async function executeFormulaOrSyncWithRawParamsInVM({ formulaSpecification, params: rawParams, bundlePath, bundleSourceMapPath, executionContext = newMockSyncExecutionContext(), }) {
    const ivmContext = await ivmHelper.setupIvmContext(bundlePath, executionContext);
    const manifest = await importManifest(bundlePath);
    let params;
    if (formulaSpecification.type === FormulaType.Standard) {
        const formula = findFormula(manifest, formulaSpecification.formulaName);
        params = coerceParams(formula, rawParams);
    }
    else {
        const syncFormula = findSyncFormula(manifest, formulaSpecification.formulaName);
        params = coerceParams(syncFormula, rawParams);
    }
    return executeThunk(ivmContext, { params, formulaSpec: formulaSpecification }, bundlePath, bundleSourceMapPath);
}
export async function executeFormulaOrSyncWithRawParams({ formulaSpecification, params: rawParams, manifest, executionContext, }) {
    let params;
    if (formulaSpecification.type === FormulaType.Standard) {
        const formula = findFormula(manifest, formulaSpecification.formulaName);
        params = coerceParams(formula, rawParams);
    }
    else {
        const syncFormula = findSyncFormula(manifest, formulaSpecification.formulaName);
        params = coerceParams(syncFormula, rawParams);
    }
    return findAndExecutePackFunction(params, formulaSpecification, manifest, executionContext);
}
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
export async function executeSyncFormulaFromPackDef(packDef, syncFormulaName, params, context, { validateParams: shouldValidateParams = true, validateResult: shouldValidateResult = true, useDeprecatedResultNormalization = true, } = {}, { useRealFetcher, manifestPath } = {}) {
    const formula = findSyncFormula(packDef, syncFormulaName);
    if (shouldValidateParams && formula) {
        validateParams(formula, params);
    }
    let executionContext = context;
    if (!executionContext) {
        if (useRealFetcher) {
            const credentials = getCredentials(manifestPath);
            executionContext = newFetcherSyncExecutionContext(buildUpdateCredentialsCallback(manifestPath), getPackAuth(packDef), packDef.networkDomains, credentials);
        }
        else {
            executionContext = newMockSyncExecutionContext();
        }
    }
    const result = [];
    let iterations = 1;
    do {
        if (iterations > MaxSyncIterations) {
            throw new Error(`Sync is still running after ${MaxSyncIterations} iterations, this is likely due to an infinite loop.`);
        }
        const response = await findAndExecutePackFunction(params, { formulaName: syncFormulaName, type: FormulaType.Sync }, packDef, executionContext, { validateParams: false, validateResult: false, useDeprecatedResultNormalization });
        result.push(...response.result);
        executionContext.sync.continuation = response.continuation;
        iterations++;
    } while (executionContext.sync.continuation);
    if (shouldValidateResult && formula) {
        validateResult(formula, result);
    }
    return result;
}
/**
 * Executes a single sync iteration, and returns the return value from the sync formula
 * including the continuation, for inspection.
 */
export async function executeSyncFormulaFromPackDefSingleIteration(packDef, syncFormulaName, params, context, options, { useRealFetcher, manifestPath } = {}) {
    let executionContext = context;
    if (!executionContext && useRealFetcher) {
        const credentials = getCredentials(manifestPath);
        executionContext = newFetcherSyncExecutionContext(buildUpdateCredentialsCallback(manifestPath), getPackAuth(packDef), packDef.networkDomains, credentials);
    }
    return findAndExecutePackFunction(params, { formulaName: syncFormulaName, type: FormulaType.Sync }, packDef, executionContext || newMockSyncExecutionContext(), options);
}
export async function executeMetadataFormula(formula, metadataParams = {}, context = newMockExecutionContext()) {
    const { search, formulaContext } = metadataParams;
    return formula.execute([search || '', formulaContext ? JSON.stringify(formulaContext) : ''], context);
}
function getCredentials(manifestPath) {
    if (manifestPath) {
        const manifestDir = path.dirname(manifestPath);
        return readCredentialsFile(manifestDir);
    }
}
function buildUpdateCredentialsCallback(manifestPath) {
    return newCredentials => {
        if (manifestPath) {
            storeCredential(path.dirname(manifestPath), newCredentials);
        }
    };
}
export function newRealFetcherExecutionContext(packDef, manifestPath) {
    return newFetcherExecutionContext(buildUpdateCredentialsCallback(manifestPath), getPackAuth(packDef), packDef.networkDomains, getCredentials(manifestPath));
}
export function newRealFetcherSyncExecutionContext(packDef, manifestPath) {
    const context = newRealFetcherExecutionContext(packDef, manifestPath);
    return { ...context, sync: {} };
}
