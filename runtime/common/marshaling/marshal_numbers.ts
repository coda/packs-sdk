import {CodaMarshalerType} from './constants';
import {MarshalingInjectedKeys} from './constants';

export function marshalNumber(val: any): object | undefined {
  // Most numbers don't need to be marshaled. The only special cases are NaN and Infinity.
  if (typeof val === 'number' && (isNaN(val) || val === Infinity)) {
    return {
      data: val.toString(),
      [MarshalingInjectedKeys.CodaMarshaler]: CodaMarshalerType.Number,
    };
  }
}

export function unmarshalNumber(val: {[key: string]: any}): number | undefined {
  if (typeof val !== 'object' || val[MarshalingInjectedKeys.CodaMarshaler] !== CodaMarshalerType.Number) {
    return;
  }
  return Number(val.data);
}
