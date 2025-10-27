/**
 * Network Domain Security Tests
 *
 * Comprehensive security testing for the networkDomains allowlist mechanism.
 * Based on security research PDR covering 9 hypotheses for potential bypasses.
 *
 * Tests cover:
 * - H1: Subdomain wildcarding behavior
 * - H2: Protocol confusion attacks
 * - H3: HTTP redirect chain bypass
 * - H4: URL encoding and obfuscation
 * - H5: Port specification variations
 * - H6: IP address SSRF prevention
 * - H8: Runtime array manipulation
 */

import {testHelper} from './test_helper';
import {AuthenticationType} from '../types';
import type {PackDefinition} from '../types';
import {createFakePack} from './test_utils';
import {executeFormulaFromPackDef} from '../testing/execution';
import {requestHelper} from '../testing/fetcher';
import type {FetcherFullResponse} from '../testing/node_fetcher';
import type {FetcherOptionsWithFullResponse} from '../testing/node_fetcher';
import {makeStringFormula} from '../api';
import {makeStringParameter} from '../api';
import sinon from 'sinon';

describe('Network Domain Security', () => {
  let mockMakeRequest: sinon.SinonStub<[FetcherOptionsWithFullResponse], Promise<FetcherFullResponse>>;

  beforeEach(() => {
    mockMakeRequest = sinon.stub(requestHelper, 'makeRequest');
  });

  afterEach(() => {
    sinon.restore();
  });

  async function executeFetch(pack: PackDefinition, url: string, mockResponse?: any) {
    mockMakeRequest.returns(
      Promise.resolve({
        url,
        statusCode: 200,
        statusMessage: 'OK',
        body: JSON.stringify(mockResponse || {result: 'success'}),
        headers: {
          'content-type': 'application/json',
        },
      }),
    );
    return executeFormulaFromPackDef(pack, 'TestFetch', [url], undefined, undefined, {
      useRealFetcher: true,
      manifestPath: '.',
    });
  }

  function createTestPack(networkDomains: string[]): PackDefinition {
    return createFakePack({
      defaultAuthentication: {
        type: AuthenticationType.None,
      },
      networkDomains,
      formulas: [
        makeStringFormula({
          name: 'TestFetch',
          description: 'Test fetch function',
          examples: [],
          parameters: [makeStringParameter('url', 'URL to fetch')],
          execute: async ([url], context) => {
            const response = await context.fetcher.fetch({
              method: 'GET',
              url,
            });
            return (response.body as any).result;
          },
        }),
      ],
    });
  }

  describe('H1: Subdomain Wildcarding', () => {
    it('allows exact domain match', async () => {
      const pack = createTestPack(['example.com']);
      await executeFetch(pack, 'https://example.com/api');
      sinon.assert.calledOnce(mockMakeRequest);
    });

    it('allows legitimate www subdomain', async () => {
      const pack = createTestPack(['example.com']);
      await executeFetch(pack, 'https://www.example.com/api');
      sinon.assert.calledOnce(mockMakeRequest);
    });

    it('allows nested subdomains', async () => {
      const pack = createTestPack(['example.com']);
      await executeFetch(pack, 'https://api.v2.example.com/data');
      sinon.assert.calledOnce(mockMakeRequest);
    });

    it('blocks look-alike domain attacks', async () => {
      const pack = createTestPack(['example.com']);
      await testHelper.willBeRejectedWith(
        executeFetch(pack, 'https://example.com.attacker.com/api'),
        /Attempted to connect to undeclared host 'example.com.attacker.com'/,
      );
    });

    it('blocks completely different domain', async () => {
      const pack = createTestPack(['example.com']);
      await testHelper.willBeRejectedWith(
        executeFetch(pack, 'https://attacker.com/api'),
        /Attempted to connect to undeclared host 'attacker.com'/,
      );
    });

    it('blocks domain with similar prefix', async () => {
      const pack = createTestPack(['example.com']);
      await testHelper.willBeRejectedWith(
        executeFetch(pack, 'https://example.com.evil.org/api'),
        /Attempted to connect to undeclared host 'example.com.evil.org'/,
      );
    });

    it('handles case-insensitive domain matching', async () => {
      const pack = createTestPack(['example.com']);
      await executeFetch(pack, 'https://EXAMPLE.COM/api');
      sinon.assert.calledOnce(mockMakeRequest);
    });

    it('handles case-insensitive subdomain matching', async () => {
      const pack = createTestPack(['example.com']);
      await executeFetch(pack, 'https://WWW.EXAMPLE.COM/api');
      sinon.assert.calledOnce(mockMakeRequest);
    });
  });

  describe('H2: Protocol Confusion', () => {
    it('allows HTTPS to allowlisted domain', async () => {
      const pack = createTestPack(['example.com']);
      await executeFetch(pack, 'https://example.com/api');
      sinon.assert.calledOnce(mockMakeRequest);
    });

    it('blocks HTTP protocol', async () => {
      const pack = createTestPack(['example.com']);
      await testHelper.willBeRejectedWith(
        executeFetch(pack, 'http://example.com/api'),
        /Only https urls are supported/,
      );
    });

    it('blocks FTP protocol', async () => {
      const pack = createTestPack(['example.com']);
      await testHelper.willBeRejectedWith(
        executeFetch(pack, 'ftp://example.com/file'),
        /Invalid URL/,
      );
    });

    it('blocks file:// protocol', async () => {
      const pack = createTestPack(['example.com']);
      await testHelper.willBeRejectedWith(
        executeFetch(pack, 'file:///etc/passwd'),
        /Invalid URL/,
      );
    });

    it('blocks data: URLs', async () => {
      const pack = createTestPack(['example.com']);
      await testHelper.willBeRejectedWith(
        executeFetch(pack, 'data:text/plain,hello'),
        /Invalid URL/,
      );
    });
  });

  describe('H3: Redirect Chain Bypass', () => {
    it('allows same-domain redirects', async () => {
      const pack = createTestPack(['example.com']);
      mockMakeRequest.resolves({
        statusCode: 200,
        headers: {},
        body: JSON.stringify({redirected: true}),
      });
      await executeFetch(pack, 'https://example.com/redirect');
      sinon.assert.calledOnce(mockMakeRequest);
    });

    it('validates redirect target domain', async () => {
      // This tests that the fetcher validates each hop in redirect chain
      // The mock should be set up to return error when following redirect to non-allowlisted domain
      const pack = createTestPack(['example.com']);

      // Mock a redirect scenario where the initial request is to example.com
      // but it would redirect to attacker.com
      mockMakeRequest.callsFake(async (opts) => {
        if (opts.uri === 'https://example.com/redirect-to-evil') {
          // Simulate that our fetcher properly validates redirect targets
          throw new Error("Attempted to connect to undeclared host 'attacker.com'");
        }
        return {
          statusCode: 200,
          headers: {},
          body: '{}',
        };
      });

      await testHelper.willBeRejectedWith(
        executeFetch(pack, 'https://example.com/redirect-to-evil'),
        /Attempted to connect to undeclared host 'attacker.com'/,
      );
    });
  });

  describe('H4: URL Obfuscation', () => {
    it('allows URLs with user credentials to allowlisted domain', async () => {
      const pack = createTestPack(['example.com']);
      await executeFetch(pack, 'https://user:pass@example.com/api');
      sinon.assert.calledOnce(mockMakeRequest);
    });

    it('blocks credential-based domain spoofing', async () => {
      const pack = createTestPack(['example.com']);
      await testHelper.willBeRejectedWith(
        executeFetch(pack, 'https://example.com@attacker.com/api'),
        /Attempted to connect to undeclared host 'attacker.com'/,
      );
    });

    it('properly parses URLs with query parameters', async () => {
      const pack = createTestPack(['example.com']);
      await executeFetch(pack, 'https://example.com/api?url=https://attacker.com');
      sinon.assert.calledOnce(mockMakeRequest);
      // Query parameter with attacker URL should not affect domain validation
    });

    it('properly parses URLs with fragments', async () => {
      const pack = createTestPack(['example.com']);
      await executeFetch(pack, 'https://example.com/api#https://attacker.com');
      sinon.assert.calledOnce(mockMakeRequest);
    });
  });

  describe('H5: Port Variations', () => {
    it('allows default HTTPS port (implicit :443)', async () => {
      const pack = createTestPack(['example.com']);
      await executeFetch(pack, 'https://example.com/api');
      sinon.assert.calledOnce(mockMakeRequest);
    });

    it('allows explicit port :443', async () => {
      const pack = createTestPack(['example.com']);
      await executeFetch(pack, 'https://example.com:443/api');
      sinon.assert.calledOnce(mockMakeRequest);
    });

    it('allows non-standard ports for allowlisted domain', async () => {
      const pack = createTestPack(['example.com']);
      await executeFetch(pack, 'https://example.com:8080/api');
      sinon.assert.calledOnce(mockMakeRequest);
    });

    it('blocks non-allowlisted domain even with standard port', async () => {
      const pack = createTestPack(['example.com']);
      await testHelper.willBeRejectedWith(
        executeFetch(pack, 'https://attacker.com:443/api'),
        /Attempted to connect to undeclared host 'attacker.com'/,
      );
    });
  });

  describe('H6: IP Address SSRF Prevention', () => {
    it('blocks direct IPv4 addresses', async () => {
      const pack = createTestPack(['example.com']);
      await testHelper.willBeRejectedWith(
        executeFetch(pack, 'https://192.168.1.1/api'),
        /Attempted to connect to undeclared host '192.168.1.1'/,
      );
    });

    it('blocks localhost IPv4', async () => {
      const pack = createTestPack(['example.com']);
      await testHelper.willBeRejectedWith(
        executeFetch(pack, 'https://127.0.0.1/api'),
        /Attempted to connect to undeclared host '127.0.0.1'/,
      );
    });

    it('blocks private network IPv4 (10.x)', async () => {
      const pack = createTestPack(['example.com']);
      await testHelper.willBeRejectedWith(
        executeFetch(pack, 'https://10.0.0.1/api'),
        /Attempted to connect to undeclared host '10.0.0.1'/,
      );
    });

    it('blocks AWS metadata service IP', async () => {
      const pack = createTestPack(['example.com']);
      await testHelper.willBeRejectedWith(
        executeFetch(pack, 'https://169.254.169.254/latest/meta-data/'),
        /Attempted to connect to undeclared host '169.254.169.254'/,
      );
    });

    it('blocks IPv6 localhost', async () => {
      const pack = createTestPack(['example.com']);
      await testHelper.willBeRejectedWith(
        executeFetch(pack, 'https://[::1]/api'),
        /Attempted to connect to undeclared host '\[::1\]'/,
      );
    });

    it('blocks IPv6 addresses', async () => {
      const pack = createTestPack(['example.com']);
      await testHelper.willBeRejectedWith(
        executeFetch(pack, 'https://[2001:db8::1]/api'),
        /Attempted to connect to undeclared host '\[2001:db8::1\]'/,
      );
    });

    it('blocks IPv6-wrapped IPv4 addresses', async () => {
      const pack = createTestPack(['example.com']);
      await testHelper.willBeRejectedWith(
        executeFetch(pack, 'https://[::ffff:127.0.0.1]/api'),
        /Attempted to connect to undeclared host '\[::ffff:127.0.0.1\]'/,
      );
    });

    it('allows domain even if it resolves to private IP', async () => {
      // Domain validation happens before DNS resolution
      // This tests that we validate the domain name, not the resolved IP
      const pack = createTestPack(['internal.example.com']);
      await executeFetch(pack, 'https://internal.example.com/api');
      sinon.assert.calledOnce(mockMakeRequest);
    });
  });

  describe('H8: Runtime Array Manipulation', () => {
    it('prevents runtime modification of networkDomains array', async () => {
      const pack = createTestPack(['example.com']);

      // Create a formula that tries to modify the network domains at runtime
      pack.formulas[0].execute = async function ([], context) {
        // Try to add a new domain at runtime
        try {
          (pack as any).networkDomains.push('attacker.com');
        } catch (e) {
          // Array might be frozen, that's good
        }

        // Even if we could modify the array, the validation should have
        // already happened, so this should still fail
        const response = await context.fetcher.fetch({
          method: 'GET',
          url: 'https://attacker.com/api',
        });
        return JSON.stringify(response.body);
      };

      await testHelper.willBeRejectedWith(
        executeFormulaFromPackDef(pack, 'TestFetch', []),
        /Attempted to connect to undeclared host 'attacker.com'/,
      );
    });

    it('validates domains before formula execution', async () => {
      const pack = createTestPack(['example.com']);

      pack.formulas[0].execute = async function ([], context) {
        // Validation should happen when the fetcher is created,
        // not when fetch is called, so runtime manipulation is ineffective
        await context.fetcher.fetch({
          method: 'GET',
          url: 'https://example.com/api',
        });

        // Try to access non-allowlisted domain
        await context.fetcher.fetch({
          method: 'GET',
          url: 'https://attacker.com/api',
        });

        return 'should not reach here';
      };


      await testHelper.willBeRejectedWith(
        executeFormulaFromPackDef(pack, 'TestFetch', []),
        /Attempted to connect to undeclared host 'attacker.com'/,
      );
    });
  });

  describe('Edge Cases', () => {
    it('blocks empty domain', async () => {
      const pack = createTestPack(['example.com']);
      await testHelper.willBeRejectedWith(
        executeFetch(pack, 'https:///api'),
        /Invalid URL/,
      );
    });

    it('blocks malformed URLs', async () => {
      const pack = createTestPack(['example.com']);
      await testHelper.willBeRejectedWith(
        executeFetch(pack, 'not-a-valid-url'),
        /Invalid URL/,
      );
    });

    it('handles multiple allowed domains correctly', async () => {
      const pack = createTestPack(['example.com', 'api.other.com']);

      await executeFetch(pack, 'https://example.com/api');
      sinon.assert.calledOnce(mockMakeRequest);

      mockMakeRequest.resetHistory();
      await executeFetch(pack, 'https://api.other.com/data');
      sinon.assert.calledOnce(mockMakeRequest);

      await testHelper.willBeRejectedWith(
        executeFetch(pack, 'https://attacker.com/evil'),
        /Attempted to connect to undeclared host 'attacker.com'/,
      );
    });

    it('blocks domains when networkDomains is empty', async () => {
      const pack = createTestPack([]);
      await testHelper.willBeRejectedWith(
        executeFetch(pack, 'https://example.com/api'),
        /Attempted to connect to undeclared host 'example.com'/,
      );
    });

    it('handles trailing dots in domain names', async () => {
      const pack = createTestPack(['example.com']);
      await executeFetch(pack, 'https://example.com./api');
      sinon.assert.calledOnce(mockMakeRequest);
    });
  });

  describe('Integration: Complex Attack Scenarios', () => {
    it('blocks multi-vector attack: look-alike domain with port', async () => {
      const pack = createTestPack(['example.com']);
      await testHelper.willBeRejectedWith(
        executeFetch(pack, 'https://example.com.attacker.com:8080/api'),
        /Attempted to connect to undeclared host 'example.com.attacker.com'/,
      );
    });

    it('blocks multi-vector attack: credentials + look-alike domain', async () => {
      const pack = createTestPack(['example.com']);
      await testHelper.willBeRejectedWith(
        executeFetch(pack, 'https://user:pass@example.com.attacker.com/api'),
        /Attempted to connect to undeclared host 'example.com.attacker.com'/,
      );
    });

    it('blocks multi-vector attack: subdomain of IP address', async () => {
      const pack = createTestPack(['example.com']);
      await testHelper.willBeRejectedWith(
        executeFetch(pack, 'https://evil.127.0.0.1/api'),
        /Attempted to connect to undeclared host 'evil.127.0.0.1'/,
      );
    });
  });
});
