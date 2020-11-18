export interface AllCredentials {
  [packName: string]: Credentials;
}

interface BaseCredentials {
  endpointUrl?: string;
}

export interface TokenCredentials extends BaseCredentials {
  token: string;
}

export interface WebBasicCredentials extends BaseCredentials {
  username: string;
  password?: string;
}

export interface QueryParamCredentials extends BaseCredentials {
  paramValue: string;
}

export interface MultiQueryParamCredentials extends BaseCredentials {
  params: {[paramName: string]: string};
}

export interface OAuth2Credentials extends BaseCredentials {
  clientId: string;
  clientSecret: string;
  // TODO: See if we can make this an array of stored access tokens so developers can
  // store creds for multiple user accounts at the same time.
  accessToken?: string;
  refreshToken?: string;
}

export type Credentials =
  | TokenCredentials
  | WebBasicCredentials
  | QueryParamCredentials
  | MultiQueryParamCredentials
  | OAuth2Credentials;
