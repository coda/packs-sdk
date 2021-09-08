import {SourceMapConsumer} from 'source-map';
import fs from 'fs';
import * as stackTraceParser from 'stacktrace-parser';

// isolated-vm doesn't translate error stack with source map. so we have to do this manually.
export async function translateErrorStackFromVM({
  stacktrace,
  bundleSourceMapPath,
  vmFilename,
}: {
  stacktrace?: string;
  bundleSourceMapPath: string;
  vmFilename: string;
}): Promise<string | undefined> {
  if (!stacktrace) {
    return stacktrace;
  }

  try {
    const consumer = await new SourceMapConsumer(fs.readFileSync(bundleSourceMapPath, 'utf8'));
    const stack = stackTraceParser.parse(stacktrace);

    const translatedStack = stack.map(frame => {
      if (!frame.file?.endsWith(vmFilename) || frame.lineNumber === null || frame.column === null) {
        return frame;
      }

      const originalFrame = consumer.originalPositionFor({line: frame.lineNumber, column: frame.column - 1});

      return {
        ...frame,
        file: originalFrame.source,
        column: originalFrame.column ? originalFrame.column + 1 : originalFrame.column,
        lineNumber: originalFrame.line,
        methodName: originalFrame.name || frame.methodName,
      };
    });

    return translatedStack
      .map(
        stackValue =>
          `    at ${stackValue.methodName || '<unknown>'} (${stackValue.file}:${stackValue.lineNumber}:${
            stackValue.column
          })\n`,
      )
      .join('');
  } catch (err: any) {
    // something went wrong. just return the original stacktrace.
    // eslint-disable-next-line no-console
    console.log('Failed to translate error stack', err);
    return stacktrace;
  }
}
