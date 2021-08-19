import type { Authentication } from './types';
import type { AuthenticationDef } from './types';
import type { BasicPackDefinition } from './types';
import { ConnectionRequirement } from './api_types';
import type { DynamicSyncTableOptions } from './api';
import type { Format } from './types';
import type { Formula } from './api';
import type { FormulaDefinitionV2 } from './api';
import type { ObjectSchema } from './schema';
import type { PackVersionDefinition } from './types';
import type { ParamDefs } from './api_types';
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
export declare function newPack(definition?: Partial<PackVersionDefinition>): PackDefinitionBuilder;
export declare class PackDefinitionBuilder implements BasicPackDefinition {
    formulas: Formula[];
    formats: Format[];
    syncTables: SyncTable[];
    networkDomains: string[];
    defaultAuthentication?: Authentication;
    systemConnectionAuthentication?: SystemAuthentication;
    version?: string;
    formulaNamespace?: string;
    private _defaultConnectionRequirement;
    constructor(definition?: Partial<PackVersionDefinition>);
    /**
     * Adds a formula definition to this pack.
     *
     * In the web editor, the `/Formula` shortcut will insert a snippet of a skeleton formula.
     *
     * @example
     * pack.addFormula({
     *   resultType: ValueType.String,
     *    name: 'MyFormula',
     *    description: 'My description.',
     *    parameters: [
     *      makeParameter({
     *        type: ParameterType.String,
     *        name: 'myParam',
     *        description: 'My param description.',
     *      }),
     *    ],
     *    execute: async ([param]) => {
     *      return `Hello ${param}`;
     *    },
     * });
     */
    addFormula<ParamDefsT extends ParamDefs>(definition: FormulaDefinitionV2<ParamDefsT>): this;
    /**
     * Adds a sync table definition to this pack.
     *
     * In the web editor, the `/SyncTable` shortcut will insert a snippet of a skeleton sync table.
     *
     * @example
     * pack.addSyncTable({
     *   name: 'MySyncTable',
     *   identityName: 'EntityName',
     *   schema: coda.makeObjectSchema({
     *     ...
     *   }),
     *   formula: {
     *     ...
     *   },
     * });
     */
    addSyncTable<K extends string, L extends string, ParamDefsT extends ParamDefs, SchemaT extends ObjectSchema<K, L>>({ name, identityName, schema, formula, connectionRequirement, dynamicOptions, }: SyncTableOptions<K, L, ParamDefsT, SchemaT>): this;
    /**
     * Adds a dynamic sync table definition to this pack.
     *
     * In the web editor, the `/DynamicSyncTable` shortcut will insert a snippet of a skeleton sync table.
     *
     * @example
     * pack.addDynamicSyncTable({
     *   name: 'MySyncTable',
     *   getName: async (context) => {
     *     const response = await context.fetcher.fetch({method: 'GET', url: context.sync.dynamicUrl});
     *     return response.body.name;
     *   },
     *   getName: async (context) => {
     *     const response = await context.fetcher.fetch({method: 'GET', url: context.sync.dynamicUrl});
     *     return response.body.browserLink;
     *   },
     *   ...
     * });
     */
    addDynamicSyncTable<ParamDefsT extends ParamDefs>(definition: DynamicSyncTableOptions<ParamDefsT>): this;
    /**
     * Adds a column format definition to this pack.
     *
     * In the web editor, the `/ColumnFormat` shortcut will insert a snippet of a skeleton format.
     *
     * @example
     * pack.addColumnFormat({
     *   name: 'MyColumn',
     *   formulaName: 'MyFormula',
     * });
     */
    addColumnFormat(format: Format): this;
    /**
     * Sets this pack to use authentication for individual users, using the
     * authentication method is the given definition.
     *
     * Each user will need to register an account in order to use this pack.
     *
     * In the web editor, the `/UserAuthentication` shortcut will insert a snippet of a skeleton
     * authentication definition.
     *
     * By default, this will set a default connection (account) requirement, making a user account
     * required to invoke all formulas in this pack unless you specify differently on a particular
     * formula. To change the default, you can pass a `defaultConnectionRequirement` option into
     * this method.
     *
     * @example
     * pack.setUserAuthentication({
     *   type: AuthenticationType.HeaderBearerToken,
     * });
     */
    setUserAuthentication(authDef: AuthenticationDef & {
        defaultConnectionRequirement?: ConnectionRequirement;
    }): this;
    /**
     * Sets this pack to use authentication provided by you as the maker of this pack.
     *
     * You will need to register credentials to use with this pack. When users use the
     * pack, their requests will be authenticated with those system credentials, they need
     * not register their own account.
     *
     * In the web editor, the `/SystemAuthentication` shortcut will insert a snippet of a skeleton
     * authentication definition.
     *
     * @example
     * pack.setSystemAuthentication({
     *   type: AuthenticationType.HeaderBearerToken,
     * });
     */
    setSystemAuthentication(systemAuthentication: SystemAuthenticationDef): this;
    /**
     * Adds the domain that this pack makes HTTP requests to.
     * For example, if your pack makes HTTP requests to "api.example.com",
     * use "example.com" as your network domain.
     *
     * If your pack make HTTP requests, it must declare a network domain,
     * for security purposes. Coda enforces that your pack cannot make requests to
     * any undeclared domains.
     *
     * You are allowed one network domain per pack by default. If your pack needs
     * to connect to multiple domains, contact Coda Support for approval.
     *
     * @example
     * pack.addNetworkDomain('example.com');
     */
    addNetworkDomain(...domain: string[]): this;
    /**
     * Sets the semantic version of this pack version, e.g. `'1.2.3'`.
     *
     * This is optional, and you only need to provide a version if you are manually doing
     * semantic versioning, or using the CLI. If using the web editor, you can omit this
     * and the web editor will automatically provide an appropriate semantic version
     * each time you build a version.
     *
     * @example
     * pack.setVersion('1.2.3');
     */
    setVersion(version: string): this;
    private _setDefaultConnectionRequirement;
}
