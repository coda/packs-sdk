import {CodaMarshalerType} from './constants';
import {MarshalingInjectedKeys} from './constants';

export function marshalDate(val: any): object | undefined {
  if (val instanceof Date) {
    return {
      date: val.toJSON(),
      [MarshalingInjectedKeys.CodaMarshaler]: CodaMarshalerType.Date,
    } as any;
  }
}

export function unmarshalDate(val: {[key: string]: any}): Date | undefined {
  if (typeof val !== 'object' || val[MarshalingInjectedKeys.CodaMarshaler] !== CodaMarshalerType.Date) {
    return;
  }
  return new Date(Date.parse(val.date));
}
