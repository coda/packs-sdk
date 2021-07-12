import type { Authentication } from './types';
import type { AuthenticationDef } from './types';
import type { BasicPackDefinition } from './types';
import type { ConnectionRequirement } from './api_types';
import type { Format } from './types';
import type { Formula } from './api';
import type { FormulaDefinitionV2 } from './api';
import type { MetadataFormulaDef } from './api';
import type { ObjectSchema } from './schema';
import type { ParamDefs } from './api_types';
import type { SyncFormulaDef } from './api';
import type { SyncTable } from './api';
import type { SyncTableOptions } from './api';
import type { SystemAuthentication } from './types';
import type { SystemAuthenticationDef } from './types';
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
export declare class PackDefinitionBuilder implements BasicPackDefinition {
    formulas: Formula[];
    formats: Format[];
    syncTables: SyncTable[];
    networkDomains: string[];
    defaultAuthentication?: Authentication;
    systemConnectionAuthentication?: SystemAuthentication;
    formulaNamespace?: string;
    private _defaultConnectionRequirement;
    constructor(definition?: Partial<BasicPackDefinition>);
    addFormula<ParamDefsT extends ParamDefs>(definition: FormulaDefinitionV2<ParamDefsT>): this;
    addSyncTable<K extends string, L extends string, ParamDefsT extends ParamDefs, SchemaT extends ObjectSchema<K, L>>({ name, identityName, schema, formula, connectionRequirement, dynamicOptions, }: SyncTableOptions<K, L, ParamDefsT, SchemaT>): this;
    addDynamicSyncTable<ParamDefsT extends ParamDefs>(definition: {
        name: string;
        identityName: string;
        getName: MetadataFormulaDef;
        getSchema: MetadataFormulaDef;
        formula: SyncFormulaDef<ParamDefsT>;
        getDisplayUrl: MetadataFormulaDef;
        listDynamicUrls?: MetadataFormulaDef;
        entityName?: string;
        connectionRequirement?: ConnectionRequirement;
    }): this;
    addColumnFormat(format: Format): this;
    setUserAuthentication(authentication: AuthenticationDef): this;
    setSystemAuthentication(systemAuthentication: SystemAuthenticationDef): this;
    addNetworkDomain(...domain: string[]): this;
    setDefaultConnectionRequirement(connectionRequirement: ConnectionRequirement): this;
}
