"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentDefinitionBuilder = exports.PackDefinitionBuilder = exports.BaseDefinitionBuilder = exports.newAgent = exports.newPack = void 0;
const types_1 = require("./types");
const api_types_1 = require("./api_types");
const types_2 = require("./types");
const types_3 = require("./types");
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
 * Creates a new skeleton agent definition that can be added to.
 *
 * @example
 * ```
 * export const pack = newAgent();
 * pack.setInstructions('You help a team run async standups. Keep replies short.');
 * ```
 *
 * @internal
 * @hidden
 */
function newAgent() {
    return new AgentDefinitionBuilder();
}
exports.newAgent = newAgent;
/**
 * Fields and methods shared by {@link PackDefinitionBuilder} and {@link AgentDefinitionBuilder}.
 *
 * @internal
 * @hidden
 */
class BaseDefinitionBuilder {
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
}
exports.BaseDefinitionBuilder = BaseDefinitionBuilder;
/**
 * A class that assists in constructing a pack definition. Use {@link newPack} to create one.
 */
class PackDefinitionBuilder extends BaseDefinitionBuilder {
    /**
     * Constructs a {@link PackDefinitionBuilder}. However, `sdk.newPack()` should be used instead
     * rather than constructing a builder directly.
     */
    constructor(definition) {
        super();
        const { formulas, formats, syncTables, skills, chatSkill, benchInitializationSkill, networkDomains, defaultAuthentication, systemConnectionAuthentication, version, formulaNamespace, skillEntrypoints, suggestedPrompts, mcpServers, } = definition || {};
        this.formulas = formulas || [];
        this.formats = formats || [];
        this.syncTables = syncTables || [];
        this.skills = skills || [];
        this.skillEntrypoints = skillEntrypoints;
        this.chatSkill = chatSkill;
        this.benchInitializationSkill = benchInitializationSkill;
        this.suggestedPrompts = suggestedPrompts || [];
        this.networkDomains = networkDomains || [];
        this.mcpServers = mcpServers || [];
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
     *   schema: sdk.makeObjectSchema({
     *     ...
     *   }),
     *   formula: {
     *     ...
     *   },
     * });
     * ```
     */
    addSyncTable(definition) {
        const connectionRequirementToUse = definition.connectionRequirement || this._defaultConnectionRequirement;
        const syncTable = (0, api_4.makeSyncTable)({
            ...definition,
            connectionRequirement: connectionRequirementToUse,
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
     *
     * Only supported in Superhuman Docs.
     */
    addColumnFormat(format) {
        this.formats.push(format);
        return this;
    }
    /**
     * Adds a skill definition to this pack.
     *
     * In the web editor, the `/Skill` shortcut will insert a snippet of a skeleton skill.
     *
     * @example
     * ```
     * pack.addSkill({
     *   name: "MySkill",
     *   displayName: "My Display Name",
     *   description: "My description.",
     *   prompt: `My prompt.`,
     *   tools: [
     *     { type: sdk.ToolType.Pack },
     *   ],
     * });
     * ```
     */
    addSkill(skill) {
        this.skills.push(skill);
        return this;
    }
    /**
     * Adds an MCP server to this pack.
     *
     * @example
     * ```
     * pack.addMCPServer({name: 'MyMCPServer', endpointUrl: 'https://my-mcp-server.com'});
     * ```
     *
     * Only supported in Superhuman Go.
     */
    addMCPServer(server) {
        this.mcpServers.push(server);
        return this;
    }
    /**
     * Sets the chat skill for agent.
     *
     * The chat skill controls the behavior when users chat with the agent.
     * It defines the prompts, available tools, and optionally the model to use.
     *
     * All fields are optional — omitted fields use defaults at runtime. When `tools` is omitted,
     * the agent automatically gets:
     *
     * - {@link ToolType.Pack} — the pack's own formulas
     * - {@link ToolType.Knowledge} — search over the pack's sync table data (when sync tables exist)
     *
     * Specifying `tools` replaces these defaults entirely.
     *
     * @example
     * ```ts
     * // Override just the prompt — default tools are preserved
     * pack.setChatSkill({
     *   prompt: "End every reply with 'Moo!'",
     * });
     *
     * // Override tools — replaces the defaults
     * pack.setChatSkill({
     *   tools: [
     *     { type: sdk.ToolType.Pack },
     *     { type: sdk.ToolType.ContactResolution },
     *   ],
     * });
     * ```
     *
     * @deprecated No longer used, now that agents are connectors.
     */
    setChatSkill(skill) {
        this.chatSkill = skill;
        return this;
    }
    /**
     * Sets the skill used when the agent is first opened in the agent bench.
     * All fields are optional - omitted fields will use defaults at runtime.
     *
     * @example
     * ```ts
     * pack.setBenchInitializationSkill({
     *   prompt: `
     *     Say hello to the user, referencing the time of day and a friendly nickname.
     *     For example: 10AM, Kramer => "Good morning K-man!"
     *   `,
     *   tools: [],
     * });
     * ```
     *
     * @deprecated No longer used, now that agents are connectors.
     */
    setBenchInitializationSkill(skill) {
        this.benchInitializationSkill = skill;
        return this;
    }
    /**
     * Maps entrypoints to skills in the Pack.
     *
     * @example
     * ```
     * pack.setSkillEntrypoints({
     *   defaultChat: { skillName: "MySkill" },
     * });
     * ```
     *
     * @deprecated No longer used, now that agents are connectors.
     */
    setSkillEntrypoints(entrypoints) {
        this.skillEntrypoints = entrypoints;
        return this;
    }
    /**
     * Adds a suggested prompt that appears as a button when the agent is opened in chat.
     *
     * @example
     * ```
     * pack.addSuggestedPrompt({
     *   name: "TicketStatus",
     *   displayName: "Check ticket status",
     *   prompt: `
     *     Show me the status of all open support tickets.
     *   `,
     * });
     * ```
     *
     * @deprecated No longer used, now that agents are connectors.
     */
    addSuggestedPrompt(prompt) {
        this.suggestedPrompts.push(prompt);
        return this;
    }
    _wrapAuthenticationFunctions(authentication) {
        const { getConnectionName: getConnectionNameDef, getConnectionUserId: getConnectionUserIdDef, postSetup: postSetupDef, ...rest } = authentication;
        const getConnectionName = (0, api_7.wrapMetadataFunction)(getConnectionNameDef);
        const getConnectionUserId = (0, api_7.wrapMetadataFunction)(getConnectionUserIdDef);
        const postSetup = postSetupDef === null || postSetupDef === void 0 ? void 0 : postSetupDef.map(step => {
            const getOptions = (0, api_7.wrapMetadataFunction)((0, migration_1.setEndpointDefHelper)(step).getOptions);
            const getOptionsFormula = (0, api_7.wrapMetadataFunction)(step.getOptionsFormula);
            return { ...step, getOptions, getOptionsFormula };
        });
        return { ...rest, getConnectionName, getConnectionUserId, postSetup };
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
            this.defaultAuthentication = this._wrapAuthenticationFunctions(authentication);
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
        // TODO(patrick): Remove this cast
        this.systemConnectionAuthentication = this._wrapAuthenticationFunctions(systemAuthentication);
        return this;
    }
    /**
     * TODO(patrick): Unhide this
     * @hidden
     */
    addAdminAuthentication(adminAuth) {
        if (!this.adminAuthentications) {
            this.adminAuthentications = [];
        }
        this.adminAuthentications.push({
            ...adminAuth,
            authentication: this._wrapAuthenticationFunctions(adminAuth.authentication),
        });
        return this;
    }
    /**
     * Adds the domain that this pack makes HTTP requests to.
     * For example, if your pack makes HTTP requests to "api.example.com",
     * use "example.com" as your network domain.
     *
     * If your pack make HTTP requests, it must declare a network domain,
     * for security purposes. The platform enforces that your pack cannot make requests to
     * any undeclared domains.
     *
     * You are allowed one network domain per pack by default. If your pack needs
     * to connect to multiple domains, contact Superhuman for approval.
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
/**
 * A class that assists in constructing an agent definition. Use {@link newAgent} to create one.
 *
 * @internal
 * @hidden
 */
class AgentDefinitionBuilder extends BaseDefinitionBuilder {
    constructor() {
        super(...arguments);
        /**
         * See {@link PackVersionDefinition.agent}.
         */
        this.agent = { tools: [] };
    }
    /**
     * Sets this agent's instructions.
     *
     * @example
     * ```
     * pack.setInstructions('You help a team run async standups. Keep replies short.');
     * ```
     */
    setInstructions(instructions) {
        this.agent.instructions = instructions;
        return this;
    }
    /**
     * Sets the tools this agent can use. Anything left out is off.
     *
     * @example
     * ```
     * pack.setTools({docs: true, mail: true, webSearch: {allowedDomains: ['docs.example.com']}});
     * pack.setTools({connectors: [{packId: 1234, formulas: [{formulaName: 'CreateTask'}]}]});
     * ```
     */
    setTools({ docs, mail, webSearch, connectors }) {
        const tools = [];
        if (webSearch) {
            const allowedDomains = typeof webSearch === 'object' ? webSearch.allowedDomains : undefined;
            tools.push({ type: types_3.ToolType.WebSearch, ...(allowedDomains ? { allowedDomains } : {}) });
        }
        if (docs) {
            tools.push({ type: types_3.ToolType.CodaDocsAndTables });
        }
        if (mail) {
            tools.push({ type: types_3.ToolType.MailAndCalendar });
        }
        for (const connector of connectors || []) {
            tools.push({
                type: types_3.ToolType.Pack,
                packId: connector.packId,
                ...(connector.formulas ? { formulas: connector.formulas } : {}),
            });
        }
        this.agent.tools = tools;
        return this;
    }
    /**
     * Sets the while-writing trigger this agent runs on.
     *
     * @example
     * ```
     * pack.setDefaultWhileWritingTrigger({
     *   condition: 'Offer a citation when the user asserts a statistic',
     *   enabled: true,
     *   surfaces: [sdk.ContextualTriggerSurface.Docs, sdk.ContextualTriggerSurface.Email],
     * });
     * ```
     */
    setDefaultWhileWritingTrigger(contextualTrigger) {
        var _a;
        const otherTriggers = ((_a = this.defaultTriggers) !== null && _a !== void 0 ? _a : []).filter(trigger => trigger.kind !== types_2.DefaultTriggerKind.WhileWriting);
        this.defaultTriggers = [...otherTriggers, { kind: types_2.DefaultTriggerKind.WhileWriting, ...contextualTrigger }];
        return this;
    }
}
exports.AgentDefinitionBuilder = AgentDefinitionBuilder;
