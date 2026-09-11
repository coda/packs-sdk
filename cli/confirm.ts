import {printAndExit} from '../testing/helpers';
import {promptForInput} from '../testing/helpers';

export function isInteractive(): boolean {
  return Boolean(process.stdin.isTTY);
}

export function confirmOrFail({
  yes,
  prompt,
  example,
  interactive = isInteractive(),
}: {
  yes?: boolean;
  prompt: string;
  example: string;
  interactive?: boolean;
}): void {
  if (yes) {
    return;
  }
  if (interactive) {
    const answer = promptForInput(prompt, {yesOrNo: true});
    if (answer !== 'yes') {
      printAndExit('Aborted.');
    }
    return;
  }
  printAndExit(`${prompt.trim()}\nPass --yes to continue without a prompt.\n  ${example}`);
}

export function missingFlagError(message: string, example: string, extra?: string): never {
  const lines = [`Error: ${message}`, `  ${example}`];
  if (extra) {
    lines.push(extra);
  }
  return printAndExit(lines.join('\n'));
}
