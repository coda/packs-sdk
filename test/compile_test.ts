import {compilePackBundle} from '../testing/compile';
import {executeFormulaOrSyncWithVM} from '../testing/execution';
import {newMockSyncExecutionContext} from '../testing/mocks';
import os from 'os';
import path from 'path';
import {readFileSync} from 'fs';
import sinon from 'sinon';
import {translateErrorStackFromVM} from '../runtime/common/source_map';

describe('compile', () => {
  it('rejects macOS versions older than Monterey', async () => {
    const sandbox = sinon.createSandbox();
    sandbox.stub(os, 'platform').returns('darwin');
    sandbox.stub(os, 'release').returns('20.6.0');
    try {
      await compilePackBundle({manifestPath: `${__dirname}/packs/fake.ts`}).then(
        () => assert.fail('Compilation should reject unsupported macOS.'),
        error => assert.equal(error.message, 'Packs SDK requires macOS 12 (Monterey) or later'),
      );
    } finally {
      sandbox.restore();
    }
  });

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

      /* oxlint-disable stylistic/max-len */
      // the error stack should be properly formatted. for example,
      //
      // at throwError (/Users/<user>/code/packs-sdk/test/packs/fake.ts:25:9)
      // at Object.execute (/Users/<user>/code/packs-sdk/test/packs/fake.ts:58:9)
      // at executeFormula (/var/folders/n1/7qfgvcqn04j0py98bvnsnd500000gp/T/coda-packs-2e30dbce-fe91-4700-8ee7-39ef3dfafc46peyD7P/bundle.js:7012:28)
      // at Object.executeFormulaOrSync (/var/folders/n1/7qfgvcqn04j0py98bvnsnd500000gp/T/coda-packs-2e30dbce-fe91-4700-8ee7-39ef3dfafc46peyD7P/bundle.js:6995:20)
      // at <unknown> (<isolated-vm>:1:48)
      //
      // The /var/folders/.../bundle.js files are mapping to the bundle-helper and is not the Pack code.
      /* oxlint-enable stylistic/max-len */

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
      executionContext.temporaryBlobStorage.storeBlob.calledWithMatch(
        sinon.match((buffer: any) => {
          return Buffer.isBuffer(buffer);
        }),
        'text/html',
      ),
    );
  });

  it('no polyfill for vm', async () => {
    const {bundlePath} = await compilePackBundle({
      manifestPath: `${__dirname}/packs/fake_with_vm.ts`,
      minify: false,
    });
    const bundleCode = readFileSync(bundlePath);
    assert.notInclude(bundleCode.toString(), 'Script.prototype.runInNewContext');
  });
});
