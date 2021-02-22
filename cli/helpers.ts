import {spawnSync} from 'child_process';

export function spawnProcess(command: string) {
  let cmd = command;
  // Hack to allow us to run this CLI tool for testing purposes from within this repo, without
  // needing it installed as an npm package.
  if (process.argv[1].endsWith('coda.ts')) {
    cmd = command.replace('coda-packs-sdk/dist', process.env.PWD!);
  }

  return spawnSync(cmd, {
    shell: true,
    stdio: 'inherit',
  });
}
