import { LegacyCodaMarshalerType } from './constants';
import { LegacyMarshalingInjectedKeys } from './constants';
export function marshalDate(val) {
    if (val instanceof Date) {
        return {
            date: val.toJSON(),
            [LegacyMarshalingInjectedKeys.CodaMarshaler]: LegacyCodaMarshalerType.Date,
        };
    }
}
export function unmarshalDate(val) {
    if (typeof val !== 'object' || val[LegacyMarshalingInjectedKeys.CodaMarshaler] !== LegacyCodaMarshalerType.Date) {
        return;
    }
    return new Date(Date.parse(val.date));
}
