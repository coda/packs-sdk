"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackDefinitionBuilder = exports.newPack = void 0;
const types_1 = require("./types");
const api_types_1 = require("./api_types");
const api_1 = require("./api");
const api_2 = require("./api");
const api_3 = require("./api");
const api_4 = require("./api");
const api_5 = require("./api");
const api_6 = require("./api");
const migration_1 = require("./helpers/migration");
const api_7 = require("./api");
/**
 * Creates a new skeleton pack definition that can be added to.
 *
 * @example
 * ```
 * export const pack = newPack();
 * pack.addFormula({resultType: ValueType.String, name: 'MyFormula', ...});
 * pack.addSyncTable('MyTable', ...);
 * pack.setUserAuthentication({type: AuthenticationType.HeaderBearerToken});
 * ```
 */
function newPack(definition) {
    return new PackDefinitionBuilder(definition);
}
exports.newPack = newPack;
/**
 * A class that assists in constructing a pack definition. Use {@link newPack} to create one.
 */
class PackDefinitionBuilder {
    /**
     * Constructs a {@link PackDefinitionBuilder}. However, `coda.newPack()` should be used instead
     * rather than constructing a builder directly.
     */
    constructor(definition) {
        const { formulas, formats, syncTables, networkDomains, defaultAuthentication, systemConnectionAuthentication, version, formulaNamespace, } = definition || {};
        this.formulas = formulas || [];
        this.formats = formats || [];
        this.syncTables = syncTables || [];
        this.networkDomains = networkDomains || [];
        this.defaultAuthentication = defaultAuthentication;
        this.systemConnectionAuthentication = systemConnectionAuthentication;
        this.version = version;
        this.formulaNamespace = formulaNamespace || 'Deprecated';
    }
    /**
     * Adds a formula definition to this pack.
     *
     * In the web editor, the `/Formula` shortcut will insert a snippet of a skeleton formula.
     *
     * @example
     * ```
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
     * ```
     */
    addFormula(definition) {
        const formula = (0, api_3.makeFormula)({
            ...definition,
            connectionRequirement: definition.connectionRequirement || this._defaultConnectionRequirement,
        });
        this.formulas.push(formula); // WTF
        return this;
    }
    /**
     * Adds a sync table definition to this pack.
     *
     * In the web editor, the `/SyncTable` shortcut will insert a snippet of a skeleton sync table.
     *
     * @example
     * ```
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
     * ```
     */
    addSyncTable({ name, description, identityName, schema, formula, connectionRequirement, dynamicOptions = {}, }) {
        const connectionRequirementToUse = connectionRequirement || this._defaultConnectionRequirement;
        const syncTable = (0, api_4.makeSyncTable)({
            name,
            description,
            identityName,
            schema,
            formula,
            connectionRequirement: connectionRequirementToUse,
            dynamicOptions,
        });
        this.syncTables.push(syncTable);
        return this;
    }
    /**
     * Adds a dynamic sync table definition to this pack.
     *
     * In the web editor, the `/DynamicSyncTable` shortcut will insert a snippet of a skeleton sync table.
     *
     * @example
     * ```
     * pack.addDynamicSyncTable({
     *   name: "MySyncTable",
     *   getName: async funciton (context) => {
     *     const response = await context.fetcher.fetch({method: "GET", url: context.sync.dynamicUrl});
     *     return response.body.name;
     *   },
     *   getName: async function (context) => {
     *     const response = await context.fetcher.fetch({method: "GET", url: context.sync.dynamicUrl});
     *     return response.body.browserLink;
     *   },
     *   ...
     * });
     * ```
     */
    addDynamicSyncTable(definition) {
        const dynamicSyncTable = (0, api_2.makeDynamicSyncTable)({
            ...definition,
            connectionRequirement: definition.connectionRequirement || this._defaultConnectionRequirement,
        });
        this.syncTables.push(dynamicSyncTable);
        return this;
    }
    /**
     * Adds a column format definition to this pack.
     *
     * In the web editor, the `/ColumnFormat` shortcut will insert a snippet of a skeleton format.
     *
     * @example
     * ```
     * pack.addColumnFormat({
     *   name: 'MyColumn',
     *   formulaName: 'MyFormula',
     * });
     * ```
     */
    addColumnFormat(format) {
        this.formats.push(format);
        return this;
    }
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
     * ```
     * pack.setUserAuthentication({
     *   type: AuthenticationType.HeaderBearerToken,
     * });
     * ```
     */
    setUserAuthentication(authDef) {
        const { defaultConnectionRequirement = api_types_1.ConnectionRequirement.Required, ...authentication } = authDef;
        if (authentication.type === types_1.AuthenticationType.None || authentication.type === types_1.AuthenticationType.Various) {
            this.defaultAuthentication = authentication;
        }
        else {
            const { getConnectionName: getConnectionNameDef, getConnectionUserId: getConnectionUserIdDef, postSetup: postSetupDef, ...rest } = authentication;
            const getConnectionName = (0, api_7.wrapMetadataFunction)(getConnectionNameDef);
            const getConnectionUserId = (0, api_7.wrapMetadataFunction)(getConnectionUserIdDef);
            const postSetup = postSetupDef === null || postSetupDef === void 0 ? void 0 : postSetupDef.map(step => {
                return { ...step, getOptions: (0, api_7.wrapMetadataFunction)((0, migration_1.setEndpointDefHelper)(step).getOptions) };
            });
            this.defaultAuthentication = { ...rest, getConnectionName, getConnectionUserId, postSetup };
        }
        if (authentication.type !== types_1.AuthenticationType.None) {
            this._setDefaultConnectionRequirement(defaultConnectionRequirement);
        }
        return this;
    }
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
     * ```
     * pack.setSystemAuthentication({
     *   type: AuthenticationType.HeaderBearerToken,
     * });
     * ```
     */
    setSystemAuthentication(systemAuthentication) {
        const { getConnectionName: getConnectionNameDef, getConnectionUserId: getConnectionUserIdDef, postSetup: postSetupDef, ...rest } = systemAuthentication;
        const getConnectionName = (0, api_7.wrapMetadataFunction)(getConnectionNameDef);
        const getConnectionUserId = (0, api_7.wrapMetadataFunction)(getConnectionUserIdDef);
        const postSetup = postSetupDef === null || postSetupDef === void 0 ? void 0 : postSetupDef.map(step => {
            return { ...step, getOptions: (0, api_7.wrapMetadataFunction)((0, migration_1.setEndpointDefHelper)(step).getOptions) };
        });
        this.systemConnectionAuthentication = {
            ...rest,
            getConnectionName,
            getConnectionUserId,
            postSetup,
        };
        return this;
    }
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
     * ```
     * pack.addNetworkDomain('example.com');
     * ```
     */
    addNetworkDomain(...domain) {
        this.networkDomains.push(...domain);
        return this;
    }
    /**
     * Sets the semantic version of this pack version, e.g. `'1.2.3'`.
     *
     * This is optional, and you only need to provide a version if you are manually doing
     * semantic versioning, or using the CLI. If using the web editor, you can omit this
     * and the web editor will automatically provide an appropriate semantic version
     * each time you build a version.
     *
     * @example
     * ```
     * pack.setVersion('1.2.3');
     * ```
     */
    setVersion(version) {
        this.version = version;
        return this;
    }
    _setDefaultConnectionRequirement(connectionRequirement) {
        this._defaultConnectionRequirement = connectionRequirement;
        // Rewrite any formulas or sync tables that were already defined, in case the maker sets the default
        // after the fact.
        this.formulas = this.formulas.map(formula => {
            return formula.connectionRequirement ? formula : (0, api_5.maybeRewriteConnectionForFormula)(formula, connectionRequirement);
        });
        this.syncTables = this.syncTables.map(syncTable => {
            if (syncTable.getter.connectionRequirement) {
                return syncTable;
            }
            else if ((0, api_1.isDynamicSyncTable)(syncTable)) {
                return {
                    ...syncTable,
                    getter: (0, api_5.maybeRewriteConnectionForFormula)(syncTable.getter, connectionRequirement),
                    // These 4 are metadata formulas, so they use ConnectionRequirement.Required
                    // by default if you don't specify a connection requirement (a legacy behavior
                    // that is confusing and perhaps undesirable now that we have better builders).
                    // We don't know if the maker set Required explicitly or if was just the default,
                    // so we don't know if we should overwrite the connection requirement. For lack
                    // of a better option, we'll override it here regardless. This ensure that these
                    // dynamic sync table metadata formulas have the same connetion requirement as the
                    // sync table itself, which seems desirable basically 100% of the time and should
                    // always work, but it does give rise to confusing behavior that calling
                    // setDefaultConnectionRequirement() can wipe away an explicit connection
                    // requirement override set on one of these 4 metadata formulas.
                    getName: (0, api_5.maybeRewriteConnectionForFormula)(syncTable.getName, connectionRequirement),
                    getDisplayUrl: (0, api_5.maybeRewriteConnectionForFormula)(syncTable.getDisplayUrl, connectionRequirement),
                    getSchema: (0, api_5.maybeRewriteConnectionForFormula)(syncTable.getSchema, connectionRequirement),
                    listDynamicUrls: (0, api_5.maybeRewriteConnectionForFormula)(syncTable.listDynamicUrls, connectionRequirement),
                    searchDynamicUrls: (0, api_5.maybeRewriteConnectionForFormula)(syncTable.searchDynamicUrls, connectionRequirement),
                    namedPropertyOptions: (0, api_6.maybeRewriteConnectionForNamedPropertyOptions)(syncTable.namedPropertyOptions, connectionRequirement),
                };
            }
            else {
                return {
                    ...syncTable,
                    getter: (0, api_5.maybeRewriteConnectionForFormula)(syncTable.getter, connectionRequirement),
                    getSchema: (0, api_5.maybeRewriteConnectionForFormula)(syncTable.getSchema, connectionRequirement),
                    namedPropertyOptions: (0, api_6.maybeRewriteConnectionForNamedPropertyOptions)(syncTable.namedPropertyOptions, connectionRequirement),
                };
            }
        });
        return this;
    }
}
exports.PackDefinitionBuilder = PackDefinitionBuilder;
