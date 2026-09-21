import * as sdk from '@codahq/packs-sdk';

const ApiDomain = 'api.example-support.com';

export const pack = sdk.newPack();

pack.addNetworkDomain(ApiDomain);

pack.setUserAuthentication({
  type: sdk.AuthenticationType.QueryParamToken,
  paramName: 'api_key',
});

pack.addFormula({
  name: 'ListOpenCases',
  description: 'Lists open support cases for one customer.',
  parameters: [
    sdk.makeParameter({
      type: sdk.ParameterType.String,
      name: 'accountName',
      description: 'Customer account name.',
    }),
  ],
  resultType: sdk.ValueType.String,
  async execute([accountName], context) {
    const response = await context.fetcher.fetch({
      method: 'GET',
      url: sdk.withQueryParams(`https://${ApiDomain}/v1/cases`, {
        customer: accountName,
        status: 'open',
      }),
    });
    return JSON.stringify(response.body);
  },
});
