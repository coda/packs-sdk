import fs from 'fs';
import {globSync} from 'glob';
import path from 'path';

/**
 * Test that catches malformed markdown content in the documentation. This is primarily meant to catch instances where
 * Markdown auto-formatting breaks our content, which uses non-standard markdown extensions.
 */

const BaseDir = path.join(__dirname, '..');
const DocsRoot = path.join(BaseDir, 'docs/');
const MarkdownPattern = path.join(DocsRoot, '**/*.md');

interface MarkdownFile {
  path: string;
  content: string;
}

async function getMarkdownFileContent(): Promise<MarkdownFile[]> {
  const files = globSync(MarkdownPattern, {});
  const buffers = files.map(file => fs.readFileSync(file));
  const content = buffers.map(buffer => buffer.toString());
  return files.map((file, i) => {
    return {
      path: file,
      content: content[i],
    };
  });
}

describe('Documentation formatting', () => {
  // Matches admonitions and tabs that have been un-indented.
  it('no malformed callouts', async () => {
    const pattern = /^[!?=]{3} .*\n+[^\s].*/gm;
    const files = await getMarkdownFileContent();
    for (const file of files) {
      const matches = file.content.match(pattern);
      if (matches) {
        assert.fail(`Found broken callout in documentation: ${file.path}\n${matches.join('n')}`);
      }
    }
  });
});
