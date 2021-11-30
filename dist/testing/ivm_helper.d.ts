import type { ExecutionContext } from '../api';
import type { Context as IVMContext } from 'isolated-vm';
export declare function setupIvmContext(bundlePath: string, executionContext: ExecutionContext): Promise<IVMContext>;
