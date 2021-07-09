"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackDefinitionBuilder = exports.newPack = void 0;
const types_1 = require("./types");
const api_1 = require("./api");
const api_2 = require("./api");
const api_3 = require("./api");
const api_4 = require("./api");
const api_5 = require("./api");
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
        const formula = api_2.makeFormula({
            ...definition,
            connectionRequirement: definition.connectionRequirement || this._defaultConnectionRequirement,
        });
        this.formulas.push(formula); // WTF
        return this;
    }
    addSyncTable({ name, identityName, schema, formula, connectionRequirement, dynamicOptions = {}, }) {
        const connectionRequirementToUse = connectionRequirement || this._defaultConnectionRequirement;
        const syncTable = api_3.makeSyncTable({
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
        const dynamicSyncTable = api_1.makeDynamicSyncTable({
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
            const getConnectionName = api_5.wrapMetadataFunction(getConnectionNameDef);
            const getConnectionUserId = api_5.wrapMetadataFunction(getConnectionUserIdDef);
            this.defaultAuthentication = { ...rest, getConnectionName, getConnectionUserId };
        }
        return this;
    }
    setSystemAuthentication(systemAuthentication) {
        const { getConnectionName: getConnectionNameDef, getConnectionUserId: getConnectionUserIdDef, ...rest } = systemAuthentication;
        const getConnectionName = api_5.wrapMetadataFunction(getConnectionNameDef);
        const getConnectionUserId = api_5.wrapMetadataFunction(getConnectionUserIdDef);
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
        [...this.formulas].forEach((formula, i) => {
            if (!formula.connectionRequirement) {
                const newFormula = api_4.maybeRewriteConnectionForFormula({ ...formula, connectionRequirement }, connectionRequirement);
                this.formulas.splice(i, 1, newFormula);
            }
        });
        [...this.syncTables].forEach((syncTable, i) => {
            if (!syncTable.getter.connectionRequirement) {
                const newSyncTable = {
                    ...syncTable,
                    getter: api_4.maybeRewriteConnectionForFormula(syncTable.getter, connectionRequirement),
                };
                this.syncTables.splice(i, 1, newSyncTable);
            }
        });
        return this;
    }
}
exports.PackDefinitionBuilder = PackDefinitionBuilder;
