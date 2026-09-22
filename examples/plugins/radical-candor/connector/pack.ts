import * as sdk from '@codahq/packs-sdk';

export const pack = sdk.newPack();

pack.addNetworkDomain('example.com');

pack.setUserAuthentication({
  type: sdk.AuthenticationType.HeaderBearerToken,
});

pack.addFormula({
  name: 'GetFeedback',
  description: 'Fetches coaching context from the vendor API.',
  parameters: [
    sdk.makeParameter({
      type: sdk.ParameterType.String,
      name: 'topic',
      description: 'What to fetch feedback about.',
    }),
  ],
  resultType: sdk.ValueType.String,
  async execute([topic], context) {
    const response = await context.fetcher.fetch({
      method: 'GET',
      url: 'https://api.example.com/feedback?topic=' + encodeURIComponent(topic),
    });
    return JSON.stringify(response.body);
  },
});
