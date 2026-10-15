import { TimerShimStrategy } from '../testing/compile';
export declare const DEFAULT_API_ENDPOINT = "https://coda.io";
export declare const DEFAULT_TIMER_STRATEGY = TimerShimStrategy.None;
export declare const DEFAULT_GIT_TAG = false;
export declare const PACK_ID_FILE_NAME = ".coda-pack.json";
export declare const AGENT_INSTALL_FILE_NAME = ".coda-agent.json";
export interface ApiKeyFile {
    apiKey: string;
    environmentApiKeys?: {
        [host: string]: string;
    };
}
export declare enum PackOptionKey {
    timerStrategy = "timerStrategy",
    gitTag = "gitTag",
    apiEndpoint = "apiEndpoint"
}
/** @deprecated Keys kept only for reading legacy config files. */
export declare enum DeprecatedPackOptionKey {
    /** @deprecated Use {@link PackOptionKey.gitTag} instead. */
    enableGitTags = "enableGitTags"
}
export interface PackOptions {
    [PackOptionKey.timerStrategy]?: TimerShimStrategy;
    [PackOptionKey.gitTag]?: boolean;
    [PackOptionKey.apiEndpoint]?: string;
    /** @deprecated Kept for reading legacy config files. */
    [DeprecatedPackOptionKey.enableGitTags]?: boolean;
}
export interface PackIdFile {
    packId: number;
    options?: PackOptions;
    environmentPackIds?: {
        [host: string]: number;
    };
}
export interface StoredAgentInstall {
    packId: number;
    agentInstanceId: string;
    tenantId?: string;
}
export declare function getApiKey(codaApiEndpoint: string): string | undefined;
export declare function storeCodaApiKey(apiKey: string, projectDir: string | undefined, codaApiEndpoint: string): void;
export declare function storePackId(manifestDir: string, packId: number, codaApiEndpoint: string): void;
export declare function getPackId(manifestDir: string, codaApiEndpoint: string): number | undefined;
export declare function storeAgentInstall(manifestDir: string, codaApiEndpoint: string, install: StoredAgentInstall): void;
export declare function getAgentInstall(manifestDir: string, codaApiEndpoint: string): StoredAgentInstall | undefined;
export declare function storePackOptions(manifestDir: string, options: PackOptions): void;
export declare function getPackOptions(manifestDir: string): PackOptions | undefined;
