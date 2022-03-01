import type {PackVersionDefinition} from '../types';
import {PublicApiType} from '../helpers/external-api/v1';
import {compilePackMetadata} from '../helpers/metadata';
import {formatWhoami} from '../cli/whoami';
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

      // This in invalid but the regex allows it for now.
      assert.equal(parsePackIdOrUrl('https://coda.io/p/1234/5678'), 1234);

      assert.equal(parsePackIdOrUrl('https://coda.io/p/1234?section=listing'), 1234);
      assert.equal(parsePackIdOrUrl('https://subdomain.coda.io:6780/p/1234?section=listing'), 1234);
      assert.equal(parsePackIdOrUrl('https://coda.io/packs/foo-1234'), 1234);
      assert.equal(parsePackIdOrUrl('https://subdomain.coda.io:6789/packs/foo-1234'), 1234);

      assert.equal(parsePackIdOrUrl('https://coda.io/packs/foo-bar-1234-5678'), 5678);
    });

    it('rejects bad IDs', () => {
      assert.equal(parsePackIdOrUrl('not a number'), null);
      assert.equal(parsePackIdOrUrl('12 34'), null);
      assert.equal(parsePackIdOrUrl(''), null);
      assert.equal(parsePackIdOrUrl('-10'), null);
      assert.equal(parsePackIdOrUrl('https://coda.io/d/1234'), null);
      assert.equal(parsePackIdOrUrl('https://codadoc.io/p/1234'), null);
      assert.equal(parsePackIdOrUrl('https://coda.io/packs/foo'), null);
      assert.equal(parsePackIdOrUrl('https://coda.io/packs/foo-1234/5678'), null);
    });
  });

  describe('format whoami result', () => {
    it('represents the token', () => {
      const nonScopedToken = {
        name: 'Some Name',
        loginId: 'email@example.com',
        scoped: false,
        tokenName: "This Token's Name",
        type: PublicApiType.User as const,
        href: 'some link',
        workspace: {
          id: 'abc',
          type: PublicApiType.Workspace as const,
          browserLink: 'browser link',
        },
      };
      assert.equal(
        formatWhoami(nonScopedToken),
        `You are Some Name (email@example.com) using non-scoped token "This Token's Name"`,
      );

      assert.equal(
        formatWhoami({...nonScopedToken, scoped: true}),
        `You are Some Name (email@example.com) using scoped token "This Token's Name"`,
      );
    });
  });
});
