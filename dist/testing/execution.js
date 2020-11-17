"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeSyncFormulaFromPackDef = exports.executeSyncFormula = exports.executeFormulaFromCLI = exports.executeFormulaFromPackDef = exports.executeFormula = void 0;
const coercion_1 = require("./coercion");
const helpers_1 = require("./helpers");
const fetcher_1 = require("./fetcher");
const fetcher_2 = require("./fetcher");
const mocks_1 = require("./mocks");
const mocks_2 = require("./mocks");
const validation_1 = require("./validation");
const validation_2 = require("./validation");
function executeFormula(formula, params, context = mocks_1.newMockExecutionContext(), { validateParams: shouldValidateParams = true, validateResult: shouldValidateResult = true } = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        if (shouldValidateParams) {
            validation_1.validateParams(formula, params);
        }
        const result = yield formula.execute(params, context);
        if (shouldValidateResult) {
            validation_2.validateResult(formula, result);
        }
        return result;
    });
}
exports.executeFormula = executeFormula;
function executeFormulaFromPackDef(packDef, formulaNameWithNamespace, params, context, options, { useRealFetcher, credentialsFile } = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        let executionContext = context;
        if (!executionContext && useRealFetcher) {
            executionContext = fetcher_1.newFetcherExecutionContext(packDef.name, packDef.defaultAuthentication, credentialsFile);
        }
        const formula = findFormula(packDef, formulaNameWithNamespace);
        return executeFormula(formula, params, executionContext, options);
    });
}
exports.executeFormulaFromPackDef = executeFormulaFromPackDef;
function executeFormulaFromCLI(args, module) {
    return __awaiter(this, void 0, void 0, function* () {
        const formulaNameWithNamespace = args[0];
        const manifest = helpers_1.getManifestFromModule(module);
        try {
            const formula = findFormula(manifest, formulaNameWithNamespace);
            const params = coercion_1.coerceParams(formula, args.slice(1));
            const result = yield executeFormula(formula, params);
            // eslint-disable-next-line no-console
            console.log(result);
        }
        catch (err) {
            // eslint-disable-next-line no-console
            console.log(err);
            process.exit(1);
        }
    });
}
exports.executeFormulaFromCLI = executeFormulaFromCLI;
function executeSyncFormula(formula, params, context = mocks_2.newMockSyncExecutionContext(), { validateParams: shouldValidateParams = true, validateResult: shouldValidateResult = true, maxIterations: maxIterations = 1000, } = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        if (shouldValidateParams) {
            validation_1.validateParams(formula, params);
        }
        const result = [];
        let iterations = 1;
        do {
            if (iterations > maxIterations) {
                throw new Error(`Sync is still running after ${maxIterations} iterations, this is likely due to an infinite loop. If more iterations are needed, use the maxIterations option.`);
            }
            const response = yield formula.execute(params, context);
            result.push(...response.result);
            context.sync.continuation = response.continuation;
            iterations++;
        } while (context.sync.continuation);
        if (shouldValidateResult) {
            validation_2.validateResult(formula, result);
        }
        return result;
    });
}
exports.executeSyncFormula = executeSyncFormula;
function executeSyncFormulaFromPackDef(packDef, syncFormulaName, params, context, options, { useRealFetcher, credentialsFile } = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        let executionContext = context;
        if (!executionContext && useRealFetcher) {
            executionContext = fetcher_2.newFetcherSyncExecutionContext(packDef.name, packDef.defaultAuthentication, credentialsFile);
        }
        const formula = findSyncFormula(packDef, syncFormulaName);
        return executeSyncFormula(formula, params, executionContext, options);
    });
}
exports.executeSyncFormulaFromPackDef = executeSyncFormulaFromPackDef;
function findFormula(packDef, formulaNameWithNamespace) {
    if (!packDef.formulas) {
        throw new Error(`Pack definition for ${packDef.name} (id ${packDef.id}) has no formulas.`);
    }
    const [namespace, name] = formulaNameWithNamespace.split('::');
    if (!(namespace && name)) {
        throw new Error(`Formula names must be specified as FormulaNamespace::FormulaName, but got "${formulaNameWithNamespace}".`);
    }
    const formulas = packDef.formulas[namespace];
    if (!formulas || !formulas.length) {
        throw new Error(`Pack definition for ${packDef.name} (id ${packDef.id}) has no formulas for namespace "${namespace}".`);
    }
    for (const formula of formulas) {
        if (formula.name === name) {
            return formula;
        }
    }
    throw new Error(`Pack definition for ${packDef.name} (id ${packDef.id}) has no formula "${name}" in namespace "${namespace}".`);
}
function findSyncFormula(packDef, syncFormulaName) {
    if (!packDef.syncTables) {
        throw new Error(`Pack definition for ${packDef.name} (id ${packDef.id}) has no sync tables.`);
    }
    for (const syncTable of packDef.syncTables) {
        const syncFormula = syncTable.getter;
        if (syncFormula.name === syncFormulaName) {
            return syncFormula;
        }
    }
    throw new Error(`Pack definition for ${packDef.name} (id ${packDef.id}) has no sync formula "${syncFormulaName}" in its sync tables.`);
}
