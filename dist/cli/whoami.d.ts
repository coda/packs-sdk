import type { ArgumentsCamelCase } from 'yargs';
import type { PublicApiUser } from '../helpers/external-api/v1';
interface WhoamiArgs {
    apiToken?: string;
    codaApiEndpoint: string;
}
export declare function handleWhoami({ apiToken, codaApiEndpoint }: ArgumentsCamelCase<WhoamiArgs>): Promise<never>;
export declare function formatWhoami(user: PublicApiUser): string;
export {};
