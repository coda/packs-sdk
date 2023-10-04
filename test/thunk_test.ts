import {testHelper} from './test_helper';
import {getThunkPath} from '../runtime/bootstrap';
import {injectLogFunction} from '../runtime/bootstrap';
import {injectSerializer} from '../runtime/bootstrap';
import {marshalValue} from '../runtime/common/marshaling';
import {registerBundle} from '../runtime/bootstrap';
import {tryGetIvm} from '../testing/ivm_wrapper';

const describeVmOnly = tryGetIvm() ? describe : describe.skip;

describeVmOnly('Thunk', () => {
  const ivm = tryGetIvm()!;

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
    await jail.set('global', jail.derefInto());
    await jail.set('test', undefined, {copy: true});
    await jail.set('codaInternal', {serializer: {}}, {copy: true});
    await injectSerializer(ivmContext, 'codaInternal.serializer');

    await registerBundle(isolate, ivmContext, getThunkPath(), 'test');
  });

  it('the compiled thunk bundle has buffer', async () => {
    const isolate = new ivm.Isolate({memoryLimit: 128});

    // context is like a container in ivm concept.
    const ivmContext = await isolate.createContext();
    const jail = ivmContext.global;
    await jail.set('global', jail.derefInto());
    await jail.set('thunk', {}, {copy: true});
    await jail.set('codaInternal', {serializer: {}}, {copy: true});
    await injectSerializer(ivmContext, 'codaInternal.serializer');

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

  // Regression test for o/bug/23967
  it('marshaling buffers uses a reasonable amount memory', async () => {
    const isolate = new ivm.Isolate({memoryLimit: 30});

    // context is like a container in ivm concept.
    const ivmContext = await isolate.createContext();
    const jail = ivmContext.global;
    await jail.set('global', jail.derefInto());
    await jail.set('thunk', {}, {copy: true});
    await jail.set('codaInternal', {serializer: {}}, {copy: true});

    await injectSerializer(ivmContext, 'codaInternal.serializer');
    await registerBundle(isolate, ivmContext, getThunkPath(), 'thunk');

    const startingHeapSize = (await isolate.getHeapStatistics()).total_heap_size;

    const result = await ivmContext.evalClosure(`
      // Add "Buffer" object to the context.
      thunk.setUpBufferForTest();

      // Allocate 4mb buffer
      const buffer = Buffer.alloc(1024*1024*4);

      for (let i = 0; i < buffer.length; i++) {
        buffer.writeInt8(i % 8, i);
      }

      const transformedBuffer = thunk.unmarshalValue(thunk.marshalValue(buffer));

      return buffer.equals(transformedBuffer);
    `);

    assert.equal(result, true);

    const endingHeapSize = (await isolate.getHeapStatistics()).total_heap_size;
    // It should take <8mb of memory to allocate, marshal, and unmarshal
    // a 4mb Buffer. The buffer gets base6-encoded which is a 4/3 increase in size.
    assert.operator(endingHeapSize - startingHeapSize, '<', 1024 * 1024 * 8);
  });

  it('marshaling errors to strings works with the injected serialize functions', async () => {
    const isolate = new ivm.Isolate({memoryLimit: 30});

    // context is like a container in ivm concept.
    const ivmContext = await isolate.createContext();
    const jail = ivmContext.global;
    await jail.set('global', jail.derefInto());
    await jail.set('thunk', {}, {copy: true});
    await jail.set('codaInternal', {serializer: {}}, {copy: true});

    await injectSerializer(ivmContext, 'codaInternal.serializer');
    await registerBundle(isolate, ivmContext, getThunkPath(), 'thunk');

    const result = await ivmContext.evalClosure(`
      // Add "Buffer" object to the context.
      thunk.setUpBufferForTest();

      // Allocate 4mb buffer
      // const buffer = Buffer.alloc(1024*1024*4);
      const buffer = Buffer.from("abc");

      for (let i = 0; i < buffer.length; i++) {
        buffer.writeInt8(i % 8, i);
      }

      const encoded = thunk.marshalValueToStringForSameOrHigherNodeVersion(buffer);
      const transformedBuffer = thunk.unmarshalValueFromString(encoded);

      return buffer.equals(transformedBuffer) && typeof encoded === 'string';
    `);

    assert.equal(result, true);
  });

  it('log marshaling works', async () => {
    const isolate = new ivm.Isolate({memoryLimit: 128});

    // context is like a container in ivm concept.
    const ivmContext = await isolate.createContext();
    const jail = ivmContext.global;
    await jail.set('global', jail.derefInto());
    await jail.set('coda', {}, {copy: true});

    const savedArgs: string[] = [];
    await injectLogFunction(ivmContext, 'console.log', args => savedArgs.push(args));

    await registerBundle(isolate, ivmContext, getThunkPath(), 'coda');

    await ivmContext.evalClosure(
      `
        console.log("%s vs %j", {a: "b"}, {a: "b"});
        console.log("foo", "bar", {a: "b"});
        console.log("foo %s baz", "bar");
        console.log({someFunc: () => 1, somePromise: Promise.resolve(1)});
        console.log(new Error("some error"));
        console.log("%o", {a: "b"});
      `,
      [],
      {},
    );

    assert.deepEqual(savedArgs, [
      `[object Object] vs {"a":"b"}`,
      "foo bar { a: 'b' }",
      'foo bar baz',
      '{ someFunc: [Function: someFunc], somePromise: {} }',
      '[Error: some error]',
      // Note the "%o" isn't supported due to limitations of util.format in pure js with esbuild.
      "%o { a: 'b' }",
    ]);
  });
});
