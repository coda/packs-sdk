// ivm doens't have a crypto implementation. since we browserify modules already, this shim implements the browser crypto interface.
// inspired by https://github.com/kumavis/polyfill-crypto.getrandomvalues/blob/master/index.js

var MersenneTwister = require('mersenne-twister');

var twister = new MersenneTwister(Math.random() * Number.MAX_SAFE_INTEGER);

function getRandomValues(abv) {
  var l = abv.length;
  while (l--) {
    abv[l] = Math.floor(randomFloat() * 256);
  }
  return abv;
}

function randomFloat() {
  return twister.random();
}

export const crypto = {
  getRandomValues,
};

// esbuild isn't injecting the shim exports into global. in this particular case, crypto
// library is usually used as global.crypto which returns undefined otherwise.
//
// alternatively a few other approaches are tried:
// - shim global: which doesn't work with VM somehow since the VM manages context.global which
//   seems a different object from the global here. causing manifest to be undefined.
// - use esbuild define global.crypto: crypto. didn't work.
// - https://github.com/evanw/esbuild/issues/296 Didn't work since we banned eval in VM.
//
// Lastly, we can move this shim to thunk bundle and register it into global from the thunk bundle.
// It has the same side effect of the shim though.
//
// please note that this causes a global leak and needs be ignored in some configs.
// Node 19 has native support for the crypto module.
if (!global.crypto?.getRandomValues) {
  global.crypto = crypto;
}
