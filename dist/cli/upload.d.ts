import type { ArgumentsCamelCase } from 'yargs';
import type { TimerShimStrategy } from '../testing/compile';
interface UploadArgs {
    manifestFile: string;
    codaApiEndpoint: string;
    notes?: string;
    intermediateOutputDirectory: string;
    timerStrategy: TimerShimStrategy;
    apiToken?: string;
}
export declare function handleUpload({ intermediateOutputDirectory, manifestFile, codaApiEndpoint, notes, timerStrategy, apiToken, allowOlderSdkVersion, }: ArgumentsCamelCase<UploadArgs>): Promise<undefined>;
export {};
