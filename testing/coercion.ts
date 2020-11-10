import type {ArrayType} from '../api_types';
import type {ParamDef} from '../api_types';
import type {ParamDefs} from '../api_types';
import type {ParamValues} from '../api_types';
import {Type} from '../api_types';
import type {TypedStandardFormula} from '../api';
import {ensureUnreachable} from '../helpers/ensure';
import {isDefined} from '../helpers/object_utils';

export function coerceParams(formula: TypedStandardFormula, params: ParamValues<ParamDefs>): ParamValues<ParamDefs> {
  const coerced: ParamValues<ParamDefs> = [];
  for (let i = 0; i < params.length; i++) {
    coerced.push(coerceParamValue(formula.parameters[i], params[i]));
  }
  return coerced;
}

function coerceParamValue(paramDef: ParamDef<any>, paramValue: any): any {
  if (!isDefined(paramValue)) {
    return paramValue;
  }
  if (paramDef.type === 'array') {
    const type = paramDef.type as ArrayType<Type>;
    const value = paramValue as any[];
    return value.map(item => coerceParam(type.items, item));
  }
  return coerceParam(paramDef.type, paramValue);
}

function coerceParam(type: Type, value: any): any {
  switch (type) {
    case Type.boolean:
      return Boolean(value);
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
