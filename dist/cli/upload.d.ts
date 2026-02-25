import type { ArgumentsCamelCase } from 'yargs';
import type { TimerShimStrategy } from '../testing/compile';
interface UploadArgs {
    manifestFile: string;
    apiEndpoint: string;
    notes?: string;
    intermediateOutputDirectory: string;
    timerStrategy: TimerShimStrategy;
    apiToken?: string;
}
export declare function handleUpload({ intermediateOutputDirectory, manifestFile, apiEndpoint, notes, timerStrategy, apiToken, allowOlderSdkVersion, }: ArgumentsCamelCase<UploadArgs>): Promise<undefined>;
export {};
