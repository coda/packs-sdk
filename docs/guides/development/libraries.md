---
description: Add JavaScript libraries from NPM to enhance your Packs.
---

# Using libraries

JavaScript has a rich and diverse set of libraries available, making it easy to re-use the work of others and more quickly develop an application. You can utilize many of these libraries when building Packs, but there are some important limitations to be aware of.

## Only available in the CLI

At the moment you can only add libraries to your Pack when building with the Packs command line tool (CLI). If you are using the browser-based Pack Studio and want to use a library you'll have to migrate to the CLI workflow. See the [CLI getting started guide][get_started_cli] for information on how to install and setup the CLI.

## Use NPM

The easiest way to install libraries is via the Node package manager (NPM). While originally created just for the Node.js environment, it's now used to distribute all sorts of JavaScript libraries. If you completed the [CLI getting started guide][get_started_cli] then you should already have NPM installed.

To add a library to your Pack simply use `npm install` to install it. For example, to install the popular JavaScript library [Lodash][lodash] you would run:

```sh
npm install lodash
```

You can then import this library into your code using either Node's `require` or the more modern `import` syntax:

```ts
const _ = require('lodash');
// ... or ...
import _ from 'lodash';
```

!!! info
    How to import the library may vary; consult the library's documentation for the correct syntax.

[get_started_cli]: ../../tutorials/get-started/cli.md
[lodash]: https://lodash.com/

## Library compatibility

Some JavaScript libraries are written assuming the code is being run in either a web browser or on a Node.js server, and the Packs execution environment isn't exactly either. The execution environment provides access to the [standard built-in JavaScript objects][mdn_standard], but doesn't support [Web APIs][mdn_web] or [Node.js APIs][node_apis]. These include but are not limited to:

- Browser: `window`, `document`, `XMLHttpRequest`, `fetch()`
- Node.js: `fs`, `http`, `buffer`[^1]
- Both: `setTimeout()`[^1], `setInterval()`[^1]

[^1]: A [shim](#shims) exists for this feature.

Unfortunately there isn't an easy way to determine beforehand if a given library will fail due to an unavailable API. At the moment the best approach is to try the library and see if it runs successfully in the Packs environment.

While many compatibility issues will be caught when the Pack is being built, there are others that are only exposed at runtime. In those cases your code will fail with an error like `<function> is not defined`. The `code execute` command runs your code in a VM with all of the same limitations in place, allowing you test compatibility without needing to upload your code to the server.

### Shims

When using the CLI, [browserify][browserify] is used to provide shims [for some Node.js modules][browserify_modules]. These shims themselves are designed to work in the browser, so not all modules that browserify supports may be supported in the Packs execution environment.

Additionally, the CLI provides optional shims for some timer-related functions (`setTimeout` and `setInterval`). To enable these shims, pass the flag `--timerStrategy=fake` when executing and uploading your Pack. Note that these shims attempt to approximate the behavior of these methods, but may not work reliably.

[mdn_standard]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects
[mdn_web]: https://developer.mozilla.org/en-US/docs/Web/API
[node_apis]: https://nodejs.org/api/documentation.html
[browserify]: https://browserify.org/
[browserify_modules]: https://github.com/browserify/browserify#compatibility
