import 'chai';

declare global {
  const assert: Chai.AssertStatic;
  const expect: Chai.ExpectStatic;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare namespace NodeJS {
  interface Global {
    assert: Chai.AssertStatic;
    expect: Chai.ExpectStatic;
  }
}
