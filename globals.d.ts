import 'chai';
import 'sinon';

declare global {
  const assert: Chai.AssertStatic;
  const expect: Chai.ExpectStatic;
}

declare namespace NodeJS {
  interface Global {
    assert: Chai.AssertStatic;
    expect: Chai.ExpectStatic;
  }
}
