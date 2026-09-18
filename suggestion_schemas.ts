import type {Assert} from './type_utils';
import type {SuggestionHighlight} from './api_types';
import type {SuggestionResult} from './api_types';
import {z} from 'zod';

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
export const SuggestionHighlightSchema = z.object({
  startOffset: z.number().int().min(0),
  endOffset: z.number().int().min(0),
  original: z.string(),
  title: z.string(),
  explanation: z.string(),
  replacement: z.string().optional(),
  importance: z.number().min(0).max(1).optional(),
});

/**
 * Zod counterpart of {@link SuggestionResult}: what a suggestion-producing formula returns.
 *
 * @internal
 * @hidden
 */
export const SuggestionResultSchema = z.object({
  suggestions: z.array(SuggestionHighlightSchema),
  error: z.string().optional(),
});

/**
 * The schemas above and the types in `api_types.ts` describe one shape in two languages, so both
 * directions of assignability are asserted here. Adding, removing or retyping a field in either
 * place fails to compile until the other agrees -- the guard that replaces deriving the type from
 * the schema with `z.infer`, which is what forced zod into the runtime bundle.
 *
 * Note what this rules out: neither declaration may use `null` for an absent value, because the
 * Coda schema `makeSuggestionResultSchema()` builds cannot express one.
 */
type Assignable<From, To> = [From] extends [To] ? true : false;

export type _HighlightMatchesType = Assert<Assignable<z.infer<typeof SuggestionHighlightSchema>, SuggestionHighlight>>;
export type _TypeMatchesHighlight = Assert<Assignable<SuggestionHighlight, z.infer<typeof SuggestionHighlightSchema>>>;
export type _ResultMatchesType = Assert<Assignable<z.infer<typeof SuggestionResultSchema>, SuggestionResult>>;
export type _TypeMatchesResult = Assert<Assignable<SuggestionResult, z.infer<typeof SuggestionResultSchema>>>;
