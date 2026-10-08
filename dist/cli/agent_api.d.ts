import type { Client } from '../helpers/external-api/coda';
export interface AgentContextArgs {
    manifestPath: string;
    version?: string;
    apiToken?: string;
    apiEndpoint: string;
}
export interface ResolvedAgentContext {
    packId: number;
    resolvedVersion: string;
    apiToken: string;
}
export declare function resolveAgentVersion(client: Client, packId: number, requested?: string): Promise<string | undefined>;
export declare function resolveAgentContext({ manifestPath, version, apiToken, apiEndpoint, }: AgentContextArgs): Promise<ResolvedAgentContext>;
export declare function buildAgentRouteUrl(apiEndpoint: string, packId: number, version: string, route: string): string;
export declare function isApiErrorBody(bodyText: string): boolean;
export interface PostAgentRouteArgs {
    apiToken: string;
    apiEndpoint: string;
    packId: number;
    version: string;
    progressVerb: string;
    commandNoun: string;
    missingRouteMessage: (url: string) => string;
    accept?: string;
    signal?: AbortSignal;
}
export declare function postAgentRoute(route: string, args: PostAgentRouteArgs, body: unknown): Promise<Response>;
