import type { AdminAuthentication } from './types';
import type { AdminAuthenticationDef } from './types';
import type { AgentDefinition } from './types';
import type { AgentToolsDef } from './types';
import type { Authentication } from './types';
import type { BasicPackDefinition } from './types';
import type { DefaultTriggerDefinition } from './types';
import type { DynamicSyncTableOptions } from './api';
import type { Format } from './types';
import type { Formula } from './api';
import type { FormulaDefinitionOptions } from './api';
import type { MCPServer } from './types';
import type { ObjectSchema } from './schema';
import type { ObjectSchemaDefinition } from './schema';
import type { PackVersionDefinition } from './types';
import type { ParamDefs } from './api_types';
import type { PartialSkillDef } from './types';
import type { ScheduleTriggerDefinition } from './types';
import type { Schema } from './schema';
import type { Skill } from './types';
import type { SkillEntrypoints } from './types';
import type { SuggestedPrompt } from './types';
import type { SyncExecutionContext } from './api_types';
import type { SyncPassthroughData } from './api';
import type { SyncTable } from './api';
import type { SyncTableOptions } from './api';
import type { SystemAuthentication } from './types';
import type { SystemAuthenticationDef } from './types';
import type { UserAuthenticationDef } from './api_types';
import type { ValueType } from './schema';
import type { WhileWritingTriggerDefinition } from './types';
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
export declare function newPack(definition?: Partial<Omit<PackVersionDefinition, 'agent' | 'defaultTriggers'>>): PackDefinitionBuilder;
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
export declare function newAgent(): AgentDefinitionBuilder;
/**
 * Fields and methods shared by {@link PackDefinitionBuilder} and {@link AgentDefinitionBuilder}.
 *
 * @internal
 * @hidden
 */
export declare class BaseDefinitionBuilder {
    /**
     * See {@link PackVersionDefinition.version}.
     */
    version?: string;
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
    setVersion(version: string): this;
}
/**
 * A class that assists in constructing a pack definition. Use {@link newPack} to create one.
 */
export declare class PackDefinitionBuilder extends BaseDefinitionBuilder implements BasicPackDefinition {
    /**
     * See {@link PackVersionDefinition.formulas}.
     */
    formulas: Formula[];
    /**
     * See {@link PackVersionDefinition.formats}.
     */
    formats: Format[];
    /**
     * See {@link PackVersionDefinition.syncTables}.
     */
    syncTables: SyncTable[];
    /**
     * See {@link PackVersionDefinition.skills}.
     */
    skills: Skill[];
    /**
     * See {@link PackVersionDefinition.skillEntrypoints}.
     * @deprecated No longer used, now that agents are connectors.
     */
    skillEntrypoints?: SkillEntrypoints;
    /**
     * See {@link PackVersionDefinition.chatSkill}.
     * @hidden
     * @deprecated No longer used, now that agents are connectors.
     */
    chatSkill?: PartialSkillDef;
    /**
     * See {@link PackVersionDefinition.benchInitializationSkill}.
     * @hidden
     * @deprecated No longer used, now that agents are connectors.
     */
    benchInitializationSkill?: PartialSkillDef;
    /**
     * See {@link PackVersionDefinition.suggestedPrompts}.
     * @hidden
     * @deprecated No longer used, now that agents are connectors.
     */
    suggestedPrompts: SuggestedPrompt[];
    /**
     * See {@link PackVersionDefinition.networkDomains}.
     */
    networkDomains: string[];
    /**
     * See {@link PackVersionDefinition.mcpServers}.
     * @hidden
     */
    mcpServers: MCPServer[];
    /**
     * See {@link PackVersionDefinition.defaultAuthentication}.
     */
    defaultAuthentication?: Authentication;
    /**
     * See {@link PackVersionDefinition.systemConnectionAuthentication}.
     */
    systemConnectionAuthentication?: SystemAuthentication;
    /**
     * See {@link PackVersionDefinition.adminAuthentications}.
     * @hidden
     */
    adminAuthentications?: AdminAuthentication[];
    /** @deprecated */
    formulaNamespace?: string;
    private _defaultConnectionRequirement;
    /**
     * Constructs a {@link PackDefinitionBuilder}. However, `sdk.newPack()` should be used instead
     * rather than constructing a builder directly.
     */
    constructor(definition?: Partial<Omit<PackVersionDefinition, 'agent' | 'defaultTriggers'>>);
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
    addFormula<ParamDefsT extends ParamDefs, ResultT extends ValueType, SchemaT extends Schema>(definition: {
        resultType: ResultT;
    } & FormulaDefinitionOptions<ParamDefsT, ResultT, SchemaT>): this;
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
    addSyncTable<K extends string, L extends string, ParamDefsT extends ParamDefs, SchemaT extends ObjectSchema<K, L>, ContextT extends SyncExecutionContext<any, any>, PermissionsContextT extends SyncPassthroughData>(definition: SyncTableOptions<K, L, ParamDefsT, SchemaT, ContextT, PermissionsContextT>): this;
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
    addDynamicSyncTable<K extends string, L extends string, ParamDefsT extends ParamDefs, SchemaT extends ObjectSchemaDefinition<K, L>, ContextT extends SyncExecutionContext<any, any>, PermissionsContextT extends SyncPassthroughData>(definition: DynamicSyncTableOptions<K, L, ParamDefsT, SchemaT, ContextT, PermissionsContextT>): this;
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
    addColumnFormat(format: Format): this;
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
    addSkill(skill: Skill): this;
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
    addMCPServer(server: MCPServer): this;
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
    setChatSkill(skill: PartialSkillDef): this;
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
    setBenchInitializationSkill(skill: PartialSkillDef): this;
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
    setSkillEntrypoints(entrypoints: SkillEntrypoints): this;
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
    addSuggestedPrompt(prompt: SuggestedPrompt): this;
    private _wrapAuthenticationFunctions;
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
    setUserAuthentication(authDef: UserAuthenticationDef): this;
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
    setSystemAuthentication(systemAuthentication: SystemAuthenticationDef): this;
    /**
     * TODO(patrick): Unhide this
     * @hidden
     */
    addAdminAuthentication(adminAuth: AdminAuthenticationDef): this;
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
    addNetworkDomain(...domain: string[]): this;
    private _setDefaultConnectionRequirement;
}
/**
 * A class that assists in constructing an agent definition. Use {@link newAgent} to create one.
 *
 * @internal
 * @hidden
 */
export declare class AgentDefinitionBuilder extends BaseDefinitionBuilder {
    /**
     * See {@link PackVersionDefinition.agent}.
     */
    agent: Partial<AgentDefinition>;
    /**
     * See {@link PackVersionDefinition.defaultTriggers}.
     */
    defaultTriggers?: DefaultTriggerDefinition[];
    /**
     * Sets this agent's instructions.
     *
     * @example
     * ```
     * pack.setInstructions('You help a team run async standups. Keep replies short.');
     * ```
     */
    setInstructions(instructions: string): this;
    /**
     * Sets the tools this agent can use. Anything left out is off.
     *
     * @example
     * ```
     * pack.setTools({docs: true, mail: true, webSearch: {allowedDomains: ['docs.example.com']}});
     * pack.setTools({connectors: [{packId: 1234, formulas: [{formulaName: 'CreateTask'}]}]});
     * ```
     */
    setTools({ docs, mail, webSearch, connectors }: AgentToolsDef): this;
    /**
     * Sets the while-writing trigger this agent runs on.
     *
     * @example
     * ```
     * pack.setDefaultWhileWritingTrigger({
     *   condition: 'Offer a citation when the user asserts a statistic',
     *   surfaces: [sdk.ContextualTriggerSurface.Docs, sdk.ContextualTriggerSurface.Email],
     * });
     * ```
     */
    setDefaultWhileWritingTrigger(contextualTrigger: Omit<WhileWritingTriggerDefinition, 'kind'>): this;
    /**
     * Sets the schedule this agent runs on.
     *
     * @example
     * ```
     * pack.setDefaultScheduleTrigger({
     *   rruleString: 'DTSTART;TZID=America/New_York:20260101T090000\nRRULE:FREQ=WEEKLY;BYDAY=MO',
     * });
     * ```
     */
    setDefaultScheduleTrigger(scheduleTrigger: Omit<ScheduleTriggerDefinition, 'kind'>): this;
}
