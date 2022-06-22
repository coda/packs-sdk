export enum HttpStatusCode {
  Unauthorized = 401,
}

// Note that this should be kept in sync with the "PacksAllowedPublicDomains" runtime config 
export const DEFAULT_ALLOWED_GET_DOMAINS_REGEXES = [
  /^coda-us-west-2-\w+-blobs-upload\.s3\.us-west-2\.amazonaws\.com$/,
  /^codahosted\.io$/,
]
