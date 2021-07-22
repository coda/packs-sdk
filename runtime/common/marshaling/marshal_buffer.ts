import {MarshalingInjectedKeys} from './constants';
import {isMarshaling} from './config';

const existingToJSON = Buffer.prototype.toJSON;

Buffer.prototype.toJSON = function () {
  if (!isMarshaling()) {
    return existingToJSON.call(this);
  }

  return {
    ...existingToJSON.call(this),
    [MarshalingInjectedKeys.IsBuffer]: true,
  };
};

export function marshalBuffer(val: any): void {
  if (val instanceof Buffer) {
    // native Buffer defines its toJSON() function, which runs before serializer.
    throw new Error('Unexpected Buffer');
  }
}

export function unmarshalBuffer(val: {[key: string]: any}): Buffer | undefined {
  if (typeof val !== 'object' || !val[MarshalingInjectedKeys.IsBuffer]) {
    return;
  }
  return Buffer.from(val.data as Uint8Array);
}
