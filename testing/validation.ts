import type {ParamDefs} from '../api_types';
import {ParameterError} from './types';
import {ParameterException} from './types';
import type {TypedPackFormula} from '../api';
import {isDefined} from '../helpers/object_utils';

// TODO: Handle varargs.
export function validateParams(formula: TypedPackFormula, params: ParamDefs): void {
  const numRequiredParams = formula.parameters.filter(param => !param.optional).length;
  if (params.length < numRequiredParams) {
    throw new ParameterException(
      `Expected at least ${numRequiredParams} parameter but only ${params.length} were provided.`,
    );
  }
  const errors: ParameterError[] = [];
  for (let i = 0; i < params.length; i++) {
    const param = params[i];
    const paramDef = formula.parameters[i];
    if (!paramDef.optional && !isDefined(param)) {
      errors.push({
        message: `Param ${i} "${paramDef.name}" is required but a value was not provided.`,
      });
    }
  }

  if (errors.length) {
    const errorMsgs = errors.map(error => error.message);
    throw new ParameterException(`The following parameter errors were found:\n${errorMsgs.join('\n')}`);
  }
}

export function validateResult<ResultT extends any>(_formula: TypedPackFormula, _result: ResultT): void {
  // TODO
}
