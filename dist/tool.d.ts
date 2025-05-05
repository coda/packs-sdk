import type { AnnotateTextToolConfig } from './api';
import type { GetEditorToolConfig } from './api';
import type { QueryBrainToolConfig } from './api';
export declare function makeGetEditorTool(opts?: {
    description?: string;
}): GetEditorToolConfig;
export declare function makeAnnotateTextTool(opts: {
    description?: string;
}): AnnotateTextToolConfig;
export declare function makeQueryBrainTool(opts: {
    description?: string;
    packId: number;
}): QueryBrainToolConfig;
