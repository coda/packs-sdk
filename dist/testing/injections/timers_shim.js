// ts file compiled js file somehow end up with cjs format but esbuild needs esm format for shims.
// so for now we just have this file in js.

// per https://github.com/laverdet/isolated-vm/issues/136, passing the real setTimeout to
// an ivm context isn't safe. so we create a workaround to (1) block syncronously and then
// (2) use a Promise to yield execution of the current thread.
export function setTimeout(callback, timeout) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, timeout);
  new Promise(_ => callback());
}

// can't actually set interval in ivm. this would only be executed once. maybe we should
// just throw an error if setInterval is called.
export function setInterval(callback, _) { new Promise(_ => callback()) }

export function clearTimeout() {}
export function clearInterval() {}
