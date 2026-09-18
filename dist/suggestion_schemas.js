"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuggestionResultSchema = exports.SuggestionHighlightSchema = void 0;
const zod_1 = require("zod");
/**
 * Zod counterpart of {@link SuggestionHighlight}, for consumers that need to validate a producer's
 * result at runtime rather than only type it.
 *
 * Deliberately in its own module rather than alongside the type in `api_types.ts`: that module is
 * reachable from `index.ts` and from `runtime/`, so a value-level `zod` import there bundles all of
 * zod into `bundles/thunk_bundle.js` -- the code evaluated into the isolate on every pack
 * execution, which it grew more than fourfold. Import this module directly
 * (`@codahq/packs-sdk/dist/suggestion_schemas`) to keep that cost off the pack-execution path.
 *
 * @internal
 * @hidden
 */
exports.SuggestionHighlightSchema = zod_1.z.object({
    startOffset: zod_1.z.number().int().min(0),
    endOffset: zod_1.z.number().int().min(0),
    original: zod_1.z.string(),
    title: zod_1.z.string(),
    explanation: zod_1.z.string(),
    replacement: zod_1.z.string().optional(),
    importance: zod_1.z.number().min(0).max(1).optional(),
});
/**
 * Zod counterpart of {@link SuggestionResult}: what a suggestion-producing formula returns.
 *
 * @internal
 * @hidden
 */
exports.SuggestionResultSchema = zod_1.z.object({
    suggestions: zod_1.z.array(exports.SuggestionHighlightSchema),
    error: zod_1.z.string().optional(),
});
