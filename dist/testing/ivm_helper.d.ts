import type { Context as IVMContext } from 'isolated-vm';
import type { SyncExecutionContext } from '../api_types';
export declare function setupIvmContext(bundlePath: string, executionContext: SyncExecutionContext): Promise<IVMContext>;
