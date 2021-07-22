import {MarshalingInjectedKeys} from './constants';
import {isMarshaling} from './config';

const existingToJSON = Date.prototype.toJSON;

// Date toJSON returns a string that can't identify its type. We had to convert this into an object instead.
Date.prototype.toJSON = function () {
  if (!isMarshaling()) {
    return existingToJSON.call(this);
  }

  return {
    date: existingToJSON.call(this),
    [MarshalingInjectedKeys.IsDate]: true,
  } as any;
};

export function marshalDate(val: any): void {
  if (val instanceof Date) {
    // native Date defines its toJSON() function, which runs before serializer.
    throw new Error('Unexpected Date');
  }
}

export function unmarshalDate(val: {[key: string]: any}): Date | undefined {
  if (typeof val !== 'object' || !val[MarshalingInjectedKeys.IsDate]) {
    return;
  }
  return new Date(Date.parse(val.date));
}
