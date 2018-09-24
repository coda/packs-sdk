import 'chai';
import 'sinon';

declare global {
  const assert: Chai.AssertStatic;
  const expect: Chai.ExpectStatic;

  /** Returns the codomain for a map-like type. */
  type $Values<S> = S[keyof S];

  // https://github.com/Microsoft/TypeScript/issues/12215#issuecomment-378589263
  /** Returns the base type with the specified keys excluded. */
  type $Omit<T, K extends keyof T> = T extends any ? Pick<T, Exclude<keyof T, K>> : never;
}

declare namespace NodeJS {
  interface Global {
    assert: Chai.AssertStatic;
    expect: Chai.ExpectStatic;
  }
}
