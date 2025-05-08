// ts file compiled js file somehow end up with cjs format but esbuild needs esm format for shims.
// so for now we just have this file in js.

const ErrorMessage =
  `Please use \`coda setOption path/to/pack.ts timerStrategy fake\`. Native node timing ` +
  `primitives like setTimeout or setInternal aren't supported in the pack execution sandbox ` +
  `environment. However, if you are using a library that relies upon them, you can use the ` +
  `set an option to build your pack with shimmed implementations that approximate the native ` +
  `behavior. Because of this, be aware that packs that use timing primitives may not work reliably.`

export function setTimeout() { throw new Error(ErrorMessage); }

export function setInterval() { throw new Error(ErrorMessage); }

export function clearTimeout() { throw new Error(ErrorMessage); }
export function clearInterval() { throw new Error(ErrorMessage); }
