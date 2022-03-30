import type { ArgumentsCamelCase } from 'yargs';
import type { TimerShimStrategy } from '../testing/compile';
export interface ExecuteArgs {
    manifestPath: string;
    formulaName: string;
    params: string[];
    fetch?: boolean;
    vm?: boolean;
    getSchema?: boolean;
    dynamicUrl?: string;
    timerStrategy: TimerShimStrategy;
}
export declare function handleExecute({ manifestPath, formulaName, params, fetch, vm, dynamicUrl, timerStrategy, getSchema, }: ArgumentsCamelCase<ExecuteArgs>): Promise<void>;
