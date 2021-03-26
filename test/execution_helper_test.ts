import {testHelper} from './test_helper';
import * as esbuild from 'esbuild';
import ivm from 'isolated-vm';
import { registerBundle } from '../testing/ivm_helper';


describe('Bundle Execution Helper', () => {
  it('invalid bundle should not pass this test', async () => {
    const isolate = new ivm.Isolate({ memoryLimit: 128 });

    // context is like a container in ivm concept.
    const ivmContext = await isolate.createContext();

    const script = await isolate.compileScript('var fs = require("fs")');
    await testHelper.willBeRejectedWith(script.run(ivmContext), /require is not defined/);      
  });

  it('should bundle and run in an IVM context', async () => {
    const outputFilePath = 'dist/test/execution_helper_bundle.js';
    const options: esbuild.BuildOptions = {
      banner: {js: "'use strict';"},
      bundle: true,
      entryPoints: [`./testing/execution_helper.js`],
      outfile: outputFilePath,
      format: 'cjs',
    };
    
    await esbuild.build(options);
    
    const isolate = new ivm.Isolate({ memoryLimit: 128 });

    // context is like a container in ivm concept.
    const ivmContext = await isolate.createContext();
    const jail = ivmContext.global;
    await jail.set('test', undefined, {copy: true});
  
    await registerBundle(isolate, ivmContext, outputFilePath, 'test');
  });
});