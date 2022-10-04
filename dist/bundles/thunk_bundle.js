"use strict";
var module = module || {};
module.exports = (() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // node_modules/base64-js/index.js
  var require_base64_js = __commonJS({
    "node_modules/base64-js/index.js"(exports) {
      "use strict";
      init_buffer_shim();
      exports.byteLength = byteLength;
      exports.toByteArray = toByteArray;
      exports.fromByteArray = fromByteArray;
      var lookup = [];
      var revLookup = [];
      var Arr = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
      var code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
      for (i = 0, len = code.length; i < len; ++i) {
        lookup[i] = code[i];
        revLookup[code.charCodeAt(i)] = i;
      }
      var i;
      var len;
      revLookup["-".charCodeAt(0)] = 62;
      revLookup["_".charCodeAt(0)] = 63;
      function getLens(b64) {
        var len2 = b64.length;
        if (len2 % 4 > 0) {
          throw new Error("Invalid string. Length must be a multiple of 4");
        }
        var validLen = b64.indexOf("=");
        if (validLen === -1)
          validLen = len2;
        var placeHoldersLen = validLen === len2 ? 0 : 4 - validLen % 4;
        return [validLen, placeHoldersLen];
      }
      __name(getLens, "getLens");
      function byteLength(b64) {
        var lens = getLens(b64);
        var validLen = lens[0];
        var placeHoldersLen = lens[1];
        return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
      }
      __name(byteLength, "byteLength");
      function _byteLength(b64, validLen, placeHoldersLen) {
        return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
      }
      __name(_byteLength, "_byteLength");
      function toByteArray(b64) {
        var tmp;
        var lens = getLens(b64);
        var validLen = lens[0];
        var placeHoldersLen = lens[1];
        var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));
        var curByte = 0;
        var len2 = placeHoldersLen > 0 ? validLen - 4 : validLen;
        var i2;
        for (i2 = 0; i2 < len2; i2 += 4) {
          tmp = revLookup[b64.charCodeAt(i2)] << 18 | revLookup[b64.charCodeAt(i2 + 1)] << 12 | revLookup[b64.charCodeAt(i2 + 2)] << 6 | revLookup[b64.charCodeAt(i2 + 3)];
          arr[curByte++] = tmp >> 16 & 255;
          arr[curByte++] = tmp >> 8 & 255;
          arr[curByte++] = tmp & 255;
        }
        if (placeHoldersLen === 2) {
          tmp = revLookup[b64.charCodeAt(i2)] << 2 | revLookup[b64.charCodeAt(i2 + 1)] >> 4;
          arr[curByte++] = tmp & 255;
        }
        if (placeHoldersLen === 1) {
          tmp = revLookup[b64.charCodeAt(i2)] << 10 | revLookup[b64.charCodeAt(i2 + 1)] << 4 | revLookup[b64.charCodeAt(i2 + 2)] >> 2;
          arr[curByte++] = tmp >> 8 & 255;
          arr[curByte++] = tmp & 255;
        }
        return arr;
      }
      __name(toByteArray, "toByteArray");
      function tripletToBase64(num) {
        return lookup[num >> 18 & 63] + lookup[num >> 12 & 63] + lookup[num >> 6 & 63] + lookup[num & 63];
      }
      __name(tripletToBase64, "tripletToBase64");
      function encodeChunk(uint8, start, end) {
        var tmp;
        var output = [];
        for (var i2 = start; i2 < end; i2 += 3) {
          tmp = (uint8[i2] << 16 & 16711680) + (uint8[i2 + 1] << 8 & 65280) + (uint8[i2 + 2] & 255);
          output.push(tripletToBase64(tmp));
        }
        return output.join("");
      }
      __name(encodeChunk, "encodeChunk");
      function fromByteArray(uint8) {
        var tmp;
        var len2 = uint8.length;
        var extraBytes = len2 % 3;
        var parts = [];
        var maxChunkLength = 16383;
        for (var i2 = 0, len22 = len2 - extraBytes; i2 < len22; i2 += maxChunkLength) {
          parts.push(encodeChunk(uint8, i2, i2 + maxChunkLength > len22 ? len22 : i2 + maxChunkLength));
        }
        if (extraBytes === 1) {
          tmp = uint8[len2 - 1];
          parts.push(
            lookup[tmp >> 2] + lookup[tmp << 4 & 63] + "=="
          );
        } else if (extraBytes === 2) {
          tmp = (uint8[len2 - 2] << 8) + uint8[len2 - 1];
          parts.push(
            lookup[tmp >> 10] + lookup[tmp >> 4 & 63] + lookup[tmp << 2 & 63] + "="
          );
        }
        return parts.join("");
      }
      __name(fromByteArray, "fromByteArray");
    }
  });

  // node_modules/ieee754/index.js
  var require_ieee754 = __commonJS({
    "node_modules/ieee754/index.js"(exports) {
      init_buffer_shim();
      exports.read = function(buffer, offset, isLE, mLen, nBytes) {
        var e, m;
        var eLen = nBytes * 8 - mLen - 1;
        var eMax = (1 << eLen) - 1;
        var eBias = eMax >> 1;
        var nBits = -7;
        var i = isLE ? nBytes - 1 : 0;
        var d = isLE ? -1 : 1;
        var s = buffer[offset + i];
        i += d;
        e = s & (1 << -nBits) - 1;
        s >>= -nBits;
        nBits += eLen;
        for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {
        }
        m = e & (1 << -nBits) - 1;
        e >>= -nBits;
        nBits += mLen;
        for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {
        }
        if (e === 0) {
          e = 1 - eBias;
        } else if (e === eMax) {
          return m ? NaN : (s ? -1 : 1) * Infinity;
        } else {
          m = m + Math.pow(2, mLen);
          e = e - eBias;
        }
        return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
      };
      exports.write = function(buffer, value, offset, isLE, mLen, nBytes) {
        var e, m, c;
        var eLen = nBytes * 8 - mLen - 1;
        var eMax = (1 << eLen) - 1;
        var eBias = eMax >> 1;
        var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
        var i = isLE ? 0 : nBytes - 1;
        var d = isLE ? 1 : -1;
        var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
        value = Math.abs(value);
        if (isNaN(value) || value === Infinity) {
          m = isNaN(value) ? 1 : 0;
          e = eMax;
        } else {
          e = Math.floor(Math.log(value) / Math.LN2);
          if (value * (c = Math.pow(2, -e)) < 1) {
            e--;
            c *= 2;
          }
          if (e + eBias >= 1) {
            value += rt / c;
          } else {
            value += rt * Math.pow(2, 1 - eBias);
          }
          if (value * c >= 2) {
            e++;
            c /= 2;
          }
          if (e + eBias >= eMax) {
            m = 0;
            e = eMax;
          } else if (e + eBias >= 1) {
            m = (value * c - 1) * Math.pow(2, mLen);
            e = e + eBias;
          } else {
            m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
            e = 0;
          }
        }
        for (; mLen >= 8; buffer[offset + i] = m & 255, i += d, m /= 256, mLen -= 8) {
        }
        e = e << mLen | m;
        eLen += mLen;
        for (; eLen > 0; buffer[offset + i] = e & 255, i += d, e /= 256, eLen -= 8) {
        }
        buffer[offset + i - d] |= s * 128;
      };
    }
  });

  // node_modules/buffer/index.js
  var require_buffer = __commonJS({
    "node_modules/buffer/index.js"(exports) {
      "use strict";
      init_buffer_shim();
      var base64 = require_base64_js();
      var ieee754 = require_ieee754();
      var customInspectSymbol = typeof Symbol === "function" && typeof Symbol["for"] === "function" ? Symbol["for"]("nodejs.util.inspect.custom") : null;
      exports.Buffer = Buffer4;
      exports.SlowBuffer = SlowBuffer;
      exports.INSPECT_MAX_BYTES = 50;
      var K_MAX_LENGTH = 2147483647;
      exports.kMaxLength = K_MAX_LENGTH;
      Buffer4.TYPED_ARRAY_SUPPORT = typedArraySupport();
      if (!Buffer4.TYPED_ARRAY_SUPPORT && typeof console !== "undefined" && typeof console.error === "function") {
        console.error(
          "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
        );
      }
      function typedArraySupport() {
        try {
          const arr = new Uint8Array(1);
          const proto = { foo: function() {
            return 42;
          } };
          Object.setPrototypeOf(proto, Uint8Array.prototype);
          Object.setPrototypeOf(arr, proto);
          return arr.foo() === 42;
        } catch (e) {
          return false;
        }
      }
      __name(typedArraySupport, "typedArraySupport");
      Object.defineProperty(Buffer4.prototype, "parent", {
        enumerable: true,
        get: function() {
          if (!Buffer4.isBuffer(this))
            return void 0;
          return this.buffer;
        }
      });
      Object.defineProperty(Buffer4.prototype, "offset", {
        enumerable: true,
        get: function() {
          if (!Buffer4.isBuffer(this))
            return void 0;
          return this.byteOffset;
        }
      });
      function createBuffer(length) {
        if (length > K_MAX_LENGTH) {
          throw new RangeError('The value "' + length + '" is invalid for option "size"');
        }
        const buf = new Uint8Array(length);
        Object.setPrototypeOf(buf, Buffer4.prototype);
        return buf;
      }
      __name(createBuffer, "createBuffer");
      function Buffer4(arg, encodingOrOffset, length) {
        if (typeof arg === "number") {
          if (typeof encodingOrOffset === "string") {
            throw new TypeError(
              'The "string" argument must be of type string. Received type number'
            );
          }
          return allocUnsafe(arg);
        }
        return from(arg, encodingOrOffset, length);
      }
      __name(Buffer4, "Buffer");
      Buffer4.poolSize = 8192;
      function from(value, encodingOrOffset, length) {
        if (typeof value === "string") {
          return fromString(value, encodingOrOffset);
        }
        if (ArrayBuffer.isView(value)) {
          return fromArrayView(value);
        }
        if (value == null) {
          throw new TypeError(
            "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value
          );
        }
        if (isInstance(value, ArrayBuffer) || value && isInstance(value.buffer, ArrayBuffer)) {
          return fromArrayBuffer(value, encodingOrOffset, length);
        }
        if (typeof SharedArrayBuffer !== "undefined" && (isInstance(value, SharedArrayBuffer) || value && isInstance(value.buffer, SharedArrayBuffer))) {
          return fromArrayBuffer(value, encodingOrOffset, length);
        }
        if (typeof value === "number") {
          throw new TypeError(
            'The "value" argument must not be of type number. Received type number'
          );
        }
        const valueOf = value.valueOf && value.valueOf();
        if (valueOf != null && valueOf !== value) {
          return Buffer4.from(valueOf, encodingOrOffset, length);
        }
        const b = fromObject(value);
        if (b)
          return b;
        if (typeof Symbol !== "undefined" && Symbol.toPrimitive != null && typeof value[Symbol.toPrimitive] === "function") {
          return Buffer4.from(value[Symbol.toPrimitive]("string"), encodingOrOffset, length);
        }
        throw new TypeError(
          "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value
        );
      }
      __name(from, "from");
      Buffer4.from = function(value, encodingOrOffset, length) {
        return from(value, encodingOrOffset, length);
      };
      Object.setPrototypeOf(Buffer4.prototype, Uint8Array.prototype);
      Object.setPrototypeOf(Buffer4, Uint8Array);
      function assertSize(size) {
        if (typeof size !== "number") {
          throw new TypeError('"size" argument must be of type number');
        } else if (size < 0) {
          throw new RangeError('The value "' + size + '" is invalid for option "size"');
        }
      }
      __name(assertSize, "assertSize");
      function alloc(size, fill, encoding) {
        assertSize(size);
        if (size <= 0) {
          return createBuffer(size);
        }
        if (fill !== void 0) {
          return typeof encoding === "string" ? createBuffer(size).fill(fill, encoding) : createBuffer(size).fill(fill);
        }
        return createBuffer(size);
      }
      __name(alloc, "alloc");
      Buffer4.alloc = function(size, fill, encoding) {
        return alloc(size, fill, encoding);
      };
      function allocUnsafe(size) {
        assertSize(size);
        return createBuffer(size < 0 ? 0 : checked(size) | 0);
      }
      __name(allocUnsafe, "allocUnsafe");
      Buffer4.allocUnsafe = function(size) {
        return allocUnsafe(size);
      };
      Buffer4.allocUnsafeSlow = function(size) {
        return allocUnsafe(size);
      };
      function fromString(string, encoding) {
        if (typeof encoding !== "string" || encoding === "") {
          encoding = "utf8";
        }
        if (!Buffer4.isEncoding(encoding)) {
          throw new TypeError("Unknown encoding: " + encoding);
        }
        const length = byteLength(string, encoding) | 0;
        let buf = createBuffer(length);
        const actual = buf.write(string, encoding);
        if (actual !== length) {
          buf = buf.slice(0, actual);
        }
        return buf;
      }
      __name(fromString, "fromString");
      function fromArrayLike(array) {
        const length = array.length < 0 ? 0 : checked(array.length) | 0;
        const buf = createBuffer(length);
        for (let i = 0; i < length; i += 1) {
          buf[i] = array[i] & 255;
        }
        return buf;
      }
      __name(fromArrayLike, "fromArrayLike");
      function fromArrayView(arrayView) {
        if (isInstance(arrayView, Uint8Array)) {
          const copy = new Uint8Array(arrayView);
          return fromArrayBuffer(copy.buffer, copy.byteOffset, copy.byteLength);
        }
        return fromArrayLike(arrayView);
      }
      __name(fromArrayView, "fromArrayView");
      function fromArrayBuffer(array, byteOffset, length) {
        if (byteOffset < 0 || array.byteLength < byteOffset) {
          throw new RangeError('"offset" is outside of buffer bounds');
        }
        if (array.byteLength < byteOffset + (length || 0)) {
          throw new RangeError('"length" is outside of buffer bounds');
        }
        let buf;
        if (byteOffset === void 0 && length === void 0) {
          buf = new Uint8Array(array);
        } else if (length === void 0) {
          buf = new Uint8Array(array, byteOffset);
        } else {
          buf = new Uint8Array(array, byteOffset, length);
        }
        Object.setPrototypeOf(buf, Buffer4.prototype);
        return buf;
      }
      __name(fromArrayBuffer, "fromArrayBuffer");
      function fromObject(obj) {
        if (Buffer4.isBuffer(obj)) {
          const len = checked(obj.length) | 0;
          const buf = createBuffer(len);
          if (buf.length === 0) {
            return buf;
          }
          obj.copy(buf, 0, 0, len);
          return buf;
        }
        if (obj.length !== void 0) {
          if (typeof obj.length !== "number" || numberIsNaN(obj.length)) {
            return createBuffer(0);
          }
          return fromArrayLike(obj);
        }
        if (obj.type === "Buffer" && Array.isArray(obj.data)) {
          return fromArrayLike(obj.data);
        }
      }
      __name(fromObject, "fromObject");
      function checked(length) {
        if (length >= K_MAX_LENGTH) {
          throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + K_MAX_LENGTH.toString(16) + " bytes");
        }
        return length | 0;
      }
      __name(checked, "checked");
      function SlowBuffer(length) {
        if (+length != length) {
          length = 0;
        }
        return Buffer4.alloc(+length);
      }
      __name(SlowBuffer, "SlowBuffer");
      Buffer4.isBuffer = /* @__PURE__ */ __name(function isBuffer(b) {
        return b != null && b._isBuffer === true && b !== Buffer4.prototype;
      }, "isBuffer");
      Buffer4.compare = /* @__PURE__ */ __name(function compare(a, b) {
        if (isInstance(a, Uint8Array))
          a = Buffer4.from(a, a.offset, a.byteLength);
        if (isInstance(b, Uint8Array))
          b = Buffer4.from(b, b.offset, b.byteLength);
        if (!Buffer4.isBuffer(a) || !Buffer4.isBuffer(b)) {
          throw new TypeError(
            'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
          );
        }
        if (a === b)
          return 0;
        let x = a.length;
        let y = b.length;
        for (let i = 0, len = Math.min(x, y); i < len; ++i) {
          if (a[i] !== b[i]) {
            x = a[i];
            y = b[i];
            break;
          }
        }
        if (x < y)
          return -1;
        if (y < x)
          return 1;
        return 0;
      }, "compare");
      Buffer4.isEncoding = /* @__PURE__ */ __name(function isEncoding(encoding) {
        switch (String(encoding).toLowerCase()) {
          case "hex":
          case "utf8":
          case "utf-8":
          case "ascii":
          case "latin1":
          case "binary":
          case "base64":
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return true;
          default:
            return false;
        }
      }, "isEncoding");
      Buffer4.concat = /* @__PURE__ */ __name(function concat(list, length) {
        if (!Array.isArray(list)) {
          throw new TypeError('"list" argument must be an Array of Buffers');
        }
        if (list.length === 0) {
          return Buffer4.alloc(0);
        }
        let i;
        if (length === void 0) {
          length = 0;
          for (i = 0; i < list.length; ++i) {
            length += list[i].length;
          }
        }
        const buffer = Buffer4.allocUnsafe(length);
        let pos = 0;
        for (i = 0; i < list.length; ++i) {
          let buf = list[i];
          if (isInstance(buf, Uint8Array)) {
            if (pos + buf.length > buffer.length) {
              if (!Buffer4.isBuffer(buf))
                buf = Buffer4.from(buf);
              buf.copy(buffer, pos);
            } else {
              Uint8Array.prototype.set.call(
                buffer,
                buf,
                pos
              );
            }
          } else if (!Buffer4.isBuffer(buf)) {
            throw new TypeError('"list" argument must be an Array of Buffers');
          } else {
            buf.copy(buffer, pos);
          }
          pos += buf.length;
        }
        return buffer;
      }, "concat");
      function byteLength(string, encoding) {
        if (Buffer4.isBuffer(string)) {
          return string.length;
        }
        if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
          return string.byteLength;
        }
        if (typeof string !== "string") {
          throw new TypeError(
            'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof string
          );
        }
        const len = string.length;
        const mustMatch = arguments.length > 2 && arguments[2] === true;
        if (!mustMatch && len === 0)
          return 0;
        let loweredCase = false;
        for (; ; ) {
          switch (encoding) {
            case "ascii":
            case "latin1":
            case "binary":
              return len;
            case "utf8":
            case "utf-8":
              return utf8ToBytes(string).length;
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return len * 2;
            case "hex":
              return len >>> 1;
            case "base64":
              return base64ToBytes(string).length;
            default:
              if (loweredCase) {
                return mustMatch ? -1 : utf8ToBytes(string).length;
              }
              encoding = ("" + encoding).toLowerCase();
              loweredCase = true;
          }
        }
      }
      __name(byteLength, "byteLength");
      Buffer4.byteLength = byteLength;
      function slowToString(encoding, start, end) {
        let loweredCase = false;
        if (start === void 0 || start < 0) {
          start = 0;
        }
        if (start > this.length) {
          return "";
        }
        if (end === void 0 || end > this.length) {
          end = this.length;
        }
        if (end <= 0) {
          return "";
        }
        end >>>= 0;
        start >>>= 0;
        if (end <= start) {
          return "";
        }
        if (!encoding)
          encoding = "utf8";
        while (true) {
          switch (encoding) {
            case "hex":
              return hexSlice(this, start, end);
            case "utf8":
            case "utf-8":
              return utf8Slice(this, start, end);
            case "ascii":
              return asciiSlice(this, start, end);
            case "latin1":
            case "binary":
              return latin1Slice(this, start, end);
            case "base64":
              return base64Slice(this, start, end);
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return utf16leSlice(this, start, end);
            default:
              if (loweredCase)
                throw new TypeError("Unknown encoding: " + encoding);
              encoding = (encoding + "").toLowerCase();
              loweredCase = true;
          }
        }
      }
      __name(slowToString, "slowToString");
      Buffer4.prototype._isBuffer = true;
      function swap(b, n, m) {
        const i = b[n];
        b[n] = b[m];
        b[m] = i;
      }
      __name(swap, "swap");
      Buffer4.prototype.swap16 = /* @__PURE__ */ __name(function swap16() {
        const len = this.length;
        if (len % 2 !== 0) {
          throw new RangeError("Buffer size must be a multiple of 16-bits");
        }
        for (let i = 0; i < len; i += 2) {
          swap(this, i, i + 1);
        }
        return this;
      }, "swap16");
      Buffer4.prototype.swap32 = /* @__PURE__ */ __name(function swap32() {
        const len = this.length;
        if (len % 4 !== 0) {
          throw new RangeError("Buffer size must be a multiple of 32-bits");
        }
        for (let i = 0; i < len; i += 4) {
          swap(this, i, i + 3);
          swap(this, i + 1, i + 2);
        }
        return this;
      }, "swap32");
      Buffer4.prototype.swap64 = /* @__PURE__ */ __name(function swap64() {
        const len = this.length;
        if (len % 8 !== 0) {
          throw new RangeError("Buffer size must be a multiple of 64-bits");
        }
        for (let i = 0; i < len; i += 8) {
          swap(this, i, i + 7);
          swap(this, i + 1, i + 6);
          swap(this, i + 2, i + 5);
          swap(this, i + 3, i + 4);
        }
        return this;
      }, "swap64");
      Buffer4.prototype.toString = /* @__PURE__ */ __name(function toString() {
        const length = this.length;
        if (length === 0)
          return "";
        if (arguments.length === 0)
          return utf8Slice(this, 0, length);
        return slowToString.apply(this, arguments);
      }, "toString");
      Buffer4.prototype.toLocaleString = Buffer4.prototype.toString;
      Buffer4.prototype.equals = /* @__PURE__ */ __name(function equals(b) {
        if (!Buffer4.isBuffer(b))
          throw new TypeError("Argument must be a Buffer");
        if (this === b)
          return true;
        return Buffer4.compare(this, b) === 0;
      }, "equals");
      Buffer4.prototype.inspect = /* @__PURE__ */ __name(function inspect() {
        let str = "";
        const max = exports.INSPECT_MAX_BYTES;
        str = this.toString("hex", 0, max).replace(/(.{2})/g, "$1 ").trim();
        if (this.length > max)
          str += " ... ";
        return "<Buffer " + str + ">";
      }, "inspect");
      if (customInspectSymbol) {
        Buffer4.prototype[customInspectSymbol] = Buffer4.prototype.inspect;
      }
      Buffer4.prototype.compare = /* @__PURE__ */ __name(function compare(target, start, end, thisStart, thisEnd) {
        if (isInstance(target, Uint8Array)) {
          target = Buffer4.from(target, target.offset, target.byteLength);
        }
        if (!Buffer4.isBuffer(target)) {
          throw new TypeError(
            'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof target
          );
        }
        if (start === void 0) {
          start = 0;
        }
        if (end === void 0) {
          end = target ? target.length : 0;
        }
        if (thisStart === void 0) {
          thisStart = 0;
        }
        if (thisEnd === void 0) {
          thisEnd = this.length;
        }
        if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
          throw new RangeError("out of range index");
        }
        if (thisStart >= thisEnd && start >= end) {
          return 0;
        }
        if (thisStart >= thisEnd) {
          return -1;
        }
        if (start >= end) {
          return 1;
        }
        start >>>= 0;
        end >>>= 0;
        thisStart >>>= 0;
        thisEnd >>>= 0;
        if (this === target)
          return 0;
        let x = thisEnd - thisStart;
        let y = end - start;
        const len = Math.min(x, y);
        const thisCopy = this.slice(thisStart, thisEnd);
        const targetCopy = target.slice(start, end);
        for (let i = 0; i < len; ++i) {
          if (thisCopy[i] !== targetCopy[i]) {
            x = thisCopy[i];
            y = targetCopy[i];
            break;
          }
        }
        if (x < y)
          return -1;
        if (y < x)
          return 1;
        return 0;
      }, "compare");
      function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
        if (buffer.length === 0)
          return -1;
        if (typeof byteOffset === "string") {
          encoding = byteOffset;
          byteOffset = 0;
        } else if (byteOffset > 2147483647) {
          byteOffset = 2147483647;
        } else if (byteOffset < -2147483648) {
          byteOffset = -2147483648;
        }
        byteOffset = +byteOffset;
        if (numberIsNaN(byteOffset)) {
          byteOffset = dir ? 0 : buffer.length - 1;
        }
        if (byteOffset < 0)
          byteOffset = buffer.length + byteOffset;
        if (byteOffset >= buffer.length) {
          if (dir)
            return -1;
          else
            byteOffset = buffer.length - 1;
        } else if (byteOffset < 0) {
          if (dir)
            byteOffset = 0;
          else
            return -1;
        }
        if (typeof val === "string") {
          val = Buffer4.from(val, encoding);
        }
        if (Buffer4.isBuffer(val)) {
          if (val.length === 0) {
            return -1;
          }
          return arrayIndexOf(buffer, val, byteOffset, encoding, dir);
        } else if (typeof val === "number") {
          val = val & 255;
          if (typeof Uint8Array.prototype.indexOf === "function") {
            if (dir) {
              return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset);
            } else {
              return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset);
            }
          }
          return arrayIndexOf(buffer, [val], byteOffset, encoding, dir);
        }
        throw new TypeError("val must be string, number or Buffer");
      }
      __name(bidirectionalIndexOf, "bidirectionalIndexOf");
      function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
        let indexSize = 1;
        let arrLength = arr.length;
        let valLength = val.length;
        if (encoding !== void 0) {
          encoding = String(encoding).toLowerCase();
          if (encoding === "ucs2" || encoding === "ucs-2" || encoding === "utf16le" || encoding === "utf-16le") {
            if (arr.length < 2 || val.length < 2) {
              return -1;
            }
            indexSize = 2;
            arrLength /= 2;
            valLength /= 2;
            byteOffset /= 2;
          }
        }
        function read(buf, i2) {
          if (indexSize === 1) {
            return buf[i2];
          } else {
            return buf.readUInt16BE(i2 * indexSize);
          }
        }
        __name(read, "read");
        let i;
        if (dir) {
          let foundIndex = -1;
          for (i = byteOffset; i < arrLength; i++) {
            if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
              if (foundIndex === -1)
                foundIndex = i;
              if (i - foundIndex + 1 === valLength)
                return foundIndex * indexSize;
            } else {
              if (foundIndex !== -1)
                i -= i - foundIndex;
              foundIndex = -1;
            }
          }
        } else {
          if (byteOffset + valLength > arrLength)
            byteOffset = arrLength - valLength;
          for (i = byteOffset; i >= 0; i--) {
            let found = true;
            for (let j = 0; j < valLength; j++) {
              if (read(arr, i + j) !== read(val, j)) {
                found = false;
                break;
              }
            }
            if (found)
              return i;
          }
        }
        return -1;
      }
      __name(arrayIndexOf, "arrayIndexOf");
      Buffer4.prototype.includes = /* @__PURE__ */ __name(function includes(val, byteOffset, encoding) {
        return this.indexOf(val, byteOffset, encoding) !== -1;
      }, "includes");
      Buffer4.prototype.indexOf = /* @__PURE__ */ __name(function indexOf(val, byteOffset, encoding) {
        return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
      }, "indexOf");
      Buffer4.prototype.lastIndexOf = /* @__PURE__ */ __name(function lastIndexOf(val, byteOffset, encoding) {
        return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
      }, "lastIndexOf");
      function hexWrite(buf, string, offset, length) {
        offset = Number(offset) || 0;
        const remaining = buf.length - offset;
        if (!length) {
          length = remaining;
        } else {
          length = Number(length);
          if (length > remaining) {
            length = remaining;
          }
        }
        const strLen = string.length;
        if (length > strLen / 2) {
          length = strLen / 2;
        }
        let i;
        for (i = 0; i < length; ++i) {
          const parsed = parseInt(string.substr(i * 2, 2), 16);
          if (numberIsNaN(parsed))
            return i;
          buf[offset + i] = parsed;
        }
        return i;
      }
      __name(hexWrite, "hexWrite");
      function utf8Write(buf, string, offset, length) {
        return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
      }
      __name(utf8Write, "utf8Write");
      function asciiWrite(buf, string, offset, length) {
        return blitBuffer(asciiToBytes(string), buf, offset, length);
      }
      __name(asciiWrite, "asciiWrite");
      function base64Write(buf, string, offset, length) {
        return blitBuffer(base64ToBytes(string), buf, offset, length);
      }
      __name(base64Write, "base64Write");
      function ucs2Write(buf, string, offset, length) {
        return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
      }
      __name(ucs2Write, "ucs2Write");
      Buffer4.prototype.write = /* @__PURE__ */ __name(function write(string, offset, length, encoding) {
        if (offset === void 0) {
          encoding = "utf8";
          length = this.length;
          offset = 0;
        } else if (length === void 0 && typeof offset === "string") {
          encoding = offset;
          length = this.length;
          offset = 0;
        } else if (isFinite(offset)) {
          offset = offset >>> 0;
          if (isFinite(length)) {
            length = length >>> 0;
            if (encoding === void 0)
              encoding = "utf8";
          } else {
            encoding = length;
            length = void 0;
          }
        } else {
          throw new Error(
            "Buffer.write(string, encoding, offset[, length]) is no longer supported"
          );
        }
        const remaining = this.length - offset;
        if (length === void 0 || length > remaining)
          length = remaining;
        if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
          throw new RangeError("Attempt to write outside buffer bounds");
        }
        if (!encoding)
          encoding = "utf8";
        let loweredCase = false;
        for (; ; ) {
          switch (encoding) {
            case "hex":
              return hexWrite(this, string, offset, length);
            case "utf8":
            case "utf-8":
              return utf8Write(this, string, offset, length);
            case "ascii":
            case "latin1":
            case "binary":
              return asciiWrite(this, string, offset, length);
            case "base64":
              return base64Write(this, string, offset, length);
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return ucs2Write(this, string, offset, length);
            default:
              if (loweredCase)
                throw new TypeError("Unknown encoding: " + encoding);
              encoding = ("" + encoding).toLowerCase();
              loweredCase = true;
          }
        }
      }, "write");
      Buffer4.prototype.toJSON = /* @__PURE__ */ __name(function toJSON() {
        return {
          type: "Buffer",
          data: Array.prototype.slice.call(this._arr || this, 0)
        };
      }, "toJSON");
      function base64Slice(buf, start, end) {
        if (start === 0 && end === buf.length) {
          return base64.fromByteArray(buf);
        } else {
          return base64.fromByteArray(buf.slice(start, end));
        }
      }
      __name(base64Slice, "base64Slice");
      function utf8Slice(buf, start, end) {
        end = Math.min(buf.length, end);
        const res = [];
        let i = start;
        while (i < end) {
          const firstByte = buf[i];
          let codePoint = null;
          let bytesPerSequence = firstByte > 239 ? 4 : firstByte > 223 ? 3 : firstByte > 191 ? 2 : 1;
          if (i + bytesPerSequence <= end) {
            let secondByte, thirdByte, fourthByte, tempCodePoint;
            switch (bytesPerSequence) {
              case 1:
                if (firstByte < 128) {
                  codePoint = firstByte;
                }
                break;
              case 2:
                secondByte = buf[i + 1];
                if ((secondByte & 192) === 128) {
                  tempCodePoint = (firstByte & 31) << 6 | secondByte & 63;
                  if (tempCodePoint > 127) {
                    codePoint = tempCodePoint;
                  }
                }
                break;
              case 3:
                secondByte = buf[i + 1];
                thirdByte = buf[i + 2];
                if ((secondByte & 192) === 128 && (thirdByte & 192) === 128) {
                  tempCodePoint = (firstByte & 15) << 12 | (secondByte & 63) << 6 | thirdByte & 63;
                  if (tempCodePoint > 2047 && (tempCodePoint < 55296 || tempCodePoint > 57343)) {
                    codePoint = tempCodePoint;
                  }
                }
                break;
              case 4:
                secondByte = buf[i + 1];
                thirdByte = buf[i + 2];
                fourthByte = buf[i + 3];
                if ((secondByte & 192) === 128 && (thirdByte & 192) === 128 && (fourthByte & 192) === 128) {
                  tempCodePoint = (firstByte & 15) << 18 | (secondByte & 63) << 12 | (thirdByte & 63) << 6 | fourthByte & 63;
                  if (tempCodePoint > 65535 && tempCodePoint < 1114112) {
                    codePoint = tempCodePoint;
                  }
                }
            }
          }
          if (codePoint === null) {
            codePoint = 65533;
            bytesPerSequence = 1;
          } else if (codePoint > 65535) {
            codePoint -= 65536;
            res.push(codePoint >>> 10 & 1023 | 55296);
            codePoint = 56320 | codePoint & 1023;
          }
          res.push(codePoint);
          i += bytesPerSequence;
        }
        return decodeCodePointsArray(res);
      }
      __name(utf8Slice, "utf8Slice");
      var MAX_ARGUMENTS_LENGTH = 4096;
      function decodeCodePointsArray(codePoints) {
        const len = codePoints.length;
        if (len <= MAX_ARGUMENTS_LENGTH) {
          return String.fromCharCode.apply(String, codePoints);
        }
        let res = "";
        let i = 0;
        while (i < len) {
          res += String.fromCharCode.apply(
            String,
            codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
          );
        }
        return res;
      }
      __name(decodeCodePointsArray, "decodeCodePointsArray");
      function asciiSlice(buf, start, end) {
        let ret = "";
        end = Math.min(buf.length, end);
        for (let i = start; i < end; ++i) {
          ret += String.fromCharCode(buf[i] & 127);
        }
        return ret;
      }
      __name(asciiSlice, "asciiSlice");
      function latin1Slice(buf, start, end) {
        let ret = "";
        end = Math.min(buf.length, end);
        for (let i = start; i < end; ++i) {
          ret += String.fromCharCode(buf[i]);
        }
        return ret;
      }
      __name(latin1Slice, "latin1Slice");
      function hexSlice(buf, start, end) {
        const len = buf.length;
        if (!start || start < 0)
          start = 0;
        if (!end || end < 0 || end > len)
          end = len;
        let out = "";
        for (let i = start; i < end; ++i) {
          out += hexSliceLookupTable[buf[i]];
        }
        return out;
      }
      __name(hexSlice, "hexSlice");
      function utf16leSlice(buf, start, end) {
        const bytes = buf.slice(start, end);
        let res = "";
        for (let i = 0; i < bytes.length - 1; i += 2) {
          res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
        }
        return res;
      }
      __name(utf16leSlice, "utf16leSlice");
      Buffer4.prototype.slice = /* @__PURE__ */ __name(function slice(start, end) {
        const len = this.length;
        start = ~~start;
        end = end === void 0 ? len : ~~end;
        if (start < 0) {
          start += len;
          if (start < 0)
            start = 0;
        } else if (start > len) {
          start = len;
        }
        if (end < 0) {
          end += len;
          if (end < 0)
            end = 0;
        } else if (end > len) {
          end = len;
        }
        if (end < start)
          end = start;
        const newBuf = this.subarray(start, end);
        Object.setPrototypeOf(newBuf, Buffer4.prototype);
        return newBuf;
      }, "slice");
      function checkOffset(offset, ext, length) {
        if (offset % 1 !== 0 || offset < 0)
          throw new RangeError("offset is not uint");
        if (offset + ext > length)
          throw new RangeError("Trying to access beyond buffer length");
      }
      __name(checkOffset, "checkOffset");
      Buffer4.prototype.readUintLE = Buffer4.prototype.readUIntLE = /* @__PURE__ */ __name(function readUIntLE(offset, byteLength2, noAssert) {
        offset = offset >>> 0;
        byteLength2 = byteLength2 >>> 0;
        if (!noAssert)
          checkOffset(offset, byteLength2, this.length);
        let val = this[offset];
        let mul = 1;
        let i = 0;
        while (++i < byteLength2 && (mul *= 256)) {
          val += this[offset + i] * mul;
        }
        return val;
      }, "readUIntLE");
      Buffer4.prototype.readUintBE = Buffer4.prototype.readUIntBE = /* @__PURE__ */ __name(function readUIntBE(offset, byteLength2, noAssert) {
        offset = offset >>> 0;
        byteLength2 = byteLength2 >>> 0;
        if (!noAssert) {
          checkOffset(offset, byteLength2, this.length);
        }
        let val = this[offset + --byteLength2];
        let mul = 1;
        while (byteLength2 > 0 && (mul *= 256)) {
          val += this[offset + --byteLength2] * mul;
        }
        return val;
      }, "readUIntBE");
      Buffer4.prototype.readUint8 = Buffer4.prototype.readUInt8 = /* @__PURE__ */ __name(function readUInt8(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert)
          checkOffset(offset, 1, this.length);
        return this[offset];
      }, "readUInt8");
      Buffer4.prototype.readUint16LE = Buffer4.prototype.readUInt16LE = /* @__PURE__ */ __name(function readUInt16LE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert)
          checkOffset(offset, 2, this.length);
        return this[offset] | this[offset + 1] << 8;
      }, "readUInt16LE");
      Buffer4.prototype.readUint16BE = Buffer4.prototype.readUInt16BE = /* @__PURE__ */ __name(function readUInt16BE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert)
          checkOffset(offset, 2, this.length);
        return this[offset] << 8 | this[offset + 1];
      }, "readUInt16BE");
      Buffer4.prototype.readUint32LE = Buffer4.prototype.readUInt32LE = /* @__PURE__ */ __name(function readUInt32LE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert)
          checkOffset(offset, 4, this.length);
        return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 16777216;
      }, "readUInt32LE");
      Buffer4.prototype.readUint32BE = Buffer4.prototype.readUInt32BE = /* @__PURE__ */ __name(function readUInt32BE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert)
          checkOffset(offset, 4, this.length);
        return this[offset] * 16777216 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
      }, "readUInt32BE");
      Buffer4.prototype.readBigUInt64LE = defineBigIntMethod(/* @__PURE__ */ __name(function readBigUInt64LE(offset) {
        offset = offset >>> 0;
        validateNumber(offset, "offset");
        const first = this[offset];
        const last = this[offset + 7];
        if (first === void 0 || last === void 0) {
          boundsError(offset, this.length - 8);
        }
        const lo = first + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 24;
        const hi = this[++offset] + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + last * 2 ** 24;
        return BigInt(lo) + (BigInt(hi) << BigInt(32));
      }, "readBigUInt64LE"));
      Buffer4.prototype.readBigUInt64BE = defineBigIntMethod(/* @__PURE__ */ __name(function readBigUInt64BE(offset) {
        offset = offset >>> 0;
        validateNumber(offset, "offset");
        const first = this[offset];
        const last = this[offset + 7];
        if (first === void 0 || last === void 0) {
          boundsError(offset, this.length - 8);
        }
        const hi = first * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + this[++offset];
        const lo = this[++offset] * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + last;
        return (BigInt(hi) << BigInt(32)) + BigInt(lo);
      }, "readBigUInt64BE"));
      Buffer4.prototype.readIntLE = /* @__PURE__ */ __name(function readIntLE(offset, byteLength2, noAssert) {
        offset = offset >>> 0;
        byteLength2 = byteLength2 >>> 0;
        if (!noAssert)
          checkOffset(offset, byteLength2, this.length);
        let val = this[offset];
        let mul = 1;
        let i = 0;
        while (++i < byteLength2 && (mul *= 256)) {
          val += this[offset + i] * mul;
        }
        mul *= 128;
        if (val >= mul)
          val -= Math.pow(2, 8 * byteLength2);
        return val;
      }, "readIntLE");
      Buffer4.prototype.readIntBE = /* @__PURE__ */ __name(function readIntBE(offset, byteLength2, noAssert) {
        offset = offset >>> 0;
        byteLength2 = byteLength2 >>> 0;
        if (!noAssert)
          checkOffset(offset, byteLength2, this.length);
        let i = byteLength2;
        let mul = 1;
        let val = this[offset + --i];
        while (i > 0 && (mul *= 256)) {
          val += this[offset + --i] * mul;
        }
        mul *= 128;
        if (val >= mul)
          val -= Math.pow(2, 8 * byteLength2);
        return val;
      }, "readIntBE");
      Buffer4.prototype.readInt8 = /* @__PURE__ */ __name(function readInt8(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert)
          checkOffset(offset, 1, this.length);
        if (!(this[offset] & 128))
          return this[offset];
        return (255 - this[offset] + 1) * -1;
      }, "readInt8");
      Buffer4.prototype.readInt16LE = /* @__PURE__ */ __name(function readInt16LE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert)
          checkOffset(offset, 2, this.length);
        const val = this[offset] | this[offset + 1] << 8;
        return val & 32768 ? val | 4294901760 : val;
      }, "readInt16LE");
      Buffer4.prototype.readInt16BE = /* @__PURE__ */ __name(function readInt16BE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert)
          checkOffset(offset, 2, this.length);
        const val = this[offset + 1] | this[offset] << 8;
        return val & 32768 ? val | 4294901760 : val;
      }, "readInt16BE");
      Buffer4.prototype.readInt32LE = /* @__PURE__ */ __name(function readInt32LE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert)
          checkOffset(offset, 4, this.length);
        return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
      }, "readInt32LE");
      Buffer4.prototype.readInt32BE = /* @__PURE__ */ __name(function readInt32BE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert)
          checkOffset(offset, 4, this.length);
        return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
      }, "readInt32BE");
      Buffer4.prototype.readBigInt64LE = defineBigIntMethod(/* @__PURE__ */ __name(function readBigInt64LE(offset) {
        offset = offset >>> 0;
        validateNumber(offset, "offset");
        const first = this[offset];
        const last = this[offset + 7];
        if (first === void 0 || last === void 0) {
          boundsError(offset, this.length - 8);
        }
        const val = this[offset + 4] + this[offset + 5] * 2 ** 8 + this[offset + 6] * 2 ** 16 + (last << 24);
        return (BigInt(val) << BigInt(32)) + BigInt(first + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 24);
      }, "readBigInt64LE"));
      Buffer4.prototype.readBigInt64BE = defineBigIntMethod(/* @__PURE__ */ __name(function readBigInt64BE(offset) {
        offset = offset >>> 0;
        validateNumber(offset, "offset");
        const first = this[offset];
        const last = this[offset + 7];
        if (first === void 0 || last === void 0) {
          boundsError(offset, this.length - 8);
        }
        const val = (first << 24) + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + this[++offset];
        return (BigInt(val) << BigInt(32)) + BigInt(this[++offset] * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + last);
      }, "readBigInt64BE"));
      Buffer4.prototype.readFloatLE = /* @__PURE__ */ __name(function readFloatLE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert)
          checkOffset(offset, 4, this.length);
        return ieee754.read(this, offset, true, 23, 4);
      }, "readFloatLE");
      Buffer4.prototype.readFloatBE = /* @__PURE__ */ __name(function readFloatBE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert)
          checkOffset(offset, 4, this.length);
        return ieee754.read(this, offset, false, 23, 4);
      }, "readFloatBE");
      Buffer4.prototype.readDoubleLE = /* @__PURE__ */ __name(function readDoubleLE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert)
          checkOffset(offset, 8, this.length);
        return ieee754.read(this, offset, true, 52, 8);
      }, "readDoubleLE");
      Buffer4.prototype.readDoubleBE = /* @__PURE__ */ __name(function readDoubleBE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert)
          checkOffset(offset, 8, this.length);
        return ieee754.read(this, offset, false, 52, 8);
      }, "readDoubleBE");
      function checkInt(buf, value, offset, ext, max, min) {
        if (!Buffer4.isBuffer(buf))
          throw new TypeError('"buffer" argument must be a Buffer instance');
        if (value > max || value < min)
          throw new RangeError('"value" argument is out of bounds');
        if (offset + ext > buf.length)
          throw new RangeError("Index out of range");
      }
      __name(checkInt, "checkInt");
      Buffer4.prototype.writeUintLE = Buffer4.prototype.writeUIntLE = /* @__PURE__ */ __name(function writeUIntLE(value, offset, byteLength2, noAssert) {
        value = +value;
        offset = offset >>> 0;
        byteLength2 = byteLength2 >>> 0;
        if (!noAssert) {
          const maxBytes = Math.pow(2, 8 * byteLength2) - 1;
          checkInt(this, value, offset, byteLength2, maxBytes, 0);
        }
        let mul = 1;
        let i = 0;
        this[offset] = value & 255;
        while (++i < byteLength2 && (mul *= 256)) {
          this[offset + i] = value / mul & 255;
        }
        return offset + byteLength2;
      }, "writeUIntLE");
      Buffer4.prototype.writeUintBE = Buffer4.prototype.writeUIntBE = /* @__PURE__ */ __name(function writeUIntBE(value, offset, byteLength2, noAssert) {
        value = +value;
        offset = offset >>> 0;
        byteLength2 = byteLength2 >>> 0;
        if (!noAssert) {
          const maxBytes = Math.pow(2, 8 * byteLength2) - 1;
          checkInt(this, value, offset, byteLength2, maxBytes, 0);
        }
        let i = byteLength2 - 1;
        let mul = 1;
        this[offset + i] = value & 255;
        while (--i >= 0 && (mul *= 256)) {
          this[offset + i] = value / mul & 255;
        }
        return offset + byteLength2;
      }, "writeUIntBE");
      Buffer4.prototype.writeUint8 = Buffer4.prototype.writeUInt8 = /* @__PURE__ */ __name(function writeUInt8(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert)
          checkInt(this, value, offset, 1, 255, 0);
        this[offset] = value & 255;
        return offset + 1;
      }, "writeUInt8");
      Buffer4.prototype.writeUint16LE = Buffer4.prototype.writeUInt16LE = /* @__PURE__ */ __name(function writeUInt16LE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert)
          checkInt(this, value, offset, 2, 65535, 0);
        this[offset] = value & 255;
        this[offset + 1] = value >>> 8;
        return offset + 2;
      }, "writeUInt16LE");
      Buffer4.prototype.writeUint16BE = Buffer4.prototype.writeUInt16BE = /* @__PURE__ */ __name(function writeUInt16BE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert)
          checkInt(this, value, offset, 2, 65535, 0);
        this[offset] = value >>> 8;
        this[offset + 1] = value & 255;
        return offset + 2;
      }, "writeUInt16BE");
      Buffer4.prototype.writeUint32LE = Buffer4.prototype.writeUInt32LE = /* @__PURE__ */ __name(function writeUInt32LE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert)
          checkInt(this, value, offset, 4, 4294967295, 0);
        this[offset + 3] = value >>> 24;
        this[offset + 2] = value >>> 16;
        this[offset + 1] = value >>> 8;
        this[offset] = value & 255;
        return offset + 4;
      }, "writeUInt32LE");
      Buffer4.prototype.writeUint32BE = Buffer4.prototype.writeUInt32BE = /* @__PURE__ */ __name(function writeUInt32BE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert)
          checkInt(this, value, offset, 4, 4294967295, 0);
        this[offset] = value >>> 24;
        this[offset + 1] = value >>> 16;
        this[offset + 2] = value >>> 8;
        this[offset + 3] = value & 255;
        return offset + 4;
      }, "writeUInt32BE");
      function wrtBigUInt64LE(buf, value, offset, min, max) {
        checkIntBI(value, min, max, buf, offset, 7);
        let lo = Number(value & BigInt(4294967295));
        buf[offset++] = lo;
        lo = lo >> 8;
        buf[offset++] = lo;
        lo = lo >> 8;
        buf[offset++] = lo;
        lo = lo >> 8;
        buf[offset++] = lo;
        let hi = Number(value >> BigInt(32) & BigInt(4294967295));
        buf[offset++] = hi;
        hi = hi >> 8;
        buf[offset++] = hi;
        hi = hi >> 8;
        buf[offset++] = hi;
        hi = hi >> 8;
        buf[offset++] = hi;
        return offset;
      }
      __name(wrtBigUInt64LE, "wrtBigUInt64LE");
      function wrtBigUInt64BE(buf, value, offset, min, max) {
        checkIntBI(value, min, max, buf, offset, 7);
        let lo = Number(value & BigInt(4294967295));
        buf[offset + 7] = lo;
        lo = lo >> 8;
        buf[offset + 6] = lo;
        lo = lo >> 8;
        buf[offset + 5] = lo;
        lo = lo >> 8;
        buf[offset + 4] = lo;
        let hi = Number(value >> BigInt(32) & BigInt(4294967295));
        buf[offset + 3] = hi;
        hi = hi >> 8;
        buf[offset + 2] = hi;
        hi = hi >> 8;
        buf[offset + 1] = hi;
        hi = hi >> 8;
        buf[offset] = hi;
        return offset + 8;
      }
      __name(wrtBigUInt64BE, "wrtBigUInt64BE");
      Buffer4.prototype.writeBigUInt64LE = defineBigIntMethod(/* @__PURE__ */ __name(function writeBigUInt64LE(value, offset = 0) {
        return wrtBigUInt64LE(this, value, offset, BigInt(0), BigInt("0xffffffffffffffff"));
      }, "writeBigUInt64LE"));
      Buffer4.prototype.writeBigUInt64BE = defineBigIntMethod(/* @__PURE__ */ __name(function writeBigUInt64BE(value, offset = 0) {
        return wrtBigUInt64BE(this, value, offset, BigInt(0), BigInt("0xffffffffffffffff"));
      }, "writeBigUInt64BE"));
      Buffer4.prototype.writeIntLE = /* @__PURE__ */ __name(function writeIntLE(value, offset, byteLength2, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) {
          const limit = Math.pow(2, 8 * byteLength2 - 1);
          checkInt(this, value, offset, byteLength2, limit - 1, -limit);
        }
        let i = 0;
        let mul = 1;
        let sub = 0;
        this[offset] = value & 255;
        while (++i < byteLength2 && (mul *= 256)) {
          if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
            sub = 1;
          }
          this[offset + i] = (value / mul >> 0) - sub & 255;
        }
        return offset + byteLength2;
      }, "writeIntLE");
      Buffer4.prototype.writeIntBE = /* @__PURE__ */ __name(function writeIntBE(value, offset, byteLength2, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) {
          const limit = Math.pow(2, 8 * byteLength2 - 1);
          checkInt(this, value, offset, byteLength2, limit - 1, -limit);
        }
        let i = byteLength2 - 1;
        let mul = 1;
        let sub = 0;
        this[offset + i] = value & 255;
        while (--i >= 0 && (mul *= 256)) {
          if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
            sub = 1;
          }
          this[offset + i] = (value / mul >> 0) - sub & 255;
        }
        return offset + byteLength2;
      }, "writeIntBE");
      Buffer4.prototype.writeInt8 = /* @__PURE__ */ __name(function writeInt8(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert)
          checkInt(this, value, offset, 1, 127, -128);
        if (value < 0)
          value = 255 + value + 1;
        this[offset] = value & 255;
        return offset + 1;
      }, "writeInt8");
      Buffer4.prototype.writeInt16LE = /* @__PURE__ */ __name(function writeInt16LE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert)
          checkInt(this, value, offset, 2, 32767, -32768);
        this[offset] = value & 255;
        this[offset + 1] = value >>> 8;
        return offset + 2;
      }, "writeInt16LE");
      Buffer4.prototype.writeInt16BE = /* @__PURE__ */ __name(function writeInt16BE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert)
          checkInt(this, value, offset, 2, 32767, -32768);
        this[offset] = value >>> 8;
        this[offset + 1] = value & 255;
        return offset + 2;
      }, "writeInt16BE");
      Buffer4.prototype.writeInt32LE = /* @__PURE__ */ __name(function writeInt32LE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert)
          checkInt(this, value, offset, 4, 2147483647, -2147483648);
        this[offset] = value & 255;
        this[offset + 1] = value >>> 8;
        this[offset + 2] = value >>> 16;
        this[offset + 3] = value >>> 24;
        return offset + 4;
      }, "writeInt32LE");
      Buffer4.prototype.writeInt32BE = /* @__PURE__ */ __name(function writeInt32BE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert)
          checkInt(this, value, offset, 4, 2147483647, -2147483648);
        if (value < 0)
          value = 4294967295 + value + 1;
        this[offset] = value >>> 24;
        this[offset + 1] = value >>> 16;
        this[offset + 2] = value >>> 8;
        this[offset + 3] = value & 255;
        return offset + 4;
      }, "writeInt32BE");
      Buffer4.prototype.writeBigInt64LE = defineBigIntMethod(/* @__PURE__ */ __name(function writeBigInt64LE(value, offset = 0) {
        return wrtBigUInt64LE(this, value, offset, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
      }, "writeBigInt64LE"));
      Buffer4.prototype.writeBigInt64BE = defineBigIntMethod(/* @__PURE__ */ __name(function writeBigInt64BE(value, offset = 0) {
        return wrtBigUInt64BE(this, value, offset, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
      }, "writeBigInt64BE"));
      function checkIEEE754(buf, value, offset, ext, max, min) {
        if (offset + ext > buf.length)
          throw new RangeError("Index out of range");
        if (offset < 0)
          throw new RangeError("Index out of range");
      }
      __name(checkIEEE754, "checkIEEE754");
      function writeFloat(buf, value, offset, littleEndian, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) {
          checkIEEE754(buf, value, offset, 4, 34028234663852886e22, -34028234663852886e22);
        }
        ieee754.write(buf, value, offset, littleEndian, 23, 4);
        return offset + 4;
      }
      __name(writeFloat, "writeFloat");
      Buffer4.prototype.writeFloatLE = /* @__PURE__ */ __name(function writeFloatLE(value, offset, noAssert) {
        return writeFloat(this, value, offset, true, noAssert);
      }, "writeFloatLE");
      Buffer4.prototype.writeFloatBE = /* @__PURE__ */ __name(function writeFloatBE(value, offset, noAssert) {
        return writeFloat(this, value, offset, false, noAssert);
      }, "writeFloatBE");
      function writeDouble(buf, value, offset, littleEndian, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) {
          checkIEEE754(buf, value, offset, 8, 17976931348623157e292, -17976931348623157e292);
        }
        ieee754.write(buf, value, offset, littleEndian, 52, 8);
        return offset + 8;
      }
      __name(writeDouble, "writeDouble");
      Buffer4.prototype.writeDoubleLE = /* @__PURE__ */ __name(function writeDoubleLE(value, offset, noAssert) {
        return writeDouble(this, value, offset, true, noAssert);
      }, "writeDoubleLE");
      Buffer4.prototype.writeDoubleBE = /* @__PURE__ */ __name(function writeDoubleBE(value, offset, noAssert) {
        return writeDouble(this, value, offset, false, noAssert);
      }, "writeDoubleBE");
      Buffer4.prototype.copy = /* @__PURE__ */ __name(function copy(target, targetStart, start, end) {
        if (!Buffer4.isBuffer(target))
          throw new TypeError("argument should be a Buffer");
        if (!start)
          start = 0;
        if (!end && end !== 0)
          end = this.length;
        if (targetStart >= target.length)
          targetStart = target.length;
        if (!targetStart)
          targetStart = 0;
        if (end > 0 && end < start)
          end = start;
        if (end === start)
          return 0;
        if (target.length === 0 || this.length === 0)
          return 0;
        if (targetStart < 0) {
          throw new RangeError("targetStart out of bounds");
        }
        if (start < 0 || start >= this.length)
          throw new RangeError("Index out of range");
        if (end < 0)
          throw new RangeError("sourceEnd out of bounds");
        if (end > this.length)
          end = this.length;
        if (target.length - targetStart < end - start) {
          end = target.length - targetStart + start;
        }
        const len = end - start;
        if (this === target && typeof Uint8Array.prototype.copyWithin === "function") {
          this.copyWithin(targetStart, start, end);
        } else {
          Uint8Array.prototype.set.call(
            target,
            this.subarray(start, end),
            targetStart
          );
        }
        return len;
      }, "copy");
      Buffer4.prototype.fill = /* @__PURE__ */ __name(function fill(val, start, end, encoding) {
        if (typeof val === "string") {
          if (typeof start === "string") {
            encoding = start;
            start = 0;
            end = this.length;
          } else if (typeof end === "string") {
            encoding = end;
            end = this.length;
          }
          if (encoding !== void 0 && typeof encoding !== "string") {
            throw new TypeError("encoding must be a string");
          }
          if (typeof encoding === "string" && !Buffer4.isEncoding(encoding)) {
            throw new TypeError("Unknown encoding: " + encoding);
          }
          if (val.length === 1) {
            const code = val.charCodeAt(0);
            if (encoding === "utf8" && code < 128 || encoding === "latin1") {
              val = code;
            }
          }
        } else if (typeof val === "number") {
          val = val & 255;
        } else if (typeof val === "boolean") {
          val = Number(val);
        }
        if (start < 0 || this.length < start || this.length < end) {
          throw new RangeError("Out of range index");
        }
        if (end <= start) {
          return this;
        }
        start = start >>> 0;
        end = end === void 0 ? this.length : end >>> 0;
        if (!val)
          val = 0;
        let i;
        if (typeof val === "number") {
          for (i = start; i < end; ++i) {
            this[i] = val;
          }
        } else {
          const bytes = Buffer4.isBuffer(val) ? val : Buffer4.from(val, encoding);
          const len = bytes.length;
          if (len === 0) {
            throw new TypeError('The value "' + val + '" is invalid for argument "value"');
          }
          for (i = 0; i < end - start; ++i) {
            this[i + start] = bytes[i % len];
          }
        }
        return this;
      }, "fill");
      var errors = {};
      function E(sym, getMessage, Base) {
        errors[sym] = /* @__PURE__ */ __name(class NodeError extends Base {
          constructor() {
            super();
            Object.defineProperty(this, "message", {
              value: getMessage.apply(this, arguments),
              writable: true,
              configurable: true
            });
            this.name = `${this.name} [${sym}]`;
            this.stack;
            delete this.name;
          }
          get code() {
            return sym;
          }
          set code(value) {
            Object.defineProperty(this, "code", {
              configurable: true,
              enumerable: true,
              value,
              writable: true
            });
          }
          toString() {
            return `${this.name} [${sym}]: ${this.message}`;
          }
        }, "NodeError");
      }
      __name(E, "E");
      E(
        "ERR_BUFFER_OUT_OF_BOUNDS",
        function(name) {
          if (name) {
            return `${name} is outside of buffer bounds`;
          }
          return "Attempt to access memory outside buffer bounds";
        },
        RangeError
      );
      E(
        "ERR_INVALID_ARG_TYPE",
        function(name, actual) {
          return `The "${name}" argument must be of type number. Received type ${typeof actual}`;
        },
        TypeError
      );
      E(
        "ERR_OUT_OF_RANGE",
        function(str, range, input) {
          let msg = `The value of "${str}" is out of range.`;
          let received = input;
          if (Number.isInteger(input) && Math.abs(input) > 2 ** 32) {
            received = addNumericalSeparator(String(input));
          } else if (typeof input === "bigint") {
            received = String(input);
            if (input > BigInt(2) ** BigInt(32) || input < -(BigInt(2) ** BigInt(32))) {
              received = addNumericalSeparator(received);
            }
            received += "n";
          }
          msg += ` It must be ${range}. Received ${received}`;
          return msg;
        },
        RangeError
      );
      function addNumericalSeparator(val) {
        let res = "";
        let i = val.length;
        const start = val[0] === "-" ? 1 : 0;
        for (; i >= start + 4; i -= 3) {
          res = `_${val.slice(i - 3, i)}${res}`;
        }
        return `${val.slice(0, i)}${res}`;
      }
      __name(addNumericalSeparator, "addNumericalSeparator");
      function checkBounds(buf, offset, byteLength2) {
        validateNumber(offset, "offset");
        if (buf[offset] === void 0 || buf[offset + byteLength2] === void 0) {
          boundsError(offset, buf.length - (byteLength2 + 1));
        }
      }
      __name(checkBounds, "checkBounds");
      function checkIntBI(value, min, max, buf, offset, byteLength2) {
        if (value > max || value < min) {
          const n = typeof min === "bigint" ? "n" : "";
          let range;
          if (byteLength2 > 3) {
            if (min === 0 || min === BigInt(0)) {
              range = `>= 0${n} and < 2${n} ** ${(byteLength2 + 1) * 8}${n}`;
            } else {
              range = `>= -(2${n} ** ${(byteLength2 + 1) * 8 - 1}${n}) and < 2 ** ${(byteLength2 + 1) * 8 - 1}${n}`;
            }
          } else {
            range = `>= ${min}${n} and <= ${max}${n}`;
          }
          throw new errors.ERR_OUT_OF_RANGE("value", range, value);
        }
        checkBounds(buf, offset, byteLength2);
      }
      __name(checkIntBI, "checkIntBI");
      function validateNumber(value, name) {
        if (typeof value !== "number") {
          throw new errors.ERR_INVALID_ARG_TYPE(name, "number", value);
        }
      }
      __name(validateNumber, "validateNumber");
      function boundsError(value, length, type) {
        if (Math.floor(value) !== value) {
          validateNumber(value, type);
          throw new errors.ERR_OUT_OF_RANGE(type || "offset", "an integer", value);
        }
        if (length < 0) {
          throw new errors.ERR_BUFFER_OUT_OF_BOUNDS();
        }
        throw new errors.ERR_OUT_OF_RANGE(
          type || "offset",
          `>= ${type ? 1 : 0} and <= ${length}`,
          value
        );
      }
      __name(boundsError, "boundsError");
      var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g;
      function base64clean(str) {
        str = str.split("=")[0];
        str = str.trim().replace(INVALID_BASE64_RE, "");
        if (str.length < 2)
          return "";
        while (str.length % 4 !== 0) {
          str = str + "=";
        }
        return str;
      }
      __name(base64clean, "base64clean");
      function utf8ToBytes(string, units) {
        units = units || Infinity;
        let codePoint;
        const length = string.length;
        let leadSurrogate = null;
        const bytes = [];
        for (let i = 0; i < length; ++i) {
          codePoint = string.charCodeAt(i);
          if (codePoint > 55295 && codePoint < 57344) {
            if (!leadSurrogate) {
              if (codePoint > 56319) {
                if ((units -= 3) > -1)
                  bytes.push(239, 191, 189);
                continue;
              } else if (i + 1 === length) {
                if ((units -= 3) > -1)
                  bytes.push(239, 191, 189);
                continue;
              }
              leadSurrogate = codePoint;
              continue;
            }
            if (codePoint < 56320) {
              if ((units -= 3) > -1)
                bytes.push(239, 191, 189);
              leadSurrogate = codePoint;
              continue;
            }
            codePoint = (leadSurrogate - 55296 << 10 | codePoint - 56320) + 65536;
          } else if (leadSurrogate) {
            if ((units -= 3) > -1)
              bytes.push(239, 191, 189);
          }
          leadSurrogate = null;
          if (codePoint < 128) {
            if ((units -= 1) < 0)
              break;
            bytes.push(codePoint);
          } else if (codePoint < 2048) {
            if ((units -= 2) < 0)
              break;
            bytes.push(
              codePoint >> 6 | 192,
              codePoint & 63 | 128
            );
          } else if (codePoint < 65536) {
            if ((units -= 3) < 0)
              break;
            bytes.push(
              codePoint >> 12 | 224,
              codePoint >> 6 & 63 | 128,
              codePoint & 63 | 128
            );
          } else if (codePoint < 1114112) {
            if ((units -= 4) < 0)
              break;
            bytes.push(
              codePoint >> 18 | 240,
              codePoint >> 12 & 63 | 128,
              codePoint >> 6 & 63 | 128,
              codePoint & 63 | 128
            );
          } else {
            throw new Error("Invalid code point");
          }
        }
        return bytes;
      }
      __name(utf8ToBytes, "utf8ToBytes");
      function asciiToBytes(str) {
        const byteArray = [];
        for (let i = 0; i < str.length; ++i) {
          byteArray.push(str.charCodeAt(i) & 255);
        }
        return byteArray;
      }
      __name(asciiToBytes, "asciiToBytes");
      function utf16leToBytes(str, units) {
        let c, hi, lo;
        const byteArray = [];
        for (let i = 0; i < str.length; ++i) {
          if ((units -= 2) < 0)
            break;
          c = str.charCodeAt(i);
          hi = c >> 8;
          lo = c % 256;
          byteArray.push(lo);
          byteArray.push(hi);
        }
        return byteArray;
      }
      __name(utf16leToBytes, "utf16leToBytes");
      function base64ToBytes(str) {
        return base64.toByteArray(base64clean(str));
      }
      __name(base64ToBytes, "base64ToBytes");
      function blitBuffer(src, dst, offset, length) {
        let i;
        for (i = 0; i < length; ++i) {
          if (i + offset >= dst.length || i >= src.length)
            break;
          dst[i + offset] = src[i];
        }
        return i;
      }
      __name(blitBuffer, "blitBuffer");
      function isInstance(obj, type) {
        return obj instanceof type || obj != null && obj.constructor != null && obj.constructor.name != null && obj.constructor.name === type.name;
      }
      __name(isInstance, "isInstance");
      function numberIsNaN(obj) {
        return obj !== obj;
      }
      __name(numberIsNaN, "numberIsNaN");
      var hexSliceLookupTable = function() {
        const alphabet = "0123456789abcdef";
        const table = new Array(256);
        for (let i = 0; i < 16; ++i) {
          const i16 = i * 16;
          for (let j = 0; j < 16; ++j) {
            table[i16 + j] = alphabet[i] + alphabet[j];
          }
        }
        return table;
      }();
      function defineBigIntMethod(fn) {
        return typeof BigInt === "undefined" ? BufferBigIntNotDefined : fn;
      }
      __name(defineBigIntMethod, "defineBigIntMethod");
      function BufferBigIntNotDefined() {
        throw new Error("BigInt not supported");
      }
      __name(BufferBigIntNotDefined, "BufferBigIntNotDefined");
    }
  });

  // testing/injections/buffer_shim.js
  var Buffer2;
  var init_buffer_shim = __esm({
    "testing/injections/buffer_shim.js"() {
      "use strict";
      Buffer2 = require_buffer().Buffer;
    }
  });

  // node_modules/markdown-it/node_modules/entities/lib/maps/entities.json
  var require_entities = __commonJS({
    "node_modules/markdown-it/node_modules/entities/lib/maps/entities.json"(exports, module) {
      module.exports = { Aacute: "\xC1", aacute: "\xE1", Abreve: "\u0102", abreve: "\u0103", ac: "\u223E", acd: "\u223F", acE: "\u223E\u0333", Acirc: "\xC2", acirc: "\xE2", acute: "\xB4", Acy: "\u0410", acy: "\u0430", AElig: "\xC6", aelig: "\xE6", af: "\u2061", Afr: "\u{1D504}", afr: "\u{1D51E}", Agrave: "\xC0", agrave: "\xE0", alefsym: "\u2135", aleph: "\u2135", Alpha: "\u0391", alpha: "\u03B1", Amacr: "\u0100", amacr: "\u0101", amalg: "\u2A3F", amp: "&", AMP: "&", andand: "\u2A55", And: "\u2A53", and: "\u2227", andd: "\u2A5C", andslope: "\u2A58", andv: "\u2A5A", ang: "\u2220", ange: "\u29A4", angle: "\u2220", angmsdaa: "\u29A8", angmsdab: "\u29A9", angmsdac: "\u29AA", angmsdad: "\u29AB", angmsdae: "\u29AC", angmsdaf: "\u29AD", angmsdag: "\u29AE", angmsdah: "\u29AF", angmsd: "\u2221", angrt: "\u221F", angrtvb: "\u22BE", angrtvbd: "\u299D", angsph: "\u2222", angst: "\xC5", angzarr: "\u237C", Aogon: "\u0104", aogon: "\u0105", Aopf: "\u{1D538}", aopf: "\u{1D552}", apacir: "\u2A6F", ap: "\u2248", apE: "\u2A70", ape: "\u224A", apid: "\u224B", apos: "'", ApplyFunction: "\u2061", approx: "\u2248", approxeq: "\u224A", Aring: "\xC5", aring: "\xE5", Ascr: "\u{1D49C}", ascr: "\u{1D4B6}", Assign: "\u2254", ast: "*", asymp: "\u2248", asympeq: "\u224D", Atilde: "\xC3", atilde: "\xE3", Auml: "\xC4", auml: "\xE4", awconint: "\u2233", awint: "\u2A11", backcong: "\u224C", backepsilon: "\u03F6", backprime: "\u2035", backsim: "\u223D", backsimeq: "\u22CD", Backslash: "\u2216", Barv: "\u2AE7", barvee: "\u22BD", barwed: "\u2305", Barwed: "\u2306", barwedge: "\u2305", bbrk: "\u23B5", bbrktbrk: "\u23B6", bcong: "\u224C", Bcy: "\u0411", bcy: "\u0431", bdquo: "\u201E", becaus: "\u2235", because: "\u2235", Because: "\u2235", bemptyv: "\u29B0", bepsi: "\u03F6", bernou: "\u212C", Bernoullis: "\u212C", Beta: "\u0392", beta: "\u03B2", beth: "\u2136", between: "\u226C", Bfr: "\u{1D505}", bfr: "\u{1D51F}", bigcap: "\u22C2", bigcirc: "\u25EF", bigcup: "\u22C3", bigodot: "\u2A00", bigoplus: "\u2A01", bigotimes: "\u2A02", bigsqcup: "\u2A06", bigstar: "\u2605", bigtriangledown: "\u25BD", bigtriangleup: "\u25B3", biguplus: "\u2A04", bigvee: "\u22C1", bigwedge: "\u22C0", bkarow: "\u290D", blacklozenge: "\u29EB", blacksquare: "\u25AA", blacktriangle: "\u25B4", blacktriangledown: "\u25BE", blacktriangleleft: "\u25C2", blacktriangleright: "\u25B8", blank: "\u2423", blk12: "\u2592", blk14: "\u2591", blk34: "\u2593", block: "\u2588", bne: "=\u20E5", bnequiv: "\u2261\u20E5", bNot: "\u2AED", bnot: "\u2310", Bopf: "\u{1D539}", bopf: "\u{1D553}", bot: "\u22A5", bottom: "\u22A5", bowtie: "\u22C8", boxbox: "\u29C9", boxdl: "\u2510", boxdL: "\u2555", boxDl: "\u2556", boxDL: "\u2557", boxdr: "\u250C", boxdR: "\u2552", boxDr: "\u2553", boxDR: "\u2554", boxh: "\u2500", boxH: "\u2550", boxhd: "\u252C", boxHd: "\u2564", boxhD: "\u2565", boxHD: "\u2566", boxhu: "\u2534", boxHu: "\u2567", boxhU: "\u2568", boxHU: "\u2569", boxminus: "\u229F", boxplus: "\u229E", boxtimes: "\u22A0", boxul: "\u2518", boxuL: "\u255B", boxUl: "\u255C", boxUL: "\u255D", boxur: "\u2514", boxuR: "\u2558", boxUr: "\u2559", boxUR: "\u255A", boxv: "\u2502", boxV: "\u2551", boxvh: "\u253C", boxvH: "\u256A", boxVh: "\u256B", boxVH: "\u256C", boxvl: "\u2524", boxvL: "\u2561", boxVl: "\u2562", boxVL: "\u2563", boxvr: "\u251C", boxvR: "\u255E", boxVr: "\u255F", boxVR: "\u2560", bprime: "\u2035", breve: "\u02D8", Breve: "\u02D8", brvbar: "\xA6", bscr: "\u{1D4B7}", Bscr: "\u212C", bsemi: "\u204F", bsim: "\u223D", bsime: "\u22CD", bsolb: "\u29C5", bsol: "\\", bsolhsub: "\u27C8", bull: "\u2022", bullet: "\u2022", bump: "\u224E", bumpE: "\u2AAE", bumpe: "\u224F", Bumpeq: "\u224E", bumpeq: "\u224F", Cacute: "\u0106", cacute: "\u0107", capand: "\u2A44", capbrcup: "\u2A49", capcap: "\u2A4B", cap: "\u2229", Cap: "\u22D2", capcup: "\u2A47", capdot: "\u2A40", CapitalDifferentialD: "\u2145", caps: "\u2229\uFE00", caret: "\u2041", caron: "\u02C7", Cayleys: "\u212D", ccaps: "\u2A4D", Ccaron: "\u010C", ccaron: "\u010D", Ccedil: "\xC7", ccedil: "\xE7", Ccirc: "\u0108", ccirc: "\u0109", Cconint: "\u2230", ccups: "\u2A4C", ccupssm: "\u2A50", Cdot: "\u010A", cdot: "\u010B", cedil: "\xB8", Cedilla: "\xB8", cemptyv: "\u29B2", cent: "\xA2", centerdot: "\xB7", CenterDot: "\xB7", cfr: "\u{1D520}", Cfr: "\u212D", CHcy: "\u0427", chcy: "\u0447", check: "\u2713", checkmark: "\u2713", Chi: "\u03A7", chi: "\u03C7", circ: "\u02C6", circeq: "\u2257", circlearrowleft: "\u21BA", circlearrowright: "\u21BB", circledast: "\u229B", circledcirc: "\u229A", circleddash: "\u229D", CircleDot: "\u2299", circledR: "\xAE", circledS: "\u24C8", CircleMinus: "\u2296", CirclePlus: "\u2295", CircleTimes: "\u2297", cir: "\u25CB", cirE: "\u29C3", cire: "\u2257", cirfnint: "\u2A10", cirmid: "\u2AEF", cirscir: "\u29C2", ClockwiseContourIntegral: "\u2232", CloseCurlyDoubleQuote: "\u201D", CloseCurlyQuote: "\u2019", clubs: "\u2663", clubsuit: "\u2663", colon: ":", Colon: "\u2237", Colone: "\u2A74", colone: "\u2254", coloneq: "\u2254", comma: ",", commat: "@", comp: "\u2201", compfn: "\u2218", complement: "\u2201", complexes: "\u2102", cong: "\u2245", congdot: "\u2A6D", Congruent: "\u2261", conint: "\u222E", Conint: "\u222F", ContourIntegral: "\u222E", copf: "\u{1D554}", Copf: "\u2102", coprod: "\u2210", Coproduct: "\u2210", copy: "\xA9", COPY: "\xA9", copysr: "\u2117", CounterClockwiseContourIntegral: "\u2233", crarr: "\u21B5", cross: "\u2717", Cross: "\u2A2F", Cscr: "\u{1D49E}", cscr: "\u{1D4B8}", csub: "\u2ACF", csube: "\u2AD1", csup: "\u2AD0", csupe: "\u2AD2", ctdot: "\u22EF", cudarrl: "\u2938", cudarrr: "\u2935", cuepr: "\u22DE", cuesc: "\u22DF", cularr: "\u21B6", cularrp: "\u293D", cupbrcap: "\u2A48", cupcap: "\u2A46", CupCap: "\u224D", cup: "\u222A", Cup: "\u22D3", cupcup: "\u2A4A", cupdot: "\u228D", cupor: "\u2A45", cups: "\u222A\uFE00", curarr: "\u21B7", curarrm: "\u293C", curlyeqprec: "\u22DE", curlyeqsucc: "\u22DF", curlyvee: "\u22CE", curlywedge: "\u22CF", curren: "\xA4", curvearrowleft: "\u21B6", curvearrowright: "\u21B7", cuvee: "\u22CE", cuwed: "\u22CF", cwconint: "\u2232", cwint: "\u2231", cylcty: "\u232D", dagger: "\u2020", Dagger: "\u2021", daleth: "\u2138", darr: "\u2193", Darr: "\u21A1", dArr: "\u21D3", dash: "\u2010", Dashv: "\u2AE4", dashv: "\u22A3", dbkarow: "\u290F", dblac: "\u02DD", Dcaron: "\u010E", dcaron: "\u010F", Dcy: "\u0414", dcy: "\u0434", ddagger: "\u2021", ddarr: "\u21CA", DD: "\u2145", dd: "\u2146", DDotrahd: "\u2911", ddotseq: "\u2A77", deg: "\xB0", Del: "\u2207", Delta: "\u0394", delta: "\u03B4", demptyv: "\u29B1", dfisht: "\u297F", Dfr: "\u{1D507}", dfr: "\u{1D521}", dHar: "\u2965", dharl: "\u21C3", dharr: "\u21C2", DiacriticalAcute: "\xB4", DiacriticalDot: "\u02D9", DiacriticalDoubleAcute: "\u02DD", DiacriticalGrave: "`", DiacriticalTilde: "\u02DC", diam: "\u22C4", diamond: "\u22C4", Diamond: "\u22C4", diamondsuit: "\u2666", diams: "\u2666", die: "\xA8", DifferentialD: "\u2146", digamma: "\u03DD", disin: "\u22F2", div: "\xF7", divide: "\xF7", divideontimes: "\u22C7", divonx: "\u22C7", DJcy: "\u0402", djcy: "\u0452", dlcorn: "\u231E", dlcrop: "\u230D", dollar: "$", Dopf: "\u{1D53B}", dopf: "\u{1D555}", Dot: "\xA8", dot: "\u02D9", DotDot: "\u20DC", doteq: "\u2250", doteqdot: "\u2251", DotEqual: "\u2250", dotminus: "\u2238", dotplus: "\u2214", dotsquare: "\u22A1", doublebarwedge: "\u2306", DoubleContourIntegral: "\u222F", DoubleDot: "\xA8", DoubleDownArrow: "\u21D3", DoubleLeftArrow: "\u21D0", DoubleLeftRightArrow: "\u21D4", DoubleLeftTee: "\u2AE4", DoubleLongLeftArrow: "\u27F8", DoubleLongLeftRightArrow: "\u27FA", DoubleLongRightArrow: "\u27F9", DoubleRightArrow: "\u21D2", DoubleRightTee: "\u22A8", DoubleUpArrow: "\u21D1", DoubleUpDownArrow: "\u21D5", DoubleVerticalBar: "\u2225", DownArrowBar: "\u2913", downarrow: "\u2193", DownArrow: "\u2193", Downarrow: "\u21D3", DownArrowUpArrow: "\u21F5", DownBreve: "\u0311", downdownarrows: "\u21CA", downharpoonleft: "\u21C3", downharpoonright: "\u21C2", DownLeftRightVector: "\u2950", DownLeftTeeVector: "\u295E", DownLeftVectorBar: "\u2956", DownLeftVector: "\u21BD", DownRightTeeVector: "\u295F", DownRightVectorBar: "\u2957", DownRightVector: "\u21C1", DownTeeArrow: "\u21A7", DownTee: "\u22A4", drbkarow: "\u2910", drcorn: "\u231F", drcrop: "\u230C", Dscr: "\u{1D49F}", dscr: "\u{1D4B9}", DScy: "\u0405", dscy: "\u0455", dsol: "\u29F6", Dstrok: "\u0110", dstrok: "\u0111", dtdot: "\u22F1", dtri: "\u25BF", dtrif: "\u25BE", duarr: "\u21F5", duhar: "\u296F", dwangle: "\u29A6", DZcy: "\u040F", dzcy: "\u045F", dzigrarr: "\u27FF", Eacute: "\xC9", eacute: "\xE9", easter: "\u2A6E", Ecaron: "\u011A", ecaron: "\u011B", Ecirc: "\xCA", ecirc: "\xEA", ecir: "\u2256", ecolon: "\u2255", Ecy: "\u042D", ecy: "\u044D", eDDot: "\u2A77", Edot: "\u0116", edot: "\u0117", eDot: "\u2251", ee: "\u2147", efDot: "\u2252", Efr: "\u{1D508}", efr: "\u{1D522}", eg: "\u2A9A", Egrave: "\xC8", egrave: "\xE8", egs: "\u2A96", egsdot: "\u2A98", el: "\u2A99", Element: "\u2208", elinters: "\u23E7", ell: "\u2113", els: "\u2A95", elsdot: "\u2A97", Emacr: "\u0112", emacr: "\u0113", empty: "\u2205", emptyset: "\u2205", EmptySmallSquare: "\u25FB", emptyv: "\u2205", EmptyVerySmallSquare: "\u25AB", emsp13: "\u2004", emsp14: "\u2005", emsp: "\u2003", ENG: "\u014A", eng: "\u014B", ensp: "\u2002", Eogon: "\u0118", eogon: "\u0119", Eopf: "\u{1D53C}", eopf: "\u{1D556}", epar: "\u22D5", eparsl: "\u29E3", eplus: "\u2A71", epsi: "\u03B5", Epsilon: "\u0395", epsilon: "\u03B5", epsiv: "\u03F5", eqcirc: "\u2256", eqcolon: "\u2255", eqsim: "\u2242", eqslantgtr: "\u2A96", eqslantless: "\u2A95", Equal: "\u2A75", equals: "=", EqualTilde: "\u2242", equest: "\u225F", Equilibrium: "\u21CC", equiv: "\u2261", equivDD: "\u2A78", eqvparsl: "\u29E5", erarr: "\u2971", erDot: "\u2253", escr: "\u212F", Escr: "\u2130", esdot: "\u2250", Esim: "\u2A73", esim: "\u2242", Eta: "\u0397", eta: "\u03B7", ETH: "\xD0", eth: "\xF0", Euml: "\xCB", euml: "\xEB", euro: "\u20AC", excl: "!", exist: "\u2203", Exists: "\u2203", expectation: "\u2130", exponentiale: "\u2147", ExponentialE: "\u2147", fallingdotseq: "\u2252", Fcy: "\u0424", fcy: "\u0444", female: "\u2640", ffilig: "\uFB03", fflig: "\uFB00", ffllig: "\uFB04", Ffr: "\u{1D509}", ffr: "\u{1D523}", filig: "\uFB01", FilledSmallSquare: "\u25FC", FilledVerySmallSquare: "\u25AA", fjlig: "fj", flat: "\u266D", fllig: "\uFB02", fltns: "\u25B1", fnof: "\u0192", Fopf: "\u{1D53D}", fopf: "\u{1D557}", forall: "\u2200", ForAll: "\u2200", fork: "\u22D4", forkv: "\u2AD9", Fouriertrf: "\u2131", fpartint: "\u2A0D", frac12: "\xBD", frac13: "\u2153", frac14: "\xBC", frac15: "\u2155", frac16: "\u2159", frac18: "\u215B", frac23: "\u2154", frac25: "\u2156", frac34: "\xBE", frac35: "\u2157", frac38: "\u215C", frac45: "\u2158", frac56: "\u215A", frac58: "\u215D", frac78: "\u215E", frasl: "\u2044", frown: "\u2322", fscr: "\u{1D4BB}", Fscr: "\u2131", gacute: "\u01F5", Gamma: "\u0393", gamma: "\u03B3", Gammad: "\u03DC", gammad: "\u03DD", gap: "\u2A86", Gbreve: "\u011E", gbreve: "\u011F", Gcedil: "\u0122", Gcirc: "\u011C", gcirc: "\u011D", Gcy: "\u0413", gcy: "\u0433", Gdot: "\u0120", gdot: "\u0121", ge: "\u2265", gE: "\u2267", gEl: "\u2A8C", gel: "\u22DB", geq: "\u2265", geqq: "\u2267", geqslant: "\u2A7E", gescc: "\u2AA9", ges: "\u2A7E", gesdot: "\u2A80", gesdoto: "\u2A82", gesdotol: "\u2A84", gesl: "\u22DB\uFE00", gesles: "\u2A94", Gfr: "\u{1D50A}", gfr: "\u{1D524}", gg: "\u226B", Gg: "\u22D9", ggg: "\u22D9", gimel: "\u2137", GJcy: "\u0403", gjcy: "\u0453", gla: "\u2AA5", gl: "\u2277", glE: "\u2A92", glj: "\u2AA4", gnap: "\u2A8A", gnapprox: "\u2A8A", gne: "\u2A88", gnE: "\u2269", gneq: "\u2A88", gneqq: "\u2269", gnsim: "\u22E7", Gopf: "\u{1D53E}", gopf: "\u{1D558}", grave: "`", GreaterEqual: "\u2265", GreaterEqualLess: "\u22DB", GreaterFullEqual: "\u2267", GreaterGreater: "\u2AA2", GreaterLess: "\u2277", GreaterSlantEqual: "\u2A7E", GreaterTilde: "\u2273", Gscr: "\u{1D4A2}", gscr: "\u210A", gsim: "\u2273", gsime: "\u2A8E", gsiml: "\u2A90", gtcc: "\u2AA7", gtcir: "\u2A7A", gt: ">", GT: ">", Gt: "\u226B", gtdot: "\u22D7", gtlPar: "\u2995", gtquest: "\u2A7C", gtrapprox: "\u2A86", gtrarr: "\u2978", gtrdot: "\u22D7", gtreqless: "\u22DB", gtreqqless: "\u2A8C", gtrless: "\u2277", gtrsim: "\u2273", gvertneqq: "\u2269\uFE00", gvnE: "\u2269\uFE00", Hacek: "\u02C7", hairsp: "\u200A", half: "\xBD", hamilt: "\u210B", HARDcy: "\u042A", hardcy: "\u044A", harrcir: "\u2948", harr: "\u2194", hArr: "\u21D4", harrw: "\u21AD", Hat: "^", hbar: "\u210F", Hcirc: "\u0124", hcirc: "\u0125", hearts: "\u2665", heartsuit: "\u2665", hellip: "\u2026", hercon: "\u22B9", hfr: "\u{1D525}", Hfr: "\u210C", HilbertSpace: "\u210B", hksearow: "\u2925", hkswarow: "\u2926", hoarr: "\u21FF", homtht: "\u223B", hookleftarrow: "\u21A9", hookrightarrow: "\u21AA", hopf: "\u{1D559}", Hopf: "\u210D", horbar: "\u2015", HorizontalLine: "\u2500", hscr: "\u{1D4BD}", Hscr: "\u210B", hslash: "\u210F", Hstrok: "\u0126", hstrok: "\u0127", HumpDownHump: "\u224E", HumpEqual: "\u224F", hybull: "\u2043", hyphen: "\u2010", Iacute: "\xCD", iacute: "\xED", ic: "\u2063", Icirc: "\xCE", icirc: "\xEE", Icy: "\u0418", icy: "\u0438", Idot: "\u0130", IEcy: "\u0415", iecy: "\u0435", iexcl: "\xA1", iff: "\u21D4", ifr: "\u{1D526}", Ifr: "\u2111", Igrave: "\xCC", igrave: "\xEC", ii: "\u2148", iiiint: "\u2A0C", iiint: "\u222D", iinfin: "\u29DC", iiota: "\u2129", IJlig: "\u0132", ijlig: "\u0133", Imacr: "\u012A", imacr: "\u012B", image: "\u2111", ImaginaryI: "\u2148", imagline: "\u2110", imagpart: "\u2111", imath: "\u0131", Im: "\u2111", imof: "\u22B7", imped: "\u01B5", Implies: "\u21D2", incare: "\u2105", in: "\u2208", infin: "\u221E", infintie: "\u29DD", inodot: "\u0131", intcal: "\u22BA", int: "\u222B", Int: "\u222C", integers: "\u2124", Integral: "\u222B", intercal: "\u22BA", Intersection: "\u22C2", intlarhk: "\u2A17", intprod: "\u2A3C", InvisibleComma: "\u2063", InvisibleTimes: "\u2062", IOcy: "\u0401", iocy: "\u0451", Iogon: "\u012E", iogon: "\u012F", Iopf: "\u{1D540}", iopf: "\u{1D55A}", Iota: "\u0399", iota: "\u03B9", iprod: "\u2A3C", iquest: "\xBF", iscr: "\u{1D4BE}", Iscr: "\u2110", isin: "\u2208", isindot: "\u22F5", isinE: "\u22F9", isins: "\u22F4", isinsv: "\u22F3", isinv: "\u2208", it: "\u2062", Itilde: "\u0128", itilde: "\u0129", Iukcy: "\u0406", iukcy: "\u0456", Iuml: "\xCF", iuml: "\xEF", Jcirc: "\u0134", jcirc: "\u0135", Jcy: "\u0419", jcy: "\u0439", Jfr: "\u{1D50D}", jfr: "\u{1D527}", jmath: "\u0237", Jopf: "\u{1D541}", jopf: "\u{1D55B}", Jscr: "\u{1D4A5}", jscr: "\u{1D4BF}", Jsercy: "\u0408", jsercy: "\u0458", Jukcy: "\u0404", jukcy: "\u0454", Kappa: "\u039A", kappa: "\u03BA", kappav: "\u03F0", Kcedil: "\u0136", kcedil: "\u0137", Kcy: "\u041A", kcy: "\u043A", Kfr: "\u{1D50E}", kfr: "\u{1D528}", kgreen: "\u0138", KHcy: "\u0425", khcy: "\u0445", KJcy: "\u040C", kjcy: "\u045C", Kopf: "\u{1D542}", kopf: "\u{1D55C}", Kscr: "\u{1D4A6}", kscr: "\u{1D4C0}", lAarr: "\u21DA", Lacute: "\u0139", lacute: "\u013A", laemptyv: "\u29B4", lagran: "\u2112", Lambda: "\u039B", lambda: "\u03BB", lang: "\u27E8", Lang: "\u27EA", langd: "\u2991", langle: "\u27E8", lap: "\u2A85", Laplacetrf: "\u2112", laquo: "\xAB", larrb: "\u21E4", larrbfs: "\u291F", larr: "\u2190", Larr: "\u219E", lArr: "\u21D0", larrfs: "\u291D", larrhk: "\u21A9", larrlp: "\u21AB", larrpl: "\u2939", larrsim: "\u2973", larrtl: "\u21A2", latail: "\u2919", lAtail: "\u291B", lat: "\u2AAB", late: "\u2AAD", lates: "\u2AAD\uFE00", lbarr: "\u290C", lBarr: "\u290E", lbbrk: "\u2772", lbrace: "{", lbrack: "[", lbrke: "\u298B", lbrksld: "\u298F", lbrkslu: "\u298D", Lcaron: "\u013D", lcaron: "\u013E", Lcedil: "\u013B", lcedil: "\u013C", lceil: "\u2308", lcub: "{", Lcy: "\u041B", lcy: "\u043B", ldca: "\u2936", ldquo: "\u201C", ldquor: "\u201E", ldrdhar: "\u2967", ldrushar: "\u294B", ldsh: "\u21B2", le: "\u2264", lE: "\u2266", LeftAngleBracket: "\u27E8", LeftArrowBar: "\u21E4", leftarrow: "\u2190", LeftArrow: "\u2190", Leftarrow: "\u21D0", LeftArrowRightArrow: "\u21C6", leftarrowtail: "\u21A2", LeftCeiling: "\u2308", LeftDoubleBracket: "\u27E6", LeftDownTeeVector: "\u2961", LeftDownVectorBar: "\u2959", LeftDownVector: "\u21C3", LeftFloor: "\u230A", leftharpoondown: "\u21BD", leftharpoonup: "\u21BC", leftleftarrows: "\u21C7", leftrightarrow: "\u2194", LeftRightArrow: "\u2194", Leftrightarrow: "\u21D4", leftrightarrows: "\u21C6", leftrightharpoons: "\u21CB", leftrightsquigarrow: "\u21AD", LeftRightVector: "\u294E", LeftTeeArrow: "\u21A4", LeftTee: "\u22A3", LeftTeeVector: "\u295A", leftthreetimes: "\u22CB", LeftTriangleBar: "\u29CF", LeftTriangle: "\u22B2", LeftTriangleEqual: "\u22B4", LeftUpDownVector: "\u2951", LeftUpTeeVector: "\u2960", LeftUpVectorBar: "\u2958", LeftUpVector: "\u21BF", LeftVectorBar: "\u2952", LeftVector: "\u21BC", lEg: "\u2A8B", leg: "\u22DA", leq: "\u2264", leqq: "\u2266", leqslant: "\u2A7D", lescc: "\u2AA8", les: "\u2A7D", lesdot: "\u2A7F", lesdoto: "\u2A81", lesdotor: "\u2A83", lesg: "\u22DA\uFE00", lesges: "\u2A93", lessapprox: "\u2A85", lessdot: "\u22D6", lesseqgtr: "\u22DA", lesseqqgtr: "\u2A8B", LessEqualGreater: "\u22DA", LessFullEqual: "\u2266", LessGreater: "\u2276", lessgtr: "\u2276", LessLess: "\u2AA1", lesssim: "\u2272", LessSlantEqual: "\u2A7D", LessTilde: "\u2272", lfisht: "\u297C", lfloor: "\u230A", Lfr: "\u{1D50F}", lfr: "\u{1D529}", lg: "\u2276", lgE: "\u2A91", lHar: "\u2962", lhard: "\u21BD", lharu: "\u21BC", lharul: "\u296A", lhblk: "\u2584", LJcy: "\u0409", ljcy: "\u0459", llarr: "\u21C7", ll: "\u226A", Ll: "\u22D8", llcorner: "\u231E", Lleftarrow: "\u21DA", llhard: "\u296B", lltri: "\u25FA", Lmidot: "\u013F", lmidot: "\u0140", lmoustache: "\u23B0", lmoust: "\u23B0", lnap: "\u2A89", lnapprox: "\u2A89", lne: "\u2A87", lnE: "\u2268", lneq: "\u2A87", lneqq: "\u2268", lnsim: "\u22E6", loang: "\u27EC", loarr: "\u21FD", lobrk: "\u27E6", longleftarrow: "\u27F5", LongLeftArrow: "\u27F5", Longleftarrow: "\u27F8", longleftrightarrow: "\u27F7", LongLeftRightArrow: "\u27F7", Longleftrightarrow: "\u27FA", longmapsto: "\u27FC", longrightarrow: "\u27F6", LongRightArrow: "\u27F6", Longrightarrow: "\u27F9", looparrowleft: "\u21AB", looparrowright: "\u21AC", lopar: "\u2985", Lopf: "\u{1D543}", lopf: "\u{1D55D}", loplus: "\u2A2D", lotimes: "\u2A34", lowast: "\u2217", lowbar: "_", LowerLeftArrow: "\u2199", LowerRightArrow: "\u2198", loz: "\u25CA", lozenge: "\u25CA", lozf: "\u29EB", lpar: "(", lparlt: "\u2993", lrarr: "\u21C6", lrcorner: "\u231F", lrhar: "\u21CB", lrhard: "\u296D", lrm: "\u200E", lrtri: "\u22BF", lsaquo: "\u2039", lscr: "\u{1D4C1}", Lscr: "\u2112", lsh: "\u21B0", Lsh: "\u21B0", lsim: "\u2272", lsime: "\u2A8D", lsimg: "\u2A8F", lsqb: "[", lsquo: "\u2018", lsquor: "\u201A", Lstrok: "\u0141", lstrok: "\u0142", ltcc: "\u2AA6", ltcir: "\u2A79", lt: "<", LT: "<", Lt: "\u226A", ltdot: "\u22D6", lthree: "\u22CB", ltimes: "\u22C9", ltlarr: "\u2976", ltquest: "\u2A7B", ltri: "\u25C3", ltrie: "\u22B4", ltrif: "\u25C2", ltrPar: "\u2996", lurdshar: "\u294A", luruhar: "\u2966", lvertneqq: "\u2268\uFE00", lvnE: "\u2268\uFE00", macr: "\xAF", male: "\u2642", malt: "\u2720", maltese: "\u2720", Map: "\u2905", map: "\u21A6", mapsto: "\u21A6", mapstodown: "\u21A7", mapstoleft: "\u21A4", mapstoup: "\u21A5", marker: "\u25AE", mcomma: "\u2A29", Mcy: "\u041C", mcy: "\u043C", mdash: "\u2014", mDDot: "\u223A", measuredangle: "\u2221", MediumSpace: "\u205F", Mellintrf: "\u2133", Mfr: "\u{1D510}", mfr: "\u{1D52A}", mho: "\u2127", micro: "\xB5", midast: "*", midcir: "\u2AF0", mid: "\u2223", middot: "\xB7", minusb: "\u229F", minus: "\u2212", minusd: "\u2238", minusdu: "\u2A2A", MinusPlus: "\u2213", mlcp: "\u2ADB", mldr: "\u2026", mnplus: "\u2213", models: "\u22A7", Mopf: "\u{1D544}", mopf: "\u{1D55E}", mp: "\u2213", mscr: "\u{1D4C2}", Mscr: "\u2133", mstpos: "\u223E", Mu: "\u039C", mu: "\u03BC", multimap: "\u22B8", mumap: "\u22B8", nabla: "\u2207", Nacute: "\u0143", nacute: "\u0144", nang: "\u2220\u20D2", nap: "\u2249", napE: "\u2A70\u0338", napid: "\u224B\u0338", napos: "\u0149", napprox: "\u2249", natural: "\u266E", naturals: "\u2115", natur: "\u266E", nbsp: "\xA0", nbump: "\u224E\u0338", nbumpe: "\u224F\u0338", ncap: "\u2A43", Ncaron: "\u0147", ncaron: "\u0148", Ncedil: "\u0145", ncedil: "\u0146", ncong: "\u2247", ncongdot: "\u2A6D\u0338", ncup: "\u2A42", Ncy: "\u041D", ncy: "\u043D", ndash: "\u2013", nearhk: "\u2924", nearr: "\u2197", neArr: "\u21D7", nearrow: "\u2197", ne: "\u2260", nedot: "\u2250\u0338", NegativeMediumSpace: "\u200B", NegativeThickSpace: "\u200B", NegativeThinSpace: "\u200B", NegativeVeryThinSpace: "\u200B", nequiv: "\u2262", nesear: "\u2928", nesim: "\u2242\u0338", NestedGreaterGreater: "\u226B", NestedLessLess: "\u226A", NewLine: "\n", nexist: "\u2204", nexists: "\u2204", Nfr: "\u{1D511}", nfr: "\u{1D52B}", ngE: "\u2267\u0338", nge: "\u2271", ngeq: "\u2271", ngeqq: "\u2267\u0338", ngeqslant: "\u2A7E\u0338", nges: "\u2A7E\u0338", nGg: "\u22D9\u0338", ngsim: "\u2275", nGt: "\u226B\u20D2", ngt: "\u226F", ngtr: "\u226F", nGtv: "\u226B\u0338", nharr: "\u21AE", nhArr: "\u21CE", nhpar: "\u2AF2", ni: "\u220B", nis: "\u22FC", nisd: "\u22FA", niv: "\u220B", NJcy: "\u040A", njcy: "\u045A", nlarr: "\u219A", nlArr: "\u21CD", nldr: "\u2025", nlE: "\u2266\u0338", nle: "\u2270", nleftarrow: "\u219A", nLeftarrow: "\u21CD", nleftrightarrow: "\u21AE", nLeftrightarrow: "\u21CE", nleq: "\u2270", nleqq: "\u2266\u0338", nleqslant: "\u2A7D\u0338", nles: "\u2A7D\u0338", nless: "\u226E", nLl: "\u22D8\u0338", nlsim: "\u2274", nLt: "\u226A\u20D2", nlt: "\u226E", nltri: "\u22EA", nltrie: "\u22EC", nLtv: "\u226A\u0338", nmid: "\u2224", NoBreak: "\u2060", NonBreakingSpace: "\xA0", nopf: "\u{1D55F}", Nopf: "\u2115", Not: "\u2AEC", not: "\xAC", NotCongruent: "\u2262", NotCupCap: "\u226D", NotDoubleVerticalBar: "\u2226", NotElement: "\u2209", NotEqual: "\u2260", NotEqualTilde: "\u2242\u0338", NotExists: "\u2204", NotGreater: "\u226F", NotGreaterEqual: "\u2271", NotGreaterFullEqual: "\u2267\u0338", NotGreaterGreater: "\u226B\u0338", NotGreaterLess: "\u2279", NotGreaterSlantEqual: "\u2A7E\u0338", NotGreaterTilde: "\u2275", NotHumpDownHump: "\u224E\u0338", NotHumpEqual: "\u224F\u0338", notin: "\u2209", notindot: "\u22F5\u0338", notinE: "\u22F9\u0338", notinva: "\u2209", notinvb: "\u22F7", notinvc: "\u22F6", NotLeftTriangleBar: "\u29CF\u0338", NotLeftTriangle: "\u22EA", NotLeftTriangleEqual: "\u22EC", NotLess: "\u226E", NotLessEqual: "\u2270", NotLessGreater: "\u2278", NotLessLess: "\u226A\u0338", NotLessSlantEqual: "\u2A7D\u0338", NotLessTilde: "\u2274", NotNestedGreaterGreater: "\u2AA2\u0338", NotNestedLessLess: "\u2AA1\u0338", notni: "\u220C", notniva: "\u220C", notnivb: "\u22FE", notnivc: "\u22FD", NotPrecedes: "\u2280", NotPrecedesEqual: "\u2AAF\u0338", NotPrecedesSlantEqual: "\u22E0", NotReverseElement: "\u220C", NotRightTriangleBar: "\u29D0\u0338", NotRightTriangle: "\u22EB", NotRightTriangleEqual: "\u22ED", NotSquareSubset: "\u228F\u0338", NotSquareSubsetEqual: "\u22E2", NotSquareSuperset: "\u2290\u0338", NotSquareSupersetEqual: "\u22E3", NotSubset: "\u2282\u20D2", NotSubsetEqual: "\u2288", NotSucceeds: "\u2281", NotSucceedsEqual: "\u2AB0\u0338", NotSucceedsSlantEqual: "\u22E1", NotSucceedsTilde: "\u227F\u0338", NotSuperset: "\u2283\u20D2", NotSupersetEqual: "\u2289", NotTilde: "\u2241", NotTildeEqual: "\u2244", NotTildeFullEqual: "\u2247", NotTildeTilde: "\u2249", NotVerticalBar: "\u2224", nparallel: "\u2226", npar: "\u2226", nparsl: "\u2AFD\u20E5", npart: "\u2202\u0338", npolint: "\u2A14", npr: "\u2280", nprcue: "\u22E0", nprec: "\u2280", npreceq: "\u2AAF\u0338", npre: "\u2AAF\u0338", nrarrc: "\u2933\u0338", nrarr: "\u219B", nrArr: "\u21CF", nrarrw: "\u219D\u0338", nrightarrow: "\u219B", nRightarrow: "\u21CF", nrtri: "\u22EB", nrtrie: "\u22ED", nsc: "\u2281", nsccue: "\u22E1", nsce: "\u2AB0\u0338", Nscr: "\u{1D4A9}", nscr: "\u{1D4C3}", nshortmid: "\u2224", nshortparallel: "\u2226", nsim: "\u2241", nsime: "\u2244", nsimeq: "\u2244", nsmid: "\u2224", nspar: "\u2226", nsqsube: "\u22E2", nsqsupe: "\u22E3", nsub: "\u2284", nsubE: "\u2AC5\u0338", nsube: "\u2288", nsubset: "\u2282\u20D2", nsubseteq: "\u2288", nsubseteqq: "\u2AC5\u0338", nsucc: "\u2281", nsucceq: "\u2AB0\u0338", nsup: "\u2285", nsupE: "\u2AC6\u0338", nsupe: "\u2289", nsupset: "\u2283\u20D2", nsupseteq: "\u2289", nsupseteqq: "\u2AC6\u0338", ntgl: "\u2279", Ntilde: "\xD1", ntilde: "\xF1", ntlg: "\u2278", ntriangleleft: "\u22EA", ntrianglelefteq: "\u22EC", ntriangleright: "\u22EB", ntrianglerighteq: "\u22ED", Nu: "\u039D", nu: "\u03BD", num: "#", numero: "\u2116", numsp: "\u2007", nvap: "\u224D\u20D2", nvdash: "\u22AC", nvDash: "\u22AD", nVdash: "\u22AE", nVDash: "\u22AF", nvge: "\u2265\u20D2", nvgt: ">\u20D2", nvHarr: "\u2904", nvinfin: "\u29DE", nvlArr: "\u2902", nvle: "\u2264\u20D2", nvlt: "<\u20D2", nvltrie: "\u22B4\u20D2", nvrArr: "\u2903", nvrtrie: "\u22B5\u20D2", nvsim: "\u223C\u20D2", nwarhk: "\u2923", nwarr: "\u2196", nwArr: "\u21D6", nwarrow: "\u2196", nwnear: "\u2927", Oacute: "\xD3", oacute: "\xF3", oast: "\u229B", Ocirc: "\xD4", ocirc: "\xF4", ocir: "\u229A", Ocy: "\u041E", ocy: "\u043E", odash: "\u229D", Odblac: "\u0150", odblac: "\u0151", odiv: "\u2A38", odot: "\u2299", odsold: "\u29BC", OElig: "\u0152", oelig: "\u0153", ofcir: "\u29BF", Ofr: "\u{1D512}", ofr: "\u{1D52C}", ogon: "\u02DB", Ograve: "\xD2", ograve: "\xF2", ogt: "\u29C1", ohbar: "\u29B5", ohm: "\u03A9", oint: "\u222E", olarr: "\u21BA", olcir: "\u29BE", olcross: "\u29BB", oline: "\u203E", olt: "\u29C0", Omacr: "\u014C", omacr: "\u014D", Omega: "\u03A9", omega: "\u03C9", Omicron: "\u039F", omicron: "\u03BF", omid: "\u29B6", ominus: "\u2296", Oopf: "\u{1D546}", oopf: "\u{1D560}", opar: "\u29B7", OpenCurlyDoubleQuote: "\u201C", OpenCurlyQuote: "\u2018", operp: "\u29B9", oplus: "\u2295", orarr: "\u21BB", Or: "\u2A54", or: "\u2228", ord: "\u2A5D", order: "\u2134", orderof: "\u2134", ordf: "\xAA", ordm: "\xBA", origof: "\u22B6", oror: "\u2A56", orslope: "\u2A57", orv: "\u2A5B", oS: "\u24C8", Oscr: "\u{1D4AA}", oscr: "\u2134", Oslash: "\xD8", oslash: "\xF8", osol: "\u2298", Otilde: "\xD5", otilde: "\xF5", otimesas: "\u2A36", Otimes: "\u2A37", otimes: "\u2297", Ouml: "\xD6", ouml: "\xF6", ovbar: "\u233D", OverBar: "\u203E", OverBrace: "\u23DE", OverBracket: "\u23B4", OverParenthesis: "\u23DC", para: "\xB6", parallel: "\u2225", par: "\u2225", parsim: "\u2AF3", parsl: "\u2AFD", part: "\u2202", PartialD: "\u2202", Pcy: "\u041F", pcy: "\u043F", percnt: "%", period: ".", permil: "\u2030", perp: "\u22A5", pertenk: "\u2031", Pfr: "\u{1D513}", pfr: "\u{1D52D}", Phi: "\u03A6", phi: "\u03C6", phiv: "\u03D5", phmmat: "\u2133", phone: "\u260E", Pi: "\u03A0", pi: "\u03C0", pitchfork: "\u22D4", piv: "\u03D6", planck: "\u210F", planckh: "\u210E", plankv: "\u210F", plusacir: "\u2A23", plusb: "\u229E", pluscir: "\u2A22", plus: "+", plusdo: "\u2214", plusdu: "\u2A25", pluse: "\u2A72", PlusMinus: "\xB1", plusmn: "\xB1", plussim: "\u2A26", plustwo: "\u2A27", pm: "\xB1", Poincareplane: "\u210C", pointint: "\u2A15", popf: "\u{1D561}", Popf: "\u2119", pound: "\xA3", prap: "\u2AB7", Pr: "\u2ABB", pr: "\u227A", prcue: "\u227C", precapprox: "\u2AB7", prec: "\u227A", preccurlyeq: "\u227C", Precedes: "\u227A", PrecedesEqual: "\u2AAF", PrecedesSlantEqual: "\u227C", PrecedesTilde: "\u227E", preceq: "\u2AAF", precnapprox: "\u2AB9", precneqq: "\u2AB5", precnsim: "\u22E8", pre: "\u2AAF", prE: "\u2AB3", precsim: "\u227E", prime: "\u2032", Prime: "\u2033", primes: "\u2119", prnap: "\u2AB9", prnE: "\u2AB5", prnsim: "\u22E8", prod: "\u220F", Product: "\u220F", profalar: "\u232E", profline: "\u2312", profsurf: "\u2313", prop: "\u221D", Proportional: "\u221D", Proportion: "\u2237", propto: "\u221D", prsim: "\u227E", prurel: "\u22B0", Pscr: "\u{1D4AB}", pscr: "\u{1D4C5}", Psi: "\u03A8", psi: "\u03C8", puncsp: "\u2008", Qfr: "\u{1D514}", qfr: "\u{1D52E}", qint: "\u2A0C", qopf: "\u{1D562}", Qopf: "\u211A", qprime: "\u2057", Qscr: "\u{1D4AC}", qscr: "\u{1D4C6}", quaternions: "\u210D", quatint: "\u2A16", quest: "?", questeq: "\u225F", quot: '"', QUOT: '"', rAarr: "\u21DB", race: "\u223D\u0331", Racute: "\u0154", racute: "\u0155", radic: "\u221A", raemptyv: "\u29B3", rang: "\u27E9", Rang: "\u27EB", rangd: "\u2992", range: "\u29A5", rangle: "\u27E9", raquo: "\xBB", rarrap: "\u2975", rarrb: "\u21E5", rarrbfs: "\u2920", rarrc: "\u2933", rarr: "\u2192", Rarr: "\u21A0", rArr: "\u21D2", rarrfs: "\u291E", rarrhk: "\u21AA", rarrlp: "\u21AC", rarrpl: "\u2945", rarrsim: "\u2974", Rarrtl: "\u2916", rarrtl: "\u21A3", rarrw: "\u219D", ratail: "\u291A", rAtail: "\u291C", ratio: "\u2236", rationals: "\u211A", rbarr: "\u290D", rBarr: "\u290F", RBarr: "\u2910", rbbrk: "\u2773", rbrace: "}", rbrack: "]", rbrke: "\u298C", rbrksld: "\u298E", rbrkslu: "\u2990", Rcaron: "\u0158", rcaron: "\u0159", Rcedil: "\u0156", rcedil: "\u0157", rceil: "\u2309", rcub: "}", Rcy: "\u0420", rcy: "\u0440", rdca: "\u2937", rdldhar: "\u2969", rdquo: "\u201D", rdquor: "\u201D", rdsh: "\u21B3", real: "\u211C", realine: "\u211B", realpart: "\u211C", reals: "\u211D", Re: "\u211C", rect: "\u25AD", reg: "\xAE", REG: "\xAE", ReverseElement: "\u220B", ReverseEquilibrium: "\u21CB", ReverseUpEquilibrium: "\u296F", rfisht: "\u297D", rfloor: "\u230B", rfr: "\u{1D52F}", Rfr: "\u211C", rHar: "\u2964", rhard: "\u21C1", rharu: "\u21C0", rharul: "\u296C", Rho: "\u03A1", rho: "\u03C1", rhov: "\u03F1", RightAngleBracket: "\u27E9", RightArrowBar: "\u21E5", rightarrow: "\u2192", RightArrow: "\u2192", Rightarrow: "\u21D2", RightArrowLeftArrow: "\u21C4", rightarrowtail: "\u21A3", RightCeiling: "\u2309", RightDoubleBracket: "\u27E7", RightDownTeeVector: "\u295D", RightDownVectorBar: "\u2955", RightDownVector: "\u21C2", RightFloor: "\u230B", rightharpoondown: "\u21C1", rightharpoonup: "\u21C0", rightleftarrows: "\u21C4", rightleftharpoons: "\u21CC", rightrightarrows: "\u21C9", rightsquigarrow: "\u219D", RightTeeArrow: "\u21A6", RightTee: "\u22A2", RightTeeVector: "\u295B", rightthreetimes: "\u22CC", RightTriangleBar: "\u29D0", RightTriangle: "\u22B3", RightTriangleEqual: "\u22B5", RightUpDownVector: "\u294F", RightUpTeeVector: "\u295C", RightUpVectorBar: "\u2954", RightUpVector: "\u21BE", RightVectorBar: "\u2953", RightVector: "\u21C0", ring: "\u02DA", risingdotseq: "\u2253", rlarr: "\u21C4", rlhar: "\u21CC", rlm: "\u200F", rmoustache: "\u23B1", rmoust: "\u23B1", rnmid: "\u2AEE", roang: "\u27ED", roarr: "\u21FE", robrk: "\u27E7", ropar: "\u2986", ropf: "\u{1D563}", Ropf: "\u211D", roplus: "\u2A2E", rotimes: "\u2A35", RoundImplies: "\u2970", rpar: ")", rpargt: "\u2994", rppolint: "\u2A12", rrarr: "\u21C9", Rrightarrow: "\u21DB", rsaquo: "\u203A", rscr: "\u{1D4C7}", Rscr: "\u211B", rsh: "\u21B1", Rsh: "\u21B1", rsqb: "]", rsquo: "\u2019", rsquor: "\u2019", rthree: "\u22CC", rtimes: "\u22CA", rtri: "\u25B9", rtrie: "\u22B5", rtrif: "\u25B8", rtriltri: "\u29CE", RuleDelayed: "\u29F4", ruluhar: "\u2968", rx: "\u211E", Sacute: "\u015A", sacute: "\u015B", sbquo: "\u201A", scap: "\u2AB8", Scaron: "\u0160", scaron: "\u0161", Sc: "\u2ABC", sc: "\u227B", sccue: "\u227D", sce: "\u2AB0", scE: "\u2AB4", Scedil: "\u015E", scedil: "\u015F", Scirc: "\u015C", scirc: "\u015D", scnap: "\u2ABA", scnE: "\u2AB6", scnsim: "\u22E9", scpolint: "\u2A13", scsim: "\u227F", Scy: "\u0421", scy: "\u0441", sdotb: "\u22A1", sdot: "\u22C5", sdote: "\u2A66", searhk: "\u2925", searr: "\u2198", seArr: "\u21D8", searrow: "\u2198", sect: "\xA7", semi: ";", seswar: "\u2929", setminus: "\u2216", setmn: "\u2216", sext: "\u2736", Sfr: "\u{1D516}", sfr: "\u{1D530}", sfrown: "\u2322", sharp: "\u266F", SHCHcy: "\u0429", shchcy: "\u0449", SHcy: "\u0428", shcy: "\u0448", ShortDownArrow: "\u2193", ShortLeftArrow: "\u2190", shortmid: "\u2223", shortparallel: "\u2225", ShortRightArrow: "\u2192", ShortUpArrow: "\u2191", shy: "\xAD", Sigma: "\u03A3", sigma: "\u03C3", sigmaf: "\u03C2", sigmav: "\u03C2", sim: "\u223C", simdot: "\u2A6A", sime: "\u2243", simeq: "\u2243", simg: "\u2A9E", simgE: "\u2AA0", siml: "\u2A9D", simlE: "\u2A9F", simne: "\u2246", simplus: "\u2A24", simrarr: "\u2972", slarr: "\u2190", SmallCircle: "\u2218", smallsetminus: "\u2216", smashp: "\u2A33", smeparsl: "\u29E4", smid: "\u2223", smile: "\u2323", smt: "\u2AAA", smte: "\u2AAC", smtes: "\u2AAC\uFE00", SOFTcy: "\u042C", softcy: "\u044C", solbar: "\u233F", solb: "\u29C4", sol: "/", Sopf: "\u{1D54A}", sopf: "\u{1D564}", spades: "\u2660", spadesuit: "\u2660", spar: "\u2225", sqcap: "\u2293", sqcaps: "\u2293\uFE00", sqcup: "\u2294", sqcups: "\u2294\uFE00", Sqrt: "\u221A", sqsub: "\u228F", sqsube: "\u2291", sqsubset: "\u228F", sqsubseteq: "\u2291", sqsup: "\u2290", sqsupe: "\u2292", sqsupset: "\u2290", sqsupseteq: "\u2292", square: "\u25A1", Square: "\u25A1", SquareIntersection: "\u2293", SquareSubset: "\u228F", SquareSubsetEqual: "\u2291", SquareSuperset: "\u2290", SquareSupersetEqual: "\u2292", SquareUnion: "\u2294", squarf: "\u25AA", squ: "\u25A1", squf: "\u25AA", srarr: "\u2192", Sscr: "\u{1D4AE}", sscr: "\u{1D4C8}", ssetmn: "\u2216", ssmile: "\u2323", sstarf: "\u22C6", Star: "\u22C6", star: "\u2606", starf: "\u2605", straightepsilon: "\u03F5", straightphi: "\u03D5", strns: "\xAF", sub: "\u2282", Sub: "\u22D0", subdot: "\u2ABD", subE: "\u2AC5", sube: "\u2286", subedot: "\u2AC3", submult: "\u2AC1", subnE: "\u2ACB", subne: "\u228A", subplus: "\u2ABF", subrarr: "\u2979", subset: "\u2282", Subset: "\u22D0", subseteq: "\u2286", subseteqq: "\u2AC5", SubsetEqual: "\u2286", subsetneq: "\u228A", subsetneqq: "\u2ACB", subsim: "\u2AC7", subsub: "\u2AD5", subsup: "\u2AD3", succapprox: "\u2AB8", succ: "\u227B", succcurlyeq: "\u227D", Succeeds: "\u227B", SucceedsEqual: "\u2AB0", SucceedsSlantEqual: "\u227D", SucceedsTilde: "\u227F", succeq: "\u2AB0", succnapprox: "\u2ABA", succneqq: "\u2AB6", succnsim: "\u22E9", succsim: "\u227F", SuchThat: "\u220B", sum: "\u2211", Sum: "\u2211", sung: "\u266A", sup1: "\xB9", sup2: "\xB2", sup3: "\xB3", sup: "\u2283", Sup: "\u22D1", supdot: "\u2ABE", supdsub: "\u2AD8", supE: "\u2AC6", supe: "\u2287", supedot: "\u2AC4", Superset: "\u2283", SupersetEqual: "\u2287", suphsol: "\u27C9", suphsub: "\u2AD7", suplarr: "\u297B", supmult: "\u2AC2", supnE: "\u2ACC", supne: "\u228B", supplus: "\u2AC0", supset: "\u2283", Supset: "\u22D1", supseteq: "\u2287", supseteqq: "\u2AC6", supsetneq: "\u228B", supsetneqq: "\u2ACC", supsim: "\u2AC8", supsub: "\u2AD4", supsup: "\u2AD6", swarhk: "\u2926", swarr: "\u2199", swArr: "\u21D9", swarrow: "\u2199", swnwar: "\u292A", szlig: "\xDF", Tab: "	", target: "\u2316", Tau: "\u03A4", tau: "\u03C4", tbrk: "\u23B4", Tcaron: "\u0164", tcaron: "\u0165", Tcedil: "\u0162", tcedil: "\u0163", Tcy: "\u0422", tcy: "\u0442", tdot: "\u20DB", telrec: "\u2315", Tfr: "\u{1D517}", tfr: "\u{1D531}", there4: "\u2234", therefore: "\u2234", Therefore: "\u2234", Theta: "\u0398", theta: "\u03B8", thetasym: "\u03D1", thetav: "\u03D1", thickapprox: "\u2248", thicksim: "\u223C", ThickSpace: "\u205F\u200A", ThinSpace: "\u2009", thinsp: "\u2009", thkap: "\u2248", thksim: "\u223C", THORN: "\xDE", thorn: "\xFE", tilde: "\u02DC", Tilde: "\u223C", TildeEqual: "\u2243", TildeFullEqual: "\u2245", TildeTilde: "\u2248", timesbar: "\u2A31", timesb: "\u22A0", times: "\xD7", timesd: "\u2A30", tint: "\u222D", toea: "\u2928", topbot: "\u2336", topcir: "\u2AF1", top: "\u22A4", Topf: "\u{1D54B}", topf: "\u{1D565}", topfork: "\u2ADA", tosa: "\u2929", tprime: "\u2034", trade: "\u2122", TRADE: "\u2122", triangle: "\u25B5", triangledown: "\u25BF", triangleleft: "\u25C3", trianglelefteq: "\u22B4", triangleq: "\u225C", triangleright: "\u25B9", trianglerighteq: "\u22B5", tridot: "\u25EC", trie: "\u225C", triminus: "\u2A3A", TripleDot: "\u20DB", triplus: "\u2A39", trisb: "\u29CD", tritime: "\u2A3B", trpezium: "\u23E2", Tscr: "\u{1D4AF}", tscr: "\u{1D4C9}", TScy: "\u0426", tscy: "\u0446", TSHcy: "\u040B", tshcy: "\u045B", Tstrok: "\u0166", tstrok: "\u0167", twixt: "\u226C", twoheadleftarrow: "\u219E", twoheadrightarrow: "\u21A0", Uacute: "\xDA", uacute: "\xFA", uarr: "\u2191", Uarr: "\u219F", uArr: "\u21D1", Uarrocir: "\u2949", Ubrcy: "\u040E", ubrcy: "\u045E", Ubreve: "\u016C", ubreve: "\u016D", Ucirc: "\xDB", ucirc: "\xFB", Ucy: "\u0423", ucy: "\u0443", udarr: "\u21C5", Udblac: "\u0170", udblac: "\u0171", udhar: "\u296E", ufisht: "\u297E", Ufr: "\u{1D518}", ufr: "\u{1D532}", Ugrave: "\xD9", ugrave: "\xF9", uHar: "\u2963", uharl: "\u21BF", uharr: "\u21BE", uhblk: "\u2580", ulcorn: "\u231C", ulcorner: "\u231C", ulcrop: "\u230F", ultri: "\u25F8", Umacr: "\u016A", umacr: "\u016B", uml: "\xA8", UnderBar: "_", UnderBrace: "\u23DF", UnderBracket: "\u23B5", UnderParenthesis: "\u23DD", Union: "\u22C3", UnionPlus: "\u228E", Uogon: "\u0172", uogon: "\u0173", Uopf: "\u{1D54C}", uopf: "\u{1D566}", UpArrowBar: "\u2912", uparrow: "\u2191", UpArrow: "\u2191", Uparrow: "\u21D1", UpArrowDownArrow: "\u21C5", updownarrow: "\u2195", UpDownArrow: "\u2195", Updownarrow: "\u21D5", UpEquilibrium: "\u296E", upharpoonleft: "\u21BF", upharpoonright: "\u21BE", uplus: "\u228E", UpperLeftArrow: "\u2196", UpperRightArrow: "\u2197", upsi: "\u03C5", Upsi: "\u03D2", upsih: "\u03D2", Upsilon: "\u03A5", upsilon: "\u03C5", UpTeeArrow: "\u21A5", UpTee: "\u22A5", upuparrows: "\u21C8", urcorn: "\u231D", urcorner: "\u231D", urcrop: "\u230E", Uring: "\u016E", uring: "\u016F", urtri: "\u25F9", Uscr: "\u{1D4B0}", uscr: "\u{1D4CA}", utdot: "\u22F0", Utilde: "\u0168", utilde: "\u0169", utri: "\u25B5", utrif: "\u25B4", uuarr: "\u21C8", Uuml: "\xDC", uuml: "\xFC", uwangle: "\u29A7", vangrt: "\u299C", varepsilon: "\u03F5", varkappa: "\u03F0", varnothing: "\u2205", varphi: "\u03D5", varpi: "\u03D6", varpropto: "\u221D", varr: "\u2195", vArr: "\u21D5", varrho: "\u03F1", varsigma: "\u03C2", varsubsetneq: "\u228A\uFE00", varsubsetneqq: "\u2ACB\uFE00", varsupsetneq: "\u228B\uFE00", varsupsetneqq: "\u2ACC\uFE00", vartheta: "\u03D1", vartriangleleft: "\u22B2", vartriangleright: "\u22B3", vBar: "\u2AE8", Vbar: "\u2AEB", vBarv: "\u2AE9", Vcy: "\u0412", vcy: "\u0432", vdash: "\u22A2", vDash: "\u22A8", Vdash: "\u22A9", VDash: "\u22AB", Vdashl: "\u2AE6", veebar: "\u22BB", vee: "\u2228", Vee: "\u22C1", veeeq: "\u225A", vellip: "\u22EE", verbar: "|", Verbar: "\u2016", vert: "|", Vert: "\u2016", VerticalBar: "\u2223", VerticalLine: "|", VerticalSeparator: "\u2758", VerticalTilde: "\u2240", VeryThinSpace: "\u200A", Vfr: "\u{1D519}", vfr: "\u{1D533}", vltri: "\u22B2", vnsub: "\u2282\u20D2", vnsup: "\u2283\u20D2", Vopf: "\u{1D54D}", vopf: "\u{1D567}", vprop: "\u221D", vrtri: "\u22B3", Vscr: "\u{1D4B1}", vscr: "\u{1D4CB}", vsubnE: "\u2ACB\uFE00", vsubne: "\u228A\uFE00", vsupnE: "\u2ACC\uFE00", vsupne: "\u228B\uFE00", Vvdash: "\u22AA", vzigzag: "\u299A", Wcirc: "\u0174", wcirc: "\u0175", wedbar: "\u2A5F", wedge: "\u2227", Wedge: "\u22C0", wedgeq: "\u2259", weierp: "\u2118", Wfr: "\u{1D51A}", wfr: "\u{1D534}", Wopf: "\u{1D54E}", wopf: "\u{1D568}", wp: "\u2118", wr: "\u2240", wreath: "\u2240", Wscr: "\u{1D4B2}", wscr: "\u{1D4CC}", xcap: "\u22C2", xcirc: "\u25EF", xcup: "\u22C3", xdtri: "\u25BD", Xfr: "\u{1D51B}", xfr: "\u{1D535}", xharr: "\u27F7", xhArr: "\u27FA", Xi: "\u039E", xi: "\u03BE", xlarr: "\u27F5", xlArr: "\u27F8", xmap: "\u27FC", xnis: "\u22FB", xodot: "\u2A00", Xopf: "\u{1D54F}", xopf: "\u{1D569}", xoplus: "\u2A01", xotime: "\u2A02", xrarr: "\u27F6", xrArr: "\u27F9", Xscr: "\u{1D4B3}", xscr: "\u{1D4CD}", xsqcup: "\u2A06", xuplus: "\u2A04", xutri: "\u25B3", xvee: "\u22C1", xwedge: "\u22C0", Yacute: "\xDD", yacute: "\xFD", YAcy: "\u042F", yacy: "\u044F", Ycirc: "\u0176", ycirc: "\u0177", Ycy: "\u042B", ycy: "\u044B", yen: "\xA5", Yfr: "\u{1D51C}", yfr: "\u{1D536}", YIcy: "\u0407", yicy: "\u0457", Yopf: "\u{1D550}", yopf: "\u{1D56A}", Yscr: "\u{1D4B4}", yscr: "\u{1D4CE}", YUcy: "\u042E", yucy: "\u044E", yuml: "\xFF", Yuml: "\u0178", Zacute: "\u0179", zacute: "\u017A", Zcaron: "\u017D", zcaron: "\u017E", Zcy: "\u0417", zcy: "\u0437", Zdot: "\u017B", zdot: "\u017C", zeetrf: "\u2128", ZeroWidthSpace: "\u200B", Zeta: "\u0396", zeta: "\u03B6", zfr: "\u{1D537}", Zfr: "\u2128", ZHcy: "\u0416", zhcy: "\u0436", zigrarr: "\u21DD", zopf: "\u{1D56B}", Zopf: "\u2124", Zscr: "\u{1D4B5}", zscr: "\u{1D4CF}", zwj: "\u200D", zwnj: "\u200C" };
    }
  });

  // node_modules/markdown-it/lib/common/entities.js
  var require_entities2 = __commonJS({
    "node_modules/markdown-it/lib/common/entities.js"(exports, module) {
      "use strict";
      init_buffer_shim();
      module.exports = require_entities();
    }
  });

  // node_modules/uc.micro/categories/P/regex.js
  var require_regex = __commonJS({
    "node_modules/uc.micro/categories/P/regex.js"(exports, module) {
      init_buffer_shim();
      module.exports = /[!-#%-\*,-\/:;\?@\[-\]_\{\}\xA1\xA7\xAB\xB6\xB7\xBB\xBF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061E\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u09FD\u0A76\u0AF0\u0C84\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166D\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E4E\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]|\uD800[\uDD00-\uDD02\uDF9F\uDFD0]|\uD801\uDD6F|\uD802[\uDC57\uDD1F\uDD3F\uDE50-\uDE58\uDE7F\uDEF0-\uDEF6\uDF39-\uDF3F\uDF99-\uDF9C]|\uD803[\uDF55-\uDF59]|\uD804[\uDC47-\uDC4D\uDCBB\uDCBC\uDCBE-\uDCC1\uDD40-\uDD43\uDD74\uDD75\uDDC5-\uDDC8\uDDCD\uDDDB\uDDDD-\uDDDF\uDE38-\uDE3D\uDEA9]|\uD805[\uDC4B-\uDC4F\uDC5B\uDC5D\uDCC6\uDDC1-\uDDD7\uDE41-\uDE43\uDE60-\uDE6C\uDF3C-\uDF3E]|\uD806[\uDC3B\uDE3F-\uDE46\uDE9A-\uDE9C\uDE9E-\uDEA2]|\uD807[\uDC41-\uDC45\uDC70\uDC71\uDEF7\uDEF8]|\uD809[\uDC70-\uDC74]|\uD81A[\uDE6E\uDE6F\uDEF5\uDF37-\uDF3B\uDF44]|\uD81B[\uDE97-\uDE9A]|\uD82F\uDC9F|\uD836[\uDE87-\uDE8B]|\uD83A[\uDD5E\uDD5F]/;
    }
  });

  // node_modules/mdurl/encode.js
  var require_encode = __commonJS({
    "node_modules/mdurl/encode.js"(exports, module) {
      "use strict";
      init_buffer_shim();
      var encodeCache = {};
      function getEncodeCache(exclude) {
        var i, ch, cache = encodeCache[exclude];
        if (cache) {
          return cache;
        }
        cache = encodeCache[exclude] = [];
        for (i = 0; i < 128; i++) {
          ch = String.fromCharCode(i);
          if (/^[0-9a-z]$/i.test(ch)) {
            cache.push(ch);
          } else {
            cache.push("%" + ("0" + i.toString(16).toUpperCase()).slice(-2));
          }
        }
        for (i = 0; i < exclude.length; i++) {
          cache[exclude.charCodeAt(i)] = exclude[i];
        }
        return cache;
      }
      __name(getEncodeCache, "getEncodeCache");
      function encode(string, exclude, keepEscaped) {
        var i, l, code, nextCode, cache, result = "";
        if (typeof exclude !== "string") {
          keepEscaped = exclude;
          exclude = encode.defaultChars;
        }
        if (typeof keepEscaped === "undefined") {
          keepEscaped = true;
        }
        cache = getEncodeCache(exclude);
        for (i = 0, l = string.length; i < l; i++) {
          code = string.charCodeAt(i);
          if (keepEscaped && code === 37 && i + 2 < l) {
            if (/^[0-9a-f]{2}$/i.test(string.slice(i + 1, i + 3))) {
              result += string.slice(i, i + 3);
              i += 2;
              continue;
            }
          }
          if (code < 128) {
            result += cache[code];
            continue;
          }
          if (code >= 55296 && code <= 57343) {
            if (code >= 55296 && code <= 56319 && i + 1 < l) {
              nextCode = string.charCodeAt(i + 1);
              if (nextCode >= 56320 && nextCode <= 57343) {
                result += encodeURIComponent(string[i] + string[i + 1]);
                i++;
                continue;
              }
            }
            result += "%EF%BF%BD";
            continue;
          }
          result += encodeURIComponent(string[i]);
        }
        return result;
      }
      __name(encode, "encode");
      encode.defaultChars = ";/?:@&=+$,-_.!~*'()#";
      encode.componentChars = "-_.!~*'()";
      module.exports = encode;
    }
  });

  // node_modules/mdurl/decode.js
  var require_decode = __commonJS({
    "node_modules/mdurl/decode.js"(exports, module) {
      "use strict";
      init_buffer_shim();
      var decodeCache = {};
      function getDecodeCache(exclude) {
        var i, ch, cache = decodeCache[exclude];
        if (cache) {
          return cache;
        }
        cache = decodeCache[exclude] = [];
        for (i = 0; i < 128; i++) {
          ch = String.fromCharCode(i);
          cache.push(ch);
        }
        for (i = 0; i < exclude.length; i++) {
          ch = exclude.charCodeAt(i);
          cache[ch] = "%" + ("0" + ch.toString(16).toUpperCase()).slice(-2);
        }
        return cache;
      }
      __name(getDecodeCache, "getDecodeCache");
      function decode(string, exclude) {
        var cache;
        if (typeof exclude !== "string") {
          exclude = decode.defaultChars;
        }
        cache = getDecodeCache(exclude);
        return string.replace(/(%[a-f0-9]{2})+/gi, function(seq) {
          var i, l, b1, b2, b3, b4, chr, result = "";
          for (i = 0, l = seq.length; i < l; i += 3) {
            b1 = parseInt(seq.slice(i + 1, i + 3), 16);
            if (b1 < 128) {
              result += cache[b1];
              continue;
            }
            if ((b1 & 224) === 192 && i + 3 < l) {
              b2 = parseInt(seq.slice(i + 4, i + 6), 16);
              if ((b2 & 192) === 128) {
                chr = b1 << 6 & 1984 | b2 & 63;
                if (chr < 128) {
                  result += "\uFFFD\uFFFD";
                } else {
                  result += String.fromCharCode(chr);
                }
                i += 3;
                continue;
              }
            }
            if ((b1 & 240) === 224 && i + 6 < l) {
              b2 = parseInt(seq.slice(i + 4, i + 6), 16);
              b3 = parseInt(seq.slice(i + 7, i + 9), 16);
              if ((b2 & 192) === 128 && (b3 & 192) === 128) {
                chr = b1 << 12 & 61440 | b2 << 6 & 4032 | b3 & 63;
                if (chr < 2048 || chr >= 55296 && chr <= 57343) {
                  result += "\uFFFD\uFFFD\uFFFD";
                } else {
                  result += String.fromCharCode(chr);
                }
                i += 6;
                continue;
              }
            }
            if ((b1 & 248) === 240 && i + 9 < l) {
              b2 = parseInt(seq.slice(i + 4, i + 6), 16);
              b3 = parseInt(seq.slice(i + 7, i + 9), 16);
              b4 = parseInt(seq.slice(i + 10, i + 12), 16);
              if ((b2 & 192) === 128 && (b3 & 192) === 128 && (b4 & 192) === 128) {
                chr = b1 << 18 & 1835008 | b2 << 12 & 258048 | b3 << 6 & 4032 | b4 & 63;
                if (chr < 65536 || chr > 1114111) {
                  result += "\uFFFD\uFFFD\uFFFD\uFFFD";
                } else {
                  chr -= 65536;
                  result += String.fromCharCode(55296 + (chr >> 10), 56320 + (chr & 1023));
                }
                i += 9;
                continue;
              }
            }
            result += "\uFFFD";
          }
          return result;
        });
      }
      __name(decode, "decode");
      decode.defaultChars = ";/?:@&=+$,#";
      decode.componentChars = "";
      module.exports = decode;
    }
  });

  // node_modules/mdurl/format.js
  var require_format = __commonJS({
    "node_modules/mdurl/format.js"(exports, module) {
      "use strict";
      init_buffer_shim();
      module.exports = /* @__PURE__ */ __name(function format2(url) {
        var result = "";
        result += url.protocol || "";
        result += url.slashes ? "//" : "";
        result += url.auth ? url.auth + "@" : "";
        if (url.hostname && url.hostname.indexOf(":") !== -1) {
          result += "[" + url.hostname + "]";
        } else {
          result += url.hostname || "";
        }
        result += url.port ? ":" + url.port : "";
        result += url.pathname || "";
        result += url.search || "";
        result += url.hash || "";
        return result;
      }, "format");
    }
  });

  // node_modules/mdurl/parse.js
  var require_parse = __commonJS({
    "node_modules/mdurl/parse.js"(exports, module) {
      "use strict";
      init_buffer_shim();
      function Url() {
        this.protocol = null;
        this.slashes = null;
        this.auth = null;
        this.port = null;
        this.hostname = null;
        this.hash = null;
        this.search = null;
        this.pathname = null;
      }
      __name(Url, "Url");
      var protocolPattern = /^([a-z0-9.+-]+:)/i;
      var portPattern = /:[0-9]*$/;
      var simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/;
      var delims = ["<", ">", '"', "`", " ", "\r", "\n", "	"];
      var unwise = ["{", "}", "|", "\\", "^", "`"].concat(delims);
      var autoEscape = ["'"].concat(unwise);
      var nonHostChars = ["%", "/", "?", ";", "#"].concat(autoEscape);
      var hostEndingChars = ["/", "?", "#"];
      var hostnameMaxLen = 255;
      var hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/;
      var hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/;
      var hostlessProtocol = {
        "javascript": true,
        "javascript:": true
      };
      var slashedProtocol = {
        "http": true,
        "https": true,
        "ftp": true,
        "gopher": true,
        "file": true,
        "http:": true,
        "https:": true,
        "ftp:": true,
        "gopher:": true,
        "file:": true
      };
      function urlParse2(url, slashesDenoteHost) {
        if (url && url instanceof Url) {
          return url;
        }
        var u = new Url();
        u.parse(url, slashesDenoteHost);
        return u;
      }
      __name(urlParse2, "urlParse");
      Url.prototype.parse = function(url, slashesDenoteHost) {
        var i, l, lowerProto, hec, slashes, rest = url;
        rest = rest.trim();
        if (!slashesDenoteHost && url.split("#").length === 1) {
          var simplePath = simplePathPattern.exec(rest);
          if (simplePath) {
            this.pathname = simplePath[1];
            if (simplePath[2]) {
              this.search = simplePath[2];
            }
            return this;
          }
        }
        var proto = protocolPattern.exec(rest);
        if (proto) {
          proto = proto[0];
          lowerProto = proto.toLowerCase();
          this.protocol = proto;
          rest = rest.substr(proto.length);
        }
        if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
          slashes = rest.substr(0, 2) === "//";
          if (slashes && !(proto && hostlessProtocol[proto])) {
            rest = rest.substr(2);
            this.slashes = true;
          }
        }
        if (!hostlessProtocol[proto] && (slashes || proto && !slashedProtocol[proto])) {
          var hostEnd = -1;
          for (i = 0; i < hostEndingChars.length; i++) {
            hec = rest.indexOf(hostEndingChars[i]);
            if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) {
              hostEnd = hec;
            }
          }
          var auth, atSign;
          if (hostEnd === -1) {
            atSign = rest.lastIndexOf("@");
          } else {
            atSign = rest.lastIndexOf("@", hostEnd);
          }
          if (atSign !== -1) {
            auth = rest.slice(0, atSign);
            rest = rest.slice(atSign + 1);
            this.auth = auth;
          }
          hostEnd = -1;
          for (i = 0; i < nonHostChars.length; i++) {
            hec = rest.indexOf(nonHostChars[i]);
            if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) {
              hostEnd = hec;
            }
          }
          if (hostEnd === -1) {
            hostEnd = rest.length;
          }
          if (rest[hostEnd - 1] === ":") {
            hostEnd--;
          }
          var host = rest.slice(0, hostEnd);
          rest = rest.slice(hostEnd);
          this.parseHost(host);
          this.hostname = this.hostname || "";
          var ipv6Hostname = this.hostname[0] === "[" && this.hostname[this.hostname.length - 1] === "]";
          if (!ipv6Hostname) {
            var hostparts = this.hostname.split(/\./);
            for (i = 0, l = hostparts.length; i < l; i++) {
              var part = hostparts[i];
              if (!part) {
                continue;
              }
              if (!part.match(hostnamePartPattern)) {
                var newpart = "";
                for (var j = 0, k = part.length; j < k; j++) {
                  if (part.charCodeAt(j) > 127) {
                    newpart += "x";
                  } else {
                    newpart += part[j];
                  }
                }
                if (!newpart.match(hostnamePartPattern)) {
                  var validParts = hostparts.slice(0, i);
                  var notHost = hostparts.slice(i + 1);
                  var bit = part.match(hostnamePartStart);
                  if (bit) {
                    validParts.push(bit[1]);
                    notHost.unshift(bit[2]);
                  }
                  if (notHost.length) {
                    rest = notHost.join(".") + rest;
                  }
                  this.hostname = validParts.join(".");
                  break;
                }
              }
            }
          }
          if (this.hostname.length > hostnameMaxLen) {
            this.hostname = "";
          }
          if (ipv6Hostname) {
            this.hostname = this.hostname.substr(1, this.hostname.length - 2);
          }
        }
        var hash = rest.indexOf("#");
        if (hash !== -1) {
          this.hash = rest.substr(hash);
          rest = rest.slice(0, hash);
        }
        var qm = rest.indexOf("?");
        if (qm !== -1) {
          this.search = rest.substr(qm);
          rest = rest.slice(0, qm);
        }
        if (rest) {
          this.pathname = rest;
        }
        if (slashedProtocol[lowerProto] && this.hostname && !this.pathname) {
          this.pathname = "";
        }
        return this;
      };
      Url.prototype.parseHost = function(host) {
        var port = portPattern.exec(host);
        if (port) {
          port = port[0];
          if (port !== ":") {
            this.port = port.substr(1);
          }
          host = host.substr(0, host.length - port.length);
        }
        if (host) {
          this.hostname = host;
        }
      };
      module.exports = urlParse2;
    }
  });

  // node_modules/mdurl/index.js
  var require_mdurl = __commonJS({
    "node_modules/mdurl/index.js"(exports, module) {
      "use strict";
      init_buffer_shim();
      module.exports.encode = require_encode();
      module.exports.decode = require_decode();
      module.exports.format = require_format();
      module.exports.parse = require_parse();
    }
  });

  // node_modules/uc.micro/properties/Any/regex.js
  var require_regex2 = __commonJS({
    "node_modules/uc.micro/properties/Any/regex.js"(exports, module) {
      init_buffer_shim();
      module.exports = /[\0-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
    }
  });

  // node_modules/uc.micro/categories/Cc/regex.js
  var require_regex3 = __commonJS({
    "node_modules/uc.micro/categories/Cc/regex.js"(exports, module) {
      init_buffer_shim();
      module.exports = /[\0-\x1F\x7F-\x9F]/;
    }
  });

  // node_modules/uc.micro/categories/Cf/regex.js
  var require_regex4 = __commonJS({
    "node_modules/uc.micro/categories/Cf/regex.js"(exports, module) {
      init_buffer_shim();
      module.exports = /[\xAD\u0600-\u0605\u061C\u06DD\u070F\u08E2\u180E\u200B-\u200F\u202A-\u202E\u2060-\u2064\u2066-\u206F\uFEFF\uFFF9-\uFFFB]|\uD804[\uDCBD\uDCCD]|\uD82F[\uDCA0-\uDCA3]|\uD834[\uDD73-\uDD7A]|\uDB40[\uDC01\uDC20-\uDC7F]/;
    }
  });

  // node_modules/uc.micro/categories/Z/regex.js
  var require_regex5 = __commonJS({
    "node_modules/uc.micro/categories/Z/regex.js"(exports, module) {
      init_buffer_shim();
      module.exports = /[ \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]/;
    }
  });

  // node_modules/uc.micro/index.js
  var require_uc = __commonJS({
    "node_modules/uc.micro/index.js"(exports) {
      "use strict";
      init_buffer_shim();
      exports.Any = require_regex2();
      exports.Cc = require_regex3();
      exports.Cf = require_regex4();
      exports.P = require_regex();
      exports.Z = require_regex5();
    }
  });

  // node_modules/markdown-it/lib/common/utils.js
  var require_utils = __commonJS({
    "node_modules/markdown-it/lib/common/utils.js"(exports) {
      "use strict";
      init_buffer_shim();
      function _class(obj) {
        return Object.prototype.toString.call(obj);
      }
      __name(_class, "_class");
      function isString(obj) {
        return _class(obj) === "[object String]";
      }
      __name(isString, "isString");
      var _hasOwnProperty = Object.prototype.hasOwnProperty;
      function has(object, key) {
        return _hasOwnProperty.call(object, key);
      }
      __name(has, "has");
      function assign(obj) {
        var sources = Array.prototype.slice.call(arguments, 1);
        sources.forEach(function(source) {
          if (!source) {
            return;
          }
          if (typeof source !== "object") {
            throw new TypeError(source + "must be object");
          }
          Object.keys(source).forEach(function(key) {
            obj[key] = source[key];
          });
        });
        return obj;
      }
      __name(assign, "assign");
      function arrayReplaceAt(src, pos, newElements) {
        return [].concat(src.slice(0, pos), newElements, src.slice(pos + 1));
      }
      __name(arrayReplaceAt, "arrayReplaceAt");
      function isValidEntityCode(c) {
        if (c >= 55296 && c <= 57343) {
          return false;
        }
        if (c >= 64976 && c <= 65007) {
          return false;
        }
        if ((c & 65535) === 65535 || (c & 65535) === 65534) {
          return false;
        }
        if (c >= 0 && c <= 8) {
          return false;
        }
        if (c === 11) {
          return false;
        }
        if (c >= 14 && c <= 31) {
          return false;
        }
        if (c >= 127 && c <= 159) {
          return false;
        }
        if (c > 1114111) {
          return false;
        }
        return true;
      }
      __name(isValidEntityCode, "isValidEntityCode");
      function fromCodePoint(c) {
        if (c > 65535) {
          c -= 65536;
          var surrogate1 = 55296 + (c >> 10), surrogate2 = 56320 + (c & 1023);
          return String.fromCharCode(surrogate1, surrogate2);
        }
        return String.fromCharCode(c);
      }
      __name(fromCodePoint, "fromCodePoint");
      var UNESCAPE_MD_RE = /\\([!"#$%&'()*+,\-.\/:;<=>?@[\\\]^_`{|}~])/g;
      var ENTITY_RE = /&([a-z#][a-z0-9]{1,31});/gi;
      var UNESCAPE_ALL_RE = new RegExp(UNESCAPE_MD_RE.source + "|" + ENTITY_RE.source, "gi");
      var DIGITAL_ENTITY_TEST_RE = /^#((?:x[a-f0-9]{1,8}|[0-9]{1,8}))/i;
      var entities = require_entities2();
      function replaceEntityPattern(match, name) {
        var code = 0;
        if (has(entities, name)) {
          return entities[name];
        }
        if (name.charCodeAt(0) === 35 && DIGITAL_ENTITY_TEST_RE.test(name)) {
          code = name[1].toLowerCase() === "x" ? parseInt(name.slice(2), 16) : parseInt(name.slice(1), 10);
          if (isValidEntityCode(code)) {
            return fromCodePoint(code);
          }
        }
        return match;
      }
      __name(replaceEntityPattern, "replaceEntityPattern");
      function unescapeMd(str) {
        if (str.indexOf("\\") < 0) {
          return str;
        }
        return str.replace(UNESCAPE_MD_RE, "$1");
      }
      __name(unescapeMd, "unescapeMd");
      function unescapeAll(str) {
        if (str.indexOf("\\") < 0 && str.indexOf("&") < 0) {
          return str;
        }
        return str.replace(UNESCAPE_ALL_RE, function(match, escaped, entity) {
          if (escaped) {
            return escaped;
          }
          return replaceEntityPattern(match, entity);
        });
      }
      __name(unescapeAll, "unescapeAll");
      var HTML_ESCAPE_TEST_RE = /[&<>"]/;
      var HTML_ESCAPE_REPLACE_RE = /[&<>"]/g;
      var HTML_REPLACEMENTS = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;"
      };
      function replaceUnsafeChar(ch) {
        return HTML_REPLACEMENTS[ch];
      }
      __name(replaceUnsafeChar, "replaceUnsafeChar");
      function escapeHtml(str) {
        if (HTML_ESCAPE_TEST_RE.test(str)) {
          return str.replace(HTML_ESCAPE_REPLACE_RE, replaceUnsafeChar);
        }
        return str;
      }
      __name(escapeHtml, "escapeHtml");
      var REGEXP_ESCAPE_RE = /[.?*+^$[\]\\(){}|-]/g;
      function escapeRE(str) {
        return str.replace(REGEXP_ESCAPE_RE, "\\$&");
      }
      __name(escapeRE, "escapeRE");
      function isSpace(code) {
        switch (code) {
          case 9:
          case 32:
            return true;
        }
        return false;
      }
      __name(isSpace, "isSpace");
      function isWhiteSpace(code) {
        if (code >= 8192 && code <= 8202) {
          return true;
        }
        switch (code) {
          case 9:
          case 10:
          case 11:
          case 12:
          case 13:
          case 32:
          case 160:
          case 5760:
          case 8239:
          case 8287:
          case 12288:
            return true;
        }
        return false;
      }
      __name(isWhiteSpace, "isWhiteSpace");
      var UNICODE_PUNCT_RE = require_regex();
      function isPunctChar(ch) {
        return UNICODE_PUNCT_RE.test(ch);
      }
      __name(isPunctChar, "isPunctChar");
      function isMdAsciiPunct(ch) {
        switch (ch) {
          case 33:
          case 34:
          case 35:
          case 36:
          case 37:
          case 38:
          case 39:
          case 40:
          case 41:
          case 42:
          case 43:
          case 44:
          case 45:
          case 46:
          case 47:
          case 58:
          case 59:
          case 60:
          case 61:
          case 62:
          case 63:
          case 64:
          case 91:
          case 92:
          case 93:
          case 94:
          case 95:
          case 96:
          case 123:
          case 124:
          case 125:
          case 126:
            return true;
          default:
            return false;
        }
      }
      __name(isMdAsciiPunct, "isMdAsciiPunct");
      function normalizeReference(str) {
        str = str.trim().replace(/\s+/g, " ");
        if ("\u1E9E".toLowerCase() === "\u1E7E") {
          str = str.replace(/ẞ/g, "\xDF");
        }
        return str.toLowerCase().toUpperCase();
      }
      __name(normalizeReference, "normalizeReference");
      exports.lib = {};
      exports.lib.mdurl = require_mdurl();
      exports.lib.ucmicro = require_uc();
      exports.assign = assign;
      exports.isString = isString;
      exports.has = has;
      exports.unescapeMd = unescapeMd;
      exports.unescapeAll = unescapeAll;
      exports.isValidEntityCode = isValidEntityCode;
      exports.fromCodePoint = fromCodePoint;
      exports.escapeHtml = escapeHtml;
      exports.arrayReplaceAt = arrayReplaceAt;
      exports.isSpace = isSpace;
      exports.isWhiteSpace = isWhiteSpace;
      exports.isMdAsciiPunct = isMdAsciiPunct;
      exports.isPunctChar = isPunctChar;
      exports.escapeRE = escapeRE;
      exports.normalizeReference = normalizeReference;
    }
  });

  // node_modules/markdown-it/lib/helpers/parse_link_label.js
  var require_parse_link_label = __commonJS({
    "node_modules/markdown-it/lib/helpers/parse_link_label.js"(exports, module) {
      "use strict";
      init_buffer_shim();
      module.exports = /* @__PURE__ */ __name(function parseLinkLabel(state, start, disableNested) {
        var level, found, marker, prevPos, labelEnd = -1, max = state.posMax, oldPos = state.pos;
        state.pos = start + 1;
        level = 1;
        while (state.pos < max) {
          marker = state.src.charCodeAt(state.pos);
          if (marker === 93) {
            level--;
            if (level === 0) {
              found = true;
              break;
            }
          }
          prevPos = state.pos;
          state.md.inline.skipToken(state);
          if (marker === 91) {
            if (prevPos === state.pos - 1) {
              level++;
            } else if (disableNested) {
              state.pos = oldPos;
              return -1;
            }
          }
        }
        if (found) {
          labelEnd = state.pos;
        }
        state.pos = oldPos;
        return labelEnd;
      }, "parseLinkLabel");
    }
  });

  // node_modules/markdown-it/lib/helpers/parse_link_destination.js
  var require_parse_link_destination = __commonJS({
    "node_modules/markdown-it/lib/helpers/parse_link_destination.js"(exports, module) {
      "use strict";
      init_buffer_shim();
      var unescapeAll = require_utils().unescapeAll;
      module.exports = /* @__PURE__ */ __name(function parseLinkDestination(str, pos, max) {
        var code, level, lines = 0, start = pos, result = {
          ok: false,
          pos: 0,
          lines: 0,
          str: ""
        };
        if (str.charCodeAt(pos) === 60) {
          pos++;
          while (pos < max) {
            code = str.charCodeAt(pos);
            if (code === 10) {
              return result;
            }
            if (code === 60) {
              return result;
            }
            if (code === 62) {
              result.pos = pos + 1;
              result.str = unescapeAll(str.slice(start + 1, pos));
              result.ok = true;
              return result;
            }
            if (code === 92 && pos + 1 < max) {
              pos += 2;
              continue;
            }
            pos++;
          }
          return result;
        }
        level = 0;
        while (pos < max) {
          code = str.charCodeAt(pos);
          if (code === 32) {
            break;
          }
          if (code < 32 || code === 127) {
            break;
          }
          if (code === 92 && pos + 1 < max) {
            if (str.charCodeAt(pos + 1) === 32) {
              break;
            }
            pos += 2;
            continue;
          }
          if (code === 40) {
            level++;
            if (level > 32) {
              return result;
            }
          }
          if (code === 41) {
            if (level === 0) {
              break;
            }
            level--;
          }
          pos++;
        }
        if (start === pos) {
          return result;
        }
        if (level !== 0) {
          return result;
        }
        result.str = unescapeAll(str.slice(start, pos));
        result.lines = lines;
        result.pos = pos;
        result.ok = true;
        return result;
      }, "parseLinkDestination");
    }
  });

  // node_modules/markdown-it/lib/helpers/parse_link_title.js
  var require_parse_link_title = __commonJS({
    "node_modules/markdown-it/lib/helpers/parse_link_title.js"(exports, module) {
      "use strict";
      init_buffer_shim();
      var unescapeAll = require_utils().unescapeAll;
      module.exports = /* @__PURE__ */ __name(function parseLinkTitle(str, pos, max) {
        var code, marker, lines = 0, start = pos, result = {
          ok: false,
          pos: 0,
          lines: 0,
          str: ""
        };
        if (pos >= max) {
          return result;
        }
        marker = str.charCodeAt(pos);
        if (marker !== 34 && marker !== 39 && marker !== 40) {
          return result;
        }
        pos++;
        if (marker === 40) {
          marker = 41;
        }
        while (pos < max) {
          code = str.charCodeAt(pos);
          if (code === marker) {
            result.pos = pos + 1;
            result.lines = lines;
            result.str = unescapeAll(str.slice(start + 1, pos));
            result.ok = true;
            return result;
          } else if (code === 40 && marker === 41) {
            return result;
          } else if (code === 10) {
            lines++;
          } else if (code === 92 && pos + 1 < max) {
            pos++;
            if (str.charCodeAt(pos) === 10) {
              lines++;
            }
          }
          pos++;
        }
        return result;
      }, "parseLinkTitle");
    }
  });

  // node_modules/markdown-it/lib/helpers/index.js
  var require_helpers = __commonJS({
    "node_modules/markdown-it/lib/helpers/index.js"(exports) {
      "use strict";
      init_buffer_shim();
      exports.parseLinkLabel = require_parse_link_label();
      exports.parseLinkDestination = require_parse_link_destination();
      exports.parseLinkTitle = require_parse_link_title();
    }
  });

  // node_modules/markdown-it/lib/renderer.js
  var require_renderer = __commonJS({
    "node_modules/markdown-it/lib/renderer.js"(exports, module) {
      "use strict";
      init_buffer_shim();
      var assign = require_utils().assign;
      var unescapeAll = require_utils().unescapeAll;
      var escapeHtml = require_utils().escapeHtml;
      var default_rules = {};
      default_rules.code_inline = function(tokens, idx, options, env, slf) {
        var token = tokens[idx];
        return "<code" + slf.renderAttrs(token) + ">" + escapeHtml(tokens[idx].content) + "</code>";
      };
      default_rules.code_block = function(tokens, idx, options, env, slf) {
        var token = tokens[idx];
        return "<pre" + slf.renderAttrs(token) + "><code>" + escapeHtml(tokens[idx].content) + "</code></pre>\n";
      };
      default_rules.fence = function(tokens, idx, options, env, slf) {
        var token = tokens[idx], info = token.info ? unescapeAll(token.info).trim() : "", langName = "", langAttrs = "", highlighted, i, arr, tmpAttrs, tmpToken;
        if (info) {
          arr = info.split(/(\s+)/g);
          langName = arr[0];
          langAttrs = arr.slice(2).join("");
        }
        if (options.highlight) {
          highlighted = options.highlight(token.content, langName, langAttrs) || escapeHtml(token.content);
        } else {
          highlighted = escapeHtml(token.content);
        }
        if (highlighted.indexOf("<pre") === 0) {
          return highlighted + "\n";
        }
        if (info) {
          i = token.attrIndex("class");
          tmpAttrs = token.attrs ? token.attrs.slice() : [];
          if (i < 0) {
            tmpAttrs.push(["class", options.langPrefix + langName]);
          } else {
            tmpAttrs[i] = tmpAttrs[i].slice();
            tmpAttrs[i][1] += " " + options.langPrefix + langName;
          }
          tmpToken = {
            attrs: tmpAttrs
          };
          return "<pre><code" + slf.renderAttrs(tmpToken) + ">" + highlighted + "</code></pre>\n";
        }
        return "<pre><code" + slf.renderAttrs(token) + ">" + highlighted + "</code></pre>\n";
      };
      default_rules.image = function(tokens, idx, options, env, slf) {
        var token = tokens[idx];
        token.attrs[token.attrIndex("alt")][1] = slf.renderInlineAsText(token.children, options, env);
        return slf.renderToken(tokens, idx, options);
      };
      default_rules.hardbreak = function(tokens, idx, options) {
        return options.xhtmlOut ? "<br />\n" : "<br>\n";
      };
      default_rules.softbreak = function(tokens, idx, options) {
        return options.breaks ? options.xhtmlOut ? "<br />\n" : "<br>\n" : "\n";
      };
      default_rules.text = function(tokens, idx) {
        return escapeHtml(tokens[idx].content);
      };
      default_rules.html_block = function(tokens, idx) {
        return tokens[idx].content;
      };
      default_rules.html_inline = function(tokens, idx) {
        return tokens[idx].content;
      };
      function Renderer() {
        this.rules = assign({}, default_rules);
      }
      __name(Renderer, "Renderer");
      Renderer.prototype.renderAttrs = /* @__PURE__ */ __name(function renderAttrs(token) {
        var i, l, result;
        if (!token.attrs) {
          return "";
        }
        result = "";
        for (i = 0, l = token.attrs.length; i < l; i++) {
          result += " " + escapeHtml(token.attrs[i][0]) + '="' + escapeHtml(token.attrs[i][1]) + '"';
        }
        return result;
      }, "renderAttrs");
      Renderer.prototype.renderToken = /* @__PURE__ */ __name(function renderToken(tokens, idx, options) {
        var nextToken, result = "", needLf = false, token = tokens[idx];
        if (token.hidden) {
          return "";
        }
        if (token.block && token.nesting !== -1 && idx && tokens[idx - 1].hidden) {
          result += "\n";
        }
        result += (token.nesting === -1 ? "</" : "<") + token.tag;
        result += this.renderAttrs(token);
        if (token.nesting === 0 && options.xhtmlOut) {
          result += " /";
        }
        if (token.block) {
          needLf = true;
          if (token.nesting === 1) {
            if (idx + 1 < tokens.length) {
              nextToken = tokens[idx + 1];
              if (nextToken.type === "inline" || nextToken.hidden) {
                needLf = false;
              } else if (nextToken.nesting === -1 && nextToken.tag === token.tag) {
                needLf = false;
              }
            }
          }
        }
        result += needLf ? ">\n" : ">";
        return result;
      }, "renderToken");
      Renderer.prototype.renderInline = function(tokens, options, env) {
        var type, result = "", rules = this.rules;
        for (var i = 0, len = tokens.length; i < len; i++) {
          type = tokens[i].type;
          if (typeof rules[type] !== "undefined") {
            result += rules[type](tokens, i, options, env, this);
          } else {
            result += this.renderToken(tokens, i, options);
          }
        }
        return result;
      };
      Renderer.prototype.renderInlineAsText = function(tokens, options, env) {
        var result = "";
        for (var i = 0, len = tokens.length; i < len; i++) {
          if (tokens[i].type === "text") {
            result += tokens[i].content;
          } else if (tokens[i].type === "image") {
            result += this.renderInlineAsText(tokens[i].children, options, env);
          } else if (tokens[i].type === "softbreak") {
            result += "\n";
          }
        }
        return result;
      };
      Renderer.prototype.render = function(tokens, options, env) {
        var i, len, type, result = "", rules = this.rules;
        for (i = 0, len = tokens.length; i < len; i++) {
          type = tokens[i].type;
          if (type === "inline") {
            result += this.renderInline(tokens[i].children, options, env);
          } else if (typeof rules[type] !== "undefined") {
            result += rules[tokens[i].type](tokens, i, options, env, this);
          } else {
            result += this.renderToken(tokens, i, options, env);
          }
        }
        return result;
      };
      module.exports = Renderer;
    }
  });

  // node_modules/markdown-it/lib/ruler.js
  var require_ruler = __commonJS({
    "node_modules/markdown-it/lib/ruler.js"(exports, module) {
      "use strict";
      init_buffer_shim();
      function Ruler() {
        this.__rules__ = [];
        this.__cache__ = null;
      }
      __name(Ruler, "Ruler");
      Ruler.prototype.__find__ = function(name) {
        for (var i = 0; i < this.__rules__.length; i++) {
          if (this.__rules__[i].name === name) {
            return i;
          }
        }
        return -1;
      };
      Ruler.prototype.__compile__ = function() {
        var self2 = this;
        var chains = [""];
        self2.__rules__.forEach(function(rule) {
          if (!rule.enabled) {
            return;
          }
          rule.alt.forEach(function(altName) {
            if (chains.indexOf(altName) < 0) {
              chains.push(altName);
            }
          });
        });
        self2.__cache__ = {};
        chains.forEach(function(chain) {
          self2.__cache__[chain] = [];
          self2.__rules__.forEach(function(rule) {
            if (!rule.enabled) {
              return;
            }
            if (chain && rule.alt.indexOf(chain) < 0) {
              return;
            }
            self2.__cache__[chain].push(rule.fn);
          });
        });
      };
      Ruler.prototype.at = function(name, fn, options) {
        var index = this.__find__(name);
        var opt = options || {};
        if (index === -1) {
          throw new Error("Parser rule not found: " + name);
        }
        this.__rules__[index].fn = fn;
        this.__rules__[index].alt = opt.alt || [];
        this.__cache__ = null;
      };
      Ruler.prototype.before = function(beforeName, ruleName, fn, options) {
        var index = this.__find__(beforeName);
        var opt = options || {};
        if (index === -1) {
          throw new Error("Parser rule not found: " + beforeName);
        }
        this.__rules__.splice(index, 0, {
          name: ruleName,
          enabled: true,
          fn,
          alt: opt.alt || []
        });
        this.__cache__ = null;
      };
      Ruler.prototype.after = function(afterName, ruleName, fn, options) {
        var index = this.__find__(afterName);
        var opt = options || {};
        if (index === -1) {
          throw new Error("Parser rule not found: " + afterName);
        }
        this.__rules__.splice(index + 1, 0, {
          name: ruleName,
          enabled: true,
          fn,
          alt: opt.alt || []
        });
        this.__cache__ = null;
      };
      Ruler.prototype.push = function(ruleName, fn, options) {
        var opt = options || {};
        this.__rules__.push({
          name: ruleName,
          enabled: true,
          fn,
          alt: opt.alt || []
        });
        this.__cache__ = null;
      };
      Ruler.prototype.enable = function(list, ignoreInvalid) {
        if (!Array.isArray(list)) {
          list = [list];
        }
        var result = [];
        list.forEach(function(name) {
          var idx = this.__find__(name);
          if (idx < 0) {
            if (ignoreInvalid) {
              return;
            }
            throw new Error("Rules manager: invalid rule name " + name);
          }
          this.__rules__[idx].enabled = true;
          result.push(name);
        }, this);
        this.__cache__ = null;
        return result;
      };
      Ruler.prototype.enableOnly = function(list, ignoreInvalid) {
        if (!Array.isArray(list)) {
          list = [list];
        }
        this.__rules__.forEach(function(rule) {
          rule.enabled = false;
        });
        this.enable(list, ignoreInvalid);
      };
      Ruler.prototype.disable = function(list, ignoreInvalid) {
        if (!Array.isArray(list)) {
          list = [list];
        }
        var result = [];
        list.forEach(function(name) {
          var idx = this.__find__(name);
          if (idx < 0) {
            if (ignoreInvalid) {
              return;
            }
            throw new Error("Rules manager: invalid rule name " + name);
          }
          this.__rules__[idx].enabled = false;
          result.push(name);
        }, this);
        this.__cache__ = null;
        return result;
      };
      Ruler.prototype.getRules = function(chainName) {
        if (this.__cache__ === null) {
          this.__compile__();
        }
        return this.__cache__[chainName] || [];
      };
      module.exports = Ruler;
    }
  });

  // node_modules/markdown-it/lib/rules_core/normalize.js
  var require_normalize = __commonJS({
    "node_modules/markdown-it/lib/rules_core/normalize.js"(exports, module) {
      "use strict";
      init_buffer_shim();
      var NEWLINES_RE = /\r\n?|\n/g;
      var NULL_RE = /\0/g;
      module.exports = /* @__PURE__ */ __name(function normalize(state) {
        var str;
        str = state.src.replace(NEWLINES_RE, "\n");
        str = str.replace(NULL_RE, "\uFFFD");
        state.src = str;
      }, "normalize");
    }
  });

  // node_modules/markdown-it/lib/rules_core/block.js
  var require_block = __commonJS({
    "node_modules/markdown-it/lib/rules_core/block.js"(exports, module) {
      "use strict";
      init_buffer_shim();
      module.exports = /* @__PURE__ */ __name(function block(state) {
        var token;
        if (state.inlineMode) {
          token = new state.Token("inline", "", 0);
          token.content = state.src;
          token.map = [0, 1];
          token.children = [];
          state.tokens.push(token);
        } else {
          state.md.block.parse(state.src, state.md, state.env, state.tokens);
        }
      }, "block");
    }
  });

  // node_modules/markdown-it/lib/rules_core/inline.js
  var require_inline = __commonJS({
    "node_modules/markdown-it/lib/rules_core/inline.js"(exports, module) {
      "use strict";
      init_buffer_shim();
      module.exports = /* @__PURE__ */ __name(function inline(state) {
        var tokens = state.tokens, tok, i, l;
        for (i = 0, l = tokens.length; i < l; i++) {
          tok = tokens[i];
          if (tok.type === "inline") {
            state.md.inline.parse(tok.content, state.md, state.env, tok.children);
          }
        }
      }, "inline");
    }
  });

  // node_modules/markdown-it/lib/rules_core/linkify.js
  var require_linkify = __commonJS({
    "node_modules/markdown-it/lib/rules_core/linkify.js"(exports, module) {
      "use strict";
      init_buffer_shim();
      var arrayReplaceAt = require_utils().arrayReplaceAt;
      function isLinkOpen(str) {
        return /^<a[>\s]/i.test(str);
      }
      __name(isLinkOpen, "isLinkOpen");
      function isLinkClose(str) {
        return /^<\/a\s*>/i.test(str);
      }
      __name(isLinkClose, "isLinkClose");
      module.exports = /* @__PURE__ */ __name(function linkify(state) {
        var i, j, l, tokens, token, currentToken, nodes, ln, text, pos, lastPos, level, htmlLinkLevel, url, fullUrl, urlText, blockTokens = state.tokens, links;
        if (!state.md.options.linkify) {
          return;
        }
        for (j = 0, l = blockTokens.length; j < l; j++) {
          if (blockTokens[j].type !== "inline" || !state.md.linkify.pretest(blockTokens[j].content)) {
            continue;
          }
          tokens = blockTokens[j].children;
          htmlLinkLevel = 0;
          for (i = tokens.length - 1; i >= 0; i--) {
            currentToken = tokens[i];
            if (currentToken.type === "link_close") {
              i--;
              while (tokens[i].level !== currentToken.level && tokens[i].type !== "link_open") {
                i--;
              }
              continue;
            }
            if (currentToken.type === "html_inline") {
              if (isLinkOpen(currentToken.content) && htmlLinkLevel > 0) {
                htmlLinkLevel--;
              }
              if (isLinkClose(currentToken.content)) {
                htmlLinkLevel++;
              }
            }
            if (htmlLinkLevel > 0) {
              continue;
            }
            if (currentToken.type === "text" && state.md.linkify.test(currentToken.content)) {
              text = currentToken.content;
              links = state.md.linkify.match(text);
              nodes = [];
              level = currentToken.level;
              lastPos = 0;
              if (links.length > 0 && links[0].index === 0 && i > 0 && tokens[i - 1].type === "text_special") {
                links = links.slice(1);
              }
              for (ln = 0; ln < links.length; ln++) {
                url = links[ln].url;
                fullUrl = state.md.normalizeLink(url);
                if (!state.md.validateLink(fullUrl)) {
                  continue;
                }
                urlText = links[ln].text;
                if (!links[ln].schema) {
                  urlText = state.md.normalizeLinkText("http://" + urlText).replace(/^http:\/\//, "");
                } else if (links[ln].schema === "mailto:" && !/^mailto:/i.test(urlText)) {
                  urlText = state.md.normalizeLinkText("mailto:" + urlText).replace(/^mailto:/, "");
                } else {
                  urlText = state.md.normalizeLinkText(urlText);
                }
                pos = links[ln].index;
                if (pos > lastPos) {
                  token = new state.Token("text", "", 0);
                  token.content = text.slice(lastPos, pos);
                  token.level = level;
                  nodes.push(token);
                }
                token = new state.Token("link_open", "a", 1);
                token.attrs = [["href", fullUrl]];
                token.level = level++;
                token.markup = "linkify";
                token.info = "auto";
                nodes.push(token);
                token = new state.Token("text", "", 0);
                token.content = urlText;
                token.level = level;
                nodes.push(token);
                token = new state.Token("link_close", "a", -1);
                token.level = --level;
                token.markup = "linkify";
                token.info = "auto";
                nodes.push(token);
                lastPos = links[ln].lastIndex;
              }
              if (lastPos < text.length) {
                token = new state.Token("text", "", 0);
                token.content = text.slice(lastPos);
                token.level = level;
                nodes.push(token);
              }
              blockTokens[j].children = tokens = arrayReplaceAt(tokens, i, nodes);
            }
          }
        }
      }, "linkify");
    }
  });

  // node_modules/markdown-it/lib/rules_core/replacements.js
  var require_replacements = __commonJS({
    "node_modules/markdown-it/lib/rules_core/replacements.js"(exports, module) {
      "use strict";
      init_buffer_shim();
      var RARE_RE = /\+-|\.\.|\?\?\?\?|!!!!|,,|--/;
      var SCOPED_ABBR_TEST_RE = /\((c|tm|r)\)/i;
      var SCOPED_ABBR_RE = /\((c|tm|r)\)/ig;
      var SCOPED_ABBR = {
        c: "\xA9",
        r: "\xAE",
        tm: "\u2122"
      };
      function replaceFn(match, name) {
        return SCOPED_ABBR[name.toLowerCase()];
      }
      __name(replaceFn, "replaceFn");
      function replace_scoped(inlineTokens) {
        var i, token, inside_autolink = 0;
        for (i = inlineTokens.length - 1; i >= 0; i--) {
          token = inlineTokens[i];
          if (token.type === "text" && !inside_autolink) {
            token.content = token.content.replace(SCOPED_ABBR_RE, replaceFn);
          }
          if (token.type === "link_open" && token.info === "auto") {
            inside_autolink--;
          }
          if (token.type === "link_close" && token.info === "auto") {
            inside_autolink++;
          }
        }
      }
      __name(replace_scoped, "replace_scoped");
      function replace_rare(inlineTokens) {
        var i, token, inside_autolink = 0;
        for (i = inlineTokens.length - 1; i >= 0; i--) {
          token = inlineTokens[i];
          if (token.type === "text" && !inside_autolink) {
            if (RARE_RE.test(token.content)) {
              token.content = token.content.replace(/\+-/g, "\xB1").replace(/\.{2,}/g, "\u2026").replace(/([?!])…/g, "$1..").replace(/([?!]){4,}/g, "$1$1$1").replace(/,{2,}/g, ",").replace(/(^|[^-])---(?=[^-]|$)/mg, "$1\u2014").replace(/(^|\s)--(?=\s|$)/mg, "$1\u2013").replace(/(^|[^-\s])--(?=[^-\s]|$)/mg, "$1\u2013");
            }
          }
          if (token.type === "link_open" && token.info === "auto") {
            inside_autolink--;
          }
          if (token.type === "link_close" && token.info === "auto") {
            inside_autolink++;
          }
        }
      }
      __name(replace_rare, "replace_rare");
      module.exports = /* @__PURE__ */ __name(function replace(state) {
        var blkIdx;
        if (!state.md.options.typographer) {
          return;
        }
        for (blkIdx = state.tokens.length - 1; blkIdx >= 0; blkIdx--) {
          if (state.tokens[blkIdx].type !== "inline") {
            continue;
          }
          if (SCOPED_ABBR_TEST_RE.test(state.tokens[blkIdx].content)) {
            replace_scoped(state.tokens[blkIdx].children);
          }
          if (RARE_RE.test(state.tokens[blkIdx].content)) {
            replace_rare(state.tokens[blkIdx].children);
          }
        }
      }, "replace");
    }
  });

  // node_modules/markdown-it/lib/rules_core/smartquotes.js
  var require_smartquotes = __commonJS({
    "node_modules/markdown-it/lib/rules_core/smartquotes.js"(exports, module) {
      "use strict";
      init_buffer_shim();
      var isWhiteSpace = require_utils().isWhiteSpace;
      var isPunctChar = require_utils().isPunctChar;
      var isMdAsciiPunct = require_utils().isMdAsciiPunct;
      var QUOTE_TEST_RE = /['"]/;
      var QUOTE_RE = /['"]/g;
      var APOSTROPHE = "\u2019";
      function replaceAt(str, index, ch) {
        return str.slice(0, index) + ch + str.slice(index + 1);
      }
      __name(replaceAt, "replaceAt");
      function process_inlines(tokens, state) {
        var i, token, text, t, pos, max, thisLevel, item, lastChar, nextChar, isLastPunctChar, isNextPunctChar, isLastWhiteSpace, isNextWhiteSpace, canOpen, canClose, j, isSingle, stack, openQuote, closeQuote;
        stack = [];
        for (i = 0; i < tokens.length; i++) {
          token = tokens[i];
          thisLevel = tokens[i].level;
          for (j = stack.length - 1; j >= 0; j--) {
            if (stack[j].level <= thisLevel) {
              break;
            }
          }
          stack.length = j + 1;
          if (token.type !== "text") {
            continue;
          }
          text = token.content;
          pos = 0;
          max = text.length;
          OUTER:
            while (pos < max) {
              QUOTE_RE.lastIndex = pos;
              t = QUOTE_RE.exec(text);
              if (!t) {
                break;
              }
              canOpen = canClose = true;
              pos = t.index + 1;
              isSingle = t[0] === "'";
              lastChar = 32;
              if (t.index - 1 >= 0) {
                lastChar = text.charCodeAt(t.index - 1);
              } else {
                for (j = i - 1; j >= 0; j--) {
                  if (tokens[j].type === "softbreak" || tokens[j].type === "hardbreak")
                    break;
                  if (!tokens[j].content)
                    continue;
                  lastChar = tokens[j].content.charCodeAt(tokens[j].content.length - 1);
                  break;
                }
              }
              nextChar = 32;
              if (pos < max) {
                nextChar = text.charCodeAt(pos);
              } else {
                for (j = i + 1; j < tokens.length; j++) {
                  if (tokens[j].type === "softbreak" || tokens[j].type === "hardbreak")
                    break;
                  if (!tokens[j].content)
                    continue;
                  nextChar = tokens[j].content.charCodeAt(0);
                  break;
                }
              }
              isLastPunctChar = isMdAsciiPunct(lastChar) || isPunctChar(String.fromCharCode(lastChar));
              isNextPunctChar = isMdAsciiPunct(nextChar) || isPunctChar(String.fromCharCode(nextChar));
              isLastWhiteSpace = isWhiteSpace(lastChar);
              isNextWhiteSpace = isWhiteSpace(nextChar);
              if (isNextWhiteSpace) {
                canOpen = false;
              } else if (isNextPunctChar) {
                if (!(isLastWhiteSpace || isLastPunctChar)) {
                  canOpen = false;
                }
              }
              if (isLastWhiteSpace) {
                canClose = false;
              } else if (isLastPunctChar) {
                if (!(isNextWhiteSpace || isNextPunctChar)) {
                  canClose = false;
                }
              }
              if (nextChar === 34 && t[0] === '"') {
                if (lastChar >= 48 && lastChar <= 57) {
                  canClose = canOpen = false;
                }
              }
              if (canOpen && canClose) {
                canOpen = isLastPunctChar;
                canClose = isNextPunctChar;
              }
              if (!canOpen && !canClose) {
                if (isSingle) {
                  token.content = replaceAt(token.content, t.index, APOSTROPHE);
                }
                continue;
              }
              if (canClose) {
                for (j = stack.length - 1; j >= 0; j--) {
                  item = stack[j];
                  if (stack[j].level < thisLevel) {
                    break;
                  }
                  if (item.single === isSingle && stack[j].level === thisLevel) {
                    item = stack[j];
                    if (isSingle) {
                      openQuote = state.md.options.quotes[2];
                      closeQuote = state.md.options.quotes[3];
                    } else {
                      openQuote = state.md.options.quotes[0];
                      closeQuote = state.md.options.quotes[1];
                    }
                    token.content = replaceAt(token.content, t.index, closeQuote);
                    tokens[item.token].content = replaceAt(
                      tokens[item.token].content,
                      item.pos,
                      openQuote
                    );
                    pos += closeQuote.length - 1;
                    if (item.token === i) {
                      pos += openQuote.length - 1;
                    }
                    text = token.content;
                    max = text.length;
                    stack.length = j;
                    continue OUTER;
                  }
                }
              }
              if (canOpen) {
                stack.push({
                  token: i,
                  pos: t.index,
                  single: isSingle,
                  level: thisLevel
                });
              } else if (canClose && isSingle) {
                token.content = replaceAt(token.content, t.index, APOSTROPHE);
              }
            }
        }
      }
      __name(process_inlines, "process_inlines");
      module.exports = /* @__PURE__ */ __name(function smartquotes(state) {
        var blkIdx;
        if (!state.md.options.typographer) {
          return;
        }
        for (blkIdx = state.tokens.length - 1; blkIdx >= 0; blkIdx--) {
          if (state.tokens[blkIdx].type !== "inline" || !QUOTE_TEST_RE.test(state.tokens[blkIdx].content)) {
            continue;
          }
          process_inlines(state.tokens[blkIdx].children, state);
        }
      }, "smartquotes");
    }
  });

  // node_modules/markdown-it/lib/rules_core/text_join.js
  var require_text_join = __commonJS({
    "node_modules/markdown-it/lib/rules_core/text_join.js"(exports, module) {
      "use strict";
      init_buffer_shim();
      module.exports = /* @__PURE__ */ __name(function text_join(state) {
        var j, l, tokens, curr, max, last, blockTokens = state.tokens;
        for (j = 0, l = blockTokens.length; j < l; j++) {
          if (blockTokens[j].type !== "inline")
            continue;
          tokens = blockTokens[j].children;
          max = tokens.length;
          for (curr = 0; curr < max; curr++) {
            if (tokens[curr].type === "text_special") {
              tokens[curr].type = "text";
            }
          }
          for (curr = last = 0; curr < max; curr++) {
            if (tokens[curr].type === "text" && curr + 1 < max && tokens[curr + 1].type === "text") {
              tokens[curr + 1].content = tokens[curr].content + tokens[curr + 1].content;
            } else {
              if (curr !== last) {
                tokens[last] = tokens[curr];
              }
              last++;
            }
          }
          if (curr !== last) {
            tokens.length = last;
          }
        }
      }, "text_join");
    }
  });

  // node_modules/markdown-it/lib/token.js
  var require_token = __commonJS({
    "node_modules/markdown-it/lib/token.js"(exports, module) {
      "use strict";
      init_buffer_shim();
      function Token(type, tag, nesting) {
        this.type = type;
        this.tag = tag;
        this.attrs = null;
        this.map = null;
        this.nesting = nesting;
        this.level = 0;
        this.children = null;
        this.content = "";
        this.markup = "";
        this.info = "";
        this.meta = null;
        this.block = false;
        this.hidden = false;
      }
      __name(Token, "Token");
      Token.prototype.attrIndex = /* @__PURE__ */ __name(function attrIndex(name) {
        var attrs, i, len;
        if (!this.attrs) {
          return -1;
        }
        attrs = this.attrs;
        for (i = 0, len = attrs.length; i < len; i++) {
          if (attrs[i][0] === name) {
            return i;
          }
        }
        return -1;
      }, "attrIndex");
      Token.prototype.attrPush = /* @__PURE__ */ __name(function attrPush(attrData) {
        if (this.attrs) {
          this.attrs.push(attrData);
        } else {
          this.attrs = [attrData];
        }
      }, "attrPush");
      Token.prototype.attrSet = /* @__PURE__ */ __name(function attrSet(name, value) {
        var idx = this.attrIndex(name), attrData = [name, value];
        if (idx < 0) {
          this.attrPush(attrData);
        } else {
          this.attrs[idx] = attrData;
        }
      }, "attrSet");
      Token.prototype.attrGet = /* @__PURE__ */ __name(function attrGet(name) {
        var idx = this.attrIndex(name), value = null;
        if (idx >= 0) {
          value = this.attrs[idx][1];
        }
        return value;
      }, "attrGet");
      Token.prototype.attrJoin = /* @__PURE__ */ __name(function attrJoin(name, value) {
        var idx = this.attrIndex(name);
        if (idx < 0) {
          this.attrPush([name, value]);
        } else {
          this.attrs[idx][1] = this.attrs[idx][1] + " " + value;
        }
      }, "attrJoin");
      module.exports = Token;
    }
  });

  // node_modules/markdown-it/lib/rules_core/state_core.js
  var require_state_core = __commonJS({
    "node_modules/markdown-it/lib/rules_core/state_core.js"(exports, module) {
      "use strict";
      init_buffer_shim();
      var Token = require_token();
      function StateCore(src, md, env) {
        this.src = src;
        this.env = env;
        this.tokens = [];
        this.inlineMode = false;
        this.md = md;
      }
      __name(StateCore, "StateCore");
      StateCore.prototype.Token = Token;
      module.exports = StateCore;
    }
  });

  // node_modules/markdown-it/lib/parser_core.js
  var require_parser_core = __commonJS({
    "node_modules/markdown-it/lib/parser_core.js"(exports, module) {
      "use strict";
      init_buffer_shim();
      var Ruler = require_ruler();
      var _rules = [
        ["normalize", require_normalize()],
        ["block", require_block()],
        ["inline", require_inline()],
        ["linkify", require_linkify()],
        ["replacements", require_replacements()],
        ["smartquotes", require_smartquotes()],
        ["text_join", require_text_join()]
      ];
      function Core() {
        this.ruler = new Ruler();
        for (var i = 0; i < _rules.length; i++) {
          this.ruler.push(_rules[i][0], _rules[i][1]);
        }
      }
      __name(Core, "Core");
      Core.prototype.process = function(state) {
        var i, l, rules;
        rules = this.ruler.getRules("");
        for (i = 0, l = rules.length; i < l; i++) {
          rules[i](state);
        }
      };
      Core.prototype.State = require_state_core();
      module.exports = Core;
    }
  });

  // node_modules/markdown-it/lib/rules_block/table.js
  var require_table = __commonJS({
    "node_modules/markdown-it/lib/rules_block/table.js"(exports, module) {
      "use strict";
      init_buffer_shim();
      var isSpace = require_utils().isSpace;
      function getLine(state, line) {
        var pos = state.bMarks[line] + state.tShift[line], max = state.eMarks[line];
        return state.src.slice(pos, max);
      }
      __name(getLine, "getLine");
      function escapedSplit(str) {
        var result = [], pos = 0, max = str.length, ch, isEscaped = false, lastPos = 0, current = "";
        ch = str.charCodeAt(pos);
        while (pos < max) {
          if (ch === 124) {
            if (!isEscaped) {
              result.push(current + str.substring(lastPos, pos));
              current = "";
              lastPos = pos + 1;
            } else {
              current += str.substring(lastPos, pos - 1);
              lastPos = pos;
            }
          }
          isEscaped = ch === 92;
          pos++;
          ch = str.charCodeAt(pos);
        }
        result.push(current + str.substring(lastPos));
        return result;
      }
      __name(escapedSplit, "escapedSplit");
      module.exports = /* @__PURE__ */ __name(function table(state, startLine, endLine, silent) {
        var ch, lineText, pos, i, l, nextLine, columns, columnCount, token, aligns, t, tableLines, tbodyLines, oldParentType, terminate, terminatorRules, firstCh, secondCh;
        if (startLine + 2 > endLine) {
          return false;
        }
        nextLine = startLine + 1;
        if (state.sCount[nextLine] < state.blkIndent) {
          return false;
        }
        if (state.sCount[nextLine] - state.blkIndent >= 4) {
          return false;
        }
        pos = state.bMarks[nextLine] + state.tShift[nextLine];
        if (pos >= state.eMarks[nextLine]) {
          return false;
        }
        firstCh = state.src.charCodeAt(pos++);
        if (firstCh !== 124 && firstCh !== 45 && firstCh !== 58) {
          return false;
        }
        if (pos >= state.eMarks[nextLine]) {
          return false;
        }
        secondCh = state.src.charCodeAt(pos++);
        if (secondCh !== 124 && secondCh !== 45 && secondCh !== 58 && !isSpace(secondCh)) {
          return false;
        }
        if (firstCh === 45 && isSpace(secondCh)) {
          return false;
        }
        while (pos < state.eMarks[nextLine]) {
          ch = state.src.charCodeAt(pos);
          if (ch !== 124 && ch !== 45 && ch !== 58 && !isSpace(ch)) {
            return false;
          }
          pos++;
        }
        lineText = getLine(state, startLine + 1);
        columns = lineText.split("|");
        aligns = [];
        for (i = 0; i < columns.length; i++) {
          t = columns[i].trim();
          if (!t) {
            if (i === 0 || i === columns.length - 1) {
              continue;
            } else {
              return false;
            }
          }
          if (!/^:?-+:?$/.test(t)) {
            return false;
          }
          if (t.charCodeAt(t.length - 1) === 58) {
            aligns.push(t.charCodeAt(0) === 58 ? "center" : "right");
          } else if (t.charCodeAt(0) === 58) {
            aligns.push("left");
          } else {
            aligns.push("");
          }
        }
        lineText = getLine(state, startLine).trim();
        if (lineText.indexOf("|") === -1) {
          return false;
        }
        if (state.sCount[startLine] - state.blkIndent >= 4) {
          return false;
        }
        columns = escapedSplit(lineText);
        if (columns.length && columns[0] === "")
          columns.shift();
        if (columns.length && columns[columns.length - 1] === "")
          columns.pop();
        columnCount = columns.length;
        if (columnCount === 0 || columnCount !== aligns.length) {
          return false;
        }
        if (silent) {
          return true;
        }
        oldParentType = state.parentType;
        state.parentType = "table";
        terminatorRules = state.md.block.ruler.getRules("blockquote");
        token = state.push("table_open", "table", 1);
        token.map = tableLines = [startLine, 0];
        token = state.push("thead_open", "thead", 1);
        token.map = [startLine, startLine + 1];
        token = state.push("tr_open", "tr", 1);
        token.map = [startLine, startLine + 1];
        for (i = 0; i < columns.length; i++) {
          token = state.push("th_open", "th", 1);
          if (aligns[i]) {
            token.attrs = [["style", "text-align:" + aligns[i]]];
          }
          token = state.push("inline", "", 0);
          token.content = columns[i].trim();
          token.children = [];
          token = state.push("th_close", "th", -1);
        }
        token = state.push("tr_close", "tr", -1);
        token = state.push("thead_close", "thead", -1);
        for (nextLine = startLine + 2; nextLine < endLine; nextLine++) {
          if (state.sCount[nextLine] < state.blkIndent) {
            break;
          }
          terminate = false;
          for (i = 0, l = terminatorRules.length; i < l; i++) {
            if (terminatorRules[i](state, nextLine, endLine, true)) {
              terminate = true;
              break;
            }
          }
          if (terminate) {
            break;
          }
          lineText = getLine(state, nextLine).trim();
          if (!lineText) {
            break;
          }
          if (state.sCount[nextLine] - state.blkIndent >= 4) {
            break;
          }
          columns = escapedSplit(lineText);
          if (columns.length && columns[0] === "")
            columns.shift();
          if (columns.length && columns[columns.length - 1] === "")
            columns.pop();
          if (nextLine === startLine + 2) {
            token = state.push("tbody_open", "tbody", 1);
            token.map = tbodyLines = [startLine + 2, 0];
          }
          token = state.push("tr_open", "tr", 1);
          token.map = [nextLine, nextLine + 1];
          for (i = 0; i < columnCount; i++) {
            token = state.push("td_open", "td", 1);
            if (aligns[i]) {
              token.attrs = [["style", "text-align:" + aligns[i]]];
            }
            token = state.push("inline", "", 0);
            token.content = columns[i] ? columns[i].trim() : "";
            token.children = [];
            token = state.push("td_close", "td", -1);
          }
          token = state.push("tr_close", "tr", -1);
        }
        if (tbodyLines) {
          token = state.push("tbody_close", "tbody", -1);
          tbodyLines[1] = nextLine;
        }
        token = state.push("table_close", "table", -1);
        tableLines[1] = nextLine;
        state.parentType = oldParentType;
        state.line = nextLine;
        return true;
      }, "table");
    }
  });

  // node_modules/markdown-it/lib/rules_block/code.js
  var require_code = __commonJS({
    "node_modules/markdown-it/lib/rules_block/code.js"(exports, module) {
      "use strict";
      init_buffer_shim();
      module.exports = /* @__PURE__ */ __name(function code(state, startLine, endLine) {
        var nextLine, last, token;
        if (state.sCount[startLine] - state.blkIndent < 4) {
          return false;
        }
        last = nextLine = startLine + 1;
        while (nextLine < endLine) {
          if (state.isEmpty(nextLine)) {
            nextLine++;
            continue;
          }
          if (state.sCount[nextLine] - state.blkIndent >= 4) {
            nextLine++;
            last = nextLine;
            continue;
          }
          break;
        }
        state.line = last;
        token = state.push("code_block", "code", 0);
        token.content = state.getLines(startLine, last, 4 + state.blkIndent, false) + "\n";
        token.map = [startLine, state.line];
        return true;
      }, "code");
    }
  });

  // node_modules/markdown-it/lib/rules_block/fence.js
  var require_fence = __commonJS({
    "node_modules/markdown-it/lib/rules_block/fence.js"(exports, module) {
      "use strict";
      init_buffer_shim();
      module.exports = /* @__PURE__ */ __name(function fence(state, startLine, endLine, silent) {
        var marker, len, params, nextLine, mem, token, markup, haveEndMarker = false, pos = state.bMarks[startLine] + state.tShift[startLine], max = state.eMarks[startLine];
        if (state.sCount[startLine] - state.blkIndent >= 4) {
          return false;
        }
        if (pos + 3 > max) {
          return false;
        }
        marker = state.src.charCodeAt(pos);
        if (marker !== 126 && marker !== 96) {
          return false;
        }
        mem = pos;
        pos = state.skipChars(pos, marker);
        len = pos - mem;
        if (len < 3) {
          return false;
        }
        markup = state.src.slice(mem, pos);
        params = state.src.slice(pos, max);
        if (marker === 96) {
          if (params.indexOf(String.fromCharCode(marker)) >= 0) {
            return false;
          }
        }
        if (silent) {
          return true;
        }
        nextLine = startLine;
        for (; ; ) {
          nextLine++;
          if (nextLine >= endLine) {
            break;
          }
          pos = mem = state.bMarks[nextLine] + state.tShift[nextLine];
          max = state.eMarks[nextLine];
          if (pos < max && state.sCount[nextLine] < state.blkIndent) {
            break;
          }
          if (state.src.charCodeAt(pos) !== marker) {
            continue;
          }
          if (state.sCount[nextLine] - state.blkIndent >= 4) {
            continue;
          }
          pos = state.skipChars(pos, marker);
          if (pos - mem < len) {
            continue;
          }
          pos = state.skipSpaces(pos);
          if (pos < max) {
            continue;
          }
          haveEndMarker = true;
          break;
        }
        len = state.sCount[startLine];
        state.line = nextLine + (haveEndMarker ? 1 : 0);
        token = state.push("fence", "code", 0);
        token.info = params;
        token.content = state.getLines(startLine + 1, nextLine, len, true);
        token.markup = markup;
        token.map = [startLine, state.line];
        return true;
      }, "fence");
    }
  });

  // node_modules/markdown-it/lib/rules_block/blockquote.js
  var require_blockquote = __commonJS({
    "node_modules/markdown-it/lib/rules_block/blockquote.js"(exports, module) {
      "use strict";
      init_buffer_shim();
      var isSpace = require_utils().isSpace;
      module.exports = /* @__PURE__ */ __name(function blockquote(state, startLine, endLine, silent) {
        var adjustTab, ch, i, initial, l, lastLineEmpty, lines, nextLine, offset, oldBMarks, oldBSCount, oldIndent, oldParentType, oldSCount, oldTShift, spaceAfterMarker, terminate, terminatorRules, token, isOutdented, oldLineMax = state.lineMax, pos = state.bMarks[startLine] + state.tShift[startLine], max = state.eMarks[startLine];
        if (state.sCount[startLine] - state.blkIndent >= 4) {
          return false;
        }
        if (state.src.charCodeAt(pos++) !== 62) {
          return false;
        }
        if (silent) {
          return true;
        }
        initial = offset = state.sCount[startLine] + 1;
        if (state.src.charCodeAt(pos) === 32) {
          pos++;
          initial++;
          offset++;
          adjustTab = false;
          spaceAfterMarker = true;
        } else if (state.src.charCodeAt(pos) === 9) {
          spaceAfterMarker = true;
          if ((state.bsCount[startLine] + offset) % 4 === 3) {
            pos++;
            initial++;
            offset++;
            adjustTab = false;
          } else {
            adjustTab = true;
          }
        } else {
          spaceAfterMarker = false;
        }
        oldBMarks = [state.bMarks[startLine]];
        state.bMarks[startLine] = pos;
        while (pos < max) {
          ch = state.src.charCodeAt(pos);
          if (isSpace(ch)) {
            if (ch === 9) {
              offset += 4 - (offset + state.bsCount[startLine] + (adjustTab ? 1 : 0)) % 4;
            } else {
              offset++;
            }
          } else {
            break;
          }
          pos++;
        }
        oldBSCount = [state.bsCount[startLine]];
        state.bsCount[startLine] = state.sCount[startLine] + 1 + (spaceAfterMarker ? 1 : 0);
        lastLineEmpty = pos >= max;
        oldSCount = [state.sCount[startLine]];
        state.sCount[startLine] = offset - initial;
        oldTShift = [state.tShift[startLine]];
        state.tShift[startLine] = pos - state.bMarks[startLine];
        terminatorRules = state.md.block.ruler.getRules("blockquote");
        oldParentType = state.parentType;
        state.parentType = "blockquote";
        for (nextLine = startLine + 1; nextLine < endLine; nextLine++) {
          isOutdented = state.sCount[nextLine] < state.blkIndent;
          pos = state.bMarks[nextLine] + state.tShift[nextLine];
          max = state.eMarks[nextLine];
          if (pos >= max) {
            break;
          }
          if (state.src.charCodeAt(pos++) === 62 && !isOutdented) {
            initial = offset = state.sCount[nextLine] + 1;
            if (state.src.charCodeAt(pos) === 32) {
              pos++;
              initial++;
              offset++;
              adjustTab = false;
              spaceAfterMarker = true;
            } else if (state.src.charCodeAt(pos) === 9) {
              spaceAfterMarker = true;
              if ((state.bsCount[nextLine] + offset) % 4 === 3) {
                pos++;
                initial++;
                offset++;
                adjustTab = false;
              } else {
                adjustTab = true;
              }
            } else {
              spaceAfterMarker = false;
            }
            oldBMarks.push(state.bMarks[nextLine]);
            state.bMarks[nextLine] = pos;
            while (pos < max) {
              ch = state.src.charCodeAt(pos);
              if (isSpace(ch)) {
                if (ch === 9) {
                  offset += 4 - (offset + state.bsCount[nextLine] + (adjustTab ? 1 : 0)) % 4;
                } else {
                  offset++;
                }
              } else {
                break;
              }
              pos++;
            }
            lastLineEmpty = pos >= max;
            oldBSCount.push(state.bsCount[nextLine]);
            state.bsCount[nextLine] = state.sCount[nextLine] + 1 + (spaceAfterMarker ? 1 : 0);
            oldSCount.push(state.sCount[nextLine]);
            state.sCount[nextLine] = offset - initial;
            oldTShift.push(state.tShift[nextLine]);
            state.tShift[nextLine] = pos - state.bMarks[nextLine];
            continue;
          }
          if (lastLineEmpty) {
            break;
          }
          terminate = false;
          for (i = 0, l = terminatorRules.length; i < l; i++) {
            if (terminatorRules[i](state, nextLine, endLine, true)) {
              terminate = true;
              break;
            }
          }
          if (terminate) {
            state.lineMax = nextLine;
            if (state.blkIndent !== 0) {
              oldBMarks.push(state.bMarks[nextLine]);
              oldBSCount.push(state.bsCount[nextLine]);
              oldTShift.push(state.tShift[nextLine]);
              oldSCount.push(state.sCount[nextLine]);
              state.sCount[nextLine] -= state.blkIndent;
            }
            break;
          }
          oldBMarks.push(state.bMarks[nextLine]);
          oldBSCount.push(state.bsCount[nextLine]);
          oldTShift.push(state.tShift[nextLine]);
          oldSCount.push(state.sCount[nextLine]);
          state.sCount[nextLine] = -1;
        }
        oldIndent = state.blkIndent;
        state.blkIndent = 0;
        token = state.push("blockquote_open", "blockquote", 1);
        token.markup = ">";
        token.map = lines = [startLine, 0];
        state.md.block.tokenize(state, startLine, nextLine);
        token = state.push("blockquote_close", "blockquote", -1);
        token.markup = ">";
        state.lineMax = oldLineMax;
        state.parentType = oldParentType;
        lines[1] = state.line;
        for (i = 0; i < oldTShift.length; i++) {
          state.bMarks[i + startLine] = oldBMarks[i];
          state.tShift[i + startLine] = oldTShift[i];
          state.sCount[i + startLine] = oldSCount[i];
          state.bsCount[i + startLine] = oldBSCount[i];
        }
        state.blkIndent = oldIndent;
        return true;
      }, "blockquote");
    }
  });

  // node_modules/markdown-it/lib/rules_block/hr.js
  var require_hr = __commonJS({
    "node_modules/markdown-it/lib/rules_block/hr.js"(exports, module) {
      "use strict";
      init_buffer_shim();
      var isSpace = require_utils().isSpace;
      module.exports = /* @__PURE__ */ __name(function hr(state, startLine, endLine, silent) {
        var marker, cnt, ch, token, pos = state.bMarks[startLine] + state.tShift[startLine], max = state.eMarks[startLine];
        if (state.sCount[startLine] - state.blkIndent >= 4) {
          return false;
        }
        marker = state.src.charCodeAt(pos++);
        if (marker !== 42 && marker !== 45 && marker !== 95) {
          return false;
        }
        cnt = 1;
        while (pos < max) {
          ch = state.src.charCodeAt(pos++);
          if (ch !== marker && !isSpace(ch)) {
            return false;
          }
          if (ch === marker) {
            cnt++;
          }
        }
        if (cnt < 3) {
          return false;
        }
        if (silent) {
          return true;
        }
        state.line = startLine + 1;
        token = state.push("hr", "hr", 0);
        token.map = [startLine, state.line];
        token.markup = Array(cnt + 1).join(String.fromCharCode(marker));
        return true;
      }, "hr");
    }
  });

  // node_modules/markdown-it/lib/rules_block/list.js
  var require_list = __commonJS({
    "node_modules/markdown-it/lib/rules_block/list.js"(exports, module) {
      "use strict";
      init_buffer_shim();
      var isSpace = require_utils().isSpace;
      function skipBulletListMarker(state, startLine) {
        var marker, pos, max, ch;
        pos = state.bMarks[startLine] + state.tShift[startLine];
        max = state.eMarks[startLine];
        marker = state.src.charCodeAt(pos++);
        if (marker !== 42 && marker !== 45 && marker !== 43) {
          return -1;
        }
        if (pos < max) {
          ch = state.src.charCodeAt(pos);
          if (!isSpace(ch)) {
            return -1;
          }
        }
        return pos;
      }
      __name(skipBulletListMarker, "skipBulletListMarker");
      function skipOrderedListMarker(state, startLine) {
        var ch, start = state.bMarks[startLine] + state.tShift[startLine], pos = start, max = state.eMarks[startLine];
        if (pos + 1 >= max) {
          return -1;
        }
        ch = state.src.charCodeAt(pos++);
        if (ch < 48 || ch > 57) {
          return -1;
        }
        for (; ; ) {
          if (pos >= max) {
            return -1;
          }
          ch = state.src.charCodeAt(pos++);
          if (ch >= 48 && ch <= 57) {
            if (pos - start >= 10) {
              return -1;
            }
            continue;
          }
          if (ch === 41 || ch === 46) {
            break;
          }
          return -1;
        }
        if (pos < max) {
          ch = state.src.charCodeAt(pos);
          if (!isSpace(ch)) {
            return -1;
          }
        }
        return pos;
      }
      __name(skipOrderedListMarker, "skipOrderedListMarker");
      function markTightParagraphs(state, idx) {
        var i, l, level = state.level + 2;
        for (i = idx + 2, l = state.tokens.length - 2; i < l; i++) {
          if (state.tokens[i].level === level && state.tokens[i].type === "paragraph_open") {
            state.tokens[i + 2].hidden = true;
            state.tokens[i].hidden = true;
            i += 2;
          }
        }
      }
      __name(markTightParagraphs, "markTightParagraphs");
      module.exports = /* @__PURE__ */ __name(function list(state, startLine, endLine, silent) {
        var ch, contentStart, i, indent, indentAfterMarker, initial, isOrdered, itemLines, l, listLines, listTokIdx, markerCharCode, markerValue, max, nextLine, offset, oldListIndent, oldParentType, oldSCount, oldTShift, oldTight, pos, posAfterMarker, prevEmptyEnd, start, terminate, terminatorRules, token, isTerminatingParagraph = false, tight = true;
        if (state.sCount[startLine] - state.blkIndent >= 4) {
          return false;
        }
        if (state.listIndent >= 0 && state.sCount[startLine] - state.listIndent >= 4 && state.sCount[startLine] < state.blkIndent) {
          return false;
        }
        if (silent && state.parentType === "paragraph") {
          if (state.sCount[startLine] >= state.blkIndent) {
            isTerminatingParagraph = true;
          }
        }
        if ((posAfterMarker = skipOrderedListMarker(state, startLine)) >= 0) {
          isOrdered = true;
          start = state.bMarks[startLine] + state.tShift[startLine];
          markerValue = Number(state.src.slice(start, posAfterMarker - 1));
          if (isTerminatingParagraph && markerValue !== 1)
            return false;
        } else if ((posAfterMarker = skipBulletListMarker(state, startLine)) >= 0) {
          isOrdered = false;
        } else {
          return false;
        }
        if (isTerminatingParagraph) {
          if (state.skipSpaces(posAfterMarker) >= state.eMarks[startLine])
            return false;
        }
        markerCharCode = state.src.charCodeAt(posAfterMarker - 1);
        if (silent) {
          return true;
        }
        listTokIdx = state.tokens.length;
        if (isOrdered) {
          token = state.push("ordered_list_open", "ol", 1);
          if (markerValue !== 1) {
            token.attrs = [["start", markerValue]];
          }
        } else {
          token = state.push("bullet_list_open", "ul", 1);
        }
        token.map = listLines = [startLine, 0];
        token.markup = String.fromCharCode(markerCharCode);
        nextLine = startLine;
        prevEmptyEnd = false;
        terminatorRules = state.md.block.ruler.getRules("list");
        oldParentType = state.parentType;
        state.parentType = "list";
        while (nextLine < endLine) {
          pos = posAfterMarker;
          max = state.eMarks[nextLine];
          initial = offset = state.sCount[nextLine] + posAfterMarker - (state.bMarks[startLine] + state.tShift[startLine]);
          while (pos < max) {
            ch = state.src.charCodeAt(pos);
            if (ch === 9) {
              offset += 4 - (offset + state.bsCount[nextLine]) % 4;
            } else if (ch === 32) {
              offset++;
            } else {
              break;
            }
            pos++;
          }
          contentStart = pos;
          if (contentStart >= max) {
            indentAfterMarker = 1;
          } else {
            indentAfterMarker = offset - initial;
          }
          if (indentAfterMarker > 4) {
            indentAfterMarker = 1;
          }
          indent = initial + indentAfterMarker;
          token = state.push("list_item_open", "li", 1);
          token.markup = String.fromCharCode(markerCharCode);
          token.map = itemLines = [startLine, 0];
          if (isOrdered) {
            token.info = state.src.slice(start, posAfterMarker - 1);
          }
          oldTight = state.tight;
          oldTShift = state.tShift[startLine];
          oldSCount = state.sCount[startLine];
          oldListIndent = state.listIndent;
          state.listIndent = state.blkIndent;
          state.blkIndent = indent;
          state.tight = true;
          state.tShift[startLine] = contentStart - state.bMarks[startLine];
          state.sCount[startLine] = offset;
          if (contentStart >= max && state.isEmpty(startLine + 1)) {
            state.line = Math.min(state.line + 2, endLine);
          } else {
            state.md.block.tokenize(state, startLine, endLine, true);
          }
          if (!state.tight || prevEmptyEnd) {
            tight = false;
          }
          prevEmptyEnd = state.line - startLine > 1 && state.isEmpty(state.line - 1);
          state.blkIndent = state.listIndent;
          state.listIndent = oldListIndent;
          state.tShift[startLine] = oldTShift;
          state.sCount[startLine] = oldSCount;
          state.tight = oldTight;
          token = state.push("list_item_close", "li", -1);
          token.markup = String.fromCharCode(markerCharCode);
          nextLine = startLine = state.line;
          itemLines[1] = nextLine;
          contentStart = state.bMarks[startLine];
          if (nextLine >= endLine) {
            break;
          }
          if (state.sCount[nextLine] < state.blkIndent) {
            break;
          }
          if (state.sCount[startLine] - state.blkIndent >= 4) {
            break;
          }
          terminate = false;
          for (i = 0, l = terminatorRules.length; i < l; i++) {
            if (terminatorRules[i](state, nextLine, endLine, true)) {
              terminate = true;
              break;
            }
          }
          if (terminate) {
            break;
          }
          if (isOrdered) {
            posAfterMarker = skipOrderedListMarker(state, nextLine);
            if (posAfterMarker < 0) {
              break;
            }
            start = state.bMarks[nextLine] + state.tShift[nextLine];
          } else {
            posAfterMarker = skipBulletListMarker(state, nextLine);
            if (posAfterMarker < 0) {
              break;
            }
          }
          if (markerCharCode !== state.src.charCodeAt(posAfterMarker - 1)) {
            break;
          }
        }
        if (isOrdered) {
          token = state.push("ordered_list_close", "ol", -1);
        } else {
          token = state.push("bullet_list_close", "ul", -1);
        }
        token.markup = String.fromCharCode(markerCharCode);
        listLines[1] = nextLine;
        state.line = nextLine;
        state.parentType = oldParentType;
        if (tight) {
          markTightParagraphs(state, listTokIdx);
        }
        return true;
      }, "list");
    }
  });

  // node_modules/markdown-it/lib/rules_block/reference.js
  var require_reference = __commonJS({
    "node_modules/markdown-it/lib/rules_block/reference.js"(exports, module) {
      "use strict";
      init_buffer_shim();
      var normalizeReference = require_utils().normalizeReference;
      var isSpace = require_utils().isSpace;
      module.exports = /* @__PURE__ */ __name(function reference(state, startLine, _endLine, silent) {
        var ch, destEndPos, destEndLineNo, endLine, href, i, l, label, labelEnd, oldParentType, res, start, str, terminate, terminatorRules, title, lines = 0, pos = state.bMarks[startLine] + state.tShift[startLine], max = state.eMarks[startLine], nextLine = startLine + 1;
        if (state.sCount[startLine] - state.blkIndent >= 4) {
          return false;
        }
        if (state.src.charCodeAt(pos) !== 91) {
          return false;
        }
        while (++pos < max) {
          if (state.src.charCodeAt(pos) === 93 && state.src.charCodeAt(pos - 1) !== 92) {
            if (pos + 1 === max) {
              return false;
            }
            if (state.src.charCodeAt(pos + 1) !== 58) {
              return false;
            }
            break;
          }
        }
        endLine = state.lineMax;
        terminatorRules = state.md.block.ruler.getRules("reference");
        oldParentType = state.parentType;
        state.parentType = "reference";
        for (; nextLine < endLine && !state.isEmpty(nextLine); nextLine++) {
          if (state.sCount[nextLine] - state.blkIndent > 3) {
            continue;
          }
          if (state.sCount[nextLine] < 0) {
            continue;
          }
          terminate = false;
          for (i = 0, l = terminatorRules.length; i < l; i++) {
            if (terminatorRules[i](state, nextLine, endLine, true)) {
              terminate = true;
              break;
            }
          }
          if (terminate) {
            break;
          }
        }
        str = state.getLines(startLine, nextLine, state.blkIndent, false).trim();
        max = str.length;
        for (pos = 1; pos < max; pos++) {
          ch = str.charCodeAt(pos);
          if (ch === 91) {
            return false;
          } else if (ch === 93) {
            labelEnd = pos;
            break;
          } else if (ch === 10) {
            lines++;
          } else if (ch === 92) {
            pos++;
            if (pos < max && str.charCodeAt(pos) === 10) {
              lines++;
            }
          }
        }
        if (labelEnd < 0 || str.charCodeAt(labelEnd + 1) !== 58) {
          return false;
        }
        for (pos = labelEnd + 2; pos < max; pos++) {
          ch = str.charCodeAt(pos);
          if (ch === 10) {
            lines++;
          } else if (isSpace(ch)) {
          } else {
            break;
          }
        }
        res = state.md.helpers.parseLinkDestination(str, pos, max);
        if (!res.ok) {
          return false;
        }
        href = state.md.normalizeLink(res.str);
        if (!state.md.validateLink(href)) {
          return false;
        }
        pos = res.pos;
        lines += res.lines;
        destEndPos = pos;
        destEndLineNo = lines;
        start = pos;
        for (; pos < max; pos++) {
          ch = str.charCodeAt(pos);
          if (ch === 10) {
            lines++;
          } else if (isSpace(ch)) {
          } else {
            break;
          }
        }
        res = state.md.helpers.parseLinkTitle(str, pos, max);
        if (pos < max && start !== pos && res.ok) {
          title = res.str;
          pos = res.pos;
          lines += res.lines;
        } else {
          title = "";
          pos = destEndPos;
          lines = destEndLineNo;
        }
        while (pos < max) {
          ch = str.charCodeAt(pos);
          if (!isSpace(ch)) {
            break;
          }
          pos++;
        }
        if (pos < max && str.charCodeAt(pos) !== 10) {
          if (title) {
            title = "";
            pos = destEndPos;
            lines = destEndLineNo;
            while (pos < max) {
              ch = str.charCodeAt(pos);
              if (!isSpace(ch)) {
                break;
              }
              pos++;
            }
          }
        }
        if (pos < max && str.charCodeAt(pos) !== 10) {
          return false;
        }
        label = normalizeReference(str.slice(1, labelEnd));
        if (!label) {
          return false;
        }
        if (silent) {
          return true;
        }
        if (typeof state.env.references === "undefined") {
          state.env.references = {};
        }
        if (typeof state.env.references[label] === "undefined") {
          state.env.references[label] = { title, href };
        }
        state.parentType = oldParentType;
        state.line = startLine + lines + 1;
        return true;
      }, "reference");
    }
  });

  // node_modules/markdown-it/lib/common/html_blocks.js
  var require_html_blocks = __commonJS({
    "node_modules/markdown-it/lib/common/html_blocks.js"(exports, module) {
      "use strict";
      init_buffer_shim();
      module.exports = [
        "address",
        "article",
        "aside",
        "base",
        "basefont",
        "blockquote",
        "body",
        "caption",
        "center",
        "col",
        "colgroup",
        "dd",
        "details",
        "dialog",
        "dir",
        "div",
        "dl",
        "dt",
        "fieldset",
        "figcaption",
        "figure",
        "footer",
        "form",
        "frame",
        "frameset",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "head",
        "header",
        "hr",
        "html",
        "iframe",
        "legend",
        "li",
        "link",
        "main",
        "menu",
        "menuitem",
        "nav",
        "noframes",
        "ol",
        "optgroup",
        "option",
        "p",
        "param",
        "section",
        "source",
        "summary",
        "table",
        "tbody",
        "td",
        "tfoot",
        "th",
        "thead",
        "title",
        "tr",
        "track",
        "ul"
      ];
    }
  });

  // node_modules/markdown-it/lib/common/html_re.js
  var require_html_re = __commonJS({
    "node_modules/markdown-it/lib/common/html_re.js"(exports, module) {
      "use strict";
      init_buffer_shim();
      var attr_name = "[a-zA-Z_:][a-zA-Z0-9:._-]*";
      var unquoted = "[^\"'=<>`\\x00-\\x20]+";
      var single_quoted = "'[^']*'";
      var double_quoted = '"[^"]*"';
      var attr_value = "(?:" + unquoted + "|" + single_quoted + "|" + double_quoted + ")";
      var attribute = "(?:\\s+" + attr_name + "(?:\\s*=\\s*" + attr_value + ")?)";
      var open_tag = "<[A-Za-z][A-Za-z0-9\\-]*" + attribute + "*\\s*\\/?>";
      var close_tag = "<\\/[A-Za-z][A-Za-z0-9\\-]*\\s*>";
      var comment = "<!---->|<!--(?:-?[^>-])(?:-?[^-])*-->";
      var processing = "<[?][\\s\\S]*?[?]>";
      var declaration = "<![A-Z]+\\s+[^>]*>";
      var cdata = "<!\\[CDATA\\[[\\s\\S]*?\\]\\]>";
      var HTML_TAG_RE = new RegExp("^(?:" + open_tag + "|" + close_tag + "|" + comment + "|" + processing + "|" + declaration + "|" + cdata + ")");
      var HTML_OPEN_CLOSE_TAG_RE = new RegExp("^(?:" + open_tag + "|" + close_tag + ")");
      module.exports.HTML_TAG_RE = HTML_TAG_RE;
      module.exports.HTML_OPEN_CLOSE_TAG_RE = HTML_OPEN_CLOSE_TAG_RE;
    }
  });

  // node_modules/markdown-it/lib/rules_block/html_block.js
  var require_html_block = __commonJS({
    "node_modules/markdown-it/lib/rules_block/html_block.js"(exports, module) {
      "use strict";
      init_buffer_shim();
      var block_names = require_html_blocks();
      var HTML_OPEN_CLOSE_TAG_RE = require_html_re().HTML_OPEN_CLOSE_TAG_RE;
      var HTML_SEQUENCES = [
        [/^<(script|pre|style|textarea)(?=(\s|>|$))/i, /<\/(script|pre|style|textarea)>/i, true],
        [/^<!--/, /-->/, true],
        [/^<\?/, /\?>/, true],
        [/^<![A-Z]/, />/, true],
        [/^<!\[CDATA\[/, /\]\]>/, true],
        [new RegExp("^</?(" + block_names.join("|") + ")(?=(\\s|/?>|$))", "i"), /^$/, true],
        [new RegExp(HTML_OPEN_CLOSE_TAG_RE.source + "\\s*$"), /^$/, false]
      ];
      module.exports = /* @__PURE__ */ __name(function html_block(state, startLine, endLine, silent) {
        var i, nextLine, token, lineText, pos = state.bMarks[startLine] + state.tShift[startLine], max = state.eMarks[startLine];
        if (state.sCount[startLine] - state.blkIndent >= 4) {
          return false;
        }
        if (!state.md.options.html) {
          return false;
        }
        if (state.src.charCodeAt(pos) !== 60) {
          return false;
        }
        lineText = state.src.slice(pos, max);
        for (i = 0; i < HTML_SEQUENCES.length; i++) {
          if (HTML_SEQUENCES[i][0].test(lineText)) {
            break;
          }
        }
        if (i === HTML_SEQUENCES.length) {
          return false;
        }
        if (silent) {
          return HTML_SEQUENCES[i][2];
        }
        nextLine = startLine + 1;
        if (!HTML_SEQUENCES[i][1].test(lineText)) {
          for (; nextLine < endLine; nextLine++) {
            if (state.sCount[nextLine] < state.blkIndent) {
              break;
            }
            pos = state.bMarks[nextLine] + state.tShift[nextLine];
            max = state.eMarks[nextLine];
            lineText = state.src.slice(pos, max);
            if (HTML_SEQUENCES[i][1].test(lineText)) {
              if (lineText.length !== 0) {
                nextLine++;
              }
              break;
            }
          }
        }
        state.line = nextLine;
        token = state.push("html_block", "", 0);
        token.map = [startLine, nextLine];
        token.content = state.getLines(startLine, nextLine, state.blkIndent, true);
        return true;
      }, "html_block");
    }
  });

  // node_modules/markdown-it/lib/rules_block/heading.js
  var require_heading = __commonJS({
    "node_modules/markdown-it/lib/rules_block/heading.js"(exports, module) {
      "use strict";
      init_buffer_shim();
      var isSpace = require_utils().isSpace;
      module.exports = /* @__PURE__ */ __name(function heading(state, startLine, endLine, silent) {
        var ch, level, tmp, token, pos = state.bMarks[startLine] + state.tShift[startLine], max = state.eMarks[startLine];
        if (state.sCount[startLine] - state.blkIndent >= 4) {
          return false;
        }
        ch = state.src.charCodeAt(pos);
        if (ch !== 35 || pos >= max) {
          return false;
        }
        level = 1;
        ch = state.src.charCodeAt(++pos);
        while (ch === 35 && pos < max && level <= 6) {
          level++;
          ch = state.src.charCodeAt(++pos);
        }
        if (level > 6 || pos < max && !isSpace(ch)) {
          return false;
        }
        if (silent) {
          return true;
        }
        max = state.skipSpacesBack(max, pos);
        tmp = state.skipCharsBack(max, 35, pos);
        if (tmp > pos && isSpace(state.src.charCodeAt(tmp - 1))) {
          max = tmp;
        }
        state.line = startLine + 1;
        token = state.push("heading_open", "h" + String(level), 1);
        token.markup = "########".slice(0, level);
        token.map = [startLine, state.line];
        token = state.push("inline", "", 0);
        token.content = state.src.slice(pos, max).trim();
        token.map = [startLine, state.line];
        token.children = [];
        token = state.push("heading_close", "h" + String(level), -1);
        token.markup = "########".slice(0, level);
        return true;
      }, "heading");
    }
  });

  // node_modules/markdown-it/lib/rules_block/lheading.js
  var require_lheading = __commonJS({
    "node_modules/markdown-it/lib/rules_block/lheading.js"(exports, module) {
      "use strict";
      init_buffer_shim();
      module.exports = /* @__PURE__ */ __name(function lheading(state, startLine, endLine) {
        var content, terminate, i, l, token, pos, max, level, marker, nextLine = startLine + 1, oldParentType, terminatorRules = state.md.block.ruler.getRules("paragraph");
        if (state.sCount[startLine] - state.blkIndent >= 4) {
          return false;
        }
        oldParentType = state.parentType;
        state.parentType = "paragraph";
        for (; nextLine < endLine && !state.isEmpty(nextLine); nextLine++) {
          if (state.sCount[nextLine] - state.blkIndent > 3) {
            continue;
          }
          if (state.sCount[nextLine] >= state.blkIndent) {
            pos = state.bMarks[nextLine] + state.tShift[nextLine];
            max = state.eMarks[nextLine];
            if (pos < max) {
              marker = state.src.charCodeAt(pos);
              if (marker === 45 || marker === 61) {
                pos = state.skipChars(pos, marker);
                pos = state.skipSpaces(pos);
                if (pos >= max) {
                  level = marker === 61 ? 1 : 2;
                  break;
                }
              }
            }
          }
          if (state.sCount[nextLine] < 0) {
            continue;
          }
          terminate = false;
          for (i = 0, l = terminatorRules.length; i < l; i++) {
            if (terminatorRules[i](state, nextLine, endLine, true)) {
              terminate = true;
              break;
            }
          }
          if (terminate) {
            break;
          }
        }
        if (!level) {
          return false;
        }
        content = state.getLines(startLine, nextLine, state.blkIndent, false).trim();
        state.line = nextLine + 1;
        token = state.push("heading_open", "h" + String(level), 1);
        token.markup = String.fromCharCode(marker);
        token.map = [startLine, state.line];
        token = state.push("inline", "", 0);
        token.content = content;
        token.map = [startLine, state.line - 1];
        token.children = [];
        token = state.push("heading_close", "h" + String(level), -1);
        token.markup = String.fromCharCode(marker);
        state.parentType = oldParentType;
        return true;
      }, "lheading");
    }
  });

  // node_modules/markdown-it/lib/rules_block/paragraph.js
  var require_paragraph = __commonJS({
    "node_modules/markdown-it/lib/rules_block/paragraph.js"(exports, module) {
      "use strict";
      init_buffer_shim();
      module.exports = /* @__PURE__ */ __name(function paragraph(state, startLine) {
        var content, terminate, i, l, token, oldParentType, nextLine = startLine + 1, terminatorRules = state.md.block.ruler.getRules("paragraph"), endLine = state.lineMax;
        oldParentType = state.parentType;
        state.parentType = "paragraph";
        for (; nextLine < endLine && !state.isEmpty(nextLine); nextLine++) {
          if (state.sCount[nextLine] - state.blkIndent > 3) {
            continue;
          }
          if (state.sCount[nextLine] < 0) {
            continue;
          }
          terminate = false;
          for (i = 0, l = terminatorRules.length; i < l; i++) {
            if (terminatorRules[i](state, nextLine, endLine, true)) {
              terminate = true;
              break;
            }
          }
          if (terminate) {
            break;
          }
        }
        content = state.getLines(startLine, nextLine, state.blkIndent, false).trim();
        state.line = nextLine;
        token = state.push("paragraph_open", "p", 1);
        token.map = [startLine, state.line];
        token = state.push("inline", "", 0);
        token.content = content;
        token.map = [startLine, state.line];
        token.children = [];
        token = state.push("paragraph_close", "p", -1);
        state.parentType = oldParentType;
        return true;
      }, "paragraph");
    }
  });

  // node_modules/markdown-it/lib/rules_block/state_block.js
  var require_state_block = __commonJS({
    "node_modules/markdown-it/lib/rules_block/state_block.js"(exports, module) {
      "use strict";
      init_buffer_shim();
      var Token = require_token();
      var isSpace = require_utils().isSpace;
      function StateBlock(src, md, env, tokens) {
        var ch, s, start, pos, len, indent, offset, indent_found;
        this.src = src;
        this.md = md;
        this.env = env;
        this.tokens = tokens;
        this.bMarks = [];
        this.eMarks = [];
        this.tShift = [];
        this.sCount = [];
        this.bsCount = [];
        this.blkIndent = 0;
        this.line = 0;
        this.lineMax = 0;
        this.tight = false;
        this.ddIndent = -1;
        this.listIndent = -1;
        this.parentType = "root";
        this.level = 0;
        this.result = "";
        s = this.src;
        indent_found = false;
        for (start = pos = indent = offset = 0, len = s.length; pos < len; pos++) {
          ch = s.charCodeAt(pos);
          if (!indent_found) {
            if (isSpace(ch)) {
              indent++;
              if (ch === 9) {
                offset += 4 - offset % 4;
              } else {
                offset++;
              }
              continue;
            } else {
              indent_found = true;
            }
          }
          if (ch === 10 || pos === len - 1) {
            if (ch !== 10) {
              pos++;
            }
            this.bMarks.push(start);
            this.eMarks.push(pos);
            this.tShift.push(indent);
            this.sCount.push(offset);
            this.bsCount.push(0);
            indent_found = false;
            indent = 0;
            offset = 0;
            start = pos + 1;
          }
        }
        this.bMarks.push(s.length);
        this.eMarks.push(s.length);
        this.tShift.push(0);
        this.sCount.push(0);
        this.bsCount.push(0);
        this.lineMax = this.bMarks.length - 1;
      }
      __name(StateBlock, "StateBlock");
      StateBlock.prototype.push = function(type, tag, nesting) {
        var token = new Token(type, tag, nesting);
        token.block = true;
        if (nesting < 0)
          this.level--;
        token.level = this.level;
        if (nesting > 0)
          this.level++;
        this.tokens.push(token);
        return token;
      };
      StateBlock.prototype.isEmpty = /* @__PURE__ */ __name(function isEmpty(line) {
        return this.bMarks[line] + this.tShift[line] >= this.eMarks[line];
      }, "isEmpty");
      StateBlock.prototype.skipEmptyLines = /* @__PURE__ */ __name(function skipEmptyLines(from) {
        for (var max = this.lineMax; from < max; from++) {
          if (this.bMarks[from] + this.tShift[from] < this.eMarks[from]) {
            break;
          }
        }
        return from;
      }, "skipEmptyLines");
      StateBlock.prototype.skipSpaces = /* @__PURE__ */ __name(function skipSpaces(pos) {
        var ch;
        for (var max = this.src.length; pos < max; pos++) {
          ch = this.src.charCodeAt(pos);
          if (!isSpace(ch)) {
            break;
          }
        }
        return pos;
      }, "skipSpaces");
      StateBlock.prototype.skipSpacesBack = /* @__PURE__ */ __name(function skipSpacesBack(pos, min) {
        if (pos <= min) {
          return pos;
        }
        while (pos > min) {
          if (!isSpace(this.src.charCodeAt(--pos))) {
            return pos + 1;
          }
        }
        return pos;
      }, "skipSpacesBack");
      StateBlock.prototype.skipChars = /* @__PURE__ */ __name(function skipChars(pos, code) {
        for (var max = this.src.length; pos < max; pos++) {
          if (this.src.charCodeAt(pos) !== code) {
            break;
          }
        }
        return pos;
      }, "skipChars");
      StateBlock.prototype.skipCharsBack = /* @__PURE__ */ __name(function skipCharsBack(pos, code, min) {
        if (pos <= min) {
          return pos;
        }
        while (pos > min) {
          if (code !== this.src.charCodeAt(--pos)) {
            return pos + 1;
          }
        }
        return pos;
      }, "skipCharsBack");
      StateBlock.prototype.getLines = /* @__PURE__ */ __name(function getLines(begin, end, indent, keepLastLF) {
        var i, lineIndent, ch, first, last, queue, lineStart, line = begin;
        if (begin >= end) {
          return "";
        }
        queue = new Array(end - begin);
        for (i = 0; line < end; line++, i++) {
          lineIndent = 0;
          lineStart = first = this.bMarks[line];
          if (line + 1 < end || keepLastLF) {
            last = this.eMarks[line] + 1;
          } else {
            last = this.eMarks[line];
          }
          while (first < last && lineIndent < indent) {
            ch = this.src.charCodeAt(first);
            if (isSpace(ch)) {
              if (ch === 9) {
                lineIndent += 4 - (lineIndent + this.bsCount[line]) % 4;
              } else {
                lineIndent++;
              }
            } else if (first - lineStart < this.tShift[line]) {
              lineIndent++;
            } else {
              break;
            }
            first++;
          }
          if (lineIndent > indent) {
            queue[i] = new Array(lineIndent - indent + 1).join(" ") + this.src.slice(first, last);
          } else {
            queue[i] = this.src.slice(first, last);
          }
        }
        return queue.join("");
      }, "getLines");
      StateBlock.prototype.Token = Token;
      module.exports = StateBlock;
    }
  });

  // node_modules/markdown-it/lib/parser_block.js
  var require_parser_block = __commonJS({
    "node_modules/markdown-it/lib/parser_block.js"(exports, module) {
      "use strict";
      init_buffer_shim();
      var Ruler = require_ruler();
      var _rules = [
        ["table", require_table(), ["paragraph", "reference"]],
        ["code", require_code()],
        ["fence", require_fence(), ["paragraph", "reference", "blockquote", "list"]],
        ["blockquote", require_blockquote(), ["paragraph", "reference", "blockquote", "list"]],
        ["hr", require_hr(), ["paragraph", "reference", "blockquote", "list"]],
        ["list", require_list(), ["paragraph", "reference", "blockquote"]],
        ["reference", require_reference()],
        ["html_block", require_html_block(), ["paragraph", "reference", "blockquote"]],
        ["heading", require_heading(), ["paragraph", "reference", "blockquote"]],
        ["lheading", require_lheading()],
        ["paragraph", require_paragraph()]
      ];
      function ParserBlock() {
        this.ruler = new Ruler();
        for (var i = 0; i < _rules.length; i++) {
          this.ruler.push(_rules[i][0], _rules[i][1], { alt: (_rules[i][2] || []).slice() });
        }
      }
      __name(ParserBlock, "ParserBlock");
      ParserBlock.prototype.tokenize = function(state, startLine, endLine) {
        var ok, i, rules = this.ruler.getRules(""), len = rules.length, line = startLine, hasEmptyLines = false, maxNesting = state.md.options.maxNesting;
        while (line < endLine) {
          state.line = line = state.skipEmptyLines(line);
          if (line >= endLine) {
            break;
          }
          if (state.sCount[line] < state.blkIndent) {
            break;
          }
          if (state.level >= maxNesting) {
            state.line = endLine;
            break;
          }
          for (i = 0; i < len; i++) {
            ok = rules[i](state, line, endLine, false);
            if (ok) {
              break;
            }
          }
          state.tight = !hasEmptyLines;
          if (state.isEmpty(state.line - 1)) {
            hasEmptyLines = true;
          }
          line = state.line;
          if (line < endLine && state.isEmpty(line)) {
            hasEmptyLines = true;
            line++;
            state.line = line;
          }
        }
      };
      ParserBlock.prototype.parse = function(src, md, env, outTokens) {
        var state;
        if (!src) {
          return;
        }
        state = new this.State(src, md, env, outTokens);
        this.tokenize(state, state.line, state.lineMax);
      };
      ParserBlock.prototype.State = require_state_block();
      module.exports = ParserBlock;
    }
  });

  // node_modules/markdown-it/lib/rules_inline/text.js
  var require_text = __commonJS({
    "node_modules/markdown-it/lib/rules_inline/text.js"(exports, module) {
      "use strict";
      init_buffer_shim();
      function isTerminatorChar(ch) {
        switch (ch) {
          case 10:
          case 33:
          case 35:
          case 36:
          case 37:
          case 38:
          case 42:
          case 43:
          case 45:
          case 58:
          case 60:
          case 61:
          case 62:
          case 64:
          case 91:
          case 92:
          case 93:
          case 94:
          case 95:
          case 96:
          case 123:
          case 125:
          case 126:
            return true;
          default:
            return false;
        }
      }
      __name(isTerminatorChar, "isTerminatorChar");
      module.exports = /* @__PURE__ */ __name(function text(state, silent) {
        var pos = state.pos;
        while (pos < state.posMax && !isTerminatorChar(state.src.charCodeAt(pos))) {
          pos++;
        }
        if (pos === state.pos) {
          return false;
        }
        if (!silent) {
          state.pending += state.src.slice(state.pos, pos);
        }
        state.pos = pos;
        return true;
      }, "text");
    }
  });

  // node_modules/markdown-it/lib/rules_inline/linkify.js
  var require_linkify2 = __commonJS({
    "node_modules/markdown-it/lib/rules_inline/linkify.js"(exports, module) {
      "use strict";
      init_buffer_shim();
      var SCHEME_RE = /(?:^|[^a-z0-9.+-])([a-z][a-z0-9.+-]*)$/i;
      module.exports = /* @__PURE__ */ __name(function linkify(state, silent) {
        var pos, max, match, proto, link, url, fullUrl, token;
        if (!state.md.options.linkify)
          return false;
        if (state.linkLevel > 0)
          return false;
        pos = state.pos;
        max = state.posMax;
        if (pos + 3 > max)
          return false;
        if (state.src.charCodeAt(pos) !== 58)
          return false;
        if (state.src.charCodeAt(pos + 1) !== 47)
          return false;
        if (state.src.charCodeAt(pos + 2) !== 47)
          return false;
        match = state.pending.match(SCHEME_RE);
        if (!match)
          return false;
        proto = match[1];
        link = state.md.linkify.matchAtStart(state.src.slice(pos - proto.length));
        if (!link)
          return false;
        url = link.url;
        url = url.replace(/\*+$/, "");
        fullUrl = state.md.normalizeLink(url);
        if (!state.md.validateLink(fullUrl))
          return false;
        if (!silent) {
          state.pending = state.pending.slice(0, -proto.length);
          token = state.push("link_open", "a", 1);
          token.attrs = [["href", fullUrl]];
          token.markup = "linkify";
          token.info = "auto";
          token = state.push("text", "", 0);
          token.content = state.md.normalizeLinkText(url);
          token = state.push("link_close", "a", -1);
          token.markup = "linkify";
          token.info = "auto";
        }
        state.pos += url.length - proto.length;
        return true;
      }, "linkify");
    }
  });

  // node_modules/markdown-it/lib/rules_inline/newline.js
  var require_newline = __commonJS({
    "node_modules/markdown-it/lib/rules_inline/newline.js"(exports, module) {
      "use strict";
      init_buffer_shim();
      var isSpace = require_utils().isSpace;
      module.exports = /* @__PURE__ */ __name(function newline(state, silent) {
        var pmax, max, ws, pos = state.pos;
        if (state.src.charCodeAt(pos) !== 10) {
          return false;
        }
        pmax = state.pending.length - 1;
        max = state.posMax;
        if (!silent) {
          if (pmax >= 0 && state.pending.charCodeAt(pmax) === 32) {
            if (pmax >= 1 && state.pending.charCodeAt(pmax - 1) === 32) {
              ws = pmax - 1;
              while (ws >= 1 && state.pending.charCodeAt(ws - 1) === 32)
                ws--;
              state.pending = state.pending.slice(0, ws);
              state.push("hardbreak", "br", 0);
            } else {
              state.pending = state.pending.slice(0, -1);
              state.push("softbreak", "br", 0);
            }
          } else {
            state.push("softbreak", "br", 0);
          }
        }
        pos++;
        while (pos < max && isSpace(state.src.charCodeAt(pos))) {
          pos++;
        }
        state.pos = pos;
        return true;
      }, "newline");
    }
  });

  // node_modules/markdown-it/lib/rules_inline/escape.js
  var require_escape = __commonJS({
    "node_modules/markdown-it/lib/rules_inline/escape.js"(exports, module) {
      "use strict";
      init_buffer_shim();
      var isSpace = require_utils().isSpace;
      var ESCAPED = [];
      for (i = 0; i < 256; i++) {
        ESCAPED.push(0);
      }
      var i;
      "\\!\"#$%&'()*+,./:;<=>?@[]^_`{|}~-".split("").forEach(function(ch) {
        ESCAPED[ch.charCodeAt(0)] = 1;
      });
      module.exports = /* @__PURE__ */ __name(function escape2(state, silent) {
        var ch1, ch2, origStr, escapedStr, token, pos = state.pos, max = state.posMax;
        if (state.src.charCodeAt(pos) !== 92)
          return false;
        pos++;
        if (pos >= max)
          return false;
        ch1 = state.src.charCodeAt(pos);
        if (ch1 === 10) {
          if (!silent) {
            state.push("hardbreak", "br", 0);
          }
          pos++;
          while (pos < max) {
            ch1 = state.src.charCodeAt(pos);
            if (!isSpace(ch1))
              break;
            pos++;
          }
          state.pos = pos;
          return true;
        }
        escapedStr = state.src[pos];
        if (ch1 >= 55296 && ch1 <= 56319 && pos + 1 < max) {
          ch2 = state.src.charCodeAt(pos + 1);
          if (ch2 >= 56320 && ch2 <= 57343) {
            escapedStr += state.src[pos + 1];
            pos++;
          }
        }
        origStr = "\\" + escapedStr;
        if (!silent) {
          token = state.push("text_special", "", 0);
          if (ch1 < 256 && ESCAPED[ch1] !== 0) {
            token.content = escapedStr;
          } else {
            token.content = origStr;
          }
          token.markup = origStr;
          token.info = "escape";
        }
        state.pos = pos + 1;
        return true;
      }, "escape");
    }
  });

  // node_modules/markdown-it/lib/rules_inline/backticks.js
  var require_backticks = __commonJS({
    "node_modules/markdown-it/lib/rules_inline/backticks.js"(exports, module) {
      "use strict";
      init_buffer_shim();
      module.exports = /* @__PURE__ */ __name(function backtick(state, silent) {
        var start, max, marker, token, matchStart, matchEnd, openerLength, closerLength, pos = state.pos, ch = state.src.charCodeAt(pos);
        if (ch !== 96) {
          return false;
        }
        start = pos;
        pos++;
        max = state.posMax;
        while (pos < max && state.src.charCodeAt(pos) === 96) {
          pos++;
        }
        marker = state.src.slice(start, pos);
        openerLength = marker.length;
        if (state.backticksScanned && (state.backticks[openerLength] || 0) <= start) {
          if (!silent)
            state.pending += marker;
          state.pos += openerLength;
          return true;
        }
        matchStart = matchEnd = pos;
        while ((matchStart = state.src.indexOf("`", matchEnd)) !== -1) {
          matchEnd = matchStart + 1;
          while (matchEnd < max && state.src.charCodeAt(matchEnd) === 96) {
            matchEnd++;
          }
          closerLength = matchEnd - matchStart;
          if (closerLength === openerLength) {
            if (!silent) {
              token = state.push("code_inline", "code", 0);
              token.markup = marker;
              token.content = state.src.slice(pos, matchStart).replace(/\n/g, " ").replace(/^ (.+) $/, "$1");
            }
            state.pos = matchEnd;
            return true;
          }
          state.backticks[closerLength] = matchStart;
        }
        state.backticksScanned = true;
        if (!silent)
          state.pending += marker;
        state.pos += openerLength;
        return true;
      }, "backtick");
    }
  });

  // node_modules/markdown-it/lib/rules_inline/strikethrough.js
  var require_strikethrough = __commonJS({
    "node_modules/markdown-it/lib/rules_inline/strikethrough.js"(exports, module) {
      "use strict";
      init_buffer_shim();
      module.exports.tokenize = /* @__PURE__ */ __name(function strikethrough(state, silent) {
        var i, scanned, token, len, ch, start = state.pos, marker = state.src.charCodeAt(start);
        if (silent) {
          return false;
        }
        if (marker !== 126) {
          return false;
        }
        scanned = state.scanDelims(state.pos, true);
        len = scanned.length;
        ch = String.fromCharCode(marker);
        if (len < 2) {
          return false;
        }
        if (len % 2) {
          token = state.push("text", "", 0);
          token.content = ch;
          len--;
        }
        for (i = 0; i < len; i += 2) {
          token = state.push("text", "", 0);
          token.content = ch + ch;
          state.delimiters.push({
            marker,
            length: 0,
            token: state.tokens.length - 1,
            end: -1,
            open: scanned.can_open,
            close: scanned.can_close
          });
        }
        state.pos += scanned.length;
        return true;
      }, "strikethrough");
      function postProcess(state, delimiters) {
        var i, j, startDelim, endDelim, token, loneMarkers = [], max = delimiters.length;
        for (i = 0; i < max; i++) {
          startDelim = delimiters[i];
          if (startDelim.marker !== 126) {
            continue;
          }
          if (startDelim.end === -1) {
            continue;
          }
          endDelim = delimiters[startDelim.end];
          token = state.tokens[startDelim.token];
          token.type = "s_open";
          token.tag = "s";
          token.nesting = 1;
          token.markup = "~~";
          token.content = "";
          token = state.tokens[endDelim.token];
          token.type = "s_close";
          token.tag = "s";
          token.nesting = -1;
          token.markup = "~~";
          token.content = "";
          if (state.tokens[endDelim.token - 1].type === "text" && state.tokens[endDelim.token - 1].content === "~") {
            loneMarkers.push(endDelim.token - 1);
          }
        }
        while (loneMarkers.length) {
          i = loneMarkers.pop();
          j = i + 1;
          while (j < state.tokens.length && state.tokens[j].type === "s_close") {
            j++;
          }
          j--;
          if (i !== j) {
            token = state.tokens[j];
            state.tokens[j] = state.tokens[i];
            state.tokens[i] = token;
          }
        }
      }
      __name(postProcess, "postProcess");
      module.exports.postProcess = /* @__PURE__ */ __name(function strikethrough(state) {
        var curr, tokens_meta = state.tokens_meta, max = state.tokens_meta.length;
        postProcess(state, state.delimiters);
        for (curr = 0; curr < max; curr++) {
          if (tokens_meta[curr] && tokens_meta[curr].delimiters) {
            postProcess(state, tokens_meta[curr].delimiters);
          }
        }
      }, "strikethrough");
    }
  });

  // node_modules/markdown-it/lib/rules_inline/emphasis.js
  var require_emphasis = __commonJS({
    "node_modules/markdown-it/lib/rules_inline/emphasis.js"(exports, module) {
      "use strict";
      init_buffer_shim();
      module.exports.tokenize = /* @__PURE__ */ __name(function emphasis(state, silent) {
        var i, scanned, token, start = state.pos, marker = state.src.charCodeAt(start);
        if (silent) {
          return false;
        }
        if (marker !== 95 && marker !== 42) {
          return false;
        }
        scanned = state.scanDelims(state.pos, marker === 42);
        for (i = 0; i < scanned.length; i++) {
          token = state.push("text", "", 0);
          token.content = String.fromCharCode(marker);
          state.delimiters.push({
            marker,
            length: scanned.length,
            token: state.tokens.length - 1,
            end: -1,
            open: scanned.can_open,
            close: scanned.can_close
          });
        }
        state.pos += scanned.length;
        return true;
      }, "emphasis");
      function postProcess(state, delimiters) {
        var i, startDelim, endDelim, token, ch, isStrong, max = delimiters.length;
        for (i = max - 1; i >= 0; i--) {
          startDelim = delimiters[i];
          if (startDelim.marker !== 95 && startDelim.marker !== 42) {
            continue;
          }
          if (startDelim.end === -1) {
            continue;
          }
          endDelim = delimiters[startDelim.end];
          isStrong = i > 0 && delimiters[i - 1].end === startDelim.end + 1 && delimiters[i - 1].marker === startDelim.marker && delimiters[i - 1].token === startDelim.token - 1 && delimiters[startDelim.end + 1].token === endDelim.token + 1;
          ch = String.fromCharCode(startDelim.marker);
          token = state.tokens[startDelim.token];
          token.type = isStrong ? "strong_open" : "em_open";
          token.tag = isStrong ? "strong" : "em";
          token.nesting = 1;
          token.markup = isStrong ? ch + ch : ch;
          token.content = "";
          token = state.tokens[endDelim.token];
          token.type = isStrong ? "strong_close" : "em_close";
          token.tag = isStrong ? "strong" : "em";
          token.nesting = -1;
          token.markup = isStrong ? ch + ch : ch;
          token.content = "";
          if (isStrong) {
            state.tokens[delimiters[i - 1].token].content = "";
            state.tokens[delimiters[startDelim.end + 1].token].content = "";
            i--;
          }
        }
      }
      __name(postProcess, "postProcess");
      module.exports.postProcess = /* @__PURE__ */ __name(function emphasis(state) {
        var curr, tokens_meta = state.tokens_meta, max = state.tokens_meta.length;
        postProcess(state, state.delimiters);
        for (curr = 0; curr < max; curr++) {
          if (tokens_meta[curr] && tokens_meta[curr].delimiters) {
            postProcess(state, tokens_meta[curr].delimiters);
          }
        }
      }, "emphasis");
    }
  });

  // node_modules/markdown-it/lib/rules_inline/link.js
  var require_link = __commonJS({
    "node_modules/markdown-it/lib/rules_inline/link.js"(exports, module) {
      "use strict";
      init_buffer_shim();
      var normalizeReference = require_utils().normalizeReference;
      var isSpace = require_utils().isSpace;
      module.exports = /* @__PURE__ */ __name(function link(state, silent) {
        var attrs, code, label, labelEnd, labelStart, pos, res, ref, token, href = "", title = "", oldPos = state.pos, max = state.posMax, start = state.pos, parseReference = true;
        if (state.src.charCodeAt(state.pos) !== 91) {
          return false;
        }
        labelStart = state.pos + 1;
        labelEnd = state.md.helpers.parseLinkLabel(state, state.pos, true);
        if (labelEnd < 0) {
          return false;
        }
        pos = labelEnd + 1;
        if (pos < max && state.src.charCodeAt(pos) === 40) {
          parseReference = false;
          pos++;
          for (; pos < max; pos++) {
            code = state.src.charCodeAt(pos);
            if (!isSpace(code) && code !== 10) {
              break;
            }
          }
          if (pos >= max) {
            return false;
          }
          start = pos;
          res = state.md.helpers.parseLinkDestination(state.src, pos, state.posMax);
          if (res.ok) {
            href = state.md.normalizeLink(res.str);
            if (state.md.validateLink(href)) {
              pos = res.pos;
            } else {
              href = "";
            }
            start = pos;
            for (; pos < max; pos++) {
              code = state.src.charCodeAt(pos);
              if (!isSpace(code) && code !== 10) {
                break;
              }
            }
            res = state.md.helpers.parseLinkTitle(state.src, pos, state.posMax);
            if (pos < max && start !== pos && res.ok) {
              title = res.str;
              pos = res.pos;
              for (; pos < max; pos++) {
                code = state.src.charCodeAt(pos);
                if (!isSpace(code) && code !== 10) {
                  break;
                }
              }
            }
          }
          if (pos >= max || state.src.charCodeAt(pos) !== 41) {
            parseReference = true;
          }
          pos++;
        }
        if (parseReference) {
          if (typeof state.env.references === "undefined") {
            return false;
          }
          if (pos < max && state.src.charCodeAt(pos) === 91) {
            start = pos + 1;
            pos = state.md.helpers.parseLinkLabel(state, pos);
            if (pos >= 0) {
              label = state.src.slice(start, pos++);
            } else {
              pos = labelEnd + 1;
            }
          } else {
            pos = labelEnd + 1;
          }
          if (!label) {
            label = state.src.slice(labelStart, labelEnd);
          }
          ref = state.env.references[normalizeReference(label)];
          if (!ref) {
            state.pos = oldPos;
            return false;
          }
          href = ref.href;
          title = ref.title;
        }
        if (!silent) {
          state.pos = labelStart;
          state.posMax = labelEnd;
          token = state.push("link_open", "a", 1);
          token.attrs = attrs = [["href", href]];
          if (title) {
            attrs.push(["title", title]);
          }
          state.linkLevel++;
          state.md.inline.tokenize(state);
          state.linkLevel--;
          token = state.push("link_close", "a", -1);
        }
        state.pos = pos;
        state.posMax = max;
        return true;
      }, "link");
    }
  });

  // node_modules/markdown-it/lib/rules_inline/image.js
  var require_image = __commonJS({
    "node_modules/markdown-it/lib/rules_inline/image.js"(exports, module) {
      "use strict";
      init_buffer_shim();
      var normalizeReference = require_utils().normalizeReference;
      var isSpace = require_utils().isSpace;
      module.exports = /* @__PURE__ */ __name(function image(state, silent) {
        var attrs, code, content, label, labelEnd, labelStart, pos, ref, res, title, token, tokens, start, href = "", oldPos = state.pos, max = state.posMax;
        if (state.src.charCodeAt(state.pos) !== 33) {
          return false;
        }
        if (state.src.charCodeAt(state.pos + 1) !== 91) {
          return false;
        }
        labelStart = state.pos + 2;
        labelEnd = state.md.helpers.parseLinkLabel(state, state.pos + 1, false);
        if (labelEnd < 0) {
          return false;
        }
        pos = labelEnd + 1;
        if (pos < max && state.src.charCodeAt(pos) === 40) {
          pos++;
          for (; pos < max; pos++) {
            code = state.src.charCodeAt(pos);
            if (!isSpace(code) && code !== 10) {
              break;
            }
          }
          if (pos >= max) {
            return false;
          }
          start = pos;
          res = state.md.helpers.parseLinkDestination(state.src, pos, state.posMax);
          if (res.ok) {
            href = state.md.normalizeLink(res.str);
            if (state.md.validateLink(href)) {
              pos = res.pos;
            } else {
              href = "";
            }
          }
          start = pos;
          for (; pos < max; pos++) {
            code = state.src.charCodeAt(pos);
            if (!isSpace(code) && code !== 10) {
              break;
            }
          }
          res = state.md.helpers.parseLinkTitle(state.src, pos, state.posMax);
          if (pos < max && start !== pos && res.ok) {
            title = res.str;
            pos = res.pos;
            for (; pos < max; pos++) {
              code = state.src.charCodeAt(pos);
              if (!isSpace(code) && code !== 10) {
                break;
              }
            }
          } else {
            title = "";
          }
          if (pos >= max || state.src.charCodeAt(pos) !== 41) {
            state.pos = oldPos;
            return false;
          }
          pos++;
        } else {
          if (typeof state.env.references === "undefined") {
            return false;
          }
          if (pos < max && state.src.charCodeAt(pos) === 91) {
            start = pos + 1;
            pos = state.md.helpers.parseLinkLabel(state, pos);
            if (pos >= 0) {
              label = state.src.slice(start, pos++);
            } else {
              pos = labelEnd + 1;
            }
          } else {
            pos = labelEnd + 1;
          }
          if (!label) {
            label = state.src.slice(labelStart, labelEnd);
          }
          ref = state.env.references[normalizeReference(label)];
          if (!ref) {
            state.pos = oldPos;
            return false;
          }
          href = ref.href;
          title = ref.title;
        }
        if (!silent) {
          content = state.src.slice(labelStart, labelEnd);
          state.md.inline.parse(
            content,
            state.md,
            state.env,
            tokens = []
          );
          token = state.push("image", "img", 0);
          token.attrs = attrs = [["src", href], ["alt", ""]];
          token.children = tokens;
          token.content = content;
          if (title) {
            attrs.push(["title", title]);
          }
        }
        state.pos = pos;
        state.posMax = max;
        return true;
      }, "image");
    }
  });

  // node_modules/markdown-it/lib/rules_inline/autolink.js
  var require_autolink = __commonJS({
    "node_modules/markdown-it/lib/rules_inline/autolink.js"(exports, module) {
      "use strict";
      init_buffer_shim();
      var EMAIL_RE = /^([a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)$/;
      var AUTOLINK_RE = /^([a-zA-Z][a-zA-Z0-9+.\-]{1,31}):([^<>\x00-\x20]*)$/;
      module.exports = /* @__PURE__ */ __name(function autolink(state, silent) {
        var url, fullUrl, token, ch, start, max, pos = state.pos;
        if (state.src.charCodeAt(pos) !== 60) {
          return false;
        }
        start = state.pos;
        max = state.posMax;
        for (; ; ) {
          if (++pos >= max)
            return false;
          ch = state.src.charCodeAt(pos);
          if (ch === 60)
            return false;
          if (ch === 62)
            break;
        }
        url = state.src.slice(start + 1, pos);
        if (AUTOLINK_RE.test(url)) {
          fullUrl = state.md.normalizeLink(url);
          if (!state.md.validateLink(fullUrl)) {
            return false;
          }
          if (!silent) {
            token = state.push("link_open", "a", 1);
            token.attrs = [["href", fullUrl]];
            token.markup = "autolink";
            token.info = "auto";
            token = state.push("text", "", 0);
            token.content = state.md.normalizeLinkText(url);
            token = state.push("link_close", "a", -1);
            token.markup = "autolink";
            token.info = "auto";
          }
          state.pos += url.length + 2;
          return true;
        }
        if (EMAIL_RE.test(url)) {
          fullUrl = state.md.normalizeLink("mailto:" + url);
          if (!state.md.validateLink(fullUrl)) {
            return false;
          }
          if (!silent) {
            token = state.push("link_open", "a", 1);
            token.attrs = [["href", fullUrl]];
            token.markup = "autolink";
            token.info = "auto";
            token = state.push("text", "", 0);
            token.content = state.md.normalizeLinkText(url);
            token = state.push("link_close", "a", -1);
            token.markup = "autolink";
            token.info = "auto";
          }
          state.pos += url.length + 2;
          return true;
        }
        return false;
      }, "autolink");
    }
  });

  // node_modules/markdown-it/lib/rules_inline/html_inline.js
  var require_html_inline = __commonJS({
    "node_modules/markdown-it/lib/rules_inline/html_inline.js"(exports, module) {
      "use strict";
      init_buffer_shim();
      var HTML_TAG_RE = require_html_re().HTML_TAG_RE;
      function isLinkOpen(str) {
        return /^<a[>\s]/i.test(str);
      }
      __name(isLinkOpen, "isLinkOpen");
      function isLinkClose(str) {
        return /^<\/a\s*>/i.test(str);
      }
      __name(isLinkClose, "isLinkClose");
      function isLetter(ch) {
        var lc = ch | 32;
        return lc >= 97 && lc <= 122;
      }
      __name(isLetter, "isLetter");
      module.exports = /* @__PURE__ */ __name(function html_inline(state, silent) {
        var ch, match, max, token, pos = state.pos;
        if (!state.md.options.html) {
          return false;
        }
        max = state.posMax;
        if (state.src.charCodeAt(pos) !== 60 || pos + 2 >= max) {
          return false;
        }
        ch = state.src.charCodeAt(pos + 1);
        if (ch !== 33 && ch !== 63 && ch !== 47 && !isLetter(ch)) {
          return false;
        }
        match = state.src.slice(pos).match(HTML_TAG_RE);
        if (!match) {
          return false;
        }
        if (!silent) {
          token = state.push("html_inline", "", 0);
          token.content = state.src.slice(pos, pos + match[0].length);
          if (isLinkOpen(token.content))
            state.linkLevel++;
          if (isLinkClose(token.content))
            state.linkLevel--;
        }
        state.pos += match[0].length;
        return true;
      }, "html_inline");
    }
  });

  // node_modules/markdown-it/lib/rules_inline/entity.js
  var require_entity = __commonJS({
    "node_modules/markdown-it/lib/rules_inline/entity.js"(exports, module) {
      "use strict";
      init_buffer_shim();
      var entities = require_entities2();
      var has = require_utils().has;
      var isValidEntityCode = require_utils().isValidEntityCode;
      var fromCodePoint = require_utils().fromCodePoint;
      var DIGITAL_RE = /^&#((?:x[a-f0-9]{1,6}|[0-9]{1,7}));/i;
      var NAMED_RE = /^&([a-z][a-z0-9]{1,31});/i;
      module.exports = /* @__PURE__ */ __name(function entity(state, silent) {
        var ch, code, match, token, pos = state.pos, max = state.posMax;
        if (state.src.charCodeAt(pos) !== 38)
          return false;
        if (pos + 1 >= max)
          return false;
        ch = state.src.charCodeAt(pos + 1);
        if (ch === 35) {
          match = state.src.slice(pos).match(DIGITAL_RE);
          if (match) {
            if (!silent) {
              code = match[1][0].toLowerCase() === "x" ? parseInt(match[1].slice(1), 16) : parseInt(match[1], 10);
              token = state.push("text_special", "", 0);
              token.content = isValidEntityCode(code) ? fromCodePoint(code) : fromCodePoint(65533);
              token.markup = match[0];
              token.info = "entity";
            }
            state.pos += match[0].length;
            return true;
          }
        } else {
          match = state.src.slice(pos).match(NAMED_RE);
          if (match) {
            if (has(entities, match[1])) {
              if (!silent) {
                token = state.push("text_special", "", 0);
                token.content = entities[match[1]];
                token.markup = match[0];
                token.info = "entity";
              }
              state.pos += match[0].length;
              return true;
            }
          }
        }
        return false;
      }, "entity");
    }
  });

  // node_modules/markdown-it/lib/rules_inline/balance_pairs.js
  var require_balance_pairs = __commonJS({
    "node_modules/markdown-it/lib/rules_inline/balance_pairs.js"(exports, module) {
      "use strict";
      init_buffer_shim();
      function processDelimiters(state, delimiters) {
        var closerIdx, openerIdx, closer, opener, minOpenerIdx, newMinOpenerIdx, isOddMatch, lastJump, openersBottom = {}, max = delimiters.length;
        if (!max)
          return;
        var headerIdx = 0;
        var lastTokenIdx = -2;
        var jumps = [];
        for (closerIdx = 0; closerIdx < max; closerIdx++) {
          closer = delimiters[closerIdx];
          jumps.push(0);
          if (delimiters[headerIdx].marker !== closer.marker || lastTokenIdx !== closer.token - 1) {
            headerIdx = closerIdx;
          }
          lastTokenIdx = closer.token;
          closer.length = closer.length || 0;
          if (!closer.close)
            continue;
          if (!openersBottom.hasOwnProperty(closer.marker)) {
            openersBottom[closer.marker] = [-1, -1, -1, -1, -1, -1];
          }
          minOpenerIdx = openersBottom[closer.marker][(closer.open ? 3 : 0) + closer.length % 3];
          openerIdx = headerIdx - jumps[headerIdx] - 1;
          newMinOpenerIdx = openerIdx;
          for (; openerIdx > minOpenerIdx; openerIdx -= jumps[openerIdx] + 1) {
            opener = delimiters[openerIdx];
            if (opener.marker !== closer.marker)
              continue;
            if (opener.open && opener.end < 0) {
              isOddMatch = false;
              if (opener.close || closer.open) {
                if ((opener.length + closer.length) % 3 === 0) {
                  if (opener.length % 3 !== 0 || closer.length % 3 !== 0) {
                    isOddMatch = true;
                  }
                }
              }
              if (!isOddMatch) {
                lastJump = openerIdx > 0 && !delimiters[openerIdx - 1].open ? jumps[openerIdx - 1] + 1 : 0;
                jumps[closerIdx] = closerIdx - openerIdx + lastJump;
                jumps[openerIdx] = lastJump;
                closer.open = false;
                opener.end = closerIdx;
                opener.close = false;
                newMinOpenerIdx = -1;
                lastTokenIdx = -2;
                break;
              }
            }
          }
          if (newMinOpenerIdx !== -1) {
            openersBottom[closer.marker][(closer.open ? 3 : 0) + (closer.length || 0) % 3] = newMinOpenerIdx;
          }
        }
      }
      __name(processDelimiters, "processDelimiters");
      module.exports = /* @__PURE__ */ __name(function link_pairs(state) {
        var curr, tokens_meta = state.tokens_meta, max = state.tokens_meta.length;
        processDelimiters(state, state.delimiters);
        for (curr = 0; curr < max; curr++) {
          if (tokens_meta[curr] && tokens_meta[curr].delimiters) {
            processDelimiters(state, tokens_meta[curr].delimiters);
          }
        }
      }, "link_pairs");
    }
  });

  // node_modules/markdown-it/lib/rules_inline/fragments_join.js
  var require_fragments_join = __commonJS({
    "node_modules/markdown-it/lib/rules_inline/fragments_join.js"(exports, module) {
      "use strict";
      init_buffer_shim();
      module.exports = /* @__PURE__ */ __name(function fragments_join(state) {
        var curr, last, level = 0, tokens = state.tokens, max = state.tokens.length;
        for (curr = last = 0; curr < max; curr++) {
          if (tokens[curr].nesting < 0)
            level--;
          tokens[curr].level = level;
          if (tokens[curr].nesting > 0)
            level++;
          if (tokens[curr].type === "text" && curr + 1 < max && tokens[curr + 1].type === "text") {
            tokens[curr + 1].content = tokens[curr].content + tokens[curr + 1].content;
          } else {
            if (curr !== last) {
              tokens[last] = tokens[curr];
            }
            last++;
          }
        }
        if (curr !== last) {
          tokens.length = last;
        }
      }, "fragments_join");
    }
  });

  // node_modules/markdown-it/lib/rules_inline/state_inline.js
  var require_state_inline = __commonJS({
    "node_modules/markdown-it/lib/rules_inline/state_inline.js"(exports, module) {
      "use strict";
      init_buffer_shim();
      var Token = require_token();
      var isWhiteSpace = require_utils().isWhiteSpace;
      var isPunctChar = require_utils().isPunctChar;
      var isMdAsciiPunct = require_utils().isMdAsciiPunct;
      function StateInline(src, md, env, outTokens) {
        this.src = src;
        this.env = env;
        this.md = md;
        this.tokens = outTokens;
        this.tokens_meta = Array(outTokens.length);
        this.pos = 0;
        this.posMax = this.src.length;
        this.level = 0;
        this.pending = "";
        this.pendingLevel = 0;
        this.cache = {};
        this.delimiters = [];
        this._prev_delimiters = [];
        this.backticks = {};
        this.backticksScanned = false;
        this.linkLevel = 0;
      }
      __name(StateInline, "StateInline");
      StateInline.prototype.pushPending = function() {
        var token = new Token("text", "", 0);
        token.content = this.pending;
        token.level = this.pendingLevel;
        this.tokens.push(token);
        this.pending = "";
        return token;
      };
      StateInline.prototype.push = function(type, tag, nesting) {
        if (this.pending) {
          this.pushPending();
        }
        var token = new Token(type, tag, nesting);
        var token_meta = null;
        if (nesting < 0) {
          this.level--;
          this.delimiters = this._prev_delimiters.pop();
        }
        token.level = this.level;
        if (nesting > 0) {
          this.level++;
          this._prev_delimiters.push(this.delimiters);
          this.delimiters = [];
          token_meta = { delimiters: this.delimiters };
        }
        this.pendingLevel = this.level;
        this.tokens.push(token);
        this.tokens_meta.push(token_meta);
        return token;
      };
      StateInline.prototype.scanDelims = function(start, canSplitWord) {
        var pos = start, lastChar, nextChar, count, can_open, can_close, isLastWhiteSpace, isLastPunctChar, isNextWhiteSpace, isNextPunctChar, left_flanking = true, right_flanking = true, max = this.posMax, marker = this.src.charCodeAt(start);
        lastChar = start > 0 ? this.src.charCodeAt(start - 1) : 32;
        while (pos < max && this.src.charCodeAt(pos) === marker) {
          pos++;
        }
        count = pos - start;
        nextChar = pos < max ? this.src.charCodeAt(pos) : 32;
        isLastPunctChar = isMdAsciiPunct(lastChar) || isPunctChar(String.fromCharCode(lastChar));
        isNextPunctChar = isMdAsciiPunct(nextChar) || isPunctChar(String.fromCharCode(nextChar));
        isLastWhiteSpace = isWhiteSpace(lastChar);
        isNextWhiteSpace = isWhiteSpace(nextChar);
        if (isNextWhiteSpace) {
          left_flanking = false;
        } else if (isNextPunctChar) {
          if (!(isLastWhiteSpace || isLastPunctChar)) {
            left_flanking = false;
          }
        }
        if (isLastWhiteSpace) {
          right_flanking = false;
        } else if (isLastPunctChar) {
          if (!(isNextWhiteSpace || isNextPunctChar)) {
            right_flanking = false;
          }
        }
        if (!canSplitWord) {
          can_open = left_flanking && (!right_flanking || isLastPunctChar);
          can_close = right_flanking && (!left_flanking || isNextPunctChar);
        } else {
          can_open = left_flanking;
          can_close = right_flanking;
        }
        return {
          can_open,
          can_close,
          length: count
        };
      };
      StateInline.prototype.Token = Token;
      module.exports = StateInline;
    }
  });

  // node_modules/markdown-it/lib/parser_inline.js
  var require_parser_inline = __commonJS({
    "node_modules/markdown-it/lib/parser_inline.js"(exports, module) {
      "use strict";
      init_buffer_shim();
      var Ruler = require_ruler();
      var _rules = [
        ["text", require_text()],
        ["linkify", require_linkify2()],
        ["newline", require_newline()],
        ["escape", require_escape()],
        ["backticks", require_backticks()],
        ["strikethrough", require_strikethrough().tokenize],
        ["emphasis", require_emphasis().tokenize],
        ["link", require_link()],
        ["image", require_image()],
        ["autolink", require_autolink()],
        ["html_inline", require_html_inline()],
        ["entity", require_entity()]
      ];
      var _rules2 = [
        ["balance_pairs", require_balance_pairs()],
        ["strikethrough", require_strikethrough().postProcess],
        ["emphasis", require_emphasis().postProcess],
        ["fragments_join", require_fragments_join()]
      ];
      function ParserInline() {
        var i;
        this.ruler = new Ruler();
        for (i = 0; i < _rules.length; i++) {
          this.ruler.push(_rules[i][0], _rules[i][1]);
        }
        this.ruler2 = new Ruler();
        for (i = 0; i < _rules2.length; i++) {
          this.ruler2.push(_rules2[i][0], _rules2[i][1]);
        }
      }
      __name(ParserInline, "ParserInline");
      ParserInline.prototype.skipToken = function(state) {
        var ok, i, pos = state.pos, rules = this.ruler.getRules(""), len = rules.length, maxNesting = state.md.options.maxNesting, cache = state.cache;
        if (typeof cache[pos] !== "undefined") {
          state.pos = cache[pos];
          return;
        }
        if (state.level < maxNesting) {
          for (i = 0; i < len; i++) {
            state.level++;
            ok = rules[i](state, true);
            state.level--;
            if (ok) {
              break;
            }
          }
        } else {
          state.pos = state.posMax;
        }
        if (!ok) {
          state.pos++;
        }
        cache[pos] = state.pos;
      };
      ParserInline.prototype.tokenize = function(state) {
        var ok, i, rules = this.ruler.getRules(""), len = rules.length, end = state.posMax, maxNesting = state.md.options.maxNesting;
        while (state.pos < end) {
          if (state.level < maxNesting) {
            for (i = 0; i < len; i++) {
              ok = rules[i](state, false);
              if (ok) {
                break;
              }
            }
          }
          if (ok) {
            if (state.pos >= end) {
              break;
            }
            continue;
          }
          state.pending += state.src[state.pos++];
        }
        if (state.pending) {
          state.pushPending();
        }
      };
      ParserInline.prototype.parse = function(str, md, env, outTokens) {
        var i, rules, len;
        var state = new this.State(str, md, env, outTokens);
        this.tokenize(state);
        rules = this.ruler2.getRules("");
        len = rules.length;
        for (i = 0; i < len; i++) {
          rules[i](state);
        }
      };
      ParserInline.prototype.State = require_state_inline();
      module.exports = ParserInline;
    }
  });

  // node_modules/linkify-it/lib/re.js
  var require_re = __commonJS({
    "node_modules/linkify-it/lib/re.js"(exports, module) {
      "use strict";
      init_buffer_shim();
      module.exports = function(opts) {
        var re = {};
        opts = opts || {};
        re.src_Any = require_regex2().source;
        re.src_Cc = require_regex3().source;
        re.src_Z = require_regex5().source;
        re.src_P = require_regex().source;
        re.src_ZPCc = [re.src_Z, re.src_P, re.src_Cc].join("|");
        re.src_ZCc = [re.src_Z, re.src_Cc].join("|");
        var text_separators = "[><\uFF5C]";
        re.src_pseudo_letter = "(?:(?!" + text_separators + "|" + re.src_ZPCc + ")" + re.src_Any + ")";
        re.src_ip4 = "(?:(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)";
        re.src_auth = "(?:(?:(?!" + re.src_ZCc + "|[@/\\[\\]()]).)+@)?";
        re.src_port = "(?::(?:6(?:[0-4]\\d{3}|5(?:[0-4]\\d{2}|5(?:[0-2]\\d|3[0-5])))|[1-5]?\\d{1,4}))?";
        re.src_host_terminator = "(?=$|" + text_separators + "|" + re.src_ZPCc + ")(?!" + (opts["---"] ? "-(?!--)|" : "-|") + "_|:\\d|\\.-|\\.(?!$|" + re.src_ZPCc + "))";
        re.src_path = "(?:[/?#](?:(?!" + re.src_ZCc + "|" + text_separators + `|[()[\\]{}.,"'?!\\-;]).|\\[(?:(?!` + re.src_ZCc + "|\\]).)*\\]|\\((?:(?!" + re.src_ZCc + "|[)]).)*\\)|\\{(?:(?!" + re.src_ZCc + '|[}]).)*\\}|\\"(?:(?!' + re.src_ZCc + `|["]).)+\\"|\\'(?:(?!` + re.src_ZCc + "|[']).)+\\'|\\'(?=" + re.src_pseudo_letter + "|[-])|\\.{2,}[a-zA-Z0-9%/&]|\\.(?!" + re.src_ZCc + "|[.]|$)|" + (opts["---"] ? "\\-(?!--(?:[^-]|$))(?:-*)|" : "\\-+|") + ",(?!" + re.src_ZCc + "|$)|;(?!" + re.src_ZCc + "|$)|\\!+(?!" + re.src_ZCc + "|[!]|$)|\\?(?!" + re.src_ZCc + "|[?]|$))+|\\/)?";
        re.src_email_name = '[\\-;:&=\\+\\$,\\.a-zA-Z0-9_][\\-;:&=\\+\\$,\\"\\.a-zA-Z0-9_]*';
        re.src_xn = "xn--[a-z0-9\\-]{1,59}";
        re.src_domain_root = "(?:" + re.src_xn + "|" + re.src_pseudo_letter + "{1,63})";
        re.src_domain = "(?:" + re.src_xn + "|(?:" + re.src_pseudo_letter + ")|(?:" + re.src_pseudo_letter + "(?:-|" + re.src_pseudo_letter + "){0,61}" + re.src_pseudo_letter + "))";
        re.src_host = "(?:(?:(?:(?:" + re.src_domain + ")\\.)*" + re.src_domain + "))";
        re.tpl_host_fuzzy = "(?:" + re.src_ip4 + "|(?:(?:(?:" + re.src_domain + ")\\.)+(?:%TLDS%)))";
        re.tpl_host_no_ip_fuzzy = "(?:(?:(?:" + re.src_domain + ")\\.)+(?:%TLDS%))";
        re.src_host_strict = re.src_host + re.src_host_terminator;
        re.tpl_host_fuzzy_strict = re.tpl_host_fuzzy + re.src_host_terminator;
        re.src_host_port_strict = re.src_host + re.src_port + re.src_host_terminator;
        re.tpl_host_port_fuzzy_strict = re.tpl_host_fuzzy + re.src_port + re.src_host_terminator;
        re.tpl_host_port_no_ip_fuzzy_strict = re.tpl_host_no_ip_fuzzy + re.src_port + re.src_host_terminator;
        re.tpl_host_fuzzy_test = "localhost|www\\.|\\.\\d{1,3}\\.|(?:\\.(?:%TLDS%)(?:" + re.src_ZPCc + "|>|$))";
        re.tpl_email_fuzzy = "(^|" + text_separators + '|"|\\(|' + re.src_ZCc + ")(" + re.src_email_name + "@" + re.tpl_host_fuzzy_strict + ")";
        re.tpl_link_fuzzy = "(^|(?![.:/\\-_@])(?:[$+<=>^`|\uFF5C]|" + re.src_ZPCc + "))((?![$+<=>^`|\uFF5C])" + re.tpl_host_port_fuzzy_strict + re.src_path + ")";
        re.tpl_link_no_ip_fuzzy = "(^|(?![.:/\\-_@])(?:[$+<=>^`|\uFF5C]|" + re.src_ZPCc + "))((?![$+<=>^`|\uFF5C])" + re.tpl_host_port_no_ip_fuzzy_strict + re.src_path + ")";
        return re;
      };
    }
  });

  // node_modules/linkify-it/index.js
  var require_linkify_it = __commonJS({
    "node_modules/linkify-it/index.js"(exports, module) {
      "use strict";
      init_buffer_shim();
      function assign(obj) {
        var sources = Array.prototype.slice.call(arguments, 1);
        sources.forEach(function(source) {
          if (!source) {
            return;
          }
          Object.keys(source).forEach(function(key) {
            obj[key] = source[key];
          });
        });
        return obj;
      }
      __name(assign, "assign");
      function _class(obj) {
        return Object.prototype.toString.call(obj);
      }
      __name(_class, "_class");
      function isString(obj) {
        return _class(obj) === "[object String]";
      }
      __name(isString, "isString");
      function isObject2(obj) {
        return _class(obj) === "[object Object]";
      }
      __name(isObject2, "isObject");
      function isRegExp(obj) {
        return _class(obj) === "[object RegExp]";
      }
      __name(isRegExp, "isRegExp");
      function isFunction(obj) {
        return _class(obj) === "[object Function]";
      }
      __name(isFunction, "isFunction");
      function escapeRE(str) {
        return str.replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&");
      }
      __name(escapeRE, "escapeRE");
      var defaultOptions = {
        fuzzyLink: true,
        fuzzyEmail: true,
        fuzzyIP: false
      };
      function isOptionsObj(obj) {
        return Object.keys(obj || {}).reduce(function(acc, k) {
          return acc || defaultOptions.hasOwnProperty(k);
        }, false);
      }
      __name(isOptionsObj, "isOptionsObj");
      var defaultSchemas = {
        "http:": {
          validate: function(text, pos, self2) {
            var tail = text.slice(pos);
            if (!self2.re.http) {
              self2.re.http = new RegExp(
                "^\\/\\/" + self2.re.src_auth + self2.re.src_host_port_strict + self2.re.src_path,
                "i"
              );
            }
            if (self2.re.http.test(tail)) {
              return tail.match(self2.re.http)[0].length;
            }
            return 0;
          }
        },
        "https:": "http:",
        "ftp:": "http:",
        "//": {
          validate: function(text, pos, self2) {
            var tail = text.slice(pos);
            if (!self2.re.no_http) {
              self2.re.no_http = new RegExp(
                "^" + self2.re.src_auth + "(?:localhost|(?:(?:" + self2.re.src_domain + ")\\.)+" + self2.re.src_domain_root + ")" + self2.re.src_port + self2.re.src_host_terminator + self2.re.src_path,
                "i"
              );
            }
            if (self2.re.no_http.test(tail)) {
              if (pos >= 3 && text[pos - 3] === ":") {
                return 0;
              }
              if (pos >= 3 && text[pos - 3] === "/") {
                return 0;
              }
              return tail.match(self2.re.no_http)[0].length;
            }
            return 0;
          }
        },
        "mailto:": {
          validate: function(text, pos, self2) {
            var tail = text.slice(pos);
            if (!self2.re.mailto) {
              self2.re.mailto = new RegExp(
                "^" + self2.re.src_email_name + "@" + self2.re.src_host_strict,
                "i"
              );
            }
            if (self2.re.mailto.test(tail)) {
              return tail.match(self2.re.mailto)[0].length;
            }
            return 0;
          }
        }
      };
      var tlds_2ch_src_re = "a[cdefgilmnoqrstuwxz]|b[abdefghijmnorstvwyz]|c[acdfghiklmnoruvwxyz]|d[ejkmoz]|e[cegrstu]|f[ijkmor]|g[abdefghilmnpqrstuwy]|h[kmnrtu]|i[delmnoqrst]|j[emop]|k[eghimnprwyz]|l[abcikrstuvy]|m[acdeghklmnopqrstuvwxyz]|n[acefgilopruz]|om|p[aefghklmnrstwy]|qa|r[eosuw]|s[abcdeghijklmnortuvxyz]|t[cdfghjklmnortvwz]|u[agksyz]|v[aceginu]|w[fs]|y[et]|z[amw]";
      var tlds_default = "biz|com|edu|gov|net|org|pro|web|xxx|aero|asia|coop|info|museum|name|shop|\u0440\u0444".split("|");
      function resetScanCache(self2) {
        self2.__index__ = -1;
        self2.__text_cache__ = "";
      }
      __name(resetScanCache, "resetScanCache");
      function createValidator(re) {
        return function(text, pos) {
          var tail = text.slice(pos);
          if (re.test(tail)) {
            return tail.match(re)[0].length;
          }
          return 0;
        };
      }
      __name(createValidator, "createValidator");
      function createNormalizer() {
        return function(match, self2) {
          self2.normalize(match);
        };
      }
      __name(createNormalizer, "createNormalizer");
      function compile(self2) {
        var re = self2.re = require_re()(self2.__opts__);
        var tlds = self2.__tlds__.slice();
        self2.onCompile();
        if (!self2.__tlds_replaced__) {
          tlds.push(tlds_2ch_src_re);
        }
        tlds.push(re.src_xn);
        re.src_tlds = tlds.join("|");
        function untpl(tpl) {
          return tpl.replace("%TLDS%", re.src_tlds);
        }
        __name(untpl, "untpl");
        re.email_fuzzy = RegExp(untpl(re.tpl_email_fuzzy), "i");
        re.link_fuzzy = RegExp(untpl(re.tpl_link_fuzzy), "i");
        re.link_no_ip_fuzzy = RegExp(untpl(re.tpl_link_no_ip_fuzzy), "i");
        re.host_fuzzy_test = RegExp(untpl(re.tpl_host_fuzzy_test), "i");
        var aliases = [];
        self2.__compiled__ = {};
        function schemaError(name, val) {
          throw new Error('(LinkifyIt) Invalid schema "' + name + '": ' + val);
        }
        __name(schemaError, "schemaError");
        Object.keys(self2.__schemas__).forEach(function(name) {
          var val = self2.__schemas__[name];
          if (val === null) {
            return;
          }
          var compiled = { validate: null, link: null };
          self2.__compiled__[name] = compiled;
          if (isObject2(val)) {
            if (isRegExp(val.validate)) {
              compiled.validate = createValidator(val.validate);
            } else if (isFunction(val.validate)) {
              compiled.validate = val.validate;
            } else {
              schemaError(name, val);
            }
            if (isFunction(val.normalize)) {
              compiled.normalize = val.normalize;
            } else if (!val.normalize) {
              compiled.normalize = createNormalizer();
            } else {
              schemaError(name, val);
            }
            return;
          }
          if (isString(val)) {
            aliases.push(name);
            return;
          }
          schemaError(name, val);
        });
        aliases.forEach(function(alias) {
          if (!self2.__compiled__[self2.__schemas__[alias]]) {
            return;
          }
          self2.__compiled__[alias].validate = self2.__compiled__[self2.__schemas__[alias]].validate;
          self2.__compiled__[alias].normalize = self2.__compiled__[self2.__schemas__[alias]].normalize;
        });
        self2.__compiled__[""] = { validate: null, normalize: createNormalizer() };
        var slist = Object.keys(self2.__compiled__).filter(function(name) {
          return name.length > 0 && self2.__compiled__[name];
        }).map(escapeRE).join("|");
        self2.re.schema_test = RegExp("(^|(?!_)(?:[><\uFF5C]|" + re.src_ZPCc + "))(" + slist + ")", "i");
        self2.re.schema_search = RegExp("(^|(?!_)(?:[><\uFF5C]|" + re.src_ZPCc + "))(" + slist + ")", "ig");
        self2.re.schema_at_start = RegExp("^" + self2.re.schema_search.source, "i");
        self2.re.pretest = RegExp(
          "(" + self2.re.schema_test.source + ")|(" + self2.re.host_fuzzy_test.source + ")|@",
          "i"
        );
        resetScanCache(self2);
      }
      __name(compile, "compile");
      function Match(self2, shift) {
        var start = self2.__index__, end = self2.__last_index__, text = self2.__text_cache__.slice(start, end);
        this.schema = self2.__schema__.toLowerCase();
        this.index = start + shift;
        this.lastIndex = end + shift;
        this.raw = text;
        this.text = text;
        this.url = text;
      }
      __name(Match, "Match");
      function createMatch(self2, shift) {
        var match = new Match(self2, shift);
        self2.__compiled__[match.schema].normalize(match, self2);
        return match;
      }
      __name(createMatch, "createMatch");
      function LinkifyIt(schemas, options) {
        if (!(this instanceof LinkifyIt)) {
          return new LinkifyIt(schemas, options);
        }
        if (!options) {
          if (isOptionsObj(schemas)) {
            options = schemas;
            schemas = {};
          }
        }
        this.__opts__ = assign({}, defaultOptions, options);
        this.__index__ = -1;
        this.__last_index__ = -1;
        this.__schema__ = "";
        this.__text_cache__ = "";
        this.__schemas__ = assign({}, defaultSchemas, schemas);
        this.__compiled__ = {};
        this.__tlds__ = tlds_default;
        this.__tlds_replaced__ = false;
        this.re = {};
        compile(this);
      }
      __name(LinkifyIt, "LinkifyIt");
      LinkifyIt.prototype.add = /* @__PURE__ */ __name(function add(schema, definition) {
        this.__schemas__[schema] = definition;
        compile(this);
        return this;
      }, "add");
      LinkifyIt.prototype.set = /* @__PURE__ */ __name(function set(options) {
        this.__opts__ = assign(this.__opts__, options);
        return this;
      }, "set");
      LinkifyIt.prototype.test = /* @__PURE__ */ __name(function test(text) {
        this.__text_cache__ = text;
        this.__index__ = -1;
        if (!text.length) {
          return false;
        }
        var m, ml, me, len, shift, next, re, tld_pos, at_pos;
        if (this.re.schema_test.test(text)) {
          re = this.re.schema_search;
          re.lastIndex = 0;
          while ((m = re.exec(text)) !== null) {
            len = this.testSchemaAt(text, m[2], re.lastIndex);
            if (len) {
              this.__schema__ = m[2];
              this.__index__ = m.index + m[1].length;
              this.__last_index__ = m.index + m[0].length + len;
              break;
            }
          }
        }
        if (this.__opts__.fuzzyLink && this.__compiled__["http:"]) {
          tld_pos = text.search(this.re.host_fuzzy_test);
          if (tld_pos >= 0) {
            if (this.__index__ < 0 || tld_pos < this.__index__) {
              if ((ml = text.match(this.__opts__.fuzzyIP ? this.re.link_fuzzy : this.re.link_no_ip_fuzzy)) !== null) {
                shift = ml.index + ml[1].length;
                if (this.__index__ < 0 || shift < this.__index__) {
                  this.__schema__ = "";
                  this.__index__ = shift;
                  this.__last_index__ = ml.index + ml[0].length;
                }
              }
            }
          }
        }
        if (this.__opts__.fuzzyEmail && this.__compiled__["mailto:"]) {
          at_pos = text.indexOf("@");
          if (at_pos >= 0) {
            if ((me = text.match(this.re.email_fuzzy)) !== null) {
              shift = me.index + me[1].length;
              next = me.index + me[0].length;
              if (this.__index__ < 0 || shift < this.__index__ || shift === this.__index__ && next > this.__last_index__) {
                this.__schema__ = "mailto:";
                this.__index__ = shift;
                this.__last_index__ = next;
              }
            }
          }
        }
        return this.__index__ >= 0;
      }, "test");
      LinkifyIt.prototype.pretest = /* @__PURE__ */ __name(function pretest(text) {
        return this.re.pretest.test(text);
      }, "pretest");
      LinkifyIt.prototype.testSchemaAt = /* @__PURE__ */ __name(function testSchemaAt(text, schema, pos) {
        if (!this.__compiled__[schema.toLowerCase()]) {
          return 0;
        }
        return this.__compiled__[schema.toLowerCase()].validate(text, pos, this);
      }, "testSchemaAt");
      LinkifyIt.prototype.match = /* @__PURE__ */ __name(function match(text) {
        var shift = 0, result = [];
        if (this.__index__ >= 0 && this.__text_cache__ === text) {
          result.push(createMatch(this, shift));
          shift = this.__last_index__;
        }
        var tail = shift ? text.slice(shift) : text;
        while (this.test(tail)) {
          result.push(createMatch(this, shift));
          tail = tail.slice(this.__last_index__);
          shift += this.__last_index__;
        }
        if (result.length) {
          return result;
        }
        return null;
      }, "match");
      LinkifyIt.prototype.matchAtStart = /* @__PURE__ */ __name(function matchAtStart(text) {
        this.__text_cache__ = text;
        this.__index__ = -1;
        if (!text.length)
          return null;
        var m = this.re.schema_at_start.exec(text);
        if (!m)
          return null;
        var len = this.testSchemaAt(text, m[2], m[0].length);
        if (!len)
          return null;
        this.__schema__ = m[2];
        this.__index__ = m.index + m[1].length;
        this.__last_index__ = m.index + m[0].length + len;
        return createMatch(this, 0);
      }, "matchAtStart");
      LinkifyIt.prototype.tlds = /* @__PURE__ */ __name(function tlds(list, keepOld) {
        list = Array.isArray(list) ? list : [list];
        if (!keepOld) {
          this.__tlds__ = list.slice();
          this.__tlds_replaced__ = true;
          compile(this);
          return this;
        }
        this.__tlds__ = this.__tlds__.concat(list).sort().filter(function(el, idx, arr) {
          return el !== arr[idx - 1];
        }).reverse();
        compile(this);
        return this;
      }, "tlds");
      LinkifyIt.prototype.normalize = /* @__PURE__ */ __name(function normalize(match) {
        if (!match.schema) {
          match.url = "http://" + match.url;
        }
        if (match.schema === "mailto:" && !/^mailto:/i.test(match.url)) {
          match.url = "mailto:" + match.url;
        }
      }, "normalize");
      LinkifyIt.prototype.onCompile = /* @__PURE__ */ __name(function onCompile() {
      }, "onCompile");
      module.exports = LinkifyIt;
    }
  });

  // node_modules/punycode/punycode.js
  var require_punycode = __commonJS({
    "node_modules/punycode/punycode.js"(exports, module) {
      "use strict";
      init_buffer_shim();
      var maxInt = 2147483647;
      var base = 36;
      var tMin = 1;
      var tMax = 26;
      var skew = 38;
      var damp = 700;
      var initialBias = 72;
      var initialN = 128;
      var delimiter = "-";
      var regexPunycode = /^xn--/;
      var regexNonASCII = /[^\0-\x7E]/;
      var regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g;
      var errors = {
        "overflow": "Overflow: input needs wider integers to process",
        "not-basic": "Illegal input >= 0x80 (not a basic code point)",
        "invalid-input": "Invalid input"
      };
      var baseMinusTMin = base - tMin;
      var floor = Math.floor;
      var stringFromCharCode = String.fromCharCode;
      function error(type) {
        throw new RangeError(errors[type]);
      }
      __name(error, "error");
      function map(array, fn) {
        const result = [];
        let length = array.length;
        while (length--) {
          result[length] = fn(array[length]);
        }
        return result;
      }
      __name(map, "map");
      function mapDomain(string, fn) {
        const parts = string.split("@");
        let result = "";
        if (parts.length > 1) {
          result = parts[0] + "@";
          string = parts[1];
        }
        string = string.replace(regexSeparators, ".");
        const labels = string.split(".");
        const encoded = map(labels, fn).join(".");
        return result + encoded;
      }
      __name(mapDomain, "mapDomain");
      function ucs2decode(string) {
        const output = [];
        let counter = 0;
        const length = string.length;
        while (counter < length) {
          const value = string.charCodeAt(counter++);
          if (value >= 55296 && value <= 56319 && counter < length) {
            const extra = string.charCodeAt(counter++);
            if ((extra & 64512) == 56320) {
              output.push(((value & 1023) << 10) + (extra & 1023) + 65536);
            } else {
              output.push(value);
              counter--;
            }
          } else {
            output.push(value);
          }
        }
        return output;
      }
      __name(ucs2decode, "ucs2decode");
      var ucs2encode = /* @__PURE__ */ __name((array) => String.fromCodePoint(...array), "ucs2encode");
      var basicToDigit = /* @__PURE__ */ __name(function(codePoint) {
        if (codePoint - 48 < 10) {
          return codePoint - 22;
        }
        if (codePoint - 65 < 26) {
          return codePoint - 65;
        }
        if (codePoint - 97 < 26) {
          return codePoint - 97;
        }
        return base;
      }, "basicToDigit");
      var digitToBasic = /* @__PURE__ */ __name(function(digit, flag) {
        return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
      }, "digitToBasic");
      var adapt = /* @__PURE__ */ __name(function(delta, numPoints, firstTime) {
        let k = 0;
        delta = firstTime ? floor(delta / damp) : delta >> 1;
        delta += floor(delta / numPoints);
        for (; delta > baseMinusTMin * tMax >> 1; k += base) {
          delta = floor(delta / baseMinusTMin);
        }
        return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
      }, "adapt");
      var decode = /* @__PURE__ */ __name(function(input) {
        const output = [];
        const inputLength = input.length;
        let i = 0;
        let n = initialN;
        let bias = initialBias;
        let basic = input.lastIndexOf(delimiter);
        if (basic < 0) {
          basic = 0;
        }
        for (let j = 0; j < basic; ++j) {
          if (input.charCodeAt(j) >= 128) {
            error("not-basic");
          }
          output.push(input.charCodeAt(j));
        }
        for (let index = basic > 0 ? basic + 1 : 0; index < inputLength; ) {
          let oldi = i;
          for (let w = 1, k = base; ; k += base) {
            if (index >= inputLength) {
              error("invalid-input");
            }
            const digit = basicToDigit(input.charCodeAt(index++));
            if (digit >= base || digit > floor((maxInt - i) / w)) {
              error("overflow");
            }
            i += digit * w;
            const t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
            if (digit < t) {
              break;
            }
            const baseMinusT = base - t;
            if (w > floor(maxInt / baseMinusT)) {
              error("overflow");
            }
            w *= baseMinusT;
          }
          const out = output.length + 1;
          bias = adapt(i - oldi, out, oldi == 0);
          if (floor(i / out) > maxInt - n) {
            error("overflow");
          }
          n += floor(i / out);
          i %= out;
          output.splice(i++, 0, n);
        }
        return String.fromCodePoint(...output);
      }, "decode");
      var encode = /* @__PURE__ */ __name(function(input) {
        const output = [];
        input = ucs2decode(input);
        let inputLength = input.length;
        let n = initialN;
        let delta = 0;
        let bias = initialBias;
        for (const currentValue of input) {
          if (currentValue < 128) {
            output.push(stringFromCharCode(currentValue));
          }
        }
        let basicLength = output.length;
        let handledCPCount = basicLength;
        if (basicLength) {
          output.push(delimiter);
        }
        while (handledCPCount < inputLength) {
          let m = maxInt;
          for (const currentValue of input) {
            if (currentValue >= n && currentValue < m) {
              m = currentValue;
            }
          }
          const handledCPCountPlusOne = handledCPCount + 1;
          if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
            error("overflow");
          }
          delta += (m - n) * handledCPCountPlusOne;
          n = m;
          for (const currentValue of input) {
            if (currentValue < n && ++delta > maxInt) {
              error("overflow");
            }
            if (currentValue == n) {
              let q = delta;
              for (let k = base; ; k += base) {
                const t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
                if (q < t) {
                  break;
                }
                const qMinusT = q - t;
                const baseMinusT = base - t;
                output.push(
                  stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
                );
                q = floor(qMinusT / baseMinusT);
              }
              output.push(stringFromCharCode(digitToBasic(q, 0)));
              bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
              delta = 0;
              ++handledCPCount;
            }
          }
          ++delta;
          ++n;
        }
        return output.join("");
      }, "encode");
      var toUnicode = /* @__PURE__ */ __name(function(input) {
        return mapDomain(input, function(string) {
          return regexPunycode.test(string) ? decode(string.slice(4).toLowerCase()) : string;
        });
      }, "toUnicode");
      var toASCII = /* @__PURE__ */ __name(function(input) {
        return mapDomain(input, function(string) {
          return regexNonASCII.test(string) ? "xn--" + encode(string) : string;
        });
      }, "toASCII");
      var punycode = {
        "version": "2.1.0",
        "ucs2": {
          "decode": ucs2decode,
          "encode": ucs2encode
        },
        "decode": decode,
        "encode": encode,
        "toASCII": toASCII,
        "toUnicode": toUnicode
      };
      module.exports = punycode;
    }
  });

  // node_modules/markdown-it/lib/presets/default.js
  var require_default = __commonJS({
    "node_modules/markdown-it/lib/presets/default.js"(exports, module) {
      "use strict";
      init_buffer_shim();
      module.exports = {
        options: {
          html: false,
          xhtmlOut: false,
          breaks: false,
          langPrefix: "language-",
          linkify: false,
          typographer: false,
          quotes: "\u201C\u201D\u2018\u2019",
          highlight: null,
          maxNesting: 100
        },
        components: {
          core: {},
          block: {},
          inline: {}
        }
      };
    }
  });

  // node_modules/markdown-it/lib/presets/zero.js
  var require_zero = __commonJS({
    "node_modules/markdown-it/lib/presets/zero.js"(exports, module) {
      "use strict";
      init_buffer_shim();
      module.exports = {
        options: {
          html: false,
          xhtmlOut: false,
          breaks: false,
          langPrefix: "language-",
          linkify: false,
          typographer: false,
          quotes: "\u201C\u201D\u2018\u2019",
          highlight: null,
          maxNesting: 20
        },
        components: {
          core: {
            rules: [
              "normalize",
              "block",
              "inline",
              "text_join"
            ]
          },
          block: {
            rules: [
              "paragraph"
            ]
          },
          inline: {
            rules: [
              "text"
            ],
            rules2: [
              "balance_pairs",
              "fragments_join"
            ]
          }
        }
      };
    }
  });

  // node_modules/markdown-it/lib/presets/commonmark.js
  var require_commonmark = __commonJS({
    "node_modules/markdown-it/lib/presets/commonmark.js"(exports, module) {
      "use strict";
      init_buffer_shim();
      module.exports = {
        options: {
          html: true,
          xhtmlOut: true,
          breaks: false,
          langPrefix: "language-",
          linkify: false,
          typographer: false,
          quotes: "\u201C\u201D\u2018\u2019",
          highlight: null,
          maxNesting: 20
        },
        components: {
          core: {
            rules: [
              "normalize",
              "block",
              "inline",
              "text_join"
            ]
          },
          block: {
            rules: [
              "blockquote",
              "code",
              "fence",
              "heading",
              "hr",
              "html_block",
              "lheading",
              "list",
              "reference",
              "paragraph"
            ]
          },
          inline: {
            rules: [
              "autolink",
              "backticks",
              "emphasis",
              "entity",
              "escape",
              "html_inline",
              "image",
              "link",
              "newline",
              "text"
            ],
            rules2: [
              "balance_pairs",
              "emphasis",
              "fragments_join"
            ]
          }
        }
      };
    }
  });

  // node_modules/markdown-it/lib/index.js
  var require_lib = __commonJS({
    "node_modules/markdown-it/lib/index.js"(exports, module) {
      "use strict";
      init_buffer_shim();
      var utils = require_utils();
      var helpers = require_helpers();
      var Renderer = require_renderer();
      var ParserCore = require_parser_core();
      var ParserBlock = require_parser_block();
      var ParserInline = require_parser_inline();
      var LinkifyIt = require_linkify_it();
      var mdurl = require_mdurl();
      var punycode = require_punycode();
      var config = {
        default: require_default(),
        zero: require_zero(),
        commonmark: require_commonmark()
      };
      var BAD_PROTO_RE = /^(vbscript|javascript|file|data):/;
      var GOOD_DATA_RE = /^data:image\/(gif|png|jpeg|webp);/;
      function validateLink(url) {
        var str = url.trim().toLowerCase();
        return BAD_PROTO_RE.test(str) ? GOOD_DATA_RE.test(str) ? true : false : true;
      }
      __name(validateLink, "validateLink");
      var RECODE_HOSTNAME_FOR = ["http:", "https:", "mailto:"];
      function normalizeLink(url) {
        var parsed = mdurl.parse(url, true);
        if (parsed.hostname) {
          if (!parsed.protocol || RECODE_HOSTNAME_FOR.indexOf(parsed.protocol) >= 0) {
            try {
              parsed.hostname = punycode.toASCII(parsed.hostname);
            } catch (er) {
            }
          }
        }
        return mdurl.encode(mdurl.format(parsed));
      }
      __name(normalizeLink, "normalizeLink");
      function normalizeLinkText(url) {
        var parsed = mdurl.parse(url, true);
        if (parsed.hostname) {
          if (!parsed.protocol || RECODE_HOSTNAME_FOR.indexOf(parsed.protocol) >= 0) {
            try {
              parsed.hostname = punycode.toUnicode(parsed.hostname);
            } catch (er) {
            }
          }
        }
        return mdurl.decode(mdurl.format(parsed), mdurl.decode.defaultChars + "%");
      }
      __name(normalizeLinkText, "normalizeLinkText");
      function MarkdownIt(presetName, options) {
        if (!(this instanceof MarkdownIt)) {
          return new MarkdownIt(presetName, options);
        }
        if (!options) {
          if (!utils.isString(presetName)) {
            options = presetName || {};
            presetName = "default";
          }
        }
        this.inline = new ParserInline();
        this.block = new ParserBlock();
        this.core = new ParserCore();
        this.renderer = new Renderer();
        this.linkify = new LinkifyIt();
        this.validateLink = validateLink;
        this.normalizeLink = normalizeLink;
        this.normalizeLinkText = normalizeLinkText;
        this.utils = utils;
        this.helpers = utils.assign({}, helpers);
        this.options = {};
        this.configure(presetName);
        if (options) {
          this.set(options);
        }
      }
      __name(MarkdownIt, "MarkdownIt");
      MarkdownIt.prototype.set = function(options) {
        utils.assign(this.options, options);
        return this;
      };
      MarkdownIt.prototype.configure = function(presets) {
        var self2 = this, presetName;
        if (utils.isString(presets)) {
          presetName = presets;
          presets = config[presetName];
          if (!presets) {
            throw new Error('Wrong `markdown-it` preset "' + presetName + '", check name');
          }
        }
        if (!presets) {
          throw new Error("Wrong `markdown-it` preset, can't be empty");
        }
        if (presets.options) {
          self2.set(presets.options);
        }
        if (presets.components) {
          Object.keys(presets.components).forEach(function(name) {
            if (presets.components[name].rules) {
              self2[name].ruler.enableOnly(presets.components[name].rules);
            }
            if (presets.components[name].rules2) {
              self2[name].ruler2.enableOnly(presets.components[name].rules2);
            }
          });
        }
        return this;
      };
      MarkdownIt.prototype.enable = function(list, ignoreInvalid) {
        var result = [];
        if (!Array.isArray(list)) {
          list = [list];
        }
        ["core", "block", "inline"].forEach(function(chain) {
          result = result.concat(this[chain].ruler.enable(list, true));
        }, this);
        result = result.concat(this.inline.ruler2.enable(list, true));
        var missed = list.filter(function(name) {
          return result.indexOf(name) < 0;
        });
        if (missed.length && !ignoreInvalid) {
          throw new Error("MarkdownIt. Failed to enable unknown rule(s): " + missed);
        }
        return this;
      };
      MarkdownIt.prototype.disable = function(list, ignoreInvalid) {
        var result = [];
        if (!Array.isArray(list)) {
          list = [list];
        }
        ["core", "block", "inline"].forEach(function(chain) {
          result = result.concat(this[chain].ruler.disable(list, true));
        }, this);
        result = result.concat(this.inline.ruler2.disable(list, true));
        var missed = list.filter(function(name) {
          return result.indexOf(name) < 0;
        });
        if (missed.length && !ignoreInvalid) {
          throw new Error("MarkdownIt. Failed to disable unknown rule(s): " + missed);
        }
        return this;
      };
      MarkdownIt.prototype.use = function(plugin) {
        var args = [this].concat(Array.prototype.slice.call(arguments, 1));
        plugin.apply(plugin, args);
        return this;
      };
      MarkdownIt.prototype.parse = function(src, env) {
        if (typeof src !== "string") {
          throw new Error("Input data should be a String");
        }
        var state = new this.core.State(src, this, env);
        this.core.process(state);
        return state.tokens;
      };
      MarkdownIt.prototype.render = function(src, env) {
        env = env || {};
        return this.renderer.render(this.parse(src, env), this.options, env);
      };
      MarkdownIt.prototype.parseInline = function(src, env) {
        var state = new this.core.State(src, this, env);
        state.inlineMode = true;
        this.core.process(state);
        return state.tokens;
      };
      MarkdownIt.prototype.renderInline = function(src, env) {
        env = env || {};
        return this.renderer.render(this.parseInline(src, env), this.options, env);
      };
      module.exports = MarkdownIt;
    }
  });

  // node_modules/markdown-it/index.js
  var require_markdown_it = __commonJS({
    "node_modules/markdown-it/index.js"(exports, module) {
      "use strict";
      init_buffer_shim();
      module.exports = require_lib();
    }
  });

  // node_modules/pascalcase/index.js
  var require_pascalcase = __commonJS({
    "node_modules/pascalcase/index.js"(exports, module) {
      init_buffer_shim();
      var titlecase = /* @__PURE__ */ __name((input) => input[0].toLocaleUpperCase() + input.slice(1), "titlecase");
      module.exports = (value) => {
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
    }
  });

  // node_modules/clone/clone.js
  var require_clone = __commonJS({
    "node_modules/clone/clone.js"(exports, module) {
      init_buffer_shim();
      var clone2 = function() {
        "use strict";
        function _instanceof(obj, type) {
          return type != null && obj instanceof type;
        }
        __name(_instanceof, "_instanceof");
        var nativeMap;
        try {
          nativeMap = Map;
        } catch (_) {
          nativeMap = /* @__PURE__ */ __name(function() {
          }, "nativeMap");
        }
        var nativeSet;
        try {
          nativeSet = Set;
        } catch (_) {
          nativeSet = /* @__PURE__ */ __name(function() {
          }, "nativeSet");
        }
        var nativePromise;
        try {
          nativePromise = Promise;
        } catch (_) {
          nativePromise = /* @__PURE__ */ __name(function() {
          }, "nativePromise");
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
          var useBuffer = typeof Buffer2 != "undefined";
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
            } else if (useBuffer && Buffer2.isBuffer(parent2)) {
              if (Buffer2.allocUnsafe) {
                child = Buffer2.allocUnsafe(parent2.length);
              } else {
                child = new Buffer2(parent2.length);
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
          __name(_clone, "_clone");
          return _clone(parent, depth);
        }
        __name(clone3, "clone");
        clone3.clonePrototype = /* @__PURE__ */ __name(function clonePrototype(parent) {
          if (parent === null)
            return null;
          var c = /* @__PURE__ */ __name(function() {
          }, "c");
          c.prototype = parent;
          return new c();
        }, "clonePrototype");
        function __objToStr(o) {
          return Object.prototype.toString.call(o);
        }
        __name(__objToStr, "__objToStr");
        clone3.__objToStr = __objToStr;
        function __isDate(o) {
          return typeof o === "object" && __objToStr(o) === "[object Date]";
        }
        __name(__isDate, "__isDate");
        clone3.__isDate = __isDate;
        function __isArray(o) {
          return typeof o === "object" && __objToStr(o) === "[object Array]";
        }
        __name(__isArray, "__isArray");
        clone3.__isArray = __isArray;
        function __isRegExp(o) {
          return typeof o === "object" && __objToStr(o) === "[object RegExp]";
        }
        __name(__isRegExp, "__isRegExp");
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
        __name(__getRegExpFlags, "__getRegExpFlags");
        clone3.__getRegExpFlags = __getRegExpFlags;
        return clone3;
      }();
      if (typeof module === "object" && module.exports) {
        module.exports = clone2;
      }
    }
  });

  // node_modules/side-channel/node_modules/has-symbols/shams.js
  var require_shams = __commonJS({
    "node_modules/side-channel/node_modules/has-symbols/shams.js"(exports, module) {
      "use strict";
      init_buffer_shim();
      module.exports = /* @__PURE__ */ __name(function hasSymbols() {
        if (typeof Symbol !== "function" || typeof Object.getOwnPropertySymbols !== "function") {
          return false;
        }
        if (typeof Symbol.iterator === "symbol") {
          return true;
        }
        var obj = {};
        var sym = Symbol("test");
        var symObj = Object(sym);
        if (typeof sym === "string") {
          return false;
        }
        if (Object.prototype.toString.call(sym) !== "[object Symbol]") {
          return false;
        }
        if (Object.prototype.toString.call(symObj) !== "[object Symbol]") {
          return false;
        }
        var symVal = 42;
        obj[sym] = symVal;
        for (sym in obj) {
          return false;
        }
        if (typeof Object.keys === "function" && Object.keys(obj).length !== 0) {
          return false;
        }
        if (typeof Object.getOwnPropertyNames === "function" && Object.getOwnPropertyNames(obj).length !== 0) {
          return false;
        }
        var syms = Object.getOwnPropertySymbols(obj);
        if (syms.length !== 1 || syms[0] !== sym) {
          return false;
        }
        if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) {
          return false;
        }
        if (typeof Object.getOwnPropertyDescriptor === "function") {
          var descriptor = Object.getOwnPropertyDescriptor(obj, sym);
          if (descriptor.value !== symVal || descriptor.enumerable !== true) {
            return false;
          }
        }
        return true;
      }, "hasSymbols");
    }
  });

  // node_modules/side-channel/node_modules/has-symbols/index.js
  var require_has_symbols = __commonJS({
    "node_modules/side-channel/node_modules/has-symbols/index.js"(exports, module) {
      "use strict";
      init_buffer_shim();
      var origSymbol = typeof Symbol !== "undefined" && Symbol;
      var hasSymbolSham = require_shams();
      module.exports = /* @__PURE__ */ __name(function hasNativeSymbols() {
        if (typeof origSymbol !== "function") {
          return false;
        }
        if (typeof Symbol !== "function") {
          return false;
        }
        if (typeof origSymbol("foo") !== "symbol") {
          return false;
        }
        if (typeof Symbol("bar") !== "symbol") {
          return false;
        }
        return hasSymbolSham();
      }, "hasNativeSymbols");
    }
  });

  // node_modules/function-bind/implementation.js
  var require_implementation = __commonJS({
    "node_modules/function-bind/implementation.js"(exports, module) {
      "use strict";
      init_buffer_shim();
      var ERROR_MESSAGE = "Function.prototype.bind called on incompatible ";
      var slice = Array.prototype.slice;
      var toStr = Object.prototype.toString;
      var funcType = "[object Function]";
      module.exports = /* @__PURE__ */ __name(function bind(that) {
        var target = this;
        if (typeof target !== "function" || toStr.call(target) !== funcType) {
          throw new TypeError(ERROR_MESSAGE + target);
        }
        var args = slice.call(arguments, 1);
        var bound;
        var binder = /* @__PURE__ */ __name(function() {
          if (this instanceof bound) {
            var result = target.apply(
              this,
              args.concat(slice.call(arguments))
            );
            if (Object(result) === result) {
              return result;
            }
            return this;
          } else {
            return target.apply(
              that,
              args.concat(slice.call(arguments))
            );
          }
        }, "binder");
        var boundLength = Math.max(0, target.length - args.length);
        var boundArgs = [];
        for (var i = 0; i < boundLength; i++) {
          boundArgs.push("$" + i);
        }
        bound = Function("binder", "return function (" + boundArgs.join(",") + "){ return binder.apply(this,arguments); }")(binder);
        if (target.prototype) {
          var Empty = /* @__PURE__ */ __name(function Empty2() {
          }, "Empty");
          Empty.prototype = target.prototype;
          bound.prototype = new Empty();
          Empty.prototype = null;
        }
        return bound;
      }, "bind");
    }
  });

  // node_modules/function-bind/index.js
  var require_function_bind = __commonJS({
    "node_modules/function-bind/index.js"(exports, module) {
      "use strict";
      init_buffer_shim();
      var implementation = require_implementation();
      module.exports = Function.prototype.bind || implementation;
    }
  });

  // node_modules/has/src/index.js
  var require_src = __commonJS({
    "node_modules/has/src/index.js"(exports, module) {
      "use strict";
      init_buffer_shim();
      var bind = require_function_bind();
      module.exports = bind.call(Function.call, Object.prototype.hasOwnProperty);
    }
  });

  // node_modules/side-channel/node_modules/get-intrinsic/index.js
  var require_get_intrinsic = __commonJS({
    "node_modules/side-channel/node_modules/get-intrinsic/index.js"(exports, module) {
      "use strict";
      init_buffer_shim();
      var undefined2;
      var $SyntaxError = SyntaxError;
      var $Function = Function;
      var $TypeError = TypeError;
      var getEvalledConstructor = /* @__PURE__ */ __name(function(expressionSyntax) {
        try {
          return $Function('"use strict"; return (' + expressionSyntax + ").constructor;")();
        } catch (e) {
        }
      }, "getEvalledConstructor");
      var $gOPD = Object.getOwnPropertyDescriptor;
      if ($gOPD) {
        try {
          $gOPD({}, "");
        } catch (e) {
          $gOPD = null;
        }
      }
      var throwTypeError = /* @__PURE__ */ __name(function() {
        throw new $TypeError();
      }, "throwTypeError");
      var ThrowTypeError = $gOPD ? function() {
        try {
          arguments.callee;
          return throwTypeError;
        } catch (calleeThrows) {
          try {
            return $gOPD(arguments, "callee").get;
          } catch (gOPDthrows) {
            return throwTypeError;
          }
        }
      }() : throwTypeError;
      var hasSymbols = require_has_symbols()();
      var getProto = Object.getPrototypeOf || function(x) {
        return x.__proto__;
      };
      var needsEval = {};
      var TypedArray = typeof Uint8Array === "undefined" ? undefined2 : getProto(Uint8Array);
      var INTRINSICS = {
        "%AggregateError%": typeof AggregateError === "undefined" ? undefined2 : AggregateError,
        "%Array%": Array,
        "%ArrayBuffer%": typeof ArrayBuffer === "undefined" ? undefined2 : ArrayBuffer,
        "%ArrayIteratorPrototype%": hasSymbols ? getProto([][Symbol.iterator]()) : undefined2,
        "%AsyncFromSyncIteratorPrototype%": undefined2,
        "%AsyncFunction%": needsEval,
        "%AsyncGenerator%": needsEval,
        "%AsyncGeneratorFunction%": needsEval,
        "%AsyncIteratorPrototype%": needsEval,
        "%Atomics%": typeof Atomics === "undefined" ? undefined2 : Atomics,
        "%BigInt%": typeof BigInt === "undefined" ? undefined2 : BigInt,
        "%Boolean%": Boolean,
        "%DataView%": typeof DataView === "undefined" ? undefined2 : DataView,
        "%Date%": Date,
        "%decodeURI%": decodeURI,
        "%decodeURIComponent%": decodeURIComponent,
        "%encodeURI%": encodeURI,
        "%encodeURIComponent%": encodeURIComponent,
        "%Error%": Error,
        "%eval%": eval,
        "%EvalError%": EvalError,
        "%Float32Array%": typeof Float32Array === "undefined" ? undefined2 : Float32Array,
        "%Float64Array%": typeof Float64Array === "undefined" ? undefined2 : Float64Array,
        "%FinalizationRegistry%": typeof FinalizationRegistry === "undefined" ? undefined2 : FinalizationRegistry,
        "%Function%": $Function,
        "%GeneratorFunction%": needsEval,
        "%Int8Array%": typeof Int8Array === "undefined" ? undefined2 : Int8Array,
        "%Int16Array%": typeof Int16Array === "undefined" ? undefined2 : Int16Array,
        "%Int32Array%": typeof Int32Array === "undefined" ? undefined2 : Int32Array,
        "%isFinite%": isFinite,
        "%isNaN%": isNaN,
        "%IteratorPrototype%": hasSymbols ? getProto(getProto([][Symbol.iterator]())) : undefined2,
        "%JSON%": typeof JSON === "object" ? JSON : undefined2,
        "%Map%": typeof Map === "undefined" ? undefined2 : Map,
        "%MapIteratorPrototype%": typeof Map === "undefined" || !hasSymbols ? undefined2 : getProto((/* @__PURE__ */ new Map())[Symbol.iterator]()),
        "%Math%": Math,
        "%Number%": Number,
        "%Object%": Object,
        "%parseFloat%": parseFloat,
        "%parseInt%": parseInt,
        "%Promise%": typeof Promise === "undefined" ? undefined2 : Promise,
        "%Proxy%": typeof Proxy === "undefined" ? undefined2 : Proxy,
        "%RangeError%": RangeError,
        "%ReferenceError%": ReferenceError,
        "%Reflect%": typeof Reflect === "undefined" ? undefined2 : Reflect,
        "%RegExp%": RegExp,
        "%Set%": typeof Set === "undefined" ? undefined2 : Set,
        "%SetIteratorPrototype%": typeof Set === "undefined" || !hasSymbols ? undefined2 : getProto((/* @__PURE__ */ new Set())[Symbol.iterator]()),
        "%SharedArrayBuffer%": typeof SharedArrayBuffer === "undefined" ? undefined2 : SharedArrayBuffer,
        "%String%": String,
        "%StringIteratorPrototype%": hasSymbols ? getProto(""[Symbol.iterator]()) : undefined2,
        "%Symbol%": hasSymbols ? Symbol : undefined2,
        "%SyntaxError%": $SyntaxError,
        "%ThrowTypeError%": ThrowTypeError,
        "%TypedArray%": TypedArray,
        "%TypeError%": $TypeError,
        "%Uint8Array%": typeof Uint8Array === "undefined" ? undefined2 : Uint8Array,
        "%Uint8ClampedArray%": typeof Uint8ClampedArray === "undefined" ? undefined2 : Uint8ClampedArray,
        "%Uint16Array%": typeof Uint16Array === "undefined" ? undefined2 : Uint16Array,
        "%Uint32Array%": typeof Uint32Array === "undefined" ? undefined2 : Uint32Array,
        "%URIError%": URIError,
        "%WeakMap%": typeof WeakMap === "undefined" ? undefined2 : WeakMap,
        "%WeakRef%": typeof WeakRef === "undefined" ? undefined2 : WeakRef,
        "%WeakSet%": typeof WeakSet === "undefined" ? undefined2 : WeakSet
      };
      var doEval = /* @__PURE__ */ __name(function doEval2(name) {
        var value;
        if (name === "%AsyncFunction%") {
          value = getEvalledConstructor("async function () {}");
        } else if (name === "%GeneratorFunction%") {
          value = getEvalledConstructor("function* () {}");
        } else if (name === "%AsyncGeneratorFunction%") {
          value = getEvalledConstructor("async function* () {}");
        } else if (name === "%AsyncGenerator%") {
          var fn = doEval2("%AsyncGeneratorFunction%");
          if (fn) {
            value = fn.prototype;
          }
        } else if (name === "%AsyncIteratorPrototype%") {
          var gen = doEval2("%AsyncGenerator%");
          if (gen) {
            value = getProto(gen.prototype);
          }
        }
        INTRINSICS[name] = value;
        return value;
      }, "doEval");
      var LEGACY_ALIASES = {
        "%ArrayBufferPrototype%": ["ArrayBuffer", "prototype"],
        "%ArrayPrototype%": ["Array", "prototype"],
        "%ArrayProto_entries%": ["Array", "prototype", "entries"],
        "%ArrayProto_forEach%": ["Array", "prototype", "forEach"],
        "%ArrayProto_keys%": ["Array", "prototype", "keys"],
        "%ArrayProto_values%": ["Array", "prototype", "values"],
        "%AsyncFunctionPrototype%": ["AsyncFunction", "prototype"],
        "%AsyncGenerator%": ["AsyncGeneratorFunction", "prototype"],
        "%AsyncGeneratorPrototype%": ["AsyncGeneratorFunction", "prototype", "prototype"],
        "%BooleanPrototype%": ["Boolean", "prototype"],
        "%DataViewPrototype%": ["DataView", "prototype"],
        "%DatePrototype%": ["Date", "prototype"],
        "%ErrorPrototype%": ["Error", "prototype"],
        "%EvalErrorPrototype%": ["EvalError", "prototype"],
        "%Float32ArrayPrototype%": ["Float32Array", "prototype"],
        "%Float64ArrayPrototype%": ["Float64Array", "prototype"],
        "%FunctionPrototype%": ["Function", "prototype"],
        "%Generator%": ["GeneratorFunction", "prototype"],
        "%GeneratorPrototype%": ["GeneratorFunction", "prototype", "prototype"],
        "%Int8ArrayPrototype%": ["Int8Array", "prototype"],
        "%Int16ArrayPrototype%": ["Int16Array", "prototype"],
        "%Int32ArrayPrototype%": ["Int32Array", "prototype"],
        "%JSONParse%": ["JSON", "parse"],
        "%JSONStringify%": ["JSON", "stringify"],
        "%MapPrototype%": ["Map", "prototype"],
        "%NumberPrototype%": ["Number", "prototype"],
        "%ObjectPrototype%": ["Object", "prototype"],
        "%ObjProto_toString%": ["Object", "prototype", "toString"],
        "%ObjProto_valueOf%": ["Object", "prototype", "valueOf"],
        "%PromisePrototype%": ["Promise", "prototype"],
        "%PromiseProto_then%": ["Promise", "prototype", "then"],
        "%Promise_all%": ["Promise", "all"],
        "%Promise_reject%": ["Promise", "reject"],
        "%Promise_resolve%": ["Promise", "resolve"],
        "%RangeErrorPrototype%": ["RangeError", "prototype"],
        "%ReferenceErrorPrototype%": ["ReferenceError", "prototype"],
        "%RegExpPrototype%": ["RegExp", "prototype"],
        "%SetPrototype%": ["Set", "prototype"],
        "%SharedArrayBufferPrototype%": ["SharedArrayBuffer", "prototype"],
        "%StringPrototype%": ["String", "prototype"],
        "%SymbolPrototype%": ["Symbol", "prototype"],
        "%SyntaxErrorPrototype%": ["SyntaxError", "prototype"],
        "%TypedArrayPrototype%": ["TypedArray", "prototype"],
        "%TypeErrorPrototype%": ["TypeError", "prototype"],
        "%Uint8ArrayPrototype%": ["Uint8Array", "prototype"],
        "%Uint8ClampedArrayPrototype%": ["Uint8ClampedArray", "prototype"],
        "%Uint16ArrayPrototype%": ["Uint16Array", "prototype"],
        "%Uint32ArrayPrototype%": ["Uint32Array", "prototype"],
        "%URIErrorPrototype%": ["URIError", "prototype"],
        "%WeakMapPrototype%": ["WeakMap", "prototype"],
        "%WeakSetPrototype%": ["WeakSet", "prototype"]
      };
      var bind = require_function_bind();
      var hasOwn = require_src();
      var $concat = bind.call(Function.call, Array.prototype.concat);
      var $spliceApply = bind.call(Function.apply, Array.prototype.splice);
      var $replace = bind.call(Function.call, String.prototype.replace);
      var $strSlice = bind.call(Function.call, String.prototype.slice);
      var $exec = bind.call(Function.call, RegExp.prototype.exec);
      var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
      var reEscapeChar = /\\(\\)?/g;
      var stringToPath = /* @__PURE__ */ __name(function stringToPath2(string) {
        var first = $strSlice(string, 0, 1);
        var last = $strSlice(string, -1);
        if (first === "%" && last !== "%") {
          throw new $SyntaxError("invalid intrinsic syntax, expected closing `%`");
        } else if (last === "%" && first !== "%") {
          throw new $SyntaxError("invalid intrinsic syntax, expected opening `%`");
        }
        var result = [];
        $replace(string, rePropName, function(match, number, quote, subString) {
          result[result.length] = quote ? $replace(subString, reEscapeChar, "$1") : number || match;
        });
        return result;
      }, "stringToPath");
      var getBaseIntrinsic = /* @__PURE__ */ __name(function getBaseIntrinsic2(name, allowMissing) {
        var intrinsicName = name;
        var alias;
        if (hasOwn(LEGACY_ALIASES, intrinsicName)) {
          alias = LEGACY_ALIASES[intrinsicName];
          intrinsicName = "%" + alias[0] + "%";
        }
        if (hasOwn(INTRINSICS, intrinsicName)) {
          var value = INTRINSICS[intrinsicName];
          if (value === needsEval) {
            value = doEval(intrinsicName);
          }
          if (typeof value === "undefined" && !allowMissing) {
            throw new $TypeError("intrinsic " + name + " exists, but is not available. Please file an issue!");
          }
          return {
            alias,
            name: intrinsicName,
            value
          };
        }
        throw new $SyntaxError("intrinsic " + name + " does not exist!");
      }, "getBaseIntrinsic");
      module.exports = /* @__PURE__ */ __name(function GetIntrinsic(name, allowMissing) {
        if (typeof name !== "string" || name.length === 0) {
          throw new $TypeError("intrinsic name must be a non-empty string");
        }
        if (arguments.length > 1 && typeof allowMissing !== "boolean") {
          throw new $TypeError('"allowMissing" argument must be a boolean');
        }
        if ($exec(/^%?[^%]*%?$/g, name) === null) {
          throw new $SyntaxError("`%` may not be present anywhere but at the beginning and end of the intrinsic name");
        }
        var parts = stringToPath(name);
        var intrinsicBaseName = parts.length > 0 ? parts[0] : "";
        var intrinsic = getBaseIntrinsic("%" + intrinsicBaseName + "%", allowMissing);
        var intrinsicRealName = intrinsic.name;
        var value = intrinsic.value;
        var skipFurtherCaching = false;
        var alias = intrinsic.alias;
        if (alias) {
          intrinsicBaseName = alias[0];
          $spliceApply(parts, $concat([0, 1], alias));
        }
        for (var i = 1, isOwn = true; i < parts.length; i += 1) {
          var part = parts[i];
          var first = $strSlice(part, 0, 1);
          var last = $strSlice(part, -1);
          if ((first === '"' || first === "'" || first === "`" || (last === '"' || last === "'" || last === "`")) && first !== last) {
            throw new $SyntaxError("property names with quotes must have matching quotes");
          }
          if (part === "constructor" || !isOwn) {
            skipFurtherCaching = true;
          }
          intrinsicBaseName += "." + part;
          intrinsicRealName = "%" + intrinsicBaseName + "%";
          if (hasOwn(INTRINSICS, intrinsicRealName)) {
            value = INTRINSICS[intrinsicRealName];
          } else if (value != null) {
            if (!(part in value)) {
              if (!allowMissing) {
                throw new $TypeError("base intrinsic for " + name + " exists, but the property is not available.");
              }
              return void 0;
            }
            if ($gOPD && i + 1 >= parts.length) {
              var desc = $gOPD(value, part);
              isOwn = !!desc;
              if (isOwn && "get" in desc && !("originalValue" in desc.get)) {
                value = desc.get;
              } else {
                value = value[part];
              }
            } else {
              isOwn = hasOwn(value, part);
              value = value[part];
            }
            if (isOwn && !skipFurtherCaching) {
              INTRINSICS[intrinsicRealName] = value;
            }
          }
        }
        return value;
      }, "GetIntrinsic");
    }
  });

  // node_modules/call-bind/node_modules/has-symbols/shams.js
  var require_shams2 = __commonJS({
    "node_modules/call-bind/node_modules/has-symbols/shams.js"(exports, module) {
      "use strict";
      init_buffer_shim();
      module.exports = /* @__PURE__ */ __name(function hasSymbols() {
        if (typeof Symbol !== "function" || typeof Object.getOwnPropertySymbols !== "function") {
          return false;
        }
        if (typeof Symbol.iterator === "symbol") {
          return true;
        }
        var obj = {};
        var sym = Symbol("test");
        var symObj = Object(sym);
        if (typeof sym === "string") {
          return false;
        }
        if (Object.prototype.toString.call(sym) !== "[object Symbol]") {
          return false;
        }
        if (Object.prototype.toString.call(symObj) !== "[object Symbol]") {
          return false;
        }
        var symVal = 42;
        obj[sym] = symVal;
        for (sym in obj) {
          return false;
        }
        if (typeof Object.keys === "function" && Object.keys(obj).length !== 0) {
          return false;
        }
        if (typeof Object.getOwnPropertyNames === "function" && Object.getOwnPropertyNames(obj).length !== 0) {
          return false;
        }
        var syms = Object.getOwnPropertySymbols(obj);
        if (syms.length !== 1 || syms[0] !== sym) {
          return false;
        }
        if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) {
          return false;
        }
        if (typeof Object.getOwnPropertyDescriptor === "function") {
          var descriptor = Object.getOwnPropertyDescriptor(obj, sym);
          if (descriptor.value !== symVal || descriptor.enumerable !== true) {
            return false;
          }
        }
        return true;
      }, "hasSymbols");
    }
  });

  // node_modules/call-bind/node_modules/has-symbols/index.js
  var require_has_symbols2 = __commonJS({
    "node_modules/call-bind/node_modules/has-symbols/index.js"(exports, module) {
      "use strict";
      init_buffer_shim();
      var origSymbol = typeof Symbol !== "undefined" && Symbol;
      var hasSymbolSham = require_shams2();
      module.exports = /* @__PURE__ */ __name(function hasNativeSymbols() {
        if (typeof origSymbol !== "function") {
          return false;
        }
        if (typeof Symbol !== "function") {
          return false;
        }
        if (typeof origSymbol("foo") !== "symbol") {
          return false;
        }
        if (typeof Symbol("bar") !== "symbol") {
          return false;
        }
        return hasSymbolSham();
      }, "hasNativeSymbols");
    }
  });

  // node_modules/call-bind/node_modules/get-intrinsic/index.js
  var require_get_intrinsic2 = __commonJS({
    "node_modules/call-bind/node_modules/get-intrinsic/index.js"(exports, module) {
      "use strict";
      init_buffer_shim();
      var undefined2;
      var $SyntaxError = SyntaxError;
      var $Function = Function;
      var $TypeError = TypeError;
      var getEvalledConstructor = /* @__PURE__ */ __name(function(expressionSyntax) {
        try {
          return $Function('"use strict"; return (' + expressionSyntax + ").constructor;")();
        } catch (e) {
        }
      }, "getEvalledConstructor");
      var $gOPD = Object.getOwnPropertyDescriptor;
      if ($gOPD) {
        try {
          $gOPD({}, "");
        } catch (e) {
          $gOPD = null;
        }
      }
      var throwTypeError = /* @__PURE__ */ __name(function() {
        throw new $TypeError();
      }, "throwTypeError");
      var ThrowTypeError = $gOPD ? function() {
        try {
          arguments.callee;
          return throwTypeError;
        } catch (calleeThrows) {
          try {
            return $gOPD(arguments, "callee").get;
          } catch (gOPDthrows) {
            return throwTypeError;
          }
        }
      }() : throwTypeError;
      var hasSymbols = require_has_symbols2()();
      var getProto = Object.getPrototypeOf || function(x) {
        return x.__proto__;
      };
      var needsEval = {};
      var TypedArray = typeof Uint8Array === "undefined" ? undefined2 : getProto(Uint8Array);
      var INTRINSICS = {
        "%AggregateError%": typeof AggregateError === "undefined" ? undefined2 : AggregateError,
        "%Array%": Array,
        "%ArrayBuffer%": typeof ArrayBuffer === "undefined" ? undefined2 : ArrayBuffer,
        "%ArrayIteratorPrototype%": hasSymbols ? getProto([][Symbol.iterator]()) : undefined2,
        "%AsyncFromSyncIteratorPrototype%": undefined2,
        "%AsyncFunction%": needsEval,
        "%AsyncGenerator%": needsEval,
        "%AsyncGeneratorFunction%": needsEval,
        "%AsyncIteratorPrototype%": needsEval,
        "%Atomics%": typeof Atomics === "undefined" ? undefined2 : Atomics,
        "%BigInt%": typeof BigInt === "undefined" ? undefined2 : BigInt,
        "%Boolean%": Boolean,
        "%DataView%": typeof DataView === "undefined" ? undefined2 : DataView,
        "%Date%": Date,
        "%decodeURI%": decodeURI,
        "%decodeURIComponent%": decodeURIComponent,
        "%encodeURI%": encodeURI,
        "%encodeURIComponent%": encodeURIComponent,
        "%Error%": Error,
        "%eval%": eval,
        "%EvalError%": EvalError,
        "%Float32Array%": typeof Float32Array === "undefined" ? undefined2 : Float32Array,
        "%Float64Array%": typeof Float64Array === "undefined" ? undefined2 : Float64Array,
        "%FinalizationRegistry%": typeof FinalizationRegistry === "undefined" ? undefined2 : FinalizationRegistry,
        "%Function%": $Function,
        "%GeneratorFunction%": needsEval,
        "%Int8Array%": typeof Int8Array === "undefined" ? undefined2 : Int8Array,
        "%Int16Array%": typeof Int16Array === "undefined" ? undefined2 : Int16Array,
        "%Int32Array%": typeof Int32Array === "undefined" ? undefined2 : Int32Array,
        "%isFinite%": isFinite,
        "%isNaN%": isNaN,
        "%IteratorPrototype%": hasSymbols ? getProto(getProto([][Symbol.iterator]())) : undefined2,
        "%JSON%": typeof JSON === "object" ? JSON : undefined2,
        "%Map%": typeof Map === "undefined" ? undefined2 : Map,
        "%MapIteratorPrototype%": typeof Map === "undefined" || !hasSymbols ? undefined2 : getProto((/* @__PURE__ */ new Map())[Symbol.iterator]()),
        "%Math%": Math,
        "%Number%": Number,
        "%Object%": Object,
        "%parseFloat%": parseFloat,
        "%parseInt%": parseInt,
        "%Promise%": typeof Promise === "undefined" ? undefined2 : Promise,
        "%Proxy%": typeof Proxy === "undefined" ? undefined2 : Proxy,
        "%RangeError%": RangeError,
        "%ReferenceError%": ReferenceError,
        "%Reflect%": typeof Reflect === "undefined" ? undefined2 : Reflect,
        "%RegExp%": RegExp,
        "%Set%": typeof Set === "undefined" ? undefined2 : Set,
        "%SetIteratorPrototype%": typeof Set === "undefined" || !hasSymbols ? undefined2 : getProto((/* @__PURE__ */ new Set())[Symbol.iterator]()),
        "%SharedArrayBuffer%": typeof SharedArrayBuffer === "undefined" ? undefined2 : SharedArrayBuffer,
        "%String%": String,
        "%StringIteratorPrototype%": hasSymbols ? getProto(""[Symbol.iterator]()) : undefined2,
        "%Symbol%": hasSymbols ? Symbol : undefined2,
        "%SyntaxError%": $SyntaxError,
        "%ThrowTypeError%": ThrowTypeError,
        "%TypedArray%": TypedArray,
        "%TypeError%": $TypeError,
        "%Uint8Array%": typeof Uint8Array === "undefined" ? undefined2 : Uint8Array,
        "%Uint8ClampedArray%": typeof Uint8ClampedArray === "undefined" ? undefined2 : Uint8ClampedArray,
        "%Uint16Array%": typeof Uint16Array === "undefined" ? undefined2 : Uint16Array,
        "%Uint32Array%": typeof Uint32Array === "undefined" ? undefined2 : Uint32Array,
        "%URIError%": URIError,
        "%WeakMap%": typeof WeakMap === "undefined" ? undefined2 : WeakMap,
        "%WeakRef%": typeof WeakRef === "undefined" ? undefined2 : WeakRef,
        "%WeakSet%": typeof WeakSet === "undefined" ? undefined2 : WeakSet
      };
      var doEval = /* @__PURE__ */ __name(function doEval2(name) {
        var value;
        if (name === "%AsyncFunction%") {
          value = getEvalledConstructor("async function () {}");
        } else if (name === "%GeneratorFunction%") {
          value = getEvalledConstructor("function* () {}");
        } else if (name === "%AsyncGeneratorFunction%") {
          value = getEvalledConstructor("async function* () {}");
        } else if (name === "%AsyncGenerator%") {
          var fn = doEval2("%AsyncGeneratorFunction%");
          if (fn) {
            value = fn.prototype;
          }
        } else if (name === "%AsyncIteratorPrototype%") {
          var gen = doEval2("%AsyncGenerator%");
          if (gen) {
            value = getProto(gen.prototype);
          }
        }
        INTRINSICS[name] = value;
        return value;
      }, "doEval");
      var LEGACY_ALIASES = {
        "%ArrayBufferPrototype%": ["ArrayBuffer", "prototype"],
        "%ArrayPrototype%": ["Array", "prototype"],
        "%ArrayProto_entries%": ["Array", "prototype", "entries"],
        "%ArrayProto_forEach%": ["Array", "prototype", "forEach"],
        "%ArrayProto_keys%": ["Array", "prototype", "keys"],
        "%ArrayProto_values%": ["Array", "prototype", "values"],
        "%AsyncFunctionPrototype%": ["AsyncFunction", "prototype"],
        "%AsyncGenerator%": ["AsyncGeneratorFunction", "prototype"],
        "%AsyncGeneratorPrototype%": ["AsyncGeneratorFunction", "prototype", "prototype"],
        "%BooleanPrototype%": ["Boolean", "prototype"],
        "%DataViewPrototype%": ["DataView", "prototype"],
        "%DatePrototype%": ["Date", "prototype"],
        "%ErrorPrototype%": ["Error", "prototype"],
        "%EvalErrorPrototype%": ["EvalError", "prototype"],
        "%Float32ArrayPrototype%": ["Float32Array", "prototype"],
        "%Float64ArrayPrototype%": ["Float64Array", "prototype"],
        "%FunctionPrototype%": ["Function", "prototype"],
        "%Generator%": ["GeneratorFunction", "prototype"],
        "%GeneratorPrototype%": ["GeneratorFunction", "prototype", "prototype"],
        "%Int8ArrayPrototype%": ["Int8Array", "prototype"],
        "%Int16ArrayPrototype%": ["Int16Array", "prototype"],
        "%Int32ArrayPrototype%": ["Int32Array", "prototype"],
        "%JSONParse%": ["JSON", "parse"],
        "%JSONStringify%": ["JSON", "stringify"],
        "%MapPrototype%": ["Map", "prototype"],
        "%NumberPrototype%": ["Number", "prototype"],
        "%ObjectPrototype%": ["Object", "prototype"],
        "%ObjProto_toString%": ["Object", "prototype", "toString"],
        "%ObjProto_valueOf%": ["Object", "prototype", "valueOf"],
        "%PromisePrototype%": ["Promise", "prototype"],
        "%PromiseProto_then%": ["Promise", "prototype", "then"],
        "%Promise_all%": ["Promise", "all"],
        "%Promise_reject%": ["Promise", "reject"],
        "%Promise_resolve%": ["Promise", "resolve"],
        "%RangeErrorPrototype%": ["RangeError", "prototype"],
        "%ReferenceErrorPrototype%": ["ReferenceError", "prototype"],
        "%RegExpPrototype%": ["RegExp", "prototype"],
        "%SetPrototype%": ["Set", "prototype"],
        "%SharedArrayBufferPrototype%": ["SharedArrayBuffer", "prototype"],
        "%StringPrototype%": ["String", "prototype"],
        "%SymbolPrototype%": ["Symbol", "prototype"],
        "%SyntaxErrorPrototype%": ["SyntaxError", "prototype"],
        "%TypedArrayPrototype%": ["TypedArray", "prototype"],
        "%TypeErrorPrototype%": ["TypeError", "prototype"],
        "%Uint8ArrayPrototype%": ["Uint8Array", "prototype"],
        "%Uint8ClampedArrayPrototype%": ["Uint8ClampedArray", "prototype"],
        "%Uint16ArrayPrototype%": ["Uint16Array", "prototype"],
        "%Uint32ArrayPrototype%": ["Uint32Array", "prototype"],
        "%URIErrorPrototype%": ["URIError", "prototype"],
        "%WeakMapPrototype%": ["WeakMap", "prototype"],
        "%WeakSetPrototype%": ["WeakSet", "prototype"]
      };
      var bind = require_function_bind();
      var hasOwn = require_src();
      var $concat = bind.call(Function.call, Array.prototype.concat);
      var $spliceApply = bind.call(Function.apply, Array.prototype.splice);
      var $replace = bind.call(Function.call, String.prototype.replace);
      var $strSlice = bind.call(Function.call, String.prototype.slice);
      var $exec = bind.call(Function.call, RegExp.prototype.exec);
      var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
      var reEscapeChar = /\\(\\)?/g;
      var stringToPath = /* @__PURE__ */ __name(function stringToPath2(string) {
        var first = $strSlice(string, 0, 1);
        var last = $strSlice(string, -1);
        if (first === "%" && last !== "%") {
          throw new $SyntaxError("invalid intrinsic syntax, expected closing `%`");
        } else if (last === "%" && first !== "%") {
          throw new $SyntaxError("invalid intrinsic syntax, expected opening `%`");
        }
        var result = [];
        $replace(string, rePropName, function(match, number, quote, subString) {
          result[result.length] = quote ? $replace(subString, reEscapeChar, "$1") : number || match;
        });
        return result;
      }, "stringToPath");
      var getBaseIntrinsic = /* @__PURE__ */ __name(function getBaseIntrinsic2(name, allowMissing) {
        var intrinsicName = name;
        var alias;
        if (hasOwn(LEGACY_ALIASES, intrinsicName)) {
          alias = LEGACY_ALIASES[intrinsicName];
          intrinsicName = "%" + alias[0] + "%";
        }
        if (hasOwn(INTRINSICS, intrinsicName)) {
          var value = INTRINSICS[intrinsicName];
          if (value === needsEval) {
            value = doEval(intrinsicName);
          }
          if (typeof value === "undefined" && !allowMissing) {
            throw new $TypeError("intrinsic " + name + " exists, but is not available. Please file an issue!");
          }
          return {
            alias,
            name: intrinsicName,
            value
          };
        }
        throw new $SyntaxError("intrinsic " + name + " does not exist!");
      }, "getBaseIntrinsic");
      module.exports = /* @__PURE__ */ __name(function GetIntrinsic(name, allowMissing) {
        if (typeof name !== "string" || name.length === 0) {
          throw new $TypeError("intrinsic name must be a non-empty string");
        }
        if (arguments.length > 1 && typeof allowMissing !== "boolean") {
          throw new $TypeError('"allowMissing" argument must be a boolean');
        }
        if ($exec(/^%?[^%]*%?$/g, name) === null) {
          throw new $SyntaxError("`%` may not be present anywhere but at the beginning and end of the intrinsic name");
        }
        var parts = stringToPath(name);
        var intrinsicBaseName = parts.length > 0 ? parts[0] : "";
        var intrinsic = getBaseIntrinsic("%" + intrinsicBaseName + "%", allowMissing);
        var intrinsicRealName = intrinsic.name;
        var value = intrinsic.value;
        var skipFurtherCaching = false;
        var alias = intrinsic.alias;
        if (alias) {
          intrinsicBaseName = alias[0];
          $spliceApply(parts, $concat([0, 1], alias));
        }
        for (var i = 1, isOwn = true; i < parts.length; i += 1) {
          var part = parts[i];
          var first = $strSlice(part, 0, 1);
          var last = $strSlice(part, -1);
          if ((first === '"' || first === "'" || first === "`" || (last === '"' || last === "'" || last === "`")) && first !== last) {
            throw new $SyntaxError("property names with quotes must have matching quotes");
          }
          if (part === "constructor" || !isOwn) {
            skipFurtherCaching = true;
          }
          intrinsicBaseName += "." + part;
          intrinsicRealName = "%" + intrinsicBaseName + "%";
          if (hasOwn(INTRINSICS, intrinsicRealName)) {
            value = INTRINSICS[intrinsicRealName];
          } else if (value != null) {
            if (!(part in value)) {
              if (!allowMissing) {
                throw new $TypeError("base intrinsic for " + name + " exists, but the property is not available.");
              }
              return void 0;
            }
            if ($gOPD && i + 1 >= parts.length) {
              var desc = $gOPD(value, part);
              isOwn = !!desc;
              if (isOwn && "get" in desc && !("originalValue" in desc.get)) {
                value = desc.get;
              } else {
                value = value[part];
              }
            } else {
              isOwn = hasOwn(value, part);
              value = value[part];
            }
            if (isOwn && !skipFurtherCaching) {
              INTRINSICS[intrinsicRealName] = value;
            }
          }
        }
        return value;
      }, "GetIntrinsic");
    }
  });

  // node_modules/call-bind/index.js
  var require_call_bind = __commonJS({
    "node_modules/call-bind/index.js"(exports, module) {
      "use strict";
      init_buffer_shim();
      var bind = require_function_bind();
      var GetIntrinsic = require_get_intrinsic2();
      var $apply = GetIntrinsic("%Function.prototype.apply%");
      var $call = GetIntrinsic("%Function.prototype.call%");
      var $reflectApply = GetIntrinsic("%Reflect.apply%", true) || bind.call($call, $apply);
      var $gOPD = GetIntrinsic("%Object.getOwnPropertyDescriptor%", true);
      var $defineProperty = GetIntrinsic("%Object.defineProperty%", true);
      var $max = GetIntrinsic("%Math.max%");
      if ($defineProperty) {
        try {
          $defineProperty({}, "a", { value: 1 });
        } catch (e) {
          $defineProperty = null;
        }
      }
      module.exports = /* @__PURE__ */ __name(function callBind(originalFunction) {
        var func = $reflectApply(bind, $call, arguments);
        if ($gOPD && $defineProperty) {
          var desc = $gOPD(func, "length");
          if (desc.configurable) {
            $defineProperty(
              func,
              "length",
              { value: 1 + $max(0, originalFunction.length - (arguments.length - 1)) }
            );
          }
        }
        return func;
      }, "callBind");
      var applyBind = /* @__PURE__ */ __name(function applyBind2() {
        return $reflectApply(bind, $apply, arguments);
      }, "applyBind");
      if ($defineProperty) {
        $defineProperty(module.exports, "apply", { value: applyBind });
      } else {
        module.exports.apply = applyBind;
      }
    }
  });

  // node_modules/call-bind/callBound.js
  var require_callBound = __commonJS({
    "node_modules/call-bind/callBound.js"(exports, module) {
      "use strict";
      init_buffer_shim();
      var GetIntrinsic = require_get_intrinsic2();
      var callBind = require_call_bind();
      var $indexOf = callBind(GetIntrinsic("String.prototype.indexOf"));
      module.exports = /* @__PURE__ */ __name(function callBoundIntrinsic(name, allowMissing) {
        var intrinsic = GetIntrinsic(name, !!allowMissing);
        if (typeof intrinsic === "function" && $indexOf(name, ".prototype.") > -1) {
          return callBind(intrinsic);
        }
        return intrinsic;
      }, "callBoundIntrinsic");
    }
  });

  // (disabled):node_modules/side-channel/node_modules/object-inspect/util.inspect
  var require_util = __commonJS({
    "(disabled):node_modules/side-channel/node_modules/object-inspect/util.inspect"() {
      init_buffer_shim();
    }
  });

  // node_modules/side-channel/node_modules/object-inspect/index.js
  var require_object_inspect = __commonJS({
    "node_modules/side-channel/node_modules/object-inspect/index.js"(exports, module) {
      init_buffer_shim();
      var hasMap = typeof Map === "function" && Map.prototype;
      var mapSizeDescriptor = Object.getOwnPropertyDescriptor && hasMap ? Object.getOwnPropertyDescriptor(Map.prototype, "size") : null;
      var mapSize = hasMap && mapSizeDescriptor && typeof mapSizeDescriptor.get === "function" ? mapSizeDescriptor.get : null;
      var mapForEach = hasMap && Map.prototype.forEach;
      var hasSet = typeof Set === "function" && Set.prototype;
      var setSizeDescriptor = Object.getOwnPropertyDescriptor && hasSet ? Object.getOwnPropertyDescriptor(Set.prototype, "size") : null;
      var setSize = hasSet && setSizeDescriptor && typeof setSizeDescriptor.get === "function" ? setSizeDescriptor.get : null;
      var setForEach = hasSet && Set.prototype.forEach;
      var hasWeakMap = typeof WeakMap === "function" && WeakMap.prototype;
      var weakMapHas = hasWeakMap ? WeakMap.prototype.has : null;
      var hasWeakSet = typeof WeakSet === "function" && WeakSet.prototype;
      var weakSetHas = hasWeakSet ? WeakSet.prototype.has : null;
      var hasWeakRef = typeof WeakRef === "function" && WeakRef.prototype;
      var weakRefDeref = hasWeakRef ? WeakRef.prototype.deref : null;
      var booleanValueOf = Boolean.prototype.valueOf;
      var objectToString = Object.prototype.toString;
      var functionToString = Function.prototype.toString;
      var $match = String.prototype.match;
      var $slice = String.prototype.slice;
      var $replace = String.prototype.replace;
      var $toUpperCase = String.prototype.toUpperCase;
      var $toLowerCase = String.prototype.toLowerCase;
      var $test = RegExp.prototype.test;
      var $concat = Array.prototype.concat;
      var $join = Array.prototype.join;
      var $arrSlice = Array.prototype.slice;
      var $floor = Math.floor;
      var bigIntValueOf = typeof BigInt === "function" ? BigInt.prototype.valueOf : null;
      var gOPS = Object.getOwnPropertySymbols;
      var symToString = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? Symbol.prototype.toString : null;
      var hasShammedSymbols = typeof Symbol === "function" && typeof Symbol.iterator === "object";
      var toStringTag = typeof Symbol === "function" && Symbol.toStringTag && (typeof Symbol.toStringTag === hasShammedSymbols ? "object" : "symbol") ? Symbol.toStringTag : null;
      var isEnumerable = Object.prototype.propertyIsEnumerable;
      var gPO = (typeof Reflect === "function" ? Reflect.getPrototypeOf : Object.getPrototypeOf) || ([].__proto__ === Array.prototype ? function(O) {
        return O.__proto__;
      } : null);
      function addNumericSeparator(num, str) {
        if (num === Infinity || num === -Infinity || num !== num || num && num > -1e3 && num < 1e3 || $test.call(/e/, str)) {
          return str;
        }
        var sepRegex = /[0-9](?=(?:[0-9]{3})+(?![0-9]))/g;
        if (typeof num === "number") {
          var int = num < 0 ? -$floor(-num) : $floor(num);
          if (int !== num) {
            var intStr = String(int);
            var dec = $slice.call(str, intStr.length + 1);
            return $replace.call(intStr, sepRegex, "$&_") + "." + $replace.call($replace.call(dec, /([0-9]{3})/g, "$&_"), /_$/, "");
          }
        }
        return $replace.call(str, sepRegex, "$&_");
      }
      __name(addNumericSeparator, "addNumericSeparator");
      var utilInspect = require_util();
      var inspectCustom = utilInspect.custom;
      var inspectSymbol = isSymbol(inspectCustom) ? inspectCustom : null;
      module.exports = /* @__PURE__ */ __name(function inspect_(obj, options, depth, seen) {
        var opts = options || {};
        if (has(opts, "quoteStyle") && (opts.quoteStyle !== "single" && opts.quoteStyle !== "double")) {
          throw new TypeError('option "quoteStyle" must be "single" or "double"');
        }
        if (has(opts, "maxStringLength") && (typeof opts.maxStringLength === "number" ? opts.maxStringLength < 0 && opts.maxStringLength !== Infinity : opts.maxStringLength !== null)) {
          throw new TypeError('option "maxStringLength", if provided, must be a positive integer, Infinity, or `null`');
        }
        var customInspect = has(opts, "customInspect") ? opts.customInspect : true;
        if (typeof customInspect !== "boolean" && customInspect !== "symbol") {
          throw new TypeError("option \"customInspect\", if provided, must be `true`, `false`, or `'symbol'`");
        }
        if (has(opts, "indent") && opts.indent !== null && opts.indent !== "	" && !(parseInt(opts.indent, 10) === opts.indent && opts.indent > 0)) {
          throw new TypeError('option "indent" must be "\\t", an integer > 0, or `null`');
        }
        if (has(opts, "numericSeparator") && typeof opts.numericSeparator !== "boolean") {
          throw new TypeError('option "numericSeparator", if provided, must be `true` or `false`');
        }
        var numericSeparator = opts.numericSeparator;
        if (typeof obj === "undefined") {
          return "undefined";
        }
        if (obj === null) {
          return "null";
        }
        if (typeof obj === "boolean") {
          return obj ? "true" : "false";
        }
        if (typeof obj === "string") {
          return inspectString(obj, opts);
        }
        if (typeof obj === "number") {
          if (obj === 0) {
            return Infinity / obj > 0 ? "0" : "-0";
          }
          var str = String(obj);
          return numericSeparator ? addNumericSeparator(obj, str) : str;
        }
        if (typeof obj === "bigint") {
          var bigIntStr = String(obj) + "n";
          return numericSeparator ? addNumericSeparator(obj, bigIntStr) : bigIntStr;
        }
        var maxDepth = typeof opts.depth === "undefined" ? 5 : opts.depth;
        if (typeof depth === "undefined") {
          depth = 0;
        }
        if (depth >= maxDepth && maxDepth > 0 && typeof obj === "object") {
          return isArray2(obj) ? "[Array]" : "[Object]";
        }
        var indent = getIndent(opts, depth);
        if (typeof seen === "undefined") {
          seen = [];
        } else if (indexOf(seen, obj) >= 0) {
          return "[Circular]";
        }
        function inspect(value, from, noIndent) {
          if (from) {
            seen = $arrSlice.call(seen);
            seen.push(from);
          }
          if (noIndent) {
            var newOpts = {
              depth: opts.depth
            };
            if (has(opts, "quoteStyle")) {
              newOpts.quoteStyle = opts.quoteStyle;
            }
            return inspect_(value, newOpts, depth + 1, seen);
          }
          return inspect_(value, opts, depth + 1, seen);
        }
        __name(inspect, "inspect");
        if (typeof obj === "function" && !isRegExp(obj)) {
          var name = nameOf(obj);
          var keys = arrObjKeys(obj, inspect);
          return "[Function" + (name ? ": " + name : " (anonymous)") + "]" + (keys.length > 0 ? " { " + $join.call(keys, ", ") + " }" : "");
        }
        if (isSymbol(obj)) {
          var symString = hasShammedSymbols ? $replace.call(String(obj), /^(Symbol\(.*\))_[^)]*$/, "$1") : symToString.call(obj);
          return typeof obj === "object" && !hasShammedSymbols ? markBoxed(symString) : symString;
        }
        if (isElement(obj)) {
          var s = "<" + $toLowerCase.call(String(obj.nodeName));
          var attrs = obj.attributes || [];
          for (var i = 0; i < attrs.length; i++) {
            s += " " + attrs[i].name + "=" + wrapQuotes(quote(attrs[i].value), "double", opts);
          }
          s += ">";
          if (obj.childNodes && obj.childNodes.length) {
            s += "...";
          }
          s += "</" + $toLowerCase.call(String(obj.nodeName)) + ">";
          return s;
        }
        if (isArray2(obj)) {
          if (obj.length === 0) {
            return "[]";
          }
          var xs = arrObjKeys(obj, inspect);
          if (indent && !singleLineValues(xs)) {
            return "[" + indentedJoin(xs, indent) + "]";
          }
          return "[ " + $join.call(xs, ", ") + " ]";
        }
        if (isError(obj)) {
          var parts = arrObjKeys(obj, inspect);
          if (!("cause" in Error.prototype) && "cause" in obj && !isEnumerable.call(obj, "cause")) {
            return "{ [" + String(obj) + "] " + $join.call($concat.call("[cause]: " + inspect(obj.cause), parts), ", ") + " }";
          }
          if (parts.length === 0) {
            return "[" + String(obj) + "]";
          }
          return "{ [" + String(obj) + "] " + $join.call(parts, ", ") + " }";
        }
        if (typeof obj === "object" && customInspect) {
          if (inspectSymbol && typeof obj[inspectSymbol] === "function" && utilInspect) {
            return utilInspect(obj, { depth: maxDepth - depth });
          } else if (customInspect !== "symbol" && typeof obj.inspect === "function") {
            return obj.inspect();
          }
        }
        if (isMap(obj)) {
          var mapParts = [];
          mapForEach.call(obj, function(value, key) {
            mapParts.push(inspect(key, obj, true) + " => " + inspect(value, obj));
          });
          return collectionOf("Map", mapSize.call(obj), mapParts, indent);
        }
        if (isSet(obj)) {
          var setParts = [];
          setForEach.call(obj, function(value) {
            setParts.push(inspect(value, obj));
          });
          return collectionOf("Set", setSize.call(obj), setParts, indent);
        }
        if (isWeakMap(obj)) {
          return weakCollectionOf("WeakMap");
        }
        if (isWeakSet(obj)) {
          return weakCollectionOf("WeakSet");
        }
        if (isWeakRef(obj)) {
          return weakCollectionOf("WeakRef");
        }
        if (isNumber(obj)) {
          return markBoxed(inspect(Number(obj)));
        }
        if (isBigInt(obj)) {
          return markBoxed(inspect(bigIntValueOf.call(obj)));
        }
        if (isBoolean(obj)) {
          return markBoxed(booleanValueOf.call(obj));
        }
        if (isString(obj)) {
          return markBoxed(inspect(String(obj)));
        }
        if (!isDate(obj) && !isRegExp(obj)) {
          var ys = arrObjKeys(obj, inspect);
          var isPlainObject = gPO ? gPO(obj) === Object.prototype : obj instanceof Object || obj.constructor === Object;
          var protoTag = obj instanceof Object ? "" : "null prototype";
          var stringTag = !isPlainObject && toStringTag && Object(obj) === obj && toStringTag in obj ? $slice.call(toStr(obj), 8, -1) : protoTag ? "Object" : "";
          var constructorTag = isPlainObject || typeof obj.constructor !== "function" ? "" : obj.constructor.name ? obj.constructor.name + " " : "";
          var tag = constructorTag + (stringTag || protoTag ? "[" + $join.call($concat.call([], stringTag || [], protoTag || []), ": ") + "] " : "");
          if (ys.length === 0) {
            return tag + "{}";
          }
          if (indent) {
            return tag + "{" + indentedJoin(ys, indent) + "}";
          }
          return tag + "{ " + $join.call(ys, ", ") + " }";
        }
        return String(obj);
      }, "inspect_");
      function wrapQuotes(s, defaultStyle, opts) {
        var quoteChar = (opts.quoteStyle || defaultStyle) === "double" ? '"' : "'";
        return quoteChar + s + quoteChar;
      }
      __name(wrapQuotes, "wrapQuotes");
      function quote(s) {
        return $replace.call(String(s), /"/g, "&quot;");
      }
      __name(quote, "quote");
      function isArray2(obj) {
        return toStr(obj) === "[object Array]" && (!toStringTag || !(typeof obj === "object" && toStringTag in obj));
      }
      __name(isArray2, "isArray");
      function isDate(obj) {
        return toStr(obj) === "[object Date]" && (!toStringTag || !(typeof obj === "object" && toStringTag in obj));
      }
      __name(isDate, "isDate");
      function isRegExp(obj) {
        return toStr(obj) === "[object RegExp]" && (!toStringTag || !(typeof obj === "object" && toStringTag in obj));
      }
      __name(isRegExp, "isRegExp");
      function isError(obj) {
        return toStr(obj) === "[object Error]" && (!toStringTag || !(typeof obj === "object" && toStringTag in obj));
      }
      __name(isError, "isError");
      function isString(obj) {
        return toStr(obj) === "[object String]" && (!toStringTag || !(typeof obj === "object" && toStringTag in obj));
      }
      __name(isString, "isString");
      function isNumber(obj) {
        return toStr(obj) === "[object Number]" && (!toStringTag || !(typeof obj === "object" && toStringTag in obj));
      }
      __name(isNumber, "isNumber");
      function isBoolean(obj) {
        return toStr(obj) === "[object Boolean]" && (!toStringTag || !(typeof obj === "object" && toStringTag in obj));
      }
      __name(isBoolean, "isBoolean");
      function isSymbol(obj) {
        if (hasShammedSymbols) {
          return obj && typeof obj === "object" && obj instanceof Symbol;
        }
        if (typeof obj === "symbol") {
          return true;
        }
        if (!obj || typeof obj !== "object" || !symToString) {
          return false;
        }
        try {
          symToString.call(obj);
          return true;
        } catch (e) {
        }
        return false;
      }
      __name(isSymbol, "isSymbol");
      function isBigInt(obj) {
        if (!obj || typeof obj !== "object" || !bigIntValueOf) {
          return false;
        }
        try {
          bigIntValueOf.call(obj);
          return true;
        } catch (e) {
        }
        return false;
      }
      __name(isBigInt, "isBigInt");
      var hasOwn = Object.prototype.hasOwnProperty || function(key) {
        return key in this;
      };
      function has(obj, key) {
        return hasOwn.call(obj, key);
      }
      __name(has, "has");
      function toStr(obj) {
        return objectToString.call(obj);
      }
      __name(toStr, "toStr");
      function nameOf(f) {
        if (f.name) {
          return f.name;
        }
        var m = $match.call(functionToString.call(f), /^function\s*([\w$]+)/);
        if (m) {
          return m[1];
        }
        return null;
      }
      __name(nameOf, "nameOf");
      function indexOf(xs, x) {
        if (xs.indexOf) {
          return xs.indexOf(x);
        }
        for (var i = 0, l = xs.length; i < l; i++) {
          if (xs[i] === x) {
            return i;
          }
        }
        return -1;
      }
      __name(indexOf, "indexOf");
      function isMap(x) {
        if (!mapSize || !x || typeof x !== "object") {
          return false;
        }
        try {
          mapSize.call(x);
          try {
            setSize.call(x);
          } catch (s) {
            return true;
          }
          return x instanceof Map;
        } catch (e) {
        }
        return false;
      }
      __name(isMap, "isMap");
      function isWeakMap(x) {
        if (!weakMapHas || !x || typeof x !== "object") {
          return false;
        }
        try {
          weakMapHas.call(x, weakMapHas);
          try {
            weakSetHas.call(x, weakSetHas);
          } catch (s) {
            return true;
          }
          return x instanceof WeakMap;
        } catch (e) {
        }
        return false;
      }
      __name(isWeakMap, "isWeakMap");
      function isWeakRef(x) {
        if (!weakRefDeref || !x || typeof x !== "object") {
          return false;
        }
        try {
          weakRefDeref.call(x);
          return true;
        } catch (e) {
        }
        return false;
      }
      __name(isWeakRef, "isWeakRef");
      function isSet(x) {
        if (!setSize || !x || typeof x !== "object") {
          return false;
        }
        try {
          setSize.call(x);
          try {
            mapSize.call(x);
          } catch (m) {
            return true;
          }
          return x instanceof Set;
        } catch (e) {
        }
        return false;
      }
      __name(isSet, "isSet");
      function isWeakSet(x) {
        if (!weakSetHas || !x || typeof x !== "object") {
          return false;
        }
        try {
          weakSetHas.call(x, weakSetHas);
          try {
            weakMapHas.call(x, weakMapHas);
          } catch (s) {
            return true;
          }
          return x instanceof WeakSet;
        } catch (e) {
        }
        return false;
      }
      __name(isWeakSet, "isWeakSet");
      function isElement(x) {
        if (!x || typeof x !== "object") {
          return false;
        }
        if (typeof HTMLElement !== "undefined" && x instanceof HTMLElement) {
          return true;
        }
        return typeof x.nodeName === "string" && typeof x.getAttribute === "function";
      }
      __name(isElement, "isElement");
      function inspectString(str, opts) {
        if (str.length > opts.maxStringLength) {
          var remaining = str.length - opts.maxStringLength;
          var trailer = "... " + remaining + " more character" + (remaining > 1 ? "s" : "");
          return inspectString($slice.call(str, 0, opts.maxStringLength), opts) + trailer;
        }
        var s = $replace.call($replace.call(str, /(['\\])/g, "\\$1"), /[\x00-\x1f]/g, lowbyte);
        return wrapQuotes(s, "single", opts);
      }
      __name(inspectString, "inspectString");
      function lowbyte(c) {
        var n = c.charCodeAt(0);
        var x = {
          8: "b",
          9: "t",
          10: "n",
          12: "f",
          13: "r"
        }[n];
        if (x) {
          return "\\" + x;
        }
        return "\\x" + (n < 16 ? "0" : "") + $toUpperCase.call(n.toString(16));
      }
      __name(lowbyte, "lowbyte");
      function markBoxed(str) {
        return "Object(" + str + ")";
      }
      __name(markBoxed, "markBoxed");
      function weakCollectionOf(type) {
        return type + " { ? }";
      }
      __name(weakCollectionOf, "weakCollectionOf");
      function collectionOf(type, size, entries, indent) {
        var joinedEntries = indent ? indentedJoin(entries, indent) : $join.call(entries, ", ");
        return type + " (" + size + ") {" + joinedEntries + "}";
      }
      __name(collectionOf, "collectionOf");
      function singleLineValues(xs) {
        for (var i = 0; i < xs.length; i++) {
          if (indexOf(xs[i], "\n") >= 0) {
            return false;
          }
        }
        return true;
      }
      __name(singleLineValues, "singleLineValues");
      function getIndent(opts, depth) {
        var baseIndent;
        if (opts.indent === "	") {
          baseIndent = "	";
        } else if (typeof opts.indent === "number" && opts.indent > 0) {
          baseIndent = $join.call(Array(opts.indent + 1), " ");
        } else {
          return null;
        }
        return {
          base: baseIndent,
          prev: $join.call(Array(depth + 1), baseIndent)
        };
      }
      __name(getIndent, "getIndent");
      function indentedJoin(xs, indent) {
        if (xs.length === 0) {
          return "";
        }
        var lineJoiner = "\n" + indent.prev + indent.base;
        return lineJoiner + $join.call(xs, "," + lineJoiner) + "\n" + indent.prev;
      }
      __name(indentedJoin, "indentedJoin");
      function arrObjKeys(obj, inspect) {
        var isArr = isArray2(obj);
        var xs = [];
        if (isArr) {
          xs.length = obj.length;
          for (var i = 0; i < obj.length; i++) {
            xs[i] = has(obj, i) ? inspect(obj[i], obj) : "";
          }
        }
        var syms = typeof gOPS === "function" ? gOPS(obj) : [];
        var symMap;
        if (hasShammedSymbols) {
          symMap = {};
          for (var k = 0; k < syms.length; k++) {
            symMap["$" + syms[k]] = syms[k];
          }
        }
        for (var key in obj) {
          if (!has(obj, key)) {
            continue;
          }
          if (isArr && String(Number(key)) === key && key < obj.length) {
            continue;
          }
          if (hasShammedSymbols && symMap["$" + key] instanceof Symbol) {
            continue;
          } else if ($test.call(/[^\w$]/, key)) {
            xs.push(inspect(key, obj) + ": " + inspect(obj[key], obj));
          } else {
            xs.push(key + ": " + inspect(obj[key], obj));
          }
        }
        if (typeof gOPS === "function") {
          for (var j = 0; j < syms.length; j++) {
            if (isEnumerable.call(obj, syms[j])) {
              xs.push("[" + inspect(syms[j]) + "]: " + inspect(obj[syms[j]], obj));
            }
          }
        }
        return xs;
      }
      __name(arrObjKeys, "arrObjKeys");
    }
  });

  // node_modules/side-channel/index.js
  var require_side_channel = __commonJS({
    "node_modules/side-channel/index.js"(exports, module) {
      "use strict";
      init_buffer_shim();
      var GetIntrinsic = require_get_intrinsic();
      var callBound = require_callBound();
      var inspect = require_object_inspect();
      var $TypeError = GetIntrinsic("%TypeError%");
      var $WeakMap = GetIntrinsic("%WeakMap%", true);
      var $Map = GetIntrinsic("%Map%", true);
      var $weakMapGet = callBound("WeakMap.prototype.get", true);
      var $weakMapSet = callBound("WeakMap.prototype.set", true);
      var $weakMapHas = callBound("WeakMap.prototype.has", true);
      var $mapGet = callBound("Map.prototype.get", true);
      var $mapSet = callBound("Map.prototype.set", true);
      var $mapHas = callBound("Map.prototype.has", true);
      var listGetNode = /* @__PURE__ */ __name(function(list, key) {
        for (var prev = list, curr; (curr = prev.next) !== null; prev = curr) {
          if (curr.key === key) {
            prev.next = curr.next;
            curr.next = list.next;
            list.next = curr;
            return curr;
          }
        }
      }, "listGetNode");
      var listGet = /* @__PURE__ */ __name(function(objects, key) {
        var node = listGetNode(objects, key);
        return node && node.value;
      }, "listGet");
      var listSet = /* @__PURE__ */ __name(function(objects, key, value) {
        var node = listGetNode(objects, key);
        if (node) {
          node.value = value;
        } else {
          objects.next = {
            key,
            next: objects.next,
            value
          };
        }
      }, "listSet");
      var listHas = /* @__PURE__ */ __name(function(objects, key) {
        return !!listGetNode(objects, key);
      }, "listHas");
      module.exports = /* @__PURE__ */ __name(function getSideChannel() {
        var $wm;
        var $m;
        var $o;
        var channel = {
          assert: function(key) {
            if (!channel.has(key)) {
              throw new $TypeError("Side channel does not contain " + inspect(key));
            }
          },
          get: function(key) {
            if ($WeakMap && key && (typeof key === "object" || typeof key === "function")) {
              if ($wm) {
                return $weakMapGet($wm, key);
              }
            } else if ($Map) {
              if ($m) {
                return $mapGet($m, key);
              }
            } else {
              if ($o) {
                return listGet($o, key);
              }
            }
          },
          has: function(key) {
            if ($WeakMap && key && (typeof key === "object" || typeof key === "function")) {
              if ($wm) {
                return $weakMapHas($wm, key);
              }
            } else if ($Map) {
              if ($m) {
                return $mapHas($m, key);
              }
            } else {
              if ($o) {
                return listHas($o, key);
              }
            }
            return false;
          },
          set: function(key, value) {
            if ($WeakMap && key && (typeof key === "object" || typeof key === "function")) {
              if (!$wm) {
                $wm = new $WeakMap();
              }
              $weakMapSet($wm, key, value);
            } else if ($Map) {
              if (!$m) {
                $m = new $Map();
              }
              $mapSet($m, key, value);
            } else {
              if (!$o) {
                $o = { key: {}, next: null };
              }
              listSet($o, key, value);
            }
          }
        };
        return channel;
      }, "getSideChannel");
    }
  });

  // node_modules/qs/lib/formats.js
  var require_formats = __commonJS({
    "node_modules/qs/lib/formats.js"(exports, module) {
      "use strict";
      init_buffer_shim();
      var replace = String.prototype.replace;
      var percentTwenties = /%20/g;
      var Format = {
        RFC1738: "RFC1738",
        RFC3986: "RFC3986"
      };
      module.exports = {
        "default": Format.RFC3986,
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
    }
  });

  // node_modules/qs/lib/utils.js
  var require_utils2 = __commonJS({
    "node_modules/qs/lib/utils.js"(exports, module) {
      "use strict";
      init_buffer_shim();
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
      var compactQueue = /* @__PURE__ */ __name(function compactQueue2(queue) {
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
      }, "compactQueue");
      var arrayToObject = /* @__PURE__ */ __name(function arrayToObject2(source, options) {
        var obj = options && options.plainObjects ? /* @__PURE__ */ Object.create(null) : {};
        for (var i = 0; i < source.length; ++i) {
          if (typeof source[i] !== "undefined") {
            obj[i] = source[i];
          }
        }
        return obj;
      }, "arrayToObject");
      var merge = /* @__PURE__ */ __name(function merge2(target, source, options) {
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
      }, "merge");
      var assign = /* @__PURE__ */ __name(function assignSingleSource(target, source) {
        return Object.keys(source).reduce(function(acc, key) {
          acc[key] = source[key];
          return acc;
        }, target);
      }, "assignSingleSource");
      var decode = /* @__PURE__ */ __name(function(str, decoder, charset) {
        var strWithoutPlus = str.replace(/\+/g, " ");
        if (charset === "iso-8859-1") {
          return strWithoutPlus.replace(/%[0-9a-f]{2}/gi, unescape);
        }
        try {
          return decodeURIComponent(strWithoutPlus);
        } catch (e) {
          return strWithoutPlus;
        }
      }, "decode");
      var encode = /* @__PURE__ */ __name(function encode2(str, defaultEncoder, charset, kind, format2) {
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
          if (c === 45 || c === 46 || c === 95 || c === 126 || c >= 48 && c <= 57 || c >= 65 && c <= 90 || c >= 97 && c <= 122 || format2 === formats.RFC1738 && (c === 40 || c === 41)) {
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
      }, "encode");
      var compact = /* @__PURE__ */ __name(function compact2(value) {
        var queue = [{ obj: { o: value }, prop: "o" }];
        var refs = [];
        for (var i = 0; i < queue.length; ++i) {
          var item = queue[i];
          var obj = item.obj[item.prop];
          var keys = Object.keys(obj);
          for (var j = 0; j < keys.length; ++j) {
            var key = keys[j];
            var val = obj[key];
            if (typeof val === "object" && val !== null && refs.indexOf(val) === -1) {
              queue.push({ obj, prop: key });
              refs.push(val);
            }
          }
        }
        compactQueue(queue);
        return value;
      }, "compact");
      var isRegExp = /* @__PURE__ */ __name(function isRegExp2(obj) {
        return Object.prototype.toString.call(obj) === "[object RegExp]";
      }, "isRegExp");
      var isBuffer = /* @__PURE__ */ __name(function isBuffer2(obj) {
        if (!obj || typeof obj !== "object") {
          return false;
        }
        return !!(obj.constructor && obj.constructor.isBuffer && obj.constructor.isBuffer(obj));
      }, "isBuffer");
      var combine = /* @__PURE__ */ __name(function combine2(a, b) {
        return [].concat(a, b);
      }, "combine");
      var maybeMap = /* @__PURE__ */ __name(function maybeMap2(val, fn) {
        if (isArray2(val)) {
          var mapped = [];
          for (var i = 0; i < val.length; i += 1) {
            mapped.push(fn(val[i]));
          }
          return mapped;
        }
        return fn(val);
      }, "maybeMap");
      module.exports = {
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
    }
  });

  // node_modules/qs/lib/stringify.js
  var require_stringify = __commonJS({
    "node_modules/qs/lib/stringify.js"(exports, module) {
      "use strict";
      init_buffer_shim();
      var getSideChannel = require_side_channel();
      var utils = require_utils2();
      var formats = require_formats();
      var has = Object.prototype.hasOwnProperty;
      var arrayPrefixGenerators = {
        brackets: /* @__PURE__ */ __name(function brackets(prefix) {
          return prefix + "[]";
        }, "brackets"),
        comma: "comma",
        indices: /* @__PURE__ */ __name(function indices(prefix, key) {
          return prefix + "[" + key + "]";
        }, "indices"),
        repeat: /* @__PURE__ */ __name(function repeat(prefix) {
          return prefix;
        }, "repeat")
      };
      var isArray2 = Array.isArray;
      var split = String.prototype.split;
      var push = Array.prototype.push;
      var pushToArray = /* @__PURE__ */ __name(function(arr, valueOrArray) {
        push.apply(arr, isArray2(valueOrArray) ? valueOrArray : [valueOrArray]);
      }, "pushToArray");
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
        serializeDate: /* @__PURE__ */ __name(function serializeDate(date) {
          return toISO.call(date);
        }, "serializeDate"),
        skipNulls: false,
        strictNullHandling: false
      };
      var isNonNullishPrimitive = /* @__PURE__ */ __name(function isNonNullishPrimitive2(v) {
        return typeof v === "string" || typeof v === "number" || typeof v === "boolean" || typeof v === "symbol" || typeof v === "bigint";
      }, "isNonNullishPrimitive");
      var sentinel = {};
      var stringify = /* @__PURE__ */ __name(function stringify2(object, prefix, generateArrayPrefix, commaRoundTrip, strictNullHandling, skipNulls, encoder, filter, sort, allowDots, serializeDate, format2, formatter, encodeValuesOnly, charset, sideChannel) {
        var obj = object;
        var tmpSc = sideChannel;
        var step = 0;
        var findFlag = false;
        while ((tmpSc = tmpSc.get(sentinel)) !== void 0 && !findFlag) {
          var pos = tmpSc.get(object);
          step += 1;
          if (typeof pos !== "undefined") {
            if (pos === step) {
              throw new RangeError("Cyclic object value");
            } else {
              findFlag = true;
            }
          }
          if (typeof tmpSc.get(sentinel) === "undefined") {
            step = 0;
          }
        }
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
            return encoder && !encodeValuesOnly ? encoder(prefix, defaults.encoder, charset, "key", format2) : prefix;
          }
          obj = "";
        }
        if (isNonNullishPrimitive(obj) || utils.isBuffer(obj)) {
          if (encoder) {
            var keyValue = encodeValuesOnly ? prefix : encoder(prefix, defaults.encoder, charset, "key", format2);
            if (generateArrayPrefix === "comma" && encodeValuesOnly) {
              var valuesArray = split.call(String(obj), ",");
              var valuesJoined = "";
              for (var i = 0; i < valuesArray.length; ++i) {
                valuesJoined += (i === 0 ? "" : ",") + formatter(encoder(valuesArray[i], defaults.encoder, charset, "value", format2));
              }
              return [formatter(keyValue) + (commaRoundTrip && isArray2(obj) && valuesArray.length === 1 ? "[]" : "") + "=" + valuesJoined];
            }
            return [formatter(keyValue) + "=" + formatter(encoder(obj, defaults.encoder, charset, "value", format2))];
          }
          return [formatter(prefix) + "=" + formatter(String(obj))];
        }
        var values = [];
        if (typeof obj === "undefined") {
          return values;
        }
        var objKeys;
        if (generateArrayPrefix === "comma" && isArray2(obj)) {
          objKeys = [{ value: obj.length > 0 ? obj.join(",") || null : void 0 }];
        } else if (isArray2(filter)) {
          objKeys = filter;
        } else {
          var keys = Object.keys(obj);
          objKeys = sort ? keys.sort(sort) : keys;
        }
        var adjustedPrefix = commaRoundTrip && isArray2(obj) && obj.length === 1 ? prefix + "[]" : prefix;
        for (var j = 0; j < objKeys.length; ++j) {
          var key = objKeys[j];
          var value = typeof key === "object" && typeof key.value !== "undefined" ? key.value : obj[key];
          if (skipNulls && value === null) {
            continue;
          }
          var keyPrefix = isArray2(obj) ? typeof generateArrayPrefix === "function" ? generateArrayPrefix(adjustedPrefix, key) : adjustedPrefix : adjustedPrefix + (allowDots ? "." + key : "[" + key + "]");
          sideChannel.set(object, step);
          var valueSideChannel = getSideChannel();
          valueSideChannel.set(sentinel, sideChannel);
          pushToArray(values, stringify2(
            value,
            keyPrefix,
            generateArrayPrefix,
            commaRoundTrip,
            strictNullHandling,
            skipNulls,
            encoder,
            filter,
            sort,
            allowDots,
            serializeDate,
            format2,
            formatter,
            encodeValuesOnly,
            charset,
            valueSideChannel
          ));
        }
        return values;
      }, "stringify");
      var normalizeStringifyOptions = /* @__PURE__ */ __name(function normalizeStringifyOptions2(opts) {
        if (!opts) {
          return defaults;
        }
        if (opts.encoder !== null && typeof opts.encoder !== "undefined" && typeof opts.encoder !== "function") {
          throw new TypeError("Encoder has to be a function.");
        }
        var charset = opts.charset || defaults.charset;
        if (typeof opts.charset !== "undefined" && opts.charset !== "utf-8" && opts.charset !== "iso-8859-1") {
          throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
        }
        var format2 = formats["default"];
        if (typeof opts.format !== "undefined") {
          if (!has.call(formats.formatters, opts.format)) {
            throw new TypeError("Unknown format option provided.");
          }
          format2 = opts.format;
        }
        var formatter = formats.formatters[format2];
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
          format: format2,
          formatter,
          serializeDate: typeof opts.serializeDate === "function" ? opts.serializeDate : defaults.serializeDate,
          skipNulls: typeof opts.skipNulls === "boolean" ? opts.skipNulls : defaults.skipNulls,
          sort: typeof opts.sort === "function" ? opts.sort : null,
          strictNullHandling: typeof opts.strictNullHandling === "boolean" ? opts.strictNullHandling : defaults.strictNullHandling
        };
      }, "normalizeStringifyOptions");
      module.exports = function(object, opts) {
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
        if (opts && "commaRoundTrip" in opts && typeof opts.commaRoundTrip !== "boolean") {
          throw new TypeError("`commaRoundTrip` must be a boolean, or absent");
        }
        var commaRoundTrip = generateArrayPrefix === "comma" && opts && opts.commaRoundTrip;
        if (!objKeys) {
          objKeys = Object.keys(obj);
        }
        if (options.sort) {
          objKeys.sort(options.sort);
        }
        var sideChannel = getSideChannel();
        for (var i = 0; i < objKeys.length; ++i) {
          var key = objKeys[i];
          if (options.skipNulls && obj[key] === null) {
            continue;
          }
          pushToArray(keys, stringify(
            obj[key],
            key,
            generateArrayPrefix,
            commaRoundTrip,
            options.strictNullHandling,
            options.skipNulls,
            options.encode ? options.encoder : null,
            options.filter,
            options.sort,
            options.allowDots,
            options.serializeDate,
            options.format,
            options.formatter,
            options.encodeValuesOnly,
            options.charset,
            sideChannel
          ));
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
    }
  });

  // node_modules/qs/lib/parse.js
  var require_parse2 = __commonJS({
    "node_modules/qs/lib/parse.js"(exports, module) {
      "use strict";
      init_buffer_shim();
      var utils = require_utils2();
      var has = Object.prototype.hasOwnProperty;
      var isArray2 = Array.isArray;
      var defaults = {
        allowDots: false,
        allowPrototypes: false,
        allowSparse: false,
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
      var interpretNumericEntities = /* @__PURE__ */ __name(function(str) {
        return str.replace(/&#(\d+);/g, function($0, numberStr) {
          return String.fromCharCode(parseInt(numberStr, 10));
        });
      }, "interpretNumericEntities");
      var parseArrayValue = /* @__PURE__ */ __name(function(val, options) {
        if (val && typeof val === "string" && options.comma && val.indexOf(",") > -1) {
          return val.split(",");
        }
        return val;
      }, "parseArrayValue");
      var isoSentinel = "utf8=%26%2310003%3B";
      var charsetSentinel = "utf8=%E2%9C%93";
      var parseValues = /* @__PURE__ */ __name(function parseQueryStringValues(str, options) {
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
            val = utils.maybeMap(
              parseArrayValue(part.slice(pos + 1), options),
              function(encodedVal) {
                return options.decoder(encodedVal, defaults.decoder, charset, "value");
              }
            );
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
      }, "parseQueryStringValues");
      var parseObject = /* @__PURE__ */ __name(function(chain, val, options, valuesParsed) {
        var leaf = valuesParsed ? val : parseArrayValue(val, options);
        for (var i = chain.length - 1; i >= 0; --i) {
          var obj;
          var root = chain[i];
          if (root === "[]" && options.parseArrays) {
            obj = [].concat(leaf);
          } else {
            obj = options.plainObjects ? /* @__PURE__ */ Object.create(null) : {};
            var cleanRoot = root.charAt(0) === "[" && root.charAt(root.length - 1) === "]" ? root.slice(1, -1) : root;
            var index = parseInt(cleanRoot, 10);
            if (!options.parseArrays && cleanRoot === "") {
              obj = { 0: leaf };
            } else if (!isNaN(index) && root !== cleanRoot && String(index) === cleanRoot && index >= 0 && (options.parseArrays && index <= options.arrayLimit)) {
              obj = [];
              obj[index] = leaf;
            } else if (cleanRoot !== "__proto__") {
              obj[cleanRoot] = leaf;
            }
          }
          leaf = obj;
        }
        return leaf;
      }, "parseObject");
      var parseKeys = /* @__PURE__ */ __name(function parseQueryStringKeys(givenKey, val, options, valuesParsed) {
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
      }, "parseQueryStringKeys");
      var normalizeParseOptions = /* @__PURE__ */ __name(function normalizeParseOptions2(opts) {
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
          allowSparse: typeof opts.allowSparse === "boolean" ? opts.allowSparse : defaults.allowSparse,
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
      }, "normalizeParseOptions");
      module.exports = function(str, opts) {
        var options = normalizeParseOptions(opts);
        if (str === "" || str === null || typeof str === "undefined") {
          return options.plainObjects ? /* @__PURE__ */ Object.create(null) : {};
        }
        var tempObj = typeof str === "string" ? parseValues(str, options) : str;
        var obj = options.plainObjects ? /* @__PURE__ */ Object.create(null) : {};
        var keys = Object.keys(tempObj);
        for (var i = 0; i < keys.length; ++i) {
          var key = keys[i];
          var newObj = parseKeys(key, tempObj[key], options, typeof str === "string");
          obj = utils.merge(obj, newObj, options);
        }
        if (options.allowSparse === true) {
          return obj;
        }
        return utils.compact(obj);
      };
    }
  });

  // node_modules/qs/lib/index.js
  var require_lib2 = __commonJS({
    "node_modules/qs/lib/index.js"(exports, module) {
      "use strict";
      init_buffer_shim();
      var stringify = require_stringify();
      var parse = require_parse2();
      var formats = require_formats();
      module.exports = {
        formats,
        parse,
        stringify
      };
    }
  });

  // node_modules/requires-port/index.js
  var require_requires_port = __commonJS({
    "node_modules/requires-port/index.js"(exports, module) {
      "use strict";
      init_buffer_shim();
      module.exports = /* @__PURE__ */ __name(function required(port, protocol) {
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
      }, "required");
    }
  });

  // node_modules/querystringify/index.js
  var require_querystringify = __commonJS({
    "node_modules/querystringify/index.js"(exports) {
      "use strict";
      init_buffer_shim();
      var has = Object.prototype.hasOwnProperty;
      var undef;
      function decode(input) {
        try {
          return decodeURIComponent(input.replace(/\+/g, " "));
        } catch (e) {
          return null;
        }
      }
      __name(decode, "decode");
      function encode(input) {
        try {
          return encodeURIComponent(input);
        } catch (e) {
          return null;
        }
      }
      __name(encode, "encode");
      function querystring(query) {
        var parser = /([^=?#&]+)=?([^&]*)/g, result = {}, part;
        while (part = parser.exec(query)) {
          var key = decode(part[1]), value = decode(part[2]);
          if (key === null || value === null || key in result)
            continue;
          result[key] = value;
        }
        return result;
      }
      __name(querystring, "querystring");
      function querystringify(obj, prefix) {
        prefix = prefix || "";
        var pairs = [], value, key;
        if ("string" !== typeof prefix)
          prefix = "?";
        for (key in obj) {
          if (has.call(obj, key)) {
            value = obj[key];
            if (!value && (value === null || value === undef || isNaN(value))) {
              value = "";
            }
            key = encode(key);
            value = encode(value);
            if (key === null || value === null)
              continue;
            pairs.push(key + "=" + value);
          }
        }
        return pairs.length ? prefix + pairs.join("&") : "";
      }
      __name(querystringify, "querystringify");
      exports.stringify = querystringify;
      exports.parse = querystring;
    }
  });

  // node_modules/url-parse/index.js
  var require_url_parse = __commonJS({
    "node_modules/url-parse/index.js"(exports, module) {
      "use strict";
      init_buffer_shim();
      var required = require_requires_port();
      var qs2 = require_querystringify();
      var controlOrWhitespace = /^[\x00-\x20\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]+/;
      var CRHTLF = /[\n\r\t]/g;
      var slashes = /^[A-Za-z][A-Za-z0-9+-.]*:\/\//;
      var port = /:\d+$/;
      var protocolre = /^([a-z][a-z0-9.+-]*:)?(\/\/)?([\\/]+)?([\S\s]*)/i;
      var windowsDriveLetter = /^[a-zA-Z]:/;
      function trimLeft(str) {
        return (str ? str : "").toString().replace(controlOrWhitespace, "");
      }
      __name(trimLeft, "trimLeft");
      var rules = [
        ["#", "hash"],
        ["?", "query"],
        /* @__PURE__ */ __name(function sanitize(address, url) {
          return isSpecial(url.protocol) ? address.replace(/\\/g, "/") : address;
        }, "sanitize"),
        ["/", "pathname"],
        ["@", "auth", 1],
        [NaN, "host", void 0, 1, 1],
        [/:(\d*)$/, "port", void 0, 1],
        [NaN, "hostname", void 0, 1, 1]
      ];
      var ignore = { hash: 1, query: 1 };
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
        if ("blob:" === loc.protocol) {
          finaldestination = new Url(unescape(loc.pathname), {});
        } else if ("string" === type) {
          finaldestination = new Url(loc, {});
          for (key in ignore)
            delete finaldestination[key];
        } else if ("object" === type) {
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
      __name(lolcation, "lolcation");
      function isSpecial(scheme) {
        return scheme === "file:" || scheme === "ftp:" || scheme === "http:" || scheme === "https:" || scheme === "ws:" || scheme === "wss:";
      }
      __name(isSpecial, "isSpecial");
      function extractProtocol(address, location) {
        address = trimLeft(address);
        address = address.replace(CRHTLF, "");
        location = location || {};
        var match = protocolre.exec(address);
        var protocol = match[1] ? match[1].toLowerCase() : "";
        var forwardSlashes = !!match[2];
        var otherSlashes = !!match[3];
        var slashesCount = 0;
        var rest;
        if (forwardSlashes) {
          if (otherSlashes) {
            rest = match[2] + match[3] + match[4];
            slashesCount = match[2].length + match[3].length;
          } else {
            rest = match[2] + match[4];
            slashesCount = match[2].length;
          }
        } else {
          if (otherSlashes) {
            rest = match[3] + match[4];
            slashesCount = match[3].length;
          } else {
            rest = match[4];
          }
        }
        if (protocol === "file:") {
          if (slashesCount >= 2) {
            rest = rest.slice(2);
          }
        } else if (isSpecial(protocol)) {
          rest = match[4];
        } else if (protocol) {
          if (forwardSlashes) {
            rest = rest.slice(2);
          }
        } else if (slashesCount >= 2 && isSpecial(location.protocol)) {
          rest = match[4];
        }
        return {
          protocol,
          slashes: forwardSlashes || isSpecial(protocol),
          slashesCount,
          rest
        };
      }
      __name(extractProtocol, "extractProtocol");
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
      __name(resolve, "resolve");
      function Url(address, location, parser) {
        address = trimLeft(address);
        address = address.replace(CRHTLF, "");
        if (!(this instanceof Url)) {
          return new Url(address, location, parser);
        }
        var relative, extracted, parse, instruction, index, key, instructions = rules.slice(), type = typeof location, url = this, i = 0;
        if ("object" !== type && "string" !== type) {
          parser = location;
          location = null;
        }
        if (parser && "function" !== typeof parser)
          parser = qs2.parse;
        location = lolcation(location);
        extracted = extractProtocol(address || "", location);
        relative = !extracted.protocol && !extracted.slashes;
        url.slashes = extracted.slashes || relative && location.slashes;
        url.protocol = extracted.protocol || location.protocol || "";
        address = extracted.rest;
        if (extracted.protocol === "file:" && (extracted.slashesCount !== 2 || windowsDriveLetter.test(address)) || !extracted.slashes && (extracted.protocol || extracted.slashesCount < 2 || !isSpecial(url.protocol))) {
          instructions[3] = [/(.*)/, "pathname"];
        }
        for (; i < instructions.length; i++) {
          instruction = instructions[i];
          if (typeof instruction === "function") {
            address = instruction(address, url);
            continue;
          }
          parse = instruction[0];
          key = instruction[1];
          if (parse !== parse) {
            url[key] = address;
          } else if ("string" === typeof parse) {
            index = parse === "@" ? address.lastIndexOf(parse) : address.indexOf(parse);
            if (~index) {
              if ("number" === typeof instruction[2]) {
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
        if (url.pathname.charAt(0) !== "/" && isSpecial(url.protocol)) {
          url.pathname = "/" + url.pathname;
        }
        if (!required(url.port, url.protocol)) {
          url.host = url.hostname;
          url.port = "";
        }
        url.username = url.password = "";
        if (url.auth) {
          index = url.auth.indexOf(":");
          if (~index) {
            url.username = url.auth.slice(0, index);
            url.username = encodeURIComponent(decodeURIComponent(url.username));
            url.password = url.auth.slice(index + 1);
            url.password = encodeURIComponent(decodeURIComponent(url.password));
          } else {
            url.username = encodeURIComponent(decodeURIComponent(url.auth));
          }
          url.auth = url.password ? url.username + ":" + url.password : url.username;
        }
        url.origin = url.protocol !== "file:" && isSpecial(url.protocol) && url.host ? url.protocol + "//" + url.host : "null";
        url.href = url.toString();
      }
      __name(Url, "Url");
      function set(part, value, fn) {
        var url = this;
        switch (part) {
          case "query":
            if ("string" === typeof value && value.length) {
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
            if (port.test(value)) {
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
          case "username":
          case "password":
            url[part] = encodeURIComponent(value);
            break;
          case "auth":
            var index = value.indexOf(":");
            if (~index) {
              url.username = value.slice(0, index);
              url.username = encodeURIComponent(decodeURIComponent(url.username));
              url.password = value.slice(index + 1);
              url.password = encodeURIComponent(decodeURIComponent(url.password));
            } else {
              url.username = encodeURIComponent(decodeURIComponent(value));
            }
        }
        for (var i = 0; i < rules.length; i++) {
          var ins = rules[i];
          if (ins[4])
            url[ins[1]] = url[ins[1]].toLowerCase();
        }
        url.auth = url.password ? url.username + ":" + url.password : url.username;
        url.origin = url.protocol !== "file:" && isSpecial(url.protocol) && url.host ? url.protocol + "//" + url.host : "null";
        url.href = url.toString();
        return url;
      }
      __name(set, "set");
      function toString(stringify) {
        if (!stringify || "function" !== typeof stringify)
          stringify = qs2.stringify;
        var query, url = this, host = url.host, protocol = url.protocol;
        if (protocol && protocol.charAt(protocol.length - 1) !== ":")
          protocol += ":";
        var result = protocol + (url.protocol && url.slashes || isSpecial(url.protocol) ? "//" : "");
        if (url.username) {
          result += url.username;
          if (url.password)
            result += ":" + url.password;
          result += "@";
        } else if (url.password) {
          result += ":" + url.password;
          result += "@";
        } else if (url.protocol !== "file:" && isSpecial(url.protocol) && !host && url.pathname !== "/") {
          result += "@";
        }
        if (host[host.length - 1] === ":" || port.test(url.hostname) && !url.port) {
          host += ":";
        }
        result += host + url.pathname;
        query = "object" === typeof url.query ? stringify(url.query) : url.query;
        if (query)
          result += "?" !== query.charAt(0) ? "?" + query : query;
        if (url.hash)
          result += url.hash;
        return result;
      }
      __name(toString, "toString");
      Url.prototype = { set, toString };
      Url.extractProtocol = extractProtocol;
      Url.location = lolcation;
      Url.trimLeft = trimLeft;
      Url.qs = qs2;
      module.exports = Url;
    }
  });

  // node_modules/is-arguments/index.js
  var require_is_arguments = __commonJS({
    "node_modules/is-arguments/index.js"(exports, module) {
      "use strict";
      init_buffer_shim();
      var hasToStringTag = typeof Symbol === "function" && typeof Symbol.toStringTag === "symbol";
      var callBound = require_callBound();
      var $toString = callBound("Object.prototype.toString");
      var isStandardArguments = /* @__PURE__ */ __name(function isArguments(value) {
        if (hasToStringTag && value && typeof value === "object" && Symbol.toStringTag in value) {
          return false;
        }
        return $toString(value) === "[object Arguments]";
      }, "isArguments");
      var isLegacyArguments = /* @__PURE__ */ __name(function isArguments(value) {
        if (isStandardArguments(value)) {
          return true;
        }
        return value !== null && typeof value === "object" && typeof value.length === "number" && value.length >= 0 && $toString(value) !== "[object Array]" && $toString(value.callee) === "[object Function]";
      }, "isArguments");
      var supportsStandardArguments = function() {
        return isStandardArguments(arguments);
      }();
      isStandardArguments.isLegacyArguments = isLegacyArguments;
      module.exports = supportsStandardArguments ? isStandardArguments : isLegacyArguments;
    }
  });

  // node_modules/is-generator-function/index.js
  var require_is_generator_function = __commonJS({
    "node_modules/is-generator-function/index.js"(exports, module) {
      "use strict";
      init_buffer_shim();
      var toStr = Object.prototype.toString;
      var fnToStr = Function.prototype.toString;
      var isFnRegex = /^\s*(?:function)?\*/;
      var hasToStringTag = typeof Symbol === "function" && typeof Symbol.toStringTag === "symbol";
      var getProto = Object.getPrototypeOf;
      var getGeneratorFunc = /* @__PURE__ */ __name(function() {
        if (!hasToStringTag) {
          return false;
        }
        try {
          return Function("return function*() {}")();
        } catch (e) {
        }
      }, "getGeneratorFunc");
      var GeneratorFunction;
      module.exports = /* @__PURE__ */ __name(function isGeneratorFunction(fn) {
        if (typeof fn !== "function") {
          return false;
        }
        if (isFnRegex.test(fnToStr.call(fn))) {
          return true;
        }
        if (!hasToStringTag) {
          var str = toStr.call(fn);
          return str === "[object GeneratorFunction]";
        }
        if (!getProto) {
          return false;
        }
        if (typeof GeneratorFunction === "undefined") {
          var generatorFunc = getGeneratorFunc();
          GeneratorFunction = generatorFunc ? getProto(generatorFunc) : false;
        }
        return getProto(fn) === GeneratorFunction;
      }, "isGeneratorFunction");
    }
  });

  // node_modules/foreach/index.js
  var require_foreach = __commonJS({
    "node_modules/foreach/index.js"(exports, module) {
      init_buffer_shim();
      var hasOwn = Object.prototype.hasOwnProperty;
      var toString = Object.prototype.toString;
      module.exports = /* @__PURE__ */ __name(function forEach(obj, fn, ctx) {
        if (toString.call(fn) !== "[object Function]") {
          throw new TypeError("iterator must be a function");
        }
        var l = obj.length;
        if (l === +l) {
          for (var i = 0; i < l; i++) {
            fn.call(ctx, obj[i], i, obj);
          }
        } else {
          for (var k in obj) {
            if (hasOwn.call(obj, k)) {
              fn.call(ctx, obj[k], k, obj);
            }
          }
        }
      }, "forEach");
    }
  });

  // node_modules/available-typed-arrays/index.js
  var require_available_typed_arrays = __commonJS({
    "node_modules/available-typed-arrays/index.js"(exports, module) {
      "use strict";
      init_buffer_shim();
      var possibleNames = [
        "BigInt64Array",
        "BigUint64Array",
        "Float32Array",
        "Float64Array",
        "Int16Array",
        "Int32Array",
        "Int8Array",
        "Uint16Array",
        "Uint32Array",
        "Uint8Array",
        "Uint8ClampedArray"
      ];
      module.exports = /* @__PURE__ */ __name(function availableTypedArrays() {
        var out = [];
        for (var i = 0; i < possibleNames.length; i++) {
          if (typeof global[possibleNames[i]] === "function") {
            out[out.length] = possibleNames[i];
          }
        }
        return out;
      }, "availableTypedArrays");
    }
  });

  // node_modules/has-symbols/shams.js
  var require_shams3 = __commonJS({
    "node_modules/has-symbols/shams.js"(exports, module) {
      "use strict";
      init_buffer_shim();
      module.exports = /* @__PURE__ */ __name(function hasSymbols() {
        if (typeof Symbol !== "function" || typeof Object.getOwnPropertySymbols !== "function") {
          return false;
        }
        if (typeof Symbol.iterator === "symbol") {
          return true;
        }
        var obj = {};
        var sym = Symbol("test");
        var symObj = Object(sym);
        if (typeof sym === "string") {
          return false;
        }
        if (Object.prototype.toString.call(sym) !== "[object Symbol]") {
          return false;
        }
        if (Object.prototype.toString.call(symObj) !== "[object Symbol]") {
          return false;
        }
        var symVal = 42;
        obj[sym] = symVal;
        for (sym in obj) {
          return false;
        }
        if (typeof Object.keys === "function" && Object.keys(obj).length !== 0) {
          return false;
        }
        if (typeof Object.getOwnPropertyNames === "function" && Object.getOwnPropertyNames(obj).length !== 0) {
          return false;
        }
        var syms = Object.getOwnPropertySymbols(obj);
        if (syms.length !== 1 || syms[0] !== sym) {
          return false;
        }
        if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) {
          return false;
        }
        if (typeof Object.getOwnPropertyDescriptor === "function") {
          var descriptor = Object.getOwnPropertyDescriptor(obj, sym);
          if (descriptor.value !== symVal || descriptor.enumerable !== true) {
            return false;
          }
        }
        return true;
      }, "hasSymbols");
    }
  });

  // node_modules/has-symbols/index.js
  var require_has_symbols3 = __commonJS({
    "node_modules/has-symbols/index.js"(exports, module) {
      "use strict";
      init_buffer_shim();
      var origSymbol = typeof Symbol !== "undefined" && Symbol;
      var hasSymbolSham = require_shams3();
      module.exports = /* @__PURE__ */ __name(function hasNativeSymbols() {
        if (typeof origSymbol !== "function") {
          return false;
        }
        if (typeof Symbol !== "function") {
          return false;
        }
        if (typeof origSymbol("foo") !== "symbol") {
          return false;
        }
        if (typeof Symbol("bar") !== "symbol") {
          return false;
        }
        return hasSymbolSham();
      }, "hasNativeSymbols");
    }
  });

  // node_modules/get-intrinsic/index.js
  var require_get_intrinsic3 = __commonJS({
    "node_modules/get-intrinsic/index.js"(exports, module) {
      "use strict";
      init_buffer_shim();
      var undefined2;
      var $SyntaxError = SyntaxError;
      var $Function = Function;
      var $TypeError = TypeError;
      var getEvalledConstructor = /* @__PURE__ */ __name(function(expressionSyntax) {
        try {
          return $Function('"use strict"; return (' + expressionSyntax + ").constructor;")();
        } catch (e) {
        }
      }, "getEvalledConstructor");
      var $gOPD = Object.getOwnPropertyDescriptor;
      if ($gOPD) {
        try {
          $gOPD({}, "");
        } catch (e) {
          $gOPD = null;
        }
      }
      var throwTypeError = /* @__PURE__ */ __name(function() {
        throw new $TypeError();
      }, "throwTypeError");
      var ThrowTypeError = $gOPD ? function() {
        try {
          arguments.callee;
          return throwTypeError;
        } catch (calleeThrows) {
          try {
            return $gOPD(arguments, "callee").get;
          } catch (gOPDthrows) {
            return throwTypeError;
          }
        }
      }() : throwTypeError;
      var hasSymbols = require_has_symbols3()();
      var getProto = Object.getPrototypeOf || function(x) {
        return x.__proto__;
      };
      var needsEval = {};
      var TypedArray = typeof Uint8Array === "undefined" ? undefined2 : getProto(Uint8Array);
      var INTRINSICS = {
        "%AggregateError%": typeof AggregateError === "undefined" ? undefined2 : AggregateError,
        "%Array%": Array,
        "%ArrayBuffer%": typeof ArrayBuffer === "undefined" ? undefined2 : ArrayBuffer,
        "%ArrayIteratorPrototype%": hasSymbols ? getProto([][Symbol.iterator]()) : undefined2,
        "%AsyncFromSyncIteratorPrototype%": undefined2,
        "%AsyncFunction%": needsEval,
        "%AsyncGenerator%": needsEval,
        "%AsyncGeneratorFunction%": needsEval,
        "%AsyncIteratorPrototype%": needsEval,
        "%Atomics%": typeof Atomics === "undefined" ? undefined2 : Atomics,
        "%BigInt%": typeof BigInt === "undefined" ? undefined2 : BigInt,
        "%Boolean%": Boolean,
        "%DataView%": typeof DataView === "undefined" ? undefined2 : DataView,
        "%Date%": Date,
        "%decodeURI%": decodeURI,
        "%decodeURIComponent%": decodeURIComponent,
        "%encodeURI%": encodeURI,
        "%encodeURIComponent%": encodeURIComponent,
        "%Error%": Error,
        "%eval%": eval,
        "%EvalError%": EvalError,
        "%Float32Array%": typeof Float32Array === "undefined" ? undefined2 : Float32Array,
        "%Float64Array%": typeof Float64Array === "undefined" ? undefined2 : Float64Array,
        "%FinalizationRegistry%": typeof FinalizationRegistry === "undefined" ? undefined2 : FinalizationRegistry,
        "%Function%": $Function,
        "%GeneratorFunction%": needsEval,
        "%Int8Array%": typeof Int8Array === "undefined" ? undefined2 : Int8Array,
        "%Int16Array%": typeof Int16Array === "undefined" ? undefined2 : Int16Array,
        "%Int32Array%": typeof Int32Array === "undefined" ? undefined2 : Int32Array,
        "%isFinite%": isFinite,
        "%isNaN%": isNaN,
        "%IteratorPrototype%": hasSymbols ? getProto(getProto([][Symbol.iterator]())) : undefined2,
        "%JSON%": typeof JSON === "object" ? JSON : undefined2,
        "%Map%": typeof Map === "undefined" ? undefined2 : Map,
        "%MapIteratorPrototype%": typeof Map === "undefined" || !hasSymbols ? undefined2 : getProto((/* @__PURE__ */ new Map())[Symbol.iterator]()),
        "%Math%": Math,
        "%Number%": Number,
        "%Object%": Object,
        "%parseFloat%": parseFloat,
        "%parseInt%": parseInt,
        "%Promise%": typeof Promise === "undefined" ? undefined2 : Promise,
        "%Proxy%": typeof Proxy === "undefined" ? undefined2 : Proxy,
        "%RangeError%": RangeError,
        "%ReferenceError%": ReferenceError,
        "%Reflect%": typeof Reflect === "undefined" ? undefined2 : Reflect,
        "%RegExp%": RegExp,
        "%Set%": typeof Set === "undefined" ? undefined2 : Set,
        "%SetIteratorPrototype%": typeof Set === "undefined" || !hasSymbols ? undefined2 : getProto((/* @__PURE__ */ new Set())[Symbol.iterator]()),
        "%SharedArrayBuffer%": typeof SharedArrayBuffer === "undefined" ? undefined2 : SharedArrayBuffer,
        "%String%": String,
        "%StringIteratorPrototype%": hasSymbols ? getProto(""[Symbol.iterator]()) : undefined2,
        "%Symbol%": hasSymbols ? Symbol : undefined2,
        "%SyntaxError%": $SyntaxError,
        "%ThrowTypeError%": ThrowTypeError,
        "%TypedArray%": TypedArray,
        "%TypeError%": $TypeError,
        "%Uint8Array%": typeof Uint8Array === "undefined" ? undefined2 : Uint8Array,
        "%Uint8ClampedArray%": typeof Uint8ClampedArray === "undefined" ? undefined2 : Uint8ClampedArray,
        "%Uint16Array%": typeof Uint16Array === "undefined" ? undefined2 : Uint16Array,
        "%Uint32Array%": typeof Uint32Array === "undefined" ? undefined2 : Uint32Array,
        "%URIError%": URIError,
        "%WeakMap%": typeof WeakMap === "undefined" ? undefined2 : WeakMap,
        "%WeakRef%": typeof WeakRef === "undefined" ? undefined2 : WeakRef,
        "%WeakSet%": typeof WeakSet === "undefined" ? undefined2 : WeakSet
      };
      var doEval = /* @__PURE__ */ __name(function doEval2(name) {
        var value;
        if (name === "%AsyncFunction%") {
          value = getEvalledConstructor("async function () {}");
        } else if (name === "%GeneratorFunction%") {
          value = getEvalledConstructor("function* () {}");
        } else if (name === "%AsyncGeneratorFunction%") {
          value = getEvalledConstructor("async function* () {}");
        } else if (name === "%AsyncGenerator%") {
          var fn = doEval2("%AsyncGeneratorFunction%");
          if (fn) {
            value = fn.prototype;
          }
        } else if (name === "%AsyncIteratorPrototype%") {
          var gen = doEval2("%AsyncGenerator%");
          if (gen) {
            value = getProto(gen.prototype);
          }
        }
        INTRINSICS[name] = value;
        return value;
      }, "doEval");
      var LEGACY_ALIASES = {
        "%ArrayBufferPrototype%": ["ArrayBuffer", "prototype"],
        "%ArrayPrototype%": ["Array", "prototype"],
        "%ArrayProto_entries%": ["Array", "prototype", "entries"],
        "%ArrayProto_forEach%": ["Array", "prototype", "forEach"],
        "%ArrayProto_keys%": ["Array", "prototype", "keys"],
        "%ArrayProto_values%": ["Array", "prototype", "values"],
        "%AsyncFunctionPrototype%": ["AsyncFunction", "prototype"],
        "%AsyncGenerator%": ["AsyncGeneratorFunction", "prototype"],
        "%AsyncGeneratorPrototype%": ["AsyncGeneratorFunction", "prototype", "prototype"],
        "%BooleanPrototype%": ["Boolean", "prototype"],
        "%DataViewPrototype%": ["DataView", "prototype"],
        "%DatePrototype%": ["Date", "prototype"],
        "%ErrorPrototype%": ["Error", "prototype"],
        "%EvalErrorPrototype%": ["EvalError", "prototype"],
        "%Float32ArrayPrototype%": ["Float32Array", "prototype"],
        "%Float64ArrayPrototype%": ["Float64Array", "prototype"],
        "%FunctionPrototype%": ["Function", "prototype"],
        "%Generator%": ["GeneratorFunction", "prototype"],
        "%GeneratorPrototype%": ["GeneratorFunction", "prototype", "prototype"],
        "%Int8ArrayPrototype%": ["Int8Array", "prototype"],
        "%Int16ArrayPrototype%": ["Int16Array", "prototype"],
        "%Int32ArrayPrototype%": ["Int32Array", "prototype"],
        "%JSONParse%": ["JSON", "parse"],
        "%JSONStringify%": ["JSON", "stringify"],
        "%MapPrototype%": ["Map", "prototype"],
        "%NumberPrototype%": ["Number", "prototype"],
        "%ObjectPrototype%": ["Object", "prototype"],
        "%ObjProto_toString%": ["Object", "prototype", "toString"],
        "%ObjProto_valueOf%": ["Object", "prototype", "valueOf"],
        "%PromisePrototype%": ["Promise", "prototype"],
        "%PromiseProto_then%": ["Promise", "prototype", "then"],
        "%Promise_all%": ["Promise", "all"],
        "%Promise_reject%": ["Promise", "reject"],
        "%Promise_resolve%": ["Promise", "resolve"],
        "%RangeErrorPrototype%": ["RangeError", "prototype"],
        "%ReferenceErrorPrototype%": ["ReferenceError", "prototype"],
        "%RegExpPrototype%": ["RegExp", "prototype"],
        "%SetPrototype%": ["Set", "prototype"],
        "%SharedArrayBufferPrototype%": ["SharedArrayBuffer", "prototype"],
        "%StringPrototype%": ["String", "prototype"],
        "%SymbolPrototype%": ["Symbol", "prototype"],
        "%SyntaxErrorPrototype%": ["SyntaxError", "prototype"],
        "%TypedArrayPrototype%": ["TypedArray", "prototype"],
        "%TypeErrorPrototype%": ["TypeError", "prototype"],
        "%Uint8ArrayPrototype%": ["Uint8Array", "prototype"],
        "%Uint8ClampedArrayPrototype%": ["Uint8ClampedArray", "prototype"],
        "%Uint16ArrayPrototype%": ["Uint16Array", "prototype"],
        "%Uint32ArrayPrototype%": ["Uint32Array", "prototype"],
        "%URIErrorPrototype%": ["URIError", "prototype"],
        "%WeakMapPrototype%": ["WeakMap", "prototype"],
        "%WeakSetPrototype%": ["WeakSet", "prototype"]
      };
      var bind = require_function_bind();
      var hasOwn = require_src();
      var $concat = bind.call(Function.call, Array.prototype.concat);
      var $spliceApply = bind.call(Function.apply, Array.prototype.splice);
      var $replace = bind.call(Function.call, String.prototype.replace);
      var $strSlice = bind.call(Function.call, String.prototype.slice);
      var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
      var reEscapeChar = /\\(\\)?/g;
      var stringToPath = /* @__PURE__ */ __name(function stringToPath2(string) {
        var first = $strSlice(string, 0, 1);
        var last = $strSlice(string, -1);
        if (first === "%" && last !== "%") {
          throw new $SyntaxError("invalid intrinsic syntax, expected closing `%`");
        } else if (last === "%" && first !== "%") {
          throw new $SyntaxError("invalid intrinsic syntax, expected opening `%`");
        }
        var result = [];
        $replace(string, rePropName, function(match, number, quote, subString) {
          result[result.length] = quote ? $replace(subString, reEscapeChar, "$1") : number || match;
        });
        return result;
      }, "stringToPath");
      var getBaseIntrinsic = /* @__PURE__ */ __name(function getBaseIntrinsic2(name, allowMissing) {
        var intrinsicName = name;
        var alias;
        if (hasOwn(LEGACY_ALIASES, intrinsicName)) {
          alias = LEGACY_ALIASES[intrinsicName];
          intrinsicName = "%" + alias[0] + "%";
        }
        if (hasOwn(INTRINSICS, intrinsicName)) {
          var value = INTRINSICS[intrinsicName];
          if (value === needsEval) {
            value = doEval(intrinsicName);
          }
          if (typeof value === "undefined" && !allowMissing) {
            throw new $TypeError("intrinsic " + name + " exists, but is not available. Please file an issue!");
          }
          return {
            alias,
            name: intrinsicName,
            value
          };
        }
        throw new $SyntaxError("intrinsic " + name + " does not exist!");
      }, "getBaseIntrinsic");
      module.exports = /* @__PURE__ */ __name(function GetIntrinsic(name, allowMissing) {
        if (typeof name !== "string" || name.length === 0) {
          throw new $TypeError("intrinsic name must be a non-empty string");
        }
        if (arguments.length > 1 && typeof allowMissing !== "boolean") {
          throw new $TypeError('"allowMissing" argument must be a boolean');
        }
        var parts = stringToPath(name);
        var intrinsicBaseName = parts.length > 0 ? parts[0] : "";
        var intrinsic = getBaseIntrinsic("%" + intrinsicBaseName + "%", allowMissing);
        var intrinsicRealName = intrinsic.name;
        var value = intrinsic.value;
        var skipFurtherCaching = false;
        var alias = intrinsic.alias;
        if (alias) {
          intrinsicBaseName = alias[0];
          $spliceApply(parts, $concat([0, 1], alias));
        }
        for (var i = 1, isOwn = true; i < parts.length; i += 1) {
          var part = parts[i];
          var first = $strSlice(part, 0, 1);
          var last = $strSlice(part, -1);
          if ((first === '"' || first === "'" || first === "`" || (last === '"' || last === "'" || last === "`")) && first !== last) {
            throw new $SyntaxError("property names with quotes must have matching quotes");
          }
          if (part === "constructor" || !isOwn) {
            skipFurtherCaching = true;
          }
          intrinsicBaseName += "." + part;
          intrinsicRealName = "%" + intrinsicBaseName + "%";
          if (hasOwn(INTRINSICS, intrinsicRealName)) {
            value = INTRINSICS[intrinsicRealName];
          } else if (value != null) {
            if (!(part in value)) {
              if (!allowMissing) {
                throw new $TypeError("base intrinsic for " + name + " exists, but the property is not available.");
              }
              return void 0;
            }
            if ($gOPD && i + 1 >= parts.length) {
              var desc = $gOPD(value, part);
              isOwn = !!desc;
              if (isOwn && "get" in desc && !("originalValue" in desc.get)) {
                value = desc.get;
              } else {
                value = value[part];
              }
            } else {
              isOwn = hasOwn(value, part);
              value = value[part];
            }
            if (isOwn && !skipFurtherCaching) {
              INTRINSICS[intrinsicRealName] = value;
            }
          }
        }
        return value;
      }, "GetIntrinsic");
    }
  });

  // node_modules/es-abstract/helpers/getOwnPropertyDescriptor.js
  var require_getOwnPropertyDescriptor = __commonJS({
    "node_modules/es-abstract/helpers/getOwnPropertyDescriptor.js"(exports, module) {
      "use strict";
      init_buffer_shim();
      var GetIntrinsic = require_get_intrinsic3();
      var $gOPD = GetIntrinsic("%Object.getOwnPropertyDescriptor%");
      if ($gOPD) {
        try {
          $gOPD([], "length");
        } catch (e) {
          $gOPD = null;
        }
      }
      module.exports = $gOPD;
    }
  });

  // node_modules/is-typed-array/index.js
  var require_is_typed_array = __commonJS({
    "node_modules/is-typed-array/index.js"(exports, module) {
      "use strict";
      init_buffer_shim();
      var forEach = require_foreach();
      var availableTypedArrays = require_available_typed_arrays();
      var callBound = require_callBound();
      var $toString = callBound("Object.prototype.toString");
      var hasSymbols = require_has_symbols3()();
      var hasToStringTag = hasSymbols && typeof Symbol.toStringTag === "symbol";
      var typedArrays = availableTypedArrays();
      var $indexOf = callBound("Array.prototype.indexOf", true) || /* @__PURE__ */ __name(function indexOf(array, value) {
        for (var i = 0; i < array.length; i += 1) {
          if (array[i] === value) {
            return i;
          }
        }
        return -1;
      }, "indexOf");
      var $slice = callBound("String.prototype.slice");
      var toStrTags = {};
      var gOPD = require_getOwnPropertyDescriptor();
      var getPrototypeOf = Object.getPrototypeOf;
      if (hasToStringTag && gOPD && getPrototypeOf) {
        forEach(typedArrays, function(typedArray) {
          var arr = new global[typedArray]();
          if (!(Symbol.toStringTag in arr)) {
            throw new EvalError("this engine has support for Symbol.toStringTag, but " + typedArray + " does not have the property! Please report this.");
          }
          var proto = getPrototypeOf(arr);
          var descriptor = gOPD(proto, Symbol.toStringTag);
          if (!descriptor) {
            var superProto = getPrototypeOf(proto);
            descriptor = gOPD(superProto, Symbol.toStringTag);
          }
          toStrTags[typedArray] = descriptor.get;
        });
      }
      var tryTypedArrays = /* @__PURE__ */ __name(function tryAllTypedArrays(value) {
        var anyTrue = false;
        forEach(toStrTags, function(getter, typedArray) {
          if (!anyTrue) {
            try {
              anyTrue = getter.call(value) === typedArray;
            } catch (e) {
            }
          }
        });
        return anyTrue;
      }, "tryAllTypedArrays");
      module.exports = /* @__PURE__ */ __name(function isTypedArray(value) {
        if (!value || typeof value !== "object") {
          return false;
        }
        if (!hasToStringTag) {
          var tag = $slice($toString(value), 8, -1);
          return $indexOf(typedArrays, tag) > -1;
        }
        if (!gOPD) {
          return false;
        }
        return tryTypedArrays(value);
      }, "isTypedArray");
    }
  });

  // node_modules/which-typed-array/index.js
  var require_which_typed_array = __commonJS({
    "node_modules/which-typed-array/index.js"(exports, module) {
      "use strict";
      init_buffer_shim();
      var forEach = require_foreach();
      var availableTypedArrays = require_available_typed_arrays();
      var callBound = require_callBound();
      var $toString = callBound("Object.prototype.toString");
      var hasSymbols = require_has_symbols3()();
      var hasToStringTag = hasSymbols && typeof Symbol.toStringTag === "symbol";
      var typedArrays = availableTypedArrays();
      var $slice = callBound("String.prototype.slice");
      var toStrTags = {};
      var gOPD = require_getOwnPropertyDescriptor();
      var getPrototypeOf = Object.getPrototypeOf;
      if (hasToStringTag && gOPD && getPrototypeOf) {
        forEach(typedArrays, function(typedArray) {
          if (typeof global[typedArray] === "function") {
            var arr = new global[typedArray]();
            if (!(Symbol.toStringTag in arr)) {
              throw new EvalError("this engine has support for Symbol.toStringTag, but " + typedArray + " does not have the property! Please report this.");
            }
            var proto = getPrototypeOf(arr);
            var descriptor = gOPD(proto, Symbol.toStringTag);
            if (!descriptor) {
              var superProto = getPrototypeOf(proto);
              descriptor = gOPD(superProto, Symbol.toStringTag);
            }
            toStrTags[typedArray] = descriptor.get;
          }
        });
      }
      var tryTypedArrays = /* @__PURE__ */ __name(function tryAllTypedArrays(value) {
        var foundName = false;
        forEach(toStrTags, function(getter, typedArray) {
          if (!foundName) {
            try {
              var name = getter.call(value);
              if (name === typedArray) {
                foundName = name;
              }
            } catch (e) {
            }
          }
        });
        return foundName;
      }, "tryAllTypedArrays");
      var isTypedArray = require_is_typed_array();
      module.exports = /* @__PURE__ */ __name(function whichTypedArray(value) {
        if (!isTypedArray(value)) {
          return false;
        }
        if (!hasToStringTag) {
          return $slice($toString(value), 8, -1);
        }
        return tryTypedArrays(value);
      }, "whichTypedArray");
    }
  });

  // node_modules/util/support/types.js
  var require_types = __commonJS({
    "node_modules/util/support/types.js"(exports) {
      "use strict";
      init_buffer_shim();
      var isArgumentsObject = require_is_arguments();
      var isGeneratorFunction = require_is_generator_function();
      var whichTypedArray = require_which_typed_array();
      var isTypedArray = require_is_typed_array();
      function uncurryThis(f) {
        return f.call.bind(f);
      }
      __name(uncurryThis, "uncurryThis");
      var BigIntSupported = typeof BigInt !== "undefined";
      var SymbolSupported = typeof Symbol !== "undefined";
      var ObjectToString = uncurryThis(Object.prototype.toString);
      var numberValue = uncurryThis(Number.prototype.valueOf);
      var stringValue = uncurryThis(String.prototype.valueOf);
      var booleanValue = uncurryThis(Boolean.prototype.valueOf);
      if (BigIntSupported) {
        bigIntValue = uncurryThis(BigInt.prototype.valueOf);
      }
      var bigIntValue;
      if (SymbolSupported) {
        symbolValue = uncurryThis(Symbol.prototype.valueOf);
      }
      var symbolValue;
      function checkBoxedPrimitive(value, prototypeValueOf) {
        if (typeof value !== "object") {
          return false;
        }
        try {
          prototypeValueOf(value);
          return true;
        } catch (e) {
          return false;
        }
      }
      __name(checkBoxedPrimitive, "checkBoxedPrimitive");
      exports.isArgumentsObject = isArgumentsObject;
      exports.isGeneratorFunction = isGeneratorFunction;
      exports.isTypedArray = isTypedArray;
      function isPromise2(input) {
        return typeof Promise !== "undefined" && input instanceof Promise || input !== null && typeof input === "object" && typeof input.then === "function" && typeof input.catch === "function";
      }
      __name(isPromise2, "isPromise");
      exports.isPromise = isPromise2;
      function isArrayBufferView(value) {
        if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) {
          return ArrayBuffer.isView(value);
        }
        return isTypedArray(value) || isDataView(value);
      }
      __name(isArrayBufferView, "isArrayBufferView");
      exports.isArrayBufferView = isArrayBufferView;
      function isUint8Array(value) {
        return whichTypedArray(value) === "Uint8Array";
      }
      __name(isUint8Array, "isUint8Array");
      exports.isUint8Array = isUint8Array;
      function isUint8ClampedArray(value) {
        return whichTypedArray(value) === "Uint8ClampedArray";
      }
      __name(isUint8ClampedArray, "isUint8ClampedArray");
      exports.isUint8ClampedArray = isUint8ClampedArray;
      function isUint16Array(value) {
        return whichTypedArray(value) === "Uint16Array";
      }
      __name(isUint16Array, "isUint16Array");
      exports.isUint16Array = isUint16Array;
      function isUint32Array(value) {
        return whichTypedArray(value) === "Uint32Array";
      }
      __name(isUint32Array, "isUint32Array");
      exports.isUint32Array = isUint32Array;
      function isInt8Array(value) {
        return whichTypedArray(value) === "Int8Array";
      }
      __name(isInt8Array, "isInt8Array");
      exports.isInt8Array = isInt8Array;
      function isInt16Array(value) {
        return whichTypedArray(value) === "Int16Array";
      }
      __name(isInt16Array, "isInt16Array");
      exports.isInt16Array = isInt16Array;
      function isInt32Array(value) {
        return whichTypedArray(value) === "Int32Array";
      }
      __name(isInt32Array, "isInt32Array");
      exports.isInt32Array = isInt32Array;
      function isFloat32Array(value) {
        return whichTypedArray(value) === "Float32Array";
      }
      __name(isFloat32Array, "isFloat32Array");
      exports.isFloat32Array = isFloat32Array;
      function isFloat64Array(value) {
        return whichTypedArray(value) === "Float64Array";
      }
      __name(isFloat64Array, "isFloat64Array");
      exports.isFloat64Array = isFloat64Array;
      function isBigInt64Array(value) {
        return whichTypedArray(value) === "BigInt64Array";
      }
      __name(isBigInt64Array, "isBigInt64Array");
      exports.isBigInt64Array = isBigInt64Array;
      function isBigUint64Array(value) {
        return whichTypedArray(value) === "BigUint64Array";
      }
      __name(isBigUint64Array, "isBigUint64Array");
      exports.isBigUint64Array = isBigUint64Array;
      function isMapToString(value) {
        return ObjectToString(value) === "[object Map]";
      }
      __name(isMapToString, "isMapToString");
      isMapToString.working = typeof Map !== "undefined" && isMapToString(/* @__PURE__ */ new Map());
      function isMap(value) {
        if (typeof Map === "undefined") {
          return false;
        }
        return isMapToString.working ? isMapToString(value) : value instanceof Map;
      }
      __name(isMap, "isMap");
      exports.isMap = isMap;
      function isSetToString(value) {
        return ObjectToString(value) === "[object Set]";
      }
      __name(isSetToString, "isSetToString");
      isSetToString.working = typeof Set !== "undefined" && isSetToString(/* @__PURE__ */ new Set());
      function isSet(value) {
        if (typeof Set === "undefined") {
          return false;
        }
        return isSetToString.working ? isSetToString(value) : value instanceof Set;
      }
      __name(isSet, "isSet");
      exports.isSet = isSet;
      function isWeakMapToString(value) {
        return ObjectToString(value) === "[object WeakMap]";
      }
      __name(isWeakMapToString, "isWeakMapToString");
      isWeakMapToString.working = typeof WeakMap !== "undefined" && isWeakMapToString(/* @__PURE__ */ new WeakMap());
      function isWeakMap(value) {
        if (typeof WeakMap === "undefined") {
          return false;
        }
        return isWeakMapToString.working ? isWeakMapToString(value) : value instanceof WeakMap;
      }
      __name(isWeakMap, "isWeakMap");
      exports.isWeakMap = isWeakMap;
      function isWeakSetToString(value) {
        return ObjectToString(value) === "[object WeakSet]";
      }
      __name(isWeakSetToString, "isWeakSetToString");
      isWeakSetToString.working = typeof WeakSet !== "undefined" && isWeakSetToString(/* @__PURE__ */ new WeakSet());
      function isWeakSet(value) {
        return isWeakSetToString(value);
      }
      __name(isWeakSet, "isWeakSet");
      exports.isWeakSet = isWeakSet;
      function isArrayBufferToString(value) {
        return ObjectToString(value) === "[object ArrayBuffer]";
      }
      __name(isArrayBufferToString, "isArrayBufferToString");
      isArrayBufferToString.working = typeof ArrayBuffer !== "undefined" && isArrayBufferToString(new ArrayBuffer());
      function isArrayBuffer(value) {
        if (typeof ArrayBuffer === "undefined") {
          return false;
        }
        return isArrayBufferToString.working ? isArrayBufferToString(value) : value instanceof ArrayBuffer;
      }
      __name(isArrayBuffer, "isArrayBuffer");
      exports.isArrayBuffer = isArrayBuffer;
      function isDataViewToString(value) {
        return ObjectToString(value) === "[object DataView]";
      }
      __name(isDataViewToString, "isDataViewToString");
      isDataViewToString.working = typeof ArrayBuffer !== "undefined" && typeof DataView !== "undefined" && isDataViewToString(new DataView(new ArrayBuffer(1), 0, 1));
      function isDataView(value) {
        if (typeof DataView === "undefined") {
          return false;
        }
        return isDataViewToString.working ? isDataViewToString(value) : value instanceof DataView;
      }
      __name(isDataView, "isDataView");
      exports.isDataView = isDataView;
      var SharedArrayBufferCopy = typeof SharedArrayBuffer !== "undefined" ? SharedArrayBuffer : void 0;
      function isSharedArrayBufferToString(value) {
        return ObjectToString(value) === "[object SharedArrayBuffer]";
      }
      __name(isSharedArrayBufferToString, "isSharedArrayBufferToString");
      function isSharedArrayBuffer(value) {
        if (typeof SharedArrayBufferCopy === "undefined") {
          return false;
        }
        if (typeof isSharedArrayBufferToString.working === "undefined") {
          isSharedArrayBufferToString.working = isSharedArrayBufferToString(new SharedArrayBufferCopy());
        }
        return isSharedArrayBufferToString.working ? isSharedArrayBufferToString(value) : value instanceof SharedArrayBufferCopy;
      }
      __name(isSharedArrayBuffer, "isSharedArrayBuffer");
      exports.isSharedArrayBuffer = isSharedArrayBuffer;
      function isAsyncFunction(value) {
        return ObjectToString(value) === "[object AsyncFunction]";
      }
      __name(isAsyncFunction, "isAsyncFunction");
      exports.isAsyncFunction = isAsyncFunction;
      function isMapIterator(value) {
        return ObjectToString(value) === "[object Map Iterator]";
      }
      __name(isMapIterator, "isMapIterator");
      exports.isMapIterator = isMapIterator;
      function isSetIterator(value) {
        return ObjectToString(value) === "[object Set Iterator]";
      }
      __name(isSetIterator, "isSetIterator");
      exports.isSetIterator = isSetIterator;
      function isGeneratorObject(value) {
        return ObjectToString(value) === "[object Generator]";
      }
      __name(isGeneratorObject, "isGeneratorObject");
      exports.isGeneratorObject = isGeneratorObject;
      function isWebAssemblyCompiledModule(value) {
        return ObjectToString(value) === "[object WebAssembly.Module]";
      }
      __name(isWebAssemblyCompiledModule, "isWebAssemblyCompiledModule");
      exports.isWebAssemblyCompiledModule = isWebAssemblyCompiledModule;
      function isNumberObject(value) {
        return checkBoxedPrimitive(value, numberValue);
      }
      __name(isNumberObject, "isNumberObject");
      exports.isNumberObject = isNumberObject;
      function isStringObject(value) {
        return checkBoxedPrimitive(value, stringValue);
      }
      __name(isStringObject, "isStringObject");
      exports.isStringObject = isStringObject;
      function isBooleanObject(value) {
        return checkBoxedPrimitive(value, booleanValue);
      }
      __name(isBooleanObject, "isBooleanObject");
      exports.isBooleanObject = isBooleanObject;
      function isBigIntObject(value) {
        return BigIntSupported && checkBoxedPrimitive(value, bigIntValue);
      }
      __name(isBigIntObject, "isBigIntObject");
      exports.isBigIntObject = isBigIntObject;
      function isSymbolObject(value) {
        return SymbolSupported && checkBoxedPrimitive(value, symbolValue);
      }
      __name(isSymbolObject, "isSymbolObject");
      exports.isSymbolObject = isSymbolObject;
      function isBoxedPrimitive(value) {
        return isNumberObject(value) || isStringObject(value) || isBooleanObject(value) || isBigIntObject(value) || isSymbolObject(value);
      }
      __name(isBoxedPrimitive, "isBoxedPrimitive");
      exports.isBoxedPrimitive = isBoxedPrimitive;
      function isAnyArrayBuffer(value) {
        return typeof Uint8Array !== "undefined" && (isArrayBuffer(value) || isSharedArrayBuffer(value));
      }
      __name(isAnyArrayBuffer, "isAnyArrayBuffer");
      exports.isAnyArrayBuffer = isAnyArrayBuffer;
      ["isProxy", "isExternal", "isModuleNamespaceObject"].forEach(function(method) {
        Object.defineProperty(exports, method, {
          enumerable: false,
          value: function() {
            throw new Error(method + " is not supported in userland");
          }
        });
      });
    }
  });

  // node_modules/util/support/isBufferBrowser.js
  var require_isBufferBrowser = __commonJS({
    "node_modules/util/support/isBufferBrowser.js"(exports, module) {
      init_buffer_shim();
      module.exports = /* @__PURE__ */ __name(function isBuffer(arg) {
        return arg && typeof arg === "object" && typeof arg.copy === "function" && typeof arg.fill === "function" && typeof arg.readUInt8 === "function";
      }, "isBuffer");
    }
  });

  // node_modules/inherits/inherits_browser.js
  var require_inherits_browser = __commonJS({
    "node_modules/inherits/inherits_browser.js"(exports, module) {
      init_buffer_shim();
      if (typeof Object.create === "function") {
        module.exports = /* @__PURE__ */ __name(function inherits(ctor, superCtor) {
          if (superCtor) {
            ctor.super_ = superCtor;
            ctor.prototype = Object.create(superCtor.prototype, {
              constructor: {
                value: ctor,
                enumerable: false,
                writable: true,
                configurable: true
              }
            });
          }
        }, "inherits");
      } else {
        module.exports = /* @__PURE__ */ __name(function inherits(ctor, superCtor) {
          if (superCtor) {
            ctor.super_ = superCtor;
            var TempCtor = /* @__PURE__ */ __name(function() {
            }, "TempCtor");
            TempCtor.prototype = superCtor.prototype;
            ctor.prototype = new TempCtor();
            ctor.prototype.constructor = ctor;
          }
        }, "inherits");
      }
    }
  });

  // node_modules/util/util.js
  var require_util2 = __commonJS({
    "node_modules/util/util.js"(exports) {
      init_buffer_shim();
      var getOwnPropertyDescriptors = Object.getOwnPropertyDescriptors || /* @__PURE__ */ __name(function getOwnPropertyDescriptors2(obj) {
        var keys = Object.keys(obj);
        var descriptors = {};
        for (var i = 0; i < keys.length; i++) {
          descriptors[keys[i]] = Object.getOwnPropertyDescriptor(obj, keys[i]);
        }
        return descriptors;
      }, "getOwnPropertyDescriptors");
      var formatRegExp = /%[sdj%]/g;
      exports.format = function(f) {
        if (!isString(f)) {
          var objects = [];
          for (var i = 0; i < arguments.length; i++) {
            objects.push(inspect(arguments[i]));
          }
          return objects.join(" ");
        }
        var i = 1;
        var args = arguments;
        var len = args.length;
        var str = String(f).replace(formatRegExp, function(x2) {
          if (x2 === "%%")
            return "%";
          if (i >= len)
            return x2;
          switch (x2) {
            case "%s":
              return String(args[i++]);
            case "%d":
              return Number(args[i++]);
            case "%j":
              try {
                return JSON.stringify(args[i++]);
              } catch (_) {
                return "[Circular]";
              }
            default:
              return x2;
          }
        });
        for (var x = args[i]; i < len; x = args[++i]) {
          if (isNull(x) || !isObject2(x)) {
            str += " " + x;
          } else {
            str += " " + inspect(x);
          }
        }
        return str;
      };
      exports.deprecate = function(fn, msg) {
        if (typeof process !== "undefined" && process.noDeprecation === true) {
          return fn;
        }
        if (typeof process === "undefined") {
          return function() {
            return exports.deprecate(fn, msg).apply(this, arguments);
          };
        }
        var warned = false;
        function deprecated() {
          if (!warned) {
            if (process.throwDeprecation) {
              throw new Error(msg);
            } else if (process.traceDeprecation) {
              console.trace(msg);
            } else {
              console.error(msg);
            }
            warned = true;
          }
          return fn.apply(this, arguments);
        }
        __name(deprecated, "deprecated");
        return deprecated;
      };
      var debugs = {};
      var debugEnvRegex = /^$/;
      if (false) {
        debugEnv = false;
        debugEnv = debugEnv.replace(/[|\\{}()[\]^$+?.]/g, "\\$&").replace(/\*/g, ".*").replace(/,/g, "$|^").toUpperCase();
        debugEnvRegex = new RegExp("^" + debugEnv + "$", "i");
      }
      var debugEnv;
      exports.debuglog = function(set) {
        set = set.toUpperCase();
        if (!debugs[set]) {
          if (debugEnvRegex.test(set)) {
            var pid = process.pid;
            debugs[set] = function() {
              var msg = exports.format.apply(exports, arguments);
              console.error("%s %d: %s", set, pid, msg);
            };
          } else {
            debugs[set] = function() {
            };
          }
        }
        return debugs[set];
      };
      function inspect(obj, opts) {
        var ctx = {
          seen: [],
          stylize: stylizeNoColor
        };
        if (arguments.length >= 3)
          ctx.depth = arguments[2];
        if (arguments.length >= 4)
          ctx.colors = arguments[3];
        if (isBoolean(opts)) {
          ctx.showHidden = opts;
        } else if (opts) {
          exports._extend(ctx, opts);
        }
        if (isUndefined(ctx.showHidden))
          ctx.showHidden = false;
        if (isUndefined(ctx.depth))
          ctx.depth = 2;
        if (isUndefined(ctx.colors))
          ctx.colors = false;
        if (isUndefined(ctx.customInspect))
          ctx.customInspect = true;
        if (ctx.colors)
          ctx.stylize = stylizeWithColor;
        return formatValue(ctx, obj, ctx.depth);
      }
      __name(inspect, "inspect");
      exports.inspect = inspect;
      inspect.colors = {
        "bold": [1, 22],
        "italic": [3, 23],
        "underline": [4, 24],
        "inverse": [7, 27],
        "white": [37, 39],
        "grey": [90, 39],
        "black": [30, 39],
        "blue": [34, 39],
        "cyan": [36, 39],
        "green": [32, 39],
        "magenta": [35, 39],
        "red": [31, 39],
        "yellow": [33, 39]
      };
      inspect.styles = {
        "special": "cyan",
        "number": "yellow",
        "boolean": "yellow",
        "undefined": "grey",
        "null": "bold",
        "string": "green",
        "date": "magenta",
        "regexp": "red"
      };
      function stylizeWithColor(str, styleType) {
        var style = inspect.styles[styleType];
        if (style) {
          return "\x1B[" + inspect.colors[style][0] + "m" + str + "\x1B[" + inspect.colors[style][1] + "m";
        } else {
          return str;
        }
      }
      __name(stylizeWithColor, "stylizeWithColor");
      function stylizeNoColor(str, styleType) {
        return str;
      }
      __name(stylizeNoColor, "stylizeNoColor");
      function arrayToHash(array) {
        var hash = {};
        array.forEach(function(val, idx) {
          hash[val] = true;
        });
        return hash;
      }
      __name(arrayToHash, "arrayToHash");
      function formatValue(ctx, value, recurseTimes) {
        if (ctx.customInspect && value && isFunction(value.inspect) && value.inspect !== exports.inspect && !(value.constructor && value.constructor.prototype === value)) {
          var ret = value.inspect(recurseTimes, ctx);
          if (!isString(ret)) {
            ret = formatValue(ctx, ret, recurseTimes);
          }
          return ret;
        }
        var primitive = formatPrimitive(ctx, value);
        if (primitive) {
          return primitive;
        }
        var keys = Object.keys(value);
        var visibleKeys = arrayToHash(keys);
        if (ctx.showHidden) {
          keys = Object.getOwnPropertyNames(value);
        }
        if (isError(value) && (keys.indexOf("message") >= 0 || keys.indexOf("description") >= 0)) {
          return formatError(value);
        }
        if (keys.length === 0) {
          if (isFunction(value)) {
            var name = value.name ? ": " + value.name : "";
            return ctx.stylize("[Function" + name + "]", "special");
          }
          if (isRegExp(value)) {
            return ctx.stylize(RegExp.prototype.toString.call(value), "regexp");
          }
          if (isDate(value)) {
            return ctx.stylize(Date.prototype.toString.call(value), "date");
          }
          if (isError(value)) {
            return formatError(value);
          }
        }
        var base = "", array = false, braces = ["{", "}"];
        if (isArray2(value)) {
          array = true;
          braces = ["[", "]"];
        }
        if (isFunction(value)) {
          var n = value.name ? ": " + value.name : "";
          base = " [Function" + n + "]";
        }
        if (isRegExp(value)) {
          base = " " + RegExp.prototype.toString.call(value);
        }
        if (isDate(value)) {
          base = " " + Date.prototype.toUTCString.call(value);
        }
        if (isError(value)) {
          base = " " + formatError(value);
        }
        if (keys.length === 0 && (!array || value.length == 0)) {
          return braces[0] + base + braces[1];
        }
        if (recurseTimes < 0) {
          if (isRegExp(value)) {
            return ctx.stylize(RegExp.prototype.toString.call(value), "regexp");
          } else {
            return ctx.stylize("[Object]", "special");
          }
        }
        ctx.seen.push(value);
        var output;
        if (array) {
          output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
        } else {
          output = keys.map(function(key) {
            return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
          });
        }
        ctx.seen.pop();
        return reduceToSingleString(output, base, braces);
      }
      __name(formatValue, "formatValue");
      function formatPrimitive(ctx, value) {
        if (isUndefined(value))
          return ctx.stylize("undefined", "undefined");
        if (isString(value)) {
          var simple = "'" + JSON.stringify(value).replace(/^"|"$/g, "").replace(/'/g, "\\'").replace(/\\"/g, '"') + "'";
          return ctx.stylize(simple, "string");
        }
        if (isNumber(value))
          return ctx.stylize("" + value, "number");
        if (isBoolean(value))
          return ctx.stylize("" + value, "boolean");
        if (isNull(value))
          return ctx.stylize("null", "null");
      }
      __name(formatPrimitive, "formatPrimitive");
      function formatError(value) {
        return "[" + Error.prototype.toString.call(value) + "]";
      }
      __name(formatError, "formatError");
      function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
        var output = [];
        for (var i = 0, l = value.length; i < l; ++i) {
          if (hasOwnProperty(value, String(i))) {
            output.push(formatProperty(
              ctx,
              value,
              recurseTimes,
              visibleKeys,
              String(i),
              true
            ));
          } else {
            output.push("");
          }
        }
        keys.forEach(function(key) {
          if (!key.match(/^\d+$/)) {
            output.push(formatProperty(
              ctx,
              value,
              recurseTimes,
              visibleKeys,
              key,
              true
            ));
          }
        });
        return output;
      }
      __name(formatArray, "formatArray");
      function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
        var name, str, desc;
        desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
        if (desc.get) {
          if (desc.set) {
            str = ctx.stylize("[Getter/Setter]", "special");
          } else {
            str = ctx.stylize("[Getter]", "special");
          }
        } else {
          if (desc.set) {
            str = ctx.stylize("[Setter]", "special");
          }
        }
        if (!hasOwnProperty(visibleKeys, key)) {
          name = "[" + key + "]";
        }
        if (!str) {
          if (ctx.seen.indexOf(desc.value) < 0) {
            if (isNull(recurseTimes)) {
              str = formatValue(ctx, desc.value, null);
            } else {
              str = formatValue(ctx, desc.value, recurseTimes - 1);
            }
            if (str.indexOf("\n") > -1) {
              if (array) {
                str = str.split("\n").map(function(line) {
                  return "  " + line;
                }).join("\n").substr(2);
              } else {
                str = "\n" + str.split("\n").map(function(line) {
                  return "   " + line;
                }).join("\n");
              }
            }
          } else {
            str = ctx.stylize("[Circular]", "special");
          }
        }
        if (isUndefined(name)) {
          if (array && key.match(/^\d+$/)) {
            return str;
          }
          name = JSON.stringify("" + key);
          if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
            name = name.substr(1, name.length - 2);
            name = ctx.stylize(name, "name");
          } else {
            name = name.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'");
            name = ctx.stylize(name, "string");
          }
        }
        return name + ": " + str;
      }
      __name(formatProperty, "formatProperty");
      function reduceToSingleString(output, base, braces) {
        var numLinesEst = 0;
        var length = output.reduce(function(prev, cur) {
          numLinesEst++;
          if (cur.indexOf("\n") >= 0)
            numLinesEst++;
          return prev + cur.replace(/\u001b\[\d\d?m/g, "").length + 1;
        }, 0);
        if (length > 60) {
          return braces[0] + (base === "" ? "" : base + "\n ") + " " + output.join(",\n  ") + " " + braces[1];
        }
        return braces[0] + base + " " + output.join(", ") + " " + braces[1];
      }
      __name(reduceToSingleString, "reduceToSingleString");
      exports.types = require_types();
      function isArray2(ar) {
        return Array.isArray(ar);
      }
      __name(isArray2, "isArray");
      exports.isArray = isArray2;
      function isBoolean(arg) {
        return typeof arg === "boolean";
      }
      __name(isBoolean, "isBoolean");
      exports.isBoolean = isBoolean;
      function isNull(arg) {
        return arg === null;
      }
      __name(isNull, "isNull");
      exports.isNull = isNull;
      function isNullOrUndefined(arg) {
        return arg == null;
      }
      __name(isNullOrUndefined, "isNullOrUndefined");
      exports.isNullOrUndefined = isNullOrUndefined;
      function isNumber(arg) {
        return typeof arg === "number";
      }
      __name(isNumber, "isNumber");
      exports.isNumber = isNumber;
      function isString(arg) {
        return typeof arg === "string";
      }
      __name(isString, "isString");
      exports.isString = isString;
      function isSymbol(arg) {
        return typeof arg === "symbol";
      }
      __name(isSymbol, "isSymbol");
      exports.isSymbol = isSymbol;
      function isUndefined(arg) {
        return arg === void 0;
      }
      __name(isUndefined, "isUndefined");
      exports.isUndefined = isUndefined;
      function isRegExp(re) {
        return isObject2(re) && objectToString(re) === "[object RegExp]";
      }
      __name(isRegExp, "isRegExp");
      exports.isRegExp = isRegExp;
      exports.types.isRegExp = isRegExp;
      function isObject2(arg) {
        return typeof arg === "object" && arg !== null;
      }
      __name(isObject2, "isObject");
      exports.isObject = isObject2;
      function isDate(d) {
        return isObject2(d) && objectToString(d) === "[object Date]";
      }
      __name(isDate, "isDate");
      exports.isDate = isDate;
      exports.types.isDate = isDate;
      function isError(e) {
        return isObject2(e) && (objectToString(e) === "[object Error]" || e instanceof Error);
      }
      __name(isError, "isError");
      exports.isError = isError;
      exports.types.isNativeError = isError;
      function isFunction(arg) {
        return typeof arg === "function";
      }
      __name(isFunction, "isFunction");
      exports.isFunction = isFunction;
      function isPrimitive(arg) {
        return arg === null || typeof arg === "boolean" || typeof arg === "number" || typeof arg === "string" || typeof arg === "symbol" || typeof arg === "undefined";
      }
      __name(isPrimitive, "isPrimitive");
      exports.isPrimitive = isPrimitive;
      exports.isBuffer = require_isBufferBrowser();
      function objectToString(o) {
        return Object.prototype.toString.call(o);
      }
      __name(objectToString, "objectToString");
      function pad(n) {
        return n < 10 ? "0" + n.toString(10) : n.toString(10);
      }
      __name(pad, "pad");
      var months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
      ];
      function timestamp() {
        var d = new Date();
        var time = [
          pad(d.getHours()),
          pad(d.getMinutes()),
          pad(d.getSeconds())
        ].join(":");
        return [d.getDate(), months[d.getMonth()], time].join(" ");
      }
      __name(timestamp, "timestamp");
      exports.log = function() {
        console.log("%s - %s", timestamp(), exports.format.apply(exports, arguments));
      };
      exports.inherits = require_inherits_browser();
      exports._extend = function(origin, add) {
        if (!add || !isObject2(add))
          return origin;
        var keys = Object.keys(add);
        var i = keys.length;
        while (i--) {
          origin[keys[i]] = add[keys[i]];
        }
        return origin;
      };
      function hasOwnProperty(obj, prop) {
        return Object.prototype.hasOwnProperty.call(obj, prop);
      }
      __name(hasOwnProperty, "hasOwnProperty");
      var kCustomPromisifiedSymbol = typeof Symbol !== "undefined" ? Symbol("util.promisify.custom") : void 0;
      exports.promisify = /* @__PURE__ */ __name(function promisify(original) {
        if (typeof original !== "function")
          throw new TypeError('The "original" argument must be of type Function');
        if (kCustomPromisifiedSymbol && original[kCustomPromisifiedSymbol]) {
          var fn = original[kCustomPromisifiedSymbol];
          if (typeof fn !== "function") {
            throw new TypeError('The "util.promisify.custom" argument must be of type Function');
          }
          Object.defineProperty(fn, kCustomPromisifiedSymbol, {
            value: fn,
            enumerable: false,
            writable: false,
            configurable: true
          });
          return fn;
        }
        function fn() {
          var promiseResolve, promiseReject;
          var promise = new Promise(function(resolve, reject) {
            promiseResolve = resolve;
            promiseReject = reject;
          });
          var args = [];
          for (var i = 0; i < arguments.length; i++) {
            args.push(arguments[i]);
          }
          args.push(function(err, value) {
            if (err) {
              promiseReject(err);
            } else {
              promiseResolve(value);
            }
          });
          try {
            original.apply(this, args);
          } catch (err) {
            promiseReject(err);
          }
          return promise;
        }
        __name(fn, "fn");
        Object.setPrototypeOf(fn, Object.getPrototypeOf(original));
        if (kCustomPromisifiedSymbol)
          Object.defineProperty(fn, kCustomPromisifiedSymbol, {
            value: fn,
            enumerable: false,
            writable: false,
            configurable: true
          });
        return Object.defineProperties(
          fn,
          getOwnPropertyDescriptors(original)
        );
      }, "promisify");
      exports.promisify.custom = kCustomPromisifiedSymbol;
      function callbackifyOnRejected(reason, cb) {
        if (!reason) {
          var newReason = new Error("Promise was rejected with a falsy value");
          newReason.reason = reason;
          reason = newReason;
        }
        return cb(reason);
      }
      __name(callbackifyOnRejected, "callbackifyOnRejected");
      function callbackify(original) {
        if (typeof original !== "function") {
          throw new TypeError('The "original" argument must be of type Function');
        }
        function callbackified() {
          var args = [];
          for (var i = 0; i < arguments.length; i++) {
            args.push(arguments[i]);
          }
          var maybeCb = args.pop();
          if (typeof maybeCb !== "function") {
            throw new TypeError("The last argument must be of type Function");
          }
          var self2 = this;
          var cb = /* @__PURE__ */ __name(function() {
            return maybeCb.apply(self2, arguments);
          }, "cb");
          original.apply(this, args).then(
            function(ret) {
              process.nextTick(cb.bind(null, null, ret));
            },
            function(rej) {
              process.nextTick(callbackifyOnRejected.bind(null, rej, cb));
            }
          );
        }
        __name(callbackified, "callbackified");
        Object.setPrototypeOf(callbackified, Object.getPrototypeOf(original));
        Object.defineProperties(
          callbackified,
          getOwnPropertyDescriptors(original)
        );
        return callbackified;
      }
      __name(callbackify, "callbackify");
      exports.callbackify = callbackify;
    }
  });

  // runtime/thunk/thunk.ts
  var thunk_exports = {};
  __export(thunk_exports, {
    ensureSwitchUnreachable: () => ensureSwitchUnreachable,
    findAndExecutePackFunction: () => findAndExecutePackFunction,
    handleError: () => handleError,
    handleErrorAsync: () => handleErrorAsync,
    handleFetcherStatusError: () => handleFetcherStatusError,
    marshalValue: () => marshalValue,
    marshalValueToString: () => marshalValueToString,
    marshalValuesForLogging: () => marshalValuesForLogging,
    setUpBufferForTest: () => setUpBufferForTest,
    unmarshalValue: () => unmarshalValue,
    unmarshalValueFromString: () => unmarshalValueFromString
  });
  init_buffer_shim();

  // types.ts
  init_buffer_shim();

  // runtime/thunk/thunk.ts
  var import_buffer = __toESM(require_buffer());

  // runtime/types.ts
  init_buffer_shim();

  // api.ts
  init_buffer_shim();

  // api_types.ts
  init_buffer_shim();

  // api.ts
  var import_markdown_it = __toESM(require_markdown_it());

  // schema.ts
  init_buffer_shim();

  // helpers/ensure.ts
  init_buffer_shim();
  function ensureExists(value, message) {
    if (typeof value === "undefined" || value === null) {
      throw new (getErrorConstructor(message))(message || `Expected value for ${String(value)}`);
    }
    return value;
  }
  __name(ensureExists, "ensureExists");
  function getErrorConstructor(message) {
    return message ? UserVisibleError : Error;
  }
  __name(getErrorConstructor, "getErrorConstructor");

  // helpers/object_utils.ts
  init_buffer_shim();

  // helpers/migration.ts
  init_buffer_shim();
  function setEndpointHelper(step) {
    return new SetEndpointHelper(step);
  }
  __name(setEndpointHelper, "setEndpointHelper");
  var SetEndpointHelper = class {
    constructor(step) {
      this._step = step;
    }
    get getOptions() {
      return ensureExists(this._step.getOptions ?? this._step.getOptionsFormula);
    }
  };
  __name(SetEndpointHelper, "SetEndpointHelper");

  // schema.ts
  var import_pascalcase = __toESM(require_pascalcase());

  // handler_templates.ts
  init_buffer_shim();
  var import_clone = __toESM(require_clone());

  // helpers/url.ts
  init_buffer_shim();
  var import_qs = __toESM(require_lib2());
  var import_url_parse = __toESM(require_url_parse());

  // api.ts
  var markdown = (0, import_markdown_it.default)();
  var UserVisibleError = class extends Error {
    constructor(message, internalError) {
      super(message);
      this.isUserVisible = true;
      this.internalError = internalError;
    }
  };
  __name(UserVisibleError, "UserVisibleError");
  var StatusCodeError = class extends Error {
    constructor(statusCode, body, options, response) {
      super(`${statusCode} - ${JSON.stringify(body)}`);
      this.name = "StatusCodeError";
      this.statusCode = statusCode;
      this.body = body;
      this.error = body;
      this.options = options;
      let responseBody = response?.body;
      if (typeof responseBody === "object") {
        responseBody = JSON.stringify(responseBody);
      }
      this.response = { ...response, body: responseBody };
    }
    static isStatusCodeError(err) {
      return "name" in err && err.name === StatusCodeError.name;
    }
  };
  __name(StatusCodeError, "StatusCodeError");
  var MissingScopesError = class extends Error {
    constructor(message) {
      super(message || "Additional permissions are required");
      this.name = "MissingScopesError";
    }
    static isMissingScopesError(err) {
      return "name" in err && err.name === MissingScopesError.name;
    }
  };
  __name(MissingScopesError, "MissingScopesError");
  function isDynamicSyncTable(syncTable) {
    return "isDynamic" in syncTable;
  }
  __name(isDynamicSyncTable, "isDynamicSyncTable");

  // runtime/common/helpers.ts
  init_buffer_shim();
  function findFormula(packDef, formulaNameWithNamespace) {
    const packFormulas = packDef.formulas;
    if (!packFormulas) {
      throw new Error(`Pack definition has no formulas.`);
    }
    const [namespace, name] = formulaNameWithNamespace.includes("::") ? formulaNameWithNamespace.split("::") : ["", formulaNameWithNamespace];
    if (namespace) {
      console.log(
        `Warning: formula was invoked with a namespace (${formulaNameWithNamespace}), but namespaces are now deprecated.`
      );
    }
    const formulas = Array.isArray(packFormulas) ? packFormulas : packFormulas[namespace];
    if (!formulas || !formulas.length) {
      throw new Error(`Pack definition has no formulas${namespace ?? ` for namespace "${namespace}"`}.`);
    }
    for (const formula of formulas) {
      if (formula.name === name) {
        return formula;
      }
    }
    throw new Error(`Pack definition has no formula "${name}"${namespace ?? ` in namespace "${namespace}"`}.`);
  }
  __name(findFormula, "findFormula");
  function findSyncFormula(packDef, syncFormulaName) {
    if (!packDef.syncTables) {
      throw new Error(`Pack definition has no sync tables.`);
    }
    for (const syncTable of packDef.syncTables) {
      const syncFormula = syncTable.getter;
      if (syncTable.name === syncFormulaName) {
        return syncFormula;
      }
    }
    throw new Error(`Pack definition has no sync formula "${syncFormulaName}" in its sync tables.`);
  }
  __name(findSyncFormula, "findSyncFormula");

  // runtime/common/marshaling/index.ts
  init_buffer_shim();

  // runtime/common/marshaling/constants.ts
  init_buffer_shim();

  // runtime/common/marshaling/serializer.ts
  init_buffer_shim();
  var serialize;
  var deserialize;
  if (true) {
    serialize = /* @__PURE__ */ __name((value) => {
      if ("codaInternal" in global) {
        return codaInternal.serializer.serialize(value);
      }
      throw new Error("Not implemented");
    }, "serialize");
    deserialize = /* @__PURE__ */ __name((value) => {
      if ("codaInternal" in global) {
        return codaInternal.serializer.deserialize(value);
      }
      throw new Error("Not implemented");
    }, "deserialize");
  } else {
    const v8 = null;
    serialize = /* @__PURE__ */ __name((value) => v8.serialize(value).toString("base64"), "serialize");
    deserialize = /* @__PURE__ */ __name((value) => v8.deserialize(Buffer2.from(value, "base64")), "deserialize");
  }

  // runtime/common/marshaling/index.ts
  var import_util = __toESM(require_util2());
  var MaxTraverseDepth = 100;
  var recognizableSystemErrorClasses = [
    Error,
    EvalError,
    RangeError,
    ReferenceError,
    SyntaxError,
    TypeError,
    URIError
  ];
  var recognizableCodaErrorClasses = [
    StatusCodeError,
    MissingScopesError
  ];
  function fixUncopyableTypes(val, pathPrefix, postTransforms, depth = 0) {
    if (depth >= MaxTraverseDepth) {
      return { val, hasModifications: false };
    }
    if (!val) {
      return { val, hasModifications: false };
    }
    const maybeError = marshalError(val);
    if (maybeError) {
      postTransforms.push({
        type: "Error" /* Error */,
        path: [...pathPrefix]
      });
      return { val: maybeError, hasModifications: true };
    }
    if (val instanceof Buffer2 || global.Buffer?.isBuffer(val)) {
      postTransforms.push({
        type: "Buffer" /* Buffer */,
        path: [...pathPrefix]
      });
      return { val: val.toString("base64"), hasModifications: true };
    }
    if (Array.isArray(val)) {
      const maybeModifiedArray = [];
      let someItemHadModifications = false;
      for (let i = 0; i < val.length; i++) {
        const item = val[i];
        pathPrefix.push(i.toString());
        const { val: itemVal, hasModifications } = fixUncopyableTypes(item, pathPrefix, postTransforms, depth + 1);
        if (hasModifications) {
          someItemHadModifications = true;
        }
        maybeModifiedArray.push(itemVal);
        pathPrefix.pop();
      }
      if (someItemHadModifications) {
        return { val: maybeModifiedArray, hasModifications: true };
      }
    }
    if (typeof val === "object") {
      const maybeModifiedObject = {};
      let hadModifications = false;
      for (const key of Object.getOwnPropertyNames(val)) {
        pathPrefix.push(key);
        const { val: objVal, hasModifications: subValHasModifications } = fixUncopyableTypes(
          val[key],
          pathPrefix,
          postTransforms,
          depth + 1
        );
        maybeModifiedObject[key] = objVal;
        pathPrefix.pop();
        if (subValHasModifications) {
          hadModifications = true;
        }
      }
      if (hadModifications) {
        return { val: maybeModifiedObject, hasModifications: true };
      }
    }
    return { val, hasModifications: false };
  }
  __name(fixUncopyableTypes, "fixUncopyableTypes");
  function isMarshaledValue(val) {
    return typeof val === "object" && "__coda_marshaler__" /* CodaMarshaler */ in val;
  }
  __name(isMarshaledValue, "isMarshaledValue");
  function marshalValuesForLogging(val) {
    return [marshalValue((0, import_util.format)(...val))];
  }
  __name(marshalValuesForLogging, "marshalValuesForLogging");
  function marshalValue(val) {
    const postTransforms = [];
    const { val: encodedVal } = fixUncopyableTypes(val, [], postTransforms, 0);
    return {
      encoded: encodedVal,
      postTransforms,
      ["__coda_marshaler__" /* CodaMarshaler */]: "Object" /* Object */
    };
  }
  __name(marshalValue, "marshalValue");
  function marshalValueToString(val) {
    return serialize(marshalValue(val));
  }
  __name(marshalValueToString, "marshalValueToString");
  function unmarshalValueFromString(marshaledValue) {
    return unmarshalValue(deserialize(marshaledValue));
  }
  __name(unmarshalValueFromString, "unmarshalValueFromString");
  function applyTransform(input, path, fn) {
    if (path.length === 0) {
      return fn(input);
    } else {
      input[path[0]] = applyTransform(input[path[0]], path.slice(1), fn);
      return input;
    }
  }
  __name(applyTransform, "applyTransform");
  function unmarshalValue(marshaledValue) {
    if (!isMarshaledValue(marshaledValue)) {
      throw Error(`Not a marshaled value: ${JSON.stringify(marshaledValue)}`);
    }
    let result = marshaledValue.encoded;
    for (const transform of marshaledValue.postTransforms) {
      if (transform.type === "Buffer") {
        result = applyTransform(result, transform.path, (raw) => Buffer2.from(raw, "base64"));
      } else if (transform.type === "Error") {
        result = applyTransform(result, transform.path, (raw) => unmarshalError(raw));
      } else {
        throw new Error(`Not a valid type to unmarshal: ${transform.type}`);
      }
    }
    return result;
  }
  __name(unmarshalValue, "unmarshalValue");
  function wrapError(err) {
    return new Error(marshalValueToString(err));
  }
  __name(wrapError, "wrapError");
  function unwrapError(err) {
    try {
      const unmarshaledValue = unmarshalValueFromString(err.message);
      if (unmarshaledValue instanceof Error) {
        return unmarshaledValue;
      }
      return err;
    } catch (_) {
      return err;
    }
  }
  __name(unwrapError, "unwrapError");
  function getErrorClassType(err) {
    if (recognizableSystemErrorClasses.some((cls) => cls === err.constructor)) {
      return "System" /* System */;
    }
    if (recognizableCodaErrorClasses.some((cls) => cls === err.constructor)) {
      return "Coda" /* Coda */;
    }
    return "Other" /* Other */;
  }
  __name(getErrorClassType, "getErrorClassType");
  function marshalError(err) {
    if (!(err instanceof Error)) {
      return;
    }
    const { name, stack, message, ...args } = err;
    const extraArgs = { ...args };
    for (const [k, v] of Object.entries(extraArgs)) {
      extraArgs[k] = marshalValue(v);
    }
    const result = {
      name,
      stack,
      message,
      ["__coda_marshaler__" /* CodaMarshaler */]: "Error" /* Error */,
      ["__error_class_name__" /* ErrorClassName */]: err.constructor.name,
      ["__error_class_type__" /* ErrorClassType */]: getErrorClassType(err),
      extraArgs
    };
    return result;
  }
  __name(marshalError, "marshalError");
  function getErrorClass(errorClassType, name) {
    let errorClasses;
    switch (errorClassType) {
      case "System" /* System */:
        errorClasses = recognizableSystemErrorClasses;
        break;
      case "Coda" /* Coda */:
        errorClasses = recognizableCodaErrorClasses;
        break;
      default:
        errorClasses = [];
    }
    return errorClasses.find((cls) => cls.name === name) || Error;
  }
  __name(getErrorClass, "getErrorClass");
  function unmarshalError(val) {
    if (typeof val !== "object" || val["__coda_marshaler__" /* CodaMarshaler */] !== "Error" /* Error */) {
      return;
    }
    const {
      name,
      stack,
      message,
      ["__error_class_name__" /* ErrorClassName */]: errorClassName,
      ["__coda_marshaler__" /* CodaMarshaler */]: _,
      ["__error_class_type__" /* ErrorClassType */]: errorClassType,
      extraArgs
    } = val;
    const ErrorClass = getErrorClass(errorClassType, errorClassName);
    const error = new ErrorClass();
    error.message = message;
    error.stack = stack;
    error.name = name;
    for (const key of Object.keys(extraArgs)) {
      error[key] = unmarshalValue(extraArgs[key]);
    }
    return error;
  }
  __name(unmarshalError, "unmarshalError");

  // runtime/thunk/thunk.ts
  async function findAndExecutePackFunction(params, formulaSpec, manifest, executionContext, shouldWrapError = true) {
    try {
      if (!global.Buffer) {
        global.Buffer = import_buffer.Buffer;
      }
      return await doFindAndExecutePackFunction(params, formulaSpec, manifest, executionContext);
    } catch (err) {
      throw shouldWrapError ? wrapError(err) : err;
    }
  }
  __name(findAndExecutePackFunction, "findAndExecutePackFunction");
  function doFindAndExecutePackFunction(params, formulaSpec, manifest, executionContext) {
    const { syncTables, defaultAuthentication } = manifest;
    switch (formulaSpec.type) {
      case "Standard" /* Standard */: {
        const formula = findFormula(manifest, formulaSpec.formulaName);
        return formula.execute(params, executionContext);
      }
      case "Sync" /* Sync */: {
        const formula = findSyncFormula(manifest, formulaSpec.formulaName);
        return formula.execute(params, executionContext);
      }
      case "Metadata" /* Metadata */: {
        switch (formulaSpec.metadataFormulaType) {
          case "GetConnectionName" /* GetConnectionName */:
            if (defaultAuthentication?.type !== "None" /* None */ && defaultAuthentication?.type !== "Various" /* Various */ && defaultAuthentication?.getConnectionName) {
              return defaultAuthentication.getConnectionName.execute(params, executionContext);
            }
            break;
          case "GetConnectionUserId" /* GetConnectionUserId */:
            if (defaultAuthentication?.type !== "None" /* None */ && defaultAuthentication?.type !== "Various" /* Various */ && defaultAuthentication?.getConnectionUserId) {
              return defaultAuthentication.getConnectionUserId.execute(
                params,
                executionContext
              );
            }
            break;
          case "ParameterAutocomplete" /* ParameterAutocomplete */:
            const parentFormula = findParentFormula(manifest, formulaSpec);
            if (parentFormula) {
              return parentFormula.execute(params, executionContext);
            }
            break;
          case "PostSetupSetEndpoint" /* PostSetupSetEndpoint */:
            if (defaultAuthentication?.type !== "None" /* None */ && defaultAuthentication?.type !== "Various" /* Various */ && defaultAuthentication?.postSetup) {
              const setupStep = defaultAuthentication.postSetup.find(
                (step) => step.type === "SetEndPoint" /* SetEndpoint */ && step.name === formulaSpec.stepName
              );
              if (setupStep) {
                return setEndpointHelper(setupStep).getOptions.execute(params, executionContext);
              }
            }
            break;
          case "SyncListDynamicUrls" /* SyncListDynamicUrls */:
          case "SyncGetDisplayUrl" /* SyncGetDisplayUrl */:
          case "SyncGetTableName" /* SyncGetTableName */:
          case "SyncGetSchema" /* SyncGetSchema */:
            if (syncTables) {
              const syncTable = syncTables.find((table) => table.name === formulaSpec.syncTableName);
              if (syncTable) {
                let formula;
                if (isDynamicSyncTable(syncTable)) {
                  switch (formulaSpec.metadataFormulaType) {
                    case "SyncListDynamicUrls" /* SyncListDynamicUrls */:
                      formula = syncTable.listDynamicUrls;
                      break;
                    case "SyncGetDisplayUrl" /* SyncGetDisplayUrl */:
                      formula = syncTable.getDisplayUrl;
                      break;
                    case "SyncGetTableName" /* SyncGetTableName */:
                      formula = syncTable.getName;
                      break;
                    case "SyncGetSchema" /* SyncGetSchema */:
                      formula = syncTable.getSchema;
                      break;
                    default:
                      return ensureSwitchUnreachable(formulaSpec);
                  }
                } else if (formulaSpec.metadataFormulaType === "SyncGetSchema" /* SyncGetSchema */) {
                  formula = syncTable.getSchema;
                }
                if (formula) {
                  return formula.execute(params, executionContext);
                }
              }
            }
            break;
          default:
            return ensureSwitchUnreachable(formulaSpec);
        }
        break;
      }
      default:
        return ensureSwitchUnreachable(formulaSpec);
    }
    throw new Error(`Could not find a formula matching formula spec ${JSON.stringify(formulaSpec)}`);
  }
  __name(doFindAndExecutePackFunction, "doFindAndExecutePackFunction");
  function findParentFormula(manifest, formulaSpec) {
    const { formulas, syncTables } = manifest;
    let formula;
    switch (formulaSpec.parentFormulaType) {
      case "Standard" /* Standard */:
        if (formulas) {
          formula = formulas.find((defn) => defn.name === formulaSpec.parentFormulaName);
        }
        break;
      case "Sync" /* Sync */:
        if (syncTables) {
          const syncTable = syncTables.find((table) => table.getter.name === formulaSpec.parentFormulaName);
          formula = syncTable?.getter;
        }
        break;
      default:
        return ensureSwitchUnreachable(formulaSpec.parentFormulaType);
    }
    if (formula) {
      const params = formula.parameters.concat(formula.varargParameters || []);
      const paramDef = params.find((param) => param.name === formulaSpec.parameterName);
      return paramDef?.autocomplete;
    }
  }
  __name(findParentFormula, "findParentFormula");
  function ensureSwitchUnreachable(value) {
    throw new Error(`Unreachable code hit with value ${String(value)}`);
  }
  __name(ensureSwitchUnreachable, "ensureSwitchUnreachable");
  async function handleErrorAsync(func) {
    try {
      return await func();
    } catch (err) {
      throw unwrapError(err);
    }
  }
  __name(handleErrorAsync, "handleErrorAsync");
  function handleError(func) {
    try {
      return func();
    } catch (err) {
      throw unwrapError(err);
    }
  }
  __name(handleError, "handleError");
  function handleFetcherStatusError(fetchResult, fetchRequest) {
    if (fetchResult.status >= 300) {
      throw new StatusCodeError(fetchResult.status, fetchResult.body, fetchRequest, {
        body: fetchResult.body,
        headers: fetchResult.headers
      });
    }
  }
  __name(handleFetcherStatusError, "handleFetcherStatusError");
  function setUpBufferForTest() {
    if (!global.Buffer) {
      global.Buffer = import_buffer.Buffer;
    }
  }
  __name(setUpBufferForTest, "setUpBufferForTest");
  return __toCommonJS(thunk_exports);
})();
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
/*!
 * pascalcase <https://github.com/jonschlinkert/pascalcase>
 *
 * Copyright (c) 2015-present, Jon ("Schlink") Schlinkert.
 * Licensed under the MIT License.
 */
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
