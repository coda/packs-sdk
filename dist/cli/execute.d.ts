import type { Arguments } from 'yargs';
import type { TimerShimStrategy } from '../testing/compile';
export interface ExecuteArgs {
    manifestPath: string;
    formulaName: string;
    params: string[];
    fetch?: boolean;
    vm?: boolean;
    dynamicUrl?: string;
    timerStrategy: TimerShimStrategy;
}
export declare function handleExecute({ manifestPath, formulaName, params, fetch, vm, dynamicUrl, timerStrategy, }: Arguments<ExecuteArgs>): Promise<void>;
