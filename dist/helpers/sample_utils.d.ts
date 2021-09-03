import type { Formula } from '../api';
import type { PackDefinition } from '../types';
import type { PackMetadata } from '../compiled_types';
export interface FakePackDefinition extends Omit<PackDefinition, 'formulas'> {
    formulas?: Formula[];
}
export declare function fakeDefinitionToDefinition(def: FakePackDefinition): PackDefinition;
export declare function fakeDefinitionToMetadata(def: FakePackDefinition): PackMetadata;
