import { PackDefinition } from '../types';
import { PackFormulas } from '../api';
import { PackMetadata } from '../compiled_types';
export interface FakePackDefinition extends $Omit<PackDefinition, 'formulas'> {
    formulas?: PackFormulas;
}
export declare function fakeDefinitionToDefinition(def: FakePackDefinition): PackDefinition;
export declare function fakeDefinitionToMetadata(def: FakePackDefinition): PackMetadata;
