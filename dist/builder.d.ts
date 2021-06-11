import type { Authentication } from './types';
import type { BasicPackDefinition } from './types';
import type { ConnectionRequirement } from './api_types';
import type { Format } from './types';
import type { FormulaDefinitionV2 } from './api';
import type { MetadataFormula } from './api';
import type { ObjectSchema } from './schema';
import type { ParamDefs } from './api_types';
import type { SyncFormulaDef } from './api';
import type { SyncTable } from './api';
import type { SystemAuthentication } from './types';
import type { TypedStandardFormula } from './api';
/**
 * Creates a new skeleton pack definition that can be added to.
 *
 * @example
 * export const pack = newPack();
 * pack.addFormula({resultType: ValueType.String, name: 'MyFormula', ...});
 * pack.addSyncTable('MyTable', ...);
 * pack.setUserAuthentication({type: AuthenticationType.HeaderBearerToken});
 */
export declare function newPack(definition?: Partial<BasicPackDefinition>): PackDefinitionBuilder;
declare class PackDefinitionBuilder implements BasicPackDefinition {
    formulas: TypedStandardFormula[];
    formats: Format[];
    syncTables: SyncTable[];
    networkDomains: string[];
    defaultAuthentication?: Authentication;
    systemConnectionAuthentication?: SystemAuthentication;
    formulaNamespace?: string;
    constructor(definition?: Partial<BasicPackDefinition>);
    addFormula<ParamDefsT extends ParamDefs>(definition: FormulaDefinitionV2<ParamDefsT>): this;
    addSyncTable<K extends string, L extends string, ParamDefsT extends ParamDefs, SchemaT extends ObjectSchema<K, L>>(name: string, schema: SchemaT, formula: SyncFormulaDef<ParamDefsT>, connectionRequirement?: ConnectionRequirement, dynamicOptions?: {
        getSchema?: MetadataFormula;
        entityName?: string;
    }): this;
    addDynamicSyncTable<ParamDefsT extends ParamDefs>(definition: {
        name: string;
        getName: MetadataFormula;
        getSchema: MetadataFormula;
        formula: SyncFormulaDef<ParamDefsT>;
        getDisplayUrl: MetadataFormula;
        listDynamicUrls?: MetadataFormula;
        entityName?: string;
        connectionRequirement?: ConnectionRequirement;
    }): this;
    addColumnFormat(format: Format): this;
    setUserAuthentication(authentication: Authentication): this;
    setSystemAuthentication(systemAuthentication: SystemAuthentication): this;
    addNetworkDomain(...domain: string[]): this;
}
export {};
