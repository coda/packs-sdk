import {LegacyCodaMarshalerType} from './constants';
import {LegacyMarshalingInjectedKeys} from './constants';

export function marshalDate(val: any): object | undefined {
  if (val instanceof Date) {
    return {
      date: val.toJSON(),
      [LegacyMarshalingInjectedKeys.CodaMarshaler]: LegacyCodaMarshalerType.Date,
    } as any;
  }
}

export function unmarshalDate(val: {[key: string]: any}): Date | undefined {
  if (typeof val !== 'object' || val[LegacyMarshalingInjectedKeys.CodaMarshaler] !== LegacyCodaMarshalerType.Date) {
    return;
  }
  return new Date(Date.parse(val.date));
}
