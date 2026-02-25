import type { ArgumentsCamelCase } from 'yargs';
import type { PublicApiUser } from '../helpers/external-api/v1';
interface WhoamiArgs {
    apiToken?: string;
    apiEndpoint: string;
}
export declare function handleWhoami({ apiToken, apiEndpoint }: ArgumentsCamelCase<WhoamiArgs>): Promise<never>;
export declare function formatWhoami(user: PublicApiUser): string;
export {};
