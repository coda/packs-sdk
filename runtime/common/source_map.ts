import {SourceMapConsumer} from 'source-map';
import fs from 'fs';
import * as stackTraceParser from 'stacktrace-parser';

const SOURCE_MAP_INIT_TIMEOUT_MS = 5000; // 5 seconds timeout for WASM initialization

/**
 * Wraps a promise with a timeout. Avoids Promise.race() to prevent memory leaks.
 * The timeout is properly cleaned up whether the promise resolves or times out.
 */
function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  let timeoutId: NodeJS.Timeout;

  return new Promise<T>((resolve, reject) => {
    // Set up timeout
    timeoutId = setTimeout(() => {
      reject(new Error(`Operation timed out after ${timeoutMs}ms`));
    }, timeoutMs);

    // Wait for the original promise and always clean up timeout
    promise.then(resolve, reject).finally(() => {
      clearTimeout(timeoutId);
    });
  });
}

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
    // Use async file read to avoid blocking the event loop
    const sourceMapContent = await fs.promises.readFile(bundleSourceMapPath, 'utf8');

    // Use SourceMapConsumer.with() which automatically calls destroy() when done.
    // Wrap with timeout to prevent infinite hangs if WASM init fails.
    const translatedStacktrace = await withTimeout(
      SourceMapConsumer.with(sourceMapContent, null, consumer => {
        const stack = stackTraceParser.parse(stacktrace);

        const translatedStack = stack.map(frame => {
          if (!frame.file?.endsWith(vmFilename) || frame.lineNumber === null || frame.column === null) {
            return frame;
          }

          const originalFrame = consumer.originalPositionFor({line: frame.lineNumber, column: frame.column - 1});

          // If source map lookup failed, return original frame to avoid rendering "null:null:null"
          if (originalFrame.source === null || originalFrame.line === null) {
            return frame;
          }

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
      }),
      SOURCE_MAP_INIT_TIMEOUT_MS,
    );

    return translatedStacktrace;
  } catch (err: any) {
    // Something went wrong (file read, WASM init timeout, or translation error).
    // Return the original stacktrace so we still have some error information.
    // eslint-disable-next-line no-console
    console.log('Failed to translate error stack', err);
    return stacktrace;
  }
}
