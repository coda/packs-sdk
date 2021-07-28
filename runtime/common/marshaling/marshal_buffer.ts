import {CodaMarshalerType} from './constants';
import {MarshalingInjectedKeys} from './constants';

export function marshalBuffer(val: any): object | undefined {
  // Buffer is not provided by IVM. If the bundle is not browserified, global.Buffer will be undefined.
  if (global.Buffer && val instanceof Buffer) {
    return {
      data: [...Uint8Array.from(val)],
      [MarshalingInjectedKeys.CodaMarshaler]: CodaMarshalerType.Buffer,
    };
  }
}

export function unmarshalBuffer(val: {[key: string]: any}): Buffer | undefined {
  // Buffer is not provided by IVM. If the bundle is not browserified, global.Buffer will be undefined.
  if (!global.Buffer) {
    return;
  }

  if (typeof val !== 'object' || val[MarshalingInjectedKeys.CodaMarshaler] !== CodaMarshalerType.Buffer) {
    return;
  }
  return Buffer.from(val.data as Uint8Array);
}
