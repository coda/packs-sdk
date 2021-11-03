import fs from 'fs';
import os from 'os';
import * as path from 'path';
import {spawnSync} from 'child_process';

/**
 * Outputs all of the identifiers reachable by our TypeDoc config that are lacking documentation.
 */

// Very partial typing
interface ReflectionData {
  name: string;
  kindString: string;
  comment?: {
    shortText: string;
    text?: string;
    tags?: Array<{
      tag: string;
      text?: string;
    }>;
  };
  sources?: Array<{
    fileName: string;
  }>;
  children?: ReflectionData[];
}

function getReflectionData() {
  const tempfile = path.join(os.tmpdir(), `typedoc.json`);
  const command = `node_modules/.bin/typedoc index.ts --options typedoc.js --json ${tempfile} > /dev/null 2>&1`;
  spawnSync(command, {
    shell: true,
    stdio: 'inherit',
  });
  return JSON.parse(fs.readFileSync(tempfile, 'utf-8'));
}

function traverse(data: ReflectionData): void {
  if (!data.comment) {
    logMissing(data);
  }
  if (data.comment?.tags?.find(t => t.tag === 'deprecated')) {
    return;
  }
  // We don't care about traversing children for these nodes.
  const terminalNames = ['PrecannedDateRange', 'ScaleIconSet', 'Type'];
  if (terminalNames.includes(data.name)) {
    return;
  }
  for (const child of data.children || []) {
    traverse(child);
  }
}

function logMissing(data: ReflectionData): void {
  // eslint-disable-next-line no-console
  console.log(`${data.name.padEnd(40)} ${data.kindString.padEnd(30)} ${data.sources?.[0].fileName}`);
}

function main() {
  const data = getReflectionData();
  traverse(data);
}

main();
