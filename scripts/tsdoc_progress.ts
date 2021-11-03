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
  if (!hasComment(data)) {
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

function hasComment(data: ReflectionData): boolean {
  return Boolean(data.comment || data.signatures?.some(sig => sig.comment));
}

function logMissing(data: ReflectionData): void {
  const source = data.sources?.[0];
  const message = `${data.name.padEnd(40)} ${data.kindString.padEnd(30)} ${source?.fileName}:${source?.line}`;
  // eslint-disable-next-line no-console
  console.log(message);
}

function main() {
  const data = getReflectionData();
  traverse(data);
}

main();
