import {MarshalingInjectedKeys} from './constants';

export function marshalBuffer(val: any): object | undefined {
  if (val instanceof Buffer) {
    return {
      data: [...Uint8Array.from(val)],
      [MarshalingInjectedKeys.IsBuffer]: true,
    };
  }
}

export function unmarshalBuffer(val: {[key: string]: any}): Buffer | undefined {
  if (typeof val !== 'object' || !val[MarshalingInjectedKeys.IsBuffer]) {
    return;
  }
  return Buffer.from(val.data as Uint8Array);
}
