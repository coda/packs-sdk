import type {Authentication} from './types';
import type {AuthenticationDef} from './types';
import {AuthenticationType} from './types';
import type {BasicPackDefinition} from './types';
import type {ConnectionRequirement} from './api_types';
import type {Format} from './types';
import type {Formula} from './api';
import type {FormulaDefinitionV2} from './api';
import type {MetadataFormula} from './api';
import type {ObjectSchema} from './schema';
import type {ParamDefs} from './api_types';
import type {SyncFormulaDef} from './api';
import type {SyncTable} from './api';
import type {SyncTableOptions} from './api';
import type {SystemAuthentication} from './types';
import type {SystemAuthenticationDef} from './types';
import {makeDynamicSyncTable} from './api';
import {makeFormula} from './api';
import {makeSyncTable} from './api';
import {maybeRewriteConnectionForFormula} from './api';
import {wrapMetadataFunction} from './api';

/**
 * Creates a new skeleton pack definition that can be added to.
 *
 * @example
 * export const pack = newPack();
 * pack.addFormula({resultType: ValueType.String, name: 'MyFormula', ...});
 * pack.addSyncTable('MyTable', ...);
 * pack.setUserAuthentication({type: AuthenticationType.HeaderBearerToken});
 */
export function newPack(definition?: Partial<BasicPackDefinition>): PackDefinitionBuilder {
  return new PackDefinitionBuilder(definition);
}

export class PackDefinitionBuilder implements BasicPackDefinition {
  formulas: Formula[];
  formats: Format[];
  syncTables: SyncTable[];
  networkDomains: string[];

  defaultAuthentication?: Authentication;
  systemConnectionAuthentication?: SystemAuthentication;

  formulaNamespace?: string;

  private _defaultConnectionRequirement: ConnectionRequirement | undefined;

  constructor(definition?: Partial<BasicPackDefinition>) {
    const {
      formulas,
      formats,
      syncTables,
      networkDomains,
      defaultAuthentication,
      systemConnectionAuthentication,
      formulaNamespace,
    } = definition || {};
    this.formulas = Array.isArray(formulas) ? formulas : [];
    this.formats = formats || [];
    this.syncTables = syncTables || [];
    this.networkDomains = networkDomains || [];
    this.defaultAuthentication = defaultAuthentication;
    this.systemConnectionAuthentication = systemConnectionAuthentication;
    this.formulaNamespace = formulaNamespace || 'Deprecated';
  }

  addFormula<ParamDefsT extends ParamDefs>(definition: FormulaDefinitionV2<ParamDefsT>): this {
    const formula = makeFormula({
      ...definition,
      connectionRequirement: definition.connectionRequirement || this._defaultConnectionRequirement,
    });
    this.formulas.push(formula as any); // WTF
    return this;
  }

  addSyncTable<K extends string, L extends string, ParamDefsT extends ParamDefs, SchemaT extends ObjectSchema<K, L>>({
    name,
    identityName,
    schema,
    formula,
    connectionRequirement,
    dynamicOptions = {},
  }: SyncTableOptions<K, L, ParamDefsT, SchemaT>): this {
    const connectionRequirementToUse = connectionRequirement || this._defaultConnectionRequirement;
    const syncTable = makeSyncTable({
      name,
      identityName,
      schema,
      formula,
      connectionRequirement: connectionRequirementToUse,
      dynamicOptions,
    });
    this.syncTables.push(syncTable);
    return this;
  }

  // TODO(jonathan): Split out the definition into a type and add doc comments.
  addDynamicSyncTable<ParamDefsT extends ParamDefs>(definition: {
    name: string;
    identityName: string;
    getName: MetadataFormula;
    getSchema: MetadataFormula;
    formula: SyncFormulaDef<ParamDefsT>;
    getDisplayUrl: MetadataFormula;
    listDynamicUrls?: MetadataFormula;
    entityName?: string;
    connectionRequirement?: ConnectionRequirement;
  }): this {
    const dynamicSyncTable = makeDynamicSyncTable({
      ...definition,
      connectionRequirement: definition.connectionRequirement || this._defaultConnectionRequirement,
    });
    this.syncTables.push(dynamicSyncTable);
    return this;
  }

  addColumnFormat(format: Format): this {
    this.formats.push(format);
    return this;
  }

  setUserAuthentication(authentication: AuthenticationDef): this {
    if (authentication.type === AuthenticationType.None || authentication.type === AuthenticationType.Various) {
      this.defaultAuthentication = authentication;
    } else {
      const {
        getConnectionName: getConnectionNameDef,
        getConnectionUserId: getConnectionUserIdDef,
        ...rest
      } = authentication;
      const getConnectionName = wrapMetadataFunction(getConnectionNameDef);
      const getConnectionUserId = wrapMetadataFunction(getConnectionUserIdDef);
      this.defaultAuthentication = {...rest, getConnectionName, getConnectionUserId} as Authentication;
    }
    return this;
  }

  setSystemAuthentication(systemAuthentication: SystemAuthenticationDef): this {
    const {
      getConnectionName: getConnectionNameDef,
      getConnectionUserId: getConnectionUserIdDef,
      ...rest
    } = systemAuthentication;
    const getConnectionName = wrapMetadataFunction(getConnectionNameDef);
    const getConnectionUserId = wrapMetadataFunction(getConnectionUserIdDef);
    this.systemConnectionAuthentication = {...rest, getConnectionName, getConnectionUserId} as SystemAuthentication;
    return this;
  }

  addNetworkDomain(...domain: string[]): this {
    this.networkDomains.push(...domain);
    return this;
  }

  setDefaultConnectionRequirement(connectionRequirement: ConnectionRequirement): this {
    this._defaultConnectionRequirement = connectionRequirement;

    // Rewrite any formulas or sync tables that were already defined, in case the maker sets the default
    // after the fact.
    [...this.formulas].forEach((formula, i) => {
      if (!formula.connectionRequirement) {
        const newFormula = maybeRewriteConnectionForFormula({...formula, connectionRequirement}, connectionRequirement);
        this.formulas.splice(i, 1, newFormula);
      }
    });
    [...this.syncTables].forEach((syncTable, i) => {
      if (!syncTable.getter.connectionRequirement) {
        const newSyncTable: SyncTable = {
          ...syncTable,
          getter: maybeRewriteConnectionForFormula(syncTable.getter, connectionRequirement),
        };
        this.syncTables.splice(i, 1, newSyncTable);
      }
    });

    return this;
  }
}
