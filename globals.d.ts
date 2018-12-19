import 'chai';
import 'sinon';

declare global {
  const assert: Chai.AssertStatic;
  const expect: Chai.ExpectStatic;

  // NOTE(oleg): we have to do this in two passes to work around circular dependencies.
  // See https://github.com/Microsoft/TypeScript/issues/3496
  export type $JsonSerialized<T> = T extends number | boolean | string | RegExp
    ? $_JsonSerialized<T>
    : (T extends Array<infer S> ? S[] : {[K in keyof T]: $JsonSerialized<T[K]>});

  type $_JsonSerialized<T> = T extends number
    ? T
    : T extends boolean
    ? boolean
    : T extends string
    ? T
    : T extends RegExp
    ? string
    : T extends []
    ? $_JsonSerializedArray<T[0]>
    : T extends {}
    ? {[K in keyof T]: $_JsonSerialized<T[K]>}
    : never;
  interface $_JsonSerializedArray<T> extends Array<$_JsonSerialized<T>> {}
}

declare namespace NodeJS {
  interface Global {
    assert: Chai.AssertStatic;
    expect: Chai.ExpectStatic;
  }
}
