import type {AnnotateTextToolConfig} from './api';
import type {GetEditorToolConfig} from './api';
import type {QueryBrainToolConfig} from './api';
import {ToolType} from './api';

export function makeGetEditorTool(opts: {description?: string} = {}): GetEditorToolConfig {
  return {
    type: ToolType.GetEditor,
    description: opts.description,
  };
}

export function makeAnnotateTextTool(opts: {description?: string}): AnnotateTextToolConfig {
  return {
    type: ToolType.AnnotateText,
    description: opts.description,
  };
}

export function makeQueryBrainTool(opts: {description?: string; packId: number}): QueryBrainToolConfig {
  return {
    type: ToolType.QueryBrain,
    description: opts.description,
    packId: opts.packId,
  };
}
