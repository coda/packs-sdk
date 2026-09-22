"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scaffoldPlugin = exports.assertPluginName = exports.formatPluginPublishPlan = exports.planPluginPublish = exports.validatePluginComponentMetadata = exports.validatePluginComponentType = exports.validatePluginListing = exports.loadPluginListing = exports.PluginListingError = exports.PluginListingSchema = exports.PluginListingFileName = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const zod_1 = require("zod");
exports.PluginListingFileName = 'plugin.json';
const ConnectorVisibility = zod_1.z.enum(['private', 'public']);
const ComponentName = zod_1.z.string().regex(/^[a-z][a-z0-9-]*$/, 'Component names must be kebab-case.');
const ComponentReferences = zod_1.z
    .array(ComponentName)
    .refine(references => new Set(references).size === references.length, 'Component references must be unique.');
const FormulaReferenceSchema = zod_1.z
    .object({
    formulaName: zod_1.z.string().min(1),
})
    .strict();
const ConnectorUseSchema = zod_1.z
    .object({
    component: ComponentName,
    formulas: zod_1.z.array(FormulaReferenceSchema).min(1).optional(),
})
    .strict();
const ConnectorUses = zod_1.z
    .array(ConnectorUseSchema)
    .refine(uses => new Set(uses.map(use => use.component)).size === uses.length, 'An agent can reference each connector only once.');
const RelativeFilePath = zod_1.z
    .string()
    .min(1)
    .refine(filePath => !path_1.default.isAbsolute(filePath), 'Component paths must be relative.')
    .refine(filePath => !path_1.default.normalize(filePath).split(path_1.default.sep).includes('..'), 'Component paths cannot leave the plugin directory.');
const AgentComponentSchema = zod_1.z
    .object({
    type: zod_1.z.literal('agent'),
    manifest: RelativeFilePath,
    uses: ConnectorUses.default([]),
    skills: ComponentReferences.default([]),
})
    .strict();
const ConnectorComponentSchema = zod_1.z
    .object({
    type: zod_1.z.literal('connector'),
    manifest: RelativeFilePath,
    visibility: ConnectorVisibility,
})
    .strict();
const SkillComponentSchema = zod_1.z
    .object({
    type: zod_1.z.literal('skill'),
    path: RelativeFilePath,
    uses: ComponentReferences.default([]),
})
    .strict();
const UiComponentSchema = zod_1.z
    .object({
    type: zod_1.z.literal('ui'),
    path: RelativeFilePath,
    for: ComponentReferences.refine(references => references.length > 0, 'UI must reference an MCP connector.'),
})
    .strict();
const StarterPromptSchema = zod_1.z
    .object({
    name: ComponentName,
    prompt: zod_1.z.string().min(1),
})
    .strict();
const TestCaseSchema = zod_1.z
    .object({
    name: ComponentName,
    prompt: zod_1.z.string().min(1),
    expectedBehavior: zod_1.z.string().min(1),
})
    .strict();
exports.PluginListingSchema = zod_1.z
    .object({
    schemaVersion: zod_1.z.literal(1),
    name: zod_1.z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Plugin name must be kebab-case (e.g. radical-candor).'),
    displayName: zod_1.z.string().min(1),
    description: zod_1.z.string().min(1),
    entrypoints: ComponentReferences.refine(references => references.length > 0, 'A plugin needs an entrypoint.'),
    components: zod_1.z.record(ComponentName, zod_1.z.discriminatedUnion('type', [
        AgentComponentSchema,
        ConnectorComponentSchema,
        SkillComponentSchema,
        UiComponentSchema,
    ])),
    setup: RelativeFilePath.optional(),
    starterPrompts: zod_1.z.array(StarterPromptSchema).default([]),
    testCases: zod_1.z
        .object({
        positive: zod_1.z.array(TestCaseSchema).default([]),
        negative: zod_1.z.array(TestCaseSchema).default([]),
    })
        .strict()
        .default({ positive: [], negative: [] }),
})
    .strict();
class PluginListingError extends Error {
    constructor(message) {
        super(message);
        this.name = 'PluginListingError';
    }
}
exports.PluginListingError = PluginListingError;
function loadPluginListing(pluginJsonPath) {
    if (!fs_1.default.existsSync(pluginJsonPath)) {
        throw new PluginListingError(`No ${exports.PluginListingFileName} at ${pluginJsonPath}.`);
    }
    let parsed;
    try {
        parsed = JSON.parse(fs_1.default.readFileSync(pluginJsonPath, 'utf8'));
    }
    catch (err) {
        const detail = err instanceof Error ? err.message : String(err);
        throw new PluginListingError(`Invalid JSON in ${pluginJsonPath}: ${detail}`);
    }
    const result = exports.PluginListingSchema.safeParse(parsed);
    if (!result.success) {
        throw new PluginListingError(result.error.issues.map(issue => issue.message).join('; '));
    }
    return result.data;
}
exports.loadPluginListing = loadPluginListing;
function validatePluginListing(listing, pluginRoot) {
    var _a, _b, _c;
    const entries = Object.entries(listing.components);
    if (entries.length === 0) {
        throw new PluginListingError('A plugin needs at least one component.');
    }
    for (const entrypoint of listing.entrypoints) {
        const component = listing.components[entrypoint];
        if (!component) {
            throw new PluginListingError(`Entrypoint does not exist: ${entrypoint}`);
        }
        if (component.type !== 'agent' && component.type !== 'connector') {
            throw new PluginListingError(`Entrypoint ${entrypoint} must be an agent or connector component.`);
        }
    }
    assertUniqueNames(listing.starterPrompts.map(prompt => prompt.name), 'starter prompt');
    assertUniqueNames([...listing.testCases.positive, ...listing.testCases.negative].map(testCase => testCase.name), 'test case');
    const pluginRootRealPath = fs_1.default.realpathSync(pluginRoot);
    if (listing.setup) {
        validatePluginFile('Setup instructions', listing.setup, pluginRoot, pluginRootRealPath);
    }
    const seenComponentFiles = new Set();
    const connectorConsumers = new Map();
    for (const [componentName, component] of entries) {
        const componentPath = component.type === 'agent' || component.type === 'connector' ? component.manifest : component.path;
        const componentRealPath = validatePluginFile(`File for ${componentName}`, componentPath, pluginRoot, pluginRootRealPath);
        if (seenComponentFiles.has(componentRealPath)) {
            throw new PluginListingError(`File is used by more than one component: ${componentPath}`);
        }
        seenComponentFiles.add(componentRealPath);
        if (component.type === 'agent') {
            for (const use of component.uses) {
                const dependencyComponent = listing.components[use.component];
                if (!dependencyComponent) {
                    throw new PluginListingError(`Agent ${componentName} uses missing component: ${use.component}`);
                }
                if (dependencyComponent.type !== 'connector') {
                    throw new PluginListingError(`Agent ${componentName} can only use connector components.`);
                }
                const consumers = (_a = connectorConsumers.get(use.component)) !== null && _a !== void 0 ? _a : [];
                connectorConsumers.set(use.component, [...consumers, componentName]);
            }
            for (const skillName of component.skills) {
                const skill = listing.components[skillName];
                if (!skill) {
                    throw new PluginListingError(`Agent ${componentName} references missing skill: ${skillName}`);
                }
                if (skill.type !== 'skill') {
                    throw new PluginListingError(`Agent ${componentName} skills can only reference skill components.`);
                }
                for (const connectorName of skill.uses) {
                    const consumers = (_b = connectorConsumers.get(connectorName)) !== null && _b !== void 0 ? _b : [];
                    connectorConsumers.set(connectorName, [...new Set([...consumers, componentName])]);
                }
            }
        }
        else if (component.type === 'skill') {
            for (const connectorName of component.uses) {
                const connector = listing.components[connectorName];
                if (!connector) {
                    throw new PluginListingError(`Skill ${componentName} uses missing component: ${connectorName}`);
                }
                if (connector.type !== 'connector') {
                    throw new PluginListingError(`Skill ${componentName} can only use connector components.`);
                }
            }
        }
        else if (component.type === 'ui') {
            for (const connectorName of component.for) {
                const connector = listing.components[connectorName];
                if (!connector) {
                    throw new PluginListingError(`UI ${componentName} references missing component: ${connectorName}`);
                }
                if (connector.type !== 'connector') {
                    throw new PluginListingError(`UI ${componentName} can only reference connector components.`);
                }
            }
        }
    }
    for (const [componentName, component] of entries) {
        if (component.type === 'connector' && component.visibility === 'private') {
            if (((_c = connectorConsumers.get(componentName)) !== null && _c !== void 0 ? _c : []).length === 0) {
                throw new PluginListingError(`Private connector ${componentName} must be used by an agent component.`);
            }
        }
    }
}
exports.validatePluginListing = validatePluginListing;
function validatePluginComponentType(componentName, component, metadata) {
    if (component.type !== 'agent' && component.type !== 'connector') {
        throw new PluginListingError(`Component ${componentName} is not a Pack.`);
    }
    const actualType = metadata.agent ? 'agent' : 'connector';
    if (actualType !== component.type) {
        throw new PluginListingError(`Component ${componentName} is declared as ${component.type}, but ${component.manifest} defines a ${actualType}.`);
    }
}
exports.validatePluginComponentType = validatePluginComponentType;
function validatePluginComponentMetadata(listing, componentMetadata) {
    var _a, _b;
    for (const [componentName, component] of Object.entries(listing.components)) {
        if (component.type !== 'ui') {
            continue;
        }
        for (const connectorName of component.for) {
            if (!((_b = (_a = componentMetadata[connectorName]) === null || _a === void 0 ? void 0 : _a.mcpServers) === null || _b === void 0 ? void 0 : _b.length)) {
                throw new PluginListingError(`UI ${componentName} can only reference connectors that define MCP servers: ${connectorName}`);
            }
        }
    }
}
exports.validatePluginComponentMetadata = validatePluginComponentMetadata;
function assertUniqueNames(names, label) {
    const seen = new Set();
    for (const name of names) {
        if (seen.has(name)) {
            throw new PluginListingError(`Duplicate ${label} name: ${name}`);
        }
        seen.add(name);
    }
}
function validatePluginFile(label, relativePath, pluginRoot, pluginRootRealPath) {
    const absolutePath = path_1.default.resolve(pluginRoot, relativePath);
    if (!fs_1.default.existsSync(absolutePath) || !fs_1.default.statSync(absolutePath).isFile()) {
        throw new PluginListingError(`${label} is missing: ${relativePath}`);
    }
    const realPath = fs_1.default.realpathSync(absolutePath);
    if (!isWithinDirectory(realPath, pluginRootRealPath)) {
        throw new PluginListingError(`${label} leaves the plugin directory.`);
    }
    return realPath;
}
function isWithinDirectory(candidatePath, directoryPath) {
    const relativePath = path_1.default.relative(directoryPath, candidatePath);
    return relativePath !== '..' && !relativePath.startsWith(`..${path_1.default.sep}`) && !path_1.default.isAbsolute(relativePath);
}
function planPluginPublish(pluginJsonPath, componentMetadata = {}) {
    const pluginRoot = path_1.default.dirname(pluginJsonPath);
    const listing = loadPluginListing(pluginJsonPath);
    validatePluginListing(listing, pluginRoot);
    const hasUi = Object.values(listing.components).some(component => component.type === 'ui');
    if (hasUi && Object.keys(componentMetadata).length === 0) {
        throw new PluginListingError('Planning UI components requires compiled connector metadata.');
    }
    if (Object.keys(componentMetadata).length > 0) {
        validatePluginComponentMetadata(listing, componentMetadata);
    }
    const uploads = [];
    const connectorPolicies = [];
    const installBindings = [];
    const skillAttachments = [];
    const deferredUi = [];
    const components = Object.entries(listing.components).sort(([, left], [, right]) => {
        if (left.type === right.type) {
            return 0;
        }
        return left.type === 'connector' ? -1 : 1;
    });
    for (const [componentName, component] of components) {
        if (component.type === 'agent') {
            uploads.push({
                componentName,
                kind: component.type,
                manifestPath: component.manifest,
            });
            installBindings.push(...component.uses.map(use => ({
                agent: componentName,
                connector: use.component,
                ...(use.formulas ? { formulas: use.formulas } : {}),
            })));
        }
        else if (component.type === 'connector') {
            uploads.push({
                componentName,
                kind: component.type,
                manifestPath: component.manifest,
            });
            connectorPolicies.push({
                connector: componentName,
                visibility: component.visibility,
                allowedConsumers: component.visibility === 'private'
                    ? Object.entries(listing.components)
                        .filter(([, candidate]) => candidate.type === 'agent' &&
                        (candidate.uses.some(use => use.component === componentName) ||
                            candidate.skills.some(skillName => {
                                const skill = listing.components[skillName];
                                return (skill === null || skill === void 0 ? void 0 : skill.type) === 'skill' && skill.uses.includes(componentName);
                            })))
                        .map(([candidateName]) => candidateName)
                    : [],
            });
        }
        else if (component.type === 'skill') {
            skillAttachments.push({
                skill: componentName,
                path: component.path,
                agents: Object.entries(listing.components)
                    .filter(([, candidate]) => candidate.type === 'agent' && candidate.skills.includes(componentName))
                    .map(([candidateName]) => candidateName),
                connectors: component.uses,
            });
        }
        else {
            deferredUi.push({
                ui: componentName,
                path: component.path,
                connectors: component.for,
            });
        }
    }
    return {
        name: listing.name,
        displayName: listing.displayName,
        description: listing.description,
        entrypoints: listing.entrypoints,
        uploads,
        connectorPolicies,
        installBindings,
        mcpConnectors: Object.entries(componentMetadata)
            .filter(([componentName, metadata]) => { var _a, _b; return ((_a = listing.components[componentName]) === null || _a === void 0 ? void 0 : _a.type) === 'connector' && Boolean((_b = metadata.mcpServers) === null || _b === void 0 ? void 0 : _b.length); })
            .map(([componentName]) => componentName),
        skillAttachments,
        deferredUi,
        setup: listing.setup,
        starterPromptCount: listing.starterPrompts.length,
        positiveTestCount: listing.testCases.positive.length,
        negativeTestCount: listing.testCases.negative.length,
    };
}
exports.planPluginPublish = planPluginPublish;
function formatPluginPublishPlan(plan) {
    var _a;
    const lines = [
        `Plugin: ${plan.displayName} (${plan.name})`,
        plan.description,
        '',
        `Install entrypoints: ${plan.entrypoints.join(', ')}`,
        `Setup instructions: ${(_a = plan.setup) !== null && _a !== void 0 ? _a : 'none'}`,
        `Starter prompts: ${plan.starterPromptCount}`,
        `Test cases: ${plan.positiveTestCount} positive, ${plan.negativeTestCount} negative`,
        '',
        'Phase 1: validate every pack and the composition graph',
        ...plan.uploads.map(step => `  ${step.componentName}: ${step.manifestPath} (${step.kind})`),
        '',
        'Phase 2: create and upload connectors, then resolve their pack ids',
        ...plan.uploads
            .filter(step => step.kind === 'connector')
            .map((step, index) => `  ${index + 1}. ${step.componentName}: ${step.manifestPath}`),
        '',
        'Phase 3: materialize connector pack ids in agent tools, then upload agents',
        ...plan.uploads
            .filter(step => step.kind === 'agent')
            .map((step, index) => `  ${index + 1}. ${step.componentName}: ${step.manifestPath}`),
        ...plan.installBindings.map(binding => {
            var _a;
            const formulas = (_a = binding.formulas) === null || _a === void 0 ? void 0 : _a.map(formula => formula.formulaName).join(', ');
            return `  ${binding.agent} uses ${binding.connector}${formulas ? ` (${formulas})` : ''}`;
        }),
        '',
        'Phase 4: apply connector policy and list deferred attachments',
        ...plan.connectorPolicies.map(policy => {
            const consumers = policy.allowedConsumers.length > 0 ? policy.allowedConsumers.join(', ') : 'all agents';
            return `  ${policy.connector}: ${policy.visibility}; used by ${consumers}`;
        }),
        ...plan.installBindings.map(binding => `  ${binding.agent} uses ${binding.connector}`),
        ...plan.mcpConnectors.map(connector => `  ${connector}: MCP-capable connector`),
        ...plan.skillAttachments.map(attachment => `  ${attachment.skill}: ${attachment.path}; agents: ${attachment.agents.join(', ') || 'none'}; connectors: ${attachment.connectors.join(', ') || 'none'}`),
        ...plan.deferredUi.map(attachment => `  ${attachment.ui}: ${attachment.path}; UI deferred for ${attachment.connectors.join(', ')}`),
        '',
        'Phase 5: publish the plugin listing only after every pack and policy update succeeds',
        '',
        'Server work still required: atomic publish, component-to-pack-id resolution, listing skill installation, and UI runtime.',
    ];
    return lines.join('\n');
}
exports.formatPluginPublishPlan = formatPluginPublishPlan;
function assertPluginName(name) {
    const result = exports.PluginListingSchema.shape.name.safeParse(name);
    if (!result.success) {
        throw new PluginListingError('Plugin name must be kebab-case (e.g. radical-candor).');
    }
}
exports.assertPluginName = assertPluginName;
function scaffoldPlugin(targetDir, name) {
    assertPluginName(name);
    if (fs_1.default.existsSync(targetDir) && fs_1.default.readdirSync(targetDir).length > 0) {
        throw new PluginListingError(`Directory is not empty: ${targetDir}`);
    }
    const displayName = name
        .split('-')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
    fs_1.default.mkdirSync(path_1.default.join(targetDir, 'agent'), { recursive: true });
    fs_1.default.mkdirSync(path_1.default.join(targetDir, 'connector'), { recursive: true });
    const listing = {
        schemaVersion: 1,
        name,
        displayName,
        description: `${displayName} agent with a private connector (two packs, one listing).`,
        entrypoints: ['agent'],
        components: {
            agent: {
                type: 'agent',
                manifest: 'agent/pack.ts',
                uses: [{ component: 'connector', formulas: [{ formulaName: 'GetFeedback' }] }],
                skills: [],
            },
            connector: {
                type: 'connector',
                manifest: 'connector/pack.ts',
                visibility: 'private',
            },
        },
        setup: 'SETUP.md',
        starterPrompts: [
            {
                name: 'review-feedback',
                prompt: 'Review this draft and give me direct, constructive feedback.',
            },
        ],
        testCases: {
            positive: [
                {
                    name: 'reviews-a-draft',
                    prompt: 'Review this project update and make the feedback candid but kind.',
                    expectedBehavior: 'Uses the private connector and returns actionable feedback.',
                },
            ],
            negative: [
                {
                    name: 'does-not-send-feedback',
                    prompt: 'Send this feedback to my manager.',
                    expectedBehavior: 'Explains that the plugin can review text but cannot send messages.',
                },
            ],
        },
    };
    fs_1.default.writeFileSync(path_1.default.join(targetDir, exports.PluginListingFileName), `${JSON.stringify(listing, null, 2)}\n`);
    fs_1.default.writeFileSync(path_1.default.join(targetDir, 'SETUP.md'), '# Setup\n\nConnect the account used by the private connector before running the agent.\n');
    fs_1.default.writeFileSync(path_1.default.join(targetDir, 'agent', 'pack.ts'), AgentPackTemplate);
    fs_1.default.writeFileSync(path_1.default.join(targetDir, 'connector', 'pack.ts'), ConnectorPackTemplate);
}
exports.scaffoldPlugin = scaffoldPlugin;
const AgentPackTemplate = `import * as sdk from "@codahq/packs-sdk";

export const pack = sdk.newAgent();

pack.setInstructions(\`
  When the user asks for feedback, use the connector attached by the plugin.
  Keep the tone direct and kind.
\`);

pack.setTools({docs: true});
`;
const ConnectorPackTemplate = `import * as sdk from "@codahq/packs-sdk";

export const pack = sdk.newPack();

pack.addNetworkDomain("example.com");

pack.setUserAuthentication({
  type: sdk.AuthenticationType.HeaderBearerToken,
});

pack.addFormula({
  name: "GetFeedback",
  description: "Fetches coaching context from the vendor API.",
  parameters: [
    sdk.makeParameter({
      type: sdk.ParameterType.String,
      name: "topic",
      description: "What to fetch feedback about.",
    }),
  ],
  resultType: sdk.ValueType.String,
  execute: async function ([topic], context) {
    const response = await context.fetcher.fetch({
      method: "GET",
      url: "https://api.example.com/feedback?topic=" + encodeURIComponent(topic),
    });
    return JSON.stringify(response.body);
  },
});
`;
