import {Client} from '../helpers/external-api/coda';
import {PublicApiPackAssetType} from '../helpers/external-api/v1';
import type {PublicApiUpdatePackRequest} from '../helpers/external-api/v1';
import {ResponseError} from '../helpers/external-api/coda';
import sinon from 'sinon';

describe('Generated external API client', () => {
  let fetchStub: sinon.SinonStub;

  beforeEach(() => {
    fetchStub = sinon.stub(global, 'fetch');
    fetchStub.callsFake(async () => {
      return new Response(JSON.stringify({}), {
        headers: {'Content-Type': 'application/json'},
        status: 200,
      });
    });
  });

  afterEach(() => {
    sinon.restore();
  });

  it('includes every current Pack asset type', () => {
    assert.deepEqual(PublicApiPackAssetType, {
      Logo: 'logo',
      Cover: 'cover',
      ExampleImage: 'exampleImage',
      AgentImage: 'agentImage',
    });
  });

  it('preserves the default endpoint, authentication headers, and JSON serialization', async () => {
    const client = new Client({apiToken: 'test-token'});
    const payload: PublicApiUpdatePackRequest = {
      logo: {assetId: 'logo-id', filename: 'logo.png', mimeType: 'image/png'},
      cover: {assetId: 'cover-id', filename: 'cover.png'},
      exampleImages: [{assetId: 'example-id', filename: 'example.png'}],
      agentImages: [{assetId: 'agent-id', filename: 'agent.png'}],
    };

    await client.updatePack(123, {}, payload);

    sinon.assert.calledOnce(fetchStub);
    const [url, request] = fetchStub.firstCall.args;
    assert.equal(url, 'https://coda.io/apis/v1/packs/123');
    assert.deepEqual(request, {
      headers: {
        Authorization: 'Bearer test-token',
        'Content-Type': 'application/json',
        'User-Agent': 'Coda-Typescript-API-Client',
      },
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  });

  it('preserves Pack asset upload methods and request shapes', async () => {
    const client = new Client({apiToken: 'test-token', protocolAndHost: 'https://tenant.example.com/'});

    await client.uploadPackAsset(
      123,
      {},
      {
        packAssetType: PublicApiPackAssetType.AgentImage,
        imageHash: 'image-hash',
        mimeType: 'image/png',
        filename: 'agent.png',
      },
      {'X-Test-Header': 'test-value'},
    );
    await client.packAssetUploadComplete(123, 'asset-id', PublicApiPackAssetType.AgentImage);

    assert.equal(fetchStub.firstCall.args[0], 'https://tenant.example.com/apis/v1/packs/123/uploadAsset');
    assert.deepEqual(JSON.parse(fetchStub.firstCall.args[1].body), {
      packAssetType: 'agentImage',
      imageHash: 'image-hash',
      mimeType: 'image/png',
      filename: 'agent.png',
    });
    assert.deepInclude(fetchStub.firstCall.args[1].headers, {'X-Test-Header': 'test-value'});
    assert.equal(
      fetchStub.secondCall.args[0],
      'https://tenant.example.com/apis/v1/packs/123/assets/asset-id/assetType/agentImage/uploadComplete',
    );
    assert.equal(fetchStub.secondCall.args[1].method, 'POST');
    assert.isUndefined(fetchStub.secondCall.args[1].body);
  });

  it('throws ResponseError with the original response', async () => {
    const response = new Response(JSON.stringify({message: 'Nope'}), {
      status: 400,
      statusText: 'Bad Request',
    });
    fetchStub.resolves(response);
    const client = new Client({apiToken: 'test-token'});

    try {
      await client.getPack(123);
      assert.fail('Expected getPack to throw');
    } catch (err) {
      assert.instanceOf(err, ResponseError);
      assert.equal((err as ResponseError).response, response);
      assert.equal((err as ResponseError).message, 'Bad Request');
    }
  });
});
