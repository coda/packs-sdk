import type { PackDefinition } from '../types';
import type { PackMetadata } from '../compiled_types';
import type { TypedStandardFormula } from '../api';
export interface FakePackDefinition extends Omit<PackDefinition, 'formulas'> {
    formulas?: TypedStandardFormula[];
}
export declare function fakeDefinitionToDefinition(def: FakePackDefinition): PackDefinition;
export declare function fakeDefinitionToMetadata(def: FakePackDefinition): PackMetadata;
