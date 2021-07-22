import {finishMarshaling} from './config';
import {marshalBuffer} from './marshal_buffer';
import {marshalDate} from './marshal_dates';
import {marshalError} from './marshal_errors';
import {marshalNumber} from './marshal_numbers';
import {startMarshaling} from './config';
import {unmarshalBuffer} from './marshal_buffer';
import {unmarshalDate} from './marshal_dates';
import {unmarshalError} from './marshal_errors';
import {unmarshalNumber} from './marshal_numbers';

const customMarshalers = [marshalError, marshalBuffer, marshalNumber, marshalDate];

const customUnmarshalers: Array<(val: any) => any> = [unmarshalError, unmarshalBuffer, unmarshalNumber, unmarshalDate];

function serializer(_: string, val: any): any {
  for (const marshaler of customMarshalers) {
    const result = marshaler(val);
    if (result !== undefined) {
      return result;
    }
  }

  return val;
}

function deserializer(_: string, val: any): any {
  if (val) {
    for (const unmarshaler of customUnmarshalers) {
      const result = unmarshaler(val);
      if (result !== undefined) {
        return result;
      }
    }
  }

  return val;
}

export function marshalValue(val: any): string | undefined {
  try {
    startMarshaling();
    return JSON.stringify(val, serializer);
  } finally {
    finishMarshaling();
  }
}

export function unmarshalValue(marshaledValue: string | undefined): any {
  if (marshaledValue === undefined) {
    return marshaledValue;
  }

  return JSON.parse(marshaledValue, deserializer);
}
