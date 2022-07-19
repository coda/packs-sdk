interface CodaInternal {
  serializer: {
    serialize(value: any): string;
    deserialize(buffer: string): any;
  };
}

declare const codaInternal: CodaInternal;

let serialize: (value: any) => string;
let deserialize: (buffer: string) => any;

// Make sure dead code elimination removes the require('v8'), which won't be able to
// compile in the runtime thunk. We have --define:process.env.IS_THUNK=true in the
// Makefile that activates the thunk-specific code.
//
// NOTE(dweitzman): The use of process.env here feels a little weird, but I haven't found
// another way to ensure that esbuild won't complain about undeclared variables or try
// to include the 'v8' module in the thunk.
if (process.env.IS_THUNK) {
  serialize = codaInternal.serializer.serialize;
  deserialize = codaInternal.serializer.deserialize;
} else {
  const v8 = require('v8');
  serialize = (value: any): string => v8.serialize(value).toString('base64');
  deserialize = (value: any): string => v8.deserialize(Buffer.from(value, 'base64'));
}

export {serialize, deserialize};
