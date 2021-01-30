import type {ArrayType} from '../api_types';
import type {ParamDef} from '../api_types';
import type {ParamDefs} from '../api_types';
import type {ParamValues} from '../api_types';
import {Type} from '../api_types';
import type {TypedPackFormula} from '../api';
import {ensureUnreachable} from '../helpers/ensure';
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
  const {type} = paramDef.type;
  if (type === 'array') {
    const value = (paramValue as string).split(',');
    return value.map(item => coerceParam((type as ArrayType<Type>).items, item));
  }
  return coerceParam(paramDef.type, paramValue);
}

function coerceParam(type: Type, value: any): any {
  switch (type) {
    case Type.boolean:
      return (value || '').toLowerCase() === 'true';
    case Type.date:
      return new Date(value);
    case Type.number:
      return Number(value);
    case Type.object:
      return JSON.parse(value);
    case Type.html:
    case Type.image:
    case Type.string:
      return value;
    default:
      return ensureUnreachable(type);
  }
}
