import * as sdk from '@codahq/packs-sdk';

const ApiDomain = 'api.example-billing.com';

export const pack = sdk.newPack();

pack.addNetworkDomain(ApiDomain);

pack.setUserAuthentication({
  type: sdk.AuthenticationType.HeaderBearerToken,
  networkDomain: ApiDomain,
});

pack.addFormula({
  name: 'GetSubscription',
  description: 'Gets plan and renewal details for one customer.',
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
      url: sdk.withQueryParams(`https://${ApiDomain}/v1/subscriptions`, {customer: accountName}),
    });
    return JSON.stringify(response.body);
  },
});
