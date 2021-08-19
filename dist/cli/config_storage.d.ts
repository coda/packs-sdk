export declare const DEFAULT_API_ENDPOINT = "https://coda.io";
export declare const PACK_ID_FILE_NAME = ".coda-pack.json";
export interface ApiKeyFile {
    apiKey: string;
    environmentApiKeys?: {
        [host: string]: string;
    };
}
export interface PackIdFile {
    packId: number;
    environmentPackIds?: {
        [host: string]: number;
    };
}
export declare function getApiKey(codaApiEndpoint: string): string | undefined;
export declare function storeCodaApiKey(apiKey: string, projectDir: string | undefined, codaApiEndpoint: string): void;
export declare function storePackId(manifestDir: string, packId: number, codaApiEndpoint: string): void;
export declare function getPackId(manifestDir: string, codaApiEndpoint: string): number | undefined;
