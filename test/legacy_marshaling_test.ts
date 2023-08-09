import {MissingScopesError} from '../api';
import {StatusCodeError} from '../api';
import {inspect} from 'util';
import {marshalValueForAnyNodeVersion as marshalValueForAnyNodeVersion} from '../helpers/legacy_marshal';
import {unmarshalValueFromString} from '../runtime/common/marshaling';

describe('Legacy marshaling', () => {
  function transform<T>(val: T): T {
    return unmarshalValueFromString(marshalValueForAnyNodeVersion(val));
  }

  it('works for regular objects', () => {
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

    // the following doesn't work yet.
    // assert.deepEqual(transform(/123/), /123/);
    // assert.deepEqual(transform(Uint8Array.from([1, 2, 3])), Uint8Array.from([1, 2, 3]));
    // assert.deepEqual(transform(new Set([1, 2])), new Set([1, 2]));
    // assert.deepEqual(transform(new Map([['a', 2]])), new Map([['a', 2]]));
  });

  it('works for a variety of compound objects', () => {
    const testObjects: any = [
      [null, undefined, 0, false, NaN, Infinity, {undefined: 1, null: undefined}],
      {Array: [], Boolean: false, new: {_: null}, function: undefined, NaN: 1},
      [{undefined: [{false: [{true: [{null: 0}]}]}]}],
    ];
    testObjects.forEach((x: any) => assert.deepEqual(transform(x), x));
  });

  it('does not throw error for unhandled objects', () => {
    transform(() => {});
    transform(new (class {})());
    transform(new ArrayBuffer(10));
    void transform(new Promise(resolve => resolve(1)));
  });

  it('works for nested objects', () => {
    const error = new Error('test');
    const transformedError = transform({error}).error;
    assert.isTrue(transformedError instanceof Error);
    assert.equal(transformedError.message, 'test');
  });

  describe('Errors', () => {
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

    it('works for common system errors', () => {
      const typeError = new TypeError('test');
      const transformedError = transform(typeError);
      assertErrorsEqual(typeError, transformedError);
      assert.isTrue(transformedError instanceof TypeError);
    });

    it('works for whitelisted coda errors', () => {
      const error = new StatusCodeError(404, '', {url: 'https://coda.io', method: 'GET'}, {headers: {}, body: ''});
      const transformedError = transform(error);
      assertErrorsEqual(transformedError, error);
      assert.isTrue(transformedError instanceof StatusCodeError);

      const missingScopesError = new MissingScopesError('custom message');
      const transformedMissingScopesError = transform(missingScopesError);
      assertErrorsEqual(transformedMissingScopesError, missingScopesError);
      assert.isTrue(transformedMissingScopesError instanceof MissingScopesError);
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
});
