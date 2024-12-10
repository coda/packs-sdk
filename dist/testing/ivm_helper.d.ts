import type { ExecutionContext } from '../api_types';
import type { Context as IVMContext } from 'isolated-vm';
export declare function setupIvmContext(bundlePath: string, executionContext: ExecutionContext): Promise<IVMContext>;
