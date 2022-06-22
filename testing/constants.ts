export enum HttpStatusCode {
  Unauthorized = 401,
}

export const DEFAULT_ALLOWED_GET_DOMAINS = [
  'coda-us-west-2-prod-blobs-upload.s3.us-west-2.amazonaws.com',
  'coda-us-west-2-staging-blobs-upload.s3.us-west-2.amazonaws.com',
  'coda-us-west-2-head-blobs-upload.s3.us-west-2.amazonaws.com',
  'coda-us-west-2-adhoc-blobs-upload.s3.us-west-2.amazonaws.com',
  'coda-us-west-2-dev-blobs-upload.s3.us-west-2.amazonaws.com',
  'codahosted.io',
]
