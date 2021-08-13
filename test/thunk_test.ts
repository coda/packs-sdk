import {testHelper} from './test_helper';
import {getThunkPath} from '../runtime/bootstrap';
import ivm from 'isolated-vm';
import {marshalValue} from '../runtime/common/marshaling';
import {registerBundle} from '../runtime/bootstrap';

describe('Thunk', () => {
  it('invalid bundle should not pass this test', async () => {
    const isolate = new ivm.Isolate({memoryLimit: 128});

    // context is like a container in ivm concept.
    const ivmContext = await isolate.createContext();

    const script = await isolate.compileScript('var fs = require("fs")');
    await testHelper.willBeRejectedWith(script.run(ivmContext), /require is not defined/);
  });

  it('should bundle and run in an IVM context', async () => {
    const isolate = new ivm.Isolate({memoryLimit: 128});

    // context is like a container in ivm concept.
    const ivmContext = await isolate.createContext();
    const jail = ivmContext.global;
    await jail.set('test', undefined, {copy: true});

    await registerBundle(isolate, ivmContext, getThunkPath(), 'test');
  });

  it('the compiled thunk bundle has buffer', async () => {
    const isolate = new ivm.Isolate({memoryLimit: 128});

    // context is like a container in ivm concept.
    const ivmContext = await isolate.createContext();
    const jail = ivmContext.global;
    await jail.set('global', jail.derefInto());
    await jail.set('thunk', {}, {copy: true});

    await registerBundle(isolate, ivmContext, getThunkPath(), 'thunk');

    const result = await ivmContext.evalClosure(
      'return thunk.unmarshalValue($0).constructor.name;',
      [marshalValue(Buffer.from(''))],
      {
        arguments: {copy: true},
      },
    );

    assert.isTrue(result !== 'Object');
  });
});
