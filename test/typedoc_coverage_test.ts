import fs from 'fs';
import os from 'os';
import * as path from 'path';
import {spawnSync} from 'child_process';

/**
 * Outputs all of the identifiers reachable by our TypeDoc config that are lacking documentation.
 */

// Very partial typing

interface Comment {
  shortText: string;
  text?: string;
  tags?: Array<{
    tag: string;
    text?: string;
  }>;
}

interface ReflectionData {
  name: string;
  kindString: string;
  comment?: Comment;
  sources?: Array<{
    fileName: string;
    line: number;
  }>;
  signatures?: Array<{
    name: string;
    comment?: Comment;
  }>;
  children?: ReflectionData[];
  type?: {
    declaration: ReflectionData;
  };
}

function getReflectionData() {
  const tempfile = path.join(os.tmpdir(), `typedoc.json`);
  const command = `node_modules/.bin/typedoc index.ts --options typedoc.js --json ${tempfile} > /dev/null`;
  const response = spawnSync(command, {
    shell: true,
  });
  // Ideally we would just use TypeDoc's --treatWarningsAsErrors flag, but it appears not to be working.
  const stdErr = response.stderr.toString();
  if (stdErr) {
    throw new Error(
      `Treating warnings as errors. Some references entities are likely not included in the documentation\n` + stdErr,
    );
  }
  return JSON.parse(fs.readFileSync(tempfile, 'utf-8'));
}

function traverse(data: ReflectionData): ReflectionData[] {
  const entitiesWithMissingTypedoc: ReflectionData[] = [];
  if (!hasComment(data) && data.kindString !== 'Project') {
    entitiesWithMissingTypedoc.push(data);
  }
  if (data.comment?.tags?.find(t => t.tag === 'deprecated')) {
    return entitiesWithMissingTypedoc;
  }
  // We don't care about traversing children for these nodes.
  const terminalNames = ['PrecannedDateRange', 'ScaleIconSet', 'Type'];
  if (terminalNames.includes(data.name)) {
    return entitiesWithMissingTypedoc;
  }
  for (const child of data.children || []) {
    const missingOnChild = traverse(child);
    entitiesWithMissingTypedoc.push(...missingOnChild);
  }
  return entitiesWithMissingTypedoc;
}

function hasComment(data: ReflectionData): boolean {
  return Boolean(
    data.comment ||
      data.signatures?.some(sig => sig.comment) ||
      (data.type?.declaration.name === '__type' && data.type.declaration.signatures?.some(sig => sig.comment)),
  );
}

function messageForEntity(data: ReflectionData): string {
  const source = data.sources?.[0];
  return `${data.name.padEnd(40)} ${data.kindString.padEnd(30)} ${source?.fileName}:${source?.line}`;
}

describe('TypeDoc coverage', () => {
  it('all reachable entities are documented', () => {
    const data = getReflectionData();
    const missing = traverse(data);
    if (missing.length > 0) {
      const message =
        'The following entities are missing TypeDoc documentation. Please add doc comments for them.\n\n' +
        missing.map(messageForEntity).join('\n');
      assert.fail(message);
    }
  });

  it('no broken links', () => {
    const command = 'grep -R @link docs/reference/sdk/*';
    const response = spawnSync(command, {shell: true});
    const matches = response.stdout.toString();
    if (matches.trim()) {
      assert.fail(`Found broken @link references in SDK reference documentation:\n${matches}`);
    }
  });
});
