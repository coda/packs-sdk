import * as sdk from '@codahq/packs-sdk';

const ApiDomain = 'api.example-crm.com';

export const pack = sdk.newPack();

pack.addNetworkDomain(ApiDomain);

pack.setUserAuthentication({
  type: sdk.AuthenticationType.OAuth2,
  authorizationUrl: 'https://example-crm.com/oauth/authorize',
  tokenUrl: `https://${ApiDomain}/oauth/token`,
  scopes: ['accounts:read'],
});

pack.addFormula({
  name: 'GetAccount',
  description: 'Gets CRM details for one customer account.',
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
      url: sdk.withQueryParams(`https://${ApiDomain}/v1/accounts`, {name: accountName}),
    });
    return JSON.stringify(response.body);
  },
});
