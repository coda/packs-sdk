import {CodaMarshalerType} from './constants';
import {MarshalingInjectedKeys} from './constants';

export function marshalBuffer(val: any): object | undefined {
  if (Buffer.isBuffer(val)) {
    return {
      data: [...Uint8Array.from(val)],
      [MarshalingInjectedKeys.CodaMarshaler]: CodaMarshalerType.Buffer,
    };
  }
}

export function unmarshalBuffer(val: {[key: string]: any}): Buffer | undefined {
  if (typeof val !== 'object' || val[MarshalingInjectedKeys.CodaMarshaler] !== CodaMarshalerType.Buffer) {
    return;
  }
  return Buffer.from(val.data as Uint8Array);
}
