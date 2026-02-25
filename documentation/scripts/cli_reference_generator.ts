import * as Handlebars from 'handlebars';
import {commands} from '../../cli/coda';
import * as fs from 'fs';
import path from 'path';

const BaseDir = path.join(__dirname, '../../');
const DocumentationRoot = path.join(BaseDir, 'documentation');
const OutputFile = path.join(BaseDir, 'docs/reference/cli/index.md');
const Template = Handlebars.compile(
  fs.readFileSync(path.join(DocumentationRoot, 'cli_reference_template.md'), 'utf8'),
);

interface OptionDef {
  string?: boolean;
  boolean?: boolean;
  number?: boolean;
  desc?: string;
  describe?: string;
  alias?: string;
  default?: any;
  hidden?: boolean;
  demandOption?: string | boolean;
}

function getOptionType(opt: OptionDef): string {
  if (opt.boolean) {
    return 'boolean';
  }
  if (opt.number) {
    return 'number';
  }
  return 'string';
}

// Add <br> before each newline to preserve line breaks.
function preserveLineBreaks(text: string): string {
  return text.replace(/\n/g, '<br>\n');
}

function formatDefault(value: any): string {
  if (value === undefined) {
    return '';
  }
  return String(value);
}

// Overrides for options whose defaults are dynamic and can't be resolved
// statically at generation time. Keyed by "commandName.optionName".
const DefaultOverrides: Record<string, string> = {
  'execute.vm': '',
};

function buildTemplateData() {
  const sortedCommands = [...commands].sort((a, b) =>
    (a.command as string).localeCompare(b.command as string),
  );

  return {
    commands: sortedCommands.map(cmd => {
      const commandStr = cmd.command as string;
      const name = commandStr.split(' ')[0];
      const describe = cmd.describe as string;

      const builder = cmd.builder;
      let options: object[] = [];
      if (builder && typeof builder === 'object' && !Array.isArray(builder)) {
        const defs = builder as Record<string, OptionDef>;
        options = Object.entries(defs)
          .filter(([_, opt]) => !opt.hidden)
          .map(([optName, opt]) => {
            const aliasPrefix = opt.alias && opt.alias.length > 1 ? '--' : '-';
            const aliasStr = opt.alias ? `${aliasPrefix}${opt.alias}` : '';
            const type = getOptionType(opt);
            const overrideKey = `${name}.${optName}`;
            const defaultVal = overrideKey in DefaultOverrides
              ? DefaultOverrides[overrideKey]
              : formatDefault(opt.default);
            const description = preserveLineBreaks(opt.desc || opt.describe || '');

            return {
              name: optName,
              aliasStr,
              description,
              type,
              defaultVal,
              required: Boolean(opt.demandOption),
            };
          });
      }

      return {name, command: commandStr, describe: preserveLineBreaks(describe), options};
    }),
  };
}

const data = buildTemplateData();
const content = Template(data);
fs.mkdirSync(path.dirname(OutputFile), {recursive: true});
fs.writeFileSync(OutputFile, content);
