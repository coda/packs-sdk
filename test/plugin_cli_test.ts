import './test_helper';
import {formatScaffoldResult} from '../cli/plugin_output';
import fs from 'fs';
import {isExistingPlugin} from '../cli/plugin_output';
import os from 'os';
import path from 'path';
import {scaffoldPlugin} from '../plugin/listing';

describe('Plugin CLI', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'plugin-cli-'));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, {recursive: true, force: true});
  });

  it('returns machine-readable scaffold paths', () => {
    const targetDir = path.join(tmpDir, 'radical-candor');
    scaffoldPlugin(targetDir, 'radical-candor');

    const result = JSON.parse(formatScaffoldResult('radical-candor', targetDir, 'created', 'json'));
    assert.equal(result.status, 'created');
    assert.equal(result.name, 'radical-candor');
    assert.equal(result.pluginJson, path.join(targetDir, 'plugin.json'));
    assert.deepEqual(result.files, [
      path.join(targetDir, 'plugin.json'),
      path.join(targetDir, 'SETUP.md'),
      path.join(targetDir, 'agent', 'pack.ts'),
      path.join(targetDir, 'connector', 'pack.ts'),
    ]);
  });

  it('recognizes an existing valid scaffold as unchanged', () => {
    const targetDir = path.join(tmpDir, 'radical-candor');
    scaffoldPlugin(targetDir, 'radical-candor');

    assert.isTrue(isExistingPlugin(path.join(targetDir, 'plugin.json'), 'radical-candor'));
    const result = JSON.parse(formatScaffoldResult('radical-candor', targetDir, 'unchanged', 'json'));
    assert.equal(result.status, 'unchanged');
  });
});
