export enum LegacyCodaMarshalerType {
  Error = 'Error',
  Buffer = 'Buffer',
  Number = 'Number',
  Date = 'Date',
}

export enum LegacyMarshalingInjectedKeys {
  CodaMarshaler = '__coda_marshaler__',
  ErrorClassName = '__error_class_name__',
  ErrorClassType = '__error_class_type__',
}
