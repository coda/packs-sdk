import type { AgentTool } from '../types';
import type { ArgumentsCamelCase } from 'yargs';
import type { Client } from '../helpers/external-api/coda';
import type { PackVersionMetadata } from '../compiled_types';
interface ValidateArgs {
    manifestFile: string;
    checkDeprecationWarnings: boolean;
    checkConnectors?: boolean;
    apiToken?: string;
    apiEndpoint: string;
}
export declare function handleValidate({ manifestFile, checkDeprecationWarnings, checkConnectors, apiToken, apiEndpoint, }: ArgumentsCamelCase<ValidateArgs>): Promise<void>;
export declare function getConnectorPackIds(tools: AgentTool[]): number[];
export declare function checkAgentConnectorListings(client: Pick<Client, 'getPackListing'>, packIds: number[]): Promise<string[]>;
export declare function validateMetadata(metadata: PackVersionMetadata, { checkDeprecationWarnings }?: {
    checkDeprecationWarnings?: boolean;
}): Promise<void>;
export {};
