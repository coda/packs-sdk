import type {PackVersionMetadata} from '../compiled_types';
import fs from 'fs';
import path from 'path';
import {z} from 'zod';

export const PluginListingFileName = 'plugin.json';

const ConnectorVisibility = z.enum(['private', 'public']);

const ComponentName = z.string().regex(/^[a-z][a-z0-9-]*$/, 'Component names must be kebab-case.');
const ComponentReferences = z
  .array(ComponentName)
  .refine(references => new Set(references).size === references.length, 'Component references must be unique.');
const FormulaReferenceSchema = z
  .object({
    formulaName: z.string().min(1),
  })
  .strict();
const ConnectorUseSchema = z
  .object({
    component: ComponentName,
    formulas: z.array(FormulaReferenceSchema).min(1).optional(),
  })
  .strict();
const ConnectorUses = z
  .array(ConnectorUseSchema)
  .refine(
    uses => new Set(uses.map(use => use.component)).size === uses.length,
    'An agent can reference each connector only once.',
  );
const RelativeFilePath = z
  .string()
  .min(1)
  .refine(filePath => !path.isAbsolute(filePath), 'Component paths must be relative.')
  .refine(
    filePath => !path.normalize(filePath).split(path.sep).includes('..'),
    'Component paths cannot leave the plugin directory.',
  );

const AgentComponentSchema = z
  .object({
    type: z.literal('agent'),
    manifest: RelativeFilePath,
    uses: ConnectorUses.default([]),
    skills: ComponentReferences.default([]),
  })
  .strict();

const ConnectorComponentSchema = z
  .object({
    type: z.literal('connector'),
    manifest: RelativeFilePath,
    visibility: ConnectorVisibility,
  })
  .strict();

const SkillComponentSchema = z
  .object({
    type: z.literal('skill'),
    path: RelativeFilePath,
    uses: ComponentReferences.default([]),
  })
  .strict();

const UiComponentSchema = z
  .object({
    type: z.literal('ui'),
    path: RelativeFilePath,
    for: ComponentReferences.refine(references => references.length > 0, 'UI must reference an MCP connector.'),
  })
  .strict();

const StarterPromptSchema = z
  .object({
    name: ComponentName,
    prompt: z.string().min(1),
  })
  .strict();

const TestCaseSchema = z
  .object({
    name: ComponentName,
    prompt: z.string().min(1),
    expectedBehavior: z.string().min(1),
  })
  .strict();

export const PluginListingSchema = z
  .object({
    schemaVersion: z.literal(1),
    name: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Plugin name must be kebab-case (e.g. radical-candor).'),
    displayName: z.string().min(1),
    description: z.string().min(1),
    entrypoints: ComponentReferences.refine(references => references.length > 0, 'A plugin needs an entrypoint.'),
    components: z.record(
      ComponentName,
      z.discriminatedUnion('type', [
        AgentComponentSchema,
        ConnectorComponentSchema,
        SkillComponentSchema,
        UiComponentSchema,
      ]),
    ),
    setup: RelativeFilePath.optional(),
    starterPrompts: z.array(StarterPromptSchema).default([]),
    testCases: z
      .object({
        positive: z.array(TestCaseSchema).default([]),
        negative: z.array(TestCaseSchema).default([]),
      })
      .strict()
      .default({positive: [], negative: []}),
  })
  .strict();

export type PluginListing = z.infer<typeof PluginListingSchema>;

export class PluginListingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PluginListingError';
  }
}

export function loadPluginListing(pluginJsonPath: string): PluginListing {
  if (!fs.existsSync(pluginJsonPath)) {
    throw new PluginListingError(`No ${PluginListingFileName} at ${pluginJsonPath}.`);
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(fs.readFileSync(pluginJsonPath, 'utf8'));
  } catch (err: unknown) {
    const detail = err instanceof Error ? err.message : String(err);
    throw new PluginListingError(`Invalid JSON in ${pluginJsonPath}: ${detail}`);
  }
  const result = PluginListingSchema.safeParse(parsed);
  if (!result.success) {
    throw new PluginListingError(result.error.issues.map(issue => issue.message).join('; '));
  }
  return result.data;
}

export function validatePluginListing(listing: PluginListing, pluginRoot: string): void {
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

  assertUniqueNames(
    listing.starterPrompts.map(prompt => prompt.name),
    'starter prompt',
  );
  assertUniqueNames(
    [...listing.testCases.positive, ...listing.testCases.negative].map(testCase => testCase.name),
    'test case',
  );

  const pluginRootRealPath = fs.realpathSync(pluginRoot);
  if (listing.setup) {
    validatePluginFile('Setup instructions', listing.setup, pluginRoot, pluginRootRealPath);
  }

  const seenComponentFiles = new Set<string>();
  const connectorConsumers = new Map<string, string[]>();
  for (const [componentName, component] of entries) {
    const componentPath =
      component.type === 'agent' || component.type === 'connector' ? component.manifest : component.path;
    const componentRealPath = validatePluginFile(
      `File for ${componentName}`,
      componentPath,
      pluginRoot,
      pluginRootRealPath,
    );
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
        const consumers = connectorConsumers.get(use.component) ?? [];
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
          const consumers = connectorConsumers.get(connectorName) ?? [];
          connectorConsumers.set(connectorName, [...new Set([...consumers, componentName])]);
        }
      }
    } else if (component.type === 'skill') {
      for (const connectorName of component.uses) {
        const connector = listing.components[connectorName];
        if (!connector) {
          throw new PluginListingError(`Skill ${componentName} uses missing component: ${connectorName}`);
        }
        if (connector.type !== 'connector') {
          throw new PluginListingError(`Skill ${componentName} can only use connector components.`);
        }
      }
    } else if (component.type === 'ui') {
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
      if ((connectorConsumers.get(componentName) ?? []).length === 0) {
        throw new PluginListingError(`Private connector ${componentName} must be used by an agent component.`);
      }
    }
  }
}

export function validatePluginComponentType(
  componentName: string,
  component: PluginListing['components'][string],
  metadata: PackVersionMetadata,
): void {
  if (component.type !== 'agent' && component.type !== 'connector') {
    throw new PluginListingError(`Component ${componentName} is not a Pack.`);
  }
  const actualType = metadata.agent ? 'agent' : 'connector';
  if (actualType !== component.type) {
    throw new PluginListingError(
      `Component ${componentName} is declared as ${component.type}, but ${component.manifest} defines a ${actualType}.`,
    );
  }
}

export type PluginComponentMetadata = Record<string, PackVersionMetadata>;

export function validatePluginComponentMetadata(
  listing: PluginListing,
  componentMetadata: PluginComponentMetadata,
): void {
  for (const [componentName, component] of Object.entries(listing.components)) {
    if (component.type !== 'ui') {
      continue;
    }
    for (const connectorName of component.for) {
      if (!componentMetadata[connectorName]?.mcpServers?.length) {
        throw new PluginListingError(
          `UI ${componentName} can only reference connectors that define MCP servers: ${connectorName}`,
        );
      }
    }
  }
}

function assertUniqueNames(names: string[], label: string): void {
  const seen = new Set<string>();
  for (const name of names) {
    if (seen.has(name)) {
      throw new PluginListingError(`Duplicate ${label} name: ${name}`);
    }
    seen.add(name);
  }
}

function validatePluginFile(
  label: string,
  relativePath: string,
  pluginRoot: string,
  pluginRootRealPath: string,
): string {
  const absolutePath = path.resolve(pluginRoot, relativePath);
  if (!fs.existsSync(absolutePath) || !fs.statSync(absolutePath).isFile()) {
    throw new PluginListingError(`${label} is missing: ${relativePath}`);
  }
  const realPath = fs.realpathSync(absolutePath);
  if (!isWithinDirectory(realPath, pluginRootRealPath)) {
    throw new PluginListingError(`${label} leaves the plugin directory.`);
  }
  return realPath;
}

function isWithinDirectory(candidatePath: string, directoryPath: string): boolean {
  const relativePath = path.relative(directoryPath, candidatePath);
  return relativePath !== '..' && !relativePath.startsWith(`..${path.sep}`) && !path.isAbsolute(relativePath);
}

export interface PluginUploadStep {
  componentName: string;
  kind: 'agent' | 'connector';
  manifestPath: string;
}

export interface PluginConnectorPolicy {
  connector: string;
  visibility: 'private' | 'public';
  allowedConsumers: string[];
}

export interface PluginInstallBinding {
  agent: string;
  connector: string;
  formulas?: Array<{formulaName: string}>;
}

export interface PluginSkillAttachment {
  skill: string;
  path: string;
  agents: string[];
  connectors: string[];
}

export interface PluginUiAttachment {
  ui: string;
  path: string;
  connectors: string[];
}

export interface PluginPublishPlan {
  name: string;
  displayName: string;
  description: string;
  entrypoints: string[];
  uploads: PluginUploadStep[];
  connectorPolicies: PluginConnectorPolicy[];
  installBindings: PluginInstallBinding[];
  mcpConnectors: string[];
  skillAttachments: PluginSkillAttachment[];
  deferredUi: PluginUiAttachment[];
  setup?: string;
  starterPromptCount: number;
  positiveTestCount: number;
  negativeTestCount: number;
}

export function planPluginPublish(
  pluginJsonPath: string,
  componentMetadata: PluginComponentMetadata = {},
): PluginPublishPlan {
  const pluginRoot = path.dirname(pluginJsonPath);
  const listing = loadPluginListing(pluginJsonPath);
  validatePluginListing(listing, pluginRoot);
  const hasUi = Object.values(listing.components).some(component => component.type === 'ui');
  if (hasUi && Object.keys(componentMetadata).length === 0) {
    throw new PluginListingError('Planning UI components requires compiled connector metadata.');
  }
  if (Object.keys(componentMetadata).length > 0) {
    validatePluginComponentMetadata(listing, componentMetadata);
  }

  const uploads: PluginUploadStep[] = [];
  const connectorPolicies: PluginConnectorPolicy[] = [];
  const installBindings: PluginInstallBinding[] = [];
  const skillAttachments: PluginSkillAttachment[] = [];
  const deferredUi: PluginUiAttachment[] = [];
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
      installBindings.push(
        ...component.uses.map(use => ({
          agent: componentName,
          connector: use.component,
          ...(use.formulas ? {formulas: use.formulas} : {}),
        })),
      );
    } else if (component.type === 'connector') {
      uploads.push({
        componentName,
        kind: component.type,
        manifestPath: component.manifest,
      });
      connectorPolicies.push({
        connector: componentName,
        visibility: component.visibility,
        allowedConsumers:
          component.visibility === 'private'
            ? Object.entries(listing.components)
                .filter(
                  ([, candidate]) =>
                    candidate.type === 'agent' &&
                    (candidate.uses.some(use => use.component === componentName) ||
                      candidate.skills.some(skillName => {
                        const skill = listing.components[skillName];
                        return skill?.type === 'skill' && skill.uses.includes(componentName);
                      })),
                )
                .map(([candidateName]) => candidateName)
            : [],
      });
    } else if (component.type === 'skill') {
      skillAttachments.push({
        skill: componentName,
        path: component.path,
        agents: Object.entries(listing.components)
          .filter(([, candidate]) => candidate.type === 'agent' && candidate.skills.includes(componentName))
          .map(([candidateName]) => candidateName),
        connectors: component.uses,
      });
    } else {
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
      .filter(
        ([componentName, metadata]) =>
          listing.components[componentName]?.type === 'connector' && Boolean(metadata.mcpServers?.length),
      )
      .map(([componentName]) => componentName),
    skillAttachments,
    deferredUi,
    setup: listing.setup,
    starterPromptCount: listing.starterPrompts.length,
    positiveTestCount: listing.testCases.positive.length,
    negativeTestCount: listing.testCases.negative.length,
  };
}

export function formatPluginPublishPlan(plan: PluginPublishPlan): string {
  const lines = [
    `Plugin: ${plan.displayName} (${plan.name})`,
    plan.description,
    '',
    `Install entrypoints: ${plan.entrypoints.join(', ')}`,
    `Setup instructions: ${plan.setup ?? 'none'}`,
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
      const formulas = binding.formulas?.map(formula => formula.formulaName).join(', ');
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
    ...plan.skillAttachments.map(
      attachment =>
        `  ${attachment.skill}: ${attachment.path}; agents: ${attachment.agents.join(', ') || 'none'}; connectors: ${
          attachment.connectors.join(', ') || 'none'
        }`,
    ),
    ...plan.deferredUi.map(
      attachment => `  ${attachment.ui}: ${attachment.path}; UI deferred for ${attachment.connectors.join(', ')}`,
    ),
    '',
    'Phase 5: publish the plugin listing only after every pack and policy update succeeds',
    '',
    'Server work still required: atomic publish, component-to-pack-id resolution, listing skill installation, and UI runtime.',
  ];
  return lines.join('\n');
}

export function assertPluginName(name: string): void {
  const result = PluginListingSchema.shape.name.safeParse(name);
  if (!result.success) {
    throw new PluginListingError('Plugin name must be kebab-case (e.g. radical-candor).');
  }
}

export function scaffoldPlugin(targetDir: string, name: string): void {
  assertPluginName(name);
  if (fs.existsSync(targetDir) && fs.readdirSync(targetDir).length > 0) {
    throw new PluginListingError(`Directory is not empty: ${targetDir}`);
  }

  const displayName = name
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

  fs.mkdirSync(path.join(targetDir, 'agent'), {recursive: true});
  fs.mkdirSync(path.join(targetDir, 'connector'), {recursive: true});

  const listing: PluginListing = {
    schemaVersion: 1,
    name,
    displayName,
    description: `${displayName} agent with a private connector (two packs, one listing).`,
    entrypoints: ['agent'],
    components: {
      agent: {
        type: 'agent',
        manifest: 'agent/pack.ts',
        uses: [{component: 'connector', formulas: [{formulaName: 'GetFeedback'}]}],
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
  fs.writeFileSync(path.join(targetDir, PluginListingFileName), `${JSON.stringify(listing, null, 2)}\n`);
  fs.writeFileSync(
    path.join(targetDir, 'SETUP.md'),
    '# Setup\n\nConnect the account used by the private connector before running the agent.\n',
  );
  fs.writeFileSync(path.join(targetDir, 'agent', 'pack.ts'), AgentPackTemplate);
  fs.writeFileSync(path.join(targetDir, 'connector', 'pack.ts'), ConnectorPackTemplate);
}

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
