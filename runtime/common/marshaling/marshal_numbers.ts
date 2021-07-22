import {MarshalingInjectedKeys} from './constants';

export function marshalNumber(val: any): object | undefined {
  // Most numbers don't need to be marshaled. The only special cases are NaN and Infinity.
  if (typeof val === 'number' && (isNaN(val) || val === Infinity)) {
    return {
      data: val.toString(),
      [MarshalingInjectedKeys.IsNumber]: true,
    };
  }
}

export function unmarshalNumber(val: {[key: string]: any}): number | undefined {
  if (typeof val !== 'object' || !val[MarshalingInjectedKeys.IsNumber]) {
    return;
  }
  return Number(val.data);
}
