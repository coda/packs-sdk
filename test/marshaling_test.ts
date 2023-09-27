import {MissingScopesError} from '../api';
import {StatusCodeError} from '../api';
import {getIvm} from '../testing/ivm_wrapper';
import {inspect} from 'util';
import {marshalValue} from '../runtime/common/marshaling';
import {marshalValuesForLogging} from '../runtime/common/marshaling';
import {tryGetIvm} from '../testing/ivm_wrapper';
import {unmarshalValue} from '../runtime/common/marshaling';
import {unwrapError} from '../runtime/common/marshaling';
import {wrapErrorForSameOrHigherNodeVersion} from '../runtime/common/marshaling';

describe('Marshaling', () => {
  const describeVmOnly = tryGetIvm() ? describe : describe.skip;

  // The purpose of marshaling is to make sure values get into and out of isolated-vm without
  // raising errors or getting garbled, so during the tests we'll actually pass values into
  // and out of isolated-vm to ensure that works correctly.
  function passThroughIsolatedVm<T>(val: T): T {
    const ivm = getIvm();
    const isolate = new ivm.Isolate({memoryLimit: 12});
    const ivmContext = isolate.createContextSync();

    return ivmContext.evalClosureSync(`return $0`, [val], {
      arguments: {copy: true},
      result: {copy: true},
    });
  }

  function transform<T>(val: T): T {
    return unmarshalValue(passThroughIsolatedVm(marshalValue(val)));
  }

  function transformError(val: Error): Error {
    return unwrapError(new Error(passThroughIsolatedVm(wrapErrorForSameOrHigherNodeVersion(val).message)));
  }

  function transformForLogging(vals: any[]): any[] {
    return passThroughIsolatedVm(marshalValuesForLogging(vals)).map(unmarshalValue);
  }

  it('works for regular objects', async () => {
    // this test covers most of https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects

    assert.deepEqual(transform(1), 1);
    assert.deepEqual(transform(1.1), 1.1);
    assert.deepEqual(transform('1'), '1');
    assert.deepEqual(transform([1]), [1]);
    assert.deepEqual(transform({a: 1}), {a: 1});
    assert.deepEqual(transform(undefined), undefined);
    assert.deepEqual(transform([undefined]), [undefined]);
    assert.deepEqual(transform({a: undefined}), {a: undefined});
    assert.deepEqual(transform(null), null);
    assert.deepEqual(transform([null]), [null]);
    assert.deepEqual(transform(true), true);
    assert.deepEqual(transform(Number(123)), Number(123));
    assert.deepEqual(transform(NaN), NaN);
    assert.deepEqual(transform(Infinity), Infinity);
    assert.deepEqual(transform(new Date(123)), new Date(123));
    assert.deepEqual(transform(/123/), /123/);
    assert.deepEqual(transform(new Set([1, 2])), new Set([1, 2]));
    assert.deepEqual(transform(new Map([['a', 2]])), new Map([['a', 2]]));
    assert.throws(() => transform(Uint8Array.from([1, 2, 3])), /Cannot marshal buffer views/);
    assert.deepEqual(transform(new ArrayBuffer(10)), new ArrayBuffer(10));

    class SomeClass {
      message: string;
      constructor(message: string) {
        this.message = message;
      }
    }
    assert.deepEqual(transform(new (class {})()), {});
    assert.deepEqual(transform(new SomeClass('hi')), {message: 'hi'});
  });

  it('does not modify input objects', () => {
    // Put buffers within frozen objects and arrays, which should raise an error if transform tries to modify
    // them.
    const testObj: any = Object.freeze({
      str: 'bar',
      arr: Object.freeze([1, 2, 3, Buffer.from('123')]),
      nested: Object.freeze({buf: Buffer.from('123')}),
    });
    assert.deepEqual(transform(testObj), testObj);

    // Just make sure there's no error about modifying a frozen object.
    transform(
      Object.freeze({
        err: new Error('err'),
      }),
    );
  });

  it('works for a variety of compound objects', () => {
    const testObjects: any = [
      [null, undefined, 0, false, NaN, Infinity, {undefined: 1, null: undefined}],
      {Array: [], Boolean: false, new: {_: null}, function: undefined, NaN: 1},
      [{undefined: [{false: [{true: [{null: 0}]}]}]}],
      ['foo', {1: Buffer.from('bar')}, [[Buffer.from('baz')]]],
    ];
    testObjects.forEach((x: any) => assert.deepEqual(transform(x), x));
  });

  it('throws error for unhandled objects', () => {
    assert.throws(() => transform(() => {}), '() => { } could not be cloned.');
    assert.throws(() => void transform(new Promise(resolve => resolve(1))), '#<Promise> could not be cloned.');
  });

  it('works for nested objects', () => {
    const error = new Error('test');
    const transformedError = transform([{error}])[0].error;
    assert.isTrue(transformedError instanceof Error);
    assert.equal(transformedError.message, 'test');

    const typeError = new TypeError('test');
    const transformedTypeError = transform([{typeError}])[0].typeError;
    assert.isTrue(transformedTypeError instanceof TypeError);
    assert.equal(transformedTypeError.message, 'test');
  });

  describeVmOnly('Errors', () => {
    function assertErrorsEqual(a: Error, b: Error) {
      assert.equal(a.name, b.name);
      assert.equal(a.stack, b.stack);
      assert.equal(a.message, b.message);
      assert.equal(inspect(a), inspect(b));

      // this will fail since the transformed error may have an additional name property.
      // assert.equal(JSON.stringify(a), JSON.stringify(b));
    }

    it('works for regular error', () => {
      const error = new Error('test');
      assertErrorsEqual(transform(error), error);
    });

    // We test wrapError/unwrapError with "transformError", which has stricter serialization
    // requirements than the normal marshalValue()/unmarshalValue() functions since it needs
    // to be encoded as a string (not just a copyable object).

    it('works for common system errors', () => {
      const typeError = new TypeError('test');
      const transformedError = transformError(typeError);
      assertErrorsEqual(typeError, transformedError);
      assert.isTrue(transformedError instanceof TypeError);
    });

    it('works for whitelisted coda errors', () => {
      const error = new StatusCodeError(404, '', {url: 'https://coda.io', method: 'GET'}, {headers: {}, body: ''});

      const transformedError = transformError(error) as StatusCodeError;
      assertErrorsEqual(transformedError, error);
      assert.isTrue(transformedError instanceof StatusCodeError);

      const missingScopesError = new MissingScopesError('custom message');
      const transformedMissingScopesError = transformError(missingScopesError);
      assertErrorsEqual(transformedMissingScopesError, missingScopesError);
      assert.isTrue(transformedMissingScopesError instanceof MissingScopesError);
    });

    it('preserves custom type information on custom errors', () => {
      class CustomError extends Error {
        customData: any;
        constructor(message: string, customData: any) {
          super(message);
          this.customData = customData;
        }
      }

      const customError = new CustomError('outer error', {
        date: new Date(123),
        nan: NaN,
        inf: Infinity,
        undef: undefined,
        nulled: null,
        buffer: Buffer.from('abc'),
        embeddedError: new TypeError('inner type error'),
      });

      const transformedError = transformError(customError) as CustomError;

      const {embeddedError: transformedEmbeddedError, ...transformedCustomData} = transformedError.customData;
      const {embeddedError: origEmbeddedError, ...origCustomData} = customError.customData;
      assert.deepEqual(transformedCustomData, origCustomData);
      assert.equal(transformedError.name, customError.name);
      assertErrorsEqual(transformedEmbeddedError, origEmbeddedError);
    });
  });

  it('works for Buffer', () => {
    const buffer = Buffer.from('some testing data');
    assert.isTrue(buffer.equals(transform(buffer)));
    assert.isTrue(Buffer.isBuffer(transform(buffer)));
  });

  it('toJSON override does not apply if not marshaling', () => {
    assert.isString(new Date().toJSON());
  });

  it('returns an error trying to unmarshal something that was never marshaled to begin with', () => {
    assert.throws(() => unmarshalValue(undefined), 'Not a marshaled value: undefined');
    assert.throws(() => unmarshalValue(1), 'Not a marshaled value: 1');
    assert.throws(() => unmarshalValue({foo: 'bar'}), 'Not a marshaled value: {"foo":"bar"}');
  });

  it('marshals values for logging', () => {
    assert.deepEqual(transformForLogging(['one string']), ['one string']);
    assert.deepEqual(transformForLogging(['two', 'strings']), ['two strings']);
    assert.deepEqual(transformForLogging(['a %s c', 'b']), ['a b c']);
    // NOTE: The %o here won't actually work inside of thunks because the pure-js
    // implementation of util.format used with esbuild doesn't support it. See thunk_test.js
    assert.deepEqual(transformForLogging(['%o vs %j', {a: 'b'}, {a: 'b'}]), [`{ a: 'b' } vs {"a":"b"}`]);
    assert.deepEqual(transformForLogging([{someFunc: () => 1, somePromise: Promise.resolve(1)}]), [
      '{ someFunc: [Function: someFunc], somePromise: Promise { 1 } }',
    ]);
  });
});
