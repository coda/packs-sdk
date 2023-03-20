import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Per-user authentication to the AWS S3 service, using AWS Signature Version 4.
// The user provides the URL of their S3 bucket as the endpoint, along with an
// access key and secret.
pack.setUserAuthentication({
  type: coda.AuthenticationType.AWSAccessKey,
  instructionsUrl:
    "https://aws.amazon.com/premiumsupport/knowledge-center/create-access-key/",

  // The AWS service to connect to.
  service: "s3",

  // Prompt the user from their S3 bucket URL.
  requiresEndpointUrl: true,
  endpointDomain: "amazonaws.com",

  // Use the bucket name as the display name for the account.
  getConnectionName: async function (context) {
    return context.endpoint.split("//")[1].split(".")[0];
  },
});
