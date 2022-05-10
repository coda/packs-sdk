import * as fs from 'fs';
import glob from 'glob';
import path from 'path';
import {print} from '../../testing/helpers';

const TypeDocsRoot = path.resolve(process.cwd(), process.argv[2]);
const MarkdownPattern = path.join(TypeDocsRoot, '**/*.md');
// Extracts the name from "# Name", "# Type: Name", and
// "# Type: Name<Template Stuff>".
const TitleRegex = /^# (?:.+?\:\s*)?(.*?)(?:<.+>)?$/m;

async function main(): Promise<void> {
  const files = glob.sync(MarkdownPattern, {});
  const promises = [];
  for (const file of files) {
    promises.push(processFile(file));
  }
  await Promise.all(promises);
}

async function processFile(file: string) {
  return addFrontmatter(file);
}

/**
 * Adds frontmatter to generated markdown files, setting a simplified title. The
 * frontmatter title is used in the nav.
 */
async function addFrontmatter(file: string): Promise<void> {
  const buf = await fs.promises.readFile(file);
  const content = buf.toString();
  if (content.startsWith('---\n')) {
    print(`Already has frontmatter: ${file}`);
    return;
  }
  const match = content.match(TitleRegex);
  if (!match) {
    print(`Title not found: ${file}`);
    return;
  }
  const title = match![1];
  const frontmatter = `---\ntitle: "${title}"\n---\n`;
  return fs.promises.writeFile(file, frontmatter + content);
}

main().catch(print);
