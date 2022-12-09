import type {ArrayType} from '../api_types';
import type {ParamDef} from '../api_types';
import type {ParamDefs} from '../api_types';
import type {ParamType} from '../api_types';
import type {ParamValues} from '../api_types';
import {Type} from '../api_types';
import type {TypedPackFormula} from '../api';
import {ensureUnreachable} from '../helpers/ensure';
import {isArrayType} from '../api_types';
import {isDefined} from '../helpers/object_utils';

export function coerceParams(formula: TypedPackFormula, args: ParamValues<ParamDefs>): ParamValues<ParamDefs> {
  const {parameters, varargParameters} = formula;
  const coerced: ParamValues<ParamDefs> = [];
  let varargIndex = 0;
  for (let i = 0; i < args.length; i++) {
    const paramDef = parameters[i];
    if (paramDef) {
      coerced.push(coerceParamValue(paramDef, args[i]));
    } else {
      if (varargParameters) {
        const varargDef = varargParameters[varargIndex];
        coerced.push(coerceParamValue(varargDef, args[i]));
        varargIndex = (varargIndex + 1) % varargParameters.length;
      } else {
        // More args given than are defined, just return them as-is, we'll validate later.
        coerced.push(args[i]);
      }
    }
  }
  return coerced;
}

function coerceParamValue(paramDef: ParamDef<any>, paramValue: any): any {
  if (!isDefined(paramValue)) {
    return paramValue;
  }

  if (isArrayType(paramDef.type)) {
    const valuesString = paramValue as string;
    const value = valuesString.length ? valuesString.split(',') : [];
    return value.map(item => coerceParam((paramDef.type as ArrayType<ParamType>).items, paramDef.name, item.trim()));
  }
  return coerceParam(paramDef.type, paramDef.name, paramValue);
}

function coerceParam(type: ParamType, name: string, value: any): any {
  switch (type) {
    case Type.boolean:
      const maybeBoolean = (value || '').toLowerCase();
      if (maybeBoolean !== 'true' && maybeBoolean !== 'false') {
        throw new Error(
          `Expected parameter ${name} to be a boolean, but found ${value} (should be one of "true" or "false")`,
        );
      }
      return maybeBoolean === 'true';
    case Type.date:
      const maybeDate = new Date(value);
      // getTime returns NaN if the date is not valid or a number if it is valid
      if (!(maybeDate instanceof Date) || isNaN(maybeDate.getTime())) {
        throw new Error(`Expected parameter ${name} to be a date/time value, but found ${value}`);
      }
      return maybeDate;
    case Type.number:
      if (isNaN(Number(value))) {
        throw new Error(`Expected parameter ${name} to be a number value, but found ${value}`);
      }
      return Number(value);
    case Type.html:
    case Type.file:
    case Type.image:
    case Type.string:
    case Type.markdown:
      return value;
    default:
      return ensureUnreachable(type);
  }
}
