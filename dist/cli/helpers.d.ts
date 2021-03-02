/// <reference types="node" />
import { Client } from '../helpers/external-api/coda';
export declare function spawnProcess(command: string): import("child_process").SpawnSyncReturns<Buffer>;
export declare function getApiKey(): string | undefined;
export declare function createCodaClient(apiKey: string, protocolAndHost?: string): Client;
export declare function formatEndpoint(endpoint: string): string;
