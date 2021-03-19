'use strict';
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
var __commonJS = (callback, module2) => () => {
  if (!module2) {
    module2 = {exports: {}};
    callback(module2.exports, module2);
  }
  return module2.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {get: all[name], enumerable: true});
};
var __exportStar = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, {get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable});
  }
  return target;
};
var __toModule = (module2) => {
  return __exportStar(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? {get: () => module2.default, enumerable: true} : {value: module2, enumerable: true})), module2);
};

// node_modules/pascalcase/index.js
var require_pascalcase = __commonJS((exports2, module2) => {
  /*!
   * pascalcase <https://github.com/jonschlinkert/pascalcase>
   *
   * Copyright (c) 2015-present, Jon ("Schlink") Schlinkert.
   * Licensed under the MIT License.
   */
  var titlecase = (input) => input[0].toLocaleUpperCase() + input.slice(1);
  module2.exports = (value) => {
    if (value === null || value === void 0)
      return "";
    if (typeof value.toString !== "function")
      return "";
    let input = value.toString().trim();
    if (input === "")
      return "";
    if (input.length === 1)
      return input.toLocaleUpperCase();
    let match = input.match(/[a-zA-Z0-9]+/g);
    if (match) {
      return match.map((m) => titlecase(m)).join("");
    }
    return input;
  };
});

// node_modules/clone/clone.js
var require_clone = __commonJS((exports2, module2) => {
  var clone2 = function() {
    "use strict";
    function _instanceof(obj, type) {
      return type != null && obj instanceof type;
    }
    var nativeMap;
    try {
      nativeMap = Map;
    } catch (_) {
      nativeMap = function() {
      };
    }
    var nativeSet;
    try {
      nativeSet = Set;
    } catch (_) {
      nativeSet = function() {
      };
    }
    var nativePromise;
    try {
      nativePromise = Promise;
    } catch (_) {
      nativePromise = function() {
      };
    }
    function clone3(parent, circular, depth, prototype, includeNonEnumerable) {
      if (typeof circular === "object") {
        depth = circular.depth;
        prototype = circular.prototype;
        includeNonEnumerable = circular.includeNonEnumerable;
        circular = circular.circular;
      }
      var allParents = [];
      var allChildren = [];
      var useBuffer = typeof Buffer != "undefined";
      if (typeof circular == "undefined")
        circular = true;
      if (typeof depth == "undefined")
        depth = Infinity;
      function _clone(parent2, depth2) {
        if (parent2 === null)
          return null;
        if (depth2 === 0)
          return parent2;
        var child;
        var proto;
        if (typeof parent2 != "object") {
          return parent2;
        }
        if (_instanceof(parent2, nativeMap)) {
          child = new nativeMap();
        } else if (_instanceof(parent2, nativeSet)) {
          child = new nativeSet();
        } else if (_instanceof(parent2, nativePromise)) {
          child = new nativePromise(function(resolve, reject) {
            parent2.then(function(value) {
              resolve(_clone(value, depth2 - 1));
            }, function(err) {
              reject(_clone(err, depth2 - 1));
            });
          });
        } else if (clone3.__isArray(parent2)) {
          child = [];
        } else if (clone3.__isRegExp(parent2)) {
          child = new RegExp(parent2.source, __getRegExpFlags(parent2));
          if (parent2.lastIndex)
            child.lastIndex = parent2.lastIndex;
        } else if (clone3.__isDate(parent2)) {
          child = new Date(parent2.getTime());
        } else if (useBuffer && Buffer.isBuffer(parent2)) {
          if (Buffer.allocUnsafe) {
            child = Buffer.allocUnsafe(parent2.length);
          } else {
            child = new Buffer(parent2.length);
          }
          parent2.copy(child);
          return child;
        } else if (_instanceof(parent2, Error)) {
          child = Object.create(parent2);
        } else {
          if (typeof prototype == "undefined") {
            proto = Object.getPrototypeOf(parent2);
            child = Object.create(proto);
          } else {
            child = Object.create(prototype);
            proto = prototype;
          }
        }
        if (circular) {
          var index = allParents.indexOf(parent2);
          if (index != -1) {
            return allChildren[index];
          }
          allParents.push(parent2);
          allChildren.push(child);
        }
        if (_instanceof(parent2, nativeMap)) {
          parent2.forEach(function(value, key) {
            var keyChild = _clone(key, depth2 - 1);
            var valueChild = _clone(value, depth2 - 1);
            child.set(keyChild, valueChild);
          });
        }
        if (_instanceof(parent2, nativeSet)) {
          parent2.forEach(function(value) {
            var entryChild = _clone(value, depth2 - 1);
            child.add(entryChild);
          });
        }
        for (var i in parent2) {
          var attrs;
          if (proto) {
            attrs = Object.getOwnPropertyDescriptor(proto, i);
          }
          if (attrs && attrs.set == null) {
            continue;
          }
          child[i] = _clone(parent2[i], depth2 - 1);
        }
        if (Object.getOwnPropertySymbols) {
          var symbols = Object.getOwnPropertySymbols(parent2);
          for (var i = 0; i < symbols.length; i++) {
            var symbol = symbols[i];
            var descriptor = Object.getOwnPropertyDescriptor(parent2, symbol);
            if (descriptor && !descriptor.enumerable && !includeNonEnumerable) {
              continue;
            }
            child[symbol] = _clone(parent2[symbol], depth2 - 1);
            if (!descriptor.enumerable) {
              Object.defineProperty(child, symbol, {
                enumerable: false
              });
            }
          }
        }
        if (includeNonEnumerable) {
          var allPropertyNames = Object.getOwnPropertyNames(parent2);
          for (var i = 0; i < allPropertyNames.length; i++) {
            var propertyName = allPropertyNames[i];
            var descriptor = Object.getOwnPropertyDescriptor(parent2, propertyName);
            if (descriptor && descriptor.enumerable) {
              continue;
            }
            child[propertyName] = _clone(parent2[propertyName], depth2 - 1);
            Object.defineProperty(child, propertyName, {
              enumerable: false
            });
          }
        }
        return child;
      }
      return _clone(parent, depth);
    }
    clone3.clonePrototype = function clonePrototype(parent) {
      if (parent === null)
        return null;
      var c = function() {
      };
      c.prototype = parent;
      return new c();
    };
    function __objToStr(o) {
      return Object.prototype.toString.call(o);
    }
    clone3.__objToStr = __objToStr;
    function __isDate(o) {
      return typeof o === "object" && __objToStr(o) === "[object Date]";
    }
    clone3.__isDate = __isDate;
    function __isArray(o) {
      return typeof o === "object" && __objToStr(o) === "[object Array]";
    }
    clone3.__isArray = __isArray;
    function __isRegExp(o) {
      return typeof o === "object" && __objToStr(o) === "[object RegExp]";
    }
    clone3.__isRegExp = __isRegExp;
    function __getRegExpFlags(re) {
      var flags = "";
      if (re.global)
        flags += "g";
      if (re.ignoreCase)
        flags += "i";
      if (re.multiline)
        flags += "m";
      return flags;
    }
    clone3.__getRegExpFlags = __getRegExpFlags;
    return clone3;
  }();
  if (typeof module2 === "object" && module2.exports) {
    module2.exports = clone2;
  }
});

// node_modules/string-template/index.js
var require_string_template = __commonJS((exports2, module2) => {
  var nargs = /\{([0-9a-zA-Z_]+)\}/g;
  module2.exports = template;
  function template(string) {
    var args;
    if (arguments.length === 2 && typeof arguments[1] === "object") {
      args = arguments[1];
    } else {
      args = new Array(arguments.length - 1);
      for (var i = 1; i < arguments.length; ++i) {
        args[i - 1] = arguments[i];
      }
    }
    if (!args || !args.hasOwnProperty) {
      args = {};
    }
    return string.replace(nargs, function replaceArg(match, i2, index) {
      var result;
      if (string[index - 1] === "{" && string[index + match.length] === "}") {
        return i2;
      } else {
        result = args.hasOwnProperty(i2) ? args[i2] : null;
        if (result === null || result === void 0) {
          return "";
        }
        return result;
      }
    });
  }
});

// node_modules/string-template/compile.js
var require_compile = __commonJS((exports2, module2) => {
  var template = require_string_template();
  var whitespaceRegex = /["'\\\n\r\u2028\u2029]/g;
  var nargs = /\{[0-9a-zA-Z]+\}/g;
  var replaceTemplate = '    var args\n    var result\n    if (arguments.length === 1 && typeof arguments[0] === "object") {\n        args = arguments[0]\n    } else {\n        args = arguments    }\n\n    if (!args || !("hasOwnProperty" in args)) {\n       args = {}\n    }\n\n    return {0}';
  var literalTemplate = '"{0}"';
  var argTemplate = '(result = args.hasOwnProperty("{0}") ? args["{0}"] : null, \n        (result === null || result === undefined) ? "" : result)';
  module2.exports = compile;
  function compile(string, inline) {
    var replacements = string.match(nargs) || [];
    var interleave = string.split(nargs);
    var replace = [];
    for (var i = 0; i < interleave.length; i++) {
      var current = interleave[i];
      var replacement = replacements[i];
      var escapeLeft = current.charAt(current.length - 1);
      var escapeRight = (interleave[i + 1] || "").charAt(0);
      if (replacement) {
        replacement = replacement.substring(1, replacement.length - 1);
      }
      if (escapeLeft === "{" && escapeRight === "}") {
        replace.push(current + replacement);
      } else {
        replace.push(current);
        if (replacement) {
          replace.push({name: replacement});
        }
      }
    }
    var prev = [""];
    for (var j = 0; j < replace.length; j++) {
      var curr = replace[j];
      if (String(curr) === curr) {
        var top = prev[prev.length - 1];
        if (String(top) === top) {
          prev[prev.length - 1] = top + curr;
        } else {
          prev.push(curr);
        }
      } else {
        prev.push(curr);
      }
    }
    replace = prev;
    if (inline) {
      for (var k = 0; k < replace.length; k++) {
        var token = replace[k];
        if (String(token) === token) {
          replace[k] = template(literalTemplate, escape2(token));
        } else {
          replace[k] = template(argTemplate, escape2(token.name));
        }
      }
      var replaceCode = replace.join(" +\n    ");
      var compiledSource = template(replaceTemplate, replaceCode);
      return new Function(compiledSource);
    }
    return function template2() {
      var args;
      if (arguments.length === 1 && typeof arguments[0] === "object") {
        args = arguments[0];
      } else {
        args = arguments;
      }
      if (!args || !("hasOwnProperty" in args)) {
        args = {};
      }
      var result = [];
      for (var i2 = 0; i2 < replace.length; i2++) {
        if (i2 % 2 === 0) {
          result.push(replace[i2]);
        } else {
          var argName = replace[i2].name;
          var arg = args.hasOwnProperty(argName) ? args[argName] : null;
          if (arg !== null || arg !== void 0) {
            result.push(arg);
          }
        }
      }
      return result.join("");
    };
  }
  function escape2(string) {
    string = "" + string;
    return string.replace(whitespaceRegex, escapedWhitespace);
  }
  function escapedWhitespace(character) {
    switch (character) {
      case '"':
      case "'":
      case "\\":
        return "\\" + character;
      case "\n":
        return "\\n";
      case "\r":
        return "\\r";
      case "\u2028":
        return "\\u2028";
      case "\u2029":
        return "\\u2029";
    }
  }
});

// node_modules/qs/lib/formats.js
var require_formats = __commonJS((exports2, module2) => {
  "use strict";
  var replace = String.prototype.replace;
  var percentTwenties = /%20/g;
  var Format = {
    RFC1738: "RFC1738",
    RFC3986: "RFC3986"
  };
  module2.exports = {
    default: Format.RFC3986,
    formatters: {
      RFC1738: function(value) {
        return replace.call(value, percentTwenties, "+");
      },
      RFC3986: function(value) {
        return String(value);
      }
    },
    RFC1738: Format.RFC1738,
    RFC3986: Format.RFC3986
  };
});

// node_modules/qs/lib/utils.js
var require_utils = __commonJS((exports2, module2) => {
  "use strict";
  var formats = require_formats();
  var has = Object.prototype.hasOwnProperty;
  var isArray2 = Array.isArray;
  var hexTable = function() {
    var array = [];
    for (var i = 0; i < 256; ++i) {
      array.push("%" + ((i < 16 ? "0" : "") + i.toString(16)).toUpperCase());
    }
    return array;
  }();
  var compactQueue = function compactQueue2(queue) {
    while (queue.length > 1) {
      var item = queue.pop();
      var obj = item.obj[item.prop];
      if (isArray2(obj)) {
        var compacted = [];
        for (var j = 0; j < obj.length; ++j) {
          if (typeof obj[j] !== "undefined") {
            compacted.push(obj[j]);
          }
        }
        item.obj[item.prop] = compacted;
      }
    }
  };
  var arrayToObject = function arrayToObject2(source, options) {
    var obj = options && options.plainObjects ? Object.create(null) : {};
    for (var i = 0; i < source.length; ++i) {
      if (typeof source[i] !== "undefined") {
        obj[i] = source[i];
      }
    }
    return obj;
  };
  var merge = function merge2(target, source, options) {
    if (!source) {
      return target;
    }
    if (typeof source !== "object") {
      if (isArray2(target)) {
        target.push(source);
      } else if (target && typeof target === "object") {
        if (options && (options.plainObjects || options.allowPrototypes) || !has.call(Object.prototype, source)) {
          target[source] = true;
        }
      } else {
        return [target, source];
      }
      return target;
    }
    if (!target || typeof target !== "object") {
      return [target].concat(source);
    }
    var mergeTarget = target;
    if (isArray2(target) && !isArray2(source)) {
      mergeTarget = arrayToObject(target, options);
    }
    if (isArray2(target) && isArray2(source)) {
      source.forEach(function(item, i) {
        if (has.call(target, i)) {
          var targetItem = target[i];
          if (targetItem && typeof targetItem === "object" && item && typeof item === "object") {
            target[i] = merge2(targetItem, item, options);
          } else {
            target.push(item);
          }
        } else {
          target[i] = item;
        }
      });
      return target;
    }
    return Object.keys(source).reduce(function(acc, key) {
      var value = source[key];
      if (has.call(acc, key)) {
        acc[key] = merge2(acc[key], value, options);
      } else {
        acc[key] = value;
      }
      return acc;
    }, mergeTarget);
  };
  var assign = function assignSingleSource(target, source) {
    return Object.keys(source).reduce(function(acc, key) {
      acc[key] = source[key];
      return acc;
    }, target);
  };
  var decode = function(str, decoder, charset) {
    var strWithoutPlus = str.replace(/\+/g, " ");
    if (charset === "iso-8859-1") {
      return strWithoutPlus.replace(/%[0-9a-f]{2}/gi, unescape);
    }
    try {
      return decodeURIComponent(strWithoutPlus);
    } catch (e) {
      return strWithoutPlus;
    }
  };
  var encode = function encode2(str, defaultEncoder, charset, kind, format) {
    if (str.length === 0) {
      return str;
    }
    var string = str;
    if (typeof str === "symbol") {
      string = Symbol.prototype.toString.call(str);
    } else if (typeof str !== "string") {
      string = String(str);
    }
    if (charset === "iso-8859-1") {
      return escape(string).replace(/%u[0-9a-f]{4}/gi, function($0) {
        return "%26%23" + parseInt($0.slice(2), 16) + "%3B";
      });
    }
    var out = "";
    for (var i = 0; i < string.length; ++i) {
      var c = string.charCodeAt(i);
      if (c === 45 || c === 46 || c === 95 || c === 126 || c >= 48 && c <= 57 || c >= 65 && c <= 90 || c >= 97 && c <= 122 || format === formats.RFC1738 && (c === 40 || c === 41)) {
        out += string.charAt(i);
        continue;
      }
      if (c < 128) {
        out = out + hexTable[c];
        continue;
      }
      if (c < 2048) {
        out = out + (hexTable[192 | c >> 6] + hexTable[128 | c & 63]);
        continue;
      }
      if (c < 55296 || c >= 57344) {
        out = out + (hexTable[224 | c >> 12] + hexTable[128 | c >> 6 & 63] + hexTable[128 | c & 63]);
        continue;
      }
      i += 1;
      c = 65536 + ((c & 1023) << 10 | string.charCodeAt(i) & 1023);
      out += hexTable[240 | c >> 18] + hexTable[128 | c >> 12 & 63] + hexTable[128 | c >> 6 & 63] + hexTable[128 | c & 63];
    }
    return out;
  };
  var compact = function compact2(value) {
    var queue = [{obj: {o: value}, prop: "o"}];
    var refs = [];
    for (var i = 0; i < queue.length; ++i) {
      var item = queue[i];
      var obj = item.obj[item.prop];
      var keys = Object.keys(obj);
      for (var j = 0; j < keys.length; ++j) {
        var key = keys[j];
        var val = obj[key];
        if (typeof val === "object" && val !== null && refs.indexOf(val) === -1) {
          queue.push({obj, prop: key});
          refs.push(val);
        }
      }
    }
    compactQueue(queue);
    return value;
  };
  var isRegExp = function isRegExp2(obj) {
    return Object.prototype.toString.call(obj) === "[object RegExp]";
  };
  var isBuffer = function isBuffer2(obj) {
    if (!obj || typeof obj !== "object") {
      return false;
    }
    return !!(obj.constructor && obj.constructor.isBuffer && obj.constructor.isBuffer(obj));
  };
  var combine = function combine2(a, b) {
    return [].concat(a, b);
  };
  var maybeMap = function maybeMap2(val, fn) {
    if (isArray2(val)) {
      var mapped = [];
      for (var i = 0; i < val.length; i += 1) {
        mapped.push(fn(val[i]));
      }
      return mapped;
    }
    return fn(val);
  };
  module2.exports = {
    arrayToObject,
    assign,
    combine,
    compact,
    decode,
    encode,
    isBuffer,
    isRegExp,
    maybeMap,
    merge
  };
});

// node_modules/qs/lib/stringify.js
var require_stringify = __commonJS((exports2, module2) => {
  "use strict";
  var utils = require_utils();
  var formats = require_formats();
  var has = Object.prototype.hasOwnProperty;
  var arrayPrefixGenerators = {
    brackets: function brackets(prefix) {
      return prefix + "[]";
    },
    comma: "comma",
    indices: function indices(prefix, key) {
      return prefix + "[" + key + "]";
    },
    repeat: function repeat(prefix) {
      return prefix;
    }
  };
  var isArray2 = Array.isArray;
  var push = Array.prototype.push;
  var pushToArray = function(arr, valueOrArray) {
    push.apply(arr, isArray2(valueOrArray) ? valueOrArray : [valueOrArray]);
  };
  var toISO = Date.prototype.toISOString;
  var defaultFormat = formats["default"];
  var defaults = {
    addQueryPrefix: false,
    allowDots: false,
    charset: "utf-8",
    charsetSentinel: false,
    delimiter: "&",
    encode: true,
    encoder: utils.encode,
    encodeValuesOnly: false,
    format: defaultFormat,
    formatter: formats.formatters[defaultFormat],
    indices: false,
    serializeDate: function serializeDate(date) {
      return toISO.call(date);
    },
    skipNulls: false,
    strictNullHandling: false
  };
  var isNonNullishPrimitive = function isNonNullishPrimitive2(v) {
    return typeof v === "string" || typeof v === "number" || typeof v === "boolean" || typeof v === "symbol" || typeof v === "bigint";
  };
  var stringify = function stringify2(object, prefix, generateArrayPrefix, strictNullHandling, skipNulls, encoder, filter, sort, allowDots, serializeDate, format, formatter, encodeValuesOnly, charset) {
    var obj = object;
    if (typeof filter === "function") {
      obj = filter(prefix, obj);
    } else if (obj instanceof Date) {
      obj = serializeDate(obj);
    } else if (generateArrayPrefix === "comma" && isArray2(obj)) {
      obj = utils.maybeMap(obj, function(value2) {
        if (value2 instanceof Date) {
          return serializeDate(value2);
        }
        return value2;
      });
    }
    if (obj === null) {
      if (strictNullHandling) {
        return encoder && !encodeValuesOnly ? encoder(prefix, defaults.encoder, charset, "key", format) : prefix;
      }
      obj = "";
    }
    if (isNonNullishPrimitive(obj) || utils.isBuffer(obj)) {
      if (encoder) {
        var keyValue = encodeValuesOnly ? prefix : encoder(prefix, defaults.encoder, charset, "key", format);
        return [formatter(keyValue) + "=" + formatter(encoder(obj, defaults.encoder, charset, "value", format))];
      }
      return [formatter(prefix) + "=" + formatter(String(obj))];
    }
    var values = [];
    if (typeof obj === "undefined") {
      return values;
    }
    var objKeys;
    if (generateArrayPrefix === "comma" && isArray2(obj)) {
      objKeys = [{value: obj.length > 0 ? obj.join(",") || null : void 0}];
    } else if (isArray2(filter)) {
      objKeys = filter;
    } else {
      var keys = Object.keys(obj);
      objKeys = sort ? keys.sort(sort) : keys;
    }
    for (var i = 0; i < objKeys.length; ++i) {
      var key = objKeys[i];
      var value = typeof key === "object" && key.value !== void 0 ? key.value : obj[key];
      if (skipNulls && value === null) {
        continue;
      }
      var keyPrefix = isArray2(obj) ? typeof generateArrayPrefix === "function" ? generateArrayPrefix(prefix, key) : prefix : prefix + (allowDots ? "." + key : "[" + key + "]");
      pushToArray(values, stringify2(value, keyPrefix, generateArrayPrefix, strictNullHandling, skipNulls, encoder, filter, sort, allowDots, serializeDate, format, formatter, encodeValuesOnly, charset));
    }
    return values;
  };
  var normalizeStringifyOptions = function normalizeStringifyOptions2(opts) {
    if (!opts) {
      return defaults;
    }
    if (opts.encoder !== null && opts.encoder !== void 0 && typeof opts.encoder !== "function") {
      throw new TypeError("Encoder has to be a function.");
    }
    var charset = opts.charset || defaults.charset;
    if (typeof opts.charset !== "undefined" && opts.charset !== "utf-8" && opts.charset !== "iso-8859-1") {
      throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
    }
    var format = formats["default"];
    if (typeof opts.format !== "undefined") {
      if (!has.call(formats.formatters, opts.format)) {
        throw new TypeError("Unknown format option provided.");
      }
      format = opts.format;
    }
    var formatter = formats.formatters[format];
    var filter = defaults.filter;
    if (typeof opts.filter === "function" || isArray2(opts.filter)) {
      filter = opts.filter;
    }
    return {
      addQueryPrefix: typeof opts.addQueryPrefix === "boolean" ? opts.addQueryPrefix : defaults.addQueryPrefix,
      allowDots: typeof opts.allowDots === "undefined" ? defaults.allowDots : !!opts.allowDots,
      charset,
      charsetSentinel: typeof opts.charsetSentinel === "boolean" ? opts.charsetSentinel : defaults.charsetSentinel,
      delimiter: typeof opts.delimiter === "undefined" ? defaults.delimiter : opts.delimiter,
      encode: typeof opts.encode === "boolean" ? opts.encode : defaults.encode,
      encoder: typeof opts.encoder === "function" ? opts.encoder : defaults.encoder,
      encodeValuesOnly: typeof opts.encodeValuesOnly === "boolean" ? opts.encodeValuesOnly : defaults.encodeValuesOnly,
      filter,
      format,
      formatter,
      serializeDate: typeof opts.serializeDate === "function" ? opts.serializeDate : defaults.serializeDate,
      skipNulls: typeof opts.skipNulls === "boolean" ? opts.skipNulls : defaults.skipNulls,
      sort: typeof opts.sort === "function" ? opts.sort : null,
      strictNullHandling: typeof opts.strictNullHandling === "boolean" ? opts.strictNullHandling : defaults.strictNullHandling
    };
  };
  module2.exports = function(object, opts) {
    var obj = object;
    var options = normalizeStringifyOptions(opts);
    var objKeys;
    var filter;
    if (typeof options.filter === "function") {
      filter = options.filter;
      obj = filter("", obj);
    } else if (isArray2(options.filter)) {
      filter = options.filter;
      objKeys = filter;
    }
    var keys = [];
    if (typeof obj !== "object" || obj === null) {
      return "";
    }
    var arrayFormat;
    if (opts && opts.arrayFormat in arrayPrefixGenerators) {
      arrayFormat = opts.arrayFormat;
    } else if (opts && "indices" in opts) {
      arrayFormat = opts.indices ? "indices" : "repeat";
    } else {
      arrayFormat = "indices";
    }
    var generateArrayPrefix = arrayPrefixGenerators[arrayFormat];
    if (!objKeys) {
      objKeys = Object.keys(obj);
    }
    if (options.sort) {
      objKeys.sort(options.sort);
    }
    for (var i = 0; i < objKeys.length; ++i) {
      var key = objKeys[i];
      if (options.skipNulls && obj[key] === null) {
        continue;
      }
      pushToArray(keys, stringify(obj[key], key, generateArrayPrefix, options.strictNullHandling, options.skipNulls, options.encode ? options.encoder : null, options.filter, options.sort, options.allowDots, options.serializeDate, options.format, options.formatter, options.encodeValuesOnly, options.charset));
    }
    var joined = keys.join(options.delimiter);
    var prefix = options.addQueryPrefix === true ? "?" : "";
    if (options.charsetSentinel) {
      if (options.charset === "iso-8859-1") {
        prefix += "utf8=%26%2310003%3B&";
      } else {
        prefix += "utf8=%E2%9C%93&";
      }
    }
    return joined.length > 0 ? prefix + joined : "";
  };
});

// node_modules/qs/lib/parse.js
var require_parse = __commonJS((exports2, module2) => {
  "use strict";
  var utils = require_utils();
  var has = Object.prototype.hasOwnProperty;
  var isArray2 = Array.isArray;
  var defaults = {
    allowDots: false,
    allowPrototypes: false,
    arrayLimit: 20,
    charset: "utf-8",
    charsetSentinel: false,
    comma: false,
    decoder: utils.decode,
    delimiter: "&",
    depth: 5,
    ignoreQueryPrefix: false,
    interpretNumericEntities: false,
    parameterLimit: 1e3,
    parseArrays: true,
    plainObjects: false,
    strictNullHandling: false
  };
  var interpretNumericEntities = function(str) {
    return str.replace(/&#(\d+);/g, function($0, numberStr) {
      return String.fromCharCode(parseInt(numberStr, 10));
    });
  };
  var parseArrayValue = function(val, options) {
    if (val && typeof val === "string" && options.comma && val.indexOf(",") > -1) {
      return val.split(",");
    }
    return val;
  };
  var isoSentinel = "utf8=%26%2310003%3B";
  var charsetSentinel = "utf8=%E2%9C%93";
  var parseValues = function parseQueryStringValues(str, options) {
    var obj = {};
    var cleanStr = options.ignoreQueryPrefix ? str.replace(/^\?/, "") : str;
    var limit = options.parameterLimit === Infinity ? void 0 : options.parameterLimit;
    var parts = cleanStr.split(options.delimiter, limit);
    var skipIndex = -1;
    var i;
    var charset = options.charset;
    if (options.charsetSentinel) {
      for (i = 0; i < parts.length; ++i) {
        if (parts[i].indexOf("utf8=") === 0) {
          if (parts[i] === charsetSentinel) {
            charset = "utf-8";
          } else if (parts[i] === isoSentinel) {
            charset = "iso-8859-1";
          }
          skipIndex = i;
          i = parts.length;
        }
      }
    }
    for (i = 0; i < parts.length; ++i) {
      if (i === skipIndex) {
        continue;
      }
      var part = parts[i];
      var bracketEqualsPos = part.indexOf("]=");
      var pos = bracketEqualsPos === -1 ? part.indexOf("=") : bracketEqualsPos + 1;
      var key, val;
      if (pos === -1) {
        key = options.decoder(part, defaults.decoder, charset, "key");
        val = options.strictNullHandling ? null : "";
      } else {
        key = options.decoder(part.slice(0, pos), defaults.decoder, charset, "key");
        val = utils.maybeMap(parseArrayValue(part.slice(pos + 1), options), function(encodedVal) {
          return options.decoder(encodedVal, defaults.decoder, charset, "value");
        });
      }
      if (val && options.interpretNumericEntities && charset === "iso-8859-1") {
        val = interpretNumericEntities(val);
      }
      if (part.indexOf("[]=") > -1) {
        val = isArray2(val) ? [val] : val;
      }
      if (has.call(obj, key)) {
        obj[key] = utils.combine(obj[key], val);
      } else {
        obj[key] = val;
      }
    }
    return obj;
  };
  var parseObject = function(chain, val, options, valuesParsed) {
    var leaf = valuesParsed ? val : parseArrayValue(val, options);
    for (var i = chain.length - 1; i >= 0; --i) {
      var obj;
      var root = chain[i];
      if (root === "[]" && options.parseArrays) {
        obj = [].concat(leaf);
      } else {
        obj = options.plainObjects ? Object.create(null) : {};
        var cleanRoot = root.charAt(0) === "[" && root.charAt(root.length - 1) === "]" ? root.slice(1, -1) : root;
        var index = parseInt(cleanRoot, 10);
        if (!options.parseArrays && cleanRoot === "") {
          obj = {0: leaf};
        } else if (!isNaN(index) && root !== cleanRoot && String(index) === cleanRoot && index >= 0 && (options.parseArrays && index <= options.arrayLimit)) {
          obj = [];
          obj[index] = leaf;
        } else {
          obj[cleanRoot] = leaf;
        }
      }
      leaf = obj;
    }
    return leaf;
  };
  var parseKeys = function parseQueryStringKeys(givenKey, val, options, valuesParsed) {
    if (!givenKey) {
      return;
    }
    var key = options.allowDots ? givenKey.replace(/\.([^.[]+)/g, "[$1]") : givenKey;
    var brackets = /(\[[^[\]]*])/;
    var child = /(\[[^[\]]*])/g;
    var segment = options.depth > 0 && brackets.exec(key);
    var parent = segment ? key.slice(0, segment.index) : key;
    var keys = [];
    if (parent) {
      if (!options.plainObjects && has.call(Object.prototype, parent)) {
        if (!options.allowPrototypes) {
          return;
        }
      }
      keys.push(parent);
    }
    var i = 0;
    while (options.depth > 0 && (segment = child.exec(key)) !== null && i < options.depth) {
      i += 1;
      if (!options.plainObjects && has.call(Object.prototype, segment[1].slice(1, -1))) {
        if (!options.allowPrototypes) {
          return;
        }
      }
      keys.push(segment[1]);
    }
    if (segment) {
      keys.push("[" + key.slice(segment.index) + "]");
    }
    return parseObject(keys, val, options, valuesParsed);
  };
  var normalizeParseOptions = function normalizeParseOptions2(opts) {
    if (!opts) {
      return defaults;
    }
    if (opts.decoder !== null && opts.decoder !== void 0 && typeof opts.decoder !== "function") {
      throw new TypeError("Decoder has to be a function.");
    }
    if (typeof opts.charset !== "undefined" && opts.charset !== "utf-8" && opts.charset !== "iso-8859-1") {
      throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
    }
    var charset = typeof opts.charset === "undefined" ? defaults.charset : opts.charset;
    return {
      allowDots: typeof opts.allowDots === "undefined" ? defaults.allowDots : !!opts.allowDots,
      allowPrototypes: typeof opts.allowPrototypes === "boolean" ? opts.allowPrototypes : defaults.allowPrototypes,
      arrayLimit: typeof opts.arrayLimit === "number" ? opts.arrayLimit : defaults.arrayLimit,
      charset,
      charsetSentinel: typeof opts.charsetSentinel === "boolean" ? opts.charsetSentinel : defaults.charsetSentinel,
      comma: typeof opts.comma === "boolean" ? opts.comma : defaults.comma,
      decoder: typeof opts.decoder === "function" ? opts.decoder : defaults.decoder,
      delimiter: typeof opts.delimiter === "string" || utils.isRegExp(opts.delimiter) ? opts.delimiter : defaults.delimiter,
      depth: typeof opts.depth === "number" || opts.depth === false ? +opts.depth : defaults.depth,
      ignoreQueryPrefix: opts.ignoreQueryPrefix === true,
      interpretNumericEntities: typeof opts.interpretNumericEntities === "boolean" ? opts.interpretNumericEntities : defaults.interpretNumericEntities,
      parameterLimit: typeof opts.parameterLimit === "number" ? opts.parameterLimit : defaults.parameterLimit,
      parseArrays: opts.parseArrays !== false,
      plainObjects: typeof opts.plainObjects === "boolean" ? opts.plainObjects : defaults.plainObjects,
      strictNullHandling: typeof opts.strictNullHandling === "boolean" ? opts.strictNullHandling : defaults.strictNullHandling
    };
  };
  module2.exports = function(str, opts) {
    var options = normalizeParseOptions(opts);
    if (str === "" || str === null || typeof str === "undefined") {
      return options.plainObjects ? Object.create(null) : {};
    }
    var tempObj = typeof str === "string" ? parseValues(str, options) : str;
    var obj = options.plainObjects ? Object.create(null) : {};
    var keys = Object.keys(tempObj);
    for (var i = 0; i < keys.length; ++i) {
      var key = keys[i];
      var newObj = parseKeys(key, tempObj[key], options, typeof str === "string");
      obj = utils.merge(obj, newObj, options);
    }
    return utils.compact(obj);
  };
});

// node_modules/qs/lib/index.js
var require_lib = __commonJS((exports2, module2) => {
  "use strict";
  var stringify = require_stringify();
  var parse = require_parse();
  var formats = require_formats();
  module2.exports = {
    formats,
    parse,
    stringify
  };
});

// node_modules/requires-port/index.js
var require_requires_port = __commonJS((exports2, module2) => {
  "use strict";
  module2.exports = function required(port, protocol) {
    protocol = protocol.split(":")[0];
    port = +port;
    if (!port)
      return false;
    switch (protocol) {
      case "http":
      case "ws":
        return port !== 80;
      case "https":
      case "wss":
        return port !== 443;
      case "ftp":
        return port !== 21;
      case "gopher":
        return port !== 70;
      case "file":
        return false;
    }
    return port !== 0;
  };
});

// node_modules/querystringify/index.js
var require_querystringify = __commonJS((exports2) => {
  "use strict";
  var has = Object.prototype.hasOwnProperty;
  var undef;
  function decode(input) {
    try {
      return decodeURIComponent(input.replace(/\+/g, " "));
    } catch (e) {
      return null;
    }
  }
  function querystring(query) {
    var parser = /([^=?&]+)=?([^&]*)/g, result = {}, part;
    while (part = parser.exec(query)) {
      var key = decode(part[1]), value = decode(part[2]);
      if (key === null || value === null || key in result)
        continue;
      result[key] = value;
    }
    return result;
  }
  function querystringify(obj, prefix) {
    prefix = prefix || "";
    var pairs = [], value, key;
    if (typeof prefix !== "string")
      prefix = "?";
    for (key in obj) {
      if (has.call(obj, key)) {
        value = obj[key];
        if (!value && (value === null || value === undef || isNaN(value))) {
          value = "";
        }
        key = encodeURIComponent(key);
        value = encodeURIComponent(value);
        if (key === null || value === null)
          continue;
        pairs.push(key + "=" + value);
      }
    }
    return pairs.length ? prefix + pairs.join("&") : "";
  }
  exports2.stringify = querystringify;
  exports2.parse = querystring;
});

// node_modules/url-parse/index.js
var require_url_parse = __commonJS((exports2, module2) => {
  "use strict";
  var required = require_requires_port();
  var qs2 = require_querystringify();
  var slashes = /^[A-Za-z][A-Za-z0-9+-.]*:[\\/]+/;
  var protocolre = /^([a-z][a-z0-9.+-]*:)?([\\/]{1,})?([\S\s]*)/i;
  var whitespace = "[\\x09\\x0A\\x0B\\x0C\\x0D\\x20\\xA0\\u1680\\u180E\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200A\\u202F\\u205F\\u3000\\u2028\\u2029\\uFEFF]";
  var left = new RegExp("^" + whitespace + "+");
  function trimLeft(str) {
    return (str ? str : "").toString().replace(left, "");
  }
  var rules = [
    ["#", "hash"],
    ["?", "query"],
    function sanitize(address) {
      return address.replace("\\", "/");
    },
    ["/", "pathname"],
    ["@", "auth", 1],
    [NaN, "host", void 0, 1, 1],
    [/:(\d+)$/, "port", void 0, 1],
    [NaN, "hostname", void 0, 1, 1]
  ];
  var ignore = {hash: 1, query: 1};
  function lolcation(loc) {
    var globalVar;
    if (typeof window !== "undefined")
      globalVar = window;
    else if (typeof global !== "undefined")
      globalVar = global;
    else if (typeof self !== "undefined")
      globalVar = self;
    else
      globalVar = {};
    var location = globalVar.location || {};
    loc = loc || location;
    var finaldestination = {}, type = typeof loc, key;
    if (loc.protocol === "blob:") {
      finaldestination = new Url(unescape(loc.pathname), {});
    } else if (type === "string") {
      finaldestination = new Url(loc, {});
      for (key in ignore)
        delete finaldestination[key];
    } else if (type === "object") {
      for (key in loc) {
        if (key in ignore)
          continue;
        finaldestination[key] = loc[key];
      }
      if (finaldestination.slashes === void 0) {
        finaldestination.slashes = slashes.test(loc.href);
      }
    }
    return finaldestination;
  }
  function extractProtocol(address) {
    address = trimLeft(address);
    var match = protocolre.exec(address), protocol = match[1] ? match[1].toLowerCase() : "", slashes2 = !!(match[2] && match[2].length >= 2), rest = match[2] && match[2].length === 1 ? "/" + match[3] : match[3];
    return {
      protocol,
      slashes: slashes2,
      rest
    };
  }
  function resolve(relative, base) {
    if (relative === "")
      return base;
    var path = (base || "/").split("/").slice(0, -1).concat(relative.split("/")), i = path.length, last = path[i - 1], unshift = false, up = 0;
    while (i--) {
      if (path[i] === ".") {
        path.splice(i, 1);
      } else if (path[i] === "..") {
        path.splice(i, 1);
        up++;
      } else if (up) {
        if (i === 0)
          unshift = true;
        path.splice(i, 1);
        up--;
      }
    }
    if (unshift)
      path.unshift("");
    if (last === "." || last === "..")
      path.push("");
    return path.join("/");
  }
  function Url(address, location, parser) {
    address = trimLeft(address);
    if (!(this instanceof Url)) {
      return new Url(address, location, parser);
    }
    var relative, extracted, parse, instruction, index, key, instructions = rules.slice(), type = typeof location, url = this, i = 0;
    if (type !== "object" && type !== "string") {
      parser = location;
      location = null;
    }
    if (parser && typeof parser !== "function")
      parser = qs2.parse;
    location = lolcation(location);
    extracted = extractProtocol(address || "");
    relative = !extracted.protocol && !extracted.slashes;
    url.slashes = extracted.slashes || relative && location.slashes;
    url.protocol = extracted.protocol || location.protocol || "";
    address = extracted.rest;
    if (!extracted.slashes)
      instructions[3] = [/(.*)/, "pathname"];
    for (; i < instructions.length; i++) {
      instruction = instructions[i];
      if (typeof instruction === "function") {
        address = instruction(address);
        continue;
      }
      parse = instruction[0];
      key = instruction[1];
      if (parse !== parse) {
        url[key] = address;
      } else if (typeof parse === "string") {
        if (~(index = address.indexOf(parse))) {
          if (typeof instruction[2] === "number") {
            url[key] = address.slice(0, index);
            address = address.slice(index + instruction[2]);
          } else {
            url[key] = address.slice(index);
            address = address.slice(0, index);
          }
        }
      } else if (index = parse.exec(address)) {
        url[key] = index[1];
        address = address.slice(0, index.index);
      }
      url[key] = url[key] || (relative && instruction[3] ? location[key] || "" : "");
      if (instruction[4])
        url[key] = url[key].toLowerCase();
    }
    if (parser)
      url.query = parser(url.query);
    if (relative && location.slashes && url.pathname.charAt(0) !== "/" && (url.pathname !== "" || location.pathname !== "")) {
      url.pathname = resolve(url.pathname, location.pathname);
    }
    if (url.pathname.charAt(0) !== "/" && url.hostname) {
      url.pathname = "/" + url.pathname;
    }
    if (!required(url.port, url.protocol)) {
      url.host = url.hostname;
      url.port = "";
    }
    url.username = url.password = "";
    if (url.auth) {
      instruction = url.auth.split(":");
      url.username = instruction[0] || "";
      url.password = instruction[1] || "";
    }
    url.origin = url.protocol && url.host && url.protocol !== "file:" ? url.protocol + "//" + url.host : "null";
    url.href = url.toString();
  }
  function set(part, value, fn) {
    var url = this;
    switch (part) {
      case "query":
        if (typeof value === "string" && value.length) {
          value = (fn || qs2.parse)(value);
        }
        url[part] = value;
        break;
      case "port":
        url[part] = value;
        if (!required(value, url.protocol)) {
          url.host = url.hostname;
          url[part] = "";
        } else if (value) {
          url.host = url.hostname + ":" + value;
        }
        break;
      case "hostname":
        url[part] = value;
        if (url.port)
          value += ":" + url.port;
        url.host = value;
        break;
      case "host":
        url[part] = value;
        if (/:\d+$/.test(value)) {
          value = value.split(":");
          url.port = value.pop();
          url.hostname = value.join(":");
        } else {
          url.hostname = value;
          url.port = "";
        }
        break;
      case "protocol":
        url.protocol = value.toLowerCase();
        url.slashes = !fn;
        break;
      case "pathname":
      case "hash":
        if (value) {
          var char = part === "pathname" ? "/" : "#";
          url[part] = value.charAt(0) !== char ? char + value : value;
        } else {
          url[part] = value;
        }
        break;
      default:
        url[part] = value;
    }
    for (var i = 0; i < rules.length; i++) {
      var ins = rules[i];
      if (ins[4])
        url[ins[1]] = url[ins[1]].toLowerCase();
    }
    url.origin = url.protocol && url.host && url.protocol !== "file:" ? url.protocol + "//" + url.host : "null";
    url.href = url.toString();
    return url;
  }
  function toString(stringify) {
    if (!stringify || typeof stringify !== "function")
      stringify = qs2.stringify;
    var query, url = this, protocol = url.protocol;
    if (protocol && protocol.charAt(protocol.length - 1) !== ":")
      protocol += ":";
    var result = protocol + (url.slashes ? "//" : "");
    if (url.username) {
      result += url.username;
      if (url.password)
        result += ":" + url.password;
      result += "@";
    }
    result += url.host + url.pathname;
    query = typeof url.query === "object" ? stringify(url.query) : url.query;
    if (query)
      result += query.charAt(0) !== "?" ? "?" + query : query;
    if (url.hash)
      result += url.hash;
    return result;
  }
  Url.prototype = {set, toString};
  Url.extractProtocol = extractProtocol;
  Url.location = lolcation;
  Url.trimLeft = trimLeft;
  Url.qs = qs2;
  module2.exports = Url;
});

// testing/bundle_execution_helper.ts
__markAsModule(exports);
__export(exports, {
  executeFormulaOrSyncWithRawParams: () => executeFormulaOrSyncWithRawParams,
  executeSyncFormulaWithoutValidation: () => executeSyncFormulaWithoutValidation,
  findFormula: () => findFormula,
  findSyncFormula: () => findSyncFormula,
  tryFindFormula: () => tryFindFormula,
  tryFindSyncFormula: () => tryFindSyncFormula,
  wrapError: () => wrapError
});

// api_types.ts
var Type;
(function(Type2) {
  Type2[Type2["string"] = 0] = "string";
  Type2[Type2["number"] = 1] = "number";
  Type2[Type2["object"] = 2] = "object";
  Type2[Type2["boolean"] = 3] = "boolean";
  Type2[Type2["date"] = 4] = "date";
  Type2[Type2["html"] = 5] = "html";
  Type2[Type2["image"] = 6] = "image";
})(Type || (Type = {}));
function isArrayType(obj) {
  return obj && obj.type === "array" && typeof obj.items === "number";
}
var PrecannedDateRange;
(function(PrecannedDateRange2) {
  PrecannedDateRange2["Yesterday"] = "yesterday";
  PrecannedDateRange2["Last7Days"] = "last_7_days";
  PrecannedDateRange2["Last30Days"] = "last_30_days";
  PrecannedDateRange2["LastWeek"] = "last_week";
  PrecannedDateRange2["LastMonth"] = "last_month";
  PrecannedDateRange2["Last3Months"] = "last_3_months";
  PrecannedDateRange2["Last6Months"] = "last_6_months";
  PrecannedDateRange2["LastYear"] = "last_year";
  PrecannedDateRange2["Today"] = "today";
  PrecannedDateRange2["ThisWeek"] = "this_week";
  PrecannedDateRange2["ThisWeekStart"] = "this_week_start";
  PrecannedDateRange2["ThisMonth"] = "this_month";
  PrecannedDateRange2["ThisMonthStart"] = "this_month_start";
  PrecannedDateRange2["ThisYearStart"] = "this_year_start";
  PrecannedDateRange2["YearToDate"] = "year_to_date";
  PrecannedDateRange2["ThisYear"] = "this_year";
  PrecannedDateRange2["Tomorrow"] = "tomorrow";
  PrecannedDateRange2["Next7Days"] = "next_7_days";
  PrecannedDateRange2["Next30Days"] = "next_30_days";
  PrecannedDateRange2["NextWeek"] = "next_week";
  PrecannedDateRange2["NextMonth"] = "next_month";
  PrecannedDateRange2["Next3Months"] = "next_3_months";
  PrecannedDateRange2["Next6Months"] = "next_6_months";
  PrecannedDateRange2["NextYear"] = "next_year";
  PrecannedDateRange2["Everything"] = "everything";
})(PrecannedDateRange || (PrecannedDateRange = {}));

// schema.ts
var import_pascalcase = __toModule(require_pascalcase());
var ValueType;
(function(ValueType2) {
  ValueType2["Boolean"] = "boolean";
  ValueType2["Number"] = "number";
  ValueType2["String"] = "string";
  ValueType2["Array"] = "array";
  ValueType2["Object"] = "object";
  ValueType2["Date"] = "date";
  ValueType2["Time"] = "time";
  ValueType2["DateTime"] = "datetime";
  ValueType2["Duration"] = "duration";
  ValueType2["Person"] = "person";
  ValueType2["Percent"] = "percent";
  ValueType2["Currency"] = "currency";
  ValueType2["Image"] = "image";
  ValueType2["Url"] = "url";
  ValueType2["Markdown"] = "markdown";
  ValueType2["Html"] = "html";
  ValueType2["Embed"] = "embed";
  ValueType2["Reference"] = "reference";
  ValueType2["ImageAttachment"] = "imageAttachment";
  ValueType2["Attachment"] = "attachment";
  ValueType2["Slider"] = "slider";
  ValueType2["Scale"] = "scale";
})(ValueType || (ValueType = {}));
var StringHintValueTypes = [
  ValueType.Attachment,
  ValueType.Date,
  ValueType.Time,
  ValueType.DateTime,
  ValueType.Duration,
  ValueType.Embed,
  ValueType.Html,
  ValueType.Image,
  ValueType.ImageAttachment,
  ValueType.Markdown,
  ValueType.Url
];
var NumberHintValueTypes = [
  ValueType.Date,
  ValueType.Time,
  ValueType.DateTime,
  ValueType.Percent,
  ValueType.Currency,
  ValueType.Slider,
  ValueType.Scale
];
var ObjectHintValueTypes = [ValueType.Person, ValueType.Reference];
var CurrencyFormat;
(function(CurrencyFormat2) {
  CurrencyFormat2["Currency"] = "currency";
  CurrencyFormat2["Accounting"] = "accounting";
  CurrencyFormat2["Financial"] = "financial";
})(CurrencyFormat || (CurrencyFormat = {}));
var DurationUnit;
(function(DurationUnit2) {
  DurationUnit2["Days"] = "days";
  DurationUnit2["Hours"] = "hours";
  DurationUnit2["Minutes"] = "minutes";
  DurationUnit2["Seconds"] = "seconds";
})(DurationUnit || (DurationUnit = {}));
var AttributionNodeType;
(function(AttributionNodeType2) {
  AttributionNodeType2[AttributionNodeType2["Text"] = 1] = "Text";
  AttributionNodeType2[AttributionNodeType2["Link"] = 2] = "Link";
  AttributionNodeType2[AttributionNodeType2["Image"] = 3] = "Image";
})(AttributionNodeType || (AttributionNodeType = {}));
var SchemaIdPrefix;
(function(SchemaIdPrefix2) {
  SchemaIdPrefix2["Identity"] = "I";
})(SchemaIdPrefix || (SchemaIdPrefix = {}));

// handler_templates.ts
var import_clone = __toModule(require_clone());
var import_compile = __toModule(require_compile());

// helpers/url.ts
var import_qs = __toModule(require_lib());
var import_url_parse = __toModule(require_url_parse());

// helpers/ensure.ts
function ensureUnreachable(value, message) {
  throw new Error(message || `Unreachable code hit with value ${String(value)}`);
}

// helpers/object_utils.ts
function isDefined(obj) {
  return !isNil(obj);
}
function isNil(obj) {
  return typeof obj === "undefined" || obj === null;
}

// testing/coercion.ts
function coerceParams(formula, args) {
  const {parameters, varargParameters} = formula;
  const coerced = [];
  let varargIndex = 0;
  for (let i = 0; i < args.length; i++) {
    const paramDef = parameters[i];
    if (paramDef) {
      coerced.push(coerceParamValue(paramDef, args[i]));
    } else {
      if (varargParameters) {
        const varargDef = varargParameters[varargIndex];
        coerced.push(coerceParamValue(varargDef, args[i]));
        varargIndex = (varargIndex + 1) % varargParameters.length;
      } else {
        coerced.push(args[i]);
      }
    }
  }
  return coerced;
}
function coerceParamValue(paramDef, paramValue) {
  if (!isDefined(paramValue)) {
    return paramValue;
  }
  if (isArrayType(paramDef.type)) {
    const valuesString = paramValue;
    const value = valuesString.length ? valuesString.split(",") : [];
    return value.map((item) => coerceParam(paramDef.type.items, item.trim()));
  }
  return coerceParam(paramDef.type, paramValue);
}
function coerceParam(type, value) {
  switch (type) {
    case Type.boolean:
      return (value || "").toLowerCase() === "true";
    case Type.date:
      return new Date(value);
    case Type.number:
      return Number(value);
    case Type.object:
      return JSON.parse(value);
    case Type.html:
    case Type.image:
    case Type.string:
      return value;
    default:
      return ensureUnreachable(type);
  }
}

// testing/bundle_execution_helper.ts
async function executeSyncFormulaWithoutValidation(formula, params, context, maxIterations) {
  const result = [];
  let iterations = 1;
  do {
    if (iterations > maxIterations) {
      throw new Error(`Sync is still running after ${maxIterations} iterations, this is likely due to an infinite loop. If more iterations are needed, use the maxIterations option.`);
    }
    let response;
    try {
      response = await formula.execute(params, context);
    } catch (err) {
      throw wrapError(err);
    }
    result.push(...response.result);
    context.sync.continuation = response.continuation;
    iterations++;
  } while (context.sync.continuation);
  return result;
}
async function executeFormulaOrSyncWithRawParams(manifest, formulaName, rawParams, context) {
  try {
    const formula = tryFindFormula(manifest, formulaName);
    if (formula) {
      const params = coerceParams(formula, rawParams);
      return await formula.execute(params, context);
    }
    const syncFormula = tryFindSyncFormula(manifest, formulaName);
    if (syncFormula) {
      const params = coerceParams(syncFormula, rawParams);
      return await executeSyncFormulaWithoutValidation(syncFormula, params, context, 100);
    }
  } catch (err) {
    throw wrapError(err);
  }
}
function findFormula(packDef, formulaNameWithNamespace) {
  const packFormulas = packDef.formulas;
  if (!packFormulas) {
    throw new Error(`Pack definition for ${packDef.name} (id ${packDef.id}) has no formulas.`);
  }
  const [namespace, name] = formulaNameWithNamespace.split("::");
  if (!(namespace && name)) {
    throw new Error(`Formula names must be specified as FormulaNamespace::FormulaName, but got "${formulaNameWithNamespace}".`);
  }
  const formulas = Array.isArray(packFormulas) ? packFormulas : packFormulas[namespace];
  if (!formulas || !formulas.length) {
    throw new Error(`Pack definition for ${packDef.name} (id ${packDef.id}) has no formulas for namespace "${namespace}".`);
  }
  for (const formula of formulas) {
    if (formula.name === name) {
      return formula;
    }
  }
  throw new Error(`Pack definition for ${packDef.name} (id ${packDef.id}) has no formula "${name}" in namespace "${namespace}".`);
}
function findSyncFormula(packDef, syncFormulaName) {
  if (!packDef.syncTables) {
    throw new Error(`Pack definition for ${packDef.name} (id ${packDef.id}) has no sync tables.`);
  }
  for (const syncTable of packDef.syncTables) {
    const syncFormula = syncTable.getter;
    if (syncFormula.name === syncFormulaName) {
      return syncFormula;
    }
  }
  throw new Error(`Pack definition for ${packDef.name} (id ${packDef.id}) has no sync formula "${syncFormulaName}" in its sync tables.`);
}
function tryFindFormula(packDef, formulaNameWithNamespace) {
  try {
    return findFormula(packDef, formulaNameWithNamespace);
  } catch (_err) {
  }
}
function tryFindSyncFormula(packDef, syncFormulaName) {
  try {
    return findSyncFormula(packDef, syncFormulaName);
  } catch (_err) {
  }
}
function wrapError(err) {
  if (err.name === "TypeError" && err.message === `Cannot read property 'body' of undefined`) {
    err.message += "\nThis means your formula was invoked with a mock fetcher that had no response configured.\nThis usually means you invoked your formula from the commandline with `coda execute` but forgot to add the --fetch flag to actually fetch from the remote API.";
  }
  return err;
}
