import type { PackDefinition } from '../types';
import type { PackMetadata } from '../compiled_types';
import type { PackVersionDefinition } from '../types';
import type { PackVersionMetadata } from '../compiled_types';
export declare function compilePackMetadata(manifest: PackDefinition): PackMetadata;
export declare function compilePackMetadata(manifest: PackVersionDefinition): PackVersionMetadata;
