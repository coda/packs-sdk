interface CodaInternal {
  serializer: {
    serialize(value: any): string;
    deserialize(buffer: string): any;
  };
}

declare const codaInternal: CodaInternal;

let serialize: (value: any) => string;
let deserialize: (buffer: string) => any;

if (process.env.IS_THUNK) {
  serialize = codaInternal.serializer.serialize;
  deserialize = codaInternal.serializer.deserialize;
} else {
  const v8 = require('v8');
  serialize = (value: any): string => v8.serialize(value).toString('base64');
  deserialize = (value: any): string => v8.deserialize(Buffer.from(value, 'base64'));
}

export {serialize, deserialize};
