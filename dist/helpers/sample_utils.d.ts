import type { Formula } from '../api';
import type { PackDefinition } from '../types';
import type { PackFormulas } from '../api';
import type { PackMetadata } from '../compiled_types';
export interface FakePackDefinition extends Omit<PackDefinition, 'formulas'> {
    formulas?: PackFormulas | Formula[];
}
export declare function fakeDefinitionToDefinition(def: FakePackDefinition): PackDefinition;
export declare function fakeDefinitionToMetadata(def: FakePackDefinition): PackMetadata;
