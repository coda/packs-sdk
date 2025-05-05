"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeQueryBrainTool = exports.makeAnnotateTextTool = exports.makeGetEditorTool = void 0;
const api_1 = require("./api");
function makeGetEditorTool(opts = {}) {
    return {
        type: api_1.ToolType.GetEditor,
        description: opts.description,
    };
}
exports.makeGetEditorTool = makeGetEditorTool;
function makeAnnotateTextTool(opts) {
    return {
        type: api_1.ToolType.AnnotateText,
        description: opts.description,
    };
}
exports.makeAnnotateTextTool = makeAnnotateTextTool;
function makeQueryBrainTool(opts) {
    return {
        type: api_1.ToolType.QueryBrain,
        description: opts.description,
        packId: opts.packId,
    };
}
exports.makeQueryBrainTool = makeQueryBrainTool;
