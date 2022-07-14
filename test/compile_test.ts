import {compilePackBundle} from '../testing/compile';
import {executeFormulaOrSyncWithVM} from '../testing/execution';
import {newMockSyncExecutionContext} from '../testing/mocks';
import path from 'path';
import {translateErrorStackFromVM} from '../runtime/common/source_map';

describe('compile', () => {
  it('works with source map', async () => {
    const {bundlePath, bundleSourceMapPath} = await compilePackBundle({
      manifestPath: `${__dirname}/packs/fake.ts`,
      minify: false,
    });
    try {
      await executeFormulaOrSyncWithVM({
        formulaName: 'Throw',
        params: [],
        bundlePath,
      });

      assert.fail('Throw formula should throw.');
    } catch (error: any) {
      const stack = await translateErrorStackFromVM({
        stacktrace: error.stack,
        bundleSourceMapPath,
        vmFilename: bundlePath,
      });

      /* eslint-disable max-len */
      // the error stack should be properly formatted. for example,
      //
      // at throwError (/Users/huayang/code/packs-sdk/test/packs/fake.ts:25:9)    at Object.execute (/Users/huayang/code/packs-sdk/test/packs/fake.ts:58:9)
      // at executeFormula (/var/folders/n1/7qfgvcqn04j0py98bvnsnd500000gp/T/coda-packs-2e30dbce-fe91-4700-8ee7-39ef3dfafc46peyD7P/bundle.js:7012:28)
      // at Object.executeFormulaOrSync (/var/folders/n1/7qfgvcqn04j0py98bvnsnd500000gp/T/coda-packs-2e30dbce-fe91-4700-8ee7-39ef3dfafc46peyD7P/bundle.js:6995:20)
      // at <unknown> (<isolated-vm>:1:48)
      //
      // The /var/folders/.../bundle.js files are mapping to the bundle-helper and is not the Pack code.
      /* eslint-enable max-len */

      assert.include(stack, path.join(__dirname, 'packs/fake.ts'));
    }
  });

  it('works with minify', async () => {
    const {bundlePath, bundleSourceMapPath} = await compilePackBundle({
      manifestPath: `${__dirname}/packs/fake.ts`,
      minify: true,
    });
    try {
      await executeFormulaOrSyncWithVM({
        formulaName: 'Throw',
        params: [],
        bundlePath,
      });

      assert.fail('Throw formula should throw.');
    } catch (error: any) {
      const stack = await translateErrorStackFromVM({
        stacktrace: error.stack,
        bundleSourceMapPath,
        vmFilename: bundlePath,
      });

      assert.include(stack, path.join(__dirname, 'packs/fake.ts'));
    }
  });

  it('works with buffer', async () => {
    const {bundlePath} = await compilePackBundle({
      manifestPath: `${__dirname}/packs/fake.ts`,
      minify: false,
    });
    const executionContext = newMockSyncExecutionContext();
    const response = await executeFormulaOrSyncWithVM({
      formulaName: 'marshalBuffer',
      params: [],
      bundlePath,
      executionContext,
    });
    assert.equal(response, 'okay');
    assert.isTrue(
      executionContext.temporaryBlobStorage.storeBlob.calledWithMatch((buffer: any) => {
        return Buffer.isBuffer(buffer);
      }, 'text/html'),
    );
  });
});
