import type {AgentTool} from '../types';
import type {PackVersionDefinition} from '../types';
import {PublicApiType} from '../helpers/external-api/v1';
import {ResponseError} from '../helpers/external-api/coda';
import {ToolType} from '../types';
import {buildAgentChatUrl} from '../cli/agent_chat';
import {checkAgentConnectorListings} from '../cli/validate';
import {compilePackBundle} from '../testing/compile';
import {compilePackMetadata} from '../helpers/metadata';
import {formatWhoami} from '../cli/whoami';
import fs from 'fs-extra';
import {getApiTokenCreationUrl} from '../cli/register';
import {getConnectorPackIds} from '../cli/validate';
import {importManifest} from '../cli/helpers';
import {parsePackIdOrUrl} from '../cli/link';
import path from 'path';
import {renderAgentPackTemplate} from '../cli/agent_template';

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

  describe('API token creation URL', () => {
    it('uses Superhuman Docs for the default API endpoint', () => {
      assert.equal(
        getApiTokenCreationUrl('https://coda.io'),
        'https://docs.superhuman.com/account?openDialog=CREATE_API_TOKEN&scopeType=pack#apiSettings',
      );
      assert.equal(
        getApiTokenCreationUrl('https://coda.io/'),
        'https://docs.superhuman.com/account?openDialog=CREATE_API_TOKEN&scopeType=pack#apiSettings',
      );
    });

    it('preserves custom API endpoints', () => {
      assert.equal(
        getApiTokenCreationUrl('https://tenant.example.com/'),
        'https://tenant.example.com/account?openDialog=CREATE_API_TOKEN&scopeType=pack#apiSettings',
      );
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

  describe('agent template', () => {
    it('renders an agent pack with instructions, tools, and a schedule trigger', () => {
      const template = renderAgentPackTemplate('standup-bot');
      assert.include(template, 'sdk.newAgent()');
      assert.include(template, 'pack.setInstructions(');
      assert.include(template, 'standup-bot');
      assert.include(template, 'pack.setTools({');
      assert.include(template, 'pack.setDefaultScheduleTrigger({');
    });

    it('renders a template that compiles with quotes and backslashes in the name', async () => {
      const agentName = 'bot "the \\ builder"';
      // The template imports the published package name, which does not resolve inside this repo,
      // so point it at the local source for the compile check. Everything else stays verbatim.
      const template = renderAgentPackTemplate(agentName).replace('@codahq/packs-sdk', '../../../index');
      const dir = fs.mkdtempSync(path.join(__dirname, 'packs', '.tmp-agent-template-'));
      try {
        const manifestPath = path.join(dir, 'pack.ts');
        fs.writeFileSync(manifestPath, template);
        const {bundlePath} = await compilePackBundle({manifestPath, minify: false});
        const manifest = await importManifest<PackVersionDefinition>(bundlePath);
        assert.equal(manifest.agent?.instructions, `You are ${agentName}. Keep replies short.`);
      } finally {
        fs.removeSync(dir);
      }
    });
  });

  describe('agent connector pack ids', () => {
    it('collects connector pack ids and skips built-in tools', () => {
      const tools: AgentTool[] = [
        {type: ToolType.CodaDocsAndTables},
        {type: ToolType.Pack, packId: 1234},
        {type: ToolType.WebSearch},
      ];
      assert.deepEqual(getConnectorPackIds(tools), [1234]);
    });

    it('returns empty for no tools', () => {
      assert.deepEqual(getConnectorPackIds([]), []);
    });
  });

  describe('agent connector listings', () => {
    it('warns on listings that fail to load and passes on success', async () => {
      const missing = new ResponseError(
        new Response(JSON.stringify({statusCode: 404, message: 'Not found'}), {status: 404}),
      );
      const client = {
        getPackListing: async (packId: number) => {
          if (packId === 1234) {
            return {id: packId};
          }
          throw missing;
        },
      };
      const warnings = await checkAgentConnectorListings(client as any, [1234, 9999]);
      assert.lengthOf(warnings, 1);
      assert.include(warnings[0], '9999');
      assert.include(warnings[0], 'superhuman.com/store/connectors');
      assert.deepEqual(await checkAgentConnectorListings(client as any, []), []);
    });
  });

  describe('agent chat url', () => {
    it('targets the versioned agent route', () => {
      assert.equal(
        buildAgentChatUrl('https://coda.io', 1234, '1.0.0'),
        'https://coda.io/apis/v1/packs/1234/versions/1.0.0/agentChat',
      );
    });

    it('adds https to bare endpoints', () => {
      assert.equal(
        buildAgentChatUrl('tenant.example.com', 1234, '2'),
        'https://tenant.example.com/apis/v1/packs/1234/versions/2/agentChat',
      );
    });
  });
});
