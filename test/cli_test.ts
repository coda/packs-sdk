import type {PackVersionDefinition} from '../types';
import {compilePackMetadata} from '../helpers/metadata';
import {parsePackIdOrUrl} from '../cli/link';

describe('CLI', () => {
  describe('compile pack metadata', () => {
    it('compiles undefined formulas, formats, and synctables into empty arrays', () => {
      const packDef: PackVersionDefinition = {
        version: '1',
      };
      const metadata = compilePackMetadata(packDef as any); // Cast due to overload confusion.
      assert.deepEqual(metadata.formulas, []);
      assert.deepEqual(metadata.syncTables, []);
      assert.deepEqual(metadata.formats, []);
    });
  });

  describe('parse pack ID or URL', () => {
    it('correctly parses valid IDs', () => {
      assert.equal(parsePackIdOrUrl('1234'), 1234);
      assert.equal(parsePackIdOrUrl('https://coda.io/p/1234'), 1234);
      assert.equal(parsePackIdOrUrl('https://coda.io/p/1234?section=listing'), 1234);
      assert.equal(parsePackIdOrUrl('https://subdomain.coda.io:6780/p/1234?section=listing'), 1234);
    });

    it('rejects bad IDs', () => {
      assert.equal(parsePackIdOrUrl('not a number'), null);
      assert.equal(parsePackIdOrUrl('12 34'), null);
      assert.equal(parsePackIdOrUrl(''), null);
      assert.equal(parsePackIdOrUrl('-10'), null);
      assert.equal(parsePackIdOrUrl('https://coda.io/p/1234/5678'), null);
      assert.equal(parsePackIdOrUrl('https://coda.io/d/1234'), null);
      assert.equal(parsePackIdOrUrl('https://codadoc.io/p/1234'), null);
    });
  });
});
