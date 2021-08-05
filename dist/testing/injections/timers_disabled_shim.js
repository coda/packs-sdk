// ts file compiled js file somehow end up with cjs format but esbuild needs esm format for shims.
// so for now we just have this file in js.

const ErrorMessage = 'Please use --timers option to enable timers. Be aware that timing methods ' + 
  "like setTimeout or setInternal aren't reliable in the pack execution environments. You should" + 
  " avoid using them if possible.";

export function setTimeout() { throw new Error(ErrorMessage); }

export function setInterval() { throw new Error(ErrorMessage); }

export function clearTimeout() { throw new Error(ErrorMessage); }
export function clearInterval() { throw new Error(ErrorMessage); }
