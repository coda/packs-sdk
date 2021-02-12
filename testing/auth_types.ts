export interface AllCredentials {
  __coda__?: {apiKey: string};
  packs: {
    [name: string]: Credentials;
  };
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
  accessToken?: string;
  refreshToken?: string;
}

export type Credentials =
  | TokenCredentials
  | WebBasicCredentials
  | QueryParamCredentials
  | MultiQueryParamCredentials
  | OAuth2Credentials;
