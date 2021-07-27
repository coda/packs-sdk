import type { ExecutionContext } from '../api';
import type { Context as IVMContext } from 'isolated-vm';
import type { ParamDefs } from '../api_types';
import type { ParamValues } from '../api_types';
import type { StandardFormulaSpecification } from '../runtime/types';
import type { SyncFormulaSpecification } from '../runtime/types';
export declare function setupIvmContext(bundlePath: string, executionContext: ExecutionContext): Promise<IVMContext>;
export declare function executeFormulaOrSync(ivmContext: IVMContext, formulaSpecification: StandardFormulaSpecification | SyncFormulaSpecification, params: ParamValues<ParamDefs>, bundleSourceMapPath: string, vmFilename: string): Promise<any>;
