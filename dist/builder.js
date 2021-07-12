"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackDefinitionBuilder = exports.newPack = void 0;
const types_1 = require("./types");
const api_1 = require("./api");
const api_2 = require("./api");
const api_3 = require("./api");
const api_4 = require("./api");
const api_5 = require("./api");
const api_6 = require("./api");
/**
 * Creates a new skeleton pack definition that can be added to.
 *
 * @example
 * export const pack = newPack();
 * pack.addFormula({resultType: ValueType.String, name: 'MyFormula', ...});
 * pack.addSyncTable('MyTable', ...);
 * pack.setUserAuthentication({type: AuthenticationType.HeaderBearerToken});
 */
function newPack(definition) {
    return new PackDefinitionBuilder(definition);
}
exports.newPack = newPack;
class PackDefinitionBuilder {
    constructor(definition) {
        const { formulas, formats, syncTables, networkDomains, defaultAuthentication, systemConnectionAuthentication, formulaNamespace, } = definition || {};
        this.formulas = Array.isArray(formulas) ? formulas : [];
        this.formats = formats || [];
        this.syncTables = syncTables || [];
        this.networkDomains = networkDomains || [];
        this.defaultAuthentication = defaultAuthentication;
        this.systemConnectionAuthentication = systemConnectionAuthentication;
        this.formulaNamespace = formulaNamespace || 'Deprecated';
    }
    addFormula(definition) {
        const formula = api_3.makeFormula({
            ...definition,
            connectionRequirement: definition.connectionRequirement || this._defaultConnectionRequirement,
        });
        this.formulas.push(formula); // WTF
        return this;
    }
    addSyncTable({ name, identityName, schema, formula, connectionRequirement, dynamicOptions = {}, }) {
        const connectionRequirementToUse = connectionRequirement || this._defaultConnectionRequirement;
        const syncTable = api_4.makeSyncTable({
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
    addDynamicSyncTable(definition) {
        const dynamicSyncTable = api_2.makeDynamicSyncTable({
            ...definition,
            connectionRequirement: definition.connectionRequirement || this._defaultConnectionRequirement,
        });
        this.syncTables.push(dynamicSyncTable);
        return this;
    }
    addColumnFormat(format) {
        this.formats.push(format);
        return this;
    }
    setUserAuthentication(authentication) {
        if (authentication.type === types_1.AuthenticationType.None || authentication.type === types_1.AuthenticationType.Various) {
            this.defaultAuthentication = authentication;
        }
        else {
            const { getConnectionName: getConnectionNameDef, getConnectionUserId: getConnectionUserIdDef, ...rest } = authentication;
            const getConnectionName = api_6.wrapMetadataFunction(getConnectionNameDef);
            const getConnectionUserId = api_6.wrapMetadataFunction(getConnectionUserIdDef);
            this.defaultAuthentication = { ...rest, getConnectionName, getConnectionUserId };
        }
        return this;
    }
    setSystemAuthentication(systemAuthentication) {
        const { getConnectionName: getConnectionNameDef, getConnectionUserId: getConnectionUserIdDef, ...rest } = systemAuthentication;
        const getConnectionName = api_6.wrapMetadataFunction(getConnectionNameDef);
        const getConnectionUserId = api_6.wrapMetadataFunction(getConnectionUserIdDef);
        this.systemConnectionAuthentication = { ...rest, getConnectionName, getConnectionUserId };
        return this;
    }
    addNetworkDomain(...domain) {
        this.networkDomains.push(...domain);
        return this;
    }
    setDefaultConnectionRequirement(connectionRequirement) {
        this._defaultConnectionRequirement = connectionRequirement;
        // Rewrite any formulas or sync tables that were already defined, in case the maker sets the default
        // after the fact.
        this.formulas = this.formulas.map(formula => {
            return formula.connectionRequirement ? formula : api_5.maybeRewriteConnectionForFormula(formula, connectionRequirement);
        });
        this.syncTables = this.syncTables.map(syncTable => {
            if (syncTable.getter.connectionRequirement) {
                return syncTable;
            }
            else if (api_1.isDynamicSyncTable(syncTable)) {
                return {
                    ...syncTable,
                    getter: api_5.maybeRewriteConnectionForFormula(syncTable.getter, connectionRequirement),
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
                    getName: api_5.maybeRewriteConnectionForFormula(syncTable.getName, connectionRequirement),
                    getDisplayUrl: api_5.maybeRewriteConnectionForFormula(syncTable.getDisplayUrl, connectionRequirement),
                    getSchema: api_5.maybeRewriteConnectionForFormula(syncTable.getSchema, connectionRequirement),
                    listDynamicUrls: api_5.maybeRewriteConnectionForFormula(syncTable.listDynamicUrls, connectionRequirement),
                };
            }
            else {
                return {
                    ...syncTable,
                    getter: api_5.maybeRewriteConnectionForFormula(syncTable.getter, connectionRequirement),
                    getSchema: api_5.maybeRewriteConnectionForFormula(syncTable.getSchema, connectionRequirement),
                };
            }
        });
        return this;
    }
}
exports.PackDefinitionBuilder = PackDefinitionBuilder;
