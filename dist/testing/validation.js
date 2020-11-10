"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateResult = exports.validateParams = void 0;
const types_1 = require("./types");
const object_utils_1 = require("../helpers/object_utils");
// TODO: Handle varargs.
function validateParams(formula, params) {
    const numRequiredParams = formula.parameters.filter(param => !param.optional).length;
    if (params.length < numRequiredParams) {
        throw new types_1.ParameterException(`Expected at least ${numRequiredParams} parameter but only ${params.length} were provided.`);
    }
    const errors = [];
    for (let i = 0; i < params.length; i++) {
        const param = params[i];
        const paramDef = formula.parameters[i];
        if (!paramDef.optional && !object_utils_1.isDefined(param)) {
            errors.push({
                message: `Param ${i} "${paramDef.name}" is required but a value was not provided.`,
            });
        }
    }
    if (errors.length) {
        const errorMsgs = errors.map(error => error.message);
        throw new types_1.ParameterException(`The following parameter errors were found:\n${errorMsgs.join('\n')}`);
    }
}
exports.validateParams = validateParams;
function validateResult(formula, result) {
    // TODO
}
exports.validateResult = validateResult;
