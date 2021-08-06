import {StatusCodeError} from '../api';
import {inspect} from 'util';
import {marshalValue} from '../runtime/common/marshaling';
import {unmarshalValue} from '../runtime/common/marshaling';

describe('Marshaling', () => {
  function transform<T>(val: T): T {
    return unmarshalValue(marshalValue(val));
  }

  it('works for regular objects', () => {
    // this test covers most of https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects

    assert.deepEqual(1, transform(1));
    assert.deepEqual(1.1, transform(1.1));
    assert.deepEqual('1', transform('1'));
    assert.deepEqual([1], transform([1]));
    assert.deepEqual({a: 1}, transform({a: 1}));
    assert.deepEqual(undefined, transform(undefined));
    assert.deepEqual(null, transform(null));
    assert.deepEqual(true, transform(true));
    assert.deepEqual(Number(123), transform(Number(123)));
    assert.deepEqual(NaN, transform(NaN));
    assert.deepEqual(Infinity, transform(Infinity));
    assert.deepEqual(new Date(123), transform(new Date(123)));

    // the following doesn't work yet.
    // assert.deepEqual(/123/, transform(/123/));
    // assert.deepEqual(Uint8Array.from([1, 2, 3]), transform(Uint8Array.from([1, 2, 3])));
    // assert.deepEqual(new Set([1, 2]), transform(new Set([1, 2])));
    // assert.deepEqual(new Map([['a', 2]]), transform(new Map([['a', 2]])));
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
      assertErrorsEqual(error, transform(error));
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
      assertErrorsEqual(error, transformedError);
      assert.isTrue(transformedError instanceof StatusCodeError);
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
