// This file is trying to create a global flag that toJSON overrides know to apply or not.
// It's no-op for some objects but will change the toJSON format for Date.
// The flag is not designed to be used by marshalers running in parallel. It's probably okay
// if marshalers don't yield explicitly. In most cases JS runs with no parallelism.
let _isMarshaling: boolean = false;

export function startMarshaling(): void {
  _isMarshaling = true;
}

export function finishMarshaling(): void {
  _isMarshaling = false;
}

export function isMarshaling(): boolean {
  return _isMarshaling;
}
