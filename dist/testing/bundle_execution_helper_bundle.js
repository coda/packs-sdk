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

// node_modules/base64-js/index.js
var require_base64_js = __commonJS((exports2) => {
  "use strict";
  exports2.byteLength = byteLength;
  exports2.toByteArray = toByteArray;
  exports2.fromByteArray = fromByteArray;
  var lookup = [];
  var revLookup = [];
  var Arr = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
  var code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  for (var i = 0, len = code.length; i < len; ++i) {
    lookup[i] = code[i];
    revLookup[code.charCodeAt(i)] = i;
  }
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
  function byteLength(b64) {
    var lens = getLens(b64);
    var validLen = lens[0];
    var placeHoldersLen = lens[1];
    return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
  }
  function _byteLength(b64, validLen, placeHoldersLen) {
    return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
  }
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
  function tripletToBase64(num) {
    return lookup[num >> 18 & 63] + lookup[num >> 12 & 63] + lookup[num >> 6 & 63] + lookup[num & 63];
  }
  function encodeChunk(uint8, start, end) {
    var tmp;
    var output = [];
    for (var i2 = start; i2 < end; i2 += 3) {
      tmp = (uint8[i2] << 16 & 16711680) + (uint8[i2 + 1] << 8 & 65280) + (uint8[i2 + 2] & 255);
      output.push(tripletToBase64(tmp));
    }
    return output.join("");
  }
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
      parts.push(lookup[tmp >> 2] + lookup[tmp << 4 & 63] + "==");
    } else if (extraBytes === 2) {
      tmp = (uint8[len2 - 2] << 8) + uint8[len2 - 1];
      parts.push(lookup[tmp >> 10] + lookup[tmp >> 4 & 63] + lookup[tmp << 2 & 63] + "=");
    }
    return parts.join("");
  }
});

// node_modules/ieee754/index.js
var require_ieee754 = __commonJS((exports2) => {
  /*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
  exports2.read = function(buffer2, offset, isLE, mLen, nBytes) {
    var e, m;
    var eLen = nBytes * 8 - mLen - 1;
    var eMax = (1 << eLen) - 1;
    var eBias = eMax >> 1;
    var nBits = -7;
    var i = isLE ? nBytes - 1 : 0;
    var d = isLE ? -1 : 1;
    var s = buffer2[offset + i];
    i += d;
    e = s & (1 << -nBits) - 1;
    s >>= -nBits;
    nBits += eLen;
    for (; nBits > 0; e = e * 256 + buffer2[offset + i], i += d, nBits -= 8) {
    }
    m = e & (1 << -nBits) - 1;
    e >>= -nBits;
    nBits += mLen;
    for (; nBits > 0; m = m * 256 + buffer2[offset + i], i += d, nBits -= 8) {
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
  exports2.write = function(buffer2, value, offset, isLE, mLen, nBytes) {
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
    for (; mLen >= 8; buffer2[offset + i] = m & 255, i += d, m /= 256, mLen -= 8) {
    }
    e = e << mLen | m;
    eLen += mLen;
    for (; eLen > 0; buffer2[offset + i] = e & 255, i += d, e /= 256, eLen -= 8) {
    }
    buffer2[offset + i - d] |= s * 128;
  };
});

// node_modules/buffer/index.js
var require_buffer = __commonJS((exports2) => {
  /*!
   * The buffer module from node.js, for the browser.
   *
   * @author   Feross Aboukhadijeh <https://feross.org>
   * @license  MIT
   */
  "use strict";
  var base64 = require_base64_js();
  var ieee754 = require_ieee754();
  var customInspectSymbol = typeof Symbol === "function" && typeof Symbol["for"] === "function" ? Symbol["for"]("nodejs.util.inspect.custom") : null;
  exports2.Buffer = Buffer3;
  exports2.SlowBuffer = SlowBuffer;
  exports2.INSPECT_MAX_BYTES = 50;
  var K_MAX_LENGTH = 2147483647;
  exports2.kMaxLength = K_MAX_LENGTH;
  Buffer3.TYPED_ARRAY_SUPPORT = typedArraySupport();
  if (!Buffer3.TYPED_ARRAY_SUPPORT && typeof console !== "undefined" && typeof console.error === "function") {
    console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support.");
  }
  function typedArraySupport() {
    try {
      const arr = new Uint8Array(1);
      const proto = {foo: function() {
        return 42;
      }};
      Object.setPrototypeOf(proto, Uint8Array.prototype);
      Object.setPrototypeOf(arr, proto);
      return arr.foo() === 42;
    } catch (e) {
      return false;
    }
  }
  Object.defineProperty(Buffer3.prototype, "parent", {
    enumerable: true,
    get: function() {
      if (!Buffer3.isBuffer(this))
        return void 0;
      return this.buffer;
    }
  });
  Object.defineProperty(Buffer3.prototype, "offset", {
    enumerable: true,
    get: function() {
      if (!Buffer3.isBuffer(this))
        return void 0;
      return this.byteOffset;
    }
  });
  function createBuffer(length) {
    if (length > K_MAX_LENGTH) {
      throw new RangeError('The value "' + length + '" is invalid for option "size"');
    }
    const buf = new Uint8Array(length);
    Object.setPrototypeOf(buf, Buffer3.prototype);
    return buf;
  }
  function Buffer3(arg, encodingOrOffset, length) {
    if (typeof arg === "number") {
      if (typeof encodingOrOffset === "string") {
        throw new TypeError('The "string" argument must be of type string. Received type number');
      }
      return allocUnsafe(arg);
    }
    return from(arg, encodingOrOffset, length);
  }
  Buffer3.poolSize = 8192;
  function from(value, encodingOrOffset, length) {
    if (typeof value === "string") {
      return fromString(value, encodingOrOffset);
    }
    if (ArrayBuffer.isView(value)) {
      return fromArrayView(value);
    }
    if (value == null) {
      throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value);
    }
    if (isInstance(value, ArrayBuffer) || value && isInstance(value.buffer, ArrayBuffer)) {
      return fromArrayBuffer(value, encodingOrOffset, length);
    }
    if (typeof SharedArrayBuffer !== "undefined" && (isInstance(value, SharedArrayBuffer) || value && isInstance(value.buffer, SharedArrayBuffer))) {
      return fromArrayBuffer(value, encodingOrOffset, length);
    }
    if (typeof value === "number") {
      throw new TypeError('The "value" argument must not be of type number. Received type number');
    }
    const valueOf = value.valueOf && value.valueOf();
    if (valueOf != null && valueOf !== value) {
      return Buffer3.from(valueOf, encodingOrOffset, length);
    }
    const b = fromObject(value);
    if (b)
      return b;
    if (typeof Symbol !== "undefined" && Symbol.toPrimitive != null && typeof value[Symbol.toPrimitive] === "function") {
      return Buffer3.from(value[Symbol.toPrimitive]("string"), encodingOrOffset, length);
    }
    throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value);
  }
  Buffer3.from = function(value, encodingOrOffset, length) {
    return from(value, encodingOrOffset, length);
  };
  Object.setPrototypeOf(Buffer3.prototype, Uint8Array.prototype);
  Object.setPrototypeOf(Buffer3, Uint8Array);
  function assertSize(size) {
    if (typeof size !== "number") {
      throw new TypeError('"size" argument must be of type number');
    } else if (size < 0) {
      throw new RangeError('The value "' + size + '" is invalid for option "size"');
    }
  }
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
  Buffer3.alloc = function(size, fill, encoding) {
    return alloc(size, fill, encoding);
  };
  function allocUnsafe(size) {
    assertSize(size);
    return createBuffer(size < 0 ? 0 : checked(size) | 0);
  }
  Buffer3.allocUnsafe = function(size) {
    return allocUnsafe(size);
  };
  Buffer3.allocUnsafeSlow = function(size) {
    return allocUnsafe(size);
  };
  function fromString(string, encoding) {
    if (typeof encoding !== "string" || encoding === "") {
      encoding = "utf8";
    }
    if (!Buffer3.isEncoding(encoding)) {
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
  function fromArrayLike(array) {
    const length = array.length < 0 ? 0 : checked(array.length) | 0;
    const buf = createBuffer(length);
    for (let i = 0; i < length; i += 1) {
      buf[i] = array[i] & 255;
    }
    return buf;
  }
  function fromArrayView(arrayView) {
    if (isInstance(arrayView, Uint8Array)) {
      const copy = new Uint8Array(arrayView);
      return fromArrayBuffer(copy.buffer, copy.byteOffset, copy.byteLength);
    }
    return fromArrayLike(arrayView);
  }
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
    Object.setPrototypeOf(buf, Buffer3.prototype);
    return buf;
  }
  function fromObject(obj) {
    if (Buffer3.isBuffer(obj)) {
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
  function checked(length) {
    if (length >= K_MAX_LENGTH) {
      throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + K_MAX_LENGTH.toString(16) + " bytes");
    }
    return length | 0;
  }
  function SlowBuffer(length) {
    if (+length != length) {
      length = 0;
    }
    return Buffer3.alloc(+length);
  }
  Buffer3.isBuffer = function isBuffer(b) {
    return b != null && b._isBuffer === true && b !== Buffer3.prototype;
  };
  Buffer3.compare = function compare(a, b) {
    if (isInstance(a, Uint8Array))
      a = Buffer3.from(a, a.offset, a.byteLength);
    if (isInstance(b, Uint8Array))
      b = Buffer3.from(b, b.offset, b.byteLength);
    if (!Buffer3.isBuffer(a) || !Buffer3.isBuffer(b)) {
      throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');
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
  };
  Buffer3.isEncoding = function isEncoding(encoding) {
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
  };
  Buffer3.concat = function concat(list, length) {
    if (!Array.isArray(list)) {
      throw new TypeError('"list" argument must be an Array of Buffers');
    }
    if (list.length === 0) {
      return Buffer3.alloc(0);
    }
    let i;
    if (length === void 0) {
      length = 0;
      for (i = 0; i < list.length; ++i) {
        length += list[i].length;
      }
    }
    const buffer2 = Buffer3.allocUnsafe(length);
    let pos = 0;
    for (i = 0; i < list.length; ++i) {
      let buf = list[i];
      if (isInstance(buf, Uint8Array)) {
        if (pos + buf.length > buffer2.length) {
          if (!Buffer3.isBuffer(buf))
            buf = Buffer3.from(buf);
          buf.copy(buffer2, pos);
        } else {
          Uint8Array.prototype.set.call(buffer2, buf, pos);
        }
      } else if (!Buffer3.isBuffer(buf)) {
        throw new TypeError('"list" argument must be an Array of Buffers');
      } else {
        buf.copy(buffer2, pos);
      }
      pos += buf.length;
    }
    return buffer2;
  };
  function byteLength(string, encoding) {
    if (Buffer3.isBuffer(string)) {
      return string.length;
    }
    if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
      return string.byteLength;
    }
    if (typeof string !== "string") {
      throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof string);
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
  Buffer3.byteLength = byteLength;
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
  Buffer3.prototype._isBuffer = true;
  function swap(b, n, m) {
    const i = b[n];
    b[n] = b[m];
    b[m] = i;
  }
  Buffer3.prototype.swap16 = function swap16() {
    const len = this.length;
    if (len % 2 !== 0) {
      throw new RangeError("Buffer size must be a multiple of 16-bits");
    }
    for (let i = 0; i < len; i += 2) {
      swap(this, i, i + 1);
    }
    return this;
  };
  Buffer3.prototype.swap32 = function swap32() {
    const len = this.length;
    if (len % 4 !== 0) {
      throw new RangeError("Buffer size must be a multiple of 32-bits");
    }
    for (let i = 0; i < len; i += 4) {
      swap(this, i, i + 3);
      swap(this, i + 1, i + 2);
    }
    return this;
  };
  Buffer3.prototype.swap64 = function swap64() {
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
  };
  Buffer3.prototype.toString = function toString() {
    const length = this.length;
    if (length === 0)
      return "";
    if (arguments.length === 0)
      return utf8Slice(this, 0, length);
    return slowToString.apply(this, arguments);
  };
  Buffer3.prototype.toLocaleString = Buffer3.prototype.toString;
  Buffer3.prototype.equals = function equals(b) {
    if (!Buffer3.isBuffer(b))
      throw new TypeError("Argument must be a Buffer");
    if (this === b)
      return true;
    return Buffer3.compare(this, b) === 0;
  };
  Buffer3.prototype.inspect = function inspect() {
    let str = "";
    const max = exports2.INSPECT_MAX_BYTES;
    str = this.toString("hex", 0, max).replace(/(.{2})/g, "$1 ").trim();
    if (this.length > max)
      str += " ... ";
    return "<Buffer " + str + ">";
  };
  if (customInspectSymbol) {
    Buffer3.prototype[customInspectSymbol] = Buffer3.prototype.inspect;
  }
  Buffer3.prototype.compare = function compare(target, start, end, thisStart, thisEnd) {
    if (isInstance(target, Uint8Array)) {
      target = Buffer3.from(target, target.offset, target.byteLength);
    }
    if (!Buffer3.isBuffer(target)) {
      throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof target);
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
  };
  function bidirectionalIndexOf(buffer2, val, byteOffset, encoding, dir) {
    if (buffer2.length === 0)
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
      byteOffset = dir ? 0 : buffer2.length - 1;
    }
    if (byteOffset < 0)
      byteOffset = buffer2.length + byteOffset;
    if (byteOffset >= buffer2.length) {
      if (dir)
        return -1;
      else
        byteOffset = buffer2.length - 1;
    } else if (byteOffset < 0) {
      if (dir)
        byteOffset = 0;
      else
        return -1;
    }
    if (typeof val === "string") {
      val = Buffer3.from(val, encoding);
    }
    if (Buffer3.isBuffer(val)) {
      if (val.length === 0) {
        return -1;
      }
      return arrayIndexOf(buffer2, val, byteOffset, encoding, dir);
    } else if (typeof val === "number") {
      val = val & 255;
      if (typeof Uint8Array.prototype.indexOf === "function") {
        if (dir) {
          return Uint8Array.prototype.indexOf.call(buffer2, val, byteOffset);
        } else {
          return Uint8Array.prototype.lastIndexOf.call(buffer2, val, byteOffset);
        }
      }
      return arrayIndexOf(buffer2, [val], byteOffset, encoding, dir);
    }
    throw new TypeError("val must be string, number or Buffer");
  }
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
  Buffer3.prototype.includes = function includes(val, byteOffset, encoding) {
    return this.indexOf(val, byteOffset, encoding) !== -1;
  };
  Buffer3.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
    return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
  };
  Buffer3.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
    return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
  };
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
  function utf8Write(buf, string, offset, length) {
    return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
  }
  function asciiWrite(buf, string, offset, length) {
    return blitBuffer(asciiToBytes(string), buf, offset, length);
  }
  function base64Write(buf, string, offset, length) {
    return blitBuffer(base64ToBytes(string), buf, offset, length);
  }
  function ucs2Write(buf, string, offset, length) {
    return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
  }
  Buffer3.prototype.write = function write(string, offset, length, encoding) {
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
      throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
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
  };
  Buffer3.prototype.toJSON = function toJSON() {
    return {
      type: "Buffer",
      data: Array.prototype.slice.call(this._arr || this, 0)
    };
  };
  function base64Slice(buf, start, end) {
    if (start === 0 && end === buf.length) {
      return base64.fromByteArray(buf);
    } else {
      return base64.fromByteArray(buf.slice(start, end));
    }
  }
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
  var MAX_ARGUMENTS_LENGTH = 4096;
  function decodeCodePointsArray(codePoints) {
    const len = codePoints.length;
    if (len <= MAX_ARGUMENTS_LENGTH) {
      return String.fromCharCode.apply(String, codePoints);
    }
    let res = "";
    let i = 0;
    while (i < len) {
      res += String.fromCharCode.apply(String, codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH));
    }
    return res;
  }
  function asciiSlice(buf, start, end) {
    let ret = "";
    end = Math.min(buf.length, end);
    for (let i = start; i < end; ++i) {
      ret += String.fromCharCode(buf[i] & 127);
    }
    return ret;
  }
  function latin1Slice(buf, start, end) {
    let ret = "";
    end = Math.min(buf.length, end);
    for (let i = start; i < end; ++i) {
      ret += String.fromCharCode(buf[i]);
    }
    return ret;
  }
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
  function utf16leSlice(buf, start, end) {
    const bytes = buf.slice(start, end);
    let res = "";
    for (let i = 0; i < bytes.length - 1; i += 2) {
      res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
    }
    return res;
  }
  Buffer3.prototype.slice = function slice(start, end) {
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
    Object.setPrototypeOf(newBuf, Buffer3.prototype);
    return newBuf;
  };
  function checkOffset(offset, ext, length) {
    if (offset % 1 !== 0 || offset < 0)
      throw new RangeError("offset is not uint");
    if (offset + ext > length)
      throw new RangeError("Trying to access beyond buffer length");
  }
  Buffer3.prototype.readUintLE = Buffer3.prototype.readUIntLE = function readUIntLE(offset, byteLength2, noAssert) {
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
  };
  Buffer3.prototype.readUintBE = Buffer3.prototype.readUIntBE = function readUIntBE(offset, byteLength2, noAssert) {
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
  };
  Buffer3.prototype.readUint8 = Buffer3.prototype.readUInt8 = function readUInt8(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 1, this.length);
    return this[offset];
  };
  Buffer3.prototype.readUint16LE = Buffer3.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 2, this.length);
    return this[offset] | this[offset + 1] << 8;
  };
  Buffer3.prototype.readUint16BE = Buffer3.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 2, this.length);
    return this[offset] << 8 | this[offset + 1];
  };
  Buffer3.prototype.readUint32LE = Buffer3.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 4, this.length);
    return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 16777216;
  };
  Buffer3.prototype.readUint32BE = Buffer3.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 4, this.length);
    return this[offset] * 16777216 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
  };
  Buffer3.prototype.readBigUInt64LE = defineBigIntMethod(function readBigUInt64LE(offset) {
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
  });
  Buffer3.prototype.readBigUInt64BE = defineBigIntMethod(function readBigUInt64BE(offset) {
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
  });
  Buffer3.prototype.readIntLE = function readIntLE(offset, byteLength2, noAssert) {
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
  };
  Buffer3.prototype.readIntBE = function readIntBE(offset, byteLength2, noAssert) {
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
  };
  Buffer3.prototype.readInt8 = function readInt8(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 1, this.length);
    if (!(this[offset] & 128))
      return this[offset];
    return (255 - this[offset] + 1) * -1;
  };
  Buffer3.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 2, this.length);
    const val = this[offset] | this[offset + 1] << 8;
    return val & 32768 ? val | 4294901760 : val;
  };
  Buffer3.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 2, this.length);
    const val = this[offset + 1] | this[offset] << 8;
    return val & 32768 ? val | 4294901760 : val;
  };
  Buffer3.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 4, this.length);
    return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
  };
  Buffer3.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 4, this.length);
    return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
  };
  Buffer3.prototype.readBigInt64LE = defineBigIntMethod(function readBigInt64LE(offset) {
    offset = offset >>> 0;
    validateNumber(offset, "offset");
    const first = this[offset];
    const last = this[offset + 7];
    if (first === void 0 || last === void 0) {
      boundsError(offset, this.length - 8);
    }
    const val = this[offset + 4] + this[offset + 5] * 2 ** 8 + this[offset + 6] * 2 ** 16 + (last << 24);
    return (BigInt(val) << BigInt(32)) + BigInt(first + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 24);
  });
  Buffer3.prototype.readBigInt64BE = defineBigIntMethod(function readBigInt64BE(offset) {
    offset = offset >>> 0;
    validateNumber(offset, "offset");
    const first = this[offset];
    const last = this[offset + 7];
    if (first === void 0 || last === void 0) {
      boundsError(offset, this.length - 8);
    }
    const val = (first << 24) + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + this[++offset];
    return (BigInt(val) << BigInt(32)) + BigInt(this[++offset] * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + last);
  });
  Buffer3.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 4, this.length);
    return ieee754.read(this, offset, true, 23, 4);
  };
  Buffer3.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 4, this.length);
    return ieee754.read(this, offset, false, 23, 4);
  };
  Buffer3.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 8, this.length);
    return ieee754.read(this, offset, true, 52, 8);
  };
  Buffer3.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 8, this.length);
    return ieee754.read(this, offset, false, 52, 8);
  };
  function checkInt(buf, value, offset, ext, max, min) {
    if (!Buffer3.isBuffer(buf))
      throw new TypeError('"buffer" argument must be a Buffer instance');
    if (value > max || value < min)
      throw new RangeError('"value" argument is out of bounds');
    if (offset + ext > buf.length)
      throw new RangeError("Index out of range");
  }
  Buffer3.prototype.writeUintLE = Buffer3.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength2, noAssert) {
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
  };
  Buffer3.prototype.writeUintBE = Buffer3.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength2, noAssert) {
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
  };
  Buffer3.prototype.writeUint8 = Buffer3.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert)
      checkInt(this, value, offset, 1, 255, 0);
    this[offset] = value & 255;
    return offset + 1;
  };
  Buffer3.prototype.writeUint16LE = Buffer3.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert)
      checkInt(this, value, offset, 2, 65535, 0);
    this[offset] = value & 255;
    this[offset + 1] = value >>> 8;
    return offset + 2;
  };
  Buffer3.prototype.writeUint16BE = Buffer3.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert)
      checkInt(this, value, offset, 2, 65535, 0);
    this[offset] = value >>> 8;
    this[offset + 1] = value & 255;
    return offset + 2;
  };
  Buffer3.prototype.writeUint32LE = Buffer3.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert)
      checkInt(this, value, offset, 4, 4294967295, 0);
    this[offset + 3] = value >>> 24;
    this[offset + 2] = value >>> 16;
    this[offset + 1] = value >>> 8;
    this[offset] = value & 255;
    return offset + 4;
  };
  Buffer3.prototype.writeUint32BE = Buffer3.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert)
      checkInt(this, value, offset, 4, 4294967295, 0);
    this[offset] = value >>> 24;
    this[offset + 1] = value >>> 16;
    this[offset + 2] = value >>> 8;
    this[offset + 3] = value & 255;
    return offset + 4;
  };
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
  Buffer3.prototype.writeBigUInt64LE = defineBigIntMethod(function writeBigUInt64LE(value, offset = 0) {
    return wrtBigUInt64LE(this, value, offset, BigInt(0), BigInt("0xffffffffffffffff"));
  });
  Buffer3.prototype.writeBigUInt64BE = defineBigIntMethod(function writeBigUInt64BE(value, offset = 0) {
    return wrtBigUInt64BE(this, value, offset, BigInt(0), BigInt("0xffffffffffffffff"));
  });
  Buffer3.prototype.writeIntLE = function writeIntLE(value, offset, byteLength2, noAssert) {
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
  };
  Buffer3.prototype.writeIntBE = function writeIntBE(value, offset, byteLength2, noAssert) {
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
  };
  Buffer3.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert)
      checkInt(this, value, offset, 1, 127, -128);
    if (value < 0)
      value = 255 + value + 1;
    this[offset] = value & 255;
    return offset + 1;
  };
  Buffer3.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert)
      checkInt(this, value, offset, 2, 32767, -32768);
    this[offset] = value & 255;
    this[offset + 1] = value >>> 8;
    return offset + 2;
  };
  Buffer3.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert)
      checkInt(this, value, offset, 2, 32767, -32768);
    this[offset] = value >>> 8;
    this[offset + 1] = value & 255;
    return offset + 2;
  };
  Buffer3.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert)
      checkInt(this, value, offset, 4, 2147483647, -2147483648);
    this[offset] = value & 255;
    this[offset + 1] = value >>> 8;
    this[offset + 2] = value >>> 16;
    this[offset + 3] = value >>> 24;
    return offset + 4;
  };
  Buffer3.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
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
  };
  Buffer3.prototype.writeBigInt64LE = defineBigIntMethod(function writeBigInt64LE(value, offset = 0) {
    return wrtBigUInt64LE(this, value, offset, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
  });
  Buffer3.prototype.writeBigInt64BE = defineBigIntMethod(function writeBigInt64BE(value, offset = 0) {
    return wrtBigUInt64BE(this, value, offset, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
  });
  function checkIEEE754(buf, value, offset, ext, max, min) {
    if (offset + ext > buf.length)
      throw new RangeError("Index out of range");
    if (offset < 0)
      throw new RangeError("Index out of range");
  }
  function writeFloat(buf, value, offset, littleEndian, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) {
      checkIEEE754(buf, value, offset, 4, 34028234663852886e22, -34028234663852886e22);
    }
    ieee754.write(buf, value, offset, littleEndian, 23, 4);
    return offset + 4;
  }
  Buffer3.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
    return writeFloat(this, value, offset, true, noAssert);
  };
  Buffer3.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
    return writeFloat(this, value, offset, false, noAssert);
  };
  function writeDouble(buf, value, offset, littleEndian, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) {
      checkIEEE754(buf, value, offset, 8, 17976931348623157e292, -17976931348623157e292);
    }
    ieee754.write(buf, value, offset, littleEndian, 52, 8);
    return offset + 8;
  }
  Buffer3.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
    return writeDouble(this, value, offset, true, noAssert);
  };
  Buffer3.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
    return writeDouble(this, value, offset, false, noAssert);
  };
  Buffer3.prototype.copy = function copy(target, targetStart, start, end) {
    if (!Buffer3.isBuffer(target))
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
      Uint8Array.prototype.set.call(target, this.subarray(start, end), targetStart);
    }
    return len;
  };
  Buffer3.prototype.fill = function fill(val, start, end, encoding) {
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
      if (typeof encoding === "string" && !Buffer3.isEncoding(encoding)) {
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
      const bytes = Buffer3.isBuffer(val) ? val : Buffer3.from(val, encoding);
      const len = bytes.length;
      if (len === 0) {
        throw new TypeError('The value "' + val + '" is invalid for argument "value"');
      }
      for (i = 0; i < end - start; ++i) {
        this[i + start] = bytes[i % len];
      }
    }
    return this;
  };
  var errors = {};
  function E(sym, getMessage, Base) {
    errors[sym] = class NodeError extends Base {
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
    };
  }
  E("ERR_BUFFER_OUT_OF_BOUNDS", function(name) {
    if (name) {
      return `${name} is outside of buffer bounds`;
    }
    return "Attempt to access memory outside buffer bounds";
  }, RangeError);
  E("ERR_INVALID_ARG_TYPE", function(name, actual) {
    return `The "${name}" argument must be of type number. Received type ${typeof actual}`;
  }, TypeError);
  E("ERR_OUT_OF_RANGE", function(str, range, input) {
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
  }, RangeError);
  function addNumericalSeparator(val) {
    let res = "";
    let i = val.length;
    const start = val[0] === "-" ? 1 : 0;
    for (; i >= start + 4; i -= 3) {
      res = `_${val.slice(i - 3, i)}${res}`;
    }
    return `${val.slice(0, i)}${res}`;
  }
  function checkBounds(buf, offset, byteLength2) {
    validateNumber(offset, "offset");
    if (buf[offset] === void 0 || buf[offset + byteLength2] === void 0) {
      boundsError(offset, buf.length - (byteLength2 + 1));
    }
  }
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
  function validateNumber(value, name) {
    if (typeof value !== "number") {
      throw new errors.ERR_INVALID_ARG_TYPE(name, "number", value);
    }
  }
  function boundsError(value, length, type) {
    if (Math.floor(value) !== value) {
      validateNumber(value, type);
      throw new errors.ERR_OUT_OF_RANGE(type || "offset", "an integer", value);
    }
    if (length < 0) {
      throw new errors.ERR_BUFFER_OUT_OF_BOUNDS();
    }
    throw new errors.ERR_OUT_OF_RANGE(type || "offset", `>= ${type ? 1 : 0} and <= ${length}`, value);
  }
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
        bytes.push(codePoint >> 6 | 192, codePoint & 63 | 128);
      } else if (codePoint < 65536) {
        if ((units -= 3) < 0)
          break;
        bytes.push(codePoint >> 12 | 224, codePoint >> 6 & 63 | 128, codePoint & 63 | 128);
      } else if (codePoint < 1114112) {
        if ((units -= 4) < 0)
          break;
        bytes.push(codePoint >> 18 | 240, codePoint >> 12 & 63 | 128, codePoint >> 6 & 63 | 128, codePoint & 63 | 128);
      } else {
        throw new Error("Invalid code point");
      }
    }
    return bytes;
  }
  function asciiToBytes(str) {
    const byteArray = [];
    for (let i = 0; i < str.length; ++i) {
      byteArray.push(str.charCodeAt(i) & 255);
    }
    return byteArray;
  }
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
  function base64ToBytes(str) {
    return base64.toByteArray(base64clean(str));
  }
  function blitBuffer(src, dst, offset, length) {
    let i;
    for (i = 0; i < length; ++i) {
      if (i + offset >= dst.length || i >= src.length)
        break;
      dst[i + offset] = src[i];
    }
    return i;
  }
  function isInstance(obj, type) {
    return obj instanceof type || obj != null && obj.constructor != null && obj.constructor.name != null && obj.constructor.name === type.name;
  }
  function numberIsNaN(obj) {
    return obj !== obj;
  }
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
  function BufferBigIntNotDefined() {
    throw new Error("BigInt not supported");
  }
});

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

// node_modules/webidl-conversions/lib/index.js
var require_lib2 = __commonJS((exports2) => {
  "use strict";
  function _(message, opts) {
    return `${opts && opts.context ? opts.context : "Value"} ${message}.`;
  }
  function type(V) {
    if (V === null) {
      return "Null";
    }
    switch (typeof V) {
      case "undefined":
        return "Undefined";
      case "boolean":
        return "Boolean";
      case "number":
        return "Number";
      case "string":
        return "String";
      case "symbol":
        return "Symbol";
      case "object":
      case "function":
      default:
        return "Object";
    }
  }
  function evenRound(x) {
    if (x > 0 && x % 1 === 0.5 && (x & 1) === 0 || x < 0 && x % 1 === -0.5 && (x & 1) === 1) {
      return censorNegativeZero(Math.floor(x));
    }
    return censorNegativeZero(Math.round(x));
  }
  function integerPart(n) {
    return censorNegativeZero(Math.trunc(n));
  }
  function sign(x) {
    return x < 0 ? -1 : 1;
  }
  function modulo(x, y) {
    const signMightNotMatch = x % y;
    if (sign(y) !== sign(signMightNotMatch)) {
      return signMightNotMatch + y;
    }
    return signMightNotMatch;
  }
  function censorNegativeZero(x) {
    return x === 0 ? 0 : x;
  }
  function createIntegerConversion(bitLength, typeOpts) {
    const isSigned = !typeOpts.unsigned;
    let lowerBound;
    let upperBound;
    if (bitLength === 64) {
      upperBound = Math.pow(2, 53) - 1;
      lowerBound = !isSigned ? 0 : -Math.pow(2, 53) + 1;
    } else if (!isSigned) {
      lowerBound = 0;
      upperBound = Math.pow(2, bitLength) - 1;
    } else {
      lowerBound = -Math.pow(2, bitLength - 1);
      upperBound = Math.pow(2, bitLength - 1) - 1;
    }
    const twoToTheBitLength = Math.pow(2, bitLength);
    const twoToOneLessThanTheBitLength = Math.pow(2, bitLength - 1);
    return (V, opts) => {
      if (opts === void 0) {
        opts = {};
      }
      let x = +V;
      x = censorNegativeZero(x);
      if (opts.enforceRange) {
        if (!Number.isFinite(x)) {
          throw new TypeError(_("is not a finite number", opts));
        }
        x = integerPart(x);
        if (x < lowerBound || x > upperBound) {
          throw new TypeError(_(`is outside the accepted range of ${lowerBound} to ${upperBound}, inclusive`, opts));
        }
        return x;
      }
      if (!Number.isNaN(x) && opts.clamp) {
        x = Math.min(Math.max(x, lowerBound), upperBound);
        x = evenRound(x);
        return x;
      }
      if (!Number.isFinite(x) || x === 0) {
        return 0;
      }
      x = integerPart(x);
      if (x >= lowerBound && x <= upperBound) {
        return x;
      }
      x = modulo(x, twoToTheBitLength);
      if (isSigned && x >= twoToOneLessThanTheBitLength) {
        return x - twoToTheBitLength;
      }
      return x;
    };
  }
  exports2.any = (V) => {
    return V;
  };
  exports2.void = function() {
    return void 0;
  };
  exports2.boolean = function(val) {
    return !!val;
  };
  exports2.byte = createIntegerConversion(8, {unsigned: false});
  exports2.octet = createIntegerConversion(8, {unsigned: true});
  exports2.short = createIntegerConversion(16, {unsigned: false});
  exports2["unsigned short"] = createIntegerConversion(16, {unsigned: true});
  exports2.long = createIntegerConversion(32, {unsigned: false});
  exports2["unsigned long"] = createIntegerConversion(32, {unsigned: true});
  exports2["long long"] = createIntegerConversion(64, {unsigned: false});
  exports2["unsigned long long"] = createIntegerConversion(64, {unsigned: true});
  exports2.double = (V, opts) => {
    const x = +V;
    if (!Number.isFinite(x)) {
      throw new TypeError(_("is not a finite floating-point value", opts));
    }
    return x;
  };
  exports2["unrestricted double"] = (V) => {
    const x = +V;
    return x;
  };
  exports2.float = (V, opts) => {
    const x = +V;
    if (!Number.isFinite(x)) {
      throw new TypeError(_("is not a finite floating-point value", opts));
    }
    if (Object.is(x, -0)) {
      return x;
    }
    const y = Math.fround(x);
    if (!Number.isFinite(y)) {
      throw new TypeError(_("is outside the range of a single-precision floating-point value", opts));
    }
    return y;
  };
  exports2["unrestricted float"] = (V) => {
    const x = +V;
    if (isNaN(x)) {
      return x;
    }
    if (Object.is(x, -0)) {
      return x;
    }
    return Math.fround(x);
  };
  exports2.DOMString = function(V, opts) {
    if (opts === void 0) {
      opts = {};
    }
    if (opts.treatNullAsEmptyString && V === null) {
      return "";
    }
    if (typeof V === "symbol") {
      throw new TypeError(_("is a symbol, which cannot be converted to a string", opts));
    }
    return String(V);
  };
  exports2.ByteString = (V, opts) => {
    const x = exports2.DOMString(V, opts);
    let c;
    for (let i = 0; (c = x.codePointAt(i)) !== void 0; ++i) {
      if (c > 255) {
        throw new TypeError(_("is not a valid ByteString", opts));
      }
    }
    return x;
  };
  exports2.USVString = (V, opts) => {
    const S = exports2.DOMString(V, opts);
    const n = S.length;
    const U = [];
    for (let i = 0; i < n; ++i) {
      const c = S.charCodeAt(i);
      if (c < 55296 || c > 57343) {
        U.push(String.fromCodePoint(c));
      } else if (56320 <= c && c <= 57343) {
        U.push(String.fromCodePoint(65533));
      } else if (i === n - 1) {
        U.push(String.fromCodePoint(65533));
      } else {
        const d = S.charCodeAt(i + 1);
        if (56320 <= d && d <= 57343) {
          const a = c & 1023;
          const b = d & 1023;
          U.push(String.fromCodePoint((2 << 15) + (2 << 9) * a + b));
          ++i;
        } else {
          U.push(String.fromCodePoint(65533));
        }
      }
    }
    return U.join("");
  };
  exports2.object = (V, opts) => {
    if (type(V) !== "Object") {
      throw new TypeError(_("is not an object", opts));
    }
    return V;
  };
  function convertCallbackFunction(V, opts) {
    if (typeof V !== "function") {
      throw new TypeError(_("is not a function", opts));
    }
    return V;
  }
  [
    Error,
    ArrayBuffer,
    DataView,
    Int8Array,
    Int16Array,
    Int32Array,
    Uint8Array,
    Uint16Array,
    Uint32Array,
    Uint8ClampedArray,
    Float32Array,
    Float64Array
  ].forEach((func) => {
    const name = func.name;
    const article = /^[AEIOU]/.test(name) ? "an" : "a";
    exports2[name] = (V, opts) => {
      if (!(V instanceof func)) {
        throw new TypeError(_(`is not ${article} ${name} object`, opts));
      }
      return V;
    };
  });
  exports2.ArrayBufferView = (V, opts) => {
    if (!ArrayBuffer.isView(V)) {
      throw new TypeError(_("is not a view on an ArrayBuffer object", opts));
    }
    return V;
  };
  exports2.BufferSource = (V, opts) => {
    if (!(ArrayBuffer.isView(V) || V instanceof ArrayBuffer)) {
      throw new TypeError(_("is not an ArrayBuffer object or a view on one", opts));
    }
    return V;
  };
  exports2.DOMTimeStamp = exports2["unsigned long long"];
  exports2.Function = convertCallbackFunction;
  exports2.VoidFunction = convertCallbackFunction;
});

// node_modules/whatwg-url/lib/utils.js
var require_utils2 = __commonJS((exports2, module2) => {
  "use strict";
  function isObject2(value) {
    return typeof value === "object" && value !== null || typeof value === "function";
  }
  function hasOwn(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  }
  var getOwnPropertyDescriptors = typeof Object.getOwnPropertyDescriptors === "function" ? Object.getOwnPropertyDescriptors : (obj) => {
    if (obj === void 0 || obj === null) {
      throw new TypeError("Cannot convert undefined or null to object");
    }
    obj = Object(obj);
    const ownKeys = Reflect.ownKeys(obj);
    const descriptors = {};
    for (const key of ownKeys) {
      const descriptor = Reflect.getOwnPropertyDescriptor(obj, key);
      if (descriptor !== void 0) {
        Reflect.defineProperty(descriptors, key, {
          value: descriptor,
          writable: true,
          enumerable: true,
          configurable: true
        });
      }
    }
    return descriptors;
  };
  var wrapperSymbol = Symbol("wrapper");
  var implSymbol = Symbol("impl");
  var sameObjectCaches = Symbol("SameObject caches");
  function getSameObject(wrapper, prop, creator) {
    if (!wrapper[sameObjectCaches]) {
      wrapper[sameObjectCaches] = Object.create(null);
    }
    if (prop in wrapper[sameObjectCaches]) {
      return wrapper[sameObjectCaches][prop];
    }
    wrapper[sameObjectCaches][prop] = creator();
    return wrapper[sameObjectCaches][prop];
  }
  function wrapperForImpl(impl) {
    return impl ? impl[wrapperSymbol] : null;
  }
  function implForWrapper(wrapper) {
    return wrapper ? wrapper[implSymbol] : null;
  }
  function tryWrapperForImpl(impl) {
    const wrapper = wrapperForImpl(impl);
    return wrapper ? wrapper : impl;
  }
  function tryImplForWrapper(wrapper) {
    const impl = implForWrapper(wrapper);
    return impl ? impl : wrapper;
  }
  var iterInternalSymbol = Symbol("internal");
  var IteratorPrototype = Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]()));
  function isArrayIndexPropName(P) {
    if (typeof P !== "string") {
      return false;
    }
    const i = P >>> 0;
    if (i === Math.pow(2, 32) - 1) {
      return false;
    }
    const s = `${i}`;
    if (P !== s) {
      return false;
    }
    return true;
  }
  var supportsPropertyIndex = Symbol("supports property index");
  var supportedPropertyIndices = Symbol("supported property indices");
  var supportsPropertyName = Symbol("supports property name");
  var supportedPropertyNames = Symbol("supported property names");
  var indexedGet = Symbol("indexed property get");
  var indexedSetNew = Symbol("indexed property set new");
  var indexedSetExisting = Symbol("indexed property set existing");
  var namedGet = Symbol("named property get");
  var namedSetNew = Symbol("named property set new");
  var namedSetExisting = Symbol("named property set existing");
  var namedDelete = Symbol("named property delete");
  module2.exports = exports2 = {
    isObject: isObject2,
    hasOwn,
    getOwnPropertyDescriptors,
    wrapperSymbol,
    implSymbol,
    getSameObject,
    wrapperForImpl,
    implForWrapper,
    tryWrapperForImpl,
    tryImplForWrapper,
    iterInternalSymbol,
    IteratorPrototype,
    isArrayIndexPropName,
    supportsPropertyIndex,
    supportedPropertyIndices,
    supportsPropertyName,
    supportedPropertyNames,
    indexedGet,
    indexedSetNew,
    indexedSetExisting,
    namedGet,
    namedSetNew,
    namedSetExisting,
    namedDelete
  };
});

// node_modules/punycode/punycode.js
var require_punycode = __commonJS((exports2, module2) => {
  "use strict";
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
    overflow: "Overflow: input needs wider integers to process",
    "not-basic": "Illegal input >= 0x80 (not a basic code point)",
    "invalid-input": "Invalid input"
  };
  var baseMinusTMin = base - tMin;
  var floor = Math.floor;
  var stringFromCharCode = String.fromCharCode;
  function error(type) {
    throw new RangeError(errors[type]);
  }
  function map(array, fn) {
    const result = [];
    let length = array.length;
    while (length--) {
      result[length] = fn(array[length]);
    }
    return result;
  }
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
  var ucs2encode = (array) => String.fromCodePoint(...array);
  var basicToDigit = function(codePoint) {
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
  };
  var digitToBasic = function(digit, flag) {
    return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
  };
  var adapt = function(delta, numPoints, firstTime) {
    let k = 0;
    delta = firstTime ? floor(delta / damp) : delta >> 1;
    delta += floor(delta / numPoints);
    for (; delta > baseMinusTMin * tMax >> 1; k += base) {
      delta = floor(delta / baseMinusTMin);
    }
    return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
  };
  var decode = function(input) {
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
  };
  var encode = function(input) {
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
            output.push(stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0)));
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
  };
  var toUnicode = function(input) {
    return mapDomain(input, function(string) {
      return regexPunycode.test(string) ? decode(string.slice(4).toLowerCase()) : string;
    });
  };
  var toASCII = function(input) {
    return mapDomain(input, function(string) {
      return regexNonASCII.test(string) ? "xn--" + encode(string) : string;
    });
  };
  var punycode = {
    version: "2.1.0",
    ucs2: {
      decode: ucs2decode,
      encode: ucs2encode
    },
    decode,
    encode,
    toASCII,
    toUnicode
  };
  module2.exports = punycode;
});

// node_modules/tr46/lib/regexes.js
var require_regexes = __commonJS((exports2, module2) => {
  "use strict";
  var combiningMarks = /[\u0300-\u036F\u0483-\u0489\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u0711\u0730-\u074A\u07A6-\u07B0\u07EB-\u07F3\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u08D4-\u08E1\u08E3-\u0903\u093A-\u093C\u093E-\u094F\u0951-\u0957\u0962\u0963\u0981-\u0983\u09BC\u09BE-\u09C4\u09C7\u09C8\u09CB-\u09CD\u09D7\u09E2\u09E3\u0A01-\u0A03\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A70\u0A71\u0A75\u0A81-\u0A83\u0ABC\u0ABE-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AE2\u0AE3\u0AFA-\u0AFF\u0B01-\u0B03\u0B3C\u0B3E-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B62\u0B63\u0B82\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD7\u0C00-\u0C03\u0C3E-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C81-\u0C83\u0CBC\u0CBE-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CE2\u0CE3\u0D00-\u0D03\u0D3B\u0D3C\u0D3E-\u0D44\u0D46-\u0D48\u0D4A-\u0D4D\u0D57\u0D62\u0D63\u0D82\u0D83\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DF2\u0DF3\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0EB1\u0EB4-\u0EB9\u0EBB\u0EBC\u0EC8-\u0ECD\u0F18\u0F19\u0F35\u0F37\u0F39\u0F3E\u0F3F\u0F71-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102B-\u103E\u1056-\u1059\u105E-\u1060\u1062-\u1064\u1067-\u106D\u1071-\u1074\u1082-\u108D\u108F\u109A-\u109D\u135D-\u135F\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17B4-\u17D3\u17DD\u180B-\u180D\u1885\u1886\u18A9\u1920-\u192B\u1930-\u193B\u1A17-\u1A1B\u1A55-\u1A5E\u1A60-\u1A7C\u1A7F\u1AB0-\u1ABE\u1B00-\u1B04\u1B34-\u1B44\u1B6B-\u1B73\u1B80-\u1B82\u1BA1-\u1BAD\u1BE6-\u1BF3\u1C24-\u1C37\u1CD0-\u1CD2\u1CD4-\u1CE8\u1CED\u1CF2-\u1CF4\u1CF7-\u1CF9\u1DC0-\u1DF9\u1DFB-\u1DFF\u20D0-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302F\u3099\u309A\uA66F-\uA672\uA674-\uA67D\uA69E\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA823-\uA827\uA880\uA881\uA8B4-\uA8C5\uA8E0-\uA8F1\uA926-\uA92D\uA947-\uA953\uA980-\uA983\uA9B3-\uA9C0\uA9E5\uAA29-\uAA36\uAA43\uAA4C\uAA4D\uAA7B-\uAA7D\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEB-\uAAEF\uAAF5\uAAF6\uABE3-\uABEA\uABEC\uABED\uFB1E\uFE00-\uFE0F\uFE20-\uFE2F\u{101FD}\u{102E0}\u{10376}-\u{1037A}\u{10A01}-\u{10A03}\u{10A05}\u{10A06}\u{10A0C}-\u{10A0F}\u{10A38}-\u{10A3A}\u{10A3F}\u{10AE5}\u{10AE6}\u{11000}-\u{11002}\u{11038}-\u{11046}\u{1107F}-\u{11082}\u{110B0}-\u{110BA}\u{11100}-\u{11102}\u{11127}-\u{11134}\u{11173}\u{11180}-\u{11182}\u{111B3}-\u{111C0}\u{111CA}-\u{111CC}\u{1122C}-\u{11237}\u{1123E}\u{112DF}-\u{112EA}\u{11300}-\u{11303}\u{1133C}\u{1133E}-\u{11344}\u{11347}\u{11348}\u{1134B}-\u{1134D}\u{11357}\u{11362}\u{11363}\u{11366}-\u{1136C}\u{11370}-\u{11374}\u{11435}-\u{11446}\u{114B0}-\u{114C3}\u{115AF}-\u{115B5}\u{115B8}-\u{115C0}\u{115DC}\u{115DD}\u{11630}-\u{11640}\u{116AB}-\u{116B7}\u{1171D}-\u{1172B}\u{11A01}-\u{11A0A}\u{11A33}-\u{11A39}\u{11A3B}-\u{11A3E}\u{11A47}\u{11A51}-\u{11A5B}\u{11A8A}-\u{11A99}\u{11C2F}-\u{11C36}\u{11C38}-\u{11C3F}\u{11C92}-\u{11CA7}\u{11CA9}-\u{11CB6}\u{11D31}-\u{11D36}\u{11D3A}\u{11D3C}\u{11D3D}\u{11D3F}-\u{11D45}\u{11D47}\u{16AF0}-\u{16AF4}\u{16B30}-\u{16B36}\u{16F51}-\u{16F7E}\u{16F8F}-\u{16F92}\u{1BC9D}\u{1BC9E}\u{1D165}-\u{1D169}\u{1D16D}-\u{1D172}\u{1D17B}-\u{1D182}\u{1D185}-\u{1D18B}\u{1D1AA}-\u{1D1AD}\u{1D242}-\u{1D244}\u{1DA00}-\u{1DA36}\u{1DA3B}-\u{1DA6C}\u{1DA75}\u{1DA84}\u{1DA9B}-\u{1DA9F}\u{1DAA1}-\u{1DAAF}\u{1E000}-\u{1E006}\u{1E008}-\u{1E018}\u{1E01B}-\u{1E021}\u{1E023}\u{1E024}\u{1E026}-\u{1E02A}\u{1E8D0}-\u{1E8D6}\u{1E944}-\u{1E94A}\u{E0100}-\u{E01EF}]/u;
  var combiningClassVirama = /[\u094D\u09CD\u0A4D\u0ACD\u0B4D\u0BCD\u0C4D\u0CCD\u0D3B\u0D3C\u0D4D\u0DCA\u0E3A\u0F84\u1039\u103A\u1714\u1734\u17D2\u1A60\u1B44\u1BAA\u1BAB\u1BF2\u1BF3\u2D7F\uA806\uA8C4\uA953\uA9C0\uAAF6\uABED\u{10A3F}\u{11046}\u{1107F}\u{110B9}\u{11133}\u{11134}\u{111C0}\u{11235}\u{112EA}\u{1134D}\u{11442}\u{114C2}\u{115BF}\u{1163F}\u{116B6}\u{1172B}\u{11A34}\u{11A47}\u{11A99}\u{11C3F}\u{11D44}\u{11D45}]/u;
  var validZWNJ = /[\u0620\u0626\u0628\u062A-\u062E\u0633-\u063F\u0641-\u0647\u0649\u064A\u066E\u066F\u0678-\u0687\u069A-\u06BF\u06C1\u06C2\u06CC\u06CE\u06D0\u06D1\u06FA-\u06FC\u06FF\u0712-\u0714\u071A-\u071D\u071F-\u0727\u0729\u072B\u072D\u072E\u074E-\u0758\u075C-\u076A\u076D-\u0770\u0772\u0775-\u0777\u077A-\u077F\u07CA-\u07EA\u0841-\u0845\u0848\u084A-\u0853\u0855\u0860\u0862-\u0865\u0868\u08A0-\u08A9\u08AF\u08B0\u08B3\u08B4\u08B6-\u08B8\u08BA-\u08BD\u1807\u1820-\u1877\u1887-\u18A8\u18AA\uA840-\uA872\u{10AC0}-\u{10AC4}\u{10ACD}\u{10AD3}-\u{10ADC}\u{10ADE}-\u{10AE0}\u{10AEB}-\u{10AEE}\u{10B80}\u{10B82}\u{10B86}-\u{10B88}\u{10B8A}\u{10B8B}\u{10B8D}\u{10B90}\u{10BAD}\u{10BAE}\u{1E900}-\u{1E943}][\xAD\u0300-\u036F\u0483-\u0489\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u061C\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u070F\u0711\u0730-\u074A\u07A6-\u07B0\u07EB-\u07F3\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u08D4-\u08E1\u08E3-\u0902\u093A\u093C\u0941-\u0948\u094D\u0951-\u0957\u0962\u0963\u0981\u09BC\u09C1-\u09C4\u09CD\u09E2\u09E3\u0A01\u0A02\u0A3C\u0A41\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A70\u0A71\u0A75\u0A81\u0A82\u0ABC\u0AC1-\u0AC5\u0AC7\u0AC8\u0ACD\u0AE2\u0AE3\u0AFA-\u0AFF\u0B01\u0B3C\u0B3F\u0B41-\u0B44\u0B4D\u0B56\u0B62\u0B63\u0B82\u0BC0\u0BCD\u0C00\u0C3E-\u0C40\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C81\u0CBC\u0CBF\u0CC6\u0CCC\u0CCD\u0CE2\u0CE3\u0D00\u0D01\u0D3B\u0D3C\u0D41-\u0D44\u0D4D\u0D62\u0D63\u0DCA\u0DD2-\u0DD4\u0DD6\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0EB1\u0EB4-\u0EB9\u0EBB\u0EBC\u0EC8-\u0ECD\u0F18\u0F19\u0F35\u0F37\u0F39\u0F71-\u0F7E\u0F80-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102D-\u1030\u1032-\u1037\u1039\u103A\u103D\u103E\u1058\u1059\u105E-\u1060\u1071-\u1074\u1082\u1085\u1086\u108D\u109D\u135D-\u135F\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17B4\u17B5\u17B7-\u17BD\u17C6\u17C9-\u17D3\u17DD\u180B-\u180D\u1885\u1886\u18A9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193B\u1A17\u1A18\u1A1B\u1A56\u1A58-\u1A5E\u1A60\u1A62\u1A65-\u1A6C\u1A73-\u1A7C\u1A7F\u1AB0-\u1ABE\u1B00-\u1B03\u1B34\u1B36-\u1B3A\u1B3C\u1B42\u1B6B-\u1B73\u1B80\u1B81\u1BA2-\u1BA5\u1BA8\u1BA9\u1BAB-\u1BAD\u1BE6\u1BE8\u1BE9\u1BED\u1BEF-\u1BF1\u1C2C-\u1C33\u1C36\u1C37\u1CD0-\u1CD2\u1CD4-\u1CE0\u1CE2-\u1CE8\u1CED\u1CF4\u1CF8\u1CF9\u1DC0-\u1DF9\u1DFB-\u1DFF\u200B\u200E\u200F\u202A-\u202E\u2060-\u2064\u206A-\u206F\u20D0-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302D\u3099\u309A\uA66F-\uA672\uA674-\uA67D\uA69E\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA825\uA826\uA8C4\uA8C5\uA8E0-\uA8F1\uA926-\uA92D\uA947-\uA951\uA980-\uA982\uA9B3\uA9B6-\uA9B9\uA9BC\uA9E5\uAA29-\uAA2E\uAA31\uAA32\uAA35\uAA36\uAA43\uAA4C\uAA7C\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEC\uAAED\uAAF6\uABE5\uABE8\uABED\uFB1E\uFE00-\uFE0F\uFE20-\uFE2F\uFEFF\uFFF9-\uFFFB\u{101FD}\u{102E0}\u{10376}-\u{1037A}\u{10A01}-\u{10A03}\u{10A05}\u{10A06}\u{10A0C}-\u{10A0F}\u{10A38}-\u{10A3A}\u{10A3F}\u{10AE5}\u{10AE6}\u{11001}\u{11038}-\u{11046}\u{1107F}-\u{11081}\u{110B3}-\u{110B6}\u{110B9}\u{110BA}\u{110BD}\u{11100}-\u{11102}\u{11127}-\u{1112B}\u{1112D}-\u{11134}\u{11173}\u{11180}\u{11181}\u{111B6}-\u{111BE}\u{111CA}-\u{111CC}\u{1122F}-\u{11231}\u{11234}\u{11236}\u{11237}\u{1123E}\u{112DF}\u{112E3}-\u{112EA}\u{11300}\u{11301}\u{1133C}\u{11340}\u{11366}-\u{1136C}\u{11370}-\u{11374}\u{11438}-\u{1143F}\u{11442}-\u{11444}\u{11446}\u{114B3}-\u{114B8}\u{114BA}\u{114BF}\u{114C0}\u{114C2}\u{114C3}\u{115B2}-\u{115B5}\u{115BC}\u{115BD}\u{115BF}\u{115C0}\u{115DC}\u{115DD}\u{11633}-\u{1163A}\u{1163D}\u{1163F}\u{11640}\u{116AB}\u{116AD}\u{116B0}-\u{116B5}\u{116B7}\u{1171D}-\u{1171F}\u{11722}-\u{11725}\u{11727}-\u{1172B}\u{11A01}-\u{11A06}\u{11A09}\u{11A0A}\u{11A33}-\u{11A38}\u{11A3B}-\u{11A3E}\u{11A47}\u{11A51}-\u{11A56}\u{11A59}-\u{11A5B}\u{11A8A}-\u{11A96}\u{11A98}\u{11A99}\u{11C30}-\u{11C36}\u{11C38}-\u{11C3D}\u{11C3F}\u{11C92}-\u{11CA7}\u{11CAA}-\u{11CB0}\u{11CB2}\u{11CB3}\u{11CB5}\u{11CB6}\u{11D31}-\u{11D36}\u{11D3A}\u{11D3C}\u{11D3D}\u{11D3F}-\u{11D45}\u{11D47}\u{16AF0}-\u{16AF4}\u{16B30}-\u{16B36}\u{16F8F}-\u{16F92}\u{1BC9D}\u{1BC9E}\u{1BCA0}-\u{1BCA3}\u{1D167}-\u{1D169}\u{1D173}-\u{1D182}\u{1D185}-\u{1D18B}\u{1D1AA}-\u{1D1AD}\u{1D242}-\u{1D244}\u{1DA00}-\u{1DA36}\u{1DA3B}-\u{1DA6C}\u{1DA75}\u{1DA84}\u{1DA9B}-\u{1DA9F}\u{1DAA1}-\u{1DAAF}\u{1E000}-\u{1E006}\u{1E008}-\u{1E018}\u{1E01B}-\u{1E021}\u{1E023}\u{1E024}\u{1E026}-\u{1E02A}\u{1E8D0}-\u{1E8D6}\u{1E944}-\u{1E94A}\u{E0001}\u{E0020}-\u{E007F}\u{E0100}-\u{E01EF}]*\u200C[\xAD\u0300-\u036F\u0483-\u0489\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u061C\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u070F\u0711\u0730-\u074A\u07A6-\u07B0\u07EB-\u07F3\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u08D4-\u08E1\u08E3-\u0902\u093A\u093C\u0941-\u0948\u094D\u0951-\u0957\u0962\u0963\u0981\u09BC\u09C1-\u09C4\u09CD\u09E2\u09E3\u0A01\u0A02\u0A3C\u0A41\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A70\u0A71\u0A75\u0A81\u0A82\u0ABC\u0AC1-\u0AC5\u0AC7\u0AC8\u0ACD\u0AE2\u0AE3\u0AFA-\u0AFF\u0B01\u0B3C\u0B3F\u0B41-\u0B44\u0B4D\u0B56\u0B62\u0B63\u0B82\u0BC0\u0BCD\u0C00\u0C3E-\u0C40\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C81\u0CBC\u0CBF\u0CC6\u0CCC\u0CCD\u0CE2\u0CE3\u0D00\u0D01\u0D3B\u0D3C\u0D41-\u0D44\u0D4D\u0D62\u0D63\u0DCA\u0DD2-\u0DD4\u0DD6\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0EB1\u0EB4-\u0EB9\u0EBB\u0EBC\u0EC8-\u0ECD\u0F18\u0F19\u0F35\u0F37\u0F39\u0F71-\u0F7E\u0F80-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102D-\u1030\u1032-\u1037\u1039\u103A\u103D\u103E\u1058\u1059\u105E-\u1060\u1071-\u1074\u1082\u1085\u1086\u108D\u109D\u135D-\u135F\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17B4\u17B5\u17B7-\u17BD\u17C6\u17C9-\u17D3\u17DD\u180B-\u180D\u1885\u1886\u18A9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193B\u1A17\u1A18\u1A1B\u1A56\u1A58-\u1A5E\u1A60\u1A62\u1A65-\u1A6C\u1A73-\u1A7C\u1A7F\u1AB0-\u1ABE\u1B00-\u1B03\u1B34\u1B36-\u1B3A\u1B3C\u1B42\u1B6B-\u1B73\u1B80\u1B81\u1BA2-\u1BA5\u1BA8\u1BA9\u1BAB-\u1BAD\u1BE6\u1BE8\u1BE9\u1BED\u1BEF-\u1BF1\u1C2C-\u1C33\u1C36\u1C37\u1CD0-\u1CD2\u1CD4-\u1CE0\u1CE2-\u1CE8\u1CED\u1CF4\u1CF8\u1CF9\u1DC0-\u1DF9\u1DFB-\u1DFF\u200B\u200E\u200F\u202A-\u202E\u2060-\u2064\u206A-\u206F\u20D0-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302D\u3099\u309A\uA66F-\uA672\uA674-\uA67D\uA69E\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA825\uA826\uA8C4\uA8C5\uA8E0-\uA8F1\uA926-\uA92D\uA947-\uA951\uA980-\uA982\uA9B3\uA9B6-\uA9B9\uA9BC\uA9E5\uAA29-\uAA2E\uAA31\uAA32\uAA35\uAA36\uAA43\uAA4C\uAA7C\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEC\uAAED\uAAF6\uABE5\uABE8\uABED\uFB1E\uFE00-\uFE0F\uFE20-\uFE2F\uFEFF\uFFF9-\uFFFB\u{101FD}\u{102E0}\u{10376}-\u{1037A}\u{10A01}-\u{10A03}\u{10A05}\u{10A06}\u{10A0C}-\u{10A0F}\u{10A38}-\u{10A3A}\u{10A3F}\u{10AE5}\u{10AE6}\u{11001}\u{11038}-\u{11046}\u{1107F}-\u{11081}\u{110B3}-\u{110B6}\u{110B9}\u{110BA}\u{110BD}\u{11100}-\u{11102}\u{11127}-\u{1112B}\u{1112D}-\u{11134}\u{11173}\u{11180}\u{11181}\u{111B6}-\u{111BE}\u{111CA}-\u{111CC}\u{1122F}-\u{11231}\u{11234}\u{11236}\u{11237}\u{1123E}\u{112DF}\u{112E3}-\u{112EA}\u{11300}\u{11301}\u{1133C}\u{11340}\u{11366}-\u{1136C}\u{11370}-\u{11374}\u{11438}-\u{1143F}\u{11442}-\u{11444}\u{11446}\u{114B3}-\u{114B8}\u{114BA}\u{114BF}\u{114C0}\u{114C2}\u{114C3}\u{115B2}-\u{115B5}\u{115BC}\u{115BD}\u{115BF}\u{115C0}\u{115DC}\u{115DD}\u{11633}-\u{1163A}\u{1163D}\u{1163F}\u{11640}\u{116AB}\u{116AD}\u{116B0}-\u{116B5}\u{116B7}\u{1171D}-\u{1171F}\u{11722}-\u{11725}\u{11727}-\u{1172B}\u{11A01}-\u{11A06}\u{11A09}\u{11A0A}\u{11A33}-\u{11A38}\u{11A3B}-\u{11A3E}\u{11A47}\u{11A51}-\u{11A56}\u{11A59}-\u{11A5B}\u{11A8A}-\u{11A96}\u{11A98}\u{11A99}\u{11C30}-\u{11C36}\u{11C38}-\u{11C3D}\u{11C3F}\u{11C92}-\u{11CA7}\u{11CAA}-\u{11CB0}\u{11CB2}\u{11CB3}\u{11CB5}\u{11CB6}\u{11D31}-\u{11D36}\u{11D3A}\u{11D3C}\u{11D3D}\u{11D3F}-\u{11D45}\u{11D47}\u{16AF0}-\u{16AF4}\u{16B30}-\u{16B36}\u{16F8F}-\u{16F92}\u{1BC9D}\u{1BC9E}\u{1BCA0}-\u{1BCA3}\u{1D167}-\u{1D169}\u{1D173}-\u{1D182}\u{1D185}-\u{1D18B}\u{1D1AA}-\u{1D1AD}\u{1D242}-\u{1D244}\u{1DA00}-\u{1DA36}\u{1DA3B}-\u{1DA6C}\u{1DA75}\u{1DA84}\u{1DA9B}-\u{1DA9F}\u{1DAA1}-\u{1DAAF}\u{1E000}-\u{1E006}\u{1E008}-\u{1E018}\u{1E01B}-\u{1E021}\u{1E023}\u{1E024}\u{1E026}-\u{1E02A}\u{1E8D0}-\u{1E8D6}\u{1E944}-\u{1E94A}\u{E0001}\u{E0020}-\u{E007F}\u{E0100}-\u{E01EF}]*[\u0620\u0622-\u063F\u0641-\u064A\u066E\u066F\u0671-\u0673\u0675-\u06D3\u06D5\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u077F\u07CA-\u07EA\u0840-\u0855\u0860\u0862-\u0865\u0867-\u086A\u08A0-\u08AC\u08AE-\u08B4\u08B6-\u08BD\u1807\u1820-\u1877\u1887-\u18A8\u18AA\uA840-\uA871\u{10AC0}-\u{10AC5}\u{10AC7}\u{10AC9}\u{10ACA}\u{10ACE}-\u{10AD6}\u{10AD8}-\u{10AE1}\u{10AE4}\u{10AEB}-\u{10AEF}\u{10B80}-\u{10B91}\u{10BA9}-\u{10BAE}\u{1E900}-\u{1E943}]/u;
  var bidiDomain = /[\u05BE\u05C0\u05C3\u05C6\u05D0-\u05EA\u05F0-\u05F4\u0600-\u0605\u0608\u060B\u060D\u061B\u061C\u061E-\u064A\u0660-\u0669\u066B-\u066F\u0671-\u06D5\u06DD\u06E5\u06E6\u06EE\u06EF\u06FA-\u070D\u070F\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07C0-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0830-\u083E\u0840-\u0858\u085E\u0860-\u086A\u08A0-\u08B4\u08B6-\u08BD\u08E2\u200F\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBC1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFC\uFE70-\uFE74\uFE76-\uFEFC\u{10800}-\u{10805}\u{10808}\u{1080A}-\u{10835}\u{10837}\u{10838}\u{1083C}\u{1083F}-\u{10855}\u{10857}-\u{1089E}\u{108A7}-\u{108AF}\u{108E0}-\u{108F2}\u{108F4}\u{108F5}\u{108FB}-\u{1091B}\u{10920}-\u{10939}\u{1093F}\u{10980}-\u{109B7}\u{109BC}-\u{109CF}\u{109D2}-\u{10A00}\u{10A10}-\u{10A13}\u{10A15}-\u{10A17}\u{10A19}-\u{10A33}\u{10A40}-\u{10A47}\u{10A50}-\u{10A58}\u{10A60}-\u{10A9F}\u{10AC0}-\u{10AE4}\u{10AEB}-\u{10AF6}\u{10B00}-\u{10B35}\u{10B40}-\u{10B55}\u{10B58}-\u{10B72}\u{10B78}-\u{10B91}\u{10B99}-\u{10B9C}\u{10BA9}-\u{10BAF}\u{10C00}-\u{10C48}\u{10C80}-\u{10CB2}\u{10CC0}-\u{10CF2}\u{10CFA}-\u{10CFF}\u{10E60}-\u{10E7E}\u{1E800}-\u{1E8C4}\u{1E8C7}-\u{1E8CF}\u{1E900}-\u{1E943}\u{1E950}-\u{1E959}\u{1E95E}\u{1E95F}\u{1EE00}-\u{1EE03}\u{1EE05}-\u{1EE1F}\u{1EE21}\u{1EE22}\u{1EE24}\u{1EE27}\u{1EE29}-\u{1EE32}\u{1EE34}-\u{1EE37}\u{1EE39}\u{1EE3B}\u{1EE42}\u{1EE47}\u{1EE49}\u{1EE4B}\u{1EE4D}-\u{1EE4F}\u{1EE51}\u{1EE52}\u{1EE54}\u{1EE57}\u{1EE59}\u{1EE5B}\u{1EE5D}\u{1EE5F}\u{1EE61}\u{1EE62}\u{1EE64}\u{1EE67}-\u{1EE6A}\u{1EE6C}-\u{1EE72}\u{1EE74}-\u{1EE77}\u{1EE79}-\u{1EE7C}\u{1EE7E}\u{1EE80}-\u{1EE89}\u{1EE8B}-\u{1EE9B}\u{1EEA1}-\u{1EEA3}\u{1EEA5}-\u{1EEA9}\u{1EEAB}-\u{1EEBB}]/u;
  var bidiS1LTR = /[A-Za-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02B8\u02BB-\u02C1\u02D0\u02D1\u02E0-\u02E4\u02EE\u0370-\u0373\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0482\u048A-\u052F\u0531-\u0556\u0559-\u055F\u0561-\u0587\u0589\u0903-\u0939\u093B\u093D-\u0940\u0949-\u094C\u094E-\u0950\u0958-\u0961\u0964-\u0980\u0982\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD-\u09C0\u09C7\u09C8\u09CB\u09CC\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E1\u09E6-\u09F1\u09F4-\u09FA\u09FC\u09FD\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3E-\u0A40\u0A59-\u0A5C\u0A5E\u0A66-\u0A6F\u0A72-\u0A74\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD-\u0AC0\u0AC9\u0ACB\u0ACC\u0AD0\u0AE0\u0AE1\u0AE6-\u0AF0\u0AF9\u0B02\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B3E\u0B40\u0B47\u0B48\u0B4B\u0B4C\u0B57\u0B5C\u0B5D\u0B5F-\u0B61\u0B66-\u0B77\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE\u0BBF\u0BC1\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCC\u0BD0\u0BD7\u0BE6-\u0BF2\u0C01-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C41-\u0C44\u0C58-\u0C5A\u0C60\u0C61\u0C66-\u0C6F\u0C7F\u0C80\u0C82\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD-\u0CC4\u0CC6-\u0CC8\u0CCA\u0CCB\u0CD5\u0CD6\u0CDE\u0CE0\u0CE1\u0CE6-\u0CEF\u0CF1\u0CF2\u0D02\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D40\u0D46-\u0D48\u0D4A-\u0D4C\u0D4E\u0D4F\u0D54-\u0D61\u0D66-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCF-\u0DD1\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2-\u0DF4\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E4F-\u0E5B\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00-\u0F17\u0F1A-\u0F34\u0F36\u0F38\u0F3E-\u0F47\u0F49-\u0F6C\u0F7F\u0F85\u0F88-\u0F8C\u0FBE-\u0FC5\u0FC7-\u0FCC\u0FCE-\u0FDA\u1000-\u102C\u1031\u1038\u103B\u103C\u103F-\u1057\u105A-\u105D\u1061-\u1070\u1075-\u1081\u1083\u1084\u1087-\u108C\u108E-\u109C\u109E-\u10C5\u10C7\u10CD\u10D0-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1360-\u137C\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u167F\u1681-\u169A\u16A0-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1735\u1736\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17B6\u17BE-\u17C5\u17C7\u17C8\u17D4-\u17DA\u17DC\u17E0-\u17E9\u1810-\u1819\u1820-\u1877\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1923-\u1926\u1929-\u192B\u1930\u1931\u1933-\u1938\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19DA\u1A00-\u1A16\u1A19\u1A1A\u1A1E-\u1A55\u1A57\u1A61\u1A63\u1A64\u1A6D-\u1A72\u1A80-\u1A89\u1A90-\u1A99\u1AA0-\u1AAD\u1B04-\u1B33\u1B35\u1B3B\u1B3D-\u1B41\u1B43-\u1B4B\u1B50-\u1B6A\u1B74-\u1B7C\u1B82-\u1BA1\u1BA6\u1BA7\u1BAA\u1BAE-\u1BE5\u1BE7\u1BEA-\u1BEC\u1BEE\u1BF2\u1BF3\u1BFC-\u1C2B\u1C34\u1C35\u1C3B-\u1C49\u1C4D-\u1C88\u1CC0-\u1CC7\u1CD3\u1CE1\u1CE9-\u1CEC\u1CEE-\u1CF3\u1CF5-\u1CF7\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200E\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u214F\u2160-\u2188\u2336-\u237A\u2395\u249C-\u24E9\u26AC\u2800-\u28FF\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D70\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3005-\u3007\u3021-\u3029\u302E\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312E\u3131-\u318E\u3190-\u31BA\u31F0-\u321C\u3220-\u324F\u3260-\u327B\u327F-\u32B0\u32C0-\u32CB\u32D0-\u32FE\u3300-\u3376\u337B-\u33DD\u33E0-\u33FE\u3400-\u4DB5\u4E00-\u9FEA\uA000-\uA48C\uA4D0-\uA60C\uA610-\uA62B\uA640-\uA66E\uA680-\uA69D\uA6A0-\uA6EF\uA6F2-\uA6F7\uA722-\uA787\uA789-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA824\uA827\uA830-\uA837\uA840-\uA873\uA880-\uA8C3\uA8CE-\uA8D9\uA8F2-\uA8FD\uA900-\uA925\uA92E-\uA946\uA952\uA953\uA95F-\uA97C\uA983-\uA9B2\uA9B4\uA9B5\uA9BA\uA9BB\uA9BD-\uA9CD\uA9CF-\uA9D9\uA9DE-\uA9E4\uA9E6-\uA9FE\uAA00-\uAA28\uAA2F\uAA30\uAA33\uAA34\uAA40-\uAA42\uAA44-\uAA4B\uAA4D\uAA50-\uAA59\uAA5C-\uAA7B\uAA7D-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAAEB\uAAEE-\uAAF5\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB65\uAB70-\uABE4\uABE6\uABE7\uABE9-\uABEC\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uD800-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC\u{10000}-\u{1000B}\u{1000D}-\u{10026}\u{10028}-\u{1003A}\u{1003C}\u{1003D}\u{1003F}-\u{1004D}\u{10050}-\u{1005D}\u{10080}-\u{100FA}\u{10100}\u{10102}\u{10107}-\u{10133}\u{10137}-\u{1013F}\u{1018D}\u{1018E}\u{101D0}-\u{101FC}\u{10280}-\u{1029C}\u{102A0}-\u{102D0}\u{10300}-\u{10323}\u{1032D}-\u{1034A}\u{10350}-\u{10375}\u{10380}-\u{1039D}\u{1039F}-\u{103C3}\u{103C8}-\u{103D5}\u{10400}-\u{1049D}\u{104A0}-\u{104A9}\u{104B0}-\u{104D3}\u{104D8}-\u{104FB}\u{10500}-\u{10527}\u{10530}-\u{10563}\u{1056F}\u{10600}-\u{10736}\u{10740}-\u{10755}\u{10760}-\u{10767}\u{11000}\u{11002}-\u{11037}\u{11047}-\u{1104D}\u{11066}-\u{1106F}\u{11082}-\u{110B2}\u{110B7}\u{110B8}\u{110BB}-\u{110C1}\u{110D0}-\u{110E8}\u{110F0}-\u{110F9}\u{11103}-\u{11126}\u{1112C}\u{11136}-\u{11143}\u{11150}-\u{11172}\u{11174}-\u{11176}\u{11182}-\u{111B5}\u{111BF}-\u{111C9}\u{111CD}\u{111D0}-\u{111DF}\u{111E1}-\u{111F4}\u{11200}-\u{11211}\u{11213}-\u{1122E}\u{11232}\u{11233}\u{11235}\u{11238}-\u{1123D}\u{11280}-\u{11286}\u{11288}\u{1128A}-\u{1128D}\u{1128F}-\u{1129D}\u{1129F}-\u{112A9}\u{112B0}-\u{112DE}\u{112E0}-\u{112E2}\u{112F0}-\u{112F9}\u{11302}\u{11303}\u{11305}-\u{1130C}\u{1130F}\u{11310}\u{11313}-\u{11328}\u{1132A}-\u{11330}\u{11332}\u{11333}\u{11335}-\u{11339}\u{1133D}-\u{1133F}\u{11341}-\u{11344}\u{11347}\u{11348}\u{1134B}-\u{1134D}\u{11350}\u{11357}\u{1135D}-\u{11363}\u{11400}-\u{11437}\u{11440}\u{11441}\u{11445}\u{11447}-\u{11459}\u{1145B}\u{1145D}\u{11480}-\u{114B2}\u{114B9}\u{114BB}-\u{114BE}\u{114C1}\u{114C4}-\u{114C7}\u{114D0}-\u{114D9}\u{11580}-\u{115B1}\u{115B8}-\u{115BB}\u{115BE}\u{115C1}-\u{115DB}\u{11600}-\u{11632}\u{1163B}\u{1163C}\u{1163E}\u{11641}-\u{11644}\u{11650}-\u{11659}\u{11680}-\u{116AA}\u{116AC}\u{116AE}\u{116AF}\u{116B6}\u{116C0}-\u{116C9}\u{11700}-\u{11719}\u{11720}\u{11721}\u{11726}\u{11730}-\u{1173F}\u{118A0}-\u{118F2}\u{118FF}\u{11A00}\u{11A07}\u{11A08}\u{11A0B}-\u{11A32}\u{11A39}\u{11A3A}\u{11A3F}-\u{11A46}\u{11A50}\u{11A57}\u{11A58}\u{11A5C}-\u{11A83}\u{11A86}-\u{11A89}\u{11A97}\u{11A9A}-\u{11A9C}\u{11A9E}-\u{11AA2}\u{11AC0}-\u{11AF8}\u{11C00}-\u{11C08}\u{11C0A}-\u{11C2F}\u{11C3E}-\u{11C45}\u{11C50}-\u{11C6C}\u{11C70}-\u{11C8F}\u{11CA9}\u{11CB1}\u{11CB4}\u{11D00}-\u{11D06}\u{11D08}\u{11D09}\u{11D0B}-\u{11D30}\u{11D46}\u{11D50}-\u{11D59}\u{12000}-\u{12399}\u{12400}-\u{1246E}\u{12470}-\u{12474}\u{12480}-\u{12543}\u{13000}-\u{1342E}\u{14400}-\u{14646}\u{16800}-\u{16A38}\u{16A40}-\u{16A5E}\u{16A60}-\u{16A69}\u{16A6E}\u{16A6F}\u{16AD0}-\u{16AED}\u{16AF5}\u{16B00}-\u{16B2F}\u{16B37}-\u{16B45}\u{16B50}-\u{16B59}\u{16B5B}-\u{16B61}\u{16B63}-\u{16B77}\u{16B7D}-\u{16B8F}\u{16F00}-\u{16F44}\u{16F50}-\u{16F7E}\u{16F93}-\u{16F9F}\u{16FE0}\u{16FE1}\u{17000}-\u{187EC}\u{18800}-\u{18AF2}\u{1B000}-\u{1B11E}\u{1B170}-\u{1B2FB}\u{1BC00}-\u{1BC6A}\u{1BC70}-\u{1BC7C}\u{1BC80}-\u{1BC88}\u{1BC90}-\u{1BC99}\u{1BC9C}\u{1BC9F}\u{1D000}-\u{1D0F5}\u{1D100}-\u{1D126}\u{1D129}-\u{1D166}\u{1D16A}-\u{1D172}\u{1D183}\u{1D184}\u{1D18C}-\u{1D1A9}\u{1D1AE}-\u{1D1E8}\u{1D360}-\u{1D371}\u{1D400}-\u{1D454}\u{1D456}-\u{1D49C}\u{1D49E}\u{1D49F}\u{1D4A2}\u{1D4A5}\u{1D4A6}\u{1D4A9}-\u{1D4AC}\u{1D4AE}-\u{1D4B9}\u{1D4BB}\u{1D4BD}-\u{1D4C3}\u{1D4C5}-\u{1D505}\u{1D507}-\u{1D50A}\u{1D50D}-\u{1D514}\u{1D516}-\u{1D51C}\u{1D51E}-\u{1D539}\u{1D53B}-\u{1D53E}\u{1D540}-\u{1D544}\u{1D546}\u{1D54A}-\u{1D550}\u{1D552}-\u{1D6A5}\u{1D6A8}-\u{1D6DA}\u{1D6DC}-\u{1D714}\u{1D716}-\u{1D74E}\u{1D750}-\u{1D788}\u{1D78A}-\u{1D7C2}\u{1D7C4}-\u{1D7CB}\u{1D800}-\u{1D9FF}\u{1DA37}-\u{1DA3A}\u{1DA6D}-\u{1DA74}\u{1DA76}-\u{1DA83}\u{1DA85}-\u{1DA8B}\u{1F110}-\u{1F12E}\u{1F130}-\u{1F169}\u{1F170}-\u{1F1AC}\u{1F1E6}-\u{1F202}\u{1F210}-\u{1F23B}\u{1F240}-\u{1F248}\u{1F250}\u{1F251}\u{20000}-\u{2A6D6}\u{2A700}-\u{2B734}\u{2B740}-\u{2B81D}\u{2B820}-\u{2CEA1}\u{2CEB0}-\u{2EBE0}\u{2F800}-\u{2FA1D}\u{F0000}-\u{FFFFD}\u{100000}-\u{10FFFD}]/u;
  var bidiS1RTL = /[\u05BE\u05C0\u05C3\u05C6\u05D0-\u05EA\u05F0-\u05F4\u0608\u060B\u060D\u061B\u061C\u061E-\u064A\u066D-\u066F\u0671-\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u070D\u070F\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07C0-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0830-\u083E\u0840-\u0858\u085E\u0860-\u086A\u08A0-\u08B4\u08B6-\u08BD\u200F\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBC1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFC\uFE70-\uFE74\uFE76-\uFEFC\u{10800}-\u{10805}\u{10808}\u{1080A}-\u{10835}\u{10837}\u{10838}\u{1083C}\u{1083F}-\u{10855}\u{10857}-\u{1089E}\u{108A7}-\u{108AF}\u{108E0}-\u{108F2}\u{108F4}\u{108F5}\u{108FB}-\u{1091B}\u{10920}-\u{10939}\u{1093F}\u{10980}-\u{109B7}\u{109BC}-\u{109CF}\u{109D2}-\u{10A00}\u{10A10}-\u{10A13}\u{10A15}-\u{10A17}\u{10A19}-\u{10A33}\u{10A40}-\u{10A47}\u{10A50}-\u{10A58}\u{10A60}-\u{10A9F}\u{10AC0}-\u{10AE4}\u{10AEB}-\u{10AF6}\u{10B00}-\u{10B35}\u{10B40}-\u{10B55}\u{10B58}-\u{10B72}\u{10B78}-\u{10B91}\u{10B99}-\u{10B9C}\u{10BA9}-\u{10BAF}\u{10C00}-\u{10C48}\u{10C80}-\u{10CB2}\u{10CC0}-\u{10CF2}\u{10CFA}-\u{10CFF}\u{1E800}-\u{1E8C4}\u{1E8C7}-\u{1E8CF}\u{1E900}-\u{1E943}\u{1E950}-\u{1E959}\u{1E95E}\u{1E95F}\u{1EE00}-\u{1EE03}\u{1EE05}-\u{1EE1F}\u{1EE21}\u{1EE22}\u{1EE24}\u{1EE27}\u{1EE29}-\u{1EE32}\u{1EE34}-\u{1EE37}\u{1EE39}\u{1EE3B}\u{1EE42}\u{1EE47}\u{1EE49}\u{1EE4B}\u{1EE4D}-\u{1EE4F}\u{1EE51}\u{1EE52}\u{1EE54}\u{1EE57}\u{1EE59}\u{1EE5B}\u{1EE5D}\u{1EE5F}\u{1EE61}\u{1EE62}\u{1EE64}\u{1EE67}-\u{1EE6A}\u{1EE6C}-\u{1EE72}\u{1EE74}-\u{1EE77}\u{1EE79}-\u{1EE7C}\u{1EE7E}\u{1EE80}-\u{1EE89}\u{1EE8B}-\u{1EE9B}\u{1EEA1}-\u{1EEA3}\u{1EEA5}-\u{1EEA9}\u{1EEAB}-\u{1EEBB}]/u;
  var bidiS2 = /^[\0-\x08\x0E-\x1B!-@\[-`\{-\x84\x86-\xA9\xAB-\xB4\xB6-\xB9\xBB-\xBF\xD7\xF7\u02B9\u02BA\u02C2-\u02CF\u02D2-\u02DF\u02E5-\u02ED\u02EF-\u036F\u0374\u0375\u037E\u0384\u0385\u0387\u03F6\u0483-\u0489\u058A\u058D-\u058F\u0591-\u05C7\u05D0-\u05EA\u05F0-\u05F4\u0600-\u061C\u061E-\u070D\u070F-\u074A\u074D-\u07B1\u07C0-\u07FA\u0800-\u082D\u0830-\u083E\u0840-\u085B\u085E\u0860-\u086A\u08A0-\u08B4\u08B6-\u08BD\u08D4-\u0902\u093A\u093C\u0941-\u0948\u094D\u0951-\u0957\u0962\u0963\u0981\u09BC\u09C1-\u09C4\u09CD\u09E2\u09E3\u09F2\u09F3\u09FB\u0A01\u0A02\u0A3C\u0A41\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A70\u0A71\u0A75\u0A81\u0A82\u0ABC\u0AC1-\u0AC5\u0AC7\u0AC8\u0ACD\u0AE2\u0AE3\u0AF1\u0AFA-\u0AFF\u0B01\u0B3C\u0B3F\u0B41-\u0B44\u0B4D\u0B56\u0B62\u0B63\u0B82\u0BC0\u0BCD\u0BF3-\u0BFA\u0C00\u0C3E-\u0C40\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C78-\u0C7E\u0C81\u0CBC\u0CCC\u0CCD\u0CE2\u0CE3\u0D00\u0D01\u0D3B\u0D3C\u0D41-\u0D44\u0D4D\u0D62\u0D63\u0DCA\u0DD2-\u0DD4\u0DD6\u0E31\u0E34-\u0E3A\u0E3F\u0E47-\u0E4E\u0EB1\u0EB4-\u0EB9\u0EBB\u0EBC\u0EC8-\u0ECD\u0F18\u0F19\u0F35\u0F37\u0F39-\u0F3D\u0F71-\u0F7E\u0F80-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102D-\u1030\u1032-\u1037\u1039\u103A\u103D\u103E\u1058\u1059\u105E-\u1060\u1071-\u1074\u1082\u1085\u1086\u108D\u109D\u135D-\u135F\u1390-\u1399\u1400\u169B\u169C\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17B4\u17B5\u17B7-\u17BD\u17C6\u17C9-\u17D3\u17DB\u17DD\u17F0-\u17F9\u1800-\u180E\u1885\u1886\u18A9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193B\u1940\u1944\u1945\u19DE-\u19FF\u1A17\u1A18\u1A1B\u1A56\u1A58-\u1A5E\u1A60\u1A62\u1A65-\u1A6C\u1A73-\u1A7C\u1A7F\u1AB0-\u1ABE\u1B00-\u1B03\u1B34\u1B36-\u1B3A\u1B3C\u1B42\u1B6B-\u1B73\u1B80\u1B81\u1BA2-\u1BA5\u1BA8\u1BA9\u1BAB-\u1BAD\u1BE6\u1BE8\u1BE9\u1BED\u1BEF-\u1BF1\u1C2C-\u1C33\u1C36\u1C37\u1CD0-\u1CD2\u1CD4-\u1CE0\u1CE2-\u1CE8\u1CED\u1CF4\u1CF8\u1CF9\u1DC0-\u1DF9\u1DFB-\u1DFF\u1FBD\u1FBF-\u1FC1\u1FCD-\u1FCF\u1FDD-\u1FDF\u1FED-\u1FEF\u1FFD\u1FFE\u200B-\u200D\u200F-\u2027\u202F-\u205E\u2060-\u2064\u206A-\u2070\u2074-\u207E\u2080-\u208E\u20A0-\u20BF\u20D0-\u20F0\u2100\u2101\u2103-\u2106\u2108\u2109\u2114\u2116-\u2118\u211E-\u2123\u2125\u2127\u2129\u212E\u213A\u213B\u2140-\u2144\u214A-\u214D\u2150-\u215F\u2189-\u218B\u2190-\u2335\u237B-\u2394\u2396-\u2426\u2440-\u244A\u2460-\u249B\u24EA-\u26AB\u26AD-\u27FF\u2900-\u2B73\u2B76-\u2B95\u2B98-\u2BB9\u2BBD-\u2BC8\u2BCA-\u2BD2\u2BEC-\u2BEF\u2CE5-\u2CEA\u2CEF-\u2CF1\u2CF9-\u2CFF\u2D7F\u2DE0-\u2E49\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u2FF0-\u2FFB\u3001-\u3004\u3008-\u3020\u302A-\u302D\u3030\u3036\u3037\u303D-\u303F\u3099-\u309C\u30A0\u30FB\u31C0-\u31E3\u321D\u321E\u3250-\u325F\u327C-\u327E\u32B1-\u32BF\u32CC-\u32CF\u3377-\u337A\u33DE\u33DF\u33FF\u4DC0-\u4DFF\uA490-\uA4C6\uA60D-\uA60F\uA66F-\uA67F\uA69E\uA69F\uA6F0\uA6F1\uA700-\uA721\uA788\uA802\uA806\uA80B\uA825\uA826\uA828-\uA82B\uA838\uA839\uA874-\uA877\uA8C4\uA8C5\uA8E0-\uA8F1\uA926-\uA92D\uA947-\uA951\uA980-\uA982\uA9B3\uA9B6-\uA9B9\uA9BC\uA9E5\uAA29-\uAA2E\uAA31\uAA32\uAA35\uAA36\uAA43\uAA4C\uAA7C\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEC\uAAED\uAAF6\uABE5\uABE8\uABED\uFB1D-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBC1\uFBD3-\uFD3F\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFD\uFE00-\uFE19\uFE20-\uFE52\uFE54-\uFE66\uFE68-\uFE6B\uFE70-\uFE74\uFE76-\uFEFC\uFEFF\uFF01-\uFF20\uFF3B-\uFF40\uFF5B-\uFF65\uFFE0-\uFFE6\uFFE8-\uFFEE\uFFF9-\uFFFD\u{10101}\u{10140}-\u{1018C}\u{10190}-\u{1019B}\u{101A0}\u{101FD}\u{102E0}-\u{102FB}\u{10376}-\u{1037A}\u{10800}-\u{10805}\u{10808}\u{1080A}-\u{10835}\u{10837}\u{10838}\u{1083C}\u{1083F}-\u{10855}\u{10857}-\u{1089E}\u{108A7}-\u{108AF}\u{108E0}-\u{108F2}\u{108F4}\u{108F5}\u{108FB}-\u{1091B}\u{1091F}-\u{10939}\u{1093F}\u{10980}-\u{109B7}\u{109BC}-\u{109CF}\u{109D2}-\u{10A03}\u{10A05}\u{10A06}\u{10A0C}-\u{10A13}\u{10A15}-\u{10A17}\u{10A19}-\u{10A33}\u{10A38}-\u{10A3A}\u{10A3F}-\u{10A47}\u{10A50}-\u{10A58}\u{10A60}-\u{10A9F}\u{10AC0}-\u{10AE6}\u{10AEB}-\u{10AF6}\u{10B00}-\u{10B35}\u{10B39}-\u{10B55}\u{10B58}-\u{10B72}\u{10B78}-\u{10B91}\u{10B99}-\u{10B9C}\u{10BA9}-\u{10BAF}\u{10C00}-\u{10C48}\u{10C80}-\u{10CB2}\u{10CC0}-\u{10CF2}\u{10CFA}-\u{10CFF}\u{10E60}-\u{10E7E}\u{11001}\u{11038}-\u{11046}\u{11052}-\u{11065}\u{1107F}-\u{11081}\u{110B3}-\u{110B6}\u{110B9}\u{110BA}\u{11100}-\u{11102}\u{11127}-\u{1112B}\u{1112D}-\u{11134}\u{11173}\u{11180}\u{11181}\u{111B6}-\u{111BE}\u{111CA}-\u{111CC}\u{1122F}-\u{11231}\u{11234}\u{11236}\u{11237}\u{1123E}\u{112DF}\u{112E3}-\u{112EA}\u{11300}\u{11301}\u{1133C}\u{11340}\u{11366}-\u{1136C}\u{11370}-\u{11374}\u{11438}-\u{1143F}\u{11442}-\u{11444}\u{11446}\u{114B3}-\u{114B8}\u{114BA}\u{114BF}\u{114C0}\u{114C2}\u{114C3}\u{115B2}-\u{115B5}\u{115BC}\u{115BD}\u{115BF}\u{115C0}\u{115DC}\u{115DD}\u{11633}-\u{1163A}\u{1163D}\u{1163F}\u{11640}\u{11660}-\u{1166C}\u{116AB}\u{116AD}\u{116B0}-\u{116B5}\u{116B7}\u{1171D}-\u{1171F}\u{11722}-\u{11725}\u{11727}-\u{1172B}\u{11A01}-\u{11A06}\u{11A09}\u{11A0A}\u{11A33}-\u{11A38}\u{11A3B}-\u{11A3E}\u{11A47}\u{11A51}-\u{11A56}\u{11A59}-\u{11A5B}\u{11A8A}-\u{11A96}\u{11A98}\u{11A99}\u{11C30}-\u{11C36}\u{11C38}-\u{11C3D}\u{11C92}-\u{11CA7}\u{11CAA}-\u{11CB0}\u{11CB2}\u{11CB3}\u{11CB5}\u{11CB6}\u{11D31}-\u{11D36}\u{11D3A}\u{11D3C}\u{11D3D}\u{11D3F}-\u{11D45}\u{11D47}\u{16AF0}-\u{16AF4}\u{16B30}-\u{16B36}\u{16F8F}-\u{16F92}\u{1BC9D}\u{1BC9E}\u{1BCA0}-\u{1BCA3}\u{1D167}-\u{1D169}\u{1D173}-\u{1D182}\u{1D185}-\u{1D18B}\u{1D1AA}-\u{1D1AD}\u{1D200}-\u{1D245}\u{1D300}-\u{1D356}\u{1D6DB}\u{1D715}\u{1D74F}\u{1D789}\u{1D7C3}\u{1D7CE}-\u{1D7FF}\u{1DA00}-\u{1DA36}\u{1DA3B}-\u{1DA6C}\u{1DA75}\u{1DA84}\u{1DA9B}-\u{1DA9F}\u{1DAA1}-\u{1DAAF}\u{1E000}-\u{1E006}\u{1E008}-\u{1E018}\u{1E01B}-\u{1E021}\u{1E023}\u{1E024}\u{1E026}-\u{1E02A}\u{1E800}-\u{1E8C4}\u{1E8C7}-\u{1E8D6}\u{1E900}-\u{1E94A}\u{1E950}-\u{1E959}\u{1E95E}\u{1E95F}\u{1EE00}-\u{1EE03}\u{1EE05}-\u{1EE1F}\u{1EE21}\u{1EE22}\u{1EE24}\u{1EE27}\u{1EE29}-\u{1EE32}\u{1EE34}-\u{1EE37}\u{1EE39}\u{1EE3B}\u{1EE42}\u{1EE47}\u{1EE49}\u{1EE4B}\u{1EE4D}-\u{1EE4F}\u{1EE51}\u{1EE52}\u{1EE54}\u{1EE57}\u{1EE59}\u{1EE5B}\u{1EE5D}\u{1EE5F}\u{1EE61}\u{1EE62}\u{1EE64}\u{1EE67}-\u{1EE6A}\u{1EE6C}-\u{1EE72}\u{1EE74}-\u{1EE77}\u{1EE79}-\u{1EE7C}\u{1EE7E}\u{1EE80}-\u{1EE89}\u{1EE8B}-\u{1EE9B}\u{1EEA1}-\u{1EEA3}\u{1EEA5}-\u{1EEA9}\u{1EEAB}-\u{1EEBB}\u{1EEF0}\u{1EEF1}\u{1F000}-\u{1F02B}\u{1F030}-\u{1F093}\u{1F0A0}-\u{1F0AE}\u{1F0B1}-\u{1F0BF}\u{1F0C1}-\u{1F0CF}\u{1F0D1}-\u{1F0F5}\u{1F100}-\u{1F10C}\u{1F16A}\u{1F16B}\u{1F260}-\u{1F265}\u{1F300}-\u{1F6D4}\u{1F6E0}-\u{1F6EC}\u{1F6F0}-\u{1F6F8}\u{1F700}-\u{1F773}\u{1F780}-\u{1F7D4}\u{1F800}-\u{1F80B}\u{1F810}-\u{1F847}\u{1F850}-\u{1F859}\u{1F860}-\u{1F887}\u{1F890}-\u{1F8AD}\u{1F900}-\u{1F90B}\u{1F910}-\u{1F93E}\u{1F940}-\u{1F94C}\u{1F950}-\u{1F96B}\u{1F980}-\u{1F997}\u{1F9C0}\u{1F9D0}-\u{1F9E6}\u{E0001}\u{E0020}-\u{E007F}\u{E0100}-\u{E01EF}]*$/u;
  var bidiS3 = /[0-9\xB2\xB3\xB9\u05BE\u05C0\u05C3\u05C6\u05D0-\u05EA\u05F0-\u05F4\u0600-\u0605\u0608\u060B\u060D\u061B\u061C\u061E-\u064A\u0660-\u0669\u066B-\u066F\u0671-\u06D5\u06DD\u06E5\u06E6\u06EE-\u070D\u070F\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07C0-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0830-\u083E\u0840-\u0858\u085E\u0860-\u086A\u08A0-\u08B4\u08B6-\u08BD\u08E2\u200F\u2070\u2074-\u2079\u2080-\u2089\u2488-\u249B\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBC1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFC\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\u{102E1}-\u{102FB}\u{10800}-\u{10805}\u{10808}\u{1080A}-\u{10835}\u{10837}\u{10838}\u{1083C}\u{1083F}-\u{10855}\u{10857}-\u{1089E}\u{108A7}-\u{108AF}\u{108E0}-\u{108F2}\u{108F4}\u{108F5}\u{108FB}-\u{1091B}\u{10920}-\u{10939}\u{1093F}\u{10980}-\u{109B7}\u{109BC}-\u{109CF}\u{109D2}-\u{10A00}\u{10A10}-\u{10A13}\u{10A15}-\u{10A17}\u{10A19}-\u{10A33}\u{10A40}-\u{10A47}\u{10A50}-\u{10A58}\u{10A60}-\u{10A9F}\u{10AC0}-\u{10AE4}\u{10AEB}-\u{10AF6}\u{10B00}-\u{10B35}\u{10B40}-\u{10B55}\u{10B58}-\u{10B72}\u{10B78}-\u{10B91}\u{10B99}-\u{10B9C}\u{10BA9}-\u{10BAF}\u{10C00}-\u{10C48}\u{10C80}-\u{10CB2}\u{10CC0}-\u{10CF2}\u{10CFA}-\u{10CFF}\u{10E60}-\u{10E7E}\u{1D7CE}-\u{1D7FF}\u{1E800}-\u{1E8C4}\u{1E8C7}-\u{1E8CF}\u{1E900}-\u{1E943}\u{1E950}-\u{1E959}\u{1E95E}\u{1E95F}\u{1EE00}-\u{1EE03}\u{1EE05}-\u{1EE1F}\u{1EE21}\u{1EE22}\u{1EE24}\u{1EE27}\u{1EE29}-\u{1EE32}\u{1EE34}-\u{1EE37}\u{1EE39}\u{1EE3B}\u{1EE42}\u{1EE47}\u{1EE49}\u{1EE4B}\u{1EE4D}-\u{1EE4F}\u{1EE51}\u{1EE52}\u{1EE54}\u{1EE57}\u{1EE59}\u{1EE5B}\u{1EE5D}\u{1EE5F}\u{1EE61}\u{1EE62}\u{1EE64}\u{1EE67}-\u{1EE6A}\u{1EE6C}-\u{1EE72}\u{1EE74}-\u{1EE77}\u{1EE79}-\u{1EE7C}\u{1EE7E}\u{1EE80}-\u{1EE89}\u{1EE8B}-\u{1EE9B}\u{1EEA1}-\u{1EEA3}\u{1EEA5}-\u{1EEA9}\u{1EEAB}-\u{1EEBB}\u{1F100}-\u{1F10A}][\u0300-\u036F\u0483-\u0489\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u0711\u0730-\u074A\u07A6-\u07B0\u07EB-\u07F3\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u08D4-\u08E1\u08E3-\u0902\u093A\u093C\u0941-\u0948\u094D\u0951-\u0957\u0962\u0963\u0981\u09BC\u09C1-\u09C4\u09CD\u09E2\u09E3\u0A01\u0A02\u0A3C\u0A41\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A70\u0A71\u0A75\u0A81\u0A82\u0ABC\u0AC1-\u0AC5\u0AC7\u0AC8\u0ACD\u0AE2\u0AE3\u0AFA-\u0AFF\u0B01\u0B3C\u0B3F\u0B41-\u0B44\u0B4D\u0B56\u0B62\u0B63\u0B82\u0BC0\u0BCD\u0C00\u0C3E-\u0C40\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C81\u0CBC\u0CCC\u0CCD\u0CE2\u0CE3\u0D00\u0D01\u0D3B\u0D3C\u0D41-\u0D44\u0D4D\u0D62\u0D63\u0DCA\u0DD2-\u0DD4\u0DD6\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0EB1\u0EB4-\u0EB9\u0EBB\u0EBC\u0EC8-\u0ECD\u0F18\u0F19\u0F35\u0F37\u0F39\u0F71-\u0F7E\u0F80-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102D-\u1030\u1032-\u1037\u1039\u103A\u103D\u103E\u1058\u1059\u105E-\u1060\u1071-\u1074\u1082\u1085\u1086\u108D\u109D\u135D-\u135F\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17B4\u17B5\u17B7-\u17BD\u17C6\u17C9-\u17D3\u17DD\u180B-\u180D\u1885\u1886\u18A9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193B\u1A17\u1A18\u1A1B\u1A56\u1A58-\u1A5E\u1A60\u1A62\u1A65-\u1A6C\u1A73-\u1A7C\u1A7F\u1AB0-\u1ABE\u1B00-\u1B03\u1B34\u1B36-\u1B3A\u1B3C\u1B42\u1B6B-\u1B73\u1B80\u1B81\u1BA2-\u1BA5\u1BA8\u1BA9\u1BAB-\u1BAD\u1BE6\u1BE8\u1BE9\u1BED\u1BEF-\u1BF1\u1C2C-\u1C33\u1C36\u1C37\u1CD0-\u1CD2\u1CD4-\u1CE0\u1CE2-\u1CE8\u1CED\u1CF4\u1CF8\u1CF9\u1DC0-\u1DF9\u1DFB-\u1DFF\u20D0-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302D\u3099\u309A\uA66F-\uA672\uA674-\uA67D\uA69E\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA825\uA826\uA8C4\uA8C5\uA8E0-\uA8F1\uA926-\uA92D\uA947-\uA951\uA980-\uA982\uA9B3\uA9B6-\uA9B9\uA9BC\uA9E5\uAA29-\uAA2E\uAA31\uAA32\uAA35\uAA36\uAA43\uAA4C\uAA7C\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEC\uAAED\uAAF6\uABE5\uABE8\uABED\uFB1E\uFE00-\uFE0F\uFE20-\uFE2F\u{101FD}\u{102E0}\u{10376}-\u{1037A}\u{10A01}-\u{10A03}\u{10A05}\u{10A06}\u{10A0C}-\u{10A0F}\u{10A38}-\u{10A3A}\u{10A3F}\u{10AE5}\u{10AE6}\u{11001}\u{11038}-\u{11046}\u{1107F}-\u{11081}\u{110B3}-\u{110B6}\u{110B9}\u{110BA}\u{11100}-\u{11102}\u{11127}-\u{1112B}\u{1112D}-\u{11134}\u{11173}\u{11180}\u{11181}\u{111B6}-\u{111BE}\u{111CA}-\u{111CC}\u{1122F}-\u{11231}\u{11234}\u{11236}\u{11237}\u{1123E}\u{112DF}\u{112E3}-\u{112EA}\u{11300}\u{11301}\u{1133C}\u{11340}\u{11366}-\u{1136C}\u{11370}-\u{11374}\u{11438}-\u{1143F}\u{11442}-\u{11444}\u{11446}\u{114B3}-\u{114B8}\u{114BA}\u{114BF}\u{114C0}\u{114C2}\u{114C3}\u{115B2}-\u{115B5}\u{115BC}\u{115BD}\u{115BF}\u{115C0}\u{115DC}\u{115DD}\u{11633}-\u{1163A}\u{1163D}\u{1163F}\u{11640}\u{116AB}\u{116AD}\u{116B0}-\u{116B5}\u{116B7}\u{1171D}-\u{1171F}\u{11722}-\u{11725}\u{11727}-\u{1172B}\u{11A01}-\u{11A06}\u{11A09}\u{11A0A}\u{11A33}-\u{11A38}\u{11A3B}-\u{11A3E}\u{11A47}\u{11A51}-\u{11A56}\u{11A59}-\u{11A5B}\u{11A8A}-\u{11A96}\u{11A98}\u{11A99}\u{11C30}-\u{11C36}\u{11C38}-\u{11C3D}\u{11C92}-\u{11CA7}\u{11CAA}-\u{11CB0}\u{11CB2}\u{11CB3}\u{11CB5}\u{11CB6}\u{11D31}-\u{11D36}\u{11D3A}\u{11D3C}\u{11D3D}\u{11D3F}-\u{11D45}\u{11D47}\u{16AF0}-\u{16AF4}\u{16B30}-\u{16B36}\u{16F8F}-\u{16F92}\u{1BC9D}\u{1BC9E}\u{1D167}-\u{1D169}\u{1D17B}-\u{1D182}\u{1D185}-\u{1D18B}\u{1D1AA}-\u{1D1AD}\u{1D242}-\u{1D244}\u{1DA00}-\u{1DA36}\u{1DA3B}-\u{1DA6C}\u{1DA75}\u{1DA84}\u{1DA9B}-\u{1DA9F}\u{1DAA1}-\u{1DAAF}\u{1E000}-\u{1E006}\u{1E008}-\u{1E018}\u{1E01B}-\u{1E021}\u{1E023}\u{1E024}\u{1E026}-\u{1E02A}\u{1E8D0}-\u{1E8D6}\u{1E944}-\u{1E94A}\u{E0100}-\u{E01EF}]*$/u;
  var bidiS4EN = /[0-9\xB2\xB3\xB9\u06F0-\u06F9\u2070\u2074-\u2079\u2080-\u2089\u2488-\u249B\uFF10-\uFF19\u{102E1}-\u{102FB}\u{1D7CE}-\u{1D7FF}\u{1F100}-\u{1F10A}]/u;
  var bidiS4AN = /[\u0600-\u0605\u0660-\u0669\u066B\u066C\u06DD\u08E2\u{10E60}-\u{10E7E}]/u;
  var bidiS5 = /^[\0-\x08\x0E-\x1B!-\x84\x86-\u0377\u037A-\u037F\u0384-\u038A\u038C\u038E-\u03A1\u03A3-\u052F\u0531-\u0556\u0559-\u055F\u0561-\u0587\u0589\u058A\u058D-\u058F\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0606\u0607\u0609\u060A\u060C\u060E-\u061A\u064B-\u065F\u066A\u0670\u06D6-\u06DC\u06DE-\u06E4\u06E7-\u06ED\u06F0-\u06F9\u0711\u0730-\u074A\u07A6-\u07B0\u07EB-\u07F3\u07F6-\u07F9\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u08D4-\u08E1\u08E3-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09FD\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AF1\u0AF9-\u0AFF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B77\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BFA\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C60-\u0C63\u0C66-\u0C6F\u0C78-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D00-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D44\u0D46-\u0D48\u0D4A-\u0D4F\u0D54-\u0D63\u0D66-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2-\u0DF4\u0E01-\u0E3A\u0E3F-\u0E5B\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00-\u0F47\u0F49-\u0F6C\u0F71-\u0F97\u0F99-\u0FBC\u0FBE-\u0FCC\u0FCE-\u0FDA\u1000-\u10C5\u10C7\u10CD\u10D0-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u137C\u1380-\u1399\u13A0-\u13F5\u13F8-\u13FD\u1400-\u167F\u1681-\u169C\u16A0-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1736\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17DD\u17E0-\u17E9\u17F0-\u17F9\u1800-\u180E\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1940\u1944-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19DA\u19DE-\u1A1B\u1A1E-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA0-\u1AAD\u1AB0-\u1ABE\u1B00-\u1B4B\u1B50-\u1B7C\u1B80-\u1BF3\u1BFC-\u1C37\u1C3B-\u1C49\u1C4D-\u1C88\u1CC0-\u1CC7\u1CD0-\u1CF9\u1D00-\u1DF9\u1DFB-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FC4\u1FC6-\u1FD3\u1FD6-\u1FDB\u1FDD-\u1FEF\u1FF2-\u1FF4\u1FF6-\u1FFE\u200B-\u200E\u2010-\u2027\u202F-\u205E\u2060-\u2064\u206A-\u2071\u2074-\u208E\u2090-\u209C\u20A0-\u20BF\u20D0-\u20F0\u2100-\u218B\u2190-\u2426\u2440-\u244A\u2460-\u2B73\u2B76-\u2B95\u2B98-\u2BB9\u2BBD-\u2BC8\u2BCA-\u2BD2\u2BEC-\u2BEF\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CF3\u2CF9-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D70\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2E49\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u2FF0-\u2FFB\u3001-\u303F\u3041-\u3096\u3099-\u30FF\u3105-\u312E\u3131-\u318E\u3190-\u31BA\u31C0-\u31E3\u31F0-\u321E\u3220-\u32FE\u3300-\u4DB5\u4DC0-\u9FEA\uA000-\uA48C\uA490-\uA4C6\uA4D0-\uA62B\uA640-\uA6F7\uA700-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA82B\uA830-\uA839\uA840-\uA877\uA880-\uA8C5\uA8CE-\uA8D9\uA8E0-\uA8FD\uA900-\uA953\uA95F-\uA97C\uA980-\uA9CD\uA9CF-\uA9D9\uA9DE-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA5C-\uAAC2\uAADB-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB65\uAB70-\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uD800-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1E\uFB29\uFD3E\uFD3F\uFDFD\uFE00-\uFE19\uFE20-\uFE52\uFE54-\uFE66\uFE68-\uFE6B\uFEFF\uFF01-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC\uFFE0-\uFFE6\uFFE8-\uFFEE\uFFF9-\uFFFD\u{10000}-\u{1000B}\u{1000D}-\u{10026}\u{10028}-\u{1003A}\u{1003C}\u{1003D}\u{1003F}-\u{1004D}\u{10050}-\u{1005D}\u{10080}-\u{100FA}\u{10100}-\u{10102}\u{10107}-\u{10133}\u{10137}-\u{1018E}\u{10190}-\u{1019B}\u{101A0}\u{101D0}-\u{101FD}\u{10280}-\u{1029C}\u{102A0}-\u{102D0}\u{102E0}-\u{102FB}\u{10300}-\u{10323}\u{1032D}-\u{1034A}\u{10350}-\u{1037A}\u{10380}-\u{1039D}\u{1039F}-\u{103C3}\u{103C8}-\u{103D5}\u{10400}-\u{1049D}\u{104A0}-\u{104A9}\u{104B0}-\u{104D3}\u{104D8}-\u{104FB}\u{10500}-\u{10527}\u{10530}-\u{10563}\u{1056F}\u{10600}-\u{10736}\u{10740}-\u{10755}\u{10760}-\u{10767}\u{1091F}\u{10A01}-\u{10A03}\u{10A05}\u{10A06}\u{10A0C}-\u{10A0F}\u{10A38}-\u{10A3A}\u{10A3F}\u{10AE5}\u{10AE6}\u{10B39}-\u{10B3F}\u{11000}-\u{1104D}\u{11052}-\u{1106F}\u{1107F}-\u{110C1}\u{110D0}-\u{110E8}\u{110F0}-\u{110F9}\u{11100}-\u{11134}\u{11136}-\u{11143}\u{11150}-\u{11176}\u{11180}-\u{111CD}\u{111D0}-\u{111DF}\u{111E1}-\u{111F4}\u{11200}-\u{11211}\u{11213}-\u{1123E}\u{11280}-\u{11286}\u{11288}\u{1128A}-\u{1128D}\u{1128F}-\u{1129D}\u{1129F}-\u{112A9}\u{112B0}-\u{112EA}\u{112F0}-\u{112F9}\u{11300}-\u{11303}\u{11305}-\u{1130C}\u{1130F}\u{11310}\u{11313}-\u{11328}\u{1132A}-\u{11330}\u{11332}\u{11333}\u{11335}-\u{11339}\u{1133C}-\u{11344}\u{11347}\u{11348}\u{1134B}-\u{1134D}\u{11350}\u{11357}\u{1135D}-\u{11363}\u{11366}-\u{1136C}\u{11370}-\u{11374}\u{11400}-\u{11459}\u{1145B}\u{1145D}\u{11480}-\u{114C7}\u{114D0}-\u{114D9}\u{11580}-\u{115B5}\u{115B8}-\u{115DD}\u{11600}-\u{11644}\u{11650}-\u{11659}\u{11660}-\u{1166C}\u{11680}-\u{116B7}\u{116C0}-\u{116C9}\u{11700}-\u{11719}\u{1171D}-\u{1172B}\u{11730}-\u{1173F}\u{118A0}-\u{118F2}\u{118FF}\u{11A00}-\u{11A47}\u{11A50}-\u{11A83}\u{11A86}-\u{11A9C}\u{11A9E}-\u{11AA2}\u{11AC0}-\u{11AF8}\u{11C00}-\u{11C08}\u{11C0A}-\u{11C36}\u{11C38}-\u{11C45}\u{11C50}-\u{11C6C}\u{11C70}-\u{11C8F}\u{11C92}-\u{11CA7}\u{11CA9}-\u{11CB6}\u{11D00}-\u{11D06}\u{11D08}\u{11D09}\u{11D0B}-\u{11D36}\u{11D3A}\u{11D3C}\u{11D3D}\u{11D3F}-\u{11D47}\u{11D50}-\u{11D59}\u{12000}-\u{12399}\u{12400}-\u{1246E}\u{12470}-\u{12474}\u{12480}-\u{12543}\u{13000}-\u{1342E}\u{14400}-\u{14646}\u{16800}-\u{16A38}\u{16A40}-\u{16A5E}\u{16A60}-\u{16A69}\u{16A6E}\u{16A6F}\u{16AD0}-\u{16AED}\u{16AF0}-\u{16AF5}\u{16B00}-\u{16B45}\u{16B50}-\u{16B59}\u{16B5B}-\u{16B61}\u{16B63}-\u{16B77}\u{16B7D}-\u{16B8F}\u{16F00}-\u{16F44}\u{16F50}-\u{16F7E}\u{16F8F}-\u{16F9F}\u{16FE0}\u{16FE1}\u{17000}-\u{187EC}\u{18800}-\u{18AF2}\u{1B000}-\u{1B11E}\u{1B170}-\u{1B2FB}\u{1BC00}-\u{1BC6A}\u{1BC70}-\u{1BC7C}\u{1BC80}-\u{1BC88}\u{1BC90}-\u{1BC99}\u{1BC9C}-\u{1BCA3}\u{1D000}-\u{1D0F5}\u{1D100}-\u{1D126}\u{1D129}-\u{1D1E8}\u{1D200}-\u{1D245}\u{1D300}-\u{1D356}\u{1D360}-\u{1D371}\u{1D400}-\u{1D454}\u{1D456}-\u{1D49C}\u{1D49E}\u{1D49F}\u{1D4A2}\u{1D4A5}\u{1D4A6}\u{1D4A9}-\u{1D4AC}\u{1D4AE}-\u{1D4B9}\u{1D4BB}\u{1D4BD}-\u{1D4C3}\u{1D4C5}-\u{1D505}\u{1D507}-\u{1D50A}\u{1D50D}-\u{1D514}\u{1D516}-\u{1D51C}\u{1D51E}-\u{1D539}\u{1D53B}-\u{1D53E}\u{1D540}-\u{1D544}\u{1D546}\u{1D54A}-\u{1D550}\u{1D552}-\u{1D6A5}\u{1D6A8}-\u{1D7CB}\u{1D7CE}-\u{1DA8B}\u{1DA9B}-\u{1DA9F}\u{1DAA1}-\u{1DAAF}\u{1E000}-\u{1E006}\u{1E008}-\u{1E018}\u{1E01B}-\u{1E021}\u{1E023}\u{1E024}\u{1E026}-\u{1E02A}\u{1E8D0}-\u{1E8D6}\u{1E944}-\u{1E94A}\u{1EEF0}\u{1EEF1}\u{1F000}-\u{1F02B}\u{1F030}-\u{1F093}\u{1F0A0}-\u{1F0AE}\u{1F0B1}-\u{1F0BF}\u{1F0C1}-\u{1F0CF}\u{1F0D1}-\u{1F0F5}\u{1F100}-\u{1F10C}\u{1F110}-\u{1F12E}\u{1F130}-\u{1F16B}\u{1F170}-\u{1F1AC}\u{1F1E6}-\u{1F202}\u{1F210}-\u{1F23B}\u{1F240}-\u{1F248}\u{1F250}\u{1F251}\u{1F260}-\u{1F265}\u{1F300}-\u{1F6D4}\u{1F6E0}-\u{1F6EC}\u{1F6F0}-\u{1F6F8}\u{1F700}-\u{1F773}\u{1F780}-\u{1F7D4}\u{1F800}-\u{1F80B}\u{1F810}-\u{1F847}\u{1F850}-\u{1F859}\u{1F860}-\u{1F887}\u{1F890}-\u{1F8AD}\u{1F900}-\u{1F90B}\u{1F910}-\u{1F93E}\u{1F940}-\u{1F94C}\u{1F950}-\u{1F96B}\u{1F980}-\u{1F997}\u{1F9C0}\u{1F9D0}-\u{1F9E6}\u{20000}-\u{2A6D6}\u{2A700}-\u{2B734}\u{2B740}-\u{2B81D}\u{2B820}-\u{2CEA1}\u{2CEB0}-\u{2EBE0}\u{2F800}-\u{2FA1D}\u{E0001}\u{E0020}-\u{E007F}\u{E0100}-\u{E01EF}\u{F0000}-\u{FFFFD}\u{100000}-\u{10FFFD}]*$/u;
  var bidiS6 = /[0-9A-Za-z\xAA\xB2\xB3\xB5\xB9\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02B8\u02BB-\u02C1\u02D0\u02D1\u02E0-\u02E4\u02EE\u0370-\u0373\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0482\u048A-\u052F\u0531-\u0556\u0559-\u055F\u0561-\u0587\u0589\u06F0-\u06F9\u0903-\u0939\u093B\u093D-\u0940\u0949-\u094C\u094E-\u0950\u0958-\u0961\u0964-\u0980\u0982\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD-\u09C0\u09C7\u09C8\u09CB\u09CC\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E1\u09E6-\u09F1\u09F4-\u09FA\u09FC\u09FD\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3E-\u0A40\u0A59-\u0A5C\u0A5E\u0A66-\u0A6F\u0A72-\u0A74\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD-\u0AC0\u0AC9\u0ACB\u0ACC\u0AD0\u0AE0\u0AE1\u0AE6-\u0AF0\u0AF9\u0B02\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B3E\u0B40\u0B47\u0B48\u0B4B\u0B4C\u0B57\u0B5C\u0B5D\u0B5F-\u0B61\u0B66-\u0B77\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE\u0BBF\u0BC1\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCC\u0BD0\u0BD7\u0BE6-\u0BF2\u0C01-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C41-\u0C44\u0C58-\u0C5A\u0C60\u0C61\u0C66-\u0C6F\u0C7F\u0C80\u0C82\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD-\u0CC4\u0CC6-\u0CC8\u0CCA\u0CCB\u0CD5\u0CD6\u0CDE\u0CE0\u0CE1\u0CE6-\u0CEF\u0CF1\u0CF2\u0D02\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D40\u0D46-\u0D48\u0D4A-\u0D4C\u0D4E\u0D4F\u0D54-\u0D61\u0D66-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCF-\u0DD1\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2-\u0DF4\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E4F-\u0E5B\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00-\u0F17\u0F1A-\u0F34\u0F36\u0F38\u0F3E-\u0F47\u0F49-\u0F6C\u0F7F\u0F85\u0F88-\u0F8C\u0FBE-\u0FC5\u0FC7-\u0FCC\u0FCE-\u0FDA\u1000-\u102C\u1031\u1038\u103B\u103C\u103F-\u1057\u105A-\u105D\u1061-\u1070\u1075-\u1081\u1083\u1084\u1087-\u108C\u108E-\u109C\u109E-\u10C5\u10C7\u10CD\u10D0-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1360-\u137C\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u167F\u1681-\u169A\u16A0-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1735\u1736\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17B6\u17BE-\u17C5\u17C7\u17C8\u17D4-\u17DA\u17DC\u17E0-\u17E9\u1810-\u1819\u1820-\u1877\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1923-\u1926\u1929-\u192B\u1930\u1931\u1933-\u1938\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19DA\u1A00-\u1A16\u1A19\u1A1A\u1A1E-\u1A55\u1A57\u1A61\u1A63\u1A64\u1A6D-\u1A72\u1A80-\u1A89\u1A90-\u1A99\u1AA0-\u1AAD\u1B04-\u1B33\u1B35\u1B3B\u1B3D-\u1B41\u1B43-\u1B4B\u1B50-\u1B6A\u1B74-\u1B7C\u1B82-\u1BA1\u1BA6\u1BA7\u1BAA\u1BAE-\u1BE5\u1BE7\u1BEA-\u1BEC\u1BEE\u1BF2\u1BF3\u1BFC-\u1C2B\u1C34\u1C35\u1C3B-\u1C49\u1C4D-\u1C88\u1CC0-\u1CC7\u1CD3\u1CE1\u1CE9-\u1CEC\u1CEE-\u1CF3\u1CF5-\u1CF7\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200E\u2070\u2071\u2074-\u2079\u207F-\u2089\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u214F\u2160-\u2188\u2336-\u237A\u2395\u2488-\u24E9\u26AC\u2800-\u28FF\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D70\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3005-\u3007\u3021-\u3029\u302E\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312E\u3131-\u318E\u3190-\u31BA\u31F0-\u321C\u3220-\u324F\u3260-\u327B\u327F-\u32B0\u32C0-\u32CB\u32D0-\u32FE\u3300-\u3376\u337B-\u33DD\u33E0-\u33FE\u3400-\u4DB5\u4E00-\u9FEA\uA000-\uA48C\uA4D0-\uA60C\uA610-\uA62B\uA640-\uA66E\uA680-\uA69D\uA6A0-\uA6EF\uA6F2-\uA6F7\uA722-\uA787\uA789-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA824\uA827\uA830-\uA837\uA840-\uA873\uA880-\uA8C3\uA8CE-\uA8D9\uA8F2-\uA8FD\uA900-\uA925\uA92E-\uA946\uA952\uA953\uA95F-\uA97C\uA983-\uA9B2\uA9B4\uA9B5\uA9BA\uA9BB\uA9BD-\uA9CD\uA9CF-\uA9D9\uA9DE-\uA9E4\uA9E6-\uA9FE\uAA00-\uAA28\uAA2F\uAA30\uAA33\uAA34\uAA40-\uAA42\uAA44-\uAA4B\uAA4D\uAA50-\uAA59\uAA5C-\uAA7B\uAA7D-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAAEB\uAAEE-\uAAF5\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB65\uAB70-\uABE4\uABE6\uABE7\uABE9-\uABEC\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uD800-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFF10-\uFF19\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC\u{10000}-\u{1000B}\u{1000D}-\u{10026}\u{10028}-\u{1003A}\u{1003C}\u{1003D}\u{1003F}-\u{1004D}\u{10050}-\u{1005D}\u{10080}-\u{100FA}\u{10100}\u{10102}\u{10107}-\u{10133}\u{10137}-\u{1013F}\u{1018D}\u{1018E}\u{101D0}-\u{101FC}\u{10280}-\u{1029C}\u{102A0}-\u{102D0}\u{102E1}-\u{102FB}\u{10300}-\u{10323}\u{1032D}-\u{1034A}\u{10350}-\u{10375}\u{10380}-\u{1039D}\u{1039F}-\u{103C3}\u{103C8}-\u{103D5}\u{10400}-\u{1049D}\u{104A0}-\u{104A9}\u{104B0}-\u{104D3}\u{104D8}-\u{104FB}\u{10500}-\u{10527}\u{10530}-\u{10563}\u{1056F}\u{10600}-\u{10736}\u{10740}-\u{10755}\u{10760}-\u{10767}\u{11000}\u{11002}-\u{11037}\u{11047}-\u{1104D}\u{11066}-\u{1106F}\u{11082}-\u{110B2}\u{110B7}\u{110B8}\u{110BB}-\u{110C1}\u{110D0}-\u{110E8}\u{110F0}-\u{110F9}\u{11103}-\u{11126}\u{1112C}\u{11136}-\u{11143}\u{11150}-\u{11172}\u{11174}-\u{11176}\u{11182}-\u{111B5}\u{111BF}-\u{111C9}\u{111CD}\u{111D0}-\u{111DF}\u{111E1}-\u{111F4}\u{11200}-\u{11211}\u{11213}-\u{1122E}\u{11232}\u{11233}\u{11235}\u{11238}-\u{1123D}\u{11280}-\u{11286}\u{11288}\u{1128A}-\u{1128D}\u{1128F}-\u{1129D}\u{1129F}-\u{112A9}\u{112B0}-\u{112DE}\u{112E0}-\u{112E2}\u{112F0}-\u{112F9}\u{11302}\u{11303}\u{11305}-\u{1130C}\u{1130F}\u{11310}\u{11313}-\u{11328}\u{1132A}-\u{11330}\u{11332}\u{11333}\u{11335}-\u{11339}\u{1133D}-\u{1133F}\u{11341}-\u{11344}\u{11347}\u{11348}\u{1134B}-\u{1134D}\u{11350}\u{11357}\u{1135D}-\u{11363}\u{11400}-\u{11437}\u{11440}\u{11441}\u{11445}\u{11447}-\u{11459}\u{1145B}\u{1145D}\u{11480}-\u{114B2}\u{114B9}\u{114BB}-\u{114BE}\u{114C1}\u{114C4}-\u{114C7}\u{114D0}-\u{114D9}\u{11580}-\u{115B1}\u{115B8}-\u{115BB}\u{115BE}\u{115C1}-\u{115DB}\u{11600}-\u{11632}\u{1163B}\u{1163C}\u{1163E}\u{11641}-\u{11644}\u{11650}-\u{11659}\u{11680}-\u{116AA}\u{116AC}\u{116AE}\u{116AF}\u{116B6}\u{116C0}-\u{116C9}\u{11700}-\u{11719}\u{11720}\u{11721}\u{11726}\u{11730}-\u{1173F}\u{118A0}-\u{118F2}\u{118FF}\u{11A00}\u{11A07}\u{11A08}\u{11A0B}-\u{11A32}\u{11A39}\u{11A3A}\u{11A3F}-\u{11A46}\u{11A50}\u{11A57}\u{11A58}\u{11A5C}-\u{11A83}\u{11A86}-\u{11A89}\u{11A97}\u{11A9A}-\u{11A9C}\u{11A9E}-\u{11AA2}\u{11AC0}-\u{11AF8}\u{11C00}-\u{11C08}\u{11C0A}-\u{11C2F}\u{11C3E}-\u{11C45}\u{11C50}-\u{11C6C}\u{11C70}-\u{11C8F}\u{11CA9}\u{11CB1}\u{11CB4}\u{11D00}-\u{11D06}\u{11D08}\u{11D09}\u{11D0B}-\u{11D30}\u{11D46}\u{11D50}-\u{11D59}\u{12000}-\u{12399}\u{12400}-\u{1246E}\u{12470}-\u{12474}\u{12480}-\u{12543}\u{13000}-\u{1342E}\u{14400}-\u{14646}\u{16800}-\u{16A38}\u{16A40}-\u{16A5E}\u{16A60}-\u{16A69}\u{16A6E}\u{16A6F}\u{16AD0}-\u{16AED}\u{16AF5}\u{16B00}-\u{16B2F}\u{16B37}-\u{16B45}\u{16B50}-\u{16B59}\u{16B5B}-\u{16B61}\u{16B63}-\u{16B77}\u{16B7D}-\u{16B8F}\u{16F00}-\u{16F44}\u{16F50}-\u{16F7E}\u{16F93}-\u{16F9F}\u{16FE0}\u{16FE1}\u{17000}-\u{187EC}\u{18800}-\u{18AF2}\u{1B000}-\u{1B11E}\u{1B170}-\u{1B2FB}\u{1BC00}-\u{1BC6A}\u{1BC70}-\u{1BC7C}\u{1BC80}-\u{1BC88}\u{1BC90}-\u{1BC99}\u{1BC9C}\u{1BC9F}\u{1D000}-\u{1D0F5}\u{1D100}-\u{1D126}\u{1D129}-\u{1D166}\u{1D16A}-\u{1D172}\u{1D183}\u{1D184}\u{1D18C}-\u{1D1A9}\u{1D1AE}-\u{1D1E8}\u{1D360}-\u{1D371}\u{1D400}-\u{1D454}\u{1D456}-\u{1D49C}\u{1D49E}\u{1D49F}\u{1D4A2}\u{1D4A5}\u{1D4A6}\u{1D4A9}-\u{1D4AC}\u{1D4AE}-\u{1D4B9}\u{1D4BB}\u{1D4BD}-\u{1D4C3}\u{1D4C5}-\u{1D505}\u{1D507}-\u{1D50A}\u{1D50D}-\u{1D514}\u{1D516}-\u{1D51C}\u{1D51E}-\u{1D539}\u{1D53B}-\u{1D53E}\u{1D540}-\u{1D544}\u{1D546}\u{1D54A}-\u{1D550}\u{1D552}-\u{1D6A5}\u{1D6A8}-\u{1D6DA}\u{1D6DC}-\u{1D714}\u{1D716}-\u{1D74E}\u{1D750}-\u{1D788}\u{1D78A}-\u{1D7C2}\u{1D7C4}-\u{1D7CB}\u{1D7CE}-\u{1D9FF}\u{1DA37}-\u{1DA3A}\u{1DA6D}-\u{1DA74}\u{1DA76}-\u{1DA83}\u{1DA85}-\u{1DA8B}\u{1F100}-\u{1F10A}\u{1F110}-\u{1F12E}\u{1F130}-\u{1F169}\u{1F170}-\u{1F1AC}\u{1F1E6}-\u{1F202}\u{1F210}-\u{1F23B}\u{1F240}-\u{1F248}\u{1F250}\u{1F251}\u{20000}-\u{2A6D6}\u{2A700}-\u{2B734}\u{2B740}-\u{2B81D}\u{2B820}-\u{2CEA1}\u{2CEB0}-\u{2EBE0}\u{2F800}-\u{2FA1D}\u{F0000}-\u{FFFFD}\u{100000}-\u{10FFFD}][\u0300-\u036F\u0483-\u0489\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u0711\u0730-\u074A\u07A6-\u07B0\u07EB-\u07F3\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u08D4-\u08E1\u08E3-\u0902\u093A\u093C\u0941-\u0948\u094D\u0951-\u0957\u0962\u0963\u0981\u09BC\u09C1-\u09C4\u09CD\u09E2\u09E3\u0A01\u0A02\u0A3C\u0A41\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A70\u0A71\u0A75\u0A81\u0A82\u0ABC\u0AC1-\u0AC5\u0AC7\u0AC8\u0ACD\u0AE2\u0AE3\u0AFA-\u0AFF\u0B01\u0B3C\u0B3F\u0B41-\u0B44\u0B4D\u0B56\u0B62\u0B63\u0B82\u0BC0\u0BCD\u0C00\u0C3E-\u0C40\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C81\u0CBC\u0CCC\u0CCD\u0CE2\u0CE3\u0D00\u0D01\u0D3B\u0D3C\u0D41-\u0D44\u0D4D\u0D62\u0D63\u0DCA\u0DD2-\u0DD4\u0DD6\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0EB1\u0EB4-\u0EB9\u0EBB\u0EBC\u0EC8-\u0ECD\u0F18\u0F19\u0F35\u0F37\u0F39\u0F71-\u0F7E\u0F80-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102D-\u1030\u1032-\u1037\u1039\u103A\u103D\u103E\u1058\u1059\u105E-\u1060\u1071-\u1074\u1082\u1085\u1086\u108D\u109D\u135D-\u135F\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17B4\u17B5\u17B7-\u17BD\u17C6\u17C9-\u17D3\u17DD\u180B-\u180D\u1885\u1886\u18A9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193B\u1A17\u1A18\u1A1B\u1A56\u1A58-\u1A5E\u1A60\u1A62\u1A65-\u1A6C\u1A73-\u1A7C\u1A7F\u1AB0-\u1ABE\u1B00-\u1B03\u1B34\u1B36-\u1B3A\u1B3C\u1B42\u1B6B-\u1B73\u1B80\u1B81\u1BA2-\u1BA5\u1BA8\u1BA9\u1BAB-\u1BAD\u1BE6\u1BE8\u1BE9\u1BED\u1BEF-\u1BF1\u1C2C-\u1C33\u1C36\u1C37\u1CD0-\u1CD2\u1CD4-\u1CE0\u1CE2-\u1CE8\u1CED\u1CF4\u1CF8\u1CF9\u1DC0-\u1DF9\u1DFB-\u1DFF\u20D0-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302D\u3099\u309A\uA66F-\uA672\uA674-\uA67D\uA69E\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA825\uA826\uA8C4\uA8C5\uA8E0-\uA8F1\uA926-\uA92D\uA947-\uA951\uA980-\uA982\uA9B3\uA9B6-\uA9B9\uA9BC\uA9E5\uAA29-\uAA2E\uAA31\uAA32\uAA35\uAA36\uAA43\uAA4C\uAA7C\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEC\uAAED\uAAF6\uABE5\uABE8\uABED\uFB1E\uFE00-\uFE0F\uFE20-\uFE2F\u{101FD}\u{102E0}\u{10376}-\u{1037A}\u{10A01}-\u{10A03}\u{10A05}\u{10A06}\u{10A0C}-\u{10A0F}\u{10A38}-\u{10A3A}\u{10A3F}\u{10AE5}\u{10AE6}\u{11001}\u{11038}-\u{11046}\u{1107F}-\u{11081}\u{110B3}-\u{110B6}\u{110B9}\u{110BA}\u{11100}-\u{11102}\u{11127}-\u{1112B}\u{1112D}-\u{11134}\u{11173}\u{11180}\u{11181}\u{111B6}-\u{111BE}\u{111CA}-\u{111CC}\u{1122F}-\u{11231}\u{11234}\u{11236}\u{11237}\u{1123E}\u{112DF}\u{112E3}-\u{112EA}\u{11300}\u{11301}\u{1133C}\u{11340}\u{11366}-\u{1136C}\u{11370}-\u{11374}\u{11438}-\u{1143F}\u{11442}-\u{11444}\u{11446}\u{114B3}-\u{114B8}\u{114BA}\u{114BF}\u{114C0}\u{114C2}\u{114C3}\u{115B2}-\u{115B5}\u{115BC}\u{115BD}\u{115BF}\u{115C0}\u{115DC}\u{115DD}\u{11633}-\u{1163A}\u{1163D}\u{1163F}\u{11640}\u{116AB}\u{116AD}\u{116B0}-\u{116B5}\u{116B7}\u{1171D}-\u{1171F}\u{11722}-\u{11725}\u{11727}-\u{1172B}\u{11A01}-\u{11A06}\u{11A09}\u{11A0A}\u{11A33}-\u{11A38}\u{11A3B}-\u{11A3E}\u{11A47}\u{11A51}-\u{11A56}\u{11A59}-\u{11A5B}\u{11A8A}-\u{11A96}\u{11A98}\u{11A99}\u{11C30}-\u{11C36}\u{11C38}-\u{11C3D}\u{11C92}-\u{11CA7}\u{11CAA}-\u{11CB0}\u{11CB2}\u{11CB3}\u{11CB5}\u{11CB6}\u{11D31}-\u{11D36}\u{11D3A}\u{11D3C}\u{11D3D}\u{11D3F}-\u{11D45}\u{11D47}\u{16AF0}-\u{16AF4}\u{16B30}-\u{16B36}\u{16F8F}-\u{16F92}\u{1BC9D}\u{1BC9E}\u{1D167}-\u{1D169}\u{1D17B}-\u{1D182}\u{1D185}-\u{1D18B}\u{1D1AA}-\u{1D1AD}\u{1D242}-\u{1D244}\u{1DA00}-\u{1DA36}\u{1DA3B}-\u{1DA6C}\u{1DA75}\u{1DA84}\u{1DA9B}-\u{1DA9F}\u{1DAA1}-\u{1DAAF}\u{1E000}-\u{1E006}\u{1E008}-\u{1E018}\u{1E01B}-\u{1E021}\u{1E023}\u{1E024}\u{1E026}-\u{1E02A}\u{1E8D0}-\u{1E8D6}\u{1E944}-\u{1E94A}\u{E0100}-\u{E01EF}]*$/u;
  module2.exports = {
    combiningMarks,
    combiningClassVirama,
    validZWNJ,
    bidiDomain,
    bidiS1LTR,
    bidiS1RTL,
    bidiS2,
    bidiS3,
    bidiS4EN,
    bidiS4AN,
    bidiS5,
    bidiS6
  };
});

// node_modules/tr46/lib/mappingTable.json
var require_mappingTable = __commonJS((exports2, module2) => {
  module2.exports = [[[0, 44], "disallowed_STD3_valid"], [[45, 46], "valid"], [[47, 47], "disallowed_STD3_valid"], [[48, 57], "valid"], [[58, 64], "disallowed_STD3_valid"], [[65, 65], "mapped", "a"], [[66, 66], "mapped", "b"], [[67, 67], "mapped", "c"], [[68, 68], "mapped", "d"], [[69, 69], "mapped", "e"], [[70, 70], "mapped", "f"], [[71, 71], "mapped", "g"], [[72, 72], "mapped", "h"], [[73, 73], "mapped", "i"], [[74, 74], "mapped", "j"], [[75, 75], "mapped", "k"], [[76, 76], "mapped", "l"], [[77, 77], "mapped", "m"], [[78, 78], "mapped", "n"], [[79, 79], "mapped", "o"], [[80, 80], "mapped", "p"], [[81, 81], "mapped", "q"], [[82, 82], "mapped", "r"], [[83, 83], "mapped", "s"], [[84, 84], "mapped", "t"], [[85, 85], "mapped", "u"], [[86, 86], "mapped", "v"], [[87, 87], "mapped", "w"], [[88, 88], "mapped", "x"], [[89, 89], "mapped", "y"], [[90, 90], "mapped", "z"], [[91, 96], "disallowed_STD3_valid"], [[97, 122], "valid"], [[123, 127], "disallowed_STD3_valid"], [[128, 159], "disallowed"], [[160, 160], "disallowed_STD3_mapped", " "], [[161, 167], "valid", "", "NV8"], [[168, 168], "disallowed_STD3_mapped", " \u0308"], [[169, 169], "valid", "", "NV8"], [[170, 170], "mapped", "a"], [[171, 172], "valid", "", "NV8"], [[173, 173], "ignored"], [[174, 174], "valid", "", "NV8"], [[175, 175], "disallowed_STD3_mapped", " \u0304"], [[176, 177], "valid", "", "NV8"], [[178, 178], "mapped", "2"], [[179, 179], "mapped", "3"], [[180, 180], "disallowed_STD3_mapped", " \u0301"], [[181, 181], "mapped", "\u03BC"], [[182, 182], "valid", "", "NV8"], [[183, 183], "valid"], [[184, 184], "disallowed_STD3_mapped", " \u0327"], [[185, 185], "mapped", "1"], [[186, 186], "mapped", "o"], [[187, 187], "valid", "", "NV8"], [[188, 188], "mapped", "1\u20444"], [[189, 189], "mapped", "1\u20442"], [[190, 190], "mapped", "3\u20444"], [[191, 191], "valid", "", "NV8"], [[192, 192], "mapped", "\xE0"], [[193, 193], "mapped", "\xE1"], [[194, 194], "mapped", "\xE2"], [[195, 195], "mapped", "\xE3"], [[196, 196], "mapped", "\xE4"], [[197, 197], "mapped", "\xE5"], [[198, 198], "mapped", "\xE6"], [[199, 199], "mapped", "\xE7"], [[200, 200], "mapped", "\xE8"], [[201, 201], "mapped", "\xE9"], [[202, 202], "mapped", "\xEA"], [[203, 203], "mapped", "\xEB"], [[204, 204], "mapped", "\xEC"], [[205, 205], "mapped", "\xED"], [[206, 206], "mapped", "\xEE"], [[207, 207], "mapped", "\xEF"], [[208, 208], "mapped", "\xF0"], [[209, 209], "mapped", "\xF1"], [[210, 210], "mapped", "\xF2"], [[211, 211], "mapped", "\xF3"], [[212, 212], "mapped", "\xF4"], [[213, 213], "mapped", "\xF5"], [[214, 214], "mapped", "\xF6"], [[215, 215], "valid", "", "NV8"], [[216, 216], "mapped", "\xF8"], [[217, 217], "mapped", "\xF9"], [[218, 218], "mapped", "\xFA"], [[219, 219], "mapped", "\xFB"], [[220, 220], "mapped", "\xFC"], [[221, 221], "mapped", "\xFD"], [[222, 222], "mapped", "\xFE"], [[223, 223], "deviation", "ss"], [[224, 246], "valid"], [[247, 247], "valid", "", "NV8"], [[248, 255], "valid"], [[256, 256], "mapped", "\u0101"], [[257, 257], "valid"], [[258, 258], "mapped", "\u0103"], [[259, 259], "valid"], [[260, 260], "mapped", "\u0105"], [[261, 261], "valid"], [[262, 262], "mapped", "\u0107"], [[263, 263], "valid"], [[264, 264], "mapped", "\u0109"], [[265, 265], "valid"], [[266, 266], "mapped", "\u010B"], [[267, 267], "valid"], [[268, 268], "mapped", "\u010D"], [[269, 269], "valid"], [[270, 270], "mapped", "\u010F"], [[271, 271], "valid"], [[272, 272], "mapped", "\u0111"], [[273, 273], "valid"], [[274, 274], "mapped", "\u0113"], [[275, 275], "valid"], [[276, 276], "mapped", "\u0115"], [[277, 277], "valid"], [[278, 278], "mapped", "\u0117"], [[279, 279], "valid"], [[280, 280], "mapped", "\u0119"], [[281, 281], "valid"], [[282, 282], "mapped", "\u011B"], [[283, 283], "valid"], [[284, 284], "mapped", "\u011D"], [[285, 285], "valid"], [[286, 286], "mapped", "\u011F"], [[287, 287], "valid"], [[288, 288], "mapped", "\u0121"], [[289, 289], "valid"], [[290, 290], "mapped", "\u0123"], [[291, 291], "valid"], [[292, 292], "mapped", "\u0125"], [[293, 293], "valid"], [[294, 294], "mapped", "\u0127"], [[295, 295], "valid"], [[296, 296], "mapped", "\u0129"], [[297, 297], "valid"], [[298, 298], "mapped", "\u012B"], [[299, 299], "valid"], [[300, 300], "mapped", "\u012D"], [[301, 301], "valid"], [[302, 302], "mapped", "\u012F"], [[303, 303], "valid"], [[304, 304], "mapped", "i\u0307"], [[305, 305], "valid"], [[306, 307], "mapped", "ij"], [[308, 308], "mapped", "\u0135"], [[309, 309], "valid"], [[310, 310], "mapped", "\u0137"], [[311, 312], "valid"], [[313, 313], "mapped", "\u013A"], [[314, 314], "valid"], [[315, 315], "mapped", "\u013C"], [[316, 316], "valid"], [[317, 317], "mapped", "\u013E"], [[318, 318], "valid"], [[319, 320], "mapped", "l\xB7"], [[321, 321], "mapped", "\u0142"], [[322, 322], "valid"], [[323, 323], "mapped", "\u0144"], [[324, 324], "valid"], [[325, 325], "mapped", "\u0146"], [[326, 326], "valid"], [[327, 327], "mapped", "\u0148"], [[328, 328], "valid"], [[329, 329], "mapped", "\u02BCn"], [[330, 330], "mapped", "\u014B"], [[331, 331], "valid"], [[332, 332], "mapped", "\u014D"], [[333, 333], "valid"], [[334, 334], "mapped", "\u014F"], [[335, 335], "valid"], [[336, 336], "mapped", "\u0151"], [[337, 337], "valid"], [[338, 338], "mapped", "\u0153"], [[339, 339], "valid"], [[340, 340], "mapped", "\u0155"], [[341, 341], "valid"], [[342, 342], "mapped", "\u0157"], [[343, 343], "valid"], [[344, 344], "mapped", "\u0159"], [[345, 345], "valid"], [[346, 346], "mapped", "\u015B"], [[347, 347], "valid"], [[348, 348], "mapped", "\u015D"], [[349, 349], "valid"], [[350, 350], "mapped", "\u015F"], [[351, 351], "valid"], [[352, 352], "mapped", "\u0161"], [[353, 353], "valid"], [[354, 354], "mapped", "\u0163"], [[355, 355], "valid"], [[356, 356], "mapped", "\u0165"], [[357, 357], "valid"], [[358, 358], "mapped", "\u0167"], [[359, 359], "valid"], [[360, 360], "mapped", "\u0169"], [[361, 361], "valid"], [[362, 362], "mapped", "\u016B"], [[363, 363], "valid"], [[364, 364], "mapped", "\u016D"], [[365, 365], "valid"], [[366, 366], "mapped", "\u016F"], [[367, 367], "valid"], [[368, 368], "mapped", "\u0171"], [[369, 369], "valid"], [[370, 370], "mapped", "\u0173"], [[371, 371], "valid"], [[372, 372], "mapped", "\u0175"], [[373, 373], "valid"], [[374, 374], "mapped", "\u0177"], [[375, 375], "valid"], [[376, 376], "mapped", "\xFF"], [[377, 377], "mapped", "\u017A"], [[378, 378], "valid"], [[379, 379], "mapped", "\u017C"], [[380, 380], "valid"], [[381, 381], "mapped", "\u017E"], [[382, 382], "valid"], [[383, 383], "mapped", "s"], [[384, 384], "valid"], [[385, 385], "mapped", "\u0253"], [[386, 386], "mapped", "\u0183"], [[387, 387], "valid"], [[388, 388], "mapped", "\u0185"], [[389, 389], "valid"], [[390, 390], "mapped", "\u0254"], [[391, 391], "mapped", "\u0188"], [[392, 392], "valid"], [[393, 393], "mapped", "\u0256"], [[394, 394], "mapped", "\u0257"], [[395, 395], "mapped", "\u018C"], [[396, 397], "valid"], [[398, 398], "mapped", "\u01DD"], [[399, 399], "mapped", "\u0259"], [[400, 400], "mapped", "\u025B"], [[401, 401], "mapped", "\u0192"], [[402, 402], "valid"], [[403, 403], "mapped", "\u0260"], [[404, 404], "mapped", "\u0263"], [[405, 405], "valid"], [[406, 406], "mapped", "\u0269"], [[407, 407], "mapped", "\u0268"], [[408, 408], "mapped", "\u0199"], [[409, 411], "valid"], [[412, 412], "mapped", "\u026F"], [[413, 413], "mapped", "\u0272"], [[414, 414], "valid"], [[415, 415], "mapped", "\u0275"], [[416, 416], "mapped", "\u01A1"], [[417, 417], "valid"], [[418, 418], "mapped", "\u01A3"], [[419, 419], "valid"], [[420, 420], "mapped", "\u01A5"], [[421, 421], "valid"], [[422, 422], "mapped", "\u0280"], [[423, 423], "mapped", "\u01A8"], [[424, 424], "valid"], [[425, 425], "mapped", "\u0283"], [[426, 427], "valid"], [[428, 428], "mapped", "\u01AD"], [[429, 429], "valid"], [[430, 430], "mapped", "\u0288"], [[431, 431], "mapped", "\u01B0"], [[432, 432], "valid"], [[433, 433], "mapped", "\u028A"], [[434, 434], "mapped", "\u028B"], [[435, 435], "mapped", "\u01B4"], [[436, 436], "valid"], [[437, 437], "mapped", "\u01B6"], [[438, 438], "valid"], [[439, 439], "mapped", "\u0292"], [[440, 440], "mapped", "\u01B9"], [[441, 443], "valid"], [[444, 444], "mapped", "\u01BD"], [[445, 451], "valid"], [[452, 454], "mapped", "d\u017E"], [[455, 457], "mapped", "lj"], [[458, 460], "mapped", "nj"], [[461, 461], "mapped", "\u01CE"], [[462, 462], "valid"], [[463, 463], "mapped", "\u01D0"], [[464, 464], "valid"], [[465, 465], "mapped", "\u01D2"], [[466, 466], "valid"], [[467, 467], "mapped", "\u01D4"], [[468, 468], "valid"], [[469, 469], "mapped", "\u01D6"], [[470, 470], "valid"], [[471, 471], "mapped", "\u01D8"], [[472, 472], "valid"], [[473, 473], "mapped", "\u01DA"], [[474, 474], "valid"], [[475, 475], "mapped", "\u01DC"], [[476, 477], "valid"], [[478, 478], "mapped", "\u01DF"], [[479, 479], "valid"], [[480, 480], "mapped", "\u01E1"], [[481, 481], "valid"], [[482, 482], "mapped", "\u01E3"], [[483, 483], "valid"], [[484, 484], "mapped", "\u01E5"], [[485, 485], "valid"], [[486, 486], "mapped", "\u01E7"], [[487, 487], "valid"], [[488, 488], "mapped", "\u01E9"], [[489, 489], "valid"], [[490, 490], "mapped", "\u01EB"], [[491, 491], "valid"], [[492, 492], "mapped", "\u01ED"], [[493, 493], "valid"], [[494, 494], "mapped", "\u01EF"], [[495, 496], "valid"], [[497, 499], "mapped", "dz"], [[500, 500], "mapped", "\u01F5"], [[501, 501], "valid"], [[502, 502], "mapped", "\u0195"], [[503, 503], "mapped", "\u01BF"], [[504, 504], "mapped", "\u01F9"], [[505, 505], "valid"], [[506, 506], "mapped", "\u01FB"], [[507, 507], "valid"], [[508, 508], "mapped", "\u01FD"], [[509, 509], "valid"], [[510, 510], "mapped", "\u01FF"], [[511, 511], "valid"], [[512, 512], "mapped", "\u0201"], [[513, 513], "valid"], [[514, 514], "mapped", "\u0203"], [[515, 515], "valid"], [[516, 516], "mapped", "\u0205"], [[517, 517], "valid"], [[518, 518], "mapped", "\u0207"], [[519, 519], "valid"], [[520, 520], "mapped", "\u0209"], [[521, 521], "valid"], [[522, 522], "mapped", "\u020B"], [[523, 523], "valid"], [[524, 524], "mapped", "\u020D"], [[525, 525], "valid"], [[526, 526], "mapped", "\u020F"], [[527, 527], "valid"], [[528, 528], "mapped", "\u0211"], [[529, 529], "valid"], [[530, 530], "mapped", "\u0213"], [[531, 531], "valid"], [[532, 532], "mapped", "\u0215"], [[533, 533], "valid"], [[534, 534], "mapped", "\u0217"], [[535, 535], "valid"], [[536, 536], "mapped", "\u0219"], [[537, 537], "valid"], [[538, 538], "mapped", "\u021B"], [[539, 539], "valid"], [[540, 540], "mapped", "\u021D"], [[541, 541], "valid"], [[542, 542], "mapped", "\u021F"], [[543, 543], "valid"], [[544, 544], "mapped", "\u019E"], [[545, 545], "valid"], [[546, 546], "mapped", "\u0223"], [[547, 547], "valid"], [[548, 548], "mapped", "\u0225"], [[549, 549], "valid"], [[550, 550], "mapped", "\u0227"], [[551, 551], "valid"], [[552, 552], "mapped", "\u0229"], [[553, 553], "valid"], [[554, 554], "mapped", "\u022B"], [[555, 555], "valid"], [[556, 556], "mapped", "\u022D"], [[557, 557], "valid"], [[558, 558], "mapped", "\u022F"], [[559, 559], "valid"], [[560, 560], "mapped", "\u0231"], [[561, 561], "valid"], [[562, 562], "mapped", "\u0233"], [[563, 563], "valid"], [[564, 566], "valid"], [[567, 569], "valid"], [[570, 570], "mapped", "\u2C65"], [[571, 571], "mapped", "\u023C"], [[572, 572], "valid"], [[573, 573], "mapped", "\u019A"], [[574, 574], "mapped", "\u2C66"], [[575, 576], "valid"], [[577, 577], "mapped", "\u0242"], [[578, 578], "valid"], [[579, 579], "mapped", "\u0180"], [[580, 580], "mapped", "\u0289"], [[581, 581], "mapped", "\u028C"], [[582, 582], "mapped", "\u0247"], [[583, 583], "valid"], [[584, 584], "mapped", "\u0249"], [[585, 585], "valid"], [[586, 586], "mapped", "\u024B"], [[587, 587], "valid"], [[588, 588], "mapped", "\u024D"], [[589, 589], "valid"], [[590, 590], "mapped", "\u024F"], [[591, 591], "valid"], [[592, 680], "valid"], [[681, 685], "valid"], [[686, 687], "valid"], [[688, 688], "mapped", "h"], [[689, 689], "mapped", "\u0266"], [[690, 690], "mapped", "j"], [[691, 691], "mapped", "r"], [[692, 692], "mapped", "\u0279"], [[693, 693], "mapped", "\u027B"], [[694, 694], "mapped", "\u0281"], [[695, 695], "mapped", "w"], [[696, 696], "mapped", "y"], [[697, 705], "valid"], [[706, 709], "valid", "", "NV8"], [[710, 721], "valid"], [[722, 727], "valid", "", "NV8"], [[728, 728], "disallowed_STD3_mapped", " \u0306"], [[729, 729], "disallowed_STD3_mapped", " \u0307"], [[730, 730], "disallowed_STD3_mapped", " \u030A"], [[731, 731], "disallowed_STD3_mapped", " \u0328"], [[732, 732], "disallowed_STD3_mapped", " \u0303"], [[733, 733], "disallowed_STD3_mapped", " \u030B"], [[734, 734], "valid", "", "NV8"], [[735, 735], "valid", "", "NV8"], [[736, 736], "mapped", "\u0263"], [[737, 737], "mapped", "l"], [[738, 738], "mapped", "s"], [[739, 739], "mapped", "x"], [[740, 740], "mapped", "\u0295"], [[741, 745], "valid", "", "NV8"], [[746, 747], "valid", "", "NV8"], [[748, 748], "valid"], [[749, 749], "valid", "", "NV8"], [[750, 750], "valid"], [[751, 767], "valid", "", "NV8"], [[768, 831], "valid"], [[832, 832], "mapped", "\u0300"], [[833, 833], "mapped", "\u0301"], [[834, 834], "valid"], [[835, 835], "mapped", "\u0313"], [[836, 836], "mapped", "\u0308\u0301"], [[837, 837], "mapped", "\u03B9"], [[838, 846], "valid"], [[847, 847], "ignored"], [[848, 855], "valid"], [[856, 860], "valid"], [[861, 863], "valid"], [[864, 865], "valid"], [[866, 866], "valid"], [[867, 879], "valid"], [[880, 880], "mapped", "\u0371"], [[881, 881], "valid"], [[882, 882], "mapped", "\u0373"], [[883, 883], "valid"], [[884, 884], "mapped", "\u02B9"], [[885, 885], "valid"], [[886, 886], "mapped", "\u0377"], [[887, 887], "valid"], [[888, 889], "disallowed"], [[890, 890], "disallowed_STD3_mapped", " \u03B9"], [[891, 893], "valid"], [[894, 894], "disallowed_STD3_mapped", ";"], [[895, 895], "mapped", "\u03F3"], [[896, 899], "disallowed"], [[900, 900], "disallowed_STD3_mapped", " \u0301"], [[901, 901], "disallowed_STD3_mapped", " \u0308\u0301"], [[902, 902], "mapped", "\u03AC"], [[903, 903], "mapped", "\xB7"], [[904, 904], "mapped", "\u03AD"], [[905, 905], "mapped", "\u03AE"], [[906, 906], "mapped", "\u03AF"], [[907, 907], "disallowed"], [[908, 908], "mapped", "\u03CC"], [[909, 909], "disallowed"], [[910, 910], "mapped", "\u03CD"], [[911, 911], "mapped", "\u03CE"], [[912, 912], "valid"], [[913, 913], "mapped", "\u03B1"], [[914, 914], "mapped", "\u03B2"], [[915, 915], "mapped", "\u03B3"], [[916, 916], "mapped", "\u03B4"], [[917, 917], "mapped", "\u03B5"], [[918, 918], "mapped", "\u03B6"], [[919, 919], "mapped", "\u03B7"], [[920, 920], "mapped", "\u03B8"], [[921, 921], "mapped", "\u03B9"], [[922, 922], "mapped", "\u03BA"], [[923, 923], "mapped", "\u03BB"], [[924, 924], "mapped", "\u03BC"], [[925, 925], "mapped", "\u03BD"], [[926, 926], "mapped", "\u03BE"], [[927, 927], "mapped", "\u03BF"], [[928, 928], "mapped", "\u03C0"], [[929, 929], "mapped", "\u03C1"], [[930, 930], "disallowed"], [[931, 931], "mapped", "\u03C3"], [[932, 932], "mapped", "\u03C4"], [[933, 933], "mapped", "\u03C5"], [[934, 934], "mapped", "\u03C6"], [[935, 935], "mapped", "\u03C7"], [[936, 936], "mapped", "\u03C8"], [[937, 937], "mapped", "\u03C9"], [[938, 938], "mapped", "\u03CA"], [[939, 939], "mapped", "\u03CB"], [[940, 961], "valid"], [[962, 962], "deviation", "\u03C3"], [[963, 974], "valid"], [[975, 975], "mapped", "\u03D7"], [[976, 976], "mapped", "\u03B2"], [[977, 977], "mapped", "\u03B8"], [[978, 978], "mapped", "\u03C5"], [[979, 979], "mapped", "\u03CD"], [[980, 980], "mapped", "\u03CB"], [[981, 981], "mapped", "\u03C6"], [[982, 982], "mapped", "\u03C0"], [[983, 983], "valid"], [[984, 984], "mapped", "\u03D9"], [[985, 985], "valid"], [[986, 986], "mapped", "\u03DB"], [[987, 987], "valid"], [[988, 988], "mapped", "\u03DD"], [[989, 989], "valid"], [[990, 990], "mapped", "\u03DF"], [[991, 991], "valid"], [[992, 992], "mapped", "\u03E1"], [[993, 993], "valid"], [[994, 994], "mapped", "\u03E3"], [[995, 995], "valid"], [[996, 996], "mapped", "\u03E5"], [[997, 997], "valid"], [[998, 998], "mapped", "\u03E7"], [[999, 999], "valid"], [[1e3, 1e3], "mapped", "\u03E9"], [[1001, 1001], "valid"], [[1002, 1002], "mapped", "\u03EB"], [[1003, 1003], "valid"], [[1004, 1004], "mapped", "\u03ED"], [[1005, 1005], "valid"], [[1006, 1006], "mapped", "\u03EF"], [[1007, 1007], "valid"], [[1008, 1008], "mapped", "\u03BA"], [[1009, 1009], "mapped", "\u03C1"], [[1010, 1010], "mapped", "\u03C3"], [[1011, 1011], "valid"], [[1012, 1012], "mapped", "\u03B8"], [[1013, 1013], "mapped", "\u03B5"], [[1014, 1014], "valid", "", "NV8"], [[1015, 1015], "mapped", "\u03F8"], [[1016, 1016], "valid"], [[1017, 1017], "mapped", "\u03C3"], [[1018, 1018], "mapped", "\u03FB"], [[1019, 1019], "valid"], [[1020, 1020], "valid"], [[1021, 1021], "mapped", "\u037B"], [[1022, 1022], "mapped", "\u037C"], [[1023, 1023], "mapped", "\u037D"], [[1024, 1024], "mapped", "\u0450"], [[1025, 1025], "mapped", "\u0451"], [[1026, 1026], "mapped", "\u0452"], [[1027, 1027], "mapped", "\u0453"], [[1028, 1028], "mapped", "\u0454"], [[1029, 1029], "mapped", "\u0455"], [[1030, 1030], "mapped", "\u0456"], [[1031, 1031], "mapped", "\u0457"], [[1032, 1032], "mapped", "\u0458"], [[1033, 1033], "mapped", "\u0459"], [[1034, 1034], "mapped", "\u045A"], [[1035, 1035], "mapped", "\u045B"], [[1036, 1036], "mapped", "\u045C"], [[1037, 1037], "mapped", "\u045D"], [[1038, 1038], "mapped", "\u045E"], [[1039, 1039], "mapped", "\u045F"], [[1040, 1040], "mapped", "\u0430"], [[1041, 1041], "mapped", "\u0431"], [[1042, 1042], "mapped", "\u0432"], [[1043, 1043], "mapped", "\u0433"], [[1044, 1044], "mapped", "\u0434"], [[1045, 1045], "mapped", "\u0435"], [[1046, 1046], "mapped", "\u0436"], [[1047, 1047], "mapped", "\u0437"], [[1048, 1048], "mapped", "\u0438"], [[1049, 1049], "mapped", "\u0439"], [[1050, 1050], "mapped", "\u043A"], [[1051, 1051], "mapped", "\u043B"], [[1052, 1052], "mapped", "\u043C"], [[1053, 1053], "mapped", "\u043D"], [[1054, 1054], "mapped", "\u043E"], [[1055, 1055], "mapped", "\u043F"], [[1056, 1056], "mapped", "\u0440"], [[1057, 1057], "mapped", "\u0441"], [[1058, 1058], "mapped", "\u0442"], [[1059, 1059], "mapped", "\u0443"], [[1060, 1060], "mapped", "\u0444"], [[1061, 1061], "mapped", "\u0445"], [[1062, 1062], "mapped", "\u0446"], [[1063, 1063], "mapped", "\u0447"], [[1064, 1064], "mapped", "\u0448"], [[1065, 1065], "mapped", "\u0449"], [[1066, 1066], "mapped", "\u044A"], [[1067, 1067], "mapped", "\u044B"], [[1068, 1068], "mapped", "\u044C"], [[1069, 1069], "mapped", "\u044D"], [[1070, 1070], "mapped", "\u044E"], [[1071, 1071], "mapped", "\u044F"], [[1072, 1103], "valid"], [[1104, 1104], "valid"], [[1105, 1116], "valid"], [[1117, 1117], "valid"], [[1118, 1119], "valid"], [[1120, 1120], "mapped", "\u0461"], [[1121, 1121], "valid"], [[1122, 1122], "mapped", "\u0463"], [[1123, 1123], "valid"], [[1124, 1124], "mapped", "\u0465"], [[1125, 1125], "valid"], [[1126, 1126], "mapped", "\u0467"], [[1127, 1127], "valid"], [[1128, 1128], "mapped", "\u0469"], [[1129, 1129], "valid"], [[1130, 1130], "mapped", "\u046B"], [[1131, 1131], "valid"], [[1132, 1132], "mapped", "\u046D"], [[1133, 1133], "valid"], [[1134, 1134], "mapped", "\u046F"], [[1135, 1135], "valid"], [[1136, 1136], "mapped", "\u0471"], [[1137, 1137], "valid"], [[1138, 1138], "mapped", "\u0473"], [[1139, 1139], "valid"], [[1140, 1140], "mapped", "\u0475"], [[1141, 1141], "valid"], [[1142, 1142], "mapped", "\u0477"], [[1143, 1143], "valid"], [[1144, 1144], "mapped", "\u0479"], [[1145, 1145], "valid"], [[1146, 1146], "mapped", "\u047B"], [[1147, 1147], "valid"], [[1148, 1148], "mapped", "\u047D"], [[1149, 1149], "valid"], [[1150, 1150], "mapped", "\u047F"], [[1151, 1151], "valid"], [[1152, 1152], "mapped", "\u0481"], [[1153, 1153], "valid"], [[1154, 1154], "valid", "", "NV8"], [[1155, 1158], "valid"], [[1159, 1159], "valid"], [[1160, 1161], "valid", "", "NV8"], [[1162, 1162], "mapped", "\u048B"], [[1163, 1163], "valid"], [[1164, 1164], "mapped", "\u048D"], [[1165, 1165], "valid"], [[1166, 1166], "mapped", "\u048F"], [[1167, 1167], "valid"], [[1168, 1168], "mapped", "\u0491"], [[1169, 1169], "valid"], [[1170, 1170], "mapped", "\u0493"], [[1171, 1171], "valid"], [[1172, 1172], "mapped", "\u0495"], [[1173, 1173], "valid"], [[1174, 1174], "mapped", "\u0497"], [[1175, 1175], "valid"], [[1176, 1176], "mapped", "\u0499"], [[1177, 1177], "valid"], [[1178, 1178], "mapped", "\u049B"], [[1179, 1179], "valid"], [[1180, 1180], "mapped", "\u049D"], [[1181, 1181], "valid"], [[1182, 1182], "mapped", "\u049F"], [[1183, 1183], "valid"], [[1184, 1184], "mapped", "\u04A1"], [[1185, 1185], "valid"], [[1186, 1186], "mapped", "\u04A3"], [[1187, 1187], "valid"], [[1188, 1188], "mapped", "\u04A5"], [[1189, 1189], "valid"], [[1190, 1190], "mapped", "\u04A7"], [[1191, 1191], "valid"], [[1192, 1192], "mapped", "\u04A9"], [[1193, 1193], "valid"], [[1194, 1194], "mapped", "\u04AB"], [[1195, 1195], "valid"], [[1196, 1196], "mapped", "\u04AD"], [[1197, 1197], "valid"], [[1198, 1198], "mapped", "\u04AF"], [[1199, 1199], "valid"], [[1200, 1200], "mapped", "\u04B1"], [[1201, 1201], "valid"], [[1202, 1202], "mapped", "\u04B3"], [[1203, 1203], "valid"], [[1204, 1204], "mapped", "\u04B5"], [[1205, 1205], "valid"], [[1206, 1206], "mapped", "\u04B7"], [[1207, 1207], "valid"], [[1208, 1208], "mapped", "\u04B9"], [[1209, 1209], "valid"], [[1210, 1210], "mapped", "\u04BB"], [[1211, 1211], "valid"], [[1212, 1212], "mapped", "\u04BD"], [[1213, 1213], "valid"], [[1214, 1214], "mapped", "\u04BF"], [[1215, 1215], "valid"], [[1216, 1216], "disallowed"], [[1217, 1217], "mapped", "\u04C2"], [[1218, 1218], "valid"], [[1219, 1219], "mapped", "\u04C4"], [[1220, 1220], "valid"], [[1221, 1221], "mapped", "\u04C6"], [[1222, 1222], "valid"], [[1223, 1223], "mapped", "\u04C8"], [[1224, 1224], "valid"], [[1225, 1225], "mapped", "\u04CA"], [[1226, 1226], "valid"], [[1227, 1227], "mapped", "\u04CC"], [[1228, 1228], "valid"], [[1229, 1229], "mapped", "\u04CE"], [[1230, 1230], "valid"], [[1231, 1231], "valid"], [[1232, 1232], "mapped", "\u04D1"], [[1233, 1233], "valid"], [[1234, 1234], "mapped", "\u04D3"], [[1235, 1235], "valid"], [[1236, 1236], "mapped", "\u04D5"], [[1237, 1237], "valid"], [[1238, 1238], "mapped", "\u04D7"], [[1239, 1239], "valid"], [[1240, 1240], "mapped", "\u04D9"], [[1241, 1241], "valid"], [[1242, 1242], "mapped", "\u04DB"], [[1243, 1243], "valid"], [[1244, 1244], "mapped", "\u04DD"], [[1245, 1245], "valid"], [[1246, 1246], "mapped", "\u04DF"], [[1247, 1247], "valid"], [[1248, 1248], "mapped", "\u04E1"], [[1249, 1249], "valid"], [[1250, 1250], "mapped", "\u04E3"], [[1251, 1251], "valid"], [[1252, 1252], "mapped", "\u04E5"], [[1253, 1253], "valid"], [[1254, 1254], "mapped", "\u04E7"], [[1255, 1255], "valid"], [[1256, 1256], "mapped", "\u04E9"], [[1257, 1257], "valid"], [[1258, 1258], "mapped", "\u04EB"], [[1259, 1259], "valid"], [[1260, 1260], "mapped", "\u04ED"], [[1261, 1261], "valid"], [[1262, 1262], "mapped", "\u04EF"], [[1263, 1263], "valid"], [[1264, 1264], "mapped", "\u04F1"], [[1265, 1265], "valid"], [[1266, 1266], "mapped", "\u04F3"], [[1267, 1267], "valid"], [[1268, 1268], "mapped", "\u04F5"], [[1269, 1269], "valid"], [[1270, 1270], "mapped", "\u04F7"], [[1271, 1271], "valid"], [[1272, 1272], "mapped", "\u04F9"], [[1273, 1273], "valid"], [[1274, 1274], "mapped", "\u04FB"], [[1275, 1275], "valid"], [[1276, 1276], "mapped", "\u04FD"], [[1277, 1277], "valid"], [[1278, 1278], "mapped", "\u04FF"], [[1279, 1279], "valid"], [[1280, 1280], "mapped", "\u0501"], [[1281, 1281], "valid"], [[1282, 1282], "mapped", "\u0503"], [[1283, 1283], "valid"], [[1284, 1284], "mapped", "\u0505"], [[1285, 1285], "valid"], [[1286, 1286], "mapped", "\u0507"], [[1287, 1287], "valid"], [[1288, 1288], "mapped", "\u0509"], [[1289, 1289], "valid"], [[1290, 1290], "mapped", "\u050B"], [[1291, 1291], "valid"], [[1292, 1292], "mapped", "\u050D"], [[1293, 1293], "valid"], [[1294, 1294], "mapped", "\u050F"], [[1295, 1295], "valid"], [[1296, 1296], "mapped", "\u0511"], [[1297, 1297], "valid"], [[1298, 1298], "mapped", "\u0513"], [[1299, 1299], "valid"], [[1300, 1300], "mapped", "\u0515"], [[1301, 1301], "valid"], [[1302, 1302], "mapped", "\u0517"], [[1303, 1303], "valid"], [[1304, 1304], "mapped", "\u0519"], [[1305, 1305], "valid"], [[1306, 1306], "mapped", "\u051B"], [[1307, 1307], "valid"], [[1308, 1308], "mapped", "\u051D"], [[1309, 1309], "valid"], [[1310, 1310], "mapped", "\u051F"], [[1311, 1311], "valid"], [[1312, 1312], "mapped", "\u0521"], [[1313, 1313], "valid"], [[1314, 1314], "mapped", "\u0523"], [[1315, 1315], "valid"], [[1316, 1316], "mapped", "\u0525"], [[1317, 1317], "valid"], [[1318, 1318], "mapped", "\u0527"], [[1319, 1319], "valid"], [[1320, 1320], "mapped", "\u0529"], [[1321, 1321], "valid"], [[1322, 1322], "mapped", "\u052B"], [[1323, 1323], "valid"], [[1324, 1324], "mapped", "\u052D"], [[1325, 1325], "valid"], [[1326, 1326], "mapped", "\u052F"], [[1327, 1327], "valid"], [[1328, 1328], "disallowed"], [[1329, 1329], "mapped", "\u0561"], [[1330, 1330], "mapped", "\u0562"], [[1331, 1331], "mapped", "\u0563"], [[1332, 1332], "mapped", "\u0564"], [[1333, 1333], "mapped", "\u0565"], [[1334, 1334], "mapped", "\u0566"], [[1335, 1335], "mapped", "\u0567"], [[1336, 1336], "mapped", "\u0568"], [[1337, 1337], "mapped", "\u0569"], [[1338, 1338], "mapped", "\u056A"], [[1339, 1339], "mapped", "\u056B"], [[1340, 1340], "mapped", "\u056C"], [[1341, 1341], "mapped", "\u056D"], [[1342, 1342], "mapped", "\u056E"], [[1343, 1343], "mapped", "\u056F"], [[1344, 1344], "mapped", "\u0570"], [[1345, 1345], "mapped", "\u0571"], [[1346, 1346], "mapped", "\u0572"], [[1347, 1347], "mapped", "\u0573"], [[1348, 1348], "mapped", "\u0574"], [[1349, 1349], "mapped", "\u0575"], [[1350, 1350], "mapped", "\u0576"], [[1351, 1351], "mapped", "\u0577"], [[1352, 1352], "mapped", "\u0578"], [[1353, 1353], "mapped", "\u0579"], [[1354, 1354], "mapped", "\u057A"], [[1355, 1355], "mapped", "\u057B"], [[1356, 1356], "mapped", "\u057C"], [[1357, 1357], "mapped", "\u057D"], [[1358, 1358], "mapped", "\u057E"], [[1359, 1359], "mapped", "\u057F"], [[1360, 1360], "mapped", "\u0580"], [[1361, 1361], "mapped", "\u0581"], [[1362, 1362], "mapped", "\u0582"], [[1363, 1363], "mapped", "\u0583"], [[1364, 1364], "mapped", "\u0584"], [[1365, 1365], "mapped", "\u0585"], [[1366, 1366], "mapped", "\u0586"], [[1367, 1368], "disallowed"], [[1369, 1369], "valid"], [[1370, 1375], "valid", "", "NV8"], [[1376, 1376], "disallowed"], [[1377, 1414], "valid"], [[1415, 1415], "mapped", "\u0565\u0582"], [[1416, 1416], "disallowed"], [[1417, 1417], "valid", "", "NV8"], [[1418, 1418], "valid", "", "NV8"], [[1419, 1420], "disallowed"], [[1421, 1422], "valid", "", "NV8"], [[1423, 1423], "valid", "", "NV8"], [[1424, 1424], "disallowed"], [[1425, 1441], "valid"], [[1442, 1442], "valid"], [[1443, 1455], "valid"], [[1456, 1465], "valid"], [[1466, 1466], "valid"], [[1467, 1469], "valid"], [[1470, 1470], "valid", "", "NV8"], [[1471, 1471], "valid"], [[1472, 1472], "valid", "", "NV8"], [[1473, 1474], "valid"], [[1475, 1475], "valid", "", "NV8"], [[1476, 1476], "valid"], [[1477, 1477], "valid"], [[1478, 1478], "valid", "", "NV8"], [[1479, 1479], "valid"], [[1480, 1487], "disallowed"], [[1488, 1514], "valid"], [[1515, 1519], "disallowed"], [[1520, 1524], "valid"], [[1525, 1535], "disallowed"], [[1536, 1539], "disallowed"], [[1540, 1540], "disallowed"], [[1541, 1541], "disallowed"], [[1542, 1546], "valid", "", "NV8"], [[1547, 1547], "valid", "", "NV8"], [[1548, 1548], "valid", "", "NV8"], [[1549, 1551], "valid", "", "NV8"], [[1552, 1557], "valid"], [[1558, 1562], "valid"], [[1563, 1563], "valid", "", "NV8"], [[1564, 1564], "disallowed"], [[1565, 1565], "disallowed"], [[1566, 1566], "valid", "", "NV8"], [[1567, 1567], "valid", "", "NV8"], [[1568, 1568], "valid"], [[1569, 1594], "valid"], [[1595, 1599], "valid"], [[1600, 1600], "valid", "", "NV8"], [[1601, 1618], "valid"], [[1619, 1621], "valid"], [[1622, 1624], "valid"], [[1625, 1630], "valid"], [[1631, 1631], "valid"], [[1632, 1641], "valid"], [[1642, 1645], "valid", "", "NV8"], [[1646, 1647], "valid"], [[1648, 1652], "valid"], [[1653, 1653], "mapped", "\u0627\u0674"], [[1654, 1654], "mapped", "\u0648\u0674"], [[1655, 1655], "mapped", "\u06C7\u0674"], [[1656, 1656], "mapped", "\u064A\u0674"], [[1657, 1719], "valid"], [[1720, 1721], "valid"], [[1722, 1726], "valid"], [[1727, 1727], "valid"], [[1728, 1742], "valid"], [[1743, 1743], "valid"], [[1744, 1747], "valid"], [[1748, 1748], "valid", "", "NV8"], [[1749, 1756], "valid"], [[1757, 1757], "disallowed"], [[1758, 1758], "valid", "", "NV8"], [[1759, 1768], "valid"], [[1769, 1769], "valid", "", "NV8"], [[1770, 1773], "valid"], [[1774, 1775], "valid"], [[1776, 1785], "valid"], [[1786, 1790], "valid"], [[1791, 1791], "valid"], [[1792, 1805], "valid", "", "NV8"], [[1806, 1806], "disallowed"], [[1807, 1807], "disallowed"], [[1808, 1836], "valid"], [[1837, 1839], "valid"], [[1840, 1866], "valid"], [[1867, 1868], "disallowed"], [[1869, 1871], "valid"], [[1872, 1901], "valid"], [[1902, 1919], "valid"], [[1920, 1968], "valid"], [[1969, 1969], "valid"], [[1970, 1983], "disallowed"], [[1984, 2037], "valid"], [[2038, 2042], "valid", "", "NV8"], [[2043, 2047], "disallowed"], [[2048, 2093], "valid"], [[2094, 2095], "disallowed"], [[2096, 2110], "valid", "", "NV8"], [[2111, 2111], "disallowed"], [[2112, 2139], "valid"], [[2140, 2141], "disallowed"], [[2142, 2142], "valid", "", "NV8"], [[2143, 2143], "disallowed"], [[2144, 2154], "valid"], [[2155, 2207], "disallowed"], [[2208, 2208], "valid"], [[2209, 2209], "valid"], [[2210, 2220], "valid"], [[2221, 2226], "valid"], [[2227, 2228], "valid"], [[2229, 2229], "disallowed"], [[2230, 2237], "valid"], [[2238, 2259], "disallowed"], [[2260, 2273], "valid"], [[2274, 2274], "disallowed"], [[2275, 2275], "valid"], [[2276, 2302], "valid"], [[2303, 2303], "valid"], [[2304, 2304], "valid"], [[2305, 2307], "valid"], [[2308, 2308], "valid"], [[2309, 2361], "valid"], [[2362, 2363], "valid"], [[2364, 2381], "valid"], [[2382, 2382], "valid"], [[2383, 2383], "valid"], [[2384, 2388], "valid"], [[2389, 2389], "valid"], [[2390, 2391], "valid"], [[2392, 2392], "mapped", "\u0915\u093C"], [[2393, 2393], "mapped", "\u0916\u093C"], [[2394, 2394], "mapped", "\u0917\u093C"], [[2395, 2395], "mapped", "\u091C\u093C"], [[2396, 2396], "mapped", "\u0921\u093C"], [[2397, 2397], "mapped", "\u0922\u093C"], [[2398, 2398], "mapped", "\u092B\u093C"], [[2399, 2399], "mapped", "\u092F\u093C"], [[2400, 2403], "valid"], [[2404, 2405], "valid", "", "NV8"], [[2406, 2415], "valid"], [[2416, 2416], "valid", "", "NV8"], [[2417, 2418], "valid"], [[2419, 2423], "valid"], [[2424, 2424], "valid"], [[2425, 2426], "valid"], [[2427, 2428], "valid"], [[2429, 2429], "valid"], [[2430, 2431], "valid"], [[2432, 2432], "valid"], [[2433, 2435], "valid"], [[2436, 2436], "disallowed"], [[2437, 2444], "valid"], [[2445, 2446], "disallowed"], [[2447, 2448], "valid"], [[2449, 2450], "disallowed"], [[2451, 2472], "valid"], [[2473, 2473], "disallowed"], [[2474, 2480], "valid"], [[2481, 2481], "disallowed"], [[2482, 2482], "valid"], [[2483, 2485], "disallowed"], [[2486, 2489], "valid"], [[2490, 2491], "disallowed"], [[2492, 2492], "valid"], [[2493, 2493], "valid"], [[2494, 2500], "valid"], [[2501, 2502], "disallowed"], [[2503, 2504], "valid"], [[2505, 2506], "disallowed"], [[2507, 2509], "valid"], [[2510, 2510], "valid"], [[2511, 2518], "disallowed"], [[2519, 2519], "valid"], [[2520, 2523], "disallowed"], [[2524, 2524], "mapped", "\u09A1\u09BC"], [[2525, 2525], "mapped", "\u09A2\u09BC"], [[2526, 2526], "disallowed"], [[2527, 2527], "mapped", "\u09AF\u09BC"], [[2528, 2531], "valid"], [[2532, 2533], "disallowed"], [[2534, 2545], "valid"], [[2546, 2554], "valid", "", "NV8"], [[2555, 2555], "valid", "", "NV8"], [[2556, 2556], "valid"], [[2557, 2557], "valid", "", "NV8"], [[2558, 2560], "disallowed"], [[2561, 2561], "valid"], [[2562, 2562], "valid"], [[2563, 2563], "valid"], [[2564, 2564], "disallowed"], [[2565, 2570], "valid"], [[2571, 2574], "disallowed"], [[2575, 2576], "valid"], [[2577, 2578], "disallowed"], [[2579, 2600], "valid"], [[2601, 2601], "disallowed"], [[2602, 2608], "valid"], [[2609, 2609], "disallowed"], [[2610, 2610], "valid"], [[2611, 2611], "mapped", "\u0A32\u0A3C"], [[2612, 2612], "disallowed"], [[2613, 2613], "valid"], [[2614, 2614], "mapped", "\u0A38\u0A3C"], [[2615, 2615], "disallowed"], [[2616, 2617], "valid"], [[2618, 2619], "disallowed"], [[2620, 2620], "valid"], [[2621, 2621], "disallowed"], [[2622, 2626], "valid"], [[2627, 2630], "disallowed"], [[2631, 2632], "valid"], [[2633, 2634], "disallowed"], [[2635, 2637], "valid"], [[2638, 2640], "disallowed"], [[2641, 2641], "valid"], [[2642, 2648], "disallowed"], [[2649, 2649], "mapped", "\u0A16\u0A3C"], [[2650, 2650], "mapped", "\u0A17\u0A3C"], [[2651, 2651], "mapped", "\u0A1C\u0A3C"], [[2652, 2652], "valid"], [[2653, 2653], "disallowed"], [[2654, 2654], "mapped", "\u0A2B\u0A3C"], [[2655, 2661], "disallowed"], [[2662, 2676], "valid"], [[2677, 2677], "valid"], [[2678, 2688], "disallowed"], [[2689, 2691], "valid"], [[2692, 2692], "disallowed"], [[2693, 2699], "valid"], [[2700, 2700], "valid"], [[2701, 2701], "valid"], [[2702, 2702], "disallowed"], [[2703, 2705], "valid"], [[2706, 2706], "disallowed"], [[2707, 2728], "valid"], [[2729, 2729], "disallowed"], [[2730, 2736], "valid"], [[2737, 2737], "disallowed"], [[2738, 2739], "valid"], [[2740, 2740], "disallowed"], [[2741, 2745], "valid"], [[2746, 2747], "disallowed"], [[2748, 2757], "valid"], [[2758, 2758], "disallowed"], [[2759, 2761], "valid"], [[2762, 2762], "disallowed"], [[2763, 2765], "valid"], [[2766, 2767], "disallowed"], [[2768, 2768], "valid"], [[2769, 2783], "disallowed"], [[2784, 2784], "valid"], [[2785, 2787], "valid"], [[2788, 2789], "disallowed"], [[2790, 2799], "valid"], [[2800, 2800], "valid", "", "NV8"], [[2801, 2801], "valid", "", "NV8"], [[2802, 2808], "disallowed"], [[2809, 2809], "valid"], [[2810, 2815], "valid"], [[2816, 2816], "disallowed"], [[2817, 2819], "valid"], [[2820, 2820], "disallowed"], [[2821, 2828], "valid"], [[2829, 2830], "disallowed"], [[2831, 2832], "valid"], [[2833, 2834], "disallowed"], [[2835, 2856], "valid"], [[2857, 2857], "disallowed"], [[2858, 2864], "valid"], [[2865, 2865], "disallowed"], [[2866, 2867], "valid"], [[2868, 2868], "disallowed"], [[2869, 2869], "valid"], [[2870, 2873], "valid"], [[2874, 2875], "disallowed"], [[2876, 2883], "valid"], [[2884, 2884], "valid"], [[2885, 2886], "disallowed"], [[2887, 2888], "valid"], [[2889, 2890], "disallowed"], [[2891, 2893], "valid"], [[2894, 2901], "disallowed"], [[2902, 2903], "valid"], [[2904, 2907], "disallowed"], [[2908, 2908], "mapped", "\u0B21\u0B3C"], [[2909, 2909], "mapped", "\u0B22\u0B3C"], [[2910, 2910], "disallowed"], [[2911, 2913], "valid"], [[2914, 2915], "valid"], [[2916, 2917], "disallowed"], [[2918, 2927], "valid"], [[2928, 2928], "valid", "", "NV8"], [[2929, 2929], "valid"], [[2930, 2935], "valid", "", "NV8"], [[2936, 2945], "disallowed"], [[2946, 2947], "valid"], [[2948, 2948], "disallowed"], [[2949, 2954], "valid"], [[2955, 2957], "disallowed"], [[2958, 2960], "valid"], [[2961, 2961], "disallowed"], [[2962, 2965], "valid"], [[2966, 2968], "disallowed"], [[2969, 2970], "valid"], [[2971, 2971], "disallowed"], [[2972, 2972], "valid"], [[2973, 2973], "disallowed"], [[2974, 2975], "valid"], [[2976, 2978], "disallowed"], [[2979, 2980], "valid"], [[2981, 2983], "disallowed"], [[2984, 2986], "valid"], [[2987, 2989], "disallowed"], [[2990, 2997], "valid"], [[2998, 2998], "valid"], [[2999, 3001], "valid"], [[3002, 3005], "disallowed"], [[3006, 3010], "valid"], [[3011, 3013], "disallowed"], [[3014, 3016], "valid"], [[3017, 3017], "disallowed"], [[3018, 3021], "valid"], [[3022, 3023], "disallowed"], [[3024, 3024], "valid"], [[3025, 3030], "disallowed"], [[3031, 3031], "valid"], [[3032, 3045], "disallowed"], [[3046, 3046], "valid"], [[3047, 3055], "valid"], [[3056, 3058], "valid", "", "NV8"], [[3059, 3066], "valid", "", "NV8"], [[3067, 3071], "disallowed"], [[3072, 3072], "valid"], [[3073, 3075], "valid"], [[3076, 3076], "disallowed"], [[3077, 3084], "valid"], [[3085, 3085], "disallowed"], [[3086, 3088], "valid"], [[3089, 3089], "disallowed"], [[3090, 3112], "valid"], [[3113, 3113], "disallowed"], [[3114, 3123], "valid"], [[3124, 3124], "valid"], [[3125, 3129], "valid"], [[3130, 3132], "disallowed"], [[3133, 3133], "valid"], [[3134, 3140], "valid"], [[3141, 3141], "disallowed"], [[3142, 3144], "valid"], [[3145, 3145], "disallowed"], [[3146, 3149], "valid"], [[3150, 3156], "disallowed"], [[3157, 3158], "valid"], [[3159, 3159], "disallowed"], [[3160, 3161], "valid"], [[3162, 3162], "valid"], [[3163, 3167], "disallowed"], [[3168, 3169], "valid"], [[3170, 3171], "valid"], [[3172, 3173], "disallowed"], [[3174, 3183], "valid"], [[3184, 3191], "disallowed"], [[3192, 3199], "valid", "", "NV8"], [[3200, 3200], "valid"], [[3201, 3201], "valid"], [[3202, 3203], "valid"], [[3204, 3204], "disallowed"], [[3205, 3212], "valid"], [[3213, 3213], "disallowed"], [[3214, 3216], "valid"], [[3217, 3217], "disallowed"], [[3218, 3240], "valid"], [[3241, 3241], "disallowed"], [[3242, 3251], "valid"], [[3252, 3252], "disallowed"], [[3253, 3257], "valid"], [[3258, 3259], "disallowed"], [[3260, 3261], "valid"], [[3262, 3268], "valid"], [[3269, 3269], "disallowed"], [[3270, 3272], "valid"], [[3273, 3273], "disallowed"], [[3274, 3277], "valid"], [[3278, 3284], "disallowed"], [[3285, 3286], "valid"], [[3287, 3293], "disallowed"], [[3294, 3294], "valid"], [[3295, 3295], "disallowed"], [[3296, 3297], "valid"], [[3298, 3299], "valid"], [[3300, 3301], "disallowed"], [[3302, 3311], "valid"], [[3312, 3312], "disallowed"], [[3313, 3314], "valid"], [[3315, 3327], "disallowed"], [[3328, 3328], "valid"], [[3329, 3329], "valid"], [[3330, 3331], "valid"], [[3332, 3332], "disallowed"], [[3333, 3340], "valid"], [[3341, 3341], "disallowed"], [[3342, 3344], "valid"], [[3345, 3345], "disallowed"], [[3346, 3368], "valid"], [[3369, 3369], "valid"], [[3370, 3385], "valid"], [[3386, 3386], "valid"], [[3387, 3388], "valid"], [[3389, 3389], "valid"], [[3390, 3395], "valid"], [[3396, 3396], "valid"], [[3397, 3397], "disallowed"], [[3398, 3400], "valid"], [[3401, 3401], "disallowed"], [[3402, 3405], "valid"], [[3406, 3406], "valid"], [[3407, 3407], "valid", "", "NV8"], [[3408, 3411], "disallowed"], [[3412, 3414], "valid"], [[3415, 3415], "valid"], [[3416, 3422], "valid", "", "NV8"], [[3423, 3423], "valid"], [[3424, 3425], "valid"], [[3426, 3427], "valid"], [[3428, 3429], "disallowed"], [[3430, 3439], "valid"], [[3440, 3445], "valid", "", "NV8"], [[3446, 3448], "valid", "", "NV8"], [[3449, 3449], "valid", "", "NV8"], [[3450, 3455], "valid"], [[3456, 3457], "disallowed"], [[3458, 3459], "valid"], [[3460, 3460], "disallowed"], [[3461, 3478], "valid"], [[3479, 3481], "disallowed"], [[3482, 3505], "valid"], [[3506, 3506], "disallowed"], [[3507, 3515], "valid"], [[3516, 3516], "disallowed"], [[3517, 3517], "valid"], [[3518, 3519], "disallowed"], [[3520, 3526], "valid"], [[3527, 3529], "disallowed"], [[3530, 3530], "valid"], [[3531, 3534], "disallowed"], [[3535, 3540], "valid"], [[3541, 3541], "disallowed"], [[3542, 3542], "valid"], [[3543, 3543], "disallowed"], [[3544, 3551], "valid"], [[3552, 3557], "disallowed"], [[3558, 3567], "valid"], [[3568, 3569], "disallowed"], [[3570, 3571], "valid"], [[3572, 3572], "valid", "", "NV8"], [[3573, 3584], "disallowed"], [[3585, 3634], "valid"], [[3635, 3635], "mapped", "\u0E4D\u0E32"], [[3636, 3642], "valid"], [[3643, 3646], "disallowed"], [[3647, 3647], "valid", "", "NV8"], [[3648, 3662], "valid"], [[3663, 3663], "valid", "", "NV8"], [[3664, 3673], "valid"], [[3674, 3675], "valid", "", "NV8"], [[3676, 3712], "disallowed"], [[3713, 3714], "valid"], [[3715, 3715], "disallowed"], [[3716, 3716], "valid"], [[3717, 3718], "disallowed"], [[3719, 3720], "valid"], [[3721, 3721], "disallowed"], [[3722, 3722], "valid"], [[3723, 3724], "disallowed"], [[3725, 3725], "valid"], [[3726, 3731], "disallowed"], [[3732, 3735], "valid"], [[3736, 3736], "disallowed"], [[3737, 3743], "valid"], [[3744, 3744], "disallowed"], [[3745, 3747], "valid"], [[3748, 3748], "disallowed"], [[3749, 3749], "valid"], [[3750, 3750], "disallowed"], [[3751, 3751], "valid"], [[3752, 3753], "disallowed"], [[3754, 3755], "valid"], [[3756, 3756], "disallowed"], [[3757, 3762], "valid"], [[3763, 3763], "mapped", "\u0ECD\u0EB2"], [[3764, 3769], "valid"], [[3770, 3770], "disallowed"], [[3771, 3773], "valid"], [[3774, 3775], "disallowed"], [[3776, 3780], "valid"], [[3781, 3781], "disallowed"], [[3782, 3782], "valid"], [[3783, 3783], "disallowed"], [[3784, 3789], "valid"], [[3790, 3791], "disallowed"], [[3792, 3801], "valid"], [[3802, 3803], "disallowed"], [[3804, 3804], "mapped", "\u0EAB\u0E99"], [[3805, 3805], "mapped", "\u0EAB\u0EA1"], [[3806, 3807], "valid"], [[3808, 3839], "disallowed"], [[3840, 3840], "valid"], [[3841, 3850], "valid", "", "NV8"], [[3851, 3851], "valid"], [[3852, 3852], "mapped", "\u0F0B"], [[3853, 3863], "valid", "", "NV8"], [[3864, 3865], "valid"], [[3866, 3871], "valid", "", "NV8"], [[3872, 3881], "valid"], [[3882, 3892], "valid", "", "NV8"], [[3893, 3893], "valid"], [[3894, 3894], "valid", "", "NV8"], [[3895, 3895], "valid"], [[3896, 3896], "valid", "", "NV8"], [[3897, 3897], "valid"], [[3898, 3901], "valid", "", "NV8"], [[3902, 3906], "valid"], [[3907, 3907], "mapped", "\u0F42\u0FB7"], [[3908, 3911], "valid"], [[3912, 3912], "disallowed"], [[3913, 3916], "valid"], [[3917, 3917], "mapped", "\u0F4C\u0FB7"], [[3918, 3921], "valid"], [[3922, 3922], "mapped", "\u0F51\u0FB7"], [[3923, 3926], "valid"], [[3927, 3927], "mapped", "\u0F56\u0FB7"], [[3928, 3931], "valid"], [[3932, 3932], "mapped", "\u0F5B\u0FB7"], [[3933, 3944], "valid"], [[3945, 3945], "mapped", "\u0F40\u0FB5"], [[3946, 3946], "valid"], [[3947, 3948], "valid"], [[3949, 3952], "disallowed"], [[3953, 3954], "valid"], [[3955, 3955], "mapped", "\u0F71\u0F72"], [[3956, 3956], "valid"], [[3957, 3957], "mapped", "\u0F71\u0F74"], [[3958, 3958], "mapped", "\u0FB2\u0F80"], [[3959, 3959], "mapped", "\u0FB2\u0F71\u0F80"], [[3960, 3960], "mapped", "\u0FB3\u0F80"], [[3961, 3961], "mapped", "\u0FB3\u0F71\u0F80"], [[3962, 3968], "valid"], [[3969, 3969], "mapped", "\u0F71\u0F80"], [[3970, 3972], "valid"], [[3973, 3973], "valid", "", "NV8"], [[3974, 3979], "valid"], [[3980, 3983], "valid"], [[3984, 3986], "valid"], [[3987, 3987], "mapped", "\u0F92\u0FB7"], [[3988, 3989], "valid"], [[3990, 3990], "valid"], [[3991, 3991], "valid"], [[3992, 3992], "disallowed"], [[3993, 3996], "valid"], [[3997, 3997], "mapped", "\u0F9C\u0FB7"], [[3998, 4001], "valid"], [[4002, 4002], "mapped", "\u0FA1\u0FB7"], [[4003, 4006], "valid"], [[4007, 4007], "mapped", "\u0FA6\u0FB7"], [[4008, 4011], "valid"], [[4012, 4012], "mapped", "\u0FAB\u0FB7"], [[4013, 4013], "valid"], [[4014, 4016], "valid"], [[4017, 4023], "valid"], [[4024, 4024], "valid"], [[4025, 4025], "mapped", "\u0F90\u0FB5"], [[4026, 4028], "valid"], [[4029, 4029], "disallowed"], [[4030, 4037], "valid", "", "NV8"], [[4038, 4038], "valid"], [[4039, 4044], "valid", "", "NV8"], [[4045, 4045], "disallowed"], [[4046, 4046], "valid", "", "NV8"], [[4047, 4047], "valid", "", "NV8"], [[4048, 4049], "valid", "", "NV8"], [[4050, 4052], "valid", "", "NV8"], [[4053, 4056], "valid", "", "NV8"], [[4057, 4058], "valid", "", "NV8"], [[4059, 4095], "disallowed"], [[4096, 4129], "valid"], [[4130, 4130], "valid"], [[4131, 4135], "valid"], [[4136, 4136], "valid"], [[4137, 4138], "valid"], [[4139, 4139], "valid"], [[4140, 4146], "valid"], [[4147, 4149], "valid"], [[4150, 4153], "valid"], [[4154, 4159], "valid"], [[4160, 4169], "valid"], [[4170, 4175], "valid", "", "NV8"], [[4176, 4185], "valid"], [[4186, 4249], "valid"], [[4250, 4253], "valid"], [[4254, 4255], "valid", "", "NV8"], [[4256, 4293], "disallowed"], [[4294, 4294], "disallowed"], [[4295, 4295], "mapped", "\u2D27"], [[4296, 4300], "disallowed"], [[4301, 4301], "mapped", "\u2D2D"], [[4302, 4303], "disallowed"], [[4304, 4342], "valid"], [[4343, 4344], "valid"], [[4345, 4346], "valid"], [[4347, 4347], "valid", "", "NV8"], [[4348, 4348], "mapped", "\u10DC"], [[4349, 4351], "valid"], [[4352, 4441], "valid", "", "NV8"], [[4442, 4446], "valid", "", "NV8"], [[4447, 4448], "disallowed"], [[4449, 4514], "valid", "", "NV8"], [[4515, 4519], "valid", "", "NV8"], [[4520, 4601], "valid", "", "NV8"], [[4602, 4607], "valid", "", "NV8"], [[4608, 4614], "valid"], [[4615, 4615], "valid"], [[4616, 4678], "valid"], [[4679, 4679], "valid"], [[4680, 4680], "valid"], [[4681, 4681], "disallowed"], [[4682, 4685], "valid"], [[4686, 4687], "disallowed"], [[4688, 4694], "valid"], [[4695, 4695], "disallowed"], [[4696, 4696], "valid"], [[4697, 4697], "disallowed"], [[4698, 4701], "valid"], [[4702, 4703], "disallowed"], [[4704, 4742], "valid"], [[4743, 4743], "valid"], [[4744, 4744], "valid"], [[4745, 4745], "disallowed"], [[4746, 4749], "valid"], [[4750, 4751], "disallowed"], [[4752, 4782], "valid"], [[4783, 4783], "valid"], [[4784, 4784], "valid"], [[4785, 4785], "disallowed"], [[4786, 4789], "valid"], [[4790, 4791], "disallowed"], [[4792, 4798], "valid"], [[4799, 4799], "disallowed"], [[4800, 4800], "valid"], [[4801, 4801], "disallowed"], [[4802, 4805], "valid"], [[4806, 4807], "disallowed"], [[4808, 4814], "valid"], [[4815, 4815], "valid"], [[4816, 4822], "valid"], [[4823, 4823], "disallowed"], [[4824, 4846], "valid"], [[4847, 4847], "valid"], [[4848, 4878], "valid"], [[4879, 4879], "valid"], [[4880, 4880], "valid"], [[4881, 4881], "disallowed"], [[4882, 4885], "valid"], [[4886, 4887], "disallowed"], [[4888, 4894], "valid"], [[4895, 4895], "valid"], [[4896, 4934], "valid"], [[4935, 4935], "valid"], [[4936, 4954], "valid"], [[4955, 4956], "disallowed"], [[4957, 4958], "valid"], [[4959, 4959], "valid"], [[4960, 4960], "valid", "", "NV8"], [[4961, 4988], "valid", "", "NV8"], [[4989, 4991], "disallowed"], [[4992, 5007], "valid"], [[5008, 5017], "valid", "", "NV8"], [[5018, 5023], "disallowed"], [[5024, 5108], "valid"], [[5109, 5109], "valid"], [[5110, 5111], "disallowed"], [[5112, 5112], "mapped", "\u13F0"], [[5113, 5113], "mapped", "\u13F1"], [[5114, 5114], "mapped", "\u13F2"], [[5115, 5115], "mapped", "\u13F3"], [[5116, 5116], "mapped", "\u13F4"], [[5117, 5117], "mapped", "\u13F5"], [[5118, 5119], "disallowed"], [[5120, 5120], "valid", "", "NV8"], [[5121, 5740], "valid"], [[5741, 5742], "valid", "", "NV8"], [[5743, 5750], "valid"], [[5751, 5759], "valid"], [[5760, 5760], "disallowed"], [[5761, 5786], "valid"], [[5787, 5788], "valid", "", "NV8"], [[5789, 5791], "disallowed"], [[5792, 5866], "valid"], [[5867, 5872], "valid", "", "NV8"], [[5873, 5880], "valid"], [[5881, 5887], "disallowed"], [[5888, 5900], "valid"], [[5901, 5901], "disallowed"], [[5902, 5908], "valid"], [[5909, 5919], "disallowed"], [[5920, 5940], "valid"], [[5941, 5942], "valid", "", "NV8"], [[5943, 5951], "disallowed"], [[5952, 5971], "valid"], [[5972, 5983], "disallowed"], [[5984, 5996], "valid"], [[5997, 5997], "disallowed"], [[5998, 6e3], "valid"], [[6001, 6001], "disallowed"], [[6002, 6003], "valid"], [[6004, 6015], "disallowed"], [[6016, 6067], "valid"], [[6068, 6069], "disallowed"], [[6070, 6099], "valid"], [[6100, 6102], "valid", "", "NV8"], [[6103, 6103], "valid"], [[6104, 6107], "valid", "", "NV8"], [[6108, 6108], "valid"], [[6109, 6109], "valid"], [[6110, 6111], "disallowed"], [[6112, 6121], "valid"], [[6122, 6127], "disallowed"], [[6128, 6137], "valid", "", "NV8"], [[6138, 6143], "disallowed"], [[6144, 6149], "valid", "", "NV8"], [[6150, 6150], "disallowed"], [[6151, 6154], "valid", "", "NV8"], [[6155, 6157], "ignored"], [[6158, 6158], "disallowed"], [[6159, 6159], "disallowed"], [[6160, 6169], "valid"], [[6170, 6175], "disallowed"], [[6176, 6263], "valid"], [[6264, 6271], "disallowed"], [[6272, 6313], "valid"], [[6314, 6314], "valid"], [[6315, 6319], "disallowed"], [[6320, 6389], "valid"], [[6390, 6399], "disallowed"], [[6400, 6428], "valid"], [[6429, 6430], "valid"], [[6431, 6431], "disallowed"], [[6432, 6443], "valid"], [[6444, 6447], "disallowed"], [[6448, 6459], "valid"], [[6460, 6463], "disallowed"], [[6464, 6464], "valid", "", "NV8"], [[6465, 6467], "disallowed"], [[6468, 6469], "valid", "", "NV8"], [[6470, 6509], "valid"], [[6510, 6511], "disallowed"], [[6512, 6516], "valid"], [[6517, 6527], "disallowed"], [[6528, 6569], "valid"], [[6570, 6571], "valid"], [[6572, 6575], "disallowed"], [[6576, 6601], "valid"], [[6602, 6607], "disallowed"], [[6608, 6617], "valid"], [[6618, 6618], "valid", "", "XV8"], [[6619, 6621], "disallowed"], [[6622, 6623], "valid", "", "NV8"], [[6624, 6655], "valid", "", "NV8"], [[6656, 6683], "valid"], [[6684, 6685], "disallowed"], [[6686, 6687], "valid", "", "NV8"], [[6688, 6750], "valid"], [[6751, 6751], "disallowed"], [[6752, 6780], "valid"], [[6781, 6782], "disallowed"], [[6783, 6793], "valid"], [[6794, 6799], "disallowed"], [[6800, 6809], "valid"], [[6810, 6815], "disallowed"], [[6816, 6822], "valid", "", "NV8"], [[6823, 6823], "valid"], [[6824, 6829], "valid", "", "NV8"], [[6830, 6831], "disallowed"], [[6832, 6845], "valid"], [[6846, 6846], "valid", "", "NV8"], [[6847, 6911], "disallowed"], [[6912, 6987], "valid"], [[6988, 6991], "disallowed"], [[6992, 7001], "valid"], [[7002, 7018], "valid", "", "NV8"], [[7019, 7027], "valid"], [[7028, 7036], "valid", "", "NV8"], [[7037, 7039], "disallowed"], [[7040, 7082], "valid"], [[7083, 7085], "valid"], [[7086, 7097], "valid"], [[7098, 7103], "valid"], [[7104, 7155], "valid"], [[7156, 7163], "disallowed"], [[7164, 7167], "valid", "", "NV8"], [[7168, 7223], "valid"], [[7224, 7226], "disallowed"], [[7227, 7231], "valid", "", "NV8"], [[7232, 7241], "valid"], [[7242, 7244], "disallowed"], [[7245, 7293], "valid"], [[7294, 7295], "valid", "", "NV8"], [[7296, 7296], "mapped", "\u0432"], [[7297, 7297], "mapped", "\u0434"], [[7298, 7298], "mapped", "\u043E"], [[7299, 7299], "mapped", "\u0441"], [[7300, 7301], "mapped", "\u0442"], [[7302, 7302], "mapped", "\u044A"], [[7303, 7303], "mapped", "\u0463"], [[7304, 7304], "mapped", "\uA64B"], [[7305, 7359], "disallowed"], [[7360, 7367], "valid", "", "NV8"], [[7368, 7375], "disallowed"], [[7376, 7378], "valid"], [[7379, 7379], "valid", "", "NV8"], [[7380, 7410], "valid"], [[7411, 7414], "valid"], [[7415, 7415], "valid"], [[7416, 7417], "valid"], [[7418, 7423], "disallowed"], [[7424, 7467], "valid"], [[7468, 7468], "mapped", "a"], [[7469, 7469], "mapped", "\xE6"], [[7470, 7470], "mapped", "b"], [[7471, 7471], "valid"], [[7472, 7472], "mapped", "d"], [[7473, 7473], "mapped", "e"], [[7474, 7474], "mapped", "\u01DD"], [[7475, 7475], "mapped", "g"], [[7476, 7476], "mapped", "h"], [[7477, 7477], "mapped", "i"], [[7478, 7478], "mapped", "j"], [[7479, 7479], "mapped", "k"], [[7480, 7480], "mapped", "l"], [[7481, 7481], "mapped", "m"], [[7482, 7482], "mapped", "n"], [[7483, 7483], "valid"], [[7484, 7484], "mapped", "o"], [[7485, 7485], "mapped", "\u0223"], [[7486, 7486], "mapped", "p"], [[7487, 7487], "mapped", "r"], [[7488, 7488], "mapped", "t"], [[7489, 7489], "mapped", "u"], [[7490, 7490], "mapped", "w"], [[7491, 7491], "mapped", "a"], [[7492, 7492], "mapped", "\u0250"], [[7493, 7493], "mapped", "\u0251"], [[7494, 7494], "mapped", "\u1D02"], [[7495, 7495], "mapped", "b"], [[7496, 7496], "mapped", "d"], [[7497, 7497], "mapped", "e"], [[7498, 7498], "mapped", "\u0259"], [[7499, 7499], "mapped", "\u025B"], [[7500, 7500], "mapped", "\u025C"], [[7501, 7501], "mapped", "g"], [[7502, 7502], "valid"], [[7503, 7503], "mapped", "k"], [[7504, 7504], "mapped", "m"], [[7505, 7505], "mapped", "\u014B"], [[7506, 7506], "mapped", "o"], [[7507, 7507], "mapped", "\u0254"], [[7508, 7508], "mapped", "\u1D16"], [[7509, 7509], "mapped", "\u1D17"], [[7510, 7510], "mapped", "p"], [[7511, 7511], "mapped", "t"], [[7512, 7512], "mapped", "u"], [[7513, 7513], "mapped", "\u1D1D"], [[7514, 7514], "mapped", "\u026F"], [[7515, 7515], "mapped", "v"], [[7516, 7516], "mapped", "\u1D25"], [[7517, 7517], "mapped", "\u03B2"], [[7518, 7518], "mapped", "\u03B3"], [[7519, 7519], "mapped", "\u03B4"], [[7520, 7520], "mapped", "\u03C6"], [[7521, 7521], "mapped", "\u03C7"], [[7522, 7522], "mapped", "i"], [[7523, 7523], "mapped", "r"], [[7524, 7524], "mapped", "u"], [[7525, 7525], "mapped", "v"], [[7526, 7526], "mapped", "\u03B2"], [[7527, 7527], "mapped", "\u03B3"], [[7528, 7528], "mapped", "\u03C1"], [[7529, 7529], "mapped", "\u03C6"], [[7530, 7530], "mapped", "\u03C7"], [[7531, 7531], "valid"], [[7532, 7543], "valid"], [[7544, 7544], "mapped", "\u043D"], [[7545, 7578], "valid"], [[7579, 7579], "mapped", "\u0252"], [[7580, 7580], "mapped", "c"], [[7581, 7581], "mapped", "\u0255"], [[7582, 7582], "mapped", "\xF0"], [[7583, 7583], "mapped", "\u025C"], [[7584, 7584], "mapped", "f"], [[7585, 7585], "mapped", "\u025F"], [[7586, 7586], "mapped", "\u0261"], [[7587, 7587], "mapped", "\u0265"], [[7588, 7588], "mapped", "\u0268"], [[7589, 7589], "mapped", "\u0269"], [[7590, 7590], "mapped", "\u026A"], [[7591, 7591], "mapped", "\u1D7B"], [[7592, 7592], "mapped", "\u029D"], [[7593, 7593], "mapped", "\u026D"], [[7594, 7594], "mapped", "\u1D85"], [[7595, 7595], "mapped", "\u029F"], [[7596, 7596], "mapped", "\u0271"], [[7597, 7597], "mapped", "\u0270"], [[7598, 7598], "mapped", "\u0272"], [[7599, 7599], "mapped", "\u0273"], [[7600, 7600], "mapped", "\u0274"], [[7601, 7601], "mapped", "\u0275"], [[7602, 7602], "mapped", "\u0278"], [[7603, 7603], "mapped", "\u0282"], [[7604, 7604], "mapped", "\u0283"], [[7605, 7605], "mapped", "\u01AB"], [[7606, 7606], "mapped", "\u0289"], [[7607, 7607], "mapped", "\u028A"], [[7608, 7608], "mapped", "\u1D1C"], [[7609, 7609], "mapped", "\u028B"], [[7610, 7610], "mapped", "\u028C"], [[7611, 7611], "mapped", "z"], [[7612, 7612], "mapped", "\u0290"], [[7613, 7613], "mapped", "\u0291"], [[7614, 7614], "mapped", "\u0292"], [[7615, 7615], "mapped", "\u03B8"], [[7616, 7619], "valid"], [[7620, 7626], "valid"], [[7627, 7654], "valid"], [[7655, 7669], "valid"], [[7670, 7673], "valid"], [[7674, 7674], "disallowed"], [[7675, 7675], "valid"], [[7676, 7676], "valid"], [[7677, 7677], "valid"], [[7678, 7679], "valid"], [[7680, 7680], "mapped", "\u1E01"], [[7681, 7681], "valid"], [[7682, 7682], "mapped", "\u1E03"], [[7683, 7683], "valid"], [[7684, 7684], "mapped", "\u1E05"], [[7685, 7685], "valid"], [[7686, 7686], "mapped", "\u1E07"], [[7687, 7687], "valid"], [[7688, 7688], "mapped", "\u1E09"], [[7689, 7689], "valid"], [[7690, 7690], "mapped", "\u1E0B"], [[7691, 7691], "valid"], [[7692, 7692], "mapped", "\u1E0D"], [[7693, 7693], "valid"], [[7694, 7694], "mapped", "\u1E0F"], [[7695, 7695], "valid"], [[7696, 7696], "mapped", "\u1E11"], [[7697, 7697], "valid"], [[7698, 7698], "mapped", "\u1E13"], [[7699, 7699], "valid"], [[7700, 7700], "mapped", "\u1E15"], [[7701, 7701], "valid"], [[7702, 7702], "mapped", "\u1E17"], [[7703, 7703], "valid"], [[7704, 7704], "mapped", "\u1E19"], [[7705, 7705], "valid"], [[7706, 7706], "mapped", "\u1E1B"], [[7707, 7707], "valid"], [[7708, 7708], "mapped", "\u1E1D"], [[7709, 7709], "valid"], [[7710, 7710], "mapped", "\u1E1F"], [[7711, 7711], "valid"], [[7712, 7712], "mapped", "\u1E21"], [[7713, 7713], "valid"], [[7714, 7714], "mapped", "\u1E23"], [[7715, 7715], "valid"], [[7716, 7716], "mapped", "\u1E25"], [[7717, 7717], "valid"], [[7718, 7718], "mapped", "\u1E27"], [[7719, 7719], "valid"], [[7720, 7720], "mapped", "\u1E29"], [[7721, 7721], "valid"], [[7722, 7722], "mapped", "\u1E2B"], [[7723, 7723], "valid"], [[7724, 7724], "mapped", "\u1E2D"], [[7725, 7725], "valid"], [[7726, 7726], "mapped", "\u1E2F"], [[7727, 7727], "valid"], [[7728, 7728], "mapped", "\u1E31"], [[7729, 7729], "valid"], [[7730, 7730], "mapped", "\u1E33"], [[7731, 7731], "valid"], [[7732, 7732], "mapped", "\u1E35"], [[7733, 7733], "valid"], [[7734, 7734], "mapped", "\u1E37"], [[7735, 7735], "valid"], [[7736, 7736], "mapped", "\u1E39"], [[7737, 7737], "valid"], [[7738, 7738], "mapped", "\u1E3B"], [[7739, 7739], "valid"], [[7740, 7740], "mapped", "\u1E3D"], [[7741, 7741], "valid"], [[7742, 7742], "mapped", "\u1E3F"], [[7743, 7743], "valid"], [[7744, 7744], "mapped", "\u1E41"], [[7745, 7745], "valid"], [[7746, 7746], "mapped", "\u1E43"], [[7747, 7747], "valid"], [[7748, 7748], "mapped", "\u1E45"], [[7749, 7749], "valid"], [[7750, 7750], "mapped", "\u1E47"], [[7751, 7751], "valid"], [[7752, 7752], "mapped", "\u1E49"], [[7753, 7753], "valid"], [[7754, 7754], "mapped", "\u1E4B"], [[7755, 7755], "valid"], [[7756, 7756], "mapped", "\u1E4D"], [[7757, 7757], "valid"], [[7758, 7758], "mapped", "\u1E4F"], [[7759, 7759], "valid"], [[7760, 7760], "mapped", "\u1E51"], [[7761, 7761], "valid"], [[7762, 7762], "mapped", "\u1E53"], [[7763, 7763], "valid"], [[7764, 7764], "mapped", "\u1E55"], [[7765, 7765], "valid"], [[7766, 7766], "mapped", "\u1E57"], [[7767, 7767], "valid"], [[7768, 7768], "mapped", "\u1E59"], [[7769, 7769], "valid"], [[7770, 7770], "mapped", "\u1E5B"], [[7771, 7771], "valid"], [[7772, 7772], "mapped", "\u1E5D"], [[7773, 7773], "valid"], [[7774, 7774], "mapped", "\u1E5F"], [[7775, 7775], "valid"], [[7776, 7776], "mapped", "\u1E61"], [[7777, 7777], "valid"], [[7778, 7778], "mapped", "\u1E63"], [[7779, 7779], "valid"], [[7780, 7780], "mapped", "\u1E65"], [[7781, 7781], "valid"], [[7782, 7782], "mapped", "\u1E67"], [[7783, 7783], "valid"], [[7784, 7784], "mapped", "\u1E69"], [[7785, 7785], "valid"], [[7786, 7786], "mapped", "\u1E6B"], [[7787, 7787], "valid"], [[7788, 7788], "mapped", "\u1E6D"], [[7789, 7789], "valid"], [[7790, 7790], "mapped", "\u1E6F"], [[7791, 7791], "valid"], [[7792, 7792], "mapped", "\u1E71"], [[7793, 7793], "valid"], [[7794, 7794], "mapped", "\u1E73"], [[7795, 7795], "valid"], [[7796, 7796], "mapped", "\u1E75"], [[7797, 7797], "valid"], [[7798, 7798], "mapped", "\u1E77"], [[7799, 7799], "valid"], [[7800, 7800], "mapped", "\u1E79"], [[7801, 7801], "valid"], [[7802, 7802], "mapped", "\u1E7B"], [[7803, 7803], "valid"], [[7804, 7804], "mapped", "\u1E7D"], [[7805, 7805], "valid"], [[7806, 7806], "mapped", "\u1E7F"], [[7807, 7807], "valid"], [[7808, 7808], "mapped", "\u1E81"], [[7809, 7809], "valid"], [[7810, 7810], "mapped", "\u1E83"], [[7811, 7811], "valid"], [[7812, 7812], "mapped", "\u1E85"], [[7813, 7813], "valid"], [[7814, 7814], "mapped", "\u1E87"], [[7815, 7815], "valid"], [[7816, 7816], "mapped", "\u1E89"], [[7817, 7817], "valid"], [[7818, 7818], "mapped", "\u1E8B"], [[7819, 7819], "valid"], [[7820, 7820], "mapped", "\u1E8D"], [[7821, 7821], "valid"], [[7822, 7822], "mapped", "\u1E8F"], [[7823, 7823], "valid"], [[7824, 7824], "mapped", "\u1E91"], [[7825, 7825], "valid"], [[7826, 7826], "mapped", "\u1E93"], [[7827, 7827], "valid"], [[7828, 7828], "mapped", "\u1E95"], [[7829, 7833], "valid"], [[7834, 7834], "mapped", "a\u02BE"], [[7835, 7835], "mapped", "\u1E61"], [[7836, 7837], "valid"], [[7838, 7838], "mapped", "ss"], [[7839, 7839], "valid"], [[7840, 7840], "mapped", "\u1EA1"], [[7841, 7841], "valid"], [[7842, 7842], "mapped", "\u1EA3"], [[7843, 7843], "valid"], [[7844, 7844], "mapped", "\u1EA5"], [[7845, 7845], "valid"], [[7846, 7846], "mapped", "\u1EA7"], [[7847, 7847], "valid"], [[7848, 7848], "mapped", "\u1EA9"], [[7849, 7849], "valid"], [[7850, 7850], "mapped", "\u1EAB"], [[7851, 7851], "valid"], [[7852, 7852], "mapped", "\u1EAD"], [[7853, 7853], "valid"], [[7854, 7854], "mapped", "\u1EAF"], [[7855, 7855], "valid"], [[7856, 7856], "mapped", "\u1EB1"], [[7857, 7857], "valid"], [[7858, 7858], "mapped", "\u1EB3"], [[7859, 7859], "valid"], [[7860, 7860], "mapped", "\u1EB5"], [[7861, 7861], "valid"], [[7862, 7862], "mapped", "\u1EB7"], [[7863, 7863], "valid"], [[7864, 7864], "mapped", "\u1EB9"], [[7865, 7865], "valid"], [[7866, 7866], "mapped", "\u1EBB"], [[7867, 7867], "valid"], [[7868, 7868], "mapped", "\u1EBD"], [[7869, 7869], "valid"], [[7870, 7870], "mapped", "\u1EBF"], [[7871, 7871], "valid"], [[7872, 7872], "mapped", "\u1EC1"], [[7873, 7873], "valid"], [[7874, 7874], "mapped", "\u1EC3"], [[7875, 7875], "valid"], [[7876, 7876], "mapped", "\u1EC5"], [[7877, 7877], "valid"], [[7878, 7878], "mapped", "\u1EC7"], [[7879, 7879], "valid"], [[7880, 7880], "mapped", "\u1EC9"], [[7881, 7881], "valid"], [[7882, 7882], "mapped", "\u1ECB"], [[7883, 7883], "valid"], [[7884, 7884], "mapped", "\u1ECD"], [[7885, 7885], "valid"], [[7886, 7886], "mapped", "\u1ECF"], [[7887, 7887], "valid"], [[7888, 7888], "mapped", "\u1ED1"], [[7889, 7889], "valid"], [[7890, 7890], "mapped", "\u1ED3"], [[7891, 7891], "valid"], [[7892, 7892], "mapped", "\u1ED5"], [[7893, 7893], "valid"], [[7894, 7894], "mapped", "\u1ED7"], [[7895, 7895], "valid"], [[7896, 7896], "mapped", "\u1ED9"], [[7897, 7897], "valid"], [[7898, 7898], "mapped", "\u1EDB"], [[7899, 7899], "valid"], [[7900, 7900], "mapped", "\u1EDD"], [[7901, 7901], "valid"], [[7902, 7902], "mapped", "\u1EDF"], [[7903, 7903], "valid"], [[7904, 7904], "mapped", "\u1EE1"], [[7905, 7905], "valid"], [[7906, 7906], "mapped", "\u1EE3"], [[7907, 7907], "valid"], [[7908, 7908], "mapped", "\u1EE5"], [[7909, 7909], "valid"], [[7910, 7910], "mapped", "\u1EE7"], [[7911, 7911], "valid"], [[7912, 7912], "mapped", "\u1EE9"], [[7913, 7913], "valid"], [[7914, 7914], "mapped", "\u1EEB"], [[7915, 7915], "valid"], [[7916, 7916], "mapped", "\u1EED"], [[7917, 7917], "valid"], [[7918, 7918], "mapped", "\u1EEF"], [[7919, 7919], "valid"], [[7920, 7920], "mapped", "\u1EF1"], [[7921, 7921], "valid"], [[7922, 7922], "mapped", "\u1EF3"], [[7923, 7923], "valid"], [[7924, 7924], "mapped", "\u1EF5"], [[7925, 7925], "valid"], [[7926, 7926], "mapped", "\u1EF7"], [[7927, 7927], "valid"], [[7928, 7928], "mapped", "\u1EF9"], [[7929, 7929], "valid"], [[7930, 7930], "mapped", "\u1EFB"], [[7931, 7931], "valid"], [[7932, 7932], "mapped", "\u1EFD"], [[7933, 7933], "valid"], [[7934, 7934], "mapped", "\u1EFF"], [[7935, 7935], "valid"], [[7936, 7943], "valid"], [[7944, 7944], "mapped", "\u1F00"], [[7945, 7945], "mapped", "\u1F01"], [[7946, 7946], "mapped", "\u1F02"], [[7947, 7947], "mapped", "\u1F03"], [[7948, 7948], "mapped", "\u1F04"], [[7949, 7949], "mapped", "\u1F05"], [[7950, 7950], "mapped", "\u1F06"], [[7951, 7951], "mapped", "\u1F07"], [[7952, 7957], "valid"], [[7958, 7959], "disallowed"], [[7960, 7960], "mapped", "\u1F10"], [[7961, 7961], "mapped", "\u1F11"], [[7962, 7962], "mapped", "\u1F12"], [[7963, 7963], "mapped", "\u1F13"], [[7964, 7964], "mapped", "\u1F14"], [[7965, 7965], "mapped", "\u1F15"], [[7966, 7967], "disallowed"], [[7968, 7975], "valid"], [[7976, 7976], "mapped", "\u1F20"], [[7977, 7977], "mapped", "\u1F21"], [[7978, 7978], "mapped", "\u1F22"], [[7979, 7979], "mapped", "\u1F23"], [[7980, 7980], "mapped", "\u1F24"], [[7981, 7981], "mapped", "\u1F25"], [[7982, 7982], "mapped", "\u1F26"], [[7983, 7983], "mapped", "\u1F27"], [[7984, 7991], "valid"], [[7992, 7992], "mapped", "\u1F30"], [[7993, 7993], "mapped", "\u1F31"], [[7994, 7994], "mapped", "\u1F32"], [[7995, 7995], "mapped", "\u1F33"], [[7996, 7996], "mapped", "\u1F34"], [[7997, 7997], "mapped", "\u1F35"], [[7998, 7998], "mapped", "\u1F36"], [[7999, 7999], "mapped", "\u1F37"], [[8e3, 8005], "valid"], [[8006, 8007], "disallowed"], [[8008, 8008], "mapped", "\u1F40"], [[8009, 8009], "mapped", "\u1F41"], [[8010, 8010], "mapped", "\u1F42"], [[8011, 8011], "mapped", "\u1F43"], [[8012, 8012], "mapped", "\u1F44"], [[8013, 8013], "mapped", "\u1F45"], [[8014, 8015], "disallowed"], [[8016, 8023], "valid"], [[8024, 8024], "disallowed"], [[8025, 8025], "mapped", "\u1F51"], [[8026, 8026], "disallowed"], [[8027, 8027], "mapped", "\u1F53"], [[8028, 8028], "disallowed"], [[8029, 8029], "mapped", "\u1F55"], [[8030, 8030], "disallowed"], [[8031, 8031], "mapped", "\u1F57"], [[8032, 8039], "valid"], [[8040, 8040], "mapped", "\u1F60"], [[8041, 8041], "mapped", "\u1F61"], [[8042, 8042], "mapped", "\u1F62"], [[8043, 8043], "mapped", "\u1F63"], [[8044, 8044], "mapped", "\u1F64"], [[8045, 8045], "mapped", "\u1F65"], [[8046, 8046], "mapped", "\u1F66"], [[8047, 8047], "mapped", "\u1F67"], [[8048, 8048], "valid"], [[8049, 8049], "mapped", "\u03AC"], [[8050, 8050], "valid"], [[8051, 8051], "mapped", "\u03AD"], [[8052, 8052], "valid"], [[8053, 8053], "mapped", "\u03AE"], [[8054, 8054], "valid"], [[8055, 8055], "mapped", "\u03AF"], [[8056, 8056], "valid"], [[8057, 8057], "mapped", "\u03CC"], [[8058, 8058], "valid"], [[8059, 8059], "mapped", "\u03CD"], [[8060, 8060], "valid"], [[8061, 8061], "mapped", "\u03CE"], [[8062, 8063], "disallowed"], [[8064, 8064], "mapped", "\u1F00\u03B9"], [[8065, 8065], "mapped", "\u1F01\u03B9"], [[8066, 8066], "mapped", "\u1F02\u03B9"], [[8067, 8067], "mapped", "\u1F03\u03B9"], [[8068, 8068], "mapped", "\u1F04\u03B9"], [[8069, 8069], "mapped", "\u1F05\u03B9"], [[8070, 8070], "mapped", "\u1F06\u03B9"], [[8071, 8071], "mapped", "\u1F07\u03B9"], [[8072, 8072], "mapped", "\u1F00\u03B9"], [[8073, 8073], "mapped", "\u1F01\u03B9"], [[8074, 8074], "mapped", "\u1F02\u03B9"], [[8075, 8075], "mapped", "\u1F03\u03B9"], [[8076, 8076], "mapped", "\u1F04\u03B9"], [[8077, 8077], "mapped", "\u1F05\u03B9"], [[8078, 8078], "mapped", "\u1F06\u03B9"], [[8079, 8079], "mapped", "\u1F07\u03B9"], [[8080, 8080], "mapped", "\u1F20\u03B9"], [[8081, 8081], "mapped", "\u1F21\u03B9"], [[8082, 8082], "mapped", "\u1F22\u03B9"], [[8083, 8083], "mapped", "\u1F23\u03B9"], [[8084, 8084], "mapped", "\u1F24\u03B9"], [[8085, 8085], "mapped", "\u1F25\u03B9"], [[8086, 8086], "mapped", "\u1F26\u03B9"], [[8087, 8087], "mapped", "\u1F27\u03B9"], [[8088, 8088], "mapped", "\u1F20\u03B9"], [[8089, 8089], "mapped", "\u1F21\u03B9"], [[8090, 8090], "mapped", "\u1F22\u03B9"], [[8091, 8091], "mapped", "\u1F23\u03B9"], [[8092, 8092], "mapped", "\u1F24\u03B9"], [[8093, 8093], "mapped", "\u1F25\u03B9"], [[8094, 8094], "mapped", "\u1F26\u03B9"], [[8095, 8095], "mapped", "\u1F27\u03B9"], [[8096, 8096], "mapped", "\u1F60\u03B9"], [[8097, 8097], "mapped", "\u1F61\u03B9"], [[8098, 8098], "mapped", "\u1F62\u03B9"], [[8099, 8099], "mapped", "\u1F63\u03B9"], [[8100, 8100], "mapped", "\u1F64\u03B9"], [[8101, 8101], "mapped", "\u1F65\u03B9"], [[8102, 8102], "mapped", "\u1F66\u03B9"], [[8103, 8103], "mapped", "\u1F67\u03B9"], [[8104, 8104], "mapped", "\u1F60\u03B9"], [[8105, 8105], "mapped", "\u1F61\u03B9"], [[8106, 8106], "mapped", "\u1F62\u03B9"], [[8107, 8107], "mapped", "\u1F63\u03B9"], [[8108, 8108], "mapped", "\u1F64\u03B9"], [[8109, 8109], "mapped", "\u1F65\u03B9"], [[8110, 8110], "mapped", "\u1F66\u03B9"], [[8111, 8111], "mapped", "\u1F67\u03B9"], [[8112, 8113], "valid"], [[8114, 8114], "mapped", "\u1F70\u03B9"], [[8115, 8115], "mapped", "\u03B1\u03B9"], [[8116, 8116], "mapped", "\u03AC\u03B9"], [[8117, 8117], "disallowed"], [[8118, 8118], "valid"], [[8119, 8119], "mapped", "\u1FB6\u03B9"], [[8120, 8120], "mapped", "\u1FB0"], [[8121, 8121], "mapped", "\u1FB1"], [[8122, 8122], "mapped", "\u1F70"], [[8123, 8123], "mapped", "\u03AC"], [[8124, 8124], "mapped", "\u03B1\u03B9"], [[8125, 8125], "disallowed_STD3_mapped", " \u0313"], [[8126, 8126], "mapped", "\u03B9"], [[8127, 8127], "disallowed_STD3_mapped", " \u0313"], [[8128, 8128], "disallowed_STD3_mapped", " \u0342"], [[8129, 8129], "disallowed_STD3_mapped", " \u0308\u0342"], [[8130, 8130], "mapped", "\u1F74\u03B9"], [[8131, 8131], "mapped", "\u03B7\u03B9"], [[8132, 8132], "mapped", "\u03AE\u03B9"], [[8133, 8133], "disallowed"], [[8134, 8134], "valid"], [[8135, 8135], "mapped", "\u1FC6\u03B9"], [[8136, 8136], "mapped", "\u1F72"], [[8137, 8137], "mapped", "\u03AD"], [[8138, 8138], "mapped", "\u1F74"], [[8139, 8139], "mapped", "\u03AE"], [[8140, 8140], "mapped", "\u03B7\u03B9"], [[8141, 8141], "disallowed_STD3_mapped", " \u0313\u0300"], [[8142, 8142], "disallowed_STD3_mapped", " \u0313\u0301"], [[8143, 8143], "disallowed_STD3_mapped", " \u0313\u0342"], [[8144, 8146], "valid"], [[8147, 8147], "mapped", "\u0390"], [[8148, 8149], "disallowed"], [[8150, 8151], "valid"], [[8152, 8152], "mapped", "\u1FD0"], [[8153, 8153], "mapped", "\u1FD1"], [[8154, 8154], "mapped", "\u1F76"], [[8155, 8155], "mapped", "\u03AF"], [[8156, 8156], "disallowed"], [[8157, 8157], "disallowed_STD3_mapped", " \u0314\u0300"], [[8158, 8158], "disallowed_STD3_mapped", " \u0314\u0301"], [[8159, 8159], "disallowed_STD3_mapped", " \u0314\u0342"], [[8160, 8162], "valid"], [[8163, 8163], "mapped", "\u03B0"], [[8164, 8167], "valid"], [[8168, 8168], "mapped", "\u1FE0"], [[8169, 8169], "mapped", "\u1FE1"], [[8170, 8170], "mapped", "\u1F7A"], [[8171, 8171], "mapped", "\u03CD"], [[8172, 8172], "mapped", "\u1FE5"], [[8173, 8173], "disallowed_STD3_mapped", " \u0308\u0300"], [[8174, 8174], "disallowed_STD3_mapped", " \u0308\u0301"], [[8175, 8175], "disallowed_STD3_mapped", "`"], [[8176, 8177], "disallowed"], [[8178, 8178], "mapped", "\u1F7C\u03B9"], [[8179, 8179], "mapped", "\u03C9\u03B9"], [[8180, 8180], "mapped", "\u03CE\u03B9"], [[8181, 8181], "disallowed"], [[8182, 8182], "valid"], [[8183, 8183], "mapped", "\u1FF6\u03B9"], [[8184, 8184], "mapped", "\u1F78"], [[8185, 8185], "mapped", "\u03CC"], [[8186, 8186], "mapped", "\u1F7C"], [[8187, 8187], "mapped", "\u03CE"], [[8188, 8188], "mapped", "\u03C9\u03B9"], [[8189, 8189], "disallowed_STD3_mapped", " \u0301"], [[8190, 8190], "disallowed_STD3_mapped", " \u0314"], [[8191, 8191], "disallowed"], [[8192, 8202], "disallowed_STD3_mapped", " "], [[8203, 8203], "ignored"], [[8204, 8205], "deviation", ""], [[8206, 8207], "disallowed"], [[8208, 8208], "valid", "", "NV8"], [[8209, 8209], "mapped", "\u2010"], [[8210, 8214], "valid", "", "NV8"], [[8215, 8215], "disallowed_STD3_mapped", " \u0333"], [[8216, 8227], "valid", "", "NV8"], [[8228, 8230], "disallowed"], [[8231, 8231], "valid", "", "NV8"], [[8232, 8238], "disallowed"], [[8239, 8239], "disallowed_STD3_mapped", " "], [[8240, 8242], "valid", "", "NV8"], [[8243, 8243], "mapped", "\u2032\u2032"], [[8244, 8244], "mapped", "\u2032\u2032\u2032"], [[8245, 8245], "valid", "", "NV8"], [[8246, 8246], "mapped", "\u2035\u2035"], [[8247, 8247], "mapped", "\u2035\u2035\u2035"], [[8248, 8251], "valid", "", "NV8"], [[8252, 8252], "disallowed_STD3_mapped", "!!"], [[8253, 8253], "valid", "", "NV8"], [[8254, 8254], "disallowed_STD3_mapped", " \u0305"], [[8255, 8262], "valid", "", "NV8"], [[8263, 8263], "disallowed_STD3_mapped", "??"], [[8264, 8264], "disallowed_STD3_mapped", "?!"], [[8265, 8265], "disallowed_STD3_mapped", "!?"], [[8266, 8269], "valid", "", "NV8"], [[8270, 8274], "valid", "", "NV8"], [[8275, 8276], "valid", "", "NV8"], [[8277, 8278], "valid", "", "NV8"], [[8279, 8279], "mapped", "\u2032\u2032\u2032\u2032"], [[8280, 8286], "valid", "", "NV8"], [[8287, 8287], "disallowed_STD3_mapped", " "], [[8288, 8288], "ignored"], [[8289, 8291], "disallowed"], [[8292, 8292], "ignored"], [[8293, 8293], "disallowed"], [[8294, 8297], "disallowed"], [[8298, 8303], "disallowed"], [[8304, 8304], "mapped", "0"], [[8305, 8305], "mapped", "i"], [[8306, 8307], "disallowed"], [[8308, 8308], "mapped", "4"], [[8309, 8309], "mapped", "5"], [[8310, 8310], "mapped", "6"], [[8311, 8311], "mapped", "7"], [[8312, 8312], "mapped", "8"], [[8313, 8313], "mapped", "9"], [[8314, 8314], "disallowed_STD3_mapped", "+"], [[8315, 8315], "mapped", "\u2212"], [[8316, 8316], "disallowed_STD3_mapped", "="], [[8317, 8317], "disallowed_STD3_mapped", "("], [[8318, 8318], "disallowed_STD3_mapped", ")"], [[8319, 8319], "mapped", "n"], [[8320, 8320], "mapped", "0"], [[8321, 8321], "mapped", "1"], [[8322, 8322], "mapped", "2"], [[8323, 8323], "mapped", "3"], [[8324, 8324], "mapped", "4"], [[8325, 8325], "mapped", "5"], [[8326, 8326], "mapped", "6"], [[8327, 8327], "mapped", "7"], [[8328, 8328], "mapped", "8"], [[8329, 8329], "mapped", "9"], [[8330, 8330], "disallowed_STD3_mapped", "+"], [[8331, 8331], "mapped", "\u2212"], [[8332, 8332], "disallowed_STD3_mapped", "="], [[8333, 8333], "disallowed_STD3_mapped", "("], [[8334, 8334], "disallowed_STD3_mapped", ")"], [[8335, 8335], "disallowed"], [[8336, 8336], "mapped", "a"], [[8337, 8337], "mapped", "e"], [[8338, 8338], "mapped", "o"], [[8339, 8339], "mapped", "x"], [[8340, 8340], "mapped", "\u0259"], [[8341, 8341], "mapped", "h"], [[8342, 8342], "mapped", "k"], [[8343, 8343], "mapped", "l"], [[8344, 8344], "mapped", "m"], [[8345, 8345], "mapped", "n"], [[8346, 8346], "mapped", "p"], [[8347, 8347], "mapped", "s"], [[8348, 8348], "mapped", "t"], [[8349, 8351], "disallowed"], [[8352, 8359], "valid", "", "NV8"], [[8360, 8360], "mapped", "rs"], [[8361, 8362], "valid", "", "NV8"], [[8363, 8363], "valid", "", "NV8"], [[8364, 8364], "valid", "", "NV8"], [[8365, 8367], "valid", "", "NV8"], [[8368, 8369], "valid", "", "NV8"], [[8370, 8373], "valid", "", "NV8"], [[8374, 8376], "valid", "", "NV8"], [[8377, 8377], "valid", "", "NV8"], [[8378, 8378], "valid", "", "NV8"], [[8379, 8381], "valid", "", "NV8"], [[8382, 8382], "valid", "", "NV8"], [[8383, 8383], "valid", "", "NV8"], [[8384, 8399], "disallowed"], [[8400, 8417], "valid", "", "NV8"], [[8418, 8419], "valid", "", "NV8"], [[8420, 8426], "valid", "", "NV8"], [[8427, 8427], "valid", "", "NV8"], [[8428, 8431], "valid", "", "NV8"], [[8432, 8432], "valid", "", "NV8"], [[8433, 8447], "disallowed"], [[8448, 8448], "disallowed_STD3_mapped", "a/c"], [[8449, 8449], "disallowed_STD3_mapped", "a/s"], [[8450, 8450], "mapped", "c"], [[8451, 8451], "mapped", "\xB0c"], [[8452, 8452], "valid", "", "NV8"], [[8453, 8453], "disallowed_STD3_mapped", "c/o"], [[8454, 8454], "disallowed_STD3_mapped", "c/u"], [[8455, 8455], "mapped", "\u025B"], [[8456, 8456], "valid", "", "NV8"], [[8457, 8457], "mapped", "\xB0f"], [[8458, 8458], "mapped", "g"], [[8459, 8462], "mapped", "h"], [[8463, 8463], "mapped", "\u0127"], [[8464, 8465], "mapped", "i"], [[8466, 8467], "mapped", "l"], [[8468, 8468], "valid", "", "NV8"], [[8469, 8469], "mapped", "n"], [[8470, 8470], "mapped", "no"], [[8471, 8472], "valid", "", "NV8"], [[8473, 8473], "mapped", "p"], [[8474, 8474], "mapped", "q"], [[8475, 8477], "mapped", "r"], [[8478, 8479], "valid", "", "NV8"], [[8480, 8480], "mapped", "sm"], [[8481, 8481], "mapped", "tel"], [[8482, 8482], "mapped", "tm"], [[8483, 8483], "valid", "", "NV8"], [[8484, 8484], "mapped", "z"], [[8485, 8485], "valid", "", "NV8"], [[8486, 8486], "mapped", "\u03C9"], [[8487, 8487], "valid", "", "NV8"], [[8488, 8488], "mapped", "z"], [[8489, 8489], "valid", "", "NV8"], [[8490, 8490], "mapped", "k"], [[8491, 8491], "mapped", "\xE5"], [[8492, 8492], "mapped", "b"], [[8493, 8493], "mapped", "c"], [[8494, 8494], "valid", "", "NV8"], [[8495, 8496], "mapped", "e"], [[8497, 8497], "mapped", "f"], [[8498, 8498], "disallowed"], [[8499, 8499], "mapped", "m"], [[8500, 8500], "mapped", "o"], [[8501, 8501], "mapped", "\u05D0"], [[8502, 8502], "mapped", "\u05D1"], [[8503, 8503], "mapped", "\u05D2"], [[8504, 8504], "mapped", "\u05D3"], [[8505, 8505], "mapped", "i"], [[8506, 8506], "valid", "", "NV8"], [[8507, 8507], "mapped", "fax"], [[8508, 8508], "mapped", "\u03C0"], [[8509, 8510], "mapped", "\u03B3"], [[8511, 8511], "mapped", "\u03C0"], [[8512, 8512], "mapped", "\u2211"], [[8513, 8516], "valid", "", "NV8"], [[8517, 8518], "mapped", "d"], [[8519, 8519], "mapped", "e"], [[8520, 8520], "mapped", "i"], [[8521, 8521], "mapped", "j"], [[8522, 8523], "valid", "", "NV8"], [[8524, 8524], "valid", "", "NV8"], [[8525, 8525], "valid", "", "NV8"], [[8526, 8526], "valid"], [[8527, 8527], "valid", "", "NV8"], [[8528, 8528], "mapped", "1\u20447"], [[8529, 8529], "mapped", "1\u20449"], [[8530, 8530], "mapped", "1\u204410"], [[8531, 8531], "mapped", "1\u20443"], [[8532, 8532], "mapped", "2\u20443"], [[8533, 8533], "mapped", "1\u20445"], [[8534, 8534], "mapped", "2\u20445"], [[8535, 8535], "mapped", "3\u20445"], [[8536, 8536], "mapped", "4\u20445"], [[8537, 8537], "mapped", "1\u20446"], [[8538, 8538], "mapped", "5\u20446"], [[8539, 8539], "mapped", "1\u20448"], [[8540, 8540], "mapped", "3\u20448"], [[8541, 8541], "mapped", "5\u20448"], [[8542, 8542], "mapped", "7\u20448"], [[8543, 8543], "mapped", "1\u2044"], [[8544, 8544], "mapped", "i"], [[8545, 8545], "mapped", "ii"], [[8546, 8546], "mapped", "iii"], [[8547, 8547], "mapped", "iv"], [[8548, 8548], "mapped", "v"], [[8549, 8549], "mapped", "vi"], [[8550, 8550], "mapped", "vii"], [[8551, 8551], "mapped", "viii"], [[8552, 8552], "mapped", "ix"], [[8553, 8553], "mapped", "x"], [[8554, 8554], "mapped", "xi"], [[8555, 8555], "mapped", "xii"], [[8556, 8556], "mapped", "l"], [[8557, 8557], "mapped", "c"], [[8558, 8558], "mapped", "d"], [[8559, 8559], "mapped", "m"], [[8560, 8560], "mapped", "i"], [[8561, 8561], "mapped", "ii"], [[8562, 8562], "mapped", "iii"], [[8563, 8563], "mapped", "iv"], [[8564, 8564], "mapped", "v"], [[8565, 8565], "mapped", "vi"], [[8566, 8566], "mapped", "vii"], [[8567, 8567], "mapped", "viii"], [[8568, 8568], "mapped", "ix"], [[8569, 8569], "mapped", "x"], [[8570, 8570], "mapped", "xi"], [[8571, 8571], "mapped", "xii"], [[8572, 8572], "mapped", "l"], [[8573, 8573], "mapped", "c"], [[8574, 8574], "mapped", "d"], [[8575, 8575], "mapped", "m"], [[8576, 8578], "valid", "", "NV8"], [[8579, 8579], "disallowed"], [[8580, 8580], "valid"], [[8581, 8584], "valid", "", "NV8"], [[8585, 8585], "mapped", "0\u20443"], [[8586, 8587], "valid", "", "NV8"], [[8588, 8591], "disallowed"], [[8592, 8682], "valid", "", "NV8"], [[8683, 8691], "valid", "", "NV8"], [[8692, 8703], "valid", "", "NV8"], [[8704, 8747], "valid", "", "NV8"], [[8748, 8748], "mapped", "\u222B\u222B"], [[8749, 8749], "mapped", "\u222B\u222B\u222B"], [[8750, 8750], "valid", "", "NV8"], [[8751, 8751], "mapped", "\u222E\u222E"], [[8752, 8752], "mapped", "\u222E\u222E\u222E"], [[8753, 8799], "valid", "", "NV8"], [[8800, 8800], "disallowed_STD3_valid"], [[8801, 8813], "valid", "", "NV8"], [[8814, 8815], "disallowed_STD3_valid"], [[8816, 8945], "valid", "", "NV8"], [[8946, 8959], "valid", "", "NV8"], [[8960, 8960], "valid", "", "NV8"], [[8961, 8961], "valid", "", "NV8"], [[8962, 9e3], "valid", "", "NV8"], [[9001, 9001], "mapped", "\u3008"], [[9002, 9002], "mapped", "\u3009"], [[9003, 9082], "valid", "", "NV8"], [[9083, 9083], "valid", "", "NV8"], [[9084, 9084], "valid", "", "NV8"], [[9085, 9114], "valid", "", "NV8"], [[9115, 9166], "valid", "", "NV8"], [[9167, 9168], "valid", "", "NV8"], [[9169, 9179], "valid", "", "NV8"], [[9180, 9191], "valid", "", "NV8"], [[9192, 9192], "valid", "", "NV8"], [[9193, 9203], "valid", "", "NV8"], [[9204, 9210], "valid", "", "NV8"], [[9211, 9214], "valid", "", "NV8"], [[9215, 9215], "valid", "", "NV8"], [[9216, 9252], "valid", "", "NV8"], [[9253, 9254], "valid", "", "NV8"], [[9255, 9279], "disallowed"], [[9280, 9290], "valid", "", "NV8"], [[9291, 9311], "disallowed"], [[9312, 9312], "mapped", "1"], [[9313, 9313], "mapped", "2"], [[9314, 9314], "mapped", "3"], [[9315, 9315], "mapped", "4"], [[9316, 9316], "mapped", "5"], [[9317, 9317], "mapped", "6"], [[9318, 9318], "mapped", "7"], [[9319, 9319], "mapped", "8"], [[9320, 9320], "mapped", "9"], [[9321, 9321], "mapped", "10"], [[9322, 9322], "mapped", "11"], [[9323, 9323], "mapped", "12"], [[9324, 9324], "mapped", "13"], [[9325, 9325], "mapped", "14"], [[9326, 9326], "mapped", "15"], [[9327, 9327], "mapped", "16"], [[9328, 9328], "mapped", "17"], [[9329, 9329], "mapped", "18"], [[9330, 9330], "mapped", "19"], [[9331, 9331], "mapped", "20"], [[9332, 9332], "disallowed_STD3_mapped", "(1)"], [[9333, 9333], "disallowed_STD3_mapped", "(2)"], [[9334, 9334], "disallowed_STD3_mapped", "(3)"], [[9335, 9335], "disallowed_STD3_mapped", "(4)"], [[9336, 9336], "disallowed_STD3_mapped", "(5)"], [[9337, 9337], "disallowed_STD3_mapped", "(6)"], [[9338, 9338], "disallowed_STD3_mapped", "(7)"], [[9339, 9339], "disallowed_STD3_mapped", "(8)"], [[9340, 9340], "disallowed_STD3_mapped", "(9)"], [[9341, 9341], "disallowed_STD3_mapped", "(10)"], [[9342, 9342], "disallowed_STD3_mapped", "(11)"], [[9343, 9343], "disallowed_STD3_mapped", "(12)"], [[9344, 9344], "disallowed_STD3_mapped", "(13)"], [[9345, 9345], "disallowed_STD3_mapped", "(14)"], [[9346, 9346], "disallowed_STD3_mapped", "(15)"], [[9347, 9347], "disallowed_STD3_mapped", "(16)"], [[9348, 9348], "disallowed_STD3_mapped", "(17)"], [[9349, 9349], "disallowed_STD3_mapped", "(18)"], [[9350, 9350], "disallowed_STD3_mapped", "(19)"], [[9351, 9351], "disallowed_STD3_mapped", "(20)"], [[9352, 9371], "disallowed"], [[9372, 9372], "disallowed_STD3_mapped", "(a)"], [[9373, 9373], "disallowed_STD3_mapped", "(b)"], [[9374, 9374], "disallowed_STD3_mapped", "(c)"], [[9375, 9375], "disallowed_STD3_mapped", "(d)"], [[9376, 9376], "disallowed_STD3_mapped", "(e)"], [[9377, 9377], "disallowed_STD3_mapped", "(f)"], [[9378, 9378], "disallowed_STD3_mapped", "(g)"], [[9379, 9379], "disallowed_STD3_mapped", "(h)"], [[9380, 9380], "disallowed_STD3_mapped", "(i)"], [[9381, 9381], "disallowed_STD3_mapped", "(j)"], [[9382, 9382], "disallowed_STD3_mapped", "(k)"], [[9383, 9383], "disallowed_STD3_mapped", "(l)"], [[9384, 9384], "disallowed_STD3_mapped", "(m)"], [[9385, 9385], "disallowed_STD3_mapped", "(n)"], [[9386, 9386], "disallowed_STD3_mapped", "(o)"], [[9387, 9387], "disallowed_STD3_mapped", "(p)"], [[9388, 9388], "disallowed_STD3_mapped", "(q)"], [[9389, 9389], "disallowed_STD3_mapped", "(r)"], [[9390, 9390], "disallowed_STD3_mapped", "(s)"], [[9391, 9391], "disallowed_STD3_mapped", "(t)"], [[9392, 9392], "disallowed_STD3_mapped", "(u)"], [[9393, 9393], "disallowed_STD3_mapped", "(v)"], [[9394, 9394], "disallowed_STD3_mapped", "(w)"], [[9395, 9395], "disallowed_STD3_mapped", "(x)"], [[9396, 9396], "disallowed_STD3_mapped", "(y)"], [[9397, 9397], "disallowed_STD3_mapped", "(z)"], [[9398, 9398], "mapped", "a"], [[9399, 9399], "mapped", "b"], [[9400, 9400], "mapped", "c"], [[9401, 9401], "mapped", "d"], [[9402, 9402], "mapped", "e"], [[9403, 9403], "mapped", "f"], [[9404, 9404], "mapped", "g"], [[9405, 9405], "mapped", "h"], [[9406, 9406], "mapped", "i"], [[9407, 9407], "mapped", "j"], [[9408, 9408], "mapped", "k"], [[9409, 9409], "mapped", "l"], [[9410, 9410], "mapped", "m"], [[9411, 9411], "mapped", "n"], [[9412, 9412], "mapped", "o"], [[9413, 9413], "mapped", "p"], [[9414, 9414], "mapped", "q"], [[9415, 9415], "mapped", "r"], [[9416, 9416], "mapped", "s"], [[9417, 9417], "mapped", "t"], [[9418, 9418], "mapped", "u"], [[9419, 9419], "mapped", "v"], [[9420, 9420], "mapped", "w"], [[9421, 9421], "mapped", "x"], [[9422, 9422], "mapped", "y"], [[9423, 9423], "mapped", "z"], [[9424, 9424], "mapped", "a"], [[9425, 9425], "mapped", "b"], [[9426, 9426], "mapped", "c"], [[9427, 9427], "mapped", "d"], [[9428, 9428], "mapped", "e"], [[9429, 9429], "mapped", "f"], [[9430, 9430], "mapped", "g"], [[9431, 9431], "mapped", "h"], [[9432, 9432], "mapped", "i"], [[9433, 9433], "mapped", "j"], [[9434, 9434], "mapped", "k"], [[9435, 9435], "mapped", "l"], [[9436, 9436], "mapped", "m"], [[9437, 9437], "mapped", "n"], [[9438, 9438], "mapped", "o"], [[9439, 9439], "mapped", "p"], [[9440, 9440], "mapped", "q"], [[9441, 9441], "mapped", "r"], [[9442, 9442], "mapped", "s"], [[9443, 9443], "mapped", "t"], [[9444, 9444], "mapped", "u"], [[9445, 9445], "mapped", "v"], [[9446, 9446], "mapped", "w"], [[9447, 9447], "mapped", "x"], [[9448, 9448], "mapped", "y"], [[9449, 9449], "mapped", "z"], [[9450, 9450], "mapped", "0"], [[9451, 9470], "valid", "", "NV8"], [[9471, 9471], "valid", "", "NV8"], [[9472, 9621], "valid", "", "NV8"], [[9622, 9631], "valid", "", "NV8"], [[9632, 9711], "valid", "", "NV8"], [[9712, 9719], "valid", "", "NV8"], [[9720, 9727], "valid", "", "NV8"], [[9728, 9747], "valid", "", "NV8"], [[9748, 9749], "valid", "", "NV8"], [[9750, 9751], "valid", "", "NV8"], [[9752, 9752], "valid", "", "NV8"], [[9753, 9753], "valid", "", "NV8"], [[9754, 9839], "valid", "", "NV8"], [[9840, 9841], "valid", "", "NV8"], [[9842, 9853], "valid", "", "NV8"], [[9854, 9855], "valid", "", "NV8"], [[9856, 9865], "valid", "", "NV8"], [[9866, 9873], "valid", "", "NV8"], [[9874, 9884], "valid", "", "NV8"], [[9885, 9885], "valid", "", "NV8"], [[9886, 9887], "valid", "", "NV8"], [[9888, 9889], "valid", "", "NV8"], [[9890, 9905], "valid", "", "NV8"], [[9906, 9906], "valid", "", "NV8"], [[9907, 9916], "valid", "", "NV8"], [[9917, 9919], "valid", "", "NV8"], [[9920, 9923], "valid", "", "NV8"], [[9924, 9933], "valid", "", "NV8"], [[9934, 9934], "valid", "", "NV8"], [[9935, 9953], "valid", "", "NV8"], [[9954, 9954], "valid", "", "NV8"], [[9955, 9955], "valid", "", "NV8"], [[9956, 9959], "valid", "", "NV8"], [[9960, 9983], "valid", "", "NV8"], [[9984, 9984], "valid", "", "NV8"], [[9985, 9988], "valid", "", "NV8"], [[9989, 9989], "valid", "", "NV8"], [[9990, 9993], "valid", "", "NV8"], [[9994, 9995], "valid", "", "NV8"], [[9996, 10023], "valid", "", "NV8"], [[10024, 10024], "valid", "", "NV8"], [[10025, 10059], "valid", "", "NV8"], [[10060, 10060], "valid", "", "NV8"], [[10061, 10061], "valid", "", "NV8"], [[10062, 10062], "valid", "", "NV8"], [[10063, 10066], "valid", "", "NV8"], [[10067, 10069], "valid", "", "NV8"], [[10070, 10070], "valid", "", "NV8"], [[10071, 10071], "valid", "", "NV8"], [[10072, 10078], "valid", "", "NV8"], [[10079, 10080], "valid", "", "NV8"], [[10081, 10087], "valid", "", "NV8"], [[10088, 10101], "valid", "", "NV8"], [[10102, 10132], "valid", "", "NV8"], [[10133, 10135], "valid", "", "NV8"], [[10136, 10159], "valid", "", "NV8"], [[10160, 10160], "valid", "", "NV8"], [[10161, 10174], "valid", "", "NV8"], [[10175, 10175], "valid", "", "NV8"], [[10176, 10182], "valid", "", "NV8"], [[10183, 10186], "valid", "", "NV8"], [[10187, 10187], "valid", "", "NV8"], [[10188, 10188], "valid", "", "NV8"], [[10189, 10189], "valid", "", "NV8"], [[10190, 10191], "valid", "", "NV8"], [[10192, 10219], "valid", "", "NV8"], [[10220, 10223], "valid", "", "NV8"], [[10224, 10239], "valid", "", "NV8"], [[10240, 10495], "valid", "", "NV8"], [[10496, 10763], "valid", "", "NV8"], [[10764, 10764], "mapped", "\u222B\u222B\u222B\u222B"], [[10765, 10867], "valid", "", "NV8"], [[10868, 10868], "disallowed_STD3_mapped", "::="], [[10869, 10869], "disallowed_STD3_mapped", "=="], [[10870, 10870], "disallowed_STD3_mapped", "==="], [[10871, 10971], "valid", "", "NV8"], [[10972, 10972], "mapped", "\u2ADD\u0338"], [[10973, 11007], "valid", "", "NV8"], [[11008, 11021], "valid", "", "NV8"], [[11022, 11027], "valid", "", "NV8"], [[11028, 11034], "valid", "", "NV8"], [[11035, 11039], "valid", "", "NV8"], [[11040, 11043], "valid", "", "NV8"], [[11044, 11084], "valid", "", "NV8"], [[11085, 11087], "valid", "", "NV8"], [[11088, 11092], "valid", "", "NV8"], [[11093, 11097], "valid", "", "NV8"], [[11098, 11123], "valid", "", "NV8"], [[11124, 11125], "disallowed"], [[11126, 11157], "valid", "", "NV8"], [[11158, 11159], "disallowed"], [[11160, 11193], "valid", "", "NV8"], [[11194, 11196], "disallowed"], [[11197, 11208], "valid", "", "NV8"], [[11209, 11209], "disallowed"], [[11210, 11217], "valid", "", "NV8"], [[11218, 11218], "valid", "", "NV8"], [[11219, 11243], "disallowed"], [[11244, 11247], "valid", "", "NV8"], [[11248, 11263], "disallowed"], [[11264, 11264], "mapped", "\u2C30"], [[11265, 11265], "mapped", "\u2C31"], [[11266, 11266], "mapped", "\u2C32"], [[11267, 11267], "mapped", "\u2C33"], [[11268, 11268], "mapped", "\u2C34"], [[11269, 11269], "mapped", "\u2C35"], [[11270, 11270], "mapped", "\u2C36"], [[11271, 11271], "mapped", "\u2C37"], [[11272, 11272], "mapped", "\u2C38"], [[11273, 11273], "mapped", "\u2C39"], [[11274, 11274], "mapped", "\u2C3A"], [[11275, 11275], "mapped", "\u2C3B"], [[11276, 11276], "mapped", "\u2C3C"], [[11277, 11277], "mapped", "\u2C3D"], [[11278, 11278], "mapped", "\u2C3E"], [[11279, 11279], "mapped", "\u2C3F"], [[11280, 11280], "mapped", "\u2C40"], [[11281, 11281], "mapped", "\u2C41"], [[11282, 11282], "mapped", "\u2C42"], [[11283, 11283], "mapped", "\u2C43"], [[11284, 11284], "mapped", "\u2C44"], [[11285, 11285], "mapped", "\u2C45"], [[11286, 11286], "mapped", "\u2C46"], [[11287, 11287], "mapped", "\u2C47"], [[11288, 11288], "mapped", "\u2C48"], [[11289, 11289], "mapped", "\u2C49"], [[11290, 11290], "mapped", "\u2C4A"], [[11291, 11291], "mapped", "\u2C4B"], [[11292, 11292], "mapped", "\u2C4C"], [[11293, 11293], "mapped", "\u2C4D"], [[11294, 11294], "mapped", "\u2C4E"], [[11295, 11295], "mapped", "\u2C4F"], [[11296, 11296], "mapped", "\u2C50"], [[11297, 11297], "mapped", "\u2C51"], [[11298, 11298], "mapped", "\u2C52"], [[11299, 11299], "mapped", "\u2C53"], [[11300, 11300], "mapped", "\u2C54"], [[11301, 11301], "mapped", "\u2C55"], [[11302, 11302], "mapped", "\u2C56"], [[11303, 11303], "mapped", "\u2C57"], [[11304, 11304], "mapped", "\u2C58"], [[11305, 11305], "mapped", "\u2C59"], [[11306, 11306], "mapped", "\u2C5A"], [[11307, 11307], "mapped", "\u2C5B"], [[11308, 11308], "mapped", "\u2C5C"], [[11309, 11309], "mapped", "\u2C5D"], [[11310, 11310], "mapped", "\u2C5E"], [[11311, 11311], "disallowed"], [[11312, 11358], "valid"], [[11359, 11359], "disallowed"], [[11360, 11360], "mapped", "\u2C61"], [[11361, 11361], "valid"], [[11362, 11362], "mapped", "\u026B"], [[11363, 11363], "mapped", "\u1D7D"], [[11364, 11364], "mapped", "\u027D"], [[11365, 11366], "valid"], [[11367, 11367], "mapped", "\u2C68"], [[11368, 11368], "valid"], [[11369, 11369], "mapped", "\u2C6A"], [[11370, 11370], "valid"], [[11371, 11371], "mapped", "\u2C6C"], [[11372, 11372], "valid"], [[11373, 11373], "mapped", "\u0251"], [[11374, 11374], "mapped", "\u0271"], [[11375, 11375], "mapped", "\u0250"], [[11376, 11376], "mapped", "\u0252"], [[11377, 11377], "valid"], [[11378, 11378], "mapped", "\u2C73"], [[11379, 11379], "valid"], [[11380, 11380], "valid"], [[11381, 11381], "mapped", "\u2C76"], [[11382, 11383], "valid"], [[11384, 11387], "valid"], [[11388, 11388], "mapped", "j"], [[11389, 11389], "mapped", "v"], [[11390, 11390], "mapped", "\u023F"], [[11391, 11391], "mapped", "\u0240"], [[11392, 11392], "mapped", "\u2C81"], [[11393, 11393], "valid"], [[11394, 11394], "mapped", "\u2C83"], [[11395, 11395], "valid"], [[11396, 11396], "mapped", "\u2C85"], [[11397, 11397], "valid"], [[11398, 11398], "mapped", "\u2C87"], [[11399, 11399], "valid"], [[11400, 11400], "mapped", "\u2C89"], [[11401, 11401], "valid"], [[11402, 11402], "mapped", "\u2C8B"], [[11403, 11403], "valid"], [[11404, 11404], "mapped", "\u2C8D"], [[11405, 11405], "valid"], [[11406, 11406], "mapped", "\u2C8F"], [[11407, 11407], "valid"], [[11408, 11408], "mapped", "\u2C91"], [[11409, 11409], "valid"], [[11410, 11410], "mapped", "\u2C93"], [[11411, 11411], "valid"], [[11412, 11412], "mapped", "\u2C95"], [[11413, 11413], "valid"], [[11414, 11414], "mapped", "\u2C97"], [[11415, 11415], "valid"], [[11416, 11416], "mapped", "\u2C99"], [[11417, 11417], "valid"], [[11418, 11418], "mapped", "\u2C9B"], [[11419, 11419], "valid"], [[11420, 11420], "mapped", "\u2C9D"], [[11421, 11421], "valid"], [[11422, 11422], "mapped", "\u2C9F"], [[11423, 11423], "valid"], [[11424, 11424], "mapped", "\u2CA1"], [[11425, 11425], "valid"], [[11426, 11426], "mapped", "\u2CA3"], [[11427, 11427], "valid"], [[11428, 11428], "mapped", "\u2CA5"], [[11429, 11429], "valid"], [[11430, 11430], "mapped", "\u2CA7"], [[11431, 11431], "valid"], [[11432, 11432], "mapped", "\u2CA9"], [[11433, 11433], "valid"], [[11434, 11434], "mapped", "\u2CAB"], [[11435, 11435], "valid"], [[11436, 11436], "mapped", "\u2CAD"], [[11437, 11437], "valid"], [[11438, 11438], "mapped", "\u2CAF"], [[11439, 11439], "valid"], [[11440, 11440], "mapped", "\u2CB1"], [[11441, 11441], "valid"], [[11442, 11442], "mapped", "\u2CB3"], [[11443, 11443], "valid"], [[11444, 11444], "mapped", "\u2CB5"], [[11445, 11445], "valid"], [[11446, 11446], "mapped", "\u2CB7"], [[11447, 11447], "valid"], [[11448, 11448], "mapped", "\u2CB9"], [[11449, 11449], "valid"], [[11450, 11450], "mapped", "\u2CBB"], [[11451, 11451], "valid"], [[11452, 11452], "mapped", "\u2CBD"], [[11453, 11453], "valid"], [[11454, 11454], "mapped", "\u2CBF"], [[11455, 11455], "valid"], [[11456, 11456], "mapped", "\u2CC1"], [[11457, 11457], "valid"], [[11458, 11458], "mapped", "\u2CC3"], [[11459, 11459], "valid"], [[11460, 11460], "mapped", "\u2CC5"], [[11461, 11461], "valid"], [[11462, 11462], "mapped", "\u2CC7"], [[11463, 11463], "valid"], [[11464, 11464], "mapped", "\u2CC9"], [[11465, 11465], "valid"], [[11466, 11466], "mapped", "\u2CCB"], [[11467, 11467], "valid"], [[11468, 11468], "mapped", "\u2CCD"], [[11469, 11469], "valid"], [[11470, 11470], "mapped", "\u2CCF"], [[11471, 11471], "valid"], [[11472, 11472], "mapped", "\u2CD1"], [[11473, 11473], "valid"], [[11474, 11474], "mapped", "\u2CD3"], [[11475, 11475], "valid"], [[11476, 11476], "mapped", "\u2CD5"], [[11477, 11477], "valid"], [[11478, 11478], "mapped", "\u2CD7"], [[11479, 11479], "valid"], [[11480, 11480], "mapped", "\u2CD9"], [[11481, 11481], "valid"], [[11482, 11482], "mapped", "\u2CDB"], [[11483, 11483], "valid"], [[11484, 11484], "mapped", "\u2CDD"], [[11485, 11485], "valid"], [[11486, 11486], "mapped", "\u2CDF"], [[11487, 11487], "valid"], [[11488, 11488], "mapped", "\u2CE1"], [[11489, 11489], "valid"], [[11490, 11490], "mapped", "\u2CE3"], [[11491, 11492], "valid"], [[11493, 11498], "valid", "", "NV8"], [[11499, 11499], "mapped", "\u2CEC"], [[11500, 11500], "valid"], [[11501, 11501], "mapped", "\u2CEE"], [[11502, 11505], "valid"], [[11506, 11506], "mapped", "\u2CF3"], [[11507, 11507], "valid"], [[11508, 11512], "disallowed"], [[11513, 11519], "valid", "", "NV8"], [[11520, 11557], "valid"], [[11558, 11558], "disallowed"], [[11559, 11559], "valid"], [[11560, 11564], "disallowed"], [[11565, 11565], "valid"], [[11566, 11567], "disallowed"], [[11568, 11621], "valid"], [[11622, 11623], "valid"], [[11624, 11630], "disallowed"], [[11631, 11631], "mapped", "\u2D61"], [[11632, 11632], "valid", "", "NV8"], [[11633, 11646], "disallowed"], [[11647, 11647], "valid"], [[11648, 11670], "valid"], [[11671, 11679], "disallowed"], [[11680, 11686], "valid"], [[11687, 11687], "disallowed"], [[11688, 11694], "valid"], [[11695, 11695], "disallowed"], [[11696, 11702], "valid"], [[11703, 11703], "disallowed"], [[11704, 11710], "valid"], [[11711, 11711], "disallowed"], [[11712, 11718], "valid"], [[11719, 11719], "disallowed"], [[11720, 11726], "valid"], [[11727, 11727], "disallowed"], [[11728, 11734], "valid"], [[11735, 11735], "disallowed"], [[11736, 11742], "valid"], [[11743, 11743], "disallowed"], [[11744, 11775], "valid"], [[11776, 11799], "valid", "", "NV8"], [[11800, 11803], "valid", "", "NV8"], [[11804, 11805], "valid", "", "NV8"], [[11806, 11822], "valid", "", "NV8"], [[11823, 11823], "valid"], [[11824, 11824], "valid", "", "NV8"], [[11825, 11825], "valid", "", "NV8"], [[11826, 11835], "valid", "", "NV8"], [[11836, 11842], "valid", "", "NV8"], [[11843, 11844], "valid", "", "NV8"], [[11845, 11849], "valid", "", "NV8"], [[11850, 11903], "disallowed"], [[11904, 11929], "valid", "", "NV8"], [[11930, 11930], "disallowed"], [[11931, 11934], "valid", "", "NV8"], [[11935, 11935], "mapped", "\u6BCD"], [[11936, 12018], "valid", "", "NV8"], [[12019, 12019], "mapped", "\u9F9F"], [[12020, 12031], "disallowed"], [[12032, 12032], "mapped", "\u4E00"], [[12033, 12033], "mapped", "\u4E28"], [[12034, 12034], "mapped", "\u4E36"], [[12035, 12035], "mapped", "\u4E3F"], [[12036, 12036], "mapped", "\u4E59"], [[12037, 12037], "mapped", "\u4E85"], [[12038, 12038], "mapped", "\u4E8C"], [[12039, 12039], "mapped", "\u4EA0"], [[12040, 12040], "mapped", "\u4EBA"], [[12041, 12041], "mapped", "\u513F"], [[12042, 12042], "mapped", "\u5165"], [[12043, 12043], "mapped", "\u516B"], [[12044, 12044], "mapped", "\u5182"], [[12045, 12045], "mapped", "\u5196"], [[12046, 12046], "mapped", "\u51AB"], [[12047, 12047], "mapped", "\u51E0"], [[12048, 12048], "mapped", "\u51F5"], [[12049, 12049], "mapped", "\u5200"], [[12050, 12050], "mapped", "\u529B"], [[12051, 12051], "mapped", "\u52F9"], [[12052, 12052], "mapped", "\u5315"], [[12053, 12053], "mapped", "\u531A"], [[12054, 12054], "mapped", "\u5338"], [[12055, 12055], "mapped", "\u5341"], [[12056, 12056], "mapped", "\u535C"], [[12057, 12057], "mapped", "\u5369"], [[12058, 12058], "mapped", "\u5382"], [[12059, 12059], "mapped", "\u53B6"], [[12060, 12060], "mapped", "\u53C8"], [[12061, 12061], "mapped", "\u53E3"], [[12062, 12062], "mapped", "\u56D7"], [[12063, 12063], "mapped", "\u571F"], [[12064, 12064], "mapped", "\u58EB"], [[12065, 12065], "mapped", "\u5902"], [[12066, 12066], "mapped", "\u590A"], [[12067, 12067], "mapped", "\u5915"], [[12068, 12068], "mapped", "\u5927"], [[12069, 12069], "mapped", "\u5973"], [[12070, 12070], "mapped", "\u5B50"], [[12071, 12071], "mapped", "\u5B80"], [[12072, 12072], "mapped", "\u5BF8"], [[12073, 12073], "mapped", "\u5C0F"], [[12074, 12074], "mapped", "\u5C22"], [[12075, 12075], "mapped", "\u5C38"], [[12076, 12076], "mapped", "\u5C6E"], [[12077, 12077], "mapped", "\u5C71"], [[12078, 12078], "mapped", "\u5DDB"], [[12079, 12079], "mapped", "\u5DE5"], [[12080, 12080], "mapped", "\u5DF1"], [[12081, 12081], "mapped", "\u5DFE"], [[12082, 12082], "mapped", "\u5E72"], [[12083, 12083], "mapped", "\u5E7A"], [[12084, 12084], "mapped", "\u5E7F"], [[12085, 12085], "mapped", "\u5EF4"], [[12086, 12086], "mapped", "\u5EFE"], [[12087, 12087], "mapped", "\u5F0B"], [[12088, 12088], "mapped", "\u5F13"], [[12089, 12089], "mapped", "\u5F50"], [[12090, 12090], "mapped", "\u5F61"], [[12091, 12091], "mapped", "\u5F73"], [[12092, 12092], "mapped", "\u5FC3"], [[12093, 12093], "mapped", "\u6208"], [[12094, 12094], "mapped", "\u6236"], [[12095, 12095], "mapped", "\u624B"], [[12096, 12096], "mapped", "\u652F"], [[12097, 12097], "mapped", "\u6534"], [[12098, 12098], "mapped", "\u6587"], [[12099, 12099], "mapped", "\u6597"], [[12100, 12100], "mapped", "\u65A4"], [[12101, 12101], "mapped", "\u65B9"], [[12102, 12102], "mapped", "\u65E0"], [[12103, 12103], "mapped", "\u65E5"], [[12104, 12104], "mapped", "\u66F0"], [[12105, 12105], "mapped", "\u6708"], [[12106, 12106], "mapped", "\u6728"], [[12107, 12107], "mapped", "\u6B20"], [[12108, 12108], "mapped", "\u6B62"], [[12109, 12109], "mapped", "\u6B79"], [[12110, 12110], "mapped", "\u6BB3"], [[12111, 12111], "mapped", "\u6BCB"], [[12112, 12112], "mapped", "\u6BD4"], [[12113, 12113], "mapped", "\u6BDB"], [[12114, 12114], "mapped", "\u6C0F"], [[12115, 12115], "mapped", "\u6C14"], [[12116, 12116], "mapped", "\u6C34"], [[12117, 12117], "mapped", "\u706B"], [[12118, 12118], "mapped", "\u722A"], [[12119, 12119], "mapped", "\u7236"], [[12120, 12120], "mapped", "\u723B"], [[12121, 12121], "mapped", "\u723F"], [[12122, 12122], "mapped", "\u7247"], [[12123, 12123], "mapped", "\u7259"], [[12124, 12124], "mapped", "\u725B"], [[12125, 12125], "mapped", "\u72AC"], [[12126, 12126], "mapped", "\u7384"], [[12127, 12127], "mapped", "\u7389"], [[12128, 12128], "mapped", "\u74DC"], [[12129, 12129], "mapped", "\u74E6"], [[12130, 12130], "mapped", "\u7518"], [[12131, 12131], "mapped", "\u751F"], [[12132, 12132], "mapped", "\u7528"], [[12133, 12133], "mapped", "\u7530"], [[12134, 12134], "mapped", "\u758B"], [[12135, 12135], "mapped", "\u7592"], [[12136, 12136], "mapped", "\u7676"], [[12137, 12137], "mapped", "\u767D"], [[12138, 12138], "mapped", "\u76AE"], [[12139, 12139], "mapped", "\u76BF"], [[12140, 12140], "mapped", "\u76EE"], [[12141, 12141], "mapped", "\u77DB"], [[12142, 12142], "mapped", "\u77E2"], [[12143, 12143], "mapped", "\u77F3"], [[12144, 12144], "mapped", "\u793A"], [[12145, 12145], "mapped", "\u79B8"], [[12146, 12146], "mapped", "\u79BE"], [[12147, 12147], "mapped", "\u7A74"], [[12148, 12148], "mapped", "\u7ACB"], [[12149, 12149], "mapped", "\u7AF9"], [[12150, 12150], "mapped", "\u7C73"], [[12151, 12151], "mapped", "\u7CF8"], [[12152, 12152], "mapped", "\u7F36"], [[12153, 12153], "mapped", "\u7F51"], [[12154, 12154], "mapped", "\u7F8A"], [[12155, 12155], "mapped", "\u7FBD"], [[12156, 12156], "mapped", "\u8001"], [[12157, 12157], "mapped", "\u800C"], [[12158, 12158], "mapped", "\u8012"], [[12159, 12159], "mapped", "\u8033"], [[12160, 12160], "mapped", "\u807F"], [[12161, 12161], "mapped", "\u8089"], [[12162, 12162], "mapped", "\u81E3"], [[12163, 12163], "mapped", "\u81EA"], [[12164, 12164], "mapped", "\u81F3"], [[12165, 12165], "mapped", "\u81FC"], [[12166, 12166], "mapped", "\u820C"], [[12167, 12167], "mapped", "\u821B"], [[12168, 12168], "mapped", "\u821F"], [[12169, 12169], "mapped", "\u826E"], [[12170, 12170], "mapped", "\u8272"], [[12171, 12171], "mapped", "\u8278"], [[12172, 12172], "mapped", "\u864D"], [[12173, 12173], "mapped", "\u866B"], [[12174, 12174], "mapped", "\u8840"], [[12175, 12175], "mapped", "\u884C"], [[12176, 12176], "mapped", "\u8863"], [[12177, 12177], "mapped", "\u897E"], [[12178, 12178], "mapped", "\u898B"], [[12179, 12179], "mapped", "\u89D2"], [[12180, 12180], "mapped", "\u8A00"], [[12181, 12181], "mapped", "\u8C37"], [[12182, 12182], "mapped", "\u8C46"], [[12183, 12183], "mapped", "\u8C55"], [[12184, 12184], "mapped", "\u8C78"], [[12185, 12185], "mapped", "\u8C9D"], [[12186, 12186], "mapped", "\u8D64"], [[12187, 12187], "mapped", "\u8D70"], [[12188, 12188], "mapped", "\u8DB3"], [[12189, 12189], "mapped", "\u8EAB"], [[12190, 12190], "mapped", "\u8ECA"], [[12191, 12191], "mapped", "\u8F9B"], [[12192, 12192], "mapped", "\u8FB0"], [[12193, 12193], "mapped", "\u8FB5"], [[12194, 12194], "mapped", "\u9091"], [[12195, 12195], "mapped", "\u9149"], [[12196, 12196], "mapped", "\u91C6"], [[12197, 12197], "mapped", "\u91CC"], [[12198, 12198], "mapped", "\u91D1"], [[12199, 12199], "mapped", "\u9577"], [[12200, 12200], "mapped", "\u9580"], [[12201, 12201], "mapped", "\u961C"], [[12202, 12202], "mapped", "\u96B6"], [[12203, 12203], "mapped", "\u96B9"], [[12204, 12204], "mapped", "\u96E8"], [[12205, 12205], "mapped", "\u9751"], [[12206, 12206], "mapped", "\u975E"], [[12207, 12207], "mapped", "\u9762"], [[12208, 12208], "mapped", "\u9769"], [[12209, 12209], "mapped", "\u97CB"], [[12210, 12210], "mapped", "\u97ED"], [[12211, 12211], "mapped", "\u97F3"], [[12212, 12212], "mapped", "\u9801"], [[12213, 12213], "mapped", "\u98A8"], [[12214, 12214], "mapped", "\u98DB"], [[12215, 12215], "mapped", "\u98DF"], [[12216, 12216], "mapped", "\u9996"], [[12217, 12217], "mapped", "\u9999"], [[12218, 12218], "mapped", "\u99AC"], [[12219, 12219], "mapped", "\u9AA8"], [[12220, 12220], "mapped", "\u9AD8"], [[12221, 12221], "mapped", "\u9ADF"], [[12222, 12222], "mapped", "\u9B25"], [[12223, 12223], "mapped", "\u9B2F"], [[12224, 12224], "mapped", "\u9B32"], [[12225, 12225], "mapped", "\u9B3C"], [[12226, 12226], "mapped", "\u9B5A"], [[12227, 12227], "mapped", "\u9CE5"], [[12228, 12228], "mapped", "\u9E75"], [[12229, 12229], "mapped", "\u9E7F"], [[12230, 12230], "mapped", "\u9EA5"], [[12231, 12231], "mapped", "\u9EBB"], [[12232, 12232], "mapped", "\u9EC3"], [[12233, 12233], "mapped", "\u9ECD"], [[12234, 12234], "mapped", "\u9ED1"], [[12235, 12235], "mapped", "\u9EF9"], [[12236, 12236], "mapped", "\u9EFD"], [[12237, 12237], "mapped", "\u9F0E"], [[12238, 12238], "mapped", "\u9F13"], [[12239, 12239], "mapped", "\u9F20"], [[12240, 12240], "mapped", "\u9F3B"], [[12241, 12241], "mapped", "\u9F4A"], [[12242, 12242], "mapped", "\u9F52"], [[12243, 12243], "mapped", "\u9F8D"], [[12244, 12244], "mapped", "\u9F9C"], [[12245, 12245], "mapped", "\u9FA0"], [[12246, 12271], "disallowed"], [[12272, 12283], "disallowed"], [[12284, 12287], "disallowed"], [[12288, 12288], "disallowed_STD3_mapped", " "], [[12289, 12289], "valid", "", "NV8"], [[12290, 12290], "mapped", "."], [[12291, 12292], "valid", "", "NV8"], [[12293, 12295], "valid"], [[12296, 12329], "valid", "", "NV8"], [[12330, 12333], "valid"], [[12334, 12341], "valid", "", "NV8"], [[12342, 12342], "mapped", "\u3012"], [[12343, 12343], "valid", "", "NV8"], [[12344, 12344], "mapped", "\u5341"], [[12345, 12345], "mapped", "\u5344"], [[12346, 12346], "mapped", "\u5345"], [[12347, 12347], "valid", "", "NV8"], [[12348, 12348], "valid"], [[12349, 12349], "valid", "", "NV8"], [[12350, 12350], "valid", "", "NV8"], [[12351, 12351], "valid", "", "NV8"], [[12352, 12352], "disallowed"], [[12353, 12436], "valid"], [[12437, 12438], "valid"], [[12439, 12440], "disallowed"], [[12441, 12442], "valid"], [[12443, 12443], "disallowed_STD3_mapped", " \u3099"], [[12444, 12444], "disallowed_STD3_mapped", " \u309A"], [[12445, 12446], "valid"], [[12447, 12447], "mapped", "\u3088\u308A"], [[12448, 12448], "valid", "", "NV8"], [[12449, 12542], "valid"], [[12543, 12543], "mapped", "\u30B3\u30C8"], [[12544, 12548], "disallowed"], [[12549, 12588], "valid"], [[12589, 12589], "valid"], [[12590, 12590], "valid"], [[12591, 12592], "disallowed"], [[12593, 12593], "mapped", "\u1100"], [[12594, 12594], "mapped", "\u1101"], [[12595, 12595], "mapped", "\u11AA"], [[12596, 12596], "mapped", "\u1102"], [[12597, 12597], "mapped", "\u11AC"], [[12598, 12598], "mapped", "\u11AD"], [[12599, 12599], "mapped", "\u1103"], [[12600, 12600], "mapped", "\u1104"], [[12601, 12601], "mapped", "\u1105"], [[12602, 12602], "mapped", "\u11B0"], [[12603, 12603], "mapped", "\u11B1"], [[12604, 12604], "mapped", "\u11B2"], [[12605, 12605], "mapped", "\u11B3"], [[12606, 12606], "mapped", "\u11B4"], [[12607, 12607], "mapped", "\u11B5"], [[12608, 12608], "mapped", "\u111A"], [[12609, 12609], "mapped", "\u1106"], [[12610, 12610], "mapped", "\u1107"], [[12611, 12611], "mapped", "\u1108"], [[12612, 12612], "mapped", "\u1121"], [[12613, 12613], "mapped", "\u1109"], [[12614, 12614], "mapped", "\u110A"], [[12615, 12615], "mapped", "\u110B"], [[12616, 12616], "mapped", "\u110C"], [[12617, 12617], "mapped", "\u110D"], [[12618, 12618], "mapped", "\u110E"], [[12619, 12619], "mapped", "\u110F"], [[12620, 12620], "mapped", "\u1110"], [[12621, 12621], "mapped", "\u1111"], [[12622, 12622], "mapped", "\u1112"], [[12623, 12623], "mapped", "\u1161"], [[12624, 12624], "mapped", "\u1162"], [[12625, 12625], "mapped", "\u1163"], [[12626, 12626], "mapped", "\u1164"], [[12627, 12627], "mapped", "\u1165"], [[12628, 12628], "mapped", "\u1166"], [[12629, 12629], "mapped", "\u1167"], [[12630, 12630], "mapped", "\u1168"], [[12631, 12631], "mapped", "\u1169"], [[12632, 12632], "mapped", "\u116A"], [[12633, 12633], "mapped", "\u116B"], [[12634, 12634], "mapped", "\u116C"], [[12635, 12635], "mapped", "\u116D"], [[12636, 12636], "mapped", "\u116E"], [[12637, 12637], "mapped", "\u116F"], [[12638, 12638], "mapped", "\u1170"], [[12639, 12639], "mapped", "\u1171"], [[12640, 12640], "mapped", "\u1172"], [[12641, 12641], "mapped", "\u1173"], [[12642, 12642], "mapped", "\u1174"], [[12643, 12643], "mapped", "\u1175"], [[12644, 12644], "disallowed"], [[12645, 12645], "mapped", "\u1114"], [[12646, 12646], "mapped", "\u1115"], [[12647, 12647], "mapped", "\u11C7"], [[12648, 12648], "mapped", "\u11C8"], [[12649, 12649], "mapped", "\u11CC"], [[12650, 12650], "mapped", "\u11CE"], [[12651, 12651], "mapped", "\u11D3"], [[12652, 12652], "mapped", "\u11D7"], [[12653, 12653], "mapped", "\u11D9"], [[12654, 12654], "mapped", "\u111C"], [[12655, 12655], "mapped", "\u11DD"], [[12656, 12656], "mapped", "\u11DF"], [[12657, 12657], "mapped", "\u111D"], [[12658, 12658], "mapped", "\u111E"], [[12659, 12659], "mapped", "\u1120"], [[12660, 12660], "mapped", "\u1122"], [[12661, 12661], "mapped", "\u1123"], [[12662, 12662], "mapped", "\u1127"], [[12663, 12663], "mapped", "\u1129"], [[12664, 12664], "mapped", "\u112B"], [[12665, 12665], "mapped", "\u112C"], [[12666, 12666], "mapped", "\u112D"], [[12667, 12667], "mapped", "\u112E"], [[12668, 12668], "mapped", "\u112F"], [[12669, 12669], "mapped", "\u1132"], [[12670, 12670], "mapped", "\u1136"], [[12671, 12671], "mapped", "\u1140"], [[12672, 12672], "mapped", "\u1147"], [[12673, 12673], "mapped", "\u114C"], [[12674, 12674], "mapped", "\u11F1"], [[12675, 12675], "mapped", "\u11F2"], [[12676, 12676], "mapped", "\u1157"], [[12677, 12677], "mapped", "\u1158"], [[12678, 12678], "mapped", "\u1159"], [[12679, 12679], "mapped", "\u1184"], [[12680, 12680], "mapped", "\u1185"], [[12681, 12681], "mapped", "\u1188"], [[12682, 12682], "mapped", "\u1191"], [[12683, 12683], "mapped", "\u1192"], [[12684, 12684], "mapped", "\u1194"], [[12685, 12685], "mapped", "\u119E"], [[12686, 12686], "mapped", "\u11A1"], [[12687, 12687], "disallowed"], [[12688, 12689], "valid", "", "NV8"], [[12690, 12690], "mapped", "\u4E00"], [[12691, 12691], "mapped", "\u4E8C"], [[12692, 12692], "mapped", "\u4E09"], [[12693, 12693], "mapped", "\u56DB"], [[12694, 12694], "mapped", "\u4E0A"], [[12695, 12695], "mapped", "\u4E2D"], [[12696, 12696], "mapped", "\u4E0B"], [[12697, 12697], "mapped", "\u7532"], [[12698, 12698], "mapped", "\u4E59"], [[12699, 12699], "mapped", "\u4E19"], [[12700, 12700], "mapped", "\u4E01"], [[12701, 12701], "mapped", "\u5929"], [[12702, 12702], "mapped", "\u5730"], [[12703, 12703], "mapped", "\u4EBA"], [[12704, 12727], "valid"], [[12728, 12730], "valid"], [[12731, 12735], "disallowed"], [[12736, 12751], "valid", "", "NV8"], [[12752, 12771], "valid", "", "NV8"], [[12772, 12783], "disallowed"], [[12784, 12799], "valid"], [[12800, 12800], "disallowed_STD3_mapped", "(\u1100)"], [[12801, 12801], "disallowed_STD3_mapped", "(\u1102)"], [[12802, 12802], "disallowed_STD3_mapped", "(\u1103)"], [[12803, 12803], "disallowed_STD3_mapped", "(\u1105)"], [[12804, 12804], "disallowed_STD3_mapped", "(\u1106)"], [[12805, 12805], "disallowed_STD3_mapped", "(\u1107)"], [[12806, 12806], "disallowed_STD3_mapped", "(\u1109)"], [[12807, 12807], "disallowed_STD3_mapped", "(\u110B)"], [[12808, 12808], "disallowed_STD3_mapped", "(\u110C)"], [[12809, 12809], "disallowed_STD3_mapped", "(\u110E)"], [[12810, 12810], "disallowed_STD3_mapped", "(\u110F)"], [[12811, 12811], "disallowed_STD3_mapped", "(\u1110)"], [[12812, 12812], "disallowed_STD3_mapped", "(\u1111)"], [[12813, 12813], "disallowed_STD3_mapped", "(\u1112)"], [[12814, 12814], "disallowed_STD3_mapped", "(\uAC00)"], [[12815, 12815], "disallowed_STD3_mapped", "(\uB098)"], [[12816, 12816], "disallowed_STD3_mapped", "(\uB2E4)"], [[12817, 12817], "disallowed_STD3_mapped", "(\uB77C)"], [[12818, 12818], "disallowed_STD3_mapped", "(\uB9C8)"], [[12819, 12819], "disallowed_STD3_mapped", "(\uBC14)"], [[12820, 12820], "disallowed_STD3_mapped", "(\uC0AC)"], [[12821, 12821], "disallowed_STD3_mapped", "(\uC544)"], [[12822, 12822], "disallowed_STD3_mapped", "(\uC790)"], [[12823, 12823], "disallowed_STD3_mapped", "(\uCC28)"], [[12824, 12824], "disallowed_STD3_mapped", "(\uCE74)"], [[12825, 12825], "disallowed_STD3_mapped", "(\uD0C0)"], [[12826, 12826], "disallowed_STD3_mapped", "(\uD30C)"], [[12827, 12827], "disallowed_STD3_mapped", "(\uD558)"], [[12828, 12828], "disallowed_STD3_mapped", "(\uC8FC)"], [[12829, 12829], "disallowed_STD3_mapped", "(\uC624\uC804)"], [[12830, 12830], "disallowed_STD3_mapped", "(\uC624\uD6C4)"], [[12831, 12831], "disallowed"], [[12832, 12832], "disallowed_STD3_mapped", "(\u4E00)"], [[12833, 12833], "disallowed_STD3_mapped", "(\u4E8C)"], [[12834, 12834], "disallowed_STD3_mapped", "(\u4E09)"], [[12835, 12835], "disallowed_STD3_mapped", "(\u56DB)"], [[12836, 12836], "disallowed_STD3_mapped", "(\u4E94)"], [[12837, 12837], "disallowed_STD3_mapped", "(\u516D)"], [[12838, 12838], "disallowed_STD3_mapped", "(\u4E03)"], [[12839, 12839], "disallowed_STD3_mapped", "(\u516B)"], [[12840, 12840], "disallowed_STD3_mapped", "(\u4E5D)"], [[12841, 12841], "disallowed_STD3_mapped", "(\u5341)"], [[12842, 12842], "disallowed_STD3_mapped", "(\u6708)"], [[12843, 12843], "disallowed_STD3_mapped", "(\u706B)"], [[12844, 12844], "disallowed_STD3_mapped", "(\u6C34)"], [[12845, 12845], "disallowed_STD3_mapped", "(\u6728)"], [[12846, 12846], "disallowed_STD3_mapped", "(\u91D1)"], [[12847, 12847], "disallowed_STD3_mapped", "(\u571F)"], [[12848, 12848], "disallowed_STD3_mapped", "(\u65E5)"], [[12849, 12849], "disallowed_STD3_mapped", "(\u682A)"], [[12850, 12850], "disallowed_STD3_mapped", "(\u6709)"], [[12851, 12851], "disallowed_STD3_mapped", "(\u793E)"], [[12852, 12852], "disallowed_STD3_mapped", "(\u540D)"], [[12853, 12853], "disallowed_STD3_mapped", "(\u7279)"], [[12854, 12854], "disallowed_STD3_mapped", "(\u8CA1)"], [[12855, 12855], "disallowed_STD3_mapped", "(\u795D)"], [[12856, 12856], "disallowed_STD3_mapped", "(\u52B4)"], [[12857, 12857], "disallowed_STD3_mapped", "(\u4EE3)"], [[12858, 12858], "disallowed_STD3_mapped", "(\u547C)"], [[12859, 12859], "disallowed_STD3_mapped", "(\u5B66)"], [[12860, 12860], "disallowed_STD3_mapped", "(\u76E3)"], [[12861, 12861], "disallowed_STD3_mapped", "(\u4F01)"], [[12862, 12862], "disallowed_STD3_mapped", "(\u8CC7)"], [[12863, 12863], "disallowed_STD3_mapped", "(\u5354)"], [[12864, 12864], "disallowed_STD3_mapped", "(\u796D)"], [[12865, 12865], "disallowed_STD3_mapped", "(\u4F11)"], [[12866, 12866], "disallowed_STD3_mapped", "(\u81EA)"], [[12867, 12867], "disallowed_STD3_mapped", "(\u81F3)"], [[12868, 12868], "mapped", "\u554F"], [[12869, 12869], "mapped", "\u5E7C"], [[12870, 12870], "mapped", "\u6587"], [[12871, 12871], "mapped", "\u7B8F"], [[12872, 12879], "valid", "", "NV8"], [[12880, 12880], "mapped", "pte"], [[12881, 12881], "mapped", "21"], [[12882, 12882], "mapped", "22"], [[12883, 12883], "mapped", "23"], [[12884, 12884], "mapped", "24"], [[12885, 12885], "mapped", "25"], [[12886, 12886], "mapped", "26"], [[12887, 12887], "mapped", "27"], [[12888, 12888], "mapped", "28"], [[12889, 12889], "mapped", "29"], [[12890, 12890], "mapped", "30"], [[12891, 12891], "mapped", "31"], [[12892, 12892], "mapped", "32"], [[12893, 12893], "mapped", "33"], [[12894, 12894], "mapped", "34"], [[12895, 12895], "mapped", "35"], [[12896, 12896], "mapped", "\u1100"], [[12897, 12897], "mapped", "\u1102"], [[12898, 12898], "mapped", "\u1103"], [[12899, 12899], "mapped", "\u1105"], [[12900, 12900], "mapped", "\u1106"], [[12901, 12901], "mapped", "\u1107"], [[12902, 12902], "mapped", "\u1109"], [[12903, 12903], "mapped", "\u110B"], [[12904, 12904], "mapped", "\u110C"], [[12905, 12905], "mapped", "\u110E"], [[12906, 12906], "mapped", "\u110F"], [[12907, 12907], "mapped", "\u1110"], [[12908, 12908], "mapped", "\u1111"], [[12909, 12909], "mapped", "\u1112"], [[12910, 12910], "mapped", "\uAC00"], [[12911, 12911], "mapped", "\uB098"], [[12912, 12912], "mapped", "\uB2E4"], [[12913, 12913], "mapped", "\uB77C"], [[12914, 12914], "mapped", "\uB9C8"], [[12915, 12915], "mapped", "\uBC14"], [[12916, 12916], "mapped", "\uC0AC"], [[12917, 12917], "mapped", "\uC544"], [[12918, 12918], "mapped", "\uC790"], [[12919, 12919], "mapped", "\uCC28"], [[12920, 12920], "mapped", "\uCE74"], [[12921, 12921], "mapped", "\uD0C0"], [[12922, 12922], "mapped", "\uD30C"], [[12923, 12923], "mapped", "\uD558"], [[12924, 12924], "mapped", "\uCC38\uACE0"], [[12925, 12925], "mapped", "\uC8FC\uC758"], [[12926, 12926], "mapped", "\uC6B0"], [[12927, 12927], "valid", "", "NV8"], [[12928, 12928], "mapped", "\u4E00"], [[12929, 12929], "mapped", "\u4E8C"], [[12930, 12930], "mapped", "\u4E09"], [[12931, 12931], "mapped", "\u56DB"], [[12932, 12932], "mapped", "\u4E94"], [[12933, 12933], "mapped", "\u516D"], [[12934, 12934], "mapped", "\u4E03"], [[12935, 12935], "mapped", "\u516B"], [[12936, 12936], "mapped", "\u4E5D"], [[12937, 12937], "mapped", "\u5341"], [[12938, 12938], "mapped", "\u6708"], [[12939, 12939], "mapped", "\u706B"], [[12940, 12940], "mapped", "\u6C34"], [[12941, 12941], "mapped", "\u6728"], [[12942, 12942], "mapped", "\u91D1"], [[12943, 12943], "mapped", "\u571F"], [[12944, 12944], "mapped", "\u65E5"], [[12945, 12945], "mapped", "\u682A"], [[12946, 12946], "mapped", "\u6709"], [[12947, 12947], "mapped", "\u793E"], [[12948, 12948], "mapped", "\u540D"], [[12949, 12949], "mapped", "\u7279"], [[12950, 12950], "mapped", "\u8CA1"], [[12951, 12951], "mapped", "\u795D"], [[12952, 12952], "mapped", "\u52B4"], [[12953, 12953], "mapped", "\u79D8"], [[12954, 12954], "mapped", "\u7537"], [[12955, 12955], "mapped", "\u5973"], [[12956, 12956], "mapped", "\u9069"], [[12957, 12957], "mapped", "\u512A"], [[12958, 12958], "mapped", "\u5370"], [[12959, 12959], "mapped", "\u6CE8"], [[12960, 12960], "mapped", "\u9805"], [[12961, 12961], "mapped", "\u4F11"], [[12962, 12962], "mapped", "\u5199"], [[12963, 12963], "mapped", "\u6B63"], [[12964, 12964], "mapped", "\u4E0A"], [[12965, 12965], "mapped", "\u4E2D"], [[12966, 12966], "mapped", "\u4E0B"], [[12967, 12967], "mapped", "\u5DE6"], [[12968, 12968], "mapped", "\u53F3"], [[12969, 12969], "mapped", "\u533B"], [[12970, 12970], "mapped", "\u5B97"], [[12971, 12971], "mapped", "\u5B66"], [[12972, 12972], "mapped", "\u76E3"], [[12973, 12973], "mapped", "\u4F01"], [[12974, 12974], "mapped", "\u8CC7"], [[12975, 12975], "mapped", "\u5354"], [[12976, 12976], "mapped", "\u591C"], [[12977, 12977], "mapped", "36"], [[12978, 12978], "mapped", "37"], [[12979, 12979], "mapped", "38"], [[12980, 12980], "mapped", "39"], [[12981, 12981], "mapped", "40"], [[12982, 12982], "mapped", "41"], [[12983, 12983], "mapped", "42"], [[12984, 12984], "mapped", "43"], [[12985, 12985], "mapped", "44"], [[12986, 12986], "mapped", "45"], [[12987, 12987], "mapped", "46"], [[12988, 12988], "mapped", "47"], [[12989, 12989], "mapped", "48"], [[12990, 12990], "mapped", "49"], [[12991, 12991], "mapped", "50"], [[12992, 12992], "mapped", "1\u6708"], [[12993, 12993], "mapped", "2\u6708"], [[12994, 12994], "mapped", "3\u6708"], [[12995, 12995], "mapped", "4\u6708"], [[12996, 12996], "mapped", "5\u6708"], [[12997, 12997], "mapped", "6\u6708"], [[12998, 12998], "mapped", "7\u6708"], [[12999, 12999], "mapped", "8\u6708"], [[13e3, 13e3], "mapped", "9\u6708"], [[13001, 13001], "mapped", "10\u6708"], [[13002, 13002], "mapped", "11\u6708"], [[13003, 13003], "mapped", "12\u6708"], [[13004, 13004], "mapped", "hg"], [[13005, 13005], "mapped", "erg"], [[13006, 13006], "mapped", "ev"], [[13007, 13007], "mapped", "ltd"], [[13008, 13008], "mapped", "\u30A2"], [[13009, 13009], "mapped", "\u30A4"], [[13010, 13010], "mapped", "\u30A6"], [[13011, 13011], "mapped", "\u30A8"], [[13012, 13012], "mapped", "\u30AA"], [[13013, 13013], "mapped", "\u30AB"], [[13014, 13014], "mapped", "\u30AD"], [[13015, 13015], "mapped", "\u30AF"], [[13016, 13016], "mapped", "\u30B1"], [[13017, 13017], "mapped", "\u30B3"], [[13018, 13018], "mapped", "\u30B5"], [[13019, 13019], "mapped", "\u30B7"], [[13020, 13020], "mapped", "\u30B9"], [[13021, 13021], "mapped", "\u30BB"], [[13022, 13022], "mapped", "\u30BD"], [[13023, 13023], "mapped", "\u30BF"], [[13024, 13024], "mapped", "\u30C1"], [[13025, 13025], "mapped", "\u30C4"], [[13026, 13026], "mapped", "\u30C6"], [[13027, 13027], "mapped", "\u30C8"], [[13028, 13028], "mapped", "\u30CA"], [[13029, 13029], "mapped", "\u30CB"], [[13030, 13030], "mapped", "\u30CC"], [[13031, 13031], "mapped", "\u30CD"], [[13032, 13032], "mapped", "\u30CE"], [[13033, 13033], "mapped", "\u30CF"], [[13034, 13034], "mapped", "\u30D2"], [[13035, 13035], "mapped", "\u30D5"], [[13036, 13036], "mapped", "\u30D8"], [[13037, 13037], "mapped", "\u30DB"], [[13038, 13038], "mapped", "\u30DE"], [[13039, 13039], "mapped", "\u30DF"], [[13040, 13040], "mapped", "\u30E0"], [[13041, 13041], "mapped", "\u30E1"], [[13042, 13042], "mapped", "\u30E2"], [[13043, 13043], "mapped", "\u30E4"], [[13044, 13044], "mapped", "\u30E6"], [[13045, 13045], "mapped", "\u30E8"], [[13046, 13046], "mapped", "\u30E9"], [[13047, 13047], "mapped", "\u30EA"], [[13048, 13048], "mapped", "\u30EB"], [[13049, 13049], "mapped", "\u30EC"], [[13050, 13050], "mapped", "\u30ED"], [[13051, 13051], "mapped", "\u30EF"], [[13052, 13052], "mapped", "\u30F0"], [[13053, 13053], "mapped", "\u30F1"], [[13054, 13054], "mapped", "\u30F2"], [[13055, 13055], "disallowed"], [[13056, 13056], "mapped", "\u30A2\u30D1\u30FC\u30C8"], [[13057, 13057], "mapped", "\u30A2\u30EB\u30D5\u30A1"], [[13058, 13058], "mapped", "\u30A2\u30F3\u30DA\u30A2"], [[13059, 13059], "mapped", "\u30A2\u30FC\u30EB"], [[13060, 13060], "mapped", "\u30A4\u30CB\u30F3\u30B0"], [[13061, 13061], "mapped", "\u30A4\u30F3\u30C1"], [[13062, 13062], "mapped", "\u30A6\u30A9\u30F3"], [[13063, 13063], "mapped", "\u30A8\u30B9\u30AF\u30FC\u30C9"], [[13064, 13064], "mapped", "\u30A8\u30FC\u30AB\u30FC"], [[13065, 13065], "mapped", "\u30AA\u30F3\u30B9"], [[13066, 13066], "mapped", "\u30AA\u30FC\u30E0"], [[13067, 13067], "mapped", "\u30AB\u30A4\u30EA"], [[13068, 13068], "mapped", "\u30AB\u30E9\u30C3\u30C8"], [[13069, 13069], "mapped", "\u30AB\u30ED\u30EA\u30FC"], [[13070, 13070], "mapped", "\u30AC\u30ED\u30F3"], [[13071, 13071], "mapped", "\u30AC\u30F3\u30DE"], [[13072, 13072], "mapped", "\u30AE\u30AC"], [[13073, 13073], "mapped", "\u30AE\u30CB\u30FC"], [[13074, 13074], "mapped", "\u30AD\u30E5\u30EA\u30FC"], [[13075, 13075], "mapped", "\u30AE\u30EB\u30C0\u30FC"], [[13076, 13076], "mapped", "\u30AD\u30ED"], [[13077, 13077], "mapped", "\u30AD\u30ED\u30B0\u30E9\u30E0"], [[13078, 13078], "mapped", "\u30AD\u30ED\u30E1\u30FC\u30C8\u30EB"], [[13079, 13079], "mapped", "\u30AD\u30ED\u30EF\u30C3\u30C8"], [[13080, 13080], "mapped", "\u30B0\u30E9\u30E0"], [[13081, 13081], "mapped", "\u30B0\u30E9\u30E0\u30C8\u30F3"], [[13082, 13082], "mapped", "\u30AF\u30EB\u30BC\u30A4\u30ED"], [[13083, 13083], "mapped", "\u30AF\u30ED\u30FC\u30CD"], [[13084, 13084], "mapped", "\u30B1\u30FC\u30B9"], [[13085, 13085], "mapped", "\u30B3\u30EB\u30CA"], [[13086, 13086], "mapped", "\u30B3\u30FC\u30DD"], [[13087, 13087], "mapped", "\u30B5\u30A4\u30AF\u30EB"], [[13088, 13088], "mapped", "\u30B5\u30F3\u30C1\u30FC\u30E0"], [[13089, 13089], "mapped", "\u30B7\u30EA\u30F3\u30B0"], [[13090, 13090], "mapped", "\u30BB\u30F3\u30C1"], [[13091, 13091], "mapped", "\u30BB\u30F3\u30C8"], [[13092, 13092], "mapped", "\u30C0\u30FC\u30B9"], [[13093, 13093], "mapped", "\u30C7\u30B7"], [[13094, 13094], "mapped", "\u30C9\u30EB"], [[13095, 13095], "mapped", "\u30C8\u30F3"], [[13096, 13096], "mapped", "\u30CA\u30CE"], [[13097, 13097], "mapped", "\u30CE\u30C3\u30C8"], [[13098, 13098], "mapped", "\u30CF\u30A4\u30C4"], [[13099, 13099], "mapped", "\u30D1\u30FC\u30BB\u30F3\u30C8"], [[13100, 13100], "mapped", "\u30D1\u30FC\u30C4"], [[13101, 13101], "mapped", "\u30D0\u30FC\u30EC\u30EB"], [[13102, 13102], "mapped", "\u30D4\u30A2\u30B9\u30C8\u30EB"], [[13103, 13103], "mapped", "\u30D4\u30AF\u30EB"], [[13104, 13104], "mapped", "\u30D4\u30B3"], [[13105, 13105], "mapped", "\u30D3\u30EB"], [[13106, 13106], "mapped", "\u30D5\u30A1\u30E9\u30C3\u30C9"], [[13107, 13107], "mapped", "\u30D5\u30A3\u30FC\u30C8"], [[13108, 13108], "mapped", "\u30D6\u30C3\u30B7\u30A7\u30EB"], [[13109, 13109], "mapped", "\u30D5\u30E9\u30F3"], [[13110, 13110], "mapped", "\u30D8\u30AF\u30BF\u30FC\u30EB"], [[13111, 13111], "mapped", "\u30DA\u30BD"], [[13112, 13112], "mapped", "\u30DA\u30CB\u30D2"], [[13113, 13113], "mapped", "\u30D8\u30EB\u30C4"], [[13114, 13114], "mapped", "\u30DA\u30F3\u30B9"], [[13115, 13115], "mapped", "\u30DA\u30FC\u30B8"], [[13116, 13116], "mapped", "\u30D9\u30FC\u30BF"], [[13117, 13117], "mapped", "\u30DD\u30A4\u30F3\u30C8"], [[13118, 13118], "mapped", "\u30DC\u30EB\u30C8"], [[13119, 13119], "mapped", "\u30DB\u30F3"], [[13120, 13120], "mapped", "\u30DD\u30F3\u30C9"], [[13121, 13121], "mapped", "\u30DB\u30FC\u30EB"], [[13122, 13122], "mapped", "\u30DB\u30FC\u30F3"], [[13123, 13123], "mapped", "\u30DE\u30A4\u30AF\u30ED"], [[13124, 13124], "mapped", "\u30DE\u30A4\u30EB"], [[13125, 13125], "mapped", "\u30DE\u30C3\u30CF"], [[13126, 13126], "mapped", "\u30DE\u30EB\u30AF"], [[13127, 13127], "mapped", "\u30DE\u30F3\u30B7\u30E7\u30F3"], [[13128, 13128], "mapped", "\u30DF\u30AF\u30ED\u30F3"], [[13129, 13129], "mapped", "\u30DF\u30EA"], [[13130, 13130], "mapped", "\u30DF\u30EA\u30D0\u30FC\u30EB"], [[13131, 13131], "mapped", "\u30E1\u30AC"], [[13132, 13132], "mapped", "\u30E1\u30AC\u30C8\u30F3"], [[13133, 13133], "mapped", "\u30E1\u30FC\u30C8\u30EB"], [[13134, 13134], "mapped", "\u30E4\u30FC\u30C9"], [[13135, 13135], "mapped", "\u30E4\u30FC\u30EB"], [[13136, 13136], "mapped", "\u30E6\u30A2\u30F3"], [[13137, 13137], "mapped", "\u30EA\u30C3\u30C8\u30EB"], [[13138, 13138], "mapped", "\u30EA\u30E9"], [[13139, 13139], "mapped", "\u30EB\u30D4\u30FC"], [[13140, 13140], "mapped", "\u30EB\u30FC\u30D6\u30EB"], [[13141, 13141], "mapped", "\u30EC\u30E0"], [[13142, 13142], "mapped", "\u30EC\u30F3\u30C8\u30B2\u30F3"], [[13143, 13143], "mapped", "\u30EF\u30C3\u30C8"], [[13144, 13144], "mapped", "0\u70B9"], [[13145, 13145], "mapped", "1\u70B9"], [[13146, 13146], "mapped", "2\u70B9"], [[13147, 13147], "mapped", "3\u70B9"], [[13148, 13148], "mapped", "4\u70B9"], [[13149, 13149], "mapped", "5\u70B9"], [[13150, 13150], "mapped", "6\u70B9"], [[13151, 13151], "mapped", "7\u70B9"], [[13152, 13152], "mapped", "8\u70B9"], [[13153, 13153], "mapped", "9\u70B9"], [[13154, 13154], "mapped", "10\u70B9"], [[13155, 13155], "mapped", "11\u70B9"], [[13156, 13156], "mapped", "12\u70B9"], [[13157, 13157], "mapped", "13\u70B9"], [[13158, 13158], "mapped", "14\u70B9"], [[13159, 13159], "mapped", "15\u70B9"], [[13160, 13160], "mapped", "16\u70B9"], [[13161, 13161], "mapped", "17\u70B9"], [[13162, 13162], "mapped", "18\u70B9"], [[13163, 13163], "mapped", "19\u70B9"], [[13164, 13164], "mapped", "20\u70B9"], [[13165, 13165], "mapped", "21\u70B9"], [[13166, 13166], "mapped", "22\u70B9"], [[13167, 13167], "mapped", "23\u70B9"], [[13168, 13168], "mapped", "24\u70B9"], [[13169, 13169], "mapped", "hpa"], [[13170, 13170], "mapped", "da"], [[13171, 13171], "mapped", "au"], [[13172, 13172], "mapped", "bar"], [[13173, 13173], "mapped", "ov"], [[13174, 13174], "mapped", "pc"], [[13175, 13175], "mapped", "dm"], [[13176, 13176], "mapped", "dm2"], [[13177, 13177], "mapped", "dm3"], [[13178, 13178], "mapped", "iu"], [[13179, 13179], "mapped", "\u5E73\u6210"], [[13180, 13180], "mapped", "\u662D\u548C"], [[13181, 13181], "mapped", "\u5927\u6B63"], [[13182, 13182], "mapped", "\u660E\u6CBB"], [[13183, 13183], "mapped", "\u682A\u5F0F\u4F1A\u793E"], [[13184, 13184], "mapped", "pa"], [[13185, 13185], "mapped", "na"], [[13186, 13186], "mapped", "\u03BCa"], [[13187, 13187], "mapped", "ma"], [[13188, 13188], "mapped", "ka"], [[13189, 13189], "mapped", "kb"], [[13190, 13190], "mapped", "mb"], [[13191, 13191], "mapped", "gb"], [[13192, 13192], "mapped", "cal"], [[13193, 13193], "mapped", "kcal"], [[13194, 13194], "mapped", "pf"], [[13195, 13195], "mapped", "nf"], [[13196, 13196], "mapped", "\u03BCf"], [[13197, 13197], "mapped", "\u03BCg"], [[13198, 13198], "mapped", "mg"], [[13199, 13199], "mapped", "kg"], [[13200, 13200], "mapped", "hz"], [[13201, 13201], "mapped", "khz"], [[13202, 13202], "mapped", "mhz"], [[13203, 13203], "mapped", "ghz"], [[13204, 13204], "mapped", "thz"], [[13205, 13205], "mapped", "\u03BCl"], [[13206, 13206], "mapped", "ml"], [[13207, 13207], "mapped", "dl"], [[13208, 13208], "mapped", "kl"], [[13209, 13209], "mapped", "fm"], [[13210, 13210], "mapped", "nm"], [[13211, 13211], "mapped", "\u03BCm"], [[13212, 13212], "mapped", "mm"], [[13213, 13213], "mapped", "cm"], [[13214, 13214], "mapped", "km"], [[13215, 13215], "mapped", "mm2"], [[13216, 13216], "mapped", "cm2"], [[13217, 13217], "mapped", "m2"], [[13218, 13218], "mapped", "km2"], [[13219, 13219], "mapped", "mm3"], [[13220, 13220], "mapped", "cm3"], [[13221, 13221], "mapped", "m3"], [[13222, 13222], "mapped", "km3"], [[13223, 13223], "mapped", "m\u2215s"], [[13224, 13224], "mapped", "m\u2215s2"], [[13225, 13225], "mapped", "pa"], [[13226, 13226], "mapped", "kpa"], [[13227, 13227], "mapped", "mpa"], [[13228, 13228], "mapped", "gpa"], [[13229, 13229], "mapped", "rad"], [[13230, 13230], "mapped", "rad\u2215s"], [[13231, 13231], "mapped", "rad\u2215s2"], [[13232, 13232], "mapped", "ps"], [[13233, 13233], "mapped", "ns"], [[13234, 13234], "mapped", "\u03BCs"], [[13235, 13235], "mapped", "ms"], [[13236, 13236], "mapped", "pv"], [[13237, 13237], "mapped", "nv"], [[13238, 13238], "mapped", "\u03BCv"], [[13239, 13239], "mapped", "mv"], [[13240, 13240], "mapped", "kv"], [[13241, 13241], "mapped", "mv"], [[13242, 13242], "mapped", "pw"], [[13243, 13243], "mapped", "nw"], [[13244, 13244], "mapped", "\u03BCw"], [[13245, 13245], "mapped", "mw"], [[13246, 13246], "mapped", "kw"], [[13247, 13247], "mapped", "mw"], [[13248, 13248], "mapped", "k\u03C9"], [[13249, 13249], "mapped", "m\u03C9"], [[13250, 13250], "disallowed"], [[13251, 13251], "mapped", "bq"], [[13252, 13252], "mapped", "cc"], [[13253, 13253], "mapped", "cd"], [[13254, 13254], "mapped", "c\u2215kg"], [[13255, 13255], "disallowed"], [[13256, 13256], "mapped", "db"], [[13257, 13257], "mapped", "gy"], [[13258, 13258], "mapped", "ha"], [[13259, 13259], "mapped", "hp"], [[13260, 13260], "mapped", "in"], [[13261, 13261], "mapped", "kk"], [[13262, 13262], "mapped", "km"], [[13263, 13263], "mapped", "kt"], [[13264, 13264], "mapped", "lm"], [[13265, 13265], "mapped", "ln"], [[13266, 13266], "mapped", "log"], [[13267, 13267], "mapped", "lx"], [[13268, 13268], "mapped", "mb"], [[13269, 13269], "mapped", "mil"], [[13270, 13270], "mapped", "mol"], [[13271, 13271], "mapped", "ph"], [[13272, 13272], "disallowed"], [[13273, 13273], "mapped", "ppm"], [[13274, 13274], "mapped", "pr"], [[13275, 13275], "mapped", "sr"], [[13276, 13276], "mapped", "sv"], [[13277, 13277], "mapped", "wb"], [[13278, 13278], "mapped", "v\u2215m"], [[13279, 13279], "mapped", "a\u2215m"], [[13280, 13280], "mapped", "1\u65E5"], [[13281, 13281], "mapped", "2\u65E5"], [[13282, 13282], "mapped", "3\u65E5"], [[13283, 13283], "mapped", "4\u65E5"], [[13284, 13284], "mapped", "5\u65E5"], [[13285, 13285], "mapped", "6\u65E5"], [[13286, 13286], "mapped", "7\u65E5"], [[13287, 13287], "mapped", "8\u65E5"], [[13288, 13288], "mapped", "9\u65E5"], [[13289, 13289], "mapped", "10\u65E5"], [[13290, 13290], "mapped", "11\u65E5"], [[13291, 13291], "mapped", "12\u65E5"], [[13292, 13292], "mapped", "13\u65E5"], [[13293, 13293], "mapped", "14\u65E5"], [[13294, 13294], "mapped", "15\u65E5"], [[13295, 13295], "mapped", "16\u65E5"], [[13296, 13296], "mapped", "17\u65E5"], [[13297, 13297], "mapped", "18\u65E5"], [[13298, 13298], "mapped", "19\u65E5"], [[13299, 13299], "mapped", "20\u65E5"], [[13300, 13300], "mapped", "21\u65E5"], [[13301, 13301], "mapped", "22\u65E5"], [[13302, 13302], "mapped", "23\u65E5"], [[13303, 13303], "mapped", "24\u65E5"], [[13304, 13304], "mapped", "25\u65E5"], [[13305, 13305], "mapped", "26\u65E5"], [[13306, 13306], "mapped", "27\u65E5"], [[13307, 13307], "mapped", "28\u65E5"], [[13308, 13308], "mapped", "29\u65E5"], [[13309, 13309], "mapped", "30\u65E5"], [[13310, 13310], "mapped", "31\u65E5"], [[13311, 13311], "mapped", "gal"], [[13312, 19893], "valid"], [[19894, 19903], "disallowed"], [[19904, 19967], "valid", "", "NV8"], [[19968, 40869], "valid"], [[40870, 40891], "valid"], [[40892, 40899], "valid"], [[40900, 40907], "valid"], [[40908, 40908], "valid"], [[40909, 40917], "valid"], [[40918, 40938], "valid"], [[40939, 40959], "disallowed"], [[40960, 42124], "valid"], [[42125, 42127], "disallowed"], [[42128, 42145], "valid", "", "NV8"], [[42146, 42147], "valid", "", "NV8"], [[42148, 42163], "valid", "", "NV8"], [[42164, 42164], "valid", "", "NV8"], [[42165, 42176], "valid", "", "NV8"], [[42177, 42177], "valid", "", "NV8"], [[42178, 42180], "valid", "", "NV8"], [[42181, 42181], "valid", "", "NV8"], [[42182, 42182], "valid", "", "NV8"], [[42183, 42191], "disallowed"], [[42192, 42237], "valid"], [[42238, 42239], "valid", "", "NV8"], [[42240, 42508], "valid"], [[42509, 42511], "valid", "", "NV8"], [[42512, 42539], "valid"], [[42540, 42559], "disallowed"], [[42560, 42560], "mapped", "\uA641"], [[42561, 42561], "valid"], [[42562, 42562], "mapped", "\uA643"], [[42563, 42563], "valid"], [[42564, 42564], "mapped", "\uA645"], [[42565, 42565], "valid"], [[42566, 42566], "mapped", "\uA647"], [[42567, 42567], "valid"], [[42568, 42568], "mapped", "\uA649"], [[42569, 42569], "valid"], [[42570, 42570], "mapped", "\uA64B"], [[42571, 42571], "valid"], [[42572, 42572], "mapped", "\uA64D"], [[42573, 42573], "valid"], [[42574, 42574], "mapped", "\uA64F"], [[42575, 42575], "valid"], [[42576, 42576], "mapped", "\uA651"], [[42577, 42577], "valid"], [[42578, 42578], "mapped", "\uA653"], [[42579, 42579], "valid"], [[42580, 42580], "mapped", "\uA655"], [[42581, 42581], "valid"], [[42582, 42582], "mapped", "\uA657"], [[42583, 42583], "valid"], [[42584, 42584], "mapped", "\uA659"], [[42585, 42585], "valid"], [[42586, 42586], "mapped", "\uA65B"], [[42587, 42587], "valid"], [[42588, 42588], "mapped", "\uA65D"], [[42589, 42589], "valid"], [[42590, 42590], "mapped", "\uA65F"], [[42591, 42591], "valid"], [[42592, 42592], "mapped", "\uA661"], [[42593, 42593], "valid"], [[42594, 42594], "mapped", "\uA663"], [[42595, 42595], "valid"], [[42596, 42596], "mapped", "\uA665"], [[42597, 42597], "valid"], [[42598, 42598], "mapped", "\uA667"], [[42599, 42599], "valid"], [[42600, 42600], "mapped", "\uA669"], [[42601, 42601], "valid"], [[42602, 42602], "mapped", "\uA66B"], [[42603, 42603], "valid"], [[42604, 42604], "mapped", "\uA66D"], [[42605, 42607], "valid"], [[42608, 42611], "valid", "", "NV8"], [[42612, 42619], "valid"], [[42620, 42621], "valid"], [[42622, 42622], "valid", "", "NV8"], [[42623, 42623], "valid"], [[42624, 42624], "mapped", "\uA681"], [[42625, 42625], "valid"], [[42626, 42626], "mapped", "\uA683"], [[42627, 42627], "valid"], [[42628, 42628], "mapped", "\uA685"], [[42629, 42629], "valid"], [[42630, 42630], "mapped", "\uA687"], [[42631, 42631], "valid"], [[42632, 42632], "mapped", "\uA689"], [[42633, 42633], "valid"], [[42634, 42634], "mapped", "\uA68B"], [[42635, 42635], "valid"], [[42636, 42636], "mapped", "\uA68D"], [[42637, 42637], "valid"], [[42638, 42638], "mapped", "\uA68F"], [[42639, 42639], "valid"], [[42640, 42640], "mapped", "\uA691"], [[42641, 42641], "valid"], [[42642, 42642], "mapped", "\uA693"], [[42643, 42643], "valid"], [[42644, 42644], "mapped", "\uA695"], [[42645, 42645], "valid"], [[42646, 42646], "mapped", "\uA697"], [[42647, 42647], "valid"], [[42648, 42648], "mapped", "\uA699"], [[42649, 42649], "valid"], [[42650, 42650], "mapped", "\uA69B"], [[42651, 42651], "valid"], [[42652, 42652], "mapped", "\u044A"], [[42653, 42653], "mapped", "\u044C"], [[42654, 42654], "valid"], [[42655, 42655], "valid"], [[42656, 42725], "valid"], [[42726, 42735], "valid", "", "NV8"], [[42736, 42737], "valid"], [[42738, 42743], "valid", "", "NV8"], [[42744, 42751], "disallowed"], [[42752, 42774], "valid", "", "NV8"], [[42775, 42778], "valid"], [[42779, 42783], "valid"], [[42784, 42785], "valid", "", "NV8"], [[42786, 42786], "mapped", "\uA723"], [[42787, 42787], "valid"], [[42788, 42788], "mapped", "\uA725"], [[42789, 42789], "valid"], [[42790, 42790], "mapped", "\uA727"], [[42791, 42791], "valid"], [[42792, 42792], "mapped", "\uA729"], [[42793, 42793], "valid"], [[42794, 42794], "mapped", "\uA72B"], [[42795, 42795], "valid"], [[42796, 42796], "mapped", "\uA72D"], [[42797, 42797], "valid"], [[42798, 42798], "mapped", "\uA72F"], [[42799, 42801], "valid"], [[42802, 42802], "mapped", "\uA733"], [[42803, 42803], "valid"], [[42804, 42804], "mapped", "\uA735"], [[42805, 42805], "valid"], [[42806, 42806], "mapped", "\uA737"], [[42807, 42807], "valid"], [[42808, 42808], "mapped", "\uA739"], [[42809, 42809], "valid"], [[42810, 42810], "mapped", "\uA73B"], [[42811, 42811], "valid"], [[42812, 42812], "mapped", "\uA73D"], [[42813, 42813], "valid"], [[42814, 42814], "mapped", "\uA73F"], [[42815, 42815], "valid"], [[42816, 42816], "mapped", "\uA741"], [[42817, 42817], "valid"], [[42818, 42818], "mapped", "\uA743"], [[42819, 42819], "valid"], [[42820, 42820], "mapped", "\uA745"], [[42821, 42821], "valid"], [[42822, 42822], "mapped", "\uA747"], [[42823, 42823], "valid"], [[42824, 42824], "mapped", "\uA749"], [[42825, 42825], "valid"], [[42826, 42826], "mapped", "\uA74B"], [[42827, 42827], "valid"], [[42828, 42828], "mapped", "\uA74D"], [[42829, 42829], "valid"], [[42830, 42830], "mapped", "\uA74F"], [[42831, 42831], "valid"], [[42832, 42832], "mapped", "\uA751"], [[42833, 42833], "valid"], [[42834, 42834], "mapped", "\uA753"], [[42835, 42835], "valid"], [[42836, 42836], "mapped", "\uA755"], [[42837, 42837], "valid"], [[42838, 42838], "mapped", "\uA757"], [[42839, 42839], "valid"], [[42840, 42840], "mapped", "\uA759"], [[42841, 42841], "valid"], [[42842, 42842], "mapped", "\uA75B"], [[42843, 42843], "valid"], [[42844, 42844], "mapped", "\uA75D"], [[42845, 42845], "valid"], [[42846, 42846], "mapped", "\uA75F"], [[42847, 42847], "valid"], [[42848, 42848], "mapped", "\uA761"], [[42849, 42849], "valid"], [[42850, 42850], "mapped", "\uA763"], [[42851, 42851], "valid"], [[42852, 42852], "mapped", "\uA765"], [[42853, 42853], "valid"], [[42854, 42854], "mapped", "\uA767"], [[42855, 42855], "valid"], [[42856, 42856], "mapped", "\uA769"], [[42857, 42857], "valid"], [[42858, 42858], "mapped", "\uA76B"], [[42859, 42859], "valid"], [[42860, 42860], "mapped", "\uA76D"], [[42861, 42861], "valid"], [[42862, 42862], "mapped", "\uA76F"], [[42863, 42863], "valid"], [[42864, 42864], "mapped", "\uA76F"], [[42865, 42872], "valid"], [[42873, 42873], "mapped", "\uA77A"], [[42874, 42874], "valid"], [[42875, 42875], "mapped", "\uA77C"], [[42876, 42876], "valid"], [[42877, 42877], "mapped", "\u1D79"], [[42878, 42878], "mapped", "\uA77F"], [[42879, 42879], "valid"], [[42880, 42880], "mapped", "\uA781"], [[42881, 42881], "valid"], [[42882, 42882], "mapped", "\uA783"], [[42883, 42883], "valid"], [[42884, 42884], "mapped", "\uA785"], [[42885, 42885], "valid"], [[42886, 42886], "mapped", "\uA787"], [[42887, 42888], "valid"], [[42889, 42890], "valid", "", "NV8"], [[42891, 42891], "mapped", "\uA78C"], [[42892, 42892], "valid"], [[42893, 42893], "mapped", "\u0265"], [[42894, 42894], "valid"], [[42895, 42895], "valid"], [[42896, 42896], "mapped", "\uA791"], [[42897, 42897], "valid"], [[42898, 42898], "mapped", "\uA793"], [[42899, 42899], "valid"], [[42900, 42901], "valid"], [[42902, 42902], "mapped", "\uA797"], [[42903, 42903], "valid"], [[42904, 42904], "mapped", "\uA799"], [[42905, 42905], "valid"], [[42906, 42906], "mapped", "\uA79B"], [[42907, 42907], "valid"], [[42908, 42908], "mapped", "\uA79D"], [[42909, 42909], "valid"], [[42910, 42910], "mapped", "\uA79F"], [[42911, 42911], "valid"], [[42912, 42912], "mapped", "\uA7A1"], [[42913, 42913], "valid"], [[42914, 42914], "mapped", "\uA7A3"], [[42915, 42915], "valid"], [[42916, 42916], "mapped", "\uA7A5"], [[42917, 42917], "valid"], [[42918, 42918], "mapped", "\uA7A7"], [[42919, 42919], "valid"], [[42920, 42920], "mapped", "\uA7A9"], [[42921, 42921], "valid"], [[42922, 42922], "mapped", "\u0266"], [[42923, 42923], "mapped", "\u025C"], [[42924, 42924], "mapped", "\u0261"], [[42925, 42925], "mapped", "\u026C"], [[42926, 42926], "mapped", "\u026A"], [[42927, 42927], "disallowed"], [[42928, 42928], "mapped", "\u029E"], [[42929, 42929], "mapped", "\u0287"], [[42930, 42930], "mapped", "\u029D"], [[42931, 42931], "mapped", "\uAB53"], [[42932, 42932], "mapped", "\uA7B5"], [[42933, 42933], "valid"], [[42934, 42934], "mapped", "\uA7B7"], [[42935, 42935], "valid"], [[42936, 42998], "disallowed"], [[42999, 42999], "valid"], [[43e3, 43e3], "mapped", "\u0127"], [[43001, 43001], "mapped", "\u0153"], [[43002, 43002], "valid"], [[43003, 43007], "valid"], [[43008, 43047], "valid"], [[43048, 43051], "valid", "", "NV8"], [[43052, 43055], "disallowed"], [[43056, 43065], "valid", "", "NV8"], [[43066, 43071], "disallowed"], [[43072, 43123], "valid"], [[43124, 43127], "valid", "", "NV8"], [[43128, 43135], "disallowed"], [[43136, 43204], "valid"], [[43205, 43205], "valid"], [[43206, 43213], "disallowed"], [[43214, 43215], "valid", "", "NV8"], [[43216, 43225], "valid"], [[43226, 43231], "disallowed"], [[43232, 43255], "valid"], [[43256, 43258], "valid", "", "NV8"], [[43259, 43259], "valid"], [[43260, 43260], "valid", "", "NV8"], [[43261, 43261], "valid"], [[43262, 43263], "disallowed"], [[43264, 43309], "valid"], [[43310, 43311], "valid", "", "NV8"], [[43312, 43347], "valid"], [[43348, 43358], "disallowed"], [[43359, 43359], "valid", "", "NV8"], [[43360, 43388], "valid", "", "NV8"], [[43389, 43391], "disallowed"], [[43392, 43456], "valid"], [[43457, 43469], "valid", "", "NV8"], [[43470, 43470], "disallowed"], [[43471, 43481], "valid"], [[43482, 43485], "disallowed"], [[43486, 43487], "valid", "", "NV8"], [[43488, 43518], "valid"], [[43519, 43519], "disallowed"], [[43520, 43574], "valid"], [[43575, 43583], "disallowed"], [[43584, 43597], "valid"], [[43598, 43599], "disallowed"], [[43600, 43609], "valid"], [[43610, 43611], "disallowed"], [[43612, 43615], "valid", "", "NV8"], [[43616, 43638], "valid"], [[43639, 43641], "valid", "", "NV8"], [[43642, 43643], "valid"], [[43644, 43647], "valid"], [[43648, 43714], "valid"], [[43715, 43738], "disallowed"], [[43739, 43741], "valid"], [[43742, 43743], "valid", "", "NV8"], [[43744, 43759], "valid"], [[43760, 43761], "valid", "", "NV8"], [[43762, 43766], "valid"], [[43767, 43776], "disallowed"], [[43777, 43782], "valid"], [[43783, 43784], "disallowed"], [[43785, 43790], "valid"], [[43791, 43792], "disallowed"], [[43793, 43798], "valid"], [[43799, 43807], "disallowed"], [[43808, 43814], "valid"], [[43815, 43815], "disallowed"], [[43816, 43822], "valid"], [[43823, 43823], "disallowed"], [[43824, 43866], "valid"], [[43867, 43867], "valid", "", "NV8"], [[43868, 43868], "mapped", "\uA727"], [[43869, 43869], "mapped", "\uAB37"], [[43870, 43870], "mapped", "\u026B"], [[43871, 43871], "mapped", "\uAB52"], [[43872, 43875], "valid"], [[43876, 43877], "valid"], [[43878, 43887], "disallowed"], [[43888, 43888], "mapped", "\u13A0"], [[43889, 43889], "mapped", "\u13A1"], [[43890, 43890], "mapped", "\u13A2"], [[43891, 43891], "mapped", "\u13A3"], [[43892, 43892], "mapped", "\u13A4"], [[43893, 43893], "mapped", "\u13A5"], [[43894, 43894], "mapped", "\u13A6"], [[43895, 43895], "mapped", "\u13A7"], [[43896, 43896], "mapped", "\u13A8"], [[43897, 43897], "mapped", "\u13A9"], [[43898, 43898], "mapped", "\u13AA"], [[43899, 43899], "mapped", "\u13AB"], [[43900, 43900], "mapped", "\u13AC"], [[43901, 43901], "mapped", "\u13AD"], [[43902, 43902], "mapped", "\u13AE"], [[43903, 43903], "mapped", "\u13AF"], [[43904, 43904], "mapped", "\u13B0"], [[43905, 43905], "mapped", "\u13B1"], [[43906, 43906], "mapped", "\u13B2"], [[43907, 43907], "mapped", "\u13B3"], [[43908, 43908], "mapped", "\u13B4"], [[43909, 43909], "mapped", "\u13B5"], [[43910, 43910], "mapped", "\u13B6"], [[43911, 43911], "mapped", "\u13B7"], [[43912, 43912], "mapped", "\u13B8"], [[43913, 43913], "mapped", "\u13B9"], [[43914, 43914], "mapped", "\u13BA"], [[43915, 43915], "mapped", "\u13BB"], [[43916, 43916], "mapped", "\u13BC"], [[43917, 43917], "mapped", "\u13BD"], [[43918, 43918], "mapped", "\u13BE"], [[43919, 43919], "mapped", "\u13BF"], [[43920, 43920], "mapped", "\u13C0"], [[43921, 43921], "mapped", "\u13C1"], [[43922, 43922], "mapped", "\u13C2"], [[43923, 43923], "mapped", "\u13C3"], [[43924, 43924], "mapped", "\u13C4"], [[43925, 43925], "mapped", "\u13C5"], [[43926, 43926], "mapped", "\u13C6"], [[43927, 43927], "mapped", "\u13C7"], [[43928, 43928], "mapped", "\u13C8"], [[43929, 43929], "mapped", "\u13C9"], [[43930, 43930], "mapped", "\u13CA"], [[43931, 43931], "mapped", "\u13CB"], [[43932, 43932], "mapped", "\u13CC"], [[43933, 43933], "mapped", "\u13CD"], [[43934, 43934], "mapped", "\u13CE"], [[43935, 43935], "mapped", "\u13CF"], [[43936, 43936], "mapped", "\u13D0"], [[43937, 43937], "mapped", "\u13D1"], [[43938, 43938], "mapped", "\u13D2"], [[43939, 43939], "mapped", "\u13D3"], [[43940, 43940], "mapped", "\u13D4"], [[43941, 43941], "mapped", "\u13D5"], [[43942, 43942], "mapped", "\u13D6"], [[43943, 43943], "mapped", "\u13D7"], [[43944, 43944], "mapped", "\u13D8"], [[43945, 43945], "mapped", "\u13D9"], [[43946, 43946], "mapped", "\u13DA"], [[43947, 43947], "mapped", "\u13DB"], [[43948, 43948], "mapped", "\u13DC"], [[43949, 43949], "mapped", "\u13DD"], [[43950, 43950], "mapped", "\u13DE"], [[43951, 43951], "mapped", "\u13DF"], [[43952, 43952], "mapped", "\u13E0"], [[43953, 43953], "mapped", "\u13E1"], [[43954, 43954], "mapped", "\u13E2"], [[43955, 43955], "mapped", "\u13E3"], [[43956, 43956], "mapped", "\u13E4"], [[43957, 43957], "mapped", "\u13E5"], [[43958, 43958], "mapped", "\u13E6"], [[43959, 43959], "mapped", "\u13E7"], [[43960, 43960], "mapped", "\u13E8"], [[43961, 43961], "mapped", "\u13E9"], [[43962, 43962], "mapped", "\u13EA"], [[43963, 43963], "mapped", "\u13EB"], [[43964, 43964], "mapped", "\u13EC"], [[43965, 43965], "mapped", "\u13ED"], [[43966, 43966], "mapped", "\u13EE"], [[43967, 43967], "mapped", "\u13EF"], [[43968, 44010], "valid"], [[44011, 44011], "valid", "", "NV8"], [[44012, 44013], "valid"], [[44014, 44015], "disallowed"], [[44016, 44025], "valid"], [[44026, 44031], "disallowed"], [[44032, 55203], "valid"], [[55204, 55215], "disallowed"], [[55216, 55238], "valid", "", "NV8"], [[55239, 55242], "disallowed"], [[55243, 55291], "valid", "", "NV8"], [[55292, 55295], "disallowed"], [[55296, 57343], "disallowed"], [[57344, 63743], "disallowed"], [[63744, 63744], "mapped", "\u8C48"], [[63745, 63745], "mapped", "\u66F4"], [[63746, 63746], "mapped", "\u8ECA"], [[63747, 63747], "mapped", "\u8CC8"], [[63748, 63748], "mapped", "\u6ED1"], [[63749, 63749], "mapped", "\u4E32"], [[63750, 63750], "mapped", "\u53E5"], [[63751, 63752], "mapped", "\u9F9C"], [[63753, 63753], "mapped", "\u5951"], [[63754, 63754], "mapped", "\u91D1"], [[63755, 63755], "mapped", "\u5587"], [[63756, 63756], "mapped", "\u5948"], [[63757, 63757], "mapped", "\u61F6"], [[63758, 63758], "mapped", "\u7669"], [[63759, 63759], "mapped", "\u7F85"], [[63760, 63760], "mapped", "\u863F"], [[63761, 63761], "mapped", "\u87BA"], [[63762, 63762], "mapped", "\u88F8"], [[63763, 63763], "mapped", "\u908F"], [[63764, 63764], "mapped", "\u6A02"], [[63765, 63765], "mapped", "\u6D1B"], [[63766, 63766], "mapped", "\u70D9"], [[63767, 63767], "mapped", "\u73DE"], [[63768, 63768], "mapped", "\u843D"], [[63769, 63769], "mapped", "\u916A"], [[63770, 63770], "mapped", "\u99F1"], [[63771, 63771], "mapped", "\u4E82"], [[63772, 63772], "mapped", "\u5375"], [[63773, 63773], "mapped", "\u6B04"], [[63774, 63774], "mapped", "\u721B"], [[63775, 63775], "mapped", "\u862D"], [[63776, 63776], "mapped", "\u9E1E"], [[63777, 63777], "mapped", "\u5D50"], [[63778, 63778], "mapped", "\u6FEB"], [[63779, 63779], "mapped", "\u85CD"], [[63780, 63780], "mapped", "\u8964"], [[63781, 63781], "mapped", "\u62C9"], [[63782, 63782], "mapped", "\u81D8"], [[63783, 63783], "mapped", "\u881F"], [[63784, 63784], "mapped", "\u5ECA"], [[63785, 63785], "mapped", "\u6717"], [[63786, 63786], "mapped", "\u6D6A"], [[63787, 63787], "mapped", "\u72FC"], [[63788, 63788], "mapped", "\u90CE"], [[63789, 63789], "mapped", "\u4F86"], [[63790, 63790], "mapped", "\u51B7"], [[63791, 63791], "mapped", "\u52DE"], [[63792, 63792], "mapped", "\u64C4"], [[63793, 63793], "mapped", "\u6AD3"], [[63794, 63794], "mapped", "\u7210"], [[63795, 63795], "mapped", "\u76E7"], [[63796, 63796], "mapped", "\u8001"], [[63797, 63797], "mapped", "\u8606"], [[63798, 63798], "mapped", "\u865C"], [[63799, 63799], "mapped", "\u8DEF"], [[63800, 63800], "mapped", "\u9732"], [[63801, 63801], "mapped", "\u9B6F"], [[63802, 63802], "mapped", "\u9DFA"], [[63803, 63803], "mapped", "\u788C"], [[63804, 63804], "mapped", "\u797F"], [[63805, 63805], "mapped", "\u7DA0"], [[63806, 63806], "mapped", "\u83C9"], [[63807, 63807], "mapped", "\u9304"], [[63808, 63808], "mapped", "\u9E7F"], [[63809, 63809], "mapped", "\u8AD6"], [[63810, 63810], "mapped", "\u58DF"], [[63811, 63811], "mapped", "\u5F04"], [[63812, 63812], "mapped", "\u7C60"], [[63813, 63813], "mapped", "\u807E"], [[63814, 63814], "mapped", "\u7262"], [[63815, 63815], "mapped", "\u78CA"], [[63816, 63816], "mapped", "\u8CC2"], [[63817, 63817], "mapped", "\u96F7"], [[63818, 63818], "mapped", "\u58D8"], [[63819, 63819], "mapped", "\u5C62"], [[63820, 63820], "mapped", "\u6A13"], [[63821, 63821], "mapped", "\u6DDA"], [[63822, 63822], "mapped", "\u6F0F"], [[63823, 63823], "mapped", "\u7D2F"], [[63824, 63824], "mapped", "\u7E37"], [[63825, 63825], "mapped", "\u964B"], [[63826, 63826], "mapped", "\u52D2"], [[63827, 63827], "mapped", "\u808B"], [[63828, 63828], "mapped", "\u51DC"], [[63829, 63829], "mapped", "\u51CC"], [[63830, 63830], "mapped", "\u7A1C"], [[63831, 63831], "mapped", "\u7DBE"], [[63832, 63832], "mapped", "\u83F1"], [[63833, 63833], "mapped", "\u9675"], [[63834, 63834], "mapped", "\u8B80"], [[63835, 63835], "mapped", "\u62CF"], [[63836, 63836], "mapped", "\u6A02"], [[63837, 63837], "mapped", "\u8AFE"], [[63838, 63838], "mapped", "\u4E39"], [[63839, 63839], "mapped", "\u5BE7"], [[63840, 63840], "mapped", "\u6012"], [[63841, 63841], "mapped", "\u7387"], [[63842, 63842], "mapped", "\u7570"], [[63843, 63843], "mapped", "\u5317"], [[63844, 63844], "mapped", "\u78FB"], [[63845, 63845], "mapped", "\u4FBF"], [[63846, 63846], "mapped", "\u5FA9"], [[63847, 63847], "mapped", "\u4E0D"], [[63848, 63848], "mapped", "\u6CCC"], [[63849, 63849], "mapped", "\u6578"], [[63850, 63850], "mapped", "\u7D22"], [[63851, 63851], "mapped", "\u53C3"], [[63852, 63852], "mapped", "\u585E"], [[63853, 63853], "mapped", "\u7701"], [[63854, 63854], "mapped", "\u8449"], [[63855, 63855], "mapped", "\u8AAA"], [[63856, 63856], "mapped", "\u6BBA"], [[63857, 63857], "mapped", "\u8FB0"], [[63858, 63858], "mapped", "\u6C88"], [[63859, 63859], "mapped", "\u62FE"], [[63860, 63860], "mapped", "\u82E5"], [[63861, 63861], "mapped", "\u63A0"], [[63862, 63862], "mapped", "\u7565"], [[63863, 63863], "mapped", "\u4EAE"], [[63864, 63864], "mapped", "\u5169"], [[63865, 63865], "mapped", "\u51C9"], [[63866, 63866], "mapped", "\u6881"], [[63867, 63867], "mapped", "\u7CE7"], [[63868, 63868], "mapped", "\u826F"], [[63869, 63869], "mapped", "\u8AD2"], [[63870, 63870], "mapped", "\u91CF"], [[63871, 63871], "mapped", "\u52F5"], [[63872, 63872], "mapped", "\u5442"], [[63873, 63873], "mapped", "\u5973"], [[63874, 63874], "mapped", "\u5EEC"], [[63875, 63875], "mapped", "\u65C5"], [[63876, 63876], "mapped", "\u6FFE"], [[63877, 63877], "mapped", "\u792A"], [[63878, 63878], "mapped", "\u95AD"], [[63879, 63879], "mapped", "\u9A6A"], [[63880, 63880], "mapped", "\u9E97"], [[63881, 63881], "mapped", "\u9ECE"], [[63882, 63882], "mapped", "\u529B"], [[63883, 63883], "mapped", "\u66C6"], [[63884, 63884], "mapped", "\u6B77"], [[63885, 63885], "mapped", "\u8F62"], [[63886, 63886], "mapped", "\u5E74"], [[63887, 63887], "mapped", "\u6190"], [[63888, 63888], "mapped", "\u6200"], [[63889, 63889], "mapped", "\u649A"], [[63890, 63890], "mapped", "\u6F23"], [[63891, 63891], "mapped", "\u7149"], [[63892, 63892], "mapped", "\u7489"], [[63893, 63893], "mapped", "\u79CA"], [[63894, 63894], "mapped", "\u7DF4"], [[63895, 63895], "mapped", "\u806F"], [[63896, 63896], "mapped", "\u8F26"], [[63897, 63897], "mapped", "\u84EE"], [[63898, 63898], "mapped", "\u9023"], [[63899, 63899], "mapped", "\u934A"], [[63900, 63900], "mapped", "\u5217"], [[63901, 63901], "mapped", "\u52A3"], [[63902, 63902], "mapped", "\u54BD"], [[63903, 63903], "mapped", "\u70C8"], [[63904, 63904], "mapped", "\u88C2"], [[63905, 63905], "mapped", "\u8AAA"], [[63906, 63906], "mapped", "\u5EC9"], [[63907, 63907], "mapped", "\u5FF5"], [[63908, 63908], "mapped", "\u637B"], [[63909, 63909], "mapped", "\u6BAE"], [[63910, 63910], "mapped", "\u7C3E"], [[63911, 63911], "mapped", "\u7375"], [[63912, 63912], "mapped", "\u4EE4"], [[63913, 63913], "mapped", "\u56F9"], [[63914, 63914], "mapped", "\u5BE7"], [[63915, 63915], "mapped", "\u5DBA"], [[63916, 63916], "mapped", "\u601C"], [[63917, 63917], "mapped", "\u73B2"], [[63918, 63918], "mapped", "\u7469"], [[63919, 63919], "mapped", "\u7F9A"], [[63920, 63920], "mapped", "\u8046"], [[63921, 63921], "mapped", "\u9234"], [[63922, 63922], "mapped", "\u96F6"], [[63923, 63923], "mapped", "\u9748"], [[63924, 63924], "mapped", "\u9818"], [[63925, 63925], "mapped", "\u4F8B"], [[63926, 63926], "mapped", "\u79AE"], [[63927, 63927], "mapped", "\u91B4"], [[63928, 63928], "mapped", "\u96B8"], [[63929, 63929], "mapped", "\u60E1"], [[63930, 63930], "mapped", "\u4E86"], [[63931, 63931], "mapped", "\u50DA"], [[63932, 63932], "mapped", "\u5BEE"], [[63933, 63933], "mapped", "\u5C3F"], [[63934, 63934], "mapped", "\u6599"], [[63935, 63935], "mapped", "\u6A02"], [[63936, 63936], "mapped", "\u71CE"], [[63937, 63937], "mapped", "\u7642"], [[63938, 63938], "mapped", "\u84FC"], [[63939, 63939], "mapped", "\u907C"], [[63940, 63940], "mapped", "\u9F8D"], [[63941, 63941], "mapped", "\u6688"], [[63942, 63942], "mapped", "\u962E"], [[63943, 63943], "mapped", "\u5289"], [[63944, 63944], "mapped", "\u677B"], [[63945, 63945], "mapped", "\u67F3"], [[63946, 63946], "mapped", "\u6D41"], [[63947, 63947], "mapped", "\u6E9C"], [[63948, 63948], "mapped", "\u7409"], [[63949, 63949], "mapped", "\u7559"], [[63950, 63950], "mapped", "\u786B"], [[63951, 63951], "mapped", "\u7D10"], [[63952, 63952], "mapped", "\u985E"], [[63953, 63953], "mapped", "\u516D"], [[63954, 63954], "mapped", "\u622E"], [[63955, 63955], "mapped", "\u9678"], [[63956, 63956], "mapped", "\u502B"], [[63957, 63957], "mapped", "\u5D19"], [[63958, 63958], "mapped", "\u6DEA"], [[63959, 63959], "mapped", "\u8F2A"], [[63960, 63960], "mapped", "\u5F8B"], [[63961, 63961], "mapped", "\u6144"], [[63962, 63962], "mapped", "\u6817"], [[63963, 63963], "mapped", "\u7387"], [[63964, 63964], "mapped", "\u9686"], [[63965, 63965], "mapped", "\u5229"], [[63966, 63966], "mapped", "\u540F"], [[63967, 63967], "mapped", "\u5C65"], [[63968, 63968], "mapped", "\u6613"], [[63969, 63969], "mapped", "\u674E"], [[63970, 63970], "mapped", "\u68A8"], [[63971, 63971], "mapped", "\u6CE5"], [[63972, 63972], "mapped", "\u7406"], [[63973, 63973], "mapped", "\u75E2"], [[63974, 63974], "mapped", "\u7F79"], [[63975, 63975], "mapped", "\u88CF"], [[63976, 63976], "mapped", "\u88E1"], [[63977, 63977], "mapped", "\u91CC"], [[63978, 63978], "mapped", "\u96E2"], [[63979, 63979], "mapped", "\u533F"], [[63980, 63980], "mapped", "\u6EBA"], [[63981, 63981], "mapped", "\u541D"], [[63982, 63982], "mapped", "\u71D0"], [[63983, 63983], "mapped", "\u7498"], [[63984, 63984], "mapped", "\u85FA"], [[63985, 63985], "mapped", "\u96A3"], [[63986, 63986], "mapped", "\u9C57"], [[63987, 63987], "mapped", "\u9E9F"], [[63988, 63988], "mapped", "\u6797"], [[63989, 63989], "mapped", "\u6DCB"], [[63990, 63990], "mapped", "\u81E8"], [[63991, 63991], "mapped", "\u7ACB"], [[63992, 63992], "mapped", "\u7B20"], [[63993, 63993], "mapped", "\u7C92"], [[63994, 63994], "mapped", "\u72C0"], [[63995, 63995], "mapped", "\u7099"], [[63996, 63996], "mapped", "\u8B58"], [[63997, 63997], "mapped", "\u4EC0"], [[63998, 63998], "mapped", "\u8336"], [[63999, 63999], "mapped", "\u523A"], [[64e3, 64e3], "mapped", "\u5207"], [[64001, 64001], "mapped", "\u5EA6"], [[64002, 64002], "mapped", "\u62D3"], [[64003, 64003], "mapped", "\u7CD6"], [[64004, 64004], "mapped", "\u5B85"], [[64005, 64005], "mapped", "\u6D1E"], [[64006, 64006], "mapped", "\u66B4"], [[64007, 64007], "mapped", "\u8F3B"], [[64008, 64008], "mapped", "\u884C"], [[64009, 64009], "mapped", "\u964D"], [[64010, 64010], "mapped", "\u898B"], [[64011, 64011], "mapped", "\u5ED3"], [[64012, 64012], "mapped", "\u5140"], [[64013, 64013], "mapped", "\u55C0"], [[64014, 64015], "valid"], [[64016, 64016], "mapped", "\u585A"], [[64017, 64017], "valid"], [[64018, 64018], "mapped", "\u6674"], [[64019, 64020], "valid"], [[64021, 64021], "mapped", "\u51DE"], [[64022, 64022], "mapped", "\u732A"], [[64023, 64023], "mapped", "\u76CA"], [[64024, 64024], "mapped", "\u793C"], [[64025, 64025], "mapped", "\u795E"], [[64026, 64026], "mapped", "\u7965"], [[64027, 64027], "mapped", "\u798F"], [[64028, 64028], "mapped", "\u9756"], [[64029, 64029], "mapped", "\u7CBE"], [[64030, 64030], "mapped", "\u7FBD"], [[64031, 64031], "valid"], [[64032, 64032], "mapped", "\u8612"], [[64033, 64033], "valid"], [[64034, 64034], "mapped", "\u8AF8"], [[64035, 64036], "valid"], [[64037, 64037], "mapped", "\u9038"], [[64038, 64038], "mapped", "\u90FD"], [[64039, 64041], "valid"], [[64042, 64042], "mapped", "\u98EF"], [[64043, 64043], "mapped", "\u98FC"], [[64044, 64044], "mapped", "\u9928"], [[64045, 64045], "mapped", "\u9DB4"], [[64046, 64046], "mapped", "\u90DE"], [[64047, 64047], "mapped", "\u96B7"], [[64048, 64048], "mapped", "\u4FAE"], [[64049, 64049], "mapped", "\u50E7"], [[64050, 64050], "mapped", "\u514D"], [[64051, 64051], "mapped", "\u52C9"], [[64052, 64052], "mapped", "\u52E4"], [[64053, 64053], "mapped", "\u5351"], [[64054, 64054], "mapped", "\u559D"], [[64055, 64055], "mapped", "\u5606"], [[64056, 64056], "mapped", "\u5668"], [[64057, 64057], "mapped", "\u5840"], [[64058, 64058], "mapped", "\u58A8"], [[64059, 64059], "mapped", "\u5C64"], [[64060, 64060], "mapped", "\u5C6E"], [[64061, 64061], "mapped", "\u6094"], [[64062, 64062], "mapped", "\u6168"], [[64063, 64063], "mapped", "\u618E"], [[64064, 64064], "mapped", "\u61F2"], [[64065, 64065], "mapped", "\u654F"], [[64066, 64066], "mapped", "\u65E2"], [[64067, 64067], "mapped", "\u6691"], [[64068, 64068], "mapped", "\u6885"], [[64069, 64069], "mapped", "\u6D77"], [[64070, 64070], "mapped", "\u6E1A"], [[64071, 64071], "mapped", "\u6F22"], [[64072, 64072], "mapped", "\u716E"], [[64073, 64073], "mapped", "\u722B"], [[64074, 64074], "mapped", "\u7422"], [[64075, 64075], "mapped", "\u7891"], [[64076, 64076], "mapped", "\u793E"], [[64077, 64077], "mapped", "\u7949"], [[64078, 64078], "mapped", "\u7948"], [[64079, 64079], "mapped", "\u7950"], [[64080, 64080], "mapped", "\u7956"], [[64081, 64081], "mapped", "\u795D"], [[64082, 64082], "mapped", "\u798D"], [[64083, 64083], "mapped", "\u798E"], [[64084, 64084], "mapped", "\u7A40"], [[64085, 64085], "mapped", "\u7A81"], [[64086, 64086], "mapped", "\u7BC0"], [[64087, 64087], "mapped", "\u7DF4"], [[64088, 64088], "mapped", "\u7E09"], [[64089, 64089], "mapped", "\u7E41"], [[64090, 64090], "mapped", "\u7F72"], [[64091, 64091], "mapped", "\u8005"], [[64092, 64092], "mapped", "\u81ED"], [[64093, 64094], "mapped", "\u8279"], [[64095, 64095], "mapped", "\u8457"], [[64096, 64096], "mapped", "\u8910"], [[64097, 64097], "mapped", "\u8996"], [[64098, 64098], "mapped", "\u8B01"], [[64099, 64099], "mapped", "\u8B39"], [[64100, 64100], "mapped", "\u8CD3"], [[64101, 64101], "mapped", "\u8D08"], [[64102, 64102], "mapped", "\u8FB6"], [[64103, 64103], "mapped", "\u9038"], [[64104, 64104], "mapped", "\u96E3"], [[64105, 64105], "mapped", "\u97FF"], [[64106, 64106], "mapped", "\u983B"], [[64107, 64107], "mapped", "\u6075"], [[64108, 64108], "mapped", "\u{242EE}"], [[64109, 64109], "mapped", "\u8218"], [[64110, 64111], "disallowed"], [[64112, 64112], "mapped", "\u4E26"], [[64113, 64113], "mapped", "\u51B5"], [[64114, 64114], "mapped", "\u5168"], [[64115, 64115], "mapped", "\u4F80"], [[64116, 64116], "mapped", "\u5145"], [[64117, 64117], "mapped", "\u5180"], [[64118, 64118], "mapped", "\u52C7"], [[64119, 64119], "mapped", "\u52FA"], [[64120, 64120], "mapped", "\u559D"], [[64121, 64121], "mapped", "\u5555"], [[64122, 64122], "mapped", "\u5599"], [[64123, 64123], "mapped", "\u55E2"], [[64124, 64124], "mapped", "\u585A"], [[64125, 64125], "mapped", "\u58B3"], [[64126, 64126], "mapped", "\u5944"], [[64127, 64127], "mapped", "\u5954"], [[64128, 64128], "mapped", "\u5A62"], [[64129, 64129], "mapped", "\u5B28"], [[64130, 64130], "mapped", "\u5ED2"], [[64131, 64131], "mapped", "\u5ED9"], [[64132, 64132], "mapped", "\u5F69"], [[64133, 64133], "mapped", "\u5FAD"], [[64134, 64134], "mapped", "\u60D8"], [[64135, 64135], "mapped", "\u614E"], [[64136, 64136], "mapped", "\u6108"], [[64137, 64137], "mapped", "\u618E"], [[64138, 64138], "mapped", "\u6160"], [[64139, 64139], "mapped", "\u61F2"], [[64140, 64140], "mapped", "\u6234"], [[64141, 64141], "mapped", "\u63C4"], [[64142, 64142], "mapped", "\u641C"], [[64143, 64143], "mapped", "\u6452"], [[64144, 64144], "mapped", "\u6556"], [[64145, 64145], "mapped", "\u6674"], [[64146, 64146], "mapped", "\u6717"], [[64147, 64147], "mapped", "\u671B"], [[64148, 64148], "mapped", "\u6756"], [[64149, 64149], "mapped", "\u6B79"], [[64150, 64150], "mapped", "\u6BBA"], [[64151, 64151], "mapped", "\u6D41"], [[64152, 64152], "mapped", "\u6EDB"], [[64153, 64153], "mapped", "\u6ECB"], [[64154, 64154], "mapped", "\u6F22"], [[64155, 64155], "mapped", "\u701E"], [[64156, 64156], "mapped", "\u716E"], [[64157, 64157], "mapped", "\u77A7"], [[64158, 64158], "mapped", "\u7235"], [[64159, 64159], "mapped", "\u72AF"], [[64160, 64160], "mapped", "\u732A"], [[64161, 64161], "mapped", "\u7471"], [[64162, 64162], "mapped", "\u7506"], [[64163, 64163], "mapped", "\u753B"], [[64164, 64164], "mapped", "\u761D"], [[64165, 64165], "mapped", "\u761F"], [[64166, 64166], "mapped", "\u76CA"], [[64167, 64167], "mapped", "\u76DB"], [[64168, 64168], "mapped", "\u76F4"], [[64169, 64169], "mapped", "\u774A"], [[64170, 64170], "mapped", "\u7740"], [[64171, 64171], "mapped", "\u78CC"], [[64172, 64172], "mapped", "\u7AB1"], [[64173, 64173], "mapped", "\u7BC0"], [[64174, 64174], "mapped", "\u7C7B"], [[64175, 64175], "mapped", "\u7D5B"], [[64176, 64176], "mapped", "\u7DF4"], [[64177, 64177], "mapped", "\u7F3E"], [[64178, 64178], "mapped", "\u8005"], [[64179, 64179], "mapped", "\u8352"], [[64180, 64180], "mapped", "\u83EF"], [[64181, 64181], "mapped", "\u8779"], [[64182, 64182], "mapped", "\u8941"], [[64183, 64183], "mapped", "\u8986"], [[64184, 64184], "mapped", "\u8996"], [[64185, 64185], "mapped", "\u8ABF"], [[64186, 64186], "mapped", "\u8AF8"], [[64187, 64187], "mapped", "\u8ACB"], [[64188, 64188], "mapped", "\u8B01"], [[64189, 64189], "mapped", "\u8AFE"], [[64190, 64190], "mapped", "\u8AED"], [[64191, 64191], "mapped", "\u8B39"], [[64192, 64192], "mapped", "\u8B8A"], [[64193, 64193], "mapped", "\u8D08"], [[64194, 64194], "mapped", "\u8F38"], [[64195, 64195], "mapped", "\u9072"], [[64196, 64196], "mapped", "\u9199"], [[64197, 64197], "mapped", "\u9276"], [[64198, 64198], "mapped", "\u967C"], [[64199, 64199], "mapped", "\u96E3"], [[64200, 64200], "mapped", "\u9756"], [[64201, 64201], "mapped", "\u97DB"], [[64202, 64202], "mapped", "\u97FF"], [[64203, 64203], "mapped", "\u980B"], [[64204, 64204], "mapped", "\u983B"], [[64205, 64205], "mapped", "\u9B12"], [[64206, 64206], "mapped", "\u9F9C"], [[64207, 64207], "mapped", "\u{2284A}"], [[64208, 64208], "mapped", "\u{22844}"], [[64209, 64209], "mapped", "\u{233D5}"], [[64210, 64210], "mapped", "\u3B9D"], [[64211, 64211], "mapped", "\u4018"], [[64212, 64212], "mapped", "\u4039"], [[64213, 64213], "mapped", "\u{25249}"], [[64214, 64214], "mapped", "\u{25CD0}"], [[64215, 64215], "mapped", "\u{27ED3}"], [[64216, 64216], "mapped", "\u9F43"], [[64217, 64217], "mapped", "\u9F8E"], [[64218, 64255], "disallowed"], [[64256, 64256], "mapped", "ff"], [[64257, 64257], "mapped", "fi"], [[64258, 64258], "mapped", "fl"], [[64259, 64259], "mapped", "ffi"], [[64260, 64260], "mapped", "ffl"], [[64261, 64262], "mapped", "st"], [[64263, 64274], "disallowed"], [[64275, 64275], "mapped", "\u0574\u0576"], [[64276, 64276], "mapped", "\u0574\u0565"], [[64277, 64277], "mapped", "\u0574\u056B"], [[64278, 64278], "mapped", "\u057E\u0576"], [[64279, 64279], "mapped", "\u0574\u056D"], [[64280, 64284], "disallowed"], [[64285, 64285], "mapped", "\u05D9\u05B4"], [[64286, 64286], "valid"], [[64287, 64287], "mapped", "\u05F2\u05B7"], [[64288, 64288], "mapped", "\u05E2"], [[64289, 64289], "mapped", "\u05D0"], [[64290, 64290], "mapped", "\u05D3"], [[64291, 64291], "mapped", "\u05D4"], [[64292, 64292], "mapped", "\u05DB"], [[64293, 64293], "mapped", "\u05DC"], [[64294, 64294], "mapped", "\u05DD"], [[64295, 64295], "mapped", "\u05E8"], [[64296, 64296], "mapped", "\u05EA"], [[64297, 64297], "disallowed_STD3_mapped", "+"], [[64298, 64298], "mapped", "\u05E9\u05C1"], [[64299, 64299], "mapped", "\u05E9\u05C2"], [[64300, 64300], "mapped", "\u05E9\u05BC\u05C1"], [[64301, 64301], "mapped", "\u05E9\u05BC\u05C2"], [[64302, 64302], "mapped", "\u05D0\u05B7"], [[64303, 64303], "mapped", "\u05D0\u05B8"], [[64304, 64304], "mapped", "\u05D0\u05BC"], [[64305, 64305], "mapped", "\u05D1\u05BC"], [[64306, 64306], "mapped", "\u05D2\u05BC"], [[64307, 64307], "mapped", "\u05D3\u05BC"], [[64308, 64308], "mapped", "\u05D4\u05BC"], [[64309, 64309], "mapped", "\u05D5\u05BC"], [[64310, 64310], "mapped", "\u05D6\u05BC"], [[64311, 64311], "disallowed"], [[64312, 64312], "mapped", "\u05D8\u05BC"], [[64313, 64313], "mapped", "\u05D9\u05BC"], [[64314, 64314], "mapped", "\u05DA\u05BC"], [[64315, 64315], "mapped", "\u05DB\u05BC"], [[64316, 64316], "mapped", "\u05DC\u05BC"], [[64317, 64317], "disallowed"], [[64318, 64318], "mapped", "\u05DE\u05BC"], [[64319, 64319], "disallowed"], [[64320, 64320], "mapped", "\u05E0\u05BC"], [[64321, 64321], "mapped", "\u05E1\u05BC"], [[64322, 64322], "disallowed"], [[64323, 64323], "mapped", "\u05E3\u05BC"], [[64324, 64324], "mapped", "\u05E4\u05BC"], [[64325, 64325], "disallowed"], [[64326, 64326], "mapped", "\u05E6\u05BC"], [[64327, 64327], "mapped", "\u05E7\u05BC"], [[64328, 64328], "mapped", "\u05E8\u05BC"], [[64329, 64329], "mapped", "\u05E9\u05BC"], [[64330, 64330], "mapped", "\u05EA\u05BC"], [[64331, 64331], "mapped", "\u05D5\u05B9"], [[64332, 64332], "mapped", "\u05D1\u05BF"], [[64333, 64333], "mapped", "\u05DB\u05BF"], [[64334, 64334], "mapped", "\u05E4\u05BF"], [[64335, 64335], "mapped", "\u05D0\u05DC"], [[64336, 64337], "mapped", "\u0671"], [[64338, 64341], "mapped", "\u067B"], [[64342, 64345], "mapped", "\u067E"], [[64346, 64349], "mapped", "\u0680"], [[64350, 64353], "mapped", "\u067A"], [[64354, 64357], "mapped", "\u067F"], [[64358, 64361], "mapped", "\u0679"], [[64362, 64365], "mapped", "\u06A4"], [[64366, 64369], "mapped", "\u06A6"], [[64370, 64373], "mapped", "\u0684"], [[64374, 64377], "mapped", "\u0683"], [[64378, 64381], "mapped", "\u0686"], [[64382, 64385], "mapped", "\u0687"], [[64386, 64387], "mapped", "\u068D"], [[64388, 64389], "mapped", "\u068C"], [[64390, 64391], "mapped", "\u068E"], [[64392, 64393], "mapped", "\u0688"], [[64394, 64395], "mapped", "\u0698"], [[64396, 64397], "mapped", "\u0691"], [[64398, 64401], "mapped", "\u06A9"], [[64402, 64405], "mapped", "\u06AF"], [[64406, 64409], "mapped", "\u06B3"], [[64410, 64413], "mapped", "\u06B1"], [[64414, 64415], "mapped", "\u06BA"], [[64416, 64419], "mapped", "\u06BB"], [[64420, 64421], "mapped", "\u06C0"], [[64422, 64425], "mapped", "\u06C1"], [[64426, 64429], "mapped", "\u06BE"], [[64430, 64431], "mapped", "\u06D2"], [[64432, 64433], "mapped", "\u06D3"], [[64434, 64449], "valid", "", "NV8"], [[64450, 64466], "disallowed"], [[64467, 64470], "mapped", "\u06AD"], [[64471, 64472], "mapped", "\u06C7"], [[64473, 64474], "mapped", "\u06C6"], [[64475, 64476], "mapped", "\u06C8"], [[64477, 64477], "mapped", "\u06C7\u0674"], [[64478, 64479], "mapped", "\u06CB"], [[64480, 64481], "mapped", "\u06C5"], [[64482, 64483], "mapped", "\u06C9"], [[64484, 64487], "mapped", "\u06D0"], [[64488, 64489], "mapped", "\u0649"], [[64490, 64491], "mapped", "\u0626\u0627"], [[64492, 64493], "mapped", "\u0626\u06D5"], [[64494, 64495], "mapped", "\u0626\u0648"], [[64496, 64497], "mapped", "\u0626\u06C7"], [[64498, 64499], "mapped", "\u0626\u06C6"], [[64500, 64501], "mapped", "\u0626\u06C8"], [[64502, 64504], "mapped", "\u0626\u06D0"], [[64505, 64507], "mapped", "\u0626\u0649"], [[64508, 64511], "mapped", "\u06CC"], [[64512, 64512], "mapped", "\u0626\u062C"], [[64513, 64513], "mapped", "\u0626\u062D"], [[64514, 64514], "mapped", "\u0626\u0645"], [[64515, 64515], "mapped", "\u0626\u0649"], [[64516, 64516], "mapped", "\u0626\u064A"], [[64517, 64517], "mapped", "\u0628\u062C"], [[64518, 64518], "mapped", "\u0628\u062D"], [[64519, 64519], "mapped", "\u0628\u062E"], [[64520, 64520], "mapped", "\u0628\u0645"], [[64521, 64521], "mapped", "\u0628\u0649"], [[64522, 64522], "mapped", "\u0628\u064A"], [[64523, 64523], "mapped", "\u062A\u062C"], [[64524, 64524], "mapped", "\u062A\u062D"], [[64525, 64525], "mapped", "\u062A\u062E"], [[64526, 64526], "mapped", "\u062A\u0645"], [[64527, 64527], "mapped", "\u062A\u0649"], [[64528, 64528], "mapped", "\u062A\u064A"], [[64529, 64529], "mapped", "\u062B\u062C"], [[64530, 64530], "mapped", "\u062B\u0645"], [[64531, 64531], "mapped", "\u062B\u0649"], [[64532, 64532], "mapped", "\u062B\u064A"], [[64533, 64533], "mapped", "\u062C\u062D"], [[64534, 64534], "mapped", "\u062C\u0645"], [[64535, 64535], "mapped", "\u062D\u062C"], [[64536, 64536], "mapped", "\u062D\u0645"], [[64537, 64537], "mapped", "\u062E\u062C"], [[64538, 64538], "mapped", "\u062E\u062D"], [[64539, 64539], "mapped", "\u062E\u0645"], [[64540, 64540], "mapped", "\u0633\u062C"], [[64541, 64541], "mapped", "\u0633\u062D"], [[64542, 64542], "mapped", "\u0633\u062E"], [[64543, 64543], "mapped", "\u0633\u0645"], [[64544, 64544], "mapped", "\u0635\u062D"], [[64545, 64545], "mapped", "\u0635\u0645"], [[64546, 64546], "mapped", "\u0636\u062C"], [[64547, 64547], "mapped", "\u0636\u062D"], [[64548, 64548], "mapped", "\u0636\u062E"], [[64549, 64549], "mapped", "\u0636\u0645"], [[64550, 64550], "mapped", "\u0637\u062D"], [[64551, 64551], "mapped", "\u0637\u0645"], [[64552, 64552], "mapped", "\u0638\u0645"], [[64553, 64553], "mapped", "\u0639\u062C"], [[64554, 64554], "mapped", "\u0639\u0645"], [[64555, 64555], "mapped", "\u063A\u062C"], [[64556, 64556], "mapped", "\u063A\u0645"], [[64557, 64557], "mapped", "\u0641\u062C"], [[64558, 64558], "mapped", "\u0641\u062D"], [[64559, 64559], "mapped", "\u0641\u062E"], [[64560, 64560], "mapped", "\u0641\u0645"], [[64561, 64561], "mapped", "\u0641\u0649"], [[64562, 64562], "mapped", "\u0641\u064A"], [[64563, 64563], "mapped", "\u0642\u062D"], [[64564, 64564], "mapped", "\u0642\u0645"], [[64565, 64565], "mapped", "\u0642\u0649"], [[64566, 64566], "mapped", "\u0642\u064A"], [[64567, 64567], "mapped", "\u0643\u0627"], [[64568, 64568], "mapped", "\u0643\u062C"], [[64569, 64569], "mapped", "\u0643\u062D"], [[64570, 64570], "mapped", "\u0643\u062E"], [[64571, 64571], "mapped", "\u0643\u0644"], [[64572, 64572], "mapped", "\u0643\u0645"], [[64573, 64573], "mapped", "\u0643\u0649"], [[64574, 64574], "mapped", "\u0643\u064A"], [[64575, 64575], "mapped", "\u0644\u062C"], [[64576, 64576], "mapped", "\u0644\u062D"], [[64577, 64577], "mapped", "\u0644\u062E"], [[64578, 64578], "mapped", "\u0644\u0645"], [[64579, 64579], "mapped", "\u0644\u0649"], [[64580, 64580], "mapped", "\u0644\u064A"], [[64581, 64581], "mapped", "\u0645\u062C"], [[64582, 64582], "mapped", "\u0645\u062D"], [[64583, 64583], "mapped", "\u0645\u062E"], [[64584, 64584], "mapped", "\u0645\u0645"], [[64585, 64585], "mapped", "\u0645\u0649"], [[64586, 64586], "mapped", "\u0645\u064A"], [[64587, 64587], "mapped", "\u0646\u062C"], [[64588, 64588], "mapped", "\u0646\u062D"], [[64589, 64589], "mapped", "\u0646\u062E"], [[64590, 64590], "mapped", "\u0646\u0645"], [[64591, 64591], "mapped", "\u0646\u0649"], [[64592, 64592], "mapped", "\u0646\u064A"], [[64593, 64593], "mapped", "\u0647\u062C"], [[64594, 64594], "mapped", "\u0647\u0645"], [[64595, 64595], "mapped", "\u0647\u0649"], [[64596, 64596], "mapped", "\u0647\u064A"], [[64597, 64597], "mapped", "\u064A\u062C"], [[64598, 64598], "mapped", "\u064A\u062D"], [[64599, 64599], "mapped", "\u064A\u062E"], [[64600, 64600], "mapped", "\u064A\u0645"], [[64601, 64601], "mapped", "\u064A\u0649"], [[64602, 64602], "mapped", "\u064A\u064A"], [[64603, 64603], "mapped", "\u0630\u0670"], [[64604, 64604], "mapped", "\u0631\u0670"], [[64605, 64605], "mapped", "\u0649\u0670"], [[64606, 64606], "disallowed_STD3_mapped", " \u064C\u0651"], [[64607, 64607], "disallowed_STD3_mapped", " \u064D\u0651"], [[64608, 64608], "disallowed_STD3_mapped", " \u064E\u0651"], [[64609, 64609], "disallowed_STD3_mapped", " \u064F\u0651"], [[64610, 64610], "disallowed_STD3_mapped", " \u0650\u0651"], [[64611, 64611], "disallowed_STD3_mapped", " \u0651\u0670"], [[64612, 64612], "mapped", "\u0626\u0631"], [[64613, 64613], "mapped", "\u0626\u0632"], [[64614, 64614], "mapped", "\u0626\u0645"], [[64615, 64615], "mapped", "\u0626\u0646"], [[64616, 64616], "mapped", "\u0626\u0649"], [[64617, 64617], "mapped", "\u0626\u064A"], [[64618, 64618], "mapped", "\u0628\u0631"], [[64619, 64619], "mapped", "\u0628\u0632"], [[64620, 64620], "mapped", "\u0628\u0645"], [[64621, 64621], "mapped", "\u0628\u0646"], [[64622, 64622], "mapped", "\u0628\u0649"], [[64623, 64623], "mapped", "\u0628\u064A"], [[64624, 64624], "mapped", "\u062A\u0631"], [[64625, 64625], "mapped", "\u062A\u0632"], [[64626, 64626], "mapped", "\u062A\u0645"], [[64627, 64627], "mapped", "\u062A\u0646"], [[64628, 64628], "mapped", "\u062A\u0649"], [[64629, 64629], "mapped", "\u062A\u064A"], [[64630, 64630], "mapped", "\u062B\u0631"], [[64631, 64631], "mapped", "\u062B\u0632"], [[64632, 64632], "mapped", "\u062B\u0645"], [[64633, 64633], "mapped", "\u062B\u0646"], [[64634, 64634], "mapped", "\u062B\u0649"], [[64635, 64635], "mapped", "\u062B\u064A"], [[64636, 64636], "mapped", "\u0641\u0649"], [[64637, 64637], "mapped", "\u0641\u064A"], [[64638, 64638], "mapped", "\u0642\u0649"], [[64639, 64639], "mapped", "\u0642\u064A"], [[64640, 64640], "mapped", "\u0643\u0627"], [[64641, 64641], "mapped", "\u0643\u0644"], [[64642, 64642], "mapped", "\u0643\u0645"], [[64643, 64643], "mapped", "\u0643\u0649"], [[64644, 64644], "mapped", "\u0643\u064A"], [[64645, 64645], "mapped", "\u0644\u0645"], [[64646, 64646], "mapped", "\u0644\u0649"], [[64647, 64647], "mapped", "\u0644\u064A"], [[64648, 64648], "mapped", "\u0645\u0627"], [[64649, 64649], "mapped", "\u0645\u0645"], [[64650, 64650], "mapped", "\u0646\u0631"], [[64651, 64651], "mapped", "\u0646\u0632"], [[64652, 64652], "mapped", "\u0646\u0645"], [[64653, 64653], "mapped", "\u0646\u0646"], [[64654, 64654], "mapped", "\u0646\u0649"], [[64655, 64655], "mapped", "\u0646\u064A"], [[64656, 64656], "mapped", "\u0649\u0670"], [[64657, 64657], "mapped", "\u064A\u0631"], [[64658, 64658], "mapped", "\u064A\u0632"], [[64659, 64659], "mapped", "\u064A\u0645"], [[64660, 64660], "mapped", "\u064A\u0646"], [[64661, 64661], "mapped", "\u064A\u0649"], [[64662, 64662], "mapped", "\u064A\u064A"], [[64663, 64663], "mapped", "\u0626\u062C"], [[64664, 64664], "mapped", "\u0626\u062D"], [[64665, 64665], "mapped", "\u0626\u062E"], [[64666, 64666], "mapped", "\u0626\u0645"], [[64667, 64667], "mapped", "\u0626\u0647"], [[64668, 64668], "mapped", "\u0628\u062C"], [[64669, 64669], "mapped", "\u0628\u062D"], [[64670, 64670], "mapped", "\u0628\u062E"], [[64671, 64671], "mapped", "\u0628\u0645"], [[64672, 64672], "mapped", "\u0628\u0647"], [[64673, 64673], "mapped", "\u062A\u062C"], [[64674, 64674], "mapped", "\u062A\u062D"], [[64675, 64675], "mapped", "\u062A\u062E"], [[64676, 64676], "mapped", "\u062A\u0645"], [[64677, 64677], "mapped", "\u062A\u0647"], [[64678, 64678], "mapped", "\u062B\u0645"], [[64679, 64679], "mapped", "\u062C\u062D"], [[64680, 64680], "mapped", "\u062C\u0645"], [[64681, 64681], "mapped", "\u062D\u062C"], [[64682, 64682], "mapped", "\u062D\u0645"], [[64683, 64683], "mapped", "\u062E\u062C"], [[64684, 64684], "mapped", "\u062E\u0645"], [[64685, 64685], "mapped", "\u0633\u062C"], [[64686, 64686], "mapped", "\u0633\u062D"], [[64687, 64687], "mapped", "\u0633\u062E"], [[64688, 64688], "mapped", "\u0633\u0645"], [[64689, 64689], "mapped", "\u0635\u062D"], [[64690, 64690], "mapped", "\u0635\u062E"], [[64691, 64691], "mapped", "\u0635\u0645"], [[64692, 64692], "mapped", "\u0636\u062C"], [[64693, 64693], "mapped", "\u0636\u062D"], [[64694, 64694], "mapped", "\u0636\u062E"], [[64695, 64695], "mapped", "\u0636\u0645"], [[64696, 64696], "mapped", "\u0637\u062D"], [[64697, 64697], "mapped", "\u0638\u0645"], [[64698, 64698], "mapped", "\u0639\u062C"], [[64699, 64699], "mapped", "\u0639\u0645"], [[64700, 64700], "mapped", "\u063A\u062C"], [[64701, 64701], "mapped", "\u063A\u0645"], [[64702, 64702], "mapped", "\u0641\u062C"], [[64703, 64703], "mapped", "\u0641\u062D"], [[64704, 64704], "mapped", "\u0641\u062E"], [[64705, 64705], "mapped", "\u0641\u0645"], [[64706, 64706], "mapped", "\u0642\u062D"], [[64707, 64707], "mapped", "\u0642\u0645"], [[64708, 64708], "mapped", "\u0643\u062C"], [[64709, 64709], "mapped", "\u0643\u062D"], [[64710, 64710], "mapped", "\u0643\u062E"], [[64711, 64711], "mapped", "\u0643\u0644"], [[64712, 64712], "mapped", "\u0643\u0645"], [[64713, 64713], "mapped", "\u0644\u062C"], [[64714, 64714], "mapped", "\u0644\u062D"], [[64715, 64715], "mapped", "\u0644\u062E"], [[64716, 64716], "mapped", "\u0644\u0645"], [[64717, 64717], "mapped", "\u0644\u0647"], [[64718, 64718], "mapped", "\u0645\u062C"], [[64719, 64719], "mapped", "\u0645\u062D"], [[64720, 64720], "mapped", "\u0645\u062E"], [[64721, 64721], "mapped", "\u0645\u0645"], [[64722, 64722], "mapped", "\u0646\u062C"], [[64723, 64723], "mapped", "\u0646\u062D"], [[64724, 64724], "mapped", "\u0646\u062E"], [[64725, 64725], "mapped", "\u0646\u0645"], [[64726, 64726], "mapped", "\u0646\u0647"], [[64727, 64727], "mapped", "\u0647\u062C"], [[64728, 64728], "mapped", "\u0647\u0645"], [[64729, 64729], "mapped", "\u0647\u0670"], [[64730, 64730], "mapped", "\u064A\u062C"], [[64731, 64731], "mapped", "\u064A\u062D"], [[64732, 64732], "mapped", "\u064A\u062E"], [[64733, 64733], "mapped", "\u064A\u0645"], [[64734, 64734], "mapped", "\u064A\u0647"], [[64735, 64735], "mapped", "\u0626\u0645"], [[64736, 64736], "mapped", "\u0626\u0647"], [[64737, 64737], "mapped", "\u0628\u0645"], [[64738, 64738], "mapped", "\u0628\u0647"], [[64739, 64739], "mapped", "\u062A\u0645"], [[64740, 64740], "mapped", "\u062A\u0647"], [[64741, 64741], "mapped", "\u062B\u0645"], [[64742, 64742], "mapped", "\u062B\u0647"], [[64743, 64743], "mapped", "\u0633\u0645"], [[64744, 64744], "mapped", "\u0633\u0647"], [[64745, 64745], "mapped", "\u0634\u0645"], [[64746, 64746], "mapped", "\u0634\u0647"], [[64747, 64747], "mapped", "\u0643\u0644"], [[64748, 64748], "mapped", "\u0643\u0645"], [[64749, 64749], "mapped", "\u0644\u0645"], [[64750, 64750], "mapped", "\u0646\u0645"], [[64751, 64751], "mapped", "\u0646\u0647"], [[64752, 64752], "mapped", "\u064A\u0645"], [[64753, 64753], "mapped", "\u064A\u0647"], [[64754, 64754], "mapped", "\u0640\u064E\u0651"], [[64755, 64755], "mapped", "\u0640\u064F\u0651"], [[64756, 64756], "mapped", "\u0640\u0650\u0651"], [[64757, 64757], "mapped", "\u0637\u0649"], [[64758, 64758], "mapped", "\u0637\u064A"], [[64759, 64759], "mapped", "\u0639\u0649"], [[64760, 64760], "mapped", "\u0639\u064A"], [[64761, 64761], "mapped", "\u063A\u0649"], [[64762, 64762], "mapped", "\u063A\u064A"], [[64763, 64763], "mapped", "\u0633\u0649"], [[64764, 64764], "mapped", "\u0633\u064A"], [[64765, 64765], "mapped", "\u0634\u0649"], [[64766, 64766], "mapped", "\u0634\u064A"], [[64767, 64767], "mapped", "\u062D\u0649"], [[64768, 64768], "mapped", "\u062D\u064A"], [[64769, 64769], "mapped", "\u062C\u0649"], [[64770, 64770], "mapped", "\u062C\u064A"], [[64771, 64771], "mapped", "\u062E\u0649"], [[64772, 64772], "mapped", "\u062E\u064A"], [[64773, 64773], "mapped", "\u0635\u0649"], [[64774, 64774], "mapped", "\u0635\u064A"], [[64775, 64775], "mapped", "\u0636\u0649"], [[64776, 64776], "mapped", "\u0636\u064A"], [[64777, 64777], "mapped", "\u0634\u062C"], [[64778, 64778], "mapped", "\u0634\u062D"], [[64779, 64779], "mapped", "\u0634\u062E"], [[64780, 64780], "mapped", "\u0634\u0645"], [[64781, 64781], "mapped", "\u0634\u0631"], [[64782, 64782], "mapped", "\u0633\u0631"], [[64783, 64783], "mapped", "\u0635\u0631"], [[64784, 64784], "mapped", "\u0636\u0631"], [[64785, 64785], "mapped", "\u0637\u0649"], [[64786, 64786], "mapped", "\u0637\u064A"], [[64787, 64787], "mapped", "\u0639\u0649"], [[64788, 64788], "mapped", "\u0639\u064A"], [[64789, 64789], "mapped", "\u063A\u0649"], [[64790, 64790], "mapped", "\u063A\u064A"], [[64791, 64791], "mapped", "\u0633\u0649"], [[64792, 64792], "mapped", "\u0633\u064A"], [[64793, 64793], "mapped", "\u0634\u0649"], [[64794, 64794], "mapped", "\u0634\u064A"], [[64795, 64795], "mapped", "\u062D\u0649"], [[64796, 64796], "mapped", "\u062D\u064A"], [[64797, 64797], "mapped", "\u062C\u0649"], [[64798, 64798], "mapped", "\u062C\u064A"], [[64799, 64799], "mapped", "\u062E\u0649"], [[64800, 64800], "mapped", "\u062E\u064A"], [[64801, 64801], "mapped", "\u0635\u0649"], [[64802, 64802], "mapped", "\u0635\u064A"], [[64803, 64803], "mapped", "\u0636\u0649"], [[64804, 64804], "mapped", "\u0636\u064A"], [[64805, 64805], "mapped", "\u0634\u062C"], [[64806, 64806], "mapped", "\u0634\u062D"], [[64807, 64807], "mapped", "\u0634\u062E"], [[64808, 64808], "mapped", "\u0634\u0645"], [[64809, 64809], "mapped", "\u0634\u0631"], [[64810, 64810], "mapped", "\u0633\u0631"], [[64811, 64811], "mapped", "\u0635\u0631"], [[64812, 64812], "mapped", "\u0636\u0631"], [[64813, 64813], "mapped", "\u0634\u062C"], [[64814, 64814], "mapped", "\u0634\u062D"], [[64815, 64815], "mapped", "\u0634\u062E"], [[64816, 64816], "mapped", "\u0634\u0645"], [[64817, 64817], "mapped", "\u0633\u0647"], [[64818, 64818], "mapped", "\u0634\u0647"], [[64819, 64819], "mapped", "\u0637\u0645"], [[64820, 64820], "mapped", "\u0633\u062C"], [[64821, 64821], "mapped", "\u0633\u062D"], [[64822, 64822], "mapped", "\u0633\u062E"], [[64823, 64823], "mapped", "\u0634\u062C"], [[64824, 64824], "mapped", "\u0634\u062D"], [[64825, 64825], "mapped", "\u0634\u062E"], [[64826, 64826], "mapped", "\u0637\u0645"], [[64827, 64827], "mapped", "\u0638\u0645"], [[64828, 64829], "mapped", "\u0627\u064B"], [[64830, 64831], "valid", "", "NV8"], [[64832, 64847], "disallowed"], [[64848, 64848], "mapped", "\u062A\u062C\u0645"], [[64849, 64850], "mapped", "\u062A\u062D\u062C"], [[64851, 64851], "mapped", "\u062A\u062D\u0645"], [[64852, 64852], "mapped", "\u062A\u062E\u0645"], [[64853, 64853], "mapped", "\u062A\u0645\u062C"], [[64854, 64854], "mapped", "\u062A\u0645\u062D"], [[64855, 64855], "mapped", "\u062A\u0645\u062E"], [[64856, 64857], "mapped", "\u062C\u0645\u062D"], [[64858, 64858], "mapped", "\u062D\u0645\u064A"], [[64859, 64859], "mapped", "\u062D\u0645\u0649"], [[64860, 64860], "mapped", "\u0633\u062D\u062C"], [[64861, 64861], "mapped", "\u0633\u062C\u062D"], [[64862, 64862], "mapped", "\u0633\u062C\u0649"], [[64863, 64864], "mapped", "\u0633\u0645\u062D"], [[64865, 64865], "mapped", "\u0633\u0645\u062C"], [[64866, 64867], "mapped", "\u0633\u0645\u0645"], [[64868, 64869], "mapped", "\u0635\u062D\u062D"], [[64870, 64870], "mapped", "\u0635\u0645\u0645"], [[64871, 64872], "mapped", "\u0634\u062D\u0645"], [[64873, 64873], "mapped", "\u0634\u062C\u064A"], [[64874, 64875], "mapped", "\u0634\u0645\u062E"], [[64876, 64877], "mapped", "\u0634\u0645\u0645"], [[64878, 64878], "mapped", "\u0636\u062D\u0649"], [[64879, 64880], "mapped", "\u0636\u062E\u0645"], [[64881, 64882], "mapped", "\u0637\u0645\u062D"], [[64883, 64883], "mapped", "\u0637\u0645\u0645"], [[64884, 64884], "mapped", "\u0637\u0645\u064A"], [[64885, 64885], "mapped", "\u0639\u062C\u0645"], [[64886, 64887], "mapped", "\u0639\u0645\u0645"], [[64888, 64888], "mapped", "\u0639\u0645\u0649"], [[64889, 64889], "mapped", "\u063A\u0645\u0645"], [[64890, 64890], "mapped", "\u063A\u0645\u064A"], [[64891, 64891], "mapped", "\u063A\u0645\u0649"], [[64892, 64893], "mapped", "\u0641\u062E\u0645"], [[64894, 64894], "mapped", "\u0642\u0645\u062D"], [[64895, 64895], "mapped", "\u0642\u0645\u0645"], [[64896, 64896], "mapped", "\u0644\u062D\u0645"], [[64897, 64897], "mapped", "\u0644\u062D\u064A"], [[64898, 64898], "mapped", "\u0644\u062D\u0649"], [[64899, 64900], "mapped", "\u0644\u062C\u062C"], [[64901, 64902], "mapped", "\u0644\u062E\u0645"], [[64903, 64904], "mapped", "\u0644\u0645\u062D"], [[64905, 64905], "mapped", "\u0645\u062D\u062C"], [[64906, 64906], "mapped", "\u0645\u062D\u0645"], [[64907, 64907], "mapped", "\u0645\u062D\u064A"], [[64908, 64908], "mapped", "\u0645\u062C\u062D"], [[64909, 64909], "mapped", "\u0645\u062C\u0645"], [[64910, 64910], "mapped", "\u0645\u062E\u062C"], [[64911, 64911], "mapped", "\u0645\u062E\u0645"], [[64912, 64913], "disallowed"], [[64914, 64914], "mapped", "\u0645\u062C\u062E"], [[64915, 64915], "mapped", "\u0647\u0645\u062C"], [[64916, 64916], "mapped", "\u0647\u0645\u0645"], [[64917, 64917], "mapped", "\u0646\u062D\u0645"], [[64918, 64918], "mapped", "\u0646\u062D\u0649"], [[64919, 64920], "mapped", "\u0646\u062C\u0645"], [[64921, 64921], "mapped", "\u0646\u062C\u0649"], [[64922, 64922], "mapped", "\u0646\u0645\u064A"], [[64923, 64923], "mapped", "\u0646\u0645\u0649"], [[64924, 64925], "mapped", "\u064A\u0645\u0645"], [[64926, 64926], "mapped", "\u0628\u062E\u064A"], [[64927, 64927], "mapped", "\u062A\u062C\u064A"], [[64928, 64928], "mapped", "\u062A\u062C\u0649"], [[64929, 64929], "mapped", "\u062A\u062E\u064A"], [[64930, 64930], "mapped", "\u062A\u062E\u0649"], [[64931, 64931], "mapped", "\u062A\u0645\u064A"], [[64932, 64932], "mapped", "\u062A\u0645\u0649"], [[64933, 64933], "mapped", "\u062C\u0645\u064A"], [[64934, 64934], "mapped", "\u062C\u062D\u0649"], [[64935, 64935], "mapped", "\u062C\u0645\u0649"], [[64936, 64936], "mapped", "\u0633\u062E\u0649"], [[64937, 64937], "mapped", "\u0635\u062D\u064A"], [[64938, 64938], "mapped", "\u0634\u062D\u064A"], [[64939, 64939], "mapped", "\u0636\u062D\u064A"], [[64940, 64940], "mapped", "\u0644\u062C\u064A"], [[64941, 64941], "mapped", "\u0644\u0645\u064A"], [[64942, 64942], "mapped", "\u064A\u062D\u064A"], [[64943, 64943], "mapped", "\u064A\u062C\u064A"], [[64944, 64944], "mapped", "\u064A\u0645\u064A"], [[64945, 64945], "mapped", "\u0645\u0645\u064A"], [[64946, 64946], "mapped", "\u0642\u0645\u064A"], [[64947, 64947], "mapped", "\u0646\u062D\u064A"], [[64948, 64948], "mapped", "\u0642\u0645\u062D"], [[64949, 64949], "mapped", "\u0644\u062D\u0645"], [[64950, 64950], "mapped", "\u0639\u0645\u064A"], [[64951, 64951], "mapped", "\u0643\u0645\u064A"], [[64952, 64952], "mapped", "\u0646\u062C\u062D"], [[64953, 64953], "mapped", "\u0645\u062E\u064A"], [[64954, 64954], "mapped", "\u0644\u062C\u0645"], [[64955, 64955], "mapped", "\u0643\u0645\u0645"], [[64956, 64956], "mapped", "\u0644\u062C\u0645"], [[64957, 64957], "mapped", "\u0646\u062C\u062D"], [[64958, 64958], "mapped", "\u062C\u062D\u064A"], [[64959, 64959], "mapped", "\u062D\u062C\u064A"], [[64960, 64960], "mapped", "\u0645\u062C\u064A"], [[64961, 64961], "mapped", "\u0641\u0645\u064A"], [[64962, 64962], "mapped", "\u0628\u062D\u064A"], [[64963, 64963], "mapped", "\u0643\u0645\u0645"], [[64964, 64964], "mapped", "\u0639\u062C\u0645"], [[64965, 64965], "mapped", "\u0635\u0645\u0645"], [[64966, 64966], "mapped", "\u0633\u062E\u064A"], [[64967, 64967], "mapped", "\u0646\u062C\u064A"], [[64968, 64975], "disallowed"], [[64976, 65007], "disallowed"], [[65008, 65008], "mapped", "\u0635\u0644\u06D2"], [[65009, 65009], "mapped", "\u0642\u0644\u06D2"], [[65010, 65010], "mapped", "\u0627\u0644\u0644\u0647"], [[65011, 65011], "mapped", "\u0627\u0643\u0628\u0631"], [[65012, 65012], "mapped", "\u0645\u062D\u0645\u062F"], [[65013, 65013], "mapped", "\u0635\u0644\u0639\u0645"], [[65014, 65014], "mapped", "\u0631\u0633\u0648\u0644"], [[65015, 65015], "mapped", "\u0639\u0644\u064A\u0647"], [[65016, 65016], "mapped", "\u0648\u0633\u0644\u0645"], [[65017, 65017], "mapped", "\u0635\u0644\u0649"], [[65018, 65018], "disallowed_STD3_mapped", "\u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645"], [[65019, 65019], "disallowed_STD3_mapped", "\u062C\u0644 \u062C\u0644\u0627\u0644\u0647"], [[65020, 65020], "mapped", "\u0631\u06CC\u0627\u0644"], [[65021, 65021], "valid", "", "NV8"], [[65022, 65023], "disallowed"], [[65024, 65039], "ignored"], [[65040, 65040], "disallowed_STD3_mapped", ","], [[65041, 65041], "mapped", "\u3001"], [[65042, 65042], "disallowed"], [[65043, 65043], "disallowed_STD3_mapped", ":"], [[65044, 65044], "disallowed_STD3_mapped", ";"], [[65045, 65045], "disallowed_STD3_mapped", "!"], [[65046, 65046], "disallowed_STD3_mapped", "?"], [[65047, 65047], "mapped", "\u3016"], [[65048, 65048], "mapped", "\u3017"], [[65049, 65049], "disallowed"], [[65050, 65055], "disallowed"], [[65056, 65059], "valid"], [[65060, 65062], "valid"], [[65063, 65069], "valid"], [[65070, 65071], "valid"], [[65072, 65072], "disallowed"], [[65073, 65073], "mapped", "\u2014"], [[65074, 65074], "mapped", "\u2013"], [[65075, 65076], "disallowed_STD3_mapped", "_"], [[65077, 65077], "disallowed_STD3_mapped", "("], [[65078, 65078], "disallowed_STD3_mapped", ")"], [[65079, 65079], "disallowed_STD3_mapped", "{"], [[65080, 65080], "disallowed_STD3_mapped", "}"], [[65081, 65081], "mapped", "\u3014"], [[65082, 65082], "mapped", "\u3015"], [[65083, 65083], "mapped", "\u3010"], [[65084, 65084], "mapped", "\u3011"], [[65085, 65085], "mapped", "\u300A"], [[65086, 65086], "mapped", "\u300B"], [[65087, 65087], "mapped", "\u3008"], [[65088, 65088], "mapped", "\u3009"], [[65089, 65089], "mapped", "\u300C"], [[65090, 65090], "mapped", "\u300D"], [[65091, 65091], "mapped", "\u300E"], [[65092, 65092], "mapped", "\u300F"], [[65093, 65094], "valid", "", "NV8"], [[65095, 65095], "disallowed_STD3_mapped", "["], [[65096, 65096], "disallowed_STD3_mapped", "]"], [[65097, 65100], "disallowed_STD3_mapped", " \u0305"], [[65101, 65103], "disallowed_STD3_mapped", "_"], [[65104, 65104], "disallowed_STD3_mapped", ","], [[65105, 65105], "mapped", "\u3001"], [[65106, 65106], "disallowed"], [[65107, 65107], "disallowed"], [[65108, 65108], "disallowed_STD3_mapped", ";"], [[65109, 65109], "disallowed_STD3_mapped", ":"], [[65110, 65110], "disallowed_STD3_mapped", "?"], [[65111, 65111], "disallowed_STD3_mapped", "!"], [[65112, 65112], "mapped", "\u2014"], [[65113, 65113], "disallowed_STD3_mapped", "("], [[65114, 65114], "disallowed_STD3_mapped", ")"], [[65115, 65115], "disallowed_STD3_mapped", "{"], [[65116, 65116], "disallowed_STD3_mapped", "}"], [[65117, 65117], "mapped", "\u3014"], [[65118, 65118], "mapped", "\u3015"], [[65119, 65119], "disallowed_STD3_mapped", "#"], [[65120, 65120], "disallowed_STD3_mapped", "&"], [[65121, 65121], "disallowed_STD3_mapped", "*"], [[65122, 65122], "disallowed_STD3_mapped", "+"], [[65123, 65123], "mapped", "-"], [[65124, 65124], "disallowed_STD3_mapped", "<"], [[65125, 65125], "disallowed_STD3_mapped", ">"], [[65126, 65126], "disallowed_STD3_mapped", "="], [[65127, 65127], "disallowed"], [[65128, 65128], "disallowed_STD3_mapped", "\\"], [[65129, 65129], "disallowed_STD3_mapped", "$"], [[65130, 65130], "disallowed_STD3_mapped", "%"], [[65131, 65131], "disallowed_STD3_mapped", "@"], [[65132, 65135], "disallowed"], [[65136, 65136], "disallowed_STD3_mapped", " \u064B"], [[65137, 65137], "mapped", "\u0640\u064B"], [[65138, 65138], "disallowed_STD3_mapped", " \u064C"], [[65139, 65139], "valid"], [[65140, 65140], "disallowed_STD3_mapped", " \u064D"], [[65141, 65141], "disallowed"], [[65142, 65142], "disallowed_STD3_mapped", " \u064E"], [[65143, 65143], "mapped", "\u0640\u064E"], [[65144, 65144], "disallowed_STD3_mapped", " \u064F"], [[65145, 65145], "mapped", "\u0640\u064F"], [[65146, 65146], "disallowed_STD3_mapped", " \u0650"], [[65147, 65147], "mapped", "\u0640\u0650"], [[65148, 65148], "disallowed_STD3_mapped", " \u0651"], [[65149, 65149], "mapped", "\u0640\u0651"], [[65150, 65150], "disallowed_STD3_mapped", " \u0652"], [[65151, 65151], "mapped", "\u0640\u0652"], [[65152, 65152], "mapped", "\u0621"], [[65153, 65154], "mapped", "\u0622"], [[65155, 65156], "mapped", "\u0623"], [[65157, 65158], "mapped", "\u0624"], [[65159, 65160], "mapped", "\u0625"], [[65161, 65164], "mapped", "\u0626"], [[65165, 65166], "mapped", "\u0627"], [[65167, 65170], "mapped", "\u0628"], [[65171, 65172], "mapped", "\u0629"], [[65173, 65176], "mapped", "\u062A"], [[65177, 65180], "mapped", "\u062B"], [[65181, 65184], "mapped", "\u062C"], [[65185, 65188], "mapped", "\u062D"], [[65189, 65192], "mapped", "\u062E"], [[65193, 65194], "mapped", "\u062F"], [[65195, 65196], "mapped", "\u0630"], [[65197, 65198], "mapped", "\u0631"], [[65199, 65200], "mapped", "\u0632"], [[65201, 65204], "mapped", "\u0633"], [[65205, 65208], "mapped", "\u0634"], [[65209, 65212], "mapped", "\u0635"], [[65213, 65216], "mapped", "\u0636"], [[65217, 65220], "mapped", "\u0637"], [[65221, 65224], "mapped", "\u0638"], [[65225, 65228], "mapped", "\u0639"], [[65229, 65232], "mapped", "\u063A"], [[65233, 65236], "mapped", "\u0641"], [[65237, 65240], "mapped", "\u0642"], [[65241, 65244], "mapped", "\u0643"], [[65245, 65248], "mapped", "\u0644"], [[65249, 65252], "mapped", "\u0645"], [[65253, 65256], "mapped", "\u0646"], [[65257, 65260], "mapped", "\u0647"], [[65261, 65262], "mapped", "\u0648"], [[65263, 65264], "mapped", "\u0649"], [[65265, 65268], "mapped", "\u064A"], [[65269, 65270], "mapped", "\u0644\u0622"], [[65271, 65272], "mapped", "\u0644\u0623"], [[65273, 65274], "mapped", "\u0644\u0625"], [[65275, 65276], "mapped", "\u0644\u0627"], [[65277, 65278], "disallowed"], [[65279, 65279], "ignored"], [[65280, 65280], "disallowed"], [[65281, 65281], "disallowed_STD3_mapped", "!"], [[65282, 65282], "disallowed_STD3_mapped", '"'], [[65283, 65283], "disallowed_STD3_mapped", "#"], [[65284, 65284], "disallowed_STD3_mapped", "$"], [[65285, 65285], "disallowed_STD3_mapped", "%"], [[65286, 65286], "disallowed_STD3_mapped", "&"], [[65287, 65287], "disallowed_STD3_mapped", "'"], [[65288, 65288], "disallowed_STD3_mapped", "("], [[65289, 65289], "disallowed_STD3_mapped", ")"], [[65290, 65290], "disallowed_STD3_mapped", "*"], [[65291, 65291], "disallowed_STD3_mapped", "+"], [[65292, 65292], "disallowed_STD3_mapped", ","], [[65293, 65293], "mapped", "-"], [[65294, 65294], "mapped", "."], [[65295, 65295], "disallowed_STD3_mapped", "/"], [[65296, 65296], "mapped", "0"], [[65297, 65297], "mapped", "1"], [[65298, 65298], "mapped", "2"], [[65299, 65299], "mapped", "3"], [[65300, 65300], "mapped", "4"], [[65301, 65301], "mapped", "5"], [[65302, 65302], "mapped", "6"], [[65303, 65303], "mapped", "7"], [[65304, 65304], "mapped", "8"], [[65305, 65305], "mapped", "9"], [[65306, 65306], "disallowed_STD3_mapped", ":"], [[65307, 65307], "disallowed_STD3_mapped", ";"], [[65308, 65308], "disallowed_STD3_mapped", "<"], [[65309, 65309], "disallowed_STD3_mapped", "="], [[65310, 65310], "disallowed_STD3_mapped", ">"], [[65311, 65311], "disallowed_STD3_mapped", "?"], [[65312, 65312], "disallowed_STD3_mapped", "@"], [[65313, 65313], "mapped", "a"], [[65314, 65314], "mapped", "b"], [[65315, 65315], "mapped", "c"], [[65316, 65316], "mapped", "d"], [[65317, 65317], "mapped", "e"], [[65318, 65318], "mapped", "f"], [[65319, 65319], "mapped", "g"], [[65320, 65320], "mapped", "h"], [[65321, 65321], "mapped", "i"], [[65322, 65322], "mapped", "j"], [[65323, 65323], "mapped", "k"], [[65324, 65324], "mapped", "l"], [[65325, 65325], "mapped", "m"], [[65326, 65326], "mapped", "n"], [[65327, 65327], "mapped", "o"], [[65328, 65328], "mapped", "p"], [[65329, 65329], "mapped", "q"], [[65330, 65330], "mapped", "r"], [[65331, 65331], "mapped", "s"], [[65332, 65332], "mapped", "t"], [[65333, 65333], "mapped", "u"], [[65334, 65334], "mapped", "v"], [[65335, 65335], "mapped", "w"], [[65336, 65336], "mapped", "x"], [[65337, 65337], "mapped", "y"], [[65338, 65338], "mapped", "z"], [[65339, 65339], "disallowed_STD3_mapped", "["], [[65340, 65340], "disallowed_STD3_mapped", "\\"], [[65341, 65341], "disallowed_STD3_mapped", "]"], [[65342, 65342], "disallowed_STD3_mapped", "^"], [[65343, 65343], "disallowed_STD3_mapped", "_"], [[65344, 65344], "disallowed_STD3_mapped", "`"], [[65345, 65345], "mapped", "a"], [[65346, 65346], "mapped", "b"], [[65347, 65347], "mapped", "c"], [[65348, 65348], "mapped", "d"], [[65349, 65349], "mapped", "e"], [[65350, 65350], "mapped", "f"], [[65351, 65351], "mapped", "g"], [[65352, 65352], "mapped", "h"], [[65353, 65353], "mapped", "i"], [[65354, 65354], "mapped", "j"], [[65355, 65355], "mapped", "k"], [[65356, 65356], "mapped", "l"], [[65357, 65357], "mapped", "m"], [[65358, 65358], "mapped", "n"], [[65359, 65359], "mapped", "o"], [[65360, 65360], "mapped", "p"], [[65361, 65361], "mapped", "q"], [[65362, 65362], "mapped", "r"], [[65363, 65363], "mapped", "s"], [[65364, 65364], "mapped", "t"], [[65365, 65365], "mapped", "u"], [[65366, 65366], "mapped", "v"], [[65367, 65367], "mapped", "w"], [[65368, 65368], "mapped", "x"], [[65369, 65369], "mapped", "y"], [[65370, 65370], "mapped", "z"], [[65371, 65371], "disallowed_STD3_mapped", "{"], [[65372, 65372], "disallowed_STD3_mapped", "|"], [[65373, 65373], "disallowed_STD3_mapped", "}"], [[65374, 65374], "disallowed_STD3_mapped", "~"], [[65375, 65375], "mapped", "\u2985"], [[65376, 65376], "mapped", "\u2986"], [[65377, 65377], "mapped", "."], [[65378, 65378], "mapped", "\u300C"], [[65379, 65379], "mapped", "\u300D"], [[65380, 65380], "mapped", "\u3001"], [[65381, 65381], "mapped", "\u30FB"], [[65382, 65382], "mapped", "\u30F2"], [[65383, 65383], "mapped", "\u30A1"], [[65384, 65384], "mapped", "\u30A3"], [[65385, 65385], "mapped", "\u30A5"], [[65386, 65386], "mapped", "\u30A7"], [[65387, 65387], "mapped", "\u30A9"], [[65388, 65388], "mapped", "\u30E3"], [[65389, 65389], "mapped", "\u30E5"], [[65390, 65390], "mapped", "\u30E7"], [[65391, 65391], "mapped", "\u30C3"], [[65392, 65392], "mapped", "\u30FC"], [[65393, 65393], "mapped", "\u30A2"], [[65394, 65394], "mapped", "\u30A4"], [[65395, 65395], "mapped", "\u30A6"], [[65396, 65396], "mapped", "\u30A8"], [[65397, 65397], "mapped", "\u30AA"], [[65398, 65398], "mapped", "\u30AB"], [[65399, 65399], "mapped", "\u30AD"], [[65400, 65400], "mapped", "\u30AF"], [[65401, 65401], "mapped", "\u30B1"], [[65402, 65402], "mapped", "\u30B3"], [[65403, 65403], "mapped", "\u30B5"], [[65404, 65404], "mapped", "\u30B7"], [[65405, 65405], "mapped", "\u30B9"], [[65406, 65406], "mapped", "\u30BB"], [[65407, 65407], "mapped", "\u30BD"], [[65408, 65408], "mapped", "\u30BF"], [[65409, 65409], "mapped", "\u30C1"], [[65410, 65410], "mapped", "\u30C4"], [[65411, 65411], "mapped", "\u30C6"], [[65412, 65412], "mapped", "\u30C8"], [[65413, 65413], "mapped", "\u30CA"], [[65414, 65414], "mapped", "\u30CB"], [[65415, 65415], "mapped", "\u30CC"], [[65416, 65416], "mapped", "\u30CD"], [[65417, 65417], "mapped", "\u30CE"], [[65418, 65418], "mapped", "\u30CF"], [[65419, 65419], "mapped", "\u30D2"], [[65420, 65420], "mapped", "\u30D5"], [[65421, 65421], "mapped", "\u30D8"], [[65422, 65422], "mapped", "\u30DB"], [[65423, 65423], "mapped", "\u30DE"], [[65424, 65424], "mapped", "\u30DF"], [[65425, 65425], "mapped", "\u30E0"], [[65426, 65426], "mapped", "\u30E1"], [[65427, 65427], "mapped", "\u30E2"], [[65428, 65428], "mapped", "\u30E4"], [[65429, 65429], "mapped", "\u30E6"], [[65430, 65430], "mapped", "\u30E8"], [[65431, 65431], "mapped", "\u30E9"], [[65432, 65432], "mapped", "\u30EA"], [[65433, 65433], "mapped", "\u30EB"], [[65434, 65434], "mapped", "\u30EC"], [[65435, 65435], "mapped", "\u30ED"], [[65436, 65436], "mapped", "\u30EF"], [[65437, 65437], "mapped", "\u30F3"], [[65438, 65438], "mapped", "\u3099"], [[65439, 65439], "mapped", "\u309A"], [[65440, 65440], "disallowed"], [[65441, 65441], "mapped", "\u1100"], [[65442, 65442], "mapped", "\u1101"], [[65443, 65443], "mapped", "\u11AA"], [[65444, 65444], "mapped", "\u1102"], [[65445, 65445], "mapped", "\u11AC"], [[65446, 65446], "mapped", "\u11AD"], [[65447, 65447], "mapped", "\u1103"], [[65448, 65448], "mapped", "\u1104"], [[65449, 65449], "mapped", "\u1105"], [[65450, 65450], "mapped", "\u11B0"], [[65451, 65451], "mapped", "\u11B1"], [[65452, 65452], "mapped", "\u11B2"], [[65453, 65453], "mapped", "\u11B3"], [[65454, 65454], "mapped", "\u11B4"], [[65455, 65455], "mapped", "\u11B5"], [[65456, 65456], "mapped", "\u111A"], [[65457, 65457], "mapped", "\u1106"], [[65458, 65458], "mapped", "\u1107"], [[65459, 65459], "mapped", "\u1108"], [[65460, 65460], "mapped", "\u1121"], [[65461, 65461], "mapped", "\u1109"], [[65462, 65462], "mapped", "\u110A"], [[65463, 65463], "mapped", "\u110B"], [[65464, 65464], "mapped", "\u110C"], [[65465, 65465], "mapped", "\u110D"], [[65466, 65466], "mapped", "\u110E"], [[65467, 65467], "mapped", "\u110F"], [[65468, 65468], "mapped", "\u1110"], [[65469, 65469], "mapped", "\u1111"], [[65470, 65470], "mapped", "\u1112"], [[65471, 65473], "disallowed"], [[65474, 65474], "mapped", "\u1161"], [[65475, 65475], "mapped", "\u1162"], [[65476, 65476], "mapped", "\u1163"], [[65477, 65477], "mapped", "\u1164"], [[65478, 65478], "mapped", "\u1165"], [[65479, 65479], "mapped", "\u1166"], [[65480, 65481], "disallowed"], [[65482, 65482], "mapped", "\u1167"], [[65483, 65483], "mapped", "\u1168"], [[65484, 65484], "mapped", "\u1169"], [[65485, 65485], "mapped", "\u116A"], [[65486, 65486], "mapped", "\u116B"], [[65487, 65487], "mapped", "\u116C"], [[65488, 65489], "disallowed"], [[65490, 65490], "mapped", "\u116D"], [[65491, 65491], "mapped", "\u116E"], [[65492, 65492], "mapped", "\u116F"], [[65493, 65493], "mapped", "\u1170"], [[65494, 65494], "mapped", "\u1171"], [[65495, 65495], "mapped", "\u1172"], [[65496, 65497], "disallowed"], [[65498, 65498], "mapped", "\u1173"], [[65499, 65499], "mapped", "\u1174"], [[65500, 65500], "mapped", "\u1175"], [[65501, 65503], "disallowed"], [[65504, 65504], "mapped", "\xA2"], [[65505, 65505], "mapped", "\xA3"], [[65506, 65506], "mapped", "\xAC"], [[65507, 65507], "disallowed_STD3_mapped", " \u0304"], [[65508, 65508], "mapped", "\xA6"], [[65509, 65509], "mapped", "\xA5"], [[65510, 65510], "mapped", "\u20A9"], [[65511, 65511], "disallowed"], [[65512, 65512], "mapped", "\u2502"], [[65513, 65513], "mapped", "\u2190"], [[65514, 65514], "mapped", "\u2191"], [[65515, 65515], "mapped", "\u2192"], [[65516, 65516], "mapped", "\u2193"], [[65517, 65517], "mapped", "\u25A0"], [[65518, 65518], "mapped", "\u25CB"], [[65519, 65528], "disallowed"], [[65529, 65531], "disallowed"], [[65532, 65532], "disallowed"], [[65533, 65533], "disallowed"], [[65534, 65535], "disallowed"], [[65536, 65547], "valid"], [[65548, 65548], "disallowed"], [[65549, 65574], "valid"], [[65575, 65575], "disallowed"], [[65576, 65594], "valid"], [[65595, 65595], "disallowed"], [[65596, 65597], "valid"], [[65598, 65598], "disallowed"], [[65599, 65613], "valid"], [[65614, 65615], "disallowed"], [[65616, 65629], "valid"], [[65630, 65663], "disallowed"], [[65664, 65786], "valid"], [[65787, 65791], "disallowed"], [[65792, 65794], "valid", "", "NV8"], [[65795, 65798], "disallowed"], [[65799, 65843], "valid", "", "NV8"], [[65844, 65846], "disallowed"], [[65847, 65855], "valid", "", "NV8"], [[65856, 65930], "valid", "", "NV8"], [[65931, 65932], "valid", "", "NV8"], [[65933, 65934], "valid", "", "NV8"], [[65935, 65935], "disallowed"], [[65936, 65947], "valid", "", "NV8"], [[65948, 65951], "disallowed"], [[65952, 65952], "valid", "", "NV8"], [[65953, 65999], "disallowed"], [[66e3, 66044], "valid", "", "NV8"], [[66045, 66045], "valid"], [[66046, 66175], "disallowed"], [[66176, 66204], "valid"], [[66205, 66207], "disallowed"], [[66208, 66256], "valid"], [[66257, 66271], "disallowed"], [[66272, 66272], "valid"], [[66273, 66299], "valid", "", "NV8"], [[66300, 66303], "disallowed"], [[66304, 66334], "valid"], [[66335, 66335], "valid"], [[66336, 66339], "valid", "", "NV8"], [[66340, 66348], "disallowed"], [[66349, 66351], "valid"], [[66352, 66368], "valid"], [[66369, 66369], "valid", "", "NV8"], [[66370, 66377], "valid"], [[66378, 66378], "valid", "", "NV8"], [[66379, 66383], "disallowed"], [[66384, 66426], "valid"], [[66427, 66431], "disallowed"], [[66432, 66461], "valid"], [[66462, 66462], "disallowed"], [[66463, 66463], "valid", "", "NV8"], [[66464, 66499], "valid"], [[66500, 66503], "disallowed"], [[66504, 66511], "valid"], [[66512, 66517], "valid", "", "NV8"], [[66518, 66559], "disallowed"], [[66560, 66560], "mapped", "\u{10428}"], [[66561, 66561], "mapped", "\u{10429}"], [[66562, 66562], "mapped", "\u{1042A}"], [[66563, 66563], "mapped", "\u{1042B}"], [[66564, 66564], "mapped", "\u{1042C}"], [[66565, 66565], "mapped", "\u{1042D}"], [[66566, 66566], "mapped", "\u{1042E}"], [[66567, 66567], "mapped", "\u{1042F}"], [[66568, 66568], "mapped", "\u{10430}"], [[66569, 66569], "mapped", "\u{10431}"], [[66570, 66570], "mapped", "\u{10432}"], [[66571, 66571], "mapped", "\u{10433}"], [[66572, 66572], "mapped", "\u{10434}"], [[66573, 66573], "mapped", "\u{10435}"], [[66574, 66574], "mapped", "\u{10436}"], [[66575, 66575], "mapped", "\u{10437}"], [[66576, 66576], "mapped", "\u{10438}"], [[66577, 66577], "mapped", "\u{10439}"], [[66578, 66578], "mapped", "\u{1043A}"], [[66579, 66579], "mapped", "\u{1043B}"], [[66580, 66580], "mapped", "\u{1043C}"], [[66581, 66581], "mapped", "\u{1043D}"], [[66582, 66582], "mapped", "\u{1043E}"], [[66583, 66583], "mapped", "\u{1043F}"], [[66584, 66584], "mapped", "\u{10440}"], [[66585, 66585], "mapped", "\u{10441}"], [[66586, 66586], "mapped", "\u{10442}"], [[66587, 66587], "mapped", "\u{10443}"], [[66588, 66588], "mapped", "\u{10444}"], [[66589, 66589], "mapped", "\u{10445}"], [[66590, 66590], "mapped", "\u{10446}"], [[66591, 66591], "mapped", "\u{10447}"], [[66592, 66592], "mapped", "\u{10448}"], [[66593, 66593], "mapped", "\u{10449}"], [[66594, 66594], "mapped", "\u{1044A}"], [[66595, 66595], "mapped", "\u{1044B}"], [[66596, 66596], "mapped", "\u{1044C}"], [[66597, 66597], "mapped", "\u{1044D}"], [[66598, 66598], "mapped", "\u{1044E}"], [[66599, 66599], "mapped", "\u{1044F}"], [[66600, 66637], "valid"], [[66638, 66717], "valid"], [[66718, 66719], "disallowed"], [[66720, 66729], "valid"], [[66730, 66735], "disallowed"], [[66736, 66736], "mapped", "\u{104D8}"], [[66737, 66737], "mapped", "\u{104D9}"], [[66738, 66738], "mapped", "\u{104DA}"], [[66739, 66739], "mapped", "\u{104DB}"], [[66740, 66740], "mapped", "\u{104DC}"], [[66741, 66741], "mapped", "\u{104DD}"], [[66742, 66742], "mapped", "\u{104DE}"], [[66743, 66743], "mapped", "\u{104DF}"], [[66744, 66744], "mapped", "\u{104E0}"], [[66745, 66745], "mapped", "\u{104E1}"], [[66746, 66746], "mapped", "\u{104E2}"], [[66747, 66747], "mapped", "\u{104E3}"], [[66748, 66748], "mapped", "\u{104E4}"], [[66749, 66749], "mapped", "\u{104E5}"], [[66750, 66750], "mapped", "\u{104E6}"], [[66751, 66751], "mapped", "\u{104E7}"], [[66752, 66752], "mapped", "\u{104E8}"], [[66753, 66753], "mapped", "\u{104E9}"], [[66754, 66754], "mapped", "\u{104EA}"], [[66755, 66755], "mapped", "\u{104EB}"], [[66756, 66756], "mapped", "\u{104EC}"], [[66757, 66757], "mapped", "\u{104ED}"], [[66758, 66758], "mapped", "\u{104EE}"], [[66759, 66759], "mapped", "\u{104EF}"], [[66760, 66760], "mapped", "\u{104F0}"], [[66761, 66761], "mapped", "\u{104F1}"], [[66762, 66762], "mapped", "\u{104F2}"], [[66763, 66763], "mapped", "\u{104F3}"], [[66764, 66764], "mapped", "\u{104F4}"], [[66765, 66765], "mapped", "\u{104F5}"], [[66766, 66766], "mapped", "\u{104F6}"], [[66767, 66767], "mapped", "\u{104F7}"], [[66768, 66768], "mapped", "\u{104F8}"], [[66769, 66769], "mapped", "\u{104F9}"], [[66770, 66770], "mapped", "\u{104FA}"], [[66771, 66771], "mapped", "\u{104FB}"], [[66772, 66775], "disallowed"], [[66776, 66811], "valid"], [[66812, 66815], "disallowed"], [[66816, 66855], "valid"], [[66856, 66863], "disallowed"], [[66864, 66915], "valid"], [[66916, 66926], "disallowed"], [[66927, 66927], "valid", "", "NV8"], [[66928, 67071], "disallowed"], [[67072, 67382], "valid"], [[67383, 67391], "disallowed"], [[67392, 67413], "valid"], [[67414, 67423], "disallowed"], [[67424, 67431], "valid"], [[67432, 67583], "disallowed"], [[67584, 67589], "valid"], [[67590, 67591], "disallowed"], [[67592, 67592], "valid"], [[67593, 67593], "disallowed"], [[67594, 67637], "valid"], [[67638, 67638], "disallowed"], [[67639, 67640], "valid"], [[67641, 67643], "disallowed"], [[67644, 67644], "valid"], [[67645, 67646], "disallowed"], [[67647, 67647], "valid"], [[67648, 67669], "valid"], [[67670, 67670], "disallowed"], [[67671, 67679], "valid", "", "NV8"], [[67680, 67702], "valid"], [[67703, 67711], "valid", "", "NV8"], [[67712, 67742], "valid"], [[67743, 67750], "disallowed"], [[67751, 67759], "valid", "", "NV8"], [[67760, 67807], "disallowed"], [[67808, 67826], "valid"], [[67827, 67827], "disallowed"], [[67828, 67829], "valid"], [[67830, 67834], "disallowed"], [[67835, 67839], "valid", "", "NV8"], [[67840, 67861], "valid"], [[67862, 67865], "valid", "", "NV8"], [[67866, 67867], "valid", "", "NV8"], [[67868, 67870], "disallowed"], [[67871, 67871], "valid", "", "NV8"], [[67872, 67897], "valid"], [[67898, 67902], "disallowed"], [[67903, 67903], "valid", "", "NV8"], [[67904, 67967], "disallowed"], [[67968, 68023], "valid"], [[68024, 68027], "disallowed"], [[68028, 68029], "valid", "", "NV8"], [[68030, 68031], "valid"], [[68032, 68047], "valid", "", "NV8"], [[68048, 68049], "disallowed"], [[68050, 68095], "valid", "", "NV8"], [[68096, 68099], "valid"], [[68100, 68100], "disallowed"], [[68101, 68102], "valid"], [[68103, 68107], "disallowed"], [[68108, 68115], "valid"], [[68116, 68116], "disallowed"], [[68117, 68119], "valid"], [[68120, 68120], "disallowed"], [[68121, 68147], "valid"], [[68148, 68151], "disallowed"], [[68152, 68154], "valid"], [[68155, 68158], "disallowed"], [[68159, 68159], "valid"], [[68160, 68167], "valid", "", "NV8"], [[68168, 68175], "disallowed"], [[68176, 68184], "valid", "", "NV8"], [[68185, 68191], "disallowed"], [[68192, 68220], "valid"], [[68221, 68223], "valid", "", "NV8"], [[68224, 68252], "valid"], [[68253, 68255], "valid", "", "NV8"], [[68256, 68287], "disallowed"], [[68288, 68295], "valid"], [[68296, 68296], "valid", "", "NV8"], [[68297, 68326], "valid"], [[68327, 68330], "disallowed"], [[68331, 68342], "valid", "", "NV8"], [[68343, 68351], "disallowed"], [[68352, 68405], "valid"], [[68406, 68408], "disallowed"], [[68409, 68415], "valid", "", "NV8"], [[68416, 68437], "valid"], [[68438, 68439], "disallowed"], [[68440, 68447], "valid", "", "NV8"], [[68448, 68466], "valid"], [[68467, 68471], "disallowed"], [[68472, 68479], "valid", "", "NV8"], [[68480, 68497], "valid"], [[68498, 68504], "disallowed"], [[68505, 68508], "valid", "", "NV8"], [[68509, 68520], "disallowed"], [[68521, 68527], "valid", "", "NV8"], [[68528, 68607], "disallowed"], [[68608, 68680], "valid"], [[68681, 68735], "disallowed"], [[68736, 68736], "mapped", "\u{10CC0}"], [[68737, 68737], "mapped", "\u{10CC1}"], [[68738, 68738], "mapped", "\u{10CC2}"], [[68739, 68739], "mapped", "\u{10CC3}"], [[68740, 68740], "mapped", "\u{10CC4}"], [[68741, 68741], "mapped", "\u{10CC5}"], [[68742, 68742], "mapped", "\u{10CC6}"], [[68743, 68743], "mapped", "\u{10CC7}"], [[68744, 68744], "mapped", "\u{10CC8}"], [[68745, 68745], "mapped", "\u{10CC9}"], [[68746, 68746], "mapped", "\u{10CCA}"], [[68747, 68747], "mapped", "\u{10CCB}"], [[68748, 68748], "mapped", "\u{10CCC}"], [[68749, 68749], "mapped", "\u{10CCD}"], [[68750, 68750], "mapped", "\u{10CCE}"], [[68751, 68751], "mapped", "\u{10CCF}"], [[68752, 68752], "mapped", "\u{10CD0}"], [[68753, 68753], "mapped", "\u{10CD1}"], [[68754, 68754], "mapped", "\u{10CD2}"], [[68755, 68755], "mapped", "\u{10CD3}"], [[68756, 68756], "mapped", "\u{10CD4}"], [[68757, 68757], "mapped", "\u{10CD5}"], [[68758, 68758], "mapped", "\u{10CD6}"], [[68759, 68759], "mapped", "\u{10CD7}"], [[68760, 68760], "mapped", "\u{10CD8}"], [[68761, 68761], "mapped", "\u{10CD9}"], [[68762, 68762], "mapped", "\u{10CDA}"], [[68763, 68763], "mapped", "\u{10CDB}"], [[68764, 68764], "mapped", "\u{10CDC}"], [[68765, 68765], "mapped", "\u{10CDD}"], [[68766, 68766], "mapped", "\u{10CDE}"], [[68767, 68767], "mapped", "\u{10CDF}"], [[68768, 68768], "mapped", "\u{10CE0}"], [[68769, 68769], "mapped", "\u{10CE1}"], [[68770, 68770], "mapped", "\u{10CE2}"], [[68771, 68771], "mapped", "\u{10CE3}"], [[68772, 68772], "mapped", "\u{10CE4}"], [[68773, 68773], "mapped", "\u{10CE5}"], [[68774, 68774], "mapped", "\u{10CE6}"], [[68775, 68775], "mapped", "\u{10CE7}"], [[68776, 68776], "mapped", "\u{10CE8}"], [[68777, 68777], "mapped", "\u{10CE9}"], [[68778, 68778], "mapped", "\u{10CEA}"], [[68779, 68779], "mapped", "\u{10CEB}"], [[68780, 68780], "mapped", "\u{10CEC}"], [[68781, 68781], "mapped", "\u{10CED}"], [[68782, 68782], "mapped", "\u{10CEE}"], [[68783, 68783], "mapped", "\u{10CEF}"], [[68784, 68784], "mapped", "\u{10CF0}"], [[68785, 68785], "mapped", "\u{10CF1}"], [[68786, 68786], "mapped", "\u{10CF2}"], [[68787, 68799], "disallowed"], [[68800, 68850], "valid"], [[68851, 68857], "disallowed"], [[68858, 68863], "valid", "", "NV8"], [[68864, 69215], "disallowed"], [[69216, 69246], "valid", "", "NV8"], [[69247, 69631], "disallowed"], [[69632, 69702], "valid"], [[69703, 69709], "valid", "", "NV8"], [[69710, 69713], "disallowed"], [[69714, 69733], "valid", "", "NV8"], [[69734, 69743], "valid"], [[69744, 69758], "disallowed"], [[69759, 69759], "valid"], [[69760, 69818], "valid"], [[69819, 69820], "valid", "", "NV8"], [[69821, 69821], "disallowed"], [[69822, 69825], "valid", "", "NV8"], [[69826, 69839], "disallowed"], [[69840, 69864], "valid"], [[69865, 69871], "disallowed"], [[69872, 69881], "valid"], [[69882, 69887], "disallowed"], [[69888, 69940], "valid"], [[69941, 69941], "disallowed"], [[69942, 69951], "valid"], [[69952, 69955], "valid", "", "NV8"], [[69956, 69967], "disallowed"], [[69968, 70003], "valid"], [[70004, 70005], "valid", "", "NV8"], [[70006, 70006], "valid"], [[70007, 70015], "disallowed"], [[70016, 70084], "valid"], [[70085, 70088], "valid", "", "NV8"], [[70089, 70089], "valid", "", "NV8"], [[70090, 70092], "valid"], [[70093, 70093], "valid", "", "NV8"], [[70094, 70095], "disallowed"], [[70096, 70105], "valid"], [[70106, 70106], "valid"], [[70107, 70107], "valid", "", "NV8"], [[70108, 70108], "valid"], [[70109, 70111], "valid", "", "NV8"], [[70112, 70112], "disallowed"], [[70113, 70132], "valid", "", "NV8"], [[70133, 70143], "disallowed"], [[70144, 70161], "valid"], [[70162, 70162], "disallowed"], [[70163, 70199], "valid"], [[70200, 70205], "valid", "", "NV8"], [[70206, 70206], "valid"], [[70207, 70271], "disallowed"], [[70272, 70278], "valid"], [[70279, 70279], "disallowed"], [[70280, 70280], "valid"], [[70281, 70281], "disallowed"], [[70282, 70285], "valid"], [[70286, 70286], "disallowed"], [[70287, 70301], "valid"], [[70302, 70302], "disallowed"], [[70303, 70312], "valid"], [[70313, 70313], "valid", "", "NV8"], [[70314, 70319], "disallowed"], [[70320, 70378], "valid"], [[70379, 70383], "disallowed"], [[70384, 70393], "valid"], [[70394, 70399], "disallowed"], [[70400, 70400], "valid"], [[70401, 70403], "valid"], [[70404, 70404], "disallowed"], [[70405, 70412], "valid"], [[70413, 70414], "disallowed"], [[70415, 70416], "valid"], [[70417, 70418], "disallowed"], [[70419, 70440], "valid"], [[70441, 70441], "disallowed"], [[70442, 70448], "valid"], [[70449, 70449], "disallowed"], [[70450, 70451], "valid"], [[70452, 70452], "disallowed"], [[70453, 70457], "valid"], [[70458, 70459], "disallowed"], [[70460, 70468], "valid"], [[70469, 70470], "disallowed"], [[70471, 70472], "valid"], [[70473, 70474], "disallowed"], [[70475, 70477], "valid"], [[70478, 70479], "disallowed"], [[70480, 70480], "valid"], [[70481, 70486], "disallowed"], [[70487, 70487], "valid"], [[70488, 70492], "disallowed"], [[70493, 70499], "valid"], [[70500, 70501], "disallowed"], [[70502, 70508], "valid"], [[70509, 70511], "disallowed"], [[70512, 70516], "valid"], [[70517, 70655], "disallowed"], [[70656, 70730], "valid"], [[70731, 70735], "valid", "", "NV8"], [[70736, 70745], "valid"], [[70746, 70746], "disallowed"], [[70747, 70747], "valid", "", "NV8"], [[70748, 70748], "disallowed"], [[70749, 70749], "valid", "", "NV8"], [[70750, 70783], "disallowed"], [[70784, 70853], "valid"], [[70854, 70854], "valid", "", "NV8"], [[70855, 70855], "valid"], [[70856, 70863], "disallowed"], [[70864, 70873], "valid"], [[70874, 71039], "disallowed"], [[71040, 71093], "valid"], [[71094, 71095], "disallowed"], [[71096, 71104], "valid"], [[71105, 71113], "valid", "", "NV8"], [[71114, 71127], "valid", "", "NV8"], [[71128, 71133], "valid"], [[71134, 71167], "disallowed"], [[71168, 71232], "valid"], [[71233, 71235], "valid", "", "NV8"], [[71236, 71236], "valid"], [[71237, 71247], "disallowed"], [[71248, 71257], "valid"], [[71258, 71263], "disallowed"], [[71264, 71276], "valid", "", "NV8"], [[71277, 71295], "disallowed"], [[71296, 71351], "valid"], [[71352, 71359], "disallowed"], [[71360, 71369], "valid"], [[71370, 71423], "disallowed"], [[71424, 71449], "valid"], [[71450, 71452], "disallowed"], [[71453, 71467], "valid"], [[71468, 71471], "disallowed"], [[71472, 71481], "valid"], [[71482, 71487], "valid", "", "NV8"], [[71488, 71839], "disallowed"], [[71840, 71840], "mapped", "\u{118C0}"], [[71841, 71841], "mapped", "\u{118C1}"], [[71842, 71842], "mapped", "\u{118C2}"], [[71843, 71843], "mapped", "\u{118C3}"], [[71844, 71844], "mapped", "\u{118C4}"], [[71845, 71845], "mapped", "\u{118C5}"], [[71846, 71846], "mapped", "\u{118C6}"], [[71847, 71847], "mapped", "\u{118C7}"], [[71848, 71848], "mapped", "\u{118C8}"], [[71849, 71849], "mapped", "\u{118C9}"], [[71850, 71850], "mapped", "\u{118CA}"], [[71851, 71851], "mapped", "\u{118CB}"], [[71852, 71852], "mapped", "\u{118CC}"], [[71853, 71853], "mapped", "\u{118CD}"], [[71854, 71854], "mapped", "\u{118CE}"], [[71855, 71855], "mapped", "\u{118CF}"], [[71856, 71856], "mapped", "\u{118D0}"], [[71857, 71857], "mapped", "\u{118D1}"], [[71858, 71858], "mapped", "\u{118D2}"], [[71859, 71859], "mapped", "\u{118D3}"], [[71860, 71860], "mapped", "\u{118D4}"], [[71861, 71861], "mapped", "\u{118D5}"], [[71862, 71862], "mapped", "\u{118D6}"], [[71863, 71863], "mapped", "\u{118D7}"], [[71864, 71864], "mapped", "\u{118D8}"], [[71865, 71865], "mapped", "\u{118D9}"], [[71866, 71866], "mapped", "\u{118DA}"], [[71867, 71867], "mapped", "\u{118DB}"], [[71868, 71868], "mapped", "\u{118DC}"], [[71869, 71869], "mapped", "\u{118DD}"], [[71870, 71870], "mapped", "\u{118DE}"], [[71871, 71871], "mapped", "\u{118DF}"], [[71872, 71913], "valid"], [[71914, 71922], "valid", "", "NV8"], [[71923, 71934], "disallowed"], [[71935, 71935], "valid"], [[71936, 72191], "disallowed"], [[72192, 72254], "valid"], [[72255, 72262], "valid", "", "NV8"], [[72263, 72263], "valid"], [[72264, 72271], "disallowed"], [[72272, 72323], "valid"], [[72324, 72325], "disallowed"], [[72326, 72345], "valid"], [[72346, 72348], "valid", "", "NV8"], [[72349, 72349], "disallowed"], [[72350, 72354], "valid", "", "NV8"], [[72355, 72383], "disallowed"], [[72384, 72440], "valid"], [[72441, 72703], "disallowed"], [[72704, 72712], "valid"], [[72713, 72713], "disallowed"], [[72714, 72758], "valid"], [[72759, 72759], "disallowed"], [[72760, 72768], "valid"], [[72769, 72773], "valid", "", "NV8"], [[72774, 72783], "disallowed"], [[72784, 72793], "valid"], [[72794, 72812], "valid", "", "NV8"], [[72813, 72815], "disallowed"], [[72816, 72817], "valid", "", "NV8"], [[72818, 72847], "valid"], [[72848, 72849], "disallowed"], [[72850, 72871], "valid"], [[72872, 72872], "disallowed"], [[72873, 72886], "valid"], [[72887, 72959], "disallowed"], [[72960, 72966], "valid"], [[72967, 72967], "disallowed"], [[72968, 72969], "valid"], [[72970, 72970], "disallowed"], [[72971, 73014], "valid"], [[73015, 73017], "disallowed"], [[73018, 73018], "valid"], [[73019, 73019], "disallowed"], [[73020, 73021], "valid"], [[73022, 73022], "disallowed"], [[73023, 73031], "valid"], [[73032, 73039], "disallowed"], [[73040, 73049], "valid"], [[73050, 73727], "disallowed"], [[73728, 74606], "valid"], [[74607, 74648], "valid"], [[74649, 74649], "valid"], [[74650, 74751], "disallowed"], [[74752, 74850], "valid", "", "NV8"], [[74851, 74862], "valid", "", "NV8"], [[74863, 74863], "disallowed"], [[74864, 74867], "valid", "", "NV8"], [[74868, 74868], "valid", "", "NV8"], [[74869, 74879], "disallowed"], [[74880, 75075], "valid"], [[75076, 77823], "disallowed"], [[77824, 78894], "valid"], [[78895, 82943], "disallowed"], [[82944, 83526], "valid"], [[83527, 92159], "disallowed"], [[92160, 92728], "valid"], [[92729, 92735], "disallowed"], [[92736, 92766], "valid"], [[92767, 92767], "disallowed"], [[92768, 92777], "valid"], [[92778, 92781], "disallowed"], [[92782, 92783], "valid", "", "NV8"], [[92784, 92879], "disallowed"], [[92880, 92909], "valid"], [[92910, 92911], "disallowed"], [[92912, 92916], "valid"], [[92917, 92917], "valid", "", "NV8"], [[92918, 92927], "disallowed"], [[92928, 92982], "valid"], [[92983, 92991], "valid", "", "NV8"], [[92992, 92995], "valid"], [[92996, 92997], "valid", "", "NV8"], [[92998, 93007], "disallowed"], [[93008, 93017], "valid"], [[93018, 93018], "disallowed"], [[93019, 93025], "valid", "", "NV8"], [[93026, 93026], "disallowed"], [[93027, 93047], "valid"], [[93048, 93052], "disallowed"], [[93053, 93071], "valid"], [[93072, 93951], "disallowed"], [[93952, 94020], "valid"], [[94021, 94031], "disallowed"], [[94032, 94078], "valid"], [[94079, 94094], "disallowed"], [[94095, 94111], "valid"], [[94112, 94175], "disallowed"], [[94176, 94176], "valid"], [[94177, 94177], "valid"], [[94178, 94207], "disallowed"], [[94208, 100332], "valid"], [[100333, 100351], "disallowed"], [[100352, 101106], "valid"], [[101107, 110591], "disallowed"], [[110592, 110593], "valid"], [[110594, 110878], "valid"], [[110879, 110959], "disallowed"], [[110960, 111355], "valid"], [[111356, 113663], "disallowed"], [[113664, 113770], "valid"], [[113771, 113775], "disallowed"], [[113776, 113788], "valid"], [[113789, 113791], "disallowed"], [[113792, 113800], "valid"], [[113801, 113807], "disallowed"], [[113808, 113817], "valid"], [[113818, 113819], "disallowed"], [[113820, 113820], "valid", "", "NV8"], [[113821, 113822], "valid"], [[113823, 113823], "valid", "", "NV8"], [[113824, 113827], "ignored"], [[113828, 118783], "disallowed"], [[118784, 119029], "valid", "", "NV8"], [[119030, 119039], "disallowed"], [[119040, 119078], "valid", "", "NV8"], [[119079, 119080], "disallowed"], [[119081, 119081], "valid", "", "NV8"], [[119082, 119133], "valid", "", "NV8"], [[119134, 119134], "mapped", "\u{1D157}\u{1D165}"], [[119135, 119135], "mapped", "\u{1D158}\u{1D165}"], [[119136, 119136], "mapped", "\u{1D158}\u{1D165}\u{1D16E}"], [[119137, 119137], "mapped", "\u{1D158}\u{1D165}\u{1D16F}"], [[119138, 119138], "mapped", "\u{1D158}\u{1D165}\u{1D170}"], [[119139, 119139], "mapped", "\u{1D158}\u{1D165}\u{1D171}"], [[119140, 119140], "mapped", "\u{1D158}\u{1D165}\u{1D172}"], [[119141, 119154], "valid", "", "NV8"], [[119155, 119162], "disallowed"], [[119163, 119226], "valid", "", "NV8"], [[119227, 119227], "mapped", "\u{1D1B9}\u{1D165}"], [[119228, 119228], "mapped", "\u{1D1BA}\u{1D165}"], [[119229, 119229], "mapped", "\u{1D1B9}\u{1D165}\u{1D16E}"], [[119230, 119230], "mapped", "\u{1D1BA}\u{1D165}\u{1D16E}"], [[119231, 119231], "mapped", "\u{1D1B9}\u{1D165}\u{1D16F}"], [[119232, 119232], "mapped", "\u{1D1BA}\u{1D165}\u{1D16F}"], [[119233, 119261], "valid", "", "NV8"], [[119262, 119272], "valid", "", "NV8"], [[119273, 119295], "disallowed"], [[119296, 119365], "valid", "", "NV8"], [[119366, 119551], "disallowed"], [[119552, 119638], "valid", "", "NV8"], [[119639, 119647], "disallowed"], [[119648, 119665], "valid", "", "NV8"], [[119666, 119807], "disallowed"], [[119808, 119808], "mapped", "a"], [[119809, 119809], "mapped", "b"], [[119810, 119810], "mapped", "c"], [[119811, 119811], "mapped", "d"], [[119812, 119812], "mapped", "e"], [[119813, 119813], "mapped", "f"], [[119814, 119814], "mapped", "g"], [[119815, 119815], "mapped", "h"], [[119816, 119816], "mapped", "i"], [[119817, 119817], "mapped", "j"], [[119818, 119818], "mapped", "k"], [[119819, 119819], "mapped", "l"], [[119820, 119820], "mapped", "m"], [[119821, 119821], "mapped", "n"], [[119822, 119822], "mapped", "o"], [[119823, 119823], "mapped", "p"], [[119824, 119824], "mapped", "q"], [[119825, 119825], "mapped", "r"], [[119826, 119826], "mapped", "s"], [[119827, 119827], "mapped", "t"], [[119828, 119828], "mapped", "u"], [[119829, 119829], "mapped", "v"], [[119830, 119830], "mapped", "w"], [[119831, 119831], "mapped", "x"], [[119832, 119832], "mapped", "y"], [[119833, 119833], "mapped", "z"], [[119834, 119834], "mapped", "a"], [[119835, 119835], "mapped", "b"], [[119836, 119836], "mapped", "c"], [[119837, 119837], "mapped", "d"], [[119838, 119838], "mapped", "e"], [[119839, 119839], "mapped", "f"], [[119840, 119840], "mapped", "g"], [[119841, 119841], "mapped", "h"], [[119842, 119842], "mapped", "i"], [[119843, 119843], "mapped", "j"], [[119844, 119844], "mapped", "k"], [[119845, 119845], "mapped", "l"], [[119846, 119846], "mapped", "m"], [[119847, 119847], "mapped", "n"], [[119848, 119848], "mapped", "o"], [[119849, 119849], "mapped", "p"], [[119850, 119850], "mapped", "q"], [[119851, 119851], "mapped", "r"], [[119852, 119852], "mapped", "s"], [[119853, 119853], "mapped", "t"], [[119854, 119854], "mapped", "u"], [[119855, 119855], "mapped", "v"], [[119856, 119856], "mapped", "w"], [[119857, 119857], "mapped", "x"], [[119858, 119858], "mapped", "y"], [[119859, 119859], "mapped", "z"], [[119860, 119860], "mapped", "a"], [[119861, 119861], "mapped", "b"], [[119862, 119862], "mapped", "c"], [[119863, 119863], "mapped", "d"], [[119864, 119864], "mapped", "e"], [[119865, 119865], "mapped", "f"], [[119866, 119866], "mapped", "g"], [[119867, 119867], "mapped", "h"], [[119868, 119868], "mapped", "i"], [[119869, 119869], "mapped", "j"], [[119870, 119870], "mapped", "k"], [[119871, 119871], "mapped", "l"], [[119872, 119872], "mapped", "m"], [[119873, 119873], "mapped", "n"], [[119874, 119874], "mapped", "o"], [[119875, 119875], "mapped", "p"], [[119876, 119876], "mapped", "q"], [[119877, 119877], "mapped", "r"], [[119878, 119878], "mapped", "s"], [[119879, 119879], "mapped", "t"], [[119880, 119880], "mapped", "u"], [[119881, 119881], "mapped", "v"], [[119882, 119882], "mapped", "w"], [[119883, 119883], "mapped", "x"], [[119884, 119884], "mapped", "y"], [[119885, 119885], "mapped", "z"], [[119886, 119886], "mapped", "a"], [[119887, 119887], "mapped", "b"], [[119888, 119888], "mapped", "c"], [[119889, 119889], "mapped", "d"], [[119890, 119890], "mapped", "e"], [[119891, 119891], "mapped", "f"], [[119892, 119892], "mapped", "g"], [[119893, 119893], "disallowed"], [[119894, 119894], "mapped", "i"], [[119895, 119895], "mapped", "j"], [[119896, 119896], "mapped", "k"], [[119897, 119897], "mapped", "l"], [[119898, 119898], "mapped", "m"], [[119899, 119899], "mapped", "n"], [[119900, 119900], "mapped", "o"], [[119901, 119901], "mapped", "p"], [[119902, 119902], "mapped", "q"], [[119903, 119903], "mapped", "r"], [[119904, 119904], "mapped", "s"], [[119905, 119905], "mapped", "t"], [[119906, 119906], "mapped", "u"], [[119907, 119907], "mapped", "v"], [[119908, 119908], "mapped", "w"], [[119909, 119909], "mapped", "x"], [[119910, 119910], "mapped", "y"], [[119911, 119911], "mapped", "z"], [[119912, 119912], "mapped", "a"], [[119913, 119913], "mapped", "b"], [[119914, 119914], "mapped", "c"], [[119915, 119915], "mapped", "d"], [[119916, 119916], "mapped", "e"], [[119917, 119917], "mapped", "f"], [[119918, 119918], "mapped", "g"], [[119919, 119919], "mapped", "h"], [[119920, 119920], "mapped", "i"], [[119921, 119921], "mapped", "j"], [[119922, 119922], "mapped", "k"], [[119923, 119923], "mapped", "l"], [[119924, 119924], "mapped", "m"], [[119925, 119925], "mapped", "n"], [[119926, 119926], "mapped", "o"], [[119927, 119927], "mapped", "p"], [[119928, 119928], "mapped", "q"], [[119929, 119929], "mapped", "r"], [[119930, 119930], "mapped", "s"], [[119931, 119931], "mapped", "t"], [[119932, 119932], "mapped", "u"], [[119933, 119933], "mapped", "v"], [[119934, 119934], "mapped", "w"], [[119935, 119935], "mapped", "x"], [[119936, 119936], "mapped", "y"], [[119937, 119937], "mapped", "z"], [[119938, 119938], "mapped", "a"], [[119939, 119939], "mapped", "b"], [[119940, 119940], "mapped", "c"], [[119941, 119941], "mapped", "d"], [[119942, 119942], "mapped", "e"], [[119943, 119943], "mapped", "f"], [[119944, 119944], "mapped", "g"], [[119945, 119945], "mapped", "h"], [[119946, 119946], "mapped", "i"], [[119947, 119947], "mapped", "j"], [[119948, 119948], "mapped", "k"], [[119949, 119949], "mapped", "l"], [[119950, 119950], "mapped", "m"], [[119951, 119951], "mapped", "n"], [[119952, 119952], "mapped", "o"], [[119953, 119953], "mapped", "p"], [[119954, 119954], "mapped", "q"], [[119955, 119955], "mapped", "r"], [[119956, 119956], "mapped", "s"], [[119957, 119957], "mapped", "t"], [[119958, 119958], "mapped", "u"], [[119959, 119959], "mapped", "v"], [[119960, 119960], "mapped", "w"], [[119961, 119961], "mapped", "x"], [[119962, 119962], "mapped", "y"], [[119963, 119963], "mapped", "z"], [[119964, 119964], "mapped", "a"], [[119965, 119965], "disallowed"], [[119966, 119966], "mapped", "c"], [[119967, 119967], "mapped", "d"], [[119968, 119969], "disallowed"], [[119970, 119970], "mapped", "g"], [[119971, 119972], "disallowed"], [[119973, 119973], "mapped", "j"], [[119974, 119974], "mapped", "k"], [[119975, 119976], "disallowed"], [[119977, 119977], "mapped", "n"], [[119978, 119978], "mapped", "o"], [[119979, 119979], "mapped", "p"], [[119980, 119980], "mapped", "q"], [[119981, 119981], "disallowed"], [[119982, 119982], "mapped", "s"], [[119983, 119983], "mapped", "t"], [[119984, 119984], "mapped", "u"], [[119985, 119985], "mapped", "v"], [[119986, 119986], "mapped", "w"], [[119987, 119987], "mapped", "x"], [[119988, 119988], "mapped", "y"], [[119989, 119989], "mapped", "z"], [[119990, 119990], "mapped", "a"], [[119991, 119991], "mapped", "b"], [[119992, 119992], "mapped", "c"], [[119993, 119993], "mapped", "d"], [[119994, 119994], "disallowed"], [[119995, 119995], "mapped", "f"], [[119996, 119996], "disallowed"], [[119997, 119997], "mapped", "h"], [[119998, 119998], "mapped", "i"], [[119999, 119999], "mapped", "j"], [[12e4, 12e4], "mapped", "k"], [[120001, 120001], "mapped", "l"], [[120002, 120002], "mapped", "m"], [[120003, 120003], "mapped", "n"], [[120004, 120004], "disallowed"], [[120005, 120005], "mapped", "p"], [[120006, 120006], "mapped", "q"], [[120007, 120007], "mapped", "r"], [[120008, 120008], "mapped", "s"], [[120009, 120009], "mapped", "t"], [[120010, 120010], "mapped", "u"], [[120011, 120011], "mapped", "v"], [[120012, 120012], "mapped", "w"], [[120013, 120013], "mapped", "x"], [[120014, 120014], "mapped", "y"], [[120015, 120015], "mapped", "z"], [[120016, 120016], "mapped", "a"], [[120017, 120017], "mapped", "b"], [[120018, 120018], "mapped", "c"], [[120019, 120019], "mapped", "d"], [[120020, 120020], "mapped", "e"], [[120021, 120021], "mapped", "f"], [[120022, 120022], "mapped", "g"], [[120023, 120023], "mapped", "h"], [[120024, 120024], "mapped", "i"], [[120025, 120025], "mapped", "j"], [[120026, 120026], "mapped", "k"], [[120027, 120027], "mapped", "l"], [[120028, 120028], "mapped", "m"], [[120029, 120029], "mapped", "n"], [[120030, 120030], "mapped", "o"], [[120031, 120031], "mapped", "p"], [[120032, 120032], "mapped", "q"], [[120033, 120033], "mapped", "r"], [[120034, 120034], "mapped", "s"], [[120035, 120035], "mapped", "t"], [[120036, 120036], "mapped", "u"], [[120037, 120037], "mapped", "v"], [[120038, 120038], "mapped", "w"], [[120039, 120039], "mapped", "x"], [[120040, 120040], "mapped", "y"], [[120041, 120041], "mapped", "z"], [[120042, 120042], "mapped", "a"], [[120043, 120043], "mapped", "b"], [[120044, 120044], "mapped", "c"], [[120045, 120045], "mapped", "d"], [[120046, 120046], "mapped", "e"], [[120047, 120047], "mapped", "f"], [[120048, 120048], "mapped", "g"], [[120049, 120049], "mapped", "h"], [[120050, 120050], "mapped", "i"], [[120051, 120051], "mapped", "j"], [[120052, 120052], "mapped", "k"], [[120053, 120053], "mapped", "l"], [[120054, 120054], "mapped", "m"], [[120055, 120055], "mapped", "n"], [[120056, 120056], "mapped", "o"], [[120057, 120057], "mapped", "p"], [[120058, 120058], "mapped", "q"], [[120059, 120059], "mapped", "r"], [[120060, 120060], "mapped", "s"], [[120061, 120061], "mapped", "t"], [[120062, 120062], "mapped", "u"], [[120063, 120063], "mapped", "v"], [[120064, 120064], "mapped", "w"], [[120065, 120065], "mapped", "x"], [[120066, 120066], "mapped", "y"], [[120067, 120067], "mapped", "z"], [[120068, 120068], "mapped", "a"], [[120069, 120069], "mapped", "b"], [[120070, 120070], "disallowed"], [[120071, 120071], "mapped", "d"], [[120072, 120072], "mapped", "e"], [[120073, 120073], "mapped", "f"], [[120074, 120074], "mapped", "g"], [[120075, 120076], "disallowed"], [[120077, 120077], "mapped", "j"], [[120078, 120078], "mapped", "k"], [[120079, 120079], "mapped", "l"], [[120080, 120080], "mapped", "m"], [[120081, 120081], "mapped", "n"], [[120082, 120082], "mapped", "o"], [[120083, 120083], "mapped", "p"], [[120084, 120084], "mapped", "q"], [[120085, 120085], "disallowed"], [[120086, 120086], "mapped", "s"], [[120087, 120087], "mapped", "t"], [[120088, 120088], "mapped", "u"], [[120089, 120089], "mapped", "v"], [[120090, 120090], "mapped", "w"], [[120091, 120091], "mapped", "x"], [[120092, 120092], "mapped", "y"], [[120093, 120093], "disallowed"], [[120094, 120094], "mapped", "a"], [[120095, 120095], "mapped", "b"], [[120096, 120096], "mapped", "c"], [[120097, 120097], "mapped", "d"], [[120098, 120098], "mapped", "e"], [[120099, 120099], "mapped", "f"], [[120100, 120100], "mapped", "g"], [[120101, 120101], "mapped", "h"], [[120102, 120102], "mapped", "i"], [[120103, 120103], "mapped", "j"], [[120104, 120104], "mapped", "k"], [[120105, 120105], "mapped", "l"], [[120106, 120106], "mapped", "m"], [[120107, 120107], "mapped", "n"], [[120108, 120108], "mapped", "o"], [[120109, 120109], "mapped", "p"], [[120110, 120110], "mapped", "q"], [[120111, 120111], "mapped", "r"], [[120112, 120112], "mapped", "s"], [[120113, 120113], "mapped", "t"], [[120114, 120114], "mapped", "u"], [[120115, 120115], "mapped", "v"], [[120116, 120116], "mapped", "w"], [[120117, 120117], "mapped", "x"], [[120118, 120118], "mapped", "y"], [[120119, 120119], "mapped", "z"], [[120120, 120120], "mapped", "a"], [[120121, 120121], "mapped", "b"], [[120122, 120122], "disallowed"], [[120123, 120123], "mapped", "d"], [[120124, 120124], "mapped", "e"], [[120125, 120125], "mapped", "f"], [[120126, 120126], "mapped", "g"], [[120127, 120127], "disallowed"], [[120128, 120128], "mapped", "i"], [[120129, 120129], "mapped", "j"], [[120130, 120130], "mapped", "k"], [[120131, 120131], "mapped", "l"], [[120132, 120132], "mapped", "m"], [[120133, 120133], "disallowed"], [[120134, 120134], "mapped", "o"], [[120135, 120137], "disallowed"], [[120138, 120138], "mapped", "s"], [[120139, 120139], "mapped", "t"], [[120140, 120140], "mapped", "u"], [[120141, 120141], "mapped", "v"], [[120142, 120142], "mapped", "w"], [[120143, 120143], "mapped", "x"], [[120144, 120144], "mapped", "y"], [[120145, 120145], "disallowed"], [[120146, 120146], "mapped", "a"], [[120147, 120147], "mapped", "b"], [[120148, 120148], "mapped", "c"], [[120149, 120149], "mapped", "d"], [[120150, 120150], "mapped", "e"], [[120151, 120151], "mapped", "f"], [[120152, 120152], "mapped", "g"], [[120153, 120153], "mapped", "h"], [[120154, 120154], "mapped", "i"], [[120155, 120155], "mapped", "j"], [[120156, 120156], "mapped", "k"], [[120157, 120157], "mapped", "l"], [[120158, 120158], "mapped", "m"], [[120159, 120159], "mapped", "n"], [[120160, 120160], "mapped", "o"], [[120161, 120161], "mapped", "p"], [[120162, 120162], "mapped", "q"], [[120163, 120163], "mapped", "r"], [[120164, 120164], "mapped", "s"], [[120165, 120165], "mapped", "t"], [[120166, 120166], "mapped", "u"], [[120167, 120167], "mapped", "v"], [[120168, 120168], "mapped", "w"], [[120169, 120169], "mapped", "x"], [[120170, 120170], "mapped", "y"], [[120171, 120171], "mapped", "z"], [[120172, 120172], "mapped", "a"], [[120173, 120173], "mapped", "b"], [[120174, 120174], "mapped", "c"], [[120175, 120175], "mapped", "d"], [[120176, 120176], "mapped", "e"], [[120177, 120177], "mapped", "f"], [[120178, 120178], "mapped", "g"], [[120179, 120179], "mapped", "h"], [[120180, 120180], "mapped", "i"], [[120181, 120181], "mapped", "j"], [[120182, 120182], "mapped", "k"], [[120183, 120183], "mapped", "l"], [[120184, 120184], "mapped", "m"], [[120185, 120185], "mapped", "n"], [[120186, 120186], "mapped", "o"], [[120187, 120187], "mapped", "p"], [[120188, 120188], "mapped", "q"], [[120189, 120189], "mapped", "r"], [[120190, 120190], "mapped", "s"], [[120191, 120191], "mapped", "t"], [[120192, 120192], "mapped", "u"], [[120193, 120193], "mapped", "v"], [[120194, 120194], "mapped", "w"], [[120195, 120195], "mapped", "x"], [[120196, 120196], "mapped", "y"], [[120197, 120197], "mapped", "z"], [[120198, 120198], "mapped", "a"], [[120199, 120199], "mapped", "b"], [[120200, 120200], "mapped", "c"], [[120201, 120201], "mapped", "d"], [[120202, 120202], "mapped", "e"], [[120203, 120203], "mapped", "f"], [[120204, 120204], "mapped", "g"], [[120205, 120205], "mapped", "h"], [[120206, 120206], "mapped", "i"], [[120207, 120207], "mapped", "j"], [[120208, 120208], "mapped", "k"], [[120209, 120209], "mapped", "l"], [[120210, 120210], "mapped", "m"], [[120211, 120211], "mapped", "n"], [[120212, 120212], "mapped", "o"], [[120213, 120213], "mapped", "p"], [[120214, 120214], "mapped", "q"], [[120215, 120215], "mapped", "r"], [[120216, 120216], "mapped", "s"], [[120217, 120217], "mapped", "t"], [[120218, 120218], "mapped", "u"], [[120219, 120219], "mapped", "v"], [[120220, 120220], "mapped", "w"], [[120221, 120221], "mapped", "x"], [[120222, 120222], "mapped", "y"], [[120223, 120223], "mapped", "z"], [[120224, 120224], "mapped", "a"], [[120225, 120225], "mapped", "b"], [[120226, 120226], "mapped", "c"], [[120227, 120227], "mapped", "d"], [[120228, 120228], "mapped", "e"], [[120229, 120229], "mapped", "f"], [[120230, 120230], "mapped", "g"], [[120231, 120231], "mapped", "h"], [[120232, 120232], "mapped", "i"], [[120233, 120233], "mapped", "j"], [[120234, 120234], "mapped", "k"], [[120235, 120235], "mapped", "l"], [[120236, 120236], "mapped", "m"], [[120237, 120237], "mapped", "n"], [[120238, 120238], "mapped", "o"], [[120239, 120239], "mapped", "p"], [[120240, 120240], "mapped", "q"], [[120241, 120241], "mapped", "r"], [[120242, 120242], "mapped", "s"], [[120243, 120243], "mapped", "t"], [[120244, 120244], "mapped", "u"], [[120245, 120245], "mapped", "v"], [[120246, 120246], "mapped", "w"], [[120247, 120247], "mapped", "x"], [[120248, 120248], "mapped", "y"], [[120249, 120249], "mapped", "z"], [[120250, 120250], "mapped", "a"], [[120251, 120251], "mapped", "b"], [[120252, 120252], "mapped", "c"], [[120253, 120253], "mapped", "d"], [[120254, 120254], "mapped", "e"], [[120255, 120255], "mapped", "f"], [[120256, 120256], "mapped", "g"], [[120257, 120257], "mapped", "h"], [[120258, 120258], "mapped", "i"], [[120259, 120259], "mapped", "j"], [[120260, 120260], "mapped", "k"], [[120261, 120261], "mapped", "l"], [[120262, 120262], "mapped", "m"], [[120263, 120263], "mapped", "n"], [[120264, 120264], "mapped", "o"], [[120265, 120265], "mapped", "p"], [[120266, 120266], "mapped", "q"], [[120267, 120267], "mapped", "r"], [[120268, 120268], "mapped", "s"], [[120269, 120269], "mapped", "t"], [[120270, 120270], "mapped", "u"], [[120271, 120271], "mapped", "v"], [[120272, 120272], "mapped", "w"], [[120273, 120273], "mapped", "x"], [[120274, 120274], "mapped", "y"], [[120275, 120275], "mapped", "z"], [[120276, 120276], "mapped", "a"], [[120277, 120277], "mapped", "b"], [[120278, 120278], "mapped", "c"], [[120279, 120279], "mapped", "d"], [[120280, 120280], "mapped", "e"], [[120281, 120281], "mapped", "f"], [[120282, 120282], "mapped", "g"], [[120283, 120283], "mapped", "h"], [[120284, 120284], "mapped", "i"], [[120285, 120285], "mapped", "j"], [[120286, 120286], "mapped", "k"], [[120287, 120287], "mapped", "l"], [[120288, 120288], "mapped", "m"], [[120289, 120289], "mapped", "n"], [[120290, 120290], "mapped", "o"], [[120291, 120291], "mapped", "p"], [[120292, 120292], "mapped", "q"], [[120293, 120293], "mapped", "r"], [[120294, 120294], "mapped", "s"], [[120295, 120295], "mapped", "t"], [[120296, 120296], "mapped", "u"], [[120297, 120297], "mapped", "v"], [[120298, 120298], "mapped", "w"], [[120299, 120299], "mapped", "x"], [[120300, 120300], "mapped", "y"], [[120301, 120301], "mapped", "z"], [[120302, 120302], "mapped", "a"], [[120303, 120303], "mapped", "b"], [[120304, 120304], "mapped", "c"], [[120305, 120305], "mapped", "d"], [[120306, 120306], "mapped", "e"], [[120307, 120307], "mapped", "f"], [[120308, 120308], "mapped", "g"], [[120309, 120309], "mapped", "h"], [[120310, 120310], "mapped", "i"], [[120311, 120311], "mapped", "j"], [[120312, 120312], "mapped", "k"], [[120313, 120313], "mapped", "l"], [[120314, 120314], "mapped", "m"], [[120315, 120315], "mapped", "n"], [[120316, 120316], "mapped", "o"], [[120317, 120317], "mapped", "p"], [[120318, 120318], "mapped", "q"], [[120319, 120319], "mapped", "r"], [[120320, 120320], "mapped", "s"], [[120321, 120321], "mapped", "t"], [[120322, 120322], "mapped", "u"], [[120323, 120323], "mapped", "v"], [[120324, 120324], "mapped", "w"], [[120325, 120325], "mapped", "x"], [[120326, 120326], "mapped", "y"], [[120327, 120327], "mapped", "z"], [[120328, 120328], "mapped", "a"], [[120329, 120329], "mapped", "b"], [[120330, 120330], "mapped", "c"], [[120331, 120331], "mapped", "d"], [[120332, 120332], "mapped", "e"], [[120333, 120333], "mapped", "f"], [[120334, 120334], "mapped", "g"], [[120335, 120335], "mapped", "h"], [[120336, 120336], "mapped", "i"], [[120337, 120337], "mapped", "j"], [[120338, 120338], "mapped", "k"], [[120339, 120339], "mapped", "l"], [[120340, 120340], "mapped", "m"], [[120341, 120341], "mapped", "n"], [[120342, 120342], "mapped", "o"], [[120343, 120343], "mapped", "p"], [[120344, 120344], "mapped", "q"], [[120345, 120345], "mapped", "r"], [[120346, 120346], "mapped", "s"], [[120347, 120347], "mapped", "t"], [[120348, 120348], "mapped", "u"], [[120349, 120349], "mapped", "v"], [[120350, 120350], "mapped", "w"], [[120351, 120351], "mapped", "x"], [[120352, 120352], "mapped", "y"], [[120353, 120353], "mapped", "z"], [[120354, 120354], "mapped", "a"], [[120355, 120355], "mapped", "b"], [[120356, 120356], "mapped", "c"], [[120357, 120357], "mapped", "d"], [[120358, 120358], "mapped", "e"], [[120359, 120359], "mapped", "f"], [[120360, 120360], "mapped", "g"], [[120361, 120361], "mapped", "h"], [[120362, 120362], "mapped", "i"], [[120363, 120363], "mapped", "j"], [[120364, 120364], "mapped", "k"], [[120365, 120365], "mapped", "l"], [[120366, 120366], "mapped", "m"], [[120367, 120367], "mapped", "n"], [[120368, 120368], "mapped", "o"], [[120369, 120369], "mapped", "p"], [[120370, 120370], "mapped", "q"], [[120371, 120371], "mapped", "r"], [[120372, 120372], "mapped", "s"], [[120373, 120373], "mapped", "t"], [[120374, 120374], "mapped", "u"], [[120375, 120375], "mapped", "v"], [[120376, 120376], "mapped", "w"], [[120377, 120377], "mapped", "x"], [[120378, 120378], "mapped", "y"], [[120379, 120379], "mapped", "z"], [[120380, 120380], "mapped", "a"], [[120381, 120381], "mapped", "b"], [[120382, 120382], "mapped", "c"], [[120383, 120383], "mapped", "d"], [[120384, 120384], "mapped", "e"], [[120385, 120385], "mapped", "f"], [[120386, 120386], "mapped", "g"], [[120387, 120387], "mapped", "h"], [[120388, 120388], "mapped", "i"], [[120389, 120389], "mapped", "j"], [[120390, 120390], "mapped", "k"], [[120391, 120391], "mapped", "l"], [[120392, 120392], "mapped", "m"], [[120393, 120393], "mapped", "n"], [[120394, 120394], "mapped", "o"], [[120395, 120395], "mapped", "p"], [[120396, 120396], "mapped", "q"], [[120397, 120397], "mapped", "r"], [[120398, 120398], "mapped", "s"], [[120399, 120399], "mapped", "t"], [[120400, 120400], "mapped", "u"], [[120401, 120401], "mapped", "v"], [[120402, 120402], "mapped", "w"], [[120403, 120403], "mapped", "x"], [[120404, 120404], "mapped", "y"], [[120405, 120405], "mapped", "z"], [[120406, 120406], "mapped", "a"], [[120407, 120407], "mapped", "b"], [[120408, 120408], "mapped", "c"], [[120409, 120409], "mapped", "d"], [[120410, 120410], "mapped", "e"], [[120411, 120411], "mapped", "f"], [[120412, 120412], "mapped", "g"], [[120413, 120413], "mapped", "h"], [[120414, 120414], "mapped", "i"], [[120415, 120415], "mapped", "j"], [[120416, 120416], "mapped", "k"], [[120417, 120417], "mapped", "l"], [[120418, 120418], "mapped", "m"], [[120419, 120419], "mapped", "n"], [[120420, 120420], "mapped", "o"], [[120421, 120421], "mapped", "p"], [[120422, 120422], "mapped", "q"], [[120423, 120423], "mapped", "r"], [[120424, 120424], "mapped", "s"], [[120425, 120425], "mapped", "t"], [[120426, 120426], "mapped", "u"], [[120427, 120427], "mapped", "v"], [[120428, 120428], "mapped", "w"], [[120429, 120429], "mapped", "x"], [[120430, 120430], "mapped", "y"], [[120431, 120431], "mapped", "z"], [[120432, 120432], "mapped", "a"], [[120433, 120433], "mapped", "b"], [[120434, 120434], "mapped", "c"], [[120435, 120435], "mapped", "d"], [[120436, 120436], "mapped", "e"], [[120437, 120437], "mapped", "f"], [[120438, 120438], "mapped", "g"], [[120439, 120439], "mapped", "h"], [[120440, 120440], "mapped", "i"], [[120441, 120441], "mapped", "j"], [[120442, 120442], "mapped", "k"], [[120443, 120443], "mapped", "l"], [[120444, 120444], "mapped", "m"], [[120445, 120445], "mapped", "n"], [[120446, 120446], "mapped", "o"], [[120447, 120447], "mapped", "p"], [[120448, 120448], "mapped", "q"], [[120449, 120449], "mapped", "r"], [[120450, 120450], "mapped", "s"], [[120451, 120451], "mapped", "t"], [[120452, 120452], "mapped", "u"], [[120453, 120453], "mapped", "v"], [[120454, 120454], "mapped", "w"], [[120455, 120455], "mapped", "x"], [[120456, 120456], "mapped", "y"], [[120457, 120457], "mapped", "z"], [[120458, 120458], "mapped", "a"], [[120459, 120459], "mapped", "b"], [[120460, 120460], "mapped", "c"], [[120461, 120461], "mapped", "d"], [[120462, 120462], "mapped", "e"], [[120463, 120463], "mapped", "f"], [[120464, 120464], "mapped", "g"], [[120465, 120465], "mapped", "h"], [[120466, 120466], "mapped", "i"], [[120467, 120467], "mapped", "j"], [[120468, 120468], "mapped", "k"], [[120469, 120469], "mapped", "l"], [[120470, 120470], "mapped", "m"], [[120471, 120471], "mapped", "n"], [[120472, 120472], "mapped", "o"], [[120473, 120473], "mapped", "p"], [[120474, 120474], "mapped", "q"], [[120475, 120475], "mapped", "r"], [[120476, 120476], "mapped", "s"], [[120477, 120477], "mapped", "t"], [[120478, 120478], "mapped", "u"], [[120479, 120479], "mapped", "v"], [[120480, 120480], "mapped", "w"], [[120481, 120481], "mapped", "x"], [[120482, 120482], "mapped", "y"], [[120483, 120483], "mapped", "z"], [[120484, 120484], "mapped", "\u0131"], [[120485, 120485], "mapped", "\u0237"], [[120486, 120487], "disallowed"], [[120488, 120488], "mapped", "\u03B1"], [[120489, 120489], "mapped", "\u03B2"], [[120490, 120490], "mapped", "\u03B3"], [[120491, 120491], "mapped", "\u03B4"], [[120492, 120492], "mapped", "\u03B5"], [[120493, 120493], "mapped", "\u03B6"], [[120494, 120494], "mapped", "\u03B7"], [[120495, 120495], "mapped", "\u03B8"], [[120496, 120496], "mapped", "\u03B9"], [[120497, 120497], "mapped", "\u03BA"], [[120498, 120498], "mapped", "\u03BB"], [[120499, 120499], "mapped", "\u03BC"], [[120500, 120500], "mapped", "\u03BD"], [[120501, 120501], "mapped", "\u03BE"], [[120502, 120502], "mapped", "\u03BF"], [[120503, 120503], "mapped", "\u03C0"], [[120504, 120504], "mapped", "\u03C1"], [[120505, 120505], "mapped", "\u03B8"], [[120506, 120506], "mapped", "\u03C3"], [[120507, 120507], "mapped", "\u03C4"], [[120508, 120508], "mapped", "\u03C5"], [[120509, 120509], "mapped", "\u03C6"], [[120510, 120510], "mapped", "\u03C7"], [[120511, 120511], "mapped", "\u03C8"], [[120512, 120512], "mapped", "\u03C9"], [[120513, 120513], "mapped", "\u2207"], [[120514, 120514], "mapped", "\u03B1"], [[120515, 120515], "mapped", "\u03B2"], [[120516, 120516], "mapped", "\u03B3"], [[120517, 120517], "mapped", "\u03B4"], [[120518, 120518], "mapped", "\u03B5"], [[120519, 120519], "mapped", "\u03B6"], [[120520, 120520], "mapped", "\u03B7"], [[120521, 120521], "mapped", "\u03B8"], [[120522, 120522], "mapped", "\u03B9"], [[120523, 120523], "mapped", "\u03BA"], [[120524, 120524], "mapped", "\u03BB"], [[120525, 120525], "mapped", "\u03BC"], [[120526, 120526], "mapped", "\u03BD"], [[120527, 120527], "mapped", "\u03BE"], [[120528, 120528], "mapped", "\u03BF"], [[120529, 120529], "mapped", "\u03C0"], [[120530, 120530], "mapped", "\u03C1"], [[120531, 120532], "mapped", "\u03C3"], [[120533, 120533], "mapped", "\u03C4"], [[120534, 120534], "mapped", "\u03C5"], [[120535, 120535], "mapped", "\u03C6"], [[120536, 120536], "mapped", "\u03C7"], [[120537, 120537], "mapped", "\u03C8"], [[120538, 120538], "mapped", "\u03C9"], [[120539, 120539], "mapped", "\u2202"], [[120540, 120540], "mapped", "\u03B5"], [[120541, 120541], "mapped", "\u03B8"], [[120542, 120542], "mapped", "\u03BA"], [[120543, 120543], "mapped", "\u03C6"], [[120544, 120544], "mapped", "\u03C1"], [[120545, 120545], "mapped", "\u03C0"], [[120546, 120546], "mapped", "\u03B1"], [[120547, 120547], "mapped", "\u03B2"], [[120548, 120548], "mapped", "\u03B3"], [[120549, 120549], "mapped", "\u03B4"], [[120550, 120550], "mapped", "\u03B5"], [[120551, 120551], "mapped", "\u03B6"], [[120552, 120552], "mapped", "\u03B7"], [[120553, 120553], "mapped", "\u03B8"], [[120554, 120554], "mapped", "\u03B9"], [[120555, 120555], "mapped", "\u03BA"], [[120556, 120556], "mapped", "\u03BB"], [[120557, 120557], "mapped", "\u03BC"], [[120558, 120558], "mapped", "\u03BD"], [[120559, 120559], "mapped", "\u03BE"], [[120560, 120560], "mapped", "\u03BF"], [[120561, 120561], "mapped", "\u03C0"], [[120562, 120562], "mapped", "\u03C1"], [[120563, 120563], "mapped", "\u03B8"], [[120564, 120564], "mapped", "\u03C3"], [[120565, 120565], "mapped", "\u03C4"], [[120566, 120566], "mapped", "\u03C5"], [[120567, 120567], "mapped", "\u03C6"], [[120568, 120568], "mapped", "\u03C7"], [[120569, 120569], "mapped", "\u03C8"], [[120570, 120570], "mapped", "\u03C9"], [[120571, 120571], "mapped", "\u2207"], [[120572, 120572], "mapped", "\u03B1"], [[120573, 120573], "mapped", "\u03B2"], [[120574, 120574], "mapped", "\u03B3"], [[120575, 120575], "mapped", "\u03B4"], [[120576, 120576], "mapped", "\u03B5"], [[120577, 120577], "mapped", "\u03B6"], [[120578, 120578], "mapped", "\u03B7"], [[120579, 120579], "mapped", "\u03B8"], [[120580, 120580], "mapped", "\u03B9"], [[120581, 120581], "mapped", "\u03BA"], [[120582, 120582], "mapped", "\u03BB"], [[120583, 120583], "mapped", "\u03BC"], [[120584, 120584], "mapped", "\u03BD"], [[120585, 120585], "mapped", "\u03BE"], [[120586, 120586], "mapped", "\u03BF"], [[120587, 120587], "mapped", "\u03C0"], [[120588, 120588], "mapped", "\u03C1"], [[120589, 120590], "mapped", "\u03C3"], [[120591, 120591], "mapped", "\u03C4"], [[120592, 120592], "mapped", "\u03C5"], [[120593, 120593], "mapped", "\u03C6"], [[120594, 120594], "mapped", "\u03C7"], [[120595, 120595], "mapped", "\u03C8"], [[120596, 120596], "mapped", "\u03C9"], [[120597, 120597], "mapped", "\u2202"], [[120598, 120598], "mapped", "\u03B5"], [[120599, 120599], "mapped", "\u03B8"], [[120600, 120600], "mapped", "\u03BA"], [[120601, 120601], "mapped", "\u03C6"], [[120602, 120602], "mapped", "\u03C1"], [[120603, 120603], "mapped", "\u03C0"], [[120604, 120604], "mapped", "\u03B1"], [[120605, 120605], "mapped", "\u03B2"], [[120606, 120606], "mapped", "\u03B3"], [[120607, 120607], "mapped", "\u03B4"], [[120608, 120608], "mapped", "\u03B5"], [[120609, 120609], "mapped", "\u03B6"], [[120610, 120610], "mapped", "\u03B7"], [[120611, 120611], "mapped", "\u03B8"], [[120612, 120612], "mapped", "\u03B9"], [[120613, 120613], "mapped", "\u03BA"], [[120614, 120614], "mapped", "\u03BB"], [[120615, 120615], "mapped", "\u03BC"], [[120616, 120616], "mapped", "\u03BD"], [[120617, 120617], "mapped", "\u03BE"], [[120618, 120618], "mapped", "\u03BF"], [[120619, 120619], "mapped", "\u03C0"], [[120620, 120620], "mapped", "\u03C1"], [[120621, 120621], "mapped", "\u03B8"], [[120622, 120622], "mapped", "\u03C3"], [[120623, 120623], "mapped", "\u03C4"], [[120624, 120624], "mapped", "\u03C5"], [[120625, 120625], "mapped", "\u03C6"], [[120626, 120626], "mapped", "\u03C7"], [[120627, 120627], "mapped", "\u03C8"], [[120628, 120628], "mapped", "\u03C9"], [[120629, 120629], "mapped", "\u2207"], [[120630, 120630], "mapped", "\u03B1"], [[120631, 120631], "mapped", "\u03B2"], [[120632, 120632], "mapped", "\u03B3"], [[120633, 120633], "mapped", "\u03B4"], [[120634, 120634], "mapped", "\u03B5"], [[120635, 120635], "mapped", "\u03B6"], [[120636, 120636], "mapped", "\u03B7"], [[120637, 120637], "mapped", "\u03B8"], [[120638, 120638], "mapped", "\u03B9"], [[120639, 120639], "mapped", "\u03BA"], [[120640, 120640], "mapped", "\u03BB"], [[120641, 120641], "mapped", "\u03BC"], [[120642, 120642], "mapped", "\u03BD"], [[120643, 120643], "mapped", "\u03BE"], [[120644, 120644], "mapped", "\u03BF"], [[120645, 120645], "mapped", "\u03C0"], [[120646, 120646], "mapped", "\u03C1"], [[120647, 120648], "mapped", "\u03C3"], [[120649, 120649], "mapped", "\u03C4"], [[120650, 120650], "mapped", "\u03C5"], [[120651, 120651], "mapped", "\u03C6"], [[120652, 120652], "mapped", "\u03C7"], [[120653, 120653], "mapped", "\u03C8"], [[120654, 120654], "mapped", "\u03C9"], [[120655, 120655], "mapped", "\u2202"], [[120656, 120656], "mapped", "\u03B5"], [[120657, 120657], "mapped", "\u03B8"], [[120658, 120658], "mapped", "\u03BA"], [[120659, 120659], "mapped", "\u03C6"], [[120660, 120660], "mapped", "\u03C1"], [[120661, 120661], "mapped", "\u03C0"], [[120662, 120662], "mapped", "\u03B1"], [[120663, 120663], "mapped", "\u03B2"], [[120664, 120664], "mapped", "\u03B3"], [[120665, 120665], "mapped", "\u03B4"], [[120666, 120666], "mapped", "\u03B5"], [[120667, 120667], "mapped", "\u03B6"], [[120668, 120668], "mapped", "\u03B7"], [[120669, 120669], "mapped", "\u03B8"], [[120670, 120670], "mapped", "\u03B9"], [[120671, 120671], "mapped", "\u03BA"], [[120672, 120672], "mapped", "\u03BB"], [[120673, 120673], "mapped", "\u03BC"], [[120674, 120674], "mapped", "\u03BD"], [[120675, 120675], "mapped", "\u03BE"], [[120676, 120676], "mapped", "\u03BF"], [[120677, 120677], "mapped", "\u03C0"], [[120678, 120678], "mapped", "\u03C1"], [[120679, 120679], "mapped", "\u03B8"], [[120680, 120680], "mapped", "\u03C3"], [[120681, 120681], "mapped", "\u03C4"], [[120682, 120682], "mapped", "\u03C5"], [[120683, 120683], "mapped", "\u03C6"], [[120684, 120684], "mapped", "\u03C7"], [[120685, 120685], "mapped", "\u03C8"], [[120686, 120686], "mapped", "\u03C9"], [[120687, 120687], "mapped", "\u2207"], [[120688, 120688], "mapped", "\u03B1"], [[120689, 120689], "mapped", "\u03B2"], [[120690, 120690], "mapped", "\u03B3"], [[120691, 120691], "mapped", "\u03B4"], [[120692, 120692], "mapped", "\u03B5"], [[120693, 120693], "mapped", "\u03B6"], [[120694, 120694], "mapped", "\u03B7"], [[120695, 120695], "mapped", "\u03B8"], [[120696, 120696], "mapped", "\u03B9"], [[120697, 120697], "mapped", "\u03BA"], [[120698, 120698], "mapped", "\u03BB"], [[120699, 120699], "mapped", "\u03BC"], [[120700, 120700], "mapped", "\u03BD"], [[120701, 120701], "mapped", "\u03BE"], [[120702, 120702], "mapped", "\u03BF"], [[120703, 120703], "mapped", "\u03C0"], [[120704, 120704], "mapped", "\u03C1"], [[120705, 120706], "mapped", "\u03C3"], [[120707, 120707], "mapped", "\u03C4"], [[120708, 120708], "mapped", "\u03C5"], [[120709, 120709], "mapped", "\u03C6"], [[120710, 120710], "mapped", "\u03C7"], [[120711, 120711], "mapped", "\u03C8"], [[120712, 120712], "mapped", "\u03C9"], [[120713, 120713], "mapped", "\u2202"], [[120714, 120714], "mapped", "\u03B5"], [[120715, 120715], "mapped", "\u03B8"], [[120716, 120716], "mapped", "\u03BA"], [[120717, 120717], "mapped", "\u03C6"], [[120718, 120718], "mapped", "\u03C1"], [[120719, 120719], "mapped", "\u03C0"], [[120720, 120720], "mapped", "\u03B1"], [[120721, 120721], "mapped", "\u03B2"], [[120722, 120722], "mapped", "\u03B3"], [[120723, 120723], "mapped", "\u03B4"], [[120724, 120724], "mapped", "\u03B5"], [[120725, 120725], "mapped", "\u03B6"], [[120726, 120726], "mapped", "\u03B7"], [[120727, 120727], "mapped", "\u03B8"], [[120728, 120728], "mapped", "\u03B9"], [[120729, 120729], "mapped", "\u03BA"], [[120730, 120730], "mapped", "\u03BB"], [[120731, 120731], "mapped", "\u03BC"], [[120732, 120732], "mapped", "\u03BD"], [[120733, 120733], "mapped", "\u03BE"], [[120734, 120734], "mapped", "\u03BF"], [[120735, 120735], "mapped", "\u03C0"], [[120736, 120736], "mapped", "\u03C1"], [[120737, 120737], "mapped", "\u03B8"], [[120738, 120738], "mapped", "\u03C3"], [[120739, 120739], "mapped", "\u03C4"], [[120740, 120740], "mapped", "\u03C5"], [[120741, 120741], "mapped", "\u03C6"], [[120742, 120742], "mapped", "\u03C7"], [[120743, 120743], "mapped", "\u03C8"], [[120744, 120744], "mapped", "\u03C9"], [[120745, 120745], "mapped", "\u2207"], [[120746, 120746], "mapped", "\u03B1"], [[120747, 120747], "mapped", "\u03B2"], [[120748, 120748], "mapped", "\u03B3"], [[120749, 120749], "mapped", "\u03B4"], [[120750, 120750], "mapped", "\u03B5"], [[120751, 120751], "mapped", "\u03B6"], [[120752, 120752], "mapped", "\u03B7"], [[120753, 120753], "mapped", "\u03B8"], [[120754, 120754], "mapped", "\u03B9"], [[120755, 120755], "mapped", "\u03BA"], [[120756, 120756], "mapped", "\u03BB"], [[120757, 120757], "mapped", "\u03BC"], [[120758, 120758], "mapped", "\u03BD"], [[120759, 120759], "mapped", "\u03BE"], [[120760, 120760], "mapped", "\u03BF"], [[120761, 120761], "mapped", "\u03C0"], [[120762, 120762], "mapped", "\u03C1"], [[120763, 120764], "mapped", "\u03C3"], [[120765, 120765], "mapped", "\u03C4"], [[120766, 120766], "mapped", "\u03C5"], [[120767, 120767], "mapped", "\u03C6"], [[120768, 120768], "mapped", "\u03C7"], [[120769, 120769], "mapped", "\u03C8"], [[120770, 120770], "mapped", "\u03C9"], [[120771, 120771], "mapped", "\u2202"], [[120772, 120772], "mapped", "\u03B5"], [[120773, 120773], "mapped", "\u03B8"], [[120774, 120774], "mapped", "\u03BA"], [[120775, 120775], "mapped", "\u03C6"], [[120776, 120776], "mapped", "\u03C1"], [[120777, 120777], "mapped", "\u03C0"], [[120778, 120779], "mapped", "\u03DD"], [[120780, 120781], "disallowed"], [[120782, 120782], "mapped", "0"], [[120783, 120783], "mapped", "1"], [[120784, 120784], "mapped", "2"], [[120785, 120785], "mapped", "3"], [[120786, 120786], "mapped", "4"], [[120787, 120787], "mapped", "5"], [[120788, 120788], "mapped", "6"], [[120789, 120789], "mapped", "7"], [[120790, 120790], "mapped", "8"], [[120791, 120791], "mapped", "9"], [[120792, 120792], "mapped", "0"], [[120793, 120793], "mapped", "1"], [[120794, 120794], "mapped", "2"], [[120795, 120795], "mapped", "3"], [[120796, 120796], "mapped", "4"], [[120797, 120797], "mapped", "5"], [[120798, 120798], "mapped", "6"], [[120799, 120799], "mapped", "7"], [[120800, 120800], "mapped", "8"], [[120801, 120801], "mapped", "9"], [[120802, 120802], "mapped", "0"], [[120803, 120803], "mapped", "1"], [[120804, 120804], "mapped", "2"], [[120805, 120805], "mapped", "3"], [[120806, 120806], "mapped", "4"], [[120807, 120807], "mapped", "5"], [[120808, 120808], "mapped", "6"], [[120809, 120809], "mapped", "7"], [[120810, 120810], "mapped", "8"], [[120811, 120811], "mapped", "9"], [[120812, 120812], "mapped", "0"], [[120813, 120813], "mapped", "1"], [[120814, 120814], "mapped", "2"], [[120815, 120815], "mapped", "3"], [[120816, 120816], "mapped", "4"], [[120817, 120817], "mapped", "5"], [[120818, 120818], "mapped", "6"], [[120819, 120819], "mapped", "7"], [[120820, 120820], "mapped", "8"], [[120821, 120821], "mapped", "9"], [[120822, 120822], "mapped", "0"], [[120823, 120823], "mapped", "1"], [[120824, 120824], "mapped", "2"], [[120825, 120825], "mapped", "3"], [[120826, 120826], "mapped", "4"], [[120827, 120827], "mapped", "5"], [[120828, 120828], "mapped", "6"], [[120829, 120829], "mapped", "7"], [[120830, 120830], "mapped", "8"], [[120831, 120831], "mapped", "9"], [[120832, 121343], "valid", "", "NV8"], [[121344, 121398], "valid"], [[121399, 121402], "valid", "", "NV8"], [[121403, 121452], "valid"], [[121453, 121460], "valid", "", "NV8"], [[121461, 121461], "valid"], [[121462, 121475], "valid", "", "NV8"], [[121476, 121476], "valid"], [[121477, 121483], "valid", "", "NV8"], [[121484, 121498], "disallowed"], [[121499, 121503], "valid"], [[121504, 121504], "disallowed"], [[121505, 121519], "valid"], [[121520, 122879], "disallowed"], [[122880, 122886], "valid"], [[122887, 122887], "disallowed"], [[122888, 122904], "valid"], [[122905, 122906], "disallowed"], [[122907, 122913], "valid"], [[122914, 122914], "disallowed"], [[122915, 122916], "valid"], [[122917, 122917], "disallowed"], [[122918, 122922], "valid"], [[122923, 124927], "disallowed"], [[124928, 125124], "valid"], [[125125, 125126], "disallowed"], [[125127, 125135], "valid", "", "NV8"], [[125136, 125142], "valid"], [[125143, 125183], "disallowed"], [[125184, 125184], "mapped", "\u{1E922}"], [[125185, 125185], "mapped", "\u{1E923}"], [[125186, 125186], "mapped", "\u{1E924}"], [[125187, 125187], "mapped", "\u{1E925}"], [[125188, 125188], "mapped", "\u{1E926}"], [[125189, 125189], "mapped", "\u{1E927}"], [[125190, 125190], "mapped", "\u{1E928}"], [[125191, 125191], "mapped", "\u{1E929}"], [[125192, 125192], "mapped", "\u{1E92A}"], [[125193, 125193], "mapped", "\u{1E92B}"], [[125194, 125194], "mapped", "\u{1E92C}"], [[125195, 125195], "mapped", "\u{1E92D}"], [[125196, 125196], "mapped", "\u{1E92E}"], [[125197, 125197], "mapped", "\u{1E92F}"], [[125198, 125198], "mapped", "\u{1E930}"], [[125199, 125199], "mapped", "\u{1E931}"], [[125200, 125200], "mapped", "\u{1E932}"], [[125201, 125201], "mapped", "\u{1E933}"], [[125202, 125202], "mapped", "\u{1E934}"], [[125203, 125203], "mapped", "\u{1E935}"], [[125204, 125204], "mapped", "\u{1E936}"], [[125205, 125205], "mapped", "\u{1E937}"], [[125206, 125206], "mapped", "\u{1E938}"], [[125207, 125207], "mapped", "\u{1E939}"], [[125208, 125208], "mapped", "\u{1E93A}"], [[125209, 125209], "mapped", "\u{1E93B}"], [[125210, 125210], "mapped", "\u{1E93C}"], [[125211, 125211], "mapped", "\u{1E93D}"], [[125212, 125212], "mapped", "\u{1E93E}"], [[125213, 125213], "mapped", "\u{1E93F}"], [[125214, 125214], "mapped", "\u{1E940}"], [[125215, 125215], "mapped", "\u{1E941}"], [[125216, 125216], "mapped", "\u{1E942}"], [[125217, 125217], "mapped", "\u{1E943}"], [[125218, 125258], "valid"], [[125259, 125263], "disallowed"], [[125264, 125273], "valid"], [[125274, 125277], "disallowed"], [[125278, 125279], "valid", "", "NV8"], [[125280, 126463], "disallowed"], [[126464, 126464], "mapped", "\u0627"], [[126465, 126465], "mapped", "\u0628"], [[126466, 126466], "mapped", "\u062C"], [[126467, 126467], "mapped", "\u062F"], [[126468, 126468], "disallowed"], [[126469, 126469], "mapped", "\u0648"], [[126470, 126470], "mapped", "\u0632"], [[126471, 126471], "mapped", "\u062D"], [[126472, 126472], "mapped", "\u0637"], [[126473, 126473], "mapped", "\u064A"], [[126474, 126474], "mapped", "\u0643"], [[126475, 126475], "mapped", "\u0644"], [[126476, 126476], "mapped", "\u0645"], [[126477, 126477], "mapped", "\u0646"], [[126478, 126478], "mapped", "\u0633"], [[126479, 126479], "mapped", "\u0639"], [[126480, 126480], "mapped", "\u0641"], [[126481, 126481], "mapped", "\u0635"], [[126482, 126482], "mapped", "\u0642"], [[126483, 126483], "mapped", "\u0631"], [[126484, 126484], "mapped", "\u0634"], [[126485, 126485], "mapped", "\u062A"], [[126486, 126486], "mapped", "\u062B"], [[126487, 126487], "mapped", "\u062E"], [[126488, 126488], "mapped", "\u0630"], [[126489, 126489], "mapped", "\u0636"], [[126490, 126490], "mapped", "\u0638"], [[126491, 126491], "mapped", "\u063A"], [[126492, 126492], "mapped", "\u066E"], [[126493, 126493], "mapped", "\u06BA"], [[126494, 126494], "mapped", "\u06A1"], [[126495, 126495], "mapped", "\u066F"], [[126496, 126496], "disallowed"], [[126497, 126497], "mapped", "\u0628"], [[126498, 126498], "mapped", "\u062C"], [[126499, 126499], "disallowed"], [[126500, 126500], "mapped", "\u0647"], [[126501, 126502], "disallowed"], [[126503, 126503], "mapped", "\u062D"], [[126504, 126504], "disallowed"], [[126505, 126505], "mapped", "\u064A"], [[126506, 126506], "mapped", "\u0643"], [[126507, 126507], "mapped", "\u0644"], [[126508, 126508], "mapped", "\u0645"], [[126509, 126509], "mapped", "\u0646"], [[126510, 126510], "mapped", "\u0633"], [[126511, 126511], "mapped", "\u0639"], [[126512, 126512], "mapped", "\u0641"], [[126513, 126513], "mapped", "\u0635"], [[126514, 126514], "mapped", "\u0642"], [[126515, 126515], "disallowed"], [[126516, 126516], "mapped", "\u0634"], [[126517, 126517], "mapped", "\u062A"], [[126518, 126518], "mapped", "\u062B"], [[126519, 126519], "mapped", "\u062E"], [[126520, 126520], "disallowed"], [[126521, 126521], "mapped", "\u0636"], [[126522, 126522], "disallowed"], [[126523, 126523], "mapped", "\u063A"], [[126524, 126529], "disallowed"], [[126530, 126530], "mapped", "\u062C"], [[126531, 126534], "disallowed"], [[126535, 126535], "mapped", "\u062D"], [[126536, 126536], "disallowed"], [[126537, 126537], "mapped", "\u064A"], [[126538, 126538], "disallowed"], [[126539, 126539], "mapped", "\u0644"], [[126540, 126540], "disallowed"], [[126541, 126541], "mapped", "\u0646"], [[126542, 126542], "mapped", "\u0633"], [[126543, 126543], "mapped", "\u0639"], [[126544, 126544], "disallowed"], [[126545, 126545], "mapped", "\u0635"], [[126546, 126546], "mapped", "\u0642"], [[126547, 126547], "disallowed"], [[126548, 126548], "mapped", "\u0634"], [[126549, 126550], "disallowed"], [[126551, 126551], "mapped", "\u062E"], [[126552, 126552], "disallowed"], [[126553, 126553], "mapped", "\u0636"], [[126554, 126554], "disallowed"], [[126555, 126555], "mapped", "\u063A"], [[126556, 126556], "disallowed"], [[126557, 126557], "mapped", "\u06BA"], [[126558, 126558], "disallowed"], [[126559, 126559], "mapped", "\u066F"], [[126560, 126560], "disallowed"], [[126561, 126561], "mapped", "\u0628"], [[126562, 126562], "mapped", "\u062C"], [[126563, 126563], "disallowed"], [[126564, 126564], "mapped", "\u0647"], [[126565, 126566], "disallowed"], [[126567, 126567], "mapped", "\u062D"], [[126568, 126568], "mapped", "\u0637"], [[126569, 126569], "mapped", "\u064A"], [[126570, 126570], "mapped", "\u0643"], [[126571, 126571], "disallowed"], [[126572, 126572], "mapped", "\u0645"], [[126573, 126573], "mapped", "\u0646"], [[126574, 126574], "mapped", "\u0633"], [[126575, 126575], "mapped", "\u0639"], [[126576, 126576], "mapped", "\u0641"], [[126577, 126577], "mapped", "\u0635"], [[126578, 126578], "mapped", "\u0642"], [[126579, 126579], "disallowed"], [[126580, 126580], "mapped", "\u0634"], [[126581, 126581], "mapped", "\u062A"], [[126582, 126582], "mapped", "\u062B"], [[126583, 126583], "mapped", "\u062E"], [[126584, 126584], "disallowed"], [[126585, 126585], "mapped", "\u0636"], [[126586, 126586], "mapped", "\u0638"], [[126587, 126587], "mapped", "\u063A"], [[126588, 126588], "mapped", "\u066E"], [[126589, 126589], "disallowed"], [[126590, 126590], "mapped", "\u06A1"], [[126591, 126591], "disallowed"], [[126592, 126592], "mapped", "\u0627"], [[126593, 126593], "mapped", "\u0628"], [[126594, 126594], "mapped", "\u062C"], [[126595, 126595], "mapped", "\u062F"], [[126596, 126596], "mapped", "\u0647"], [[126597, 126597], "mapped", "\u0648"], [[126598, 126598], "mapped", "\u0632"], [[126599, 126599], "mapped", "\u062D"], [[126600, 126600], "mapped", "\u0637"], [[126601, 126601], "mapped", "\u064A"], [[126602, 126602], "disallowed"], [[126603, 126603], "mapped", "\u0644"], [[126604, 126604], "mapped", "\u0645"], [[126605, 126605], "mapped", "\u0646"], [[126606, 126606], "mapped", "\u0633"], [[126607, 126607], "mapped", "\u0639"], [[126608, 126608], "mapped", "\u0641"], [[126609, 126609], "mapped", "\u0635"], [[126610, 126610], "mapped", "\u0642"], [[126611, 126611], "mapped", "\u0631"], [[126612, 126612], "mapped", "\u0634"], [[126613, 126613], "mapped", "\u062A"], [[126614, 126614], "mapped", "\u062B"], [[126615, 126615], "mapped", "\u062E"], [[126616, 126616], "mapped", "\u0630"], [[126617, 126617], "mapped", "\u0636"], [[126618, 126618], "mapped", "\u0638"], [[126619, 126619], "mapped", "\u063A"], [[126620, 126624], "disallowed"], [[126625, 126625], "mapped", "\u0628"], [[126626, 126626], "mapped", "\u062C"], [[126627, 126627], "mapped", "\u062F"], [[126628, 126628], "disallowed"], [[126629, 126629], "mapped", "\u0648"], [[126630, 126630], "mapped", "\u0632"], [[126631, 126631], "mapped", "\u062D"], [[126632, 126632], "mapped", "\u0637"], [[126633, 126633], "mapped", "\u064A"], [[126634, 126634], "disallowed"], [[126635, 126635], "mapped", "\u0644"], [[126636, 126636], "mapped", "\u0645"], [[126637, 126637], "mapped", "\u0646"], [[126638, 126638], "mapped", "\u0633"], [[126639, 126639], "mapped", "\u0639"], [[126640, 126640], "mapped", "\u0641"], [[126641, 126641], "mapped", "\u0635"], [[126642, 126642], "mapped", "\u0642"], [[126643, 126643], "mapped", "\u0631"], [[126644, 126644], "mapped", "\u0634"], [[126645, 126645], "mapped", "\u062A"], [[126646, 126646], "mapped", "\u062B"], [[126647, 126647], "mapped", "\u062E"], [[126648, 126648], "mapped", "\u0630"], [[126649, 126649], "mapped", "\u0636"], [[126650, 126650], "mapped", "\u0638"], [[126651, 126651], "mapped", "\u063A"], [[126652, 126703], "disallowed"], [[126704, 126705], "valid", "", "NV8"], [[126706, 126975], "disallowed"], [[126976, 127019], "valid", "", "NV8"], [[127020, 127023], "disallowed"], [[127024, 127123], "valid", "", "NV8"], [[127124, 127135], "disallowed"], [[127136, 127150], "valid", "", "NV8"], [[127151, 127152], "disallowed"], [[127153, 127166], "valid", "", "NV8"], [[127167, 127167], "valid", "", "NV8"], [[127168, 127168], "disallowed"], [[127169, 127183], "valid", "", "NV8"], [[127184, 127184], "disallowed"], [[127185, 127199], "valid", "", "NV8"], [[127200, 127221], "valid", "", "NV8"], [[127222, 127231], "disallowed"], [[127232, 127232], "disallowed"], [[127233, 127233], "disallowed_STD3_mapped", "0,"], [[127234, 127234], "disallowed_STD3_mapped", "1,"], [[127235, 127235], "disallowed_STD3_mapped", "2,"], [[127236, 127236], "disallowed_STD3_mapped", "3,"], [[127237, 127237], "disallowed_STD3_mapped", "4,"], [[127238, 127238], "disallowed_STD3_mapped", "5,"], [[127239, 127239], "disallowed_STD3_mapped", "6,"], [[127240, 127240], "disallowed_STD3_mapped", "7,"], [[127241, 127241], "disallowed_STD3_mapped", "8,"], [[127242, 127242], "disallowed_STD3_mapped", "9,"], [[127243, 127244], "valid", "", "NV8"], [[127245, 127247], "disallowed"], [[127248, 127248], "disallowed_STD3_mapped", "(a)"], [[127249, 127249], "disallowed_STD3_mapped", "(b)"], [[127250, 127250], "disallowed_STD3_mapped", "(c)"], [[127251, 127251], "disallowed_STD3_mapped", "(d)"], [[127252, 127252], "disallowed_STD3_mapped", "(e)"], [[127253, 127253], "disallowed_STD3_mapped", "(f)"], [[127254, 127254], "disallowed_STD3_mapped", "(g)"], [[127255, 127255], "disallowed_STD3_mapped", "(h)"], [[127256, 127256], "disallowed_STD3_mapped", "(i)"], [[127257, 127257], "disallowed_STD3_mapped", "(j)"], [[127258, 127258], "disallowed_STD3_mapped", "(k)"], [[127259, 127259], "disallowed_STD3_mapped", "(l)"], [[127260, 127260], "disallowed_STD3_mapped", "(m)"], [[127261, 127261], "disallowed_STD3_mapped", "(n)"], [[127262, 127262], "disallowed_STD3_mapped", "(o)"], [[127263, 127263], "disallowed_STD3_mapped", "(p)"], [[127264, 127264], "disallowed_STD3_mapped", "(q)"], [[127265, 127265], "disallowed_STD3_mapped", "(r)"], [[127266, 127266], "disallowed_STD3_mapped", "(s)"], [[127267, 127267], "disallowed_STD3_mapped", "(t)"], [[127268, 127268], "disallowed_STD3_mapped", "(u)"], [[127269, 127269], "disallowed_STD3_mapped", "(v)"], [[127270, 127270], "disallowed_STD3_mapped", "(w)"], [[127271, 127271], "disallowed_STD3_mapped", "(x)"], [[127272, 127272], "disallowed_STD3_mapped", "(y)"], [[127273, 127273], "disallowed_STD3_mapped", "(z)"], [[127274, 127274], "mapped", "\u3014s\u3015"], [[127275, 127275], "mapped", "c"], [[127276, 127276], "mapped", "r"], [[127277, 127277], "mapped", "cd"], [[127278, 127278], "mapped", "wz"], [[127279, 127279], "disallowed"], [[127280, 127280], "mapped", "a"], [[127281, 127281], "mapped", "b"], [[127282, 127282], "mapped", "c"], [[127283, 127283], "mapped", "d"], [[127284, 127284], "mapped", "e"], [[127285, 127285], "mapped", "f"], [[127286, 127286], "mapped", "g"], [[127287, 127287], "mapped", "h"], [[127288, 127288], "mapped", "i"], [[127289, 127289], "mapped", "j"], [[127290, 127290], "mapped", "k"], [[127291, 127291], "mapped", "l"], [[127292, 127292], "mapped", "m"], [[127293, 127293], "mapped", "n"], [[127294, 127294], "mapped", "o"], [[127295, 127295], "mapped", "p"], [[127296, 127296], "mapped", "q"], [[127297, 127297], "mapped", "r"], [[127298, 127298], "mapped", "s"], [[127299, 127299], "mapped", "t"], [[127300, 127300], "mapped", "u"], [[127301, 127301], "mapped", "v"], [[127302, 127302], "mapped", "w"], [[127303, 127303], "mapped", "x"], [[127304, 127304], "mapped", "y"], [[127305, 127305], "mapped", "z"], [[127306, 127306], "mapped", "hv"], [[127307, 127307], "mapped", "mv"], [[127308, 127308], "mapped", "sd"], [[127309, 127309], "mapped", "ss"], [[127310, 127310], "mapped", "ppv"], [[127311, 127311], "mapped", "wc"], [[127312, 127318], "valid", "", "NV8"], [[127319, 127319], "valid", "", "NV8"], [[127320, 127326], "valid", "", "NV8"], [[127327, 127327], "valid", "", "NV8"], [[127328, 127337], "valid", "", "NV8"], [[127338, 127338], "mapped", "mc"], [[127339, 127339], "mapped", "md"], [[127340, 127343], "disallowed"], [[127344, 127352], "valid", "", "NV8"], [[127353, 127353], "valid", "", "NV8"], [[127354, 127354], "valid", "", "NV8"], [[127355, 127356], "valid", "", "NV8"], [[127357, 127358], "valid", "", "NV8"], [[127359, 127359], "valid", "", "NV8"], [[127360, 127369], "valid", "", "NV8"], [[127370, 127373], "valid", "", "NV8"], [[127374, 127375], "valid", "", "NV8"], [[127376, 127376], "mapped", "dj"], [[127377, 127386], "valid", "", "NV8"], [[127387, 127404], "valid", "", "NV8"], [[127405, 127461], "disallowed"], [[127462, 127487], "valid", "", "NV8"], [[127488, 127488], "mapped", "\u307B\u304B"], [[127489, 127489], "mapped", "\u30B3\u30B3"], [[127490, 127490], "mapped", "\u30B5"], [[127491, 127503], "disallowed"], [[127504, 127504], "mapped", "\u624B"], [[127505, 127505], "mapped", "\u5B57"], [[127506, 127506], "mapped", "\u53CC"], [[127507, 127507], "mapped", "\u30C7"], [[127508, 127508], "mapped", "\u4E8C"], [[127509, 127509], "mapped", "\u591A"], [[127510, 127510], "mapped", "\u89E3"], [[127511, 127511], "mapped", "\u5929"], [[127512, 127512], "mapped", "\u4EA4"], [[127513, 127513], "mapped", "\u6620"], [[127514, 127514], "mapped", "\u7121"], [[127515, 127515], "mapped", "\u6599"], [[127516, 127516], "mapped", "\u524D"], [[127517, 127517], "mapped", "\u5F8C"], [[127518, 127518], "mapped", "\u518D"], [[127519, 127519], "mapped", "\u65B0"], [[127520, 127520], "mapped", "\u521D"], [[127521, 127521], "mapped", "\u7D42"], [[127522, 127522], "mapped", "\u751F"], [[127523, 127523], "mapped", "\u8CA9"], [[127524, 127524], "mapped", "\u58F0"], [[127525, 127525], "mapped", "\u5439"], [[127526, 127526], "mapped", "\u6F14"], [[127527, 127527], "mapped", "\u6295"], [[127528, 127528], "mapped", "\u6355"], [[127529, 127529], "mapped", "\u4E00"], [[127530, 127530], "mapped", "\u4E09"], [[127531, 127531], "mapped", "\u904A"], [[127532, 127532], "mapped", "\u5DE6"], [[127533, 127533], "mapped", "\u4E2D"], [[127534, 127534], "mapped", "\u53F3"], [[127535, 127535], "mapped", "\u6307"], [[127536, 127536], "mapped", "\u8D70"], [[127537, 127537], "mapped", "\u6253"], [[127538, 127538], "mapped", "\u7981"], [[127539, 127539], "mapped", "\u7A7A"], [[127540, 127540], "mapped", "\u5408"], [[127541, 127541], "mapped", "\u6E80"], [[127542, 127542], "mapped", "\u6709"], [[127543, 127543], "mapped", "\u6708"], [[127544, 127544], "mapped", "\u7533"], [[127545, 127545], "mapped", "\u5272"], [[127546, 127546], "mapped", "\u55B6"], [[127547, 127547], "mapped", "\u914D"], [[127548, 127551], "disallowed"], [[127552, 127552], "mapped", "\u3014\u672C\u3015"], [[127553, 127553], "mapped", "\u3014\u4E09\u3015"], [[127554, 127554], "mapped", "\u3014\u4E8C\u3015"], [[127555, 127555], "mapped", "\u3014\u5B89\u3015"], [[127556, 127556], "mapped", "\u3014\u70B9\u3015"], [[127557, 127557], "mapped", "\u3014\u6253\u3015"], [[127558, 127558], "mapped", "\u3014\u76D7\u3015"], [[127559, 127559], "mapped", "\u3014\u52DD\u3015"], [[127560, 127560], "mapped", "\u3014\u6557\u3015"], [[127561, 127567], "disallowed"], [[127568, 127568], "mapped", "\u5F97"], [[127569, 127569], "mapped", "\u53EF"], [[127570, 127583], "disallowed"], [[127584, 127589], "valid", "", "NV8"], [[127590, 127743], "disallowed"], [[127744, 127776], "valid", "", "NV8"], [[127777, 127788], "valid", "", "NV8"], [[127789, 127791], "valid", "", "NV8"], [[127792, 127797], "valid", "", "NV8"], [[127798, 127798], "valid", "", "NV8"], [[127799, 127868], "valid", "", "NV8"], [[127869, 127869], "valid", "", "NV8"], [[127870, 127871], "valid", "", "NV8"], [[127872, 127891], "valid", "", "NV8"], [[127892, 127903], "valid", "", "NV8"], [[127904, 127940], "valid", "", "NV8"], [[127941, 127941], "valid", "", "NV8"], [[127942, 127946], "valid", "", "NV8"], [[127947, 127950], "valid", "", "NV8"], [[127951, 127955], "valid", "", "NV8"], [[127956, 127967], "valid", "", "NV8"], [[127968, 127984], "valid", "", "NV8"], [[127985, 127991], "valid", "", "NV8"], [[127992, 127999], "valid", "", "NV8"], [[128e3, 128062], "valid", "", "NV8"], [[128063, 128063], "valid", "", "NV8"], [[128064, 128064], "valid", "", "NV8"], [[128065, 128065], "valid", "", "NV8"], [[128066, 128247], "valid", "", "NV8"], [[128248, 128248], "valid", "", "NV8"], [[128249, 128252], "valid", "", "NV8"], [[128253, 128254], "valid", "", "NV8"], [[128255, 128255], "valid", "", "NV8"], [[128256, 128317], "valid", "", "NV8"], [[128318, 128319], "valid", "", "NV8"], [[128320, 128323], "valid", "", "NV8"], [[128324, 128330], "valid", "", "NV8"], [[128331, 128335], "valid", "", "NV8"], [[128336, 128359], "valid", "", "NV8"], [[128360, 128377], "valid", "", "NV8"], [[128378, 128378], "valid", "", "NV8"], [[128379, 128419], "valid", "", "NV8"], [[128420, 128420], "valid", "", "NV8"], [[128421, 128506], "valid", "", "NV8"], [[128507, 128511], "valid", "", "NV8"], [[128512, 128512], "valid", "", "NV8"], [[128513, 128528], "valid", "", "NV8"], [[128529, 128529], "valid", "", "NV8"], [[128530, 128532], "valid", "", "NV8"], [[128533, 128533], "valid", "", "NV8"], [[128534, 128534], "valid", "", "NV8"], [[128535, 128535], "valid", "", "NV8"], [[128536, 128536], "valid", "", "NV8"], [[128537, 128537], "valid", "", "NV8"], [[128538, 128538], "valid", "", "NV8"], [[128539, 128539], "valid", "", "NV8"], [[128540, 128542], "valid", "", "NV8"], [[128543, 128543], "valid", "", "NV8"], [[128544, 128549], "valid", "", "NV8"], [[128550, 128551], "valid", "", "NV8"], [[128552, 128555], "valid", "", "NV8"], [[128556, 128556], "valid", "", "NV8"], [[128557, 128557], "valid", "", "NV8"], [[128558, 128559], "valid", "", "NV8"], [[128560, 128563], "valid", "", "NV8"], [[128564, 128564], "valid", "", "NV8"], [[128565, 128576], "valid", "", "NV8"], [[128577, 128578], "valid", "", "NV8"], [[128579, 128580], "valid", "", "NV8"], [[128581, 128591], "valid", "", "NV8"], [[128592, 128639], "valid", "", "NV8"], [[128640, 128709], "valid", "", "NV8"], [[128710, 128719], "valid", "", "NV8"], [[128720, 128720], "valid", "", "NV8"], [[128721, 128722], "valid", "", "NV8"], [[128723, 128724], "valid", "", "NV8"], [[128725, 128735], "disallowed"], [[128736, 128748], "valid", "", "NV8"], [[128749, 128751], "disallowed"], [[128752, 128755], "valid", "", "NV8"], [[128756, 128758], "valid", "", "NV8"], [[128759, 128760], "valid", "", "NV8"], [[128761, 128767], "disallowed"], [[128768, 128883], "valid", "", "NV8"], [[128884, 128895], "disallowed"], [[128896, 128980], "valid", "", "NV8"], [[128981, 129023], "disallowed"], [[129024, 129035], "valid", "", "NV8"], [[129036, 129039], "disallowed"], [[129040, 129095], "valid", "", "NV8"], [[129096, 129103], "disallowed"], [[129104, 129113], "valid", "", "NV8"], [[129114, 129119], "disallowed"], [[129120, 129159], "valid", "", "NV8"], [[129160, 129167], "disallowed"], [[129168, 129197], "valid", "", "NV8"], [[129198, 129279], "disallowed"], [[129280, 129291], "valid", "", "NV8"], [[129292, 129295], "disallowed"], [[129296, 129304], "valid", "", "NV8"], [[129305, 129310], "valid", "", "NV8"], [[129311, 129311], "valid", "", "NV8"], [[129312, 129319], "valid", "", "NV8"], [[129320, 129327], "valid", "", "NV8"], [[129328, 129328], "valid", "", "NV8"], [[129329, 129330], "valid", "", "NV8"], [[129331, 129342], "valid", "", "NV8"], [[129343, 129343], "disallowed"], [[129344, 129355], "valid", "", "NV8"], [[129356, 129356], "valid", "", "NV8"], [[129357, 129359], "disallowed"], [[129360, 129374], "valid", "", "NV8"], [[129375, 129387], "valid", "", "NV8"], [[129388, 129407], "disallowed"], [[129408, 129412], "valid", "", "NV8"], [[129413, 129425], "valid", "", "NV8"], [[129426, 129431], "valid", "", "NV8"], [[129432, 129471], "disallowed"], [[129472, 129472], "valid", "", "NV8"], [[129473, 129487], "disallowed"], [[129488, 129510], "valid", "", "NV8"], [[129511, 131069], "disallowed"], [[131070, 131071], "disallowed"], [[131072, 173782], "valid"], [[173783, 173823], "disallowed"], [[173824, 177972], "valid"], [[177973, 177983], "disallowed"], [[177984, 178205], "valid"], [[178206, 178207], "disallowed"], [[178208, 183969], "valid"], [[183970, 183983], "disallowed"], [[183984, 191456], "valid"], [[191457, 194559], "disallowed"], [[194560, 194560], "mapped", "\u4E3D"], [[194561, 194561], "mapped", "\u4E38"], [[194562, 194562], "mapped", "\u4E41"], [[194563, 194563], "mapped", "\u{20122}"], [[194564, 194564], "mapped", "\u4F60"], [[194565, 194565], "mapped", "\u4FAE"], [[194566, 194566], "mapped", "\u4FBB"], [[194567, 194567], "mapped", "\u5002"], [[194568, 194568], "mapped", "\u507A"], [[194569, 194569], "mapped", "\u5099"], [[194570, 194570], "mapped", "\u50E7"], [[194571, 194571], "mapped", "\u50CF"], [[194572, 194572], "mapped", "\u349E"], [[194573, 194573], "mapped", "\u{2063A}"], [[194574, 194574], "mapped", "\u514D"], [[194575, 194575], "mapped", "\u5154"], [[194576, 194576], "mapped", "\u5164"], [[194577, 194577], "mapped", "\u5177"], [[194578, 194578], "mapped", "\u{2051C}"], [[194579, 194579], "mapped", "\u34B9"], [[194580, 194580], "mapped", "\u5167"], [[194581, 194581], "mapped", "\u518D"], [[194582, 194582], "mapped", "\u{2054B}"], [[194583, 194583], "mapped", "\u5197"], [[194584, 194584], "mapped", "\u51A4"], [[194585, 194585], "mapped", "\u4ECC"], [[194586, 194586], "mapped", "\u51AC"], [[194587, 194587], "mapped", "\u51B5"], [[194588, 194588], "mapped", "\u{291DF}"], [[194589, 194589], "mapped", "\u51F5"], [[194590, 194590], "mapped", "\u5203"], [[194591, 194591], "mapped", "\u34DF"], [[194592, 194592], "mapped", "\u523B"], [[194593, 194593], "mapped", "\u5246"], [[194594, 194594], "mapped", "\u5272"], [[194595, 194595], "mapped", "\u5277"], [[194596, 194596], "mapped", "\u3515"], [[194597, 194597], "mapped", "\u52C7"], [[194598, 194598], "mapped", "\u52C9"], [[194599, 194599], "mapped", "\u52E4"], [[194600, 194600], "mapped", "\u52FA"], [[194601, 194601], "mapped", "\u5305"], [[194602, 194602], "mapped", "\u5306"], [[194603, 194603], "mapped", "\u5317"], [[194604, 194604], "mapped", "\u5349"], [[194605, 194605], "mapped", "\u5351"], [[194606, 194606], "mapped", "\u535A"], [[194607, 194607], "mapped", "\u5373"], [[194608, 194608], "mapped", "\u537D"], [[194609, 194611], "mapped", "\u537F"], [[194612, 194612], "mapped", "\u{20A2C}"], [[194613, 194613], "mapped", "\u7070"], [[194614, 194614], "mapped", "\u53CA"], [[194615, 194615], "mapped", "\u53DF"], [[194616, 194616], "mapped", "\u{20B63}"], [[194617, 194617], "mapped", "\u53EB"], [[194618, 194618], "mapped", "\u53F1"], [[194619, 194619], "mapped", "\u5406"], [[194620, 194620], "mapped", "\u549E"], [[194621, 194621], "mapped", "\u5438"], [[194622, 194622], "mapped", "\u5448"], [[194623, 194623], "mapped", "\u5468"], [[194624, 194624], "mapped", "\u54A2"], [[194625, 194625], "mapped", "\u54F6"], [[194626, 194626], "mapped", "\u5510"], [[194627, 194627], "mapped", "\u5553"], [[194628, 194628], "mapped", "\u5563"], [[194629, 194630], "mapped", "\u5584"], [[194631, 194631], "mapped", "\u5599"], [[194632, 194632], "mapped", "\u55AB"], [[194633, 194633], "mapped", "\u55B3"], [[194634, 194634], "mapped", "\u55C2"], [[194635, 194635], "mapped", "\u5716"], [[194636, 194636], "mapped", "\u5606"], [[194637, 194637], "mapped", "\u5717"], [[194638, 194638], "mapped", "\u5651"], [[194639, 194639], "mapped", "\u5674"], [[194640, 194640], "mapped", "\u5207"], [[194641, 194641], "mapped", "\u58EE"], [[194642, 194642], "mapped", "\u57CE"], [[194643, 194643], "mapped", "\u57F4"], [[194644, 194644], "mapped", "\u580D"], [[194645, 194645], "mapped", "\u578B"], [[194646, 194646], "mapped", "\u5832"], [[194647, 194647], "mapped", "\u5831"], [[194648, 194648], "mapped", "\u58AC"], [[194649, 194649], "mapped", "\u{214E4}"], [[194650, 194650], "mapped", "\u58F2"], [[194651, 194651], "mapped", "\u58F7"], [[194652, 194652], "mapped", "\u5906"], [[194653, 194653], "mapped", "\u591A"], [[194654, 194654], "mapped", "\u5922"], [[194655, 194655], "mapped", "\u5962"], [[194656, 194656], "mapped", "\u{216A8}"], [[194657, 194657], "mapped", "\u{216EA}"], [[194658, 194658], "mapped", "\u59EC"], [[194659, 194659], "mapped", "\u5A1B"], [[194660, 194660], "mapped", "\u5A27"], [[194661, 194661], "mapped", "\u59D8"], [[194662, 194662], "mapped", "\u5A66"], [[194663, 194663], "mapped", "\u36EE"], [[194664, 194664], "disallowed"], [[194665, 194665], "mapped", "\u5B08"], [[194666, 194667], "mapped", "\u5B3E"], [[194668, 194668], "mapped", "\u{219C8}"], [[194669, 194669], "mapped", "\u5BC3"], [[194670, 194670], "mapped", "\u5BD8"], [[194671, 194671], "mapped", "\u5BE7"], [[194672, 194672], "mapped", "\u5BF3"], [[194673, 194673], "mapped", "\u{21B18}"], [[194674, 194674], "mapped", "\u5BFF"], [[194675, 194675], "mapped", "\u5C06"], [[194676, 194676], "disallowed"], [[194677, 194677], "mapped", "\u5C22"], [[194678, 194678], "mapped", "\u3781"], [[194679, 194679], "mapped", "\u5C60"], [[194680, 194680], "mapped", "\u5C6E"], [[194681, 194681], "mapped", "\u5CC0"], [[194682, 194682], "mapped", "\u5C8D"], [[194683, 194683], "mapped", "\u{21DE4}"], [[194684, 194684], "mapped", "\u5D43"], [[194685, 194685], "mapped", "\u{21DE6}"], [[194686, 194686], "mapped", "\u5D6E"], [[194687, 194687], "mapped", "\u5D6B"], [[194688, 194688], "mapped", "\u5D7C"], [[194689, 194689], "mapped", "\u5DE1"], [[194690, 194690], "mapped", "\u5DE2"], [[194691, 194691], "mapped", "\u382F"], [[194692, 194692], "mapped", "\u5DFD"], [[194693, 194693], "mapped", "\u5E28"], [[194694, 194694], "mapped", "\u5E3D"], [[194695, 194695], "mapped", "\u5E69"], [[194696, 194696], "mapped", "\u3862"], [[194697, 194697], "mapped", "\u{22183}"], [[194698, 194698], "mapped", "\u387C"], [[194699, 194699], "mapped", "\u5EB0"], [[194700, 194700], "mapped", "\u5EB3"], [[194701, 194701], "mapped", "\u5EB6"], [[194702, 194702], "mapped", "\u5ECA"], [[194703, 194703], "mapped", "\u{2A392}"], [[194704, 194704], "mapped", "\u5EFE"], [[194705, 194706], "mapped", "\u{22331}"], [[194707, 194707], "mapped", "\u8201"], [[194708, 194709], "mapped", "\u5F22"], [[194710, 194710], "mapped", "\u38C7"], [[194711, 194711], "mapped", "\u{232B8}"], [[194712, 194712], "mapped", "\u{261DA}"], [[194713, 194713], "mapped", "\u5F62"], [[194714, 194714], "mapped", "\u5F6B"], [[194715, 194715], "mapped", "\u38E3"], [[194716, 194716], "mapped", "\u5F9A"], [[194717, 194717], "mapped", "\u5FCD"], [[194718, 194718], "mapped", "\u5FD7"], [[194719, 194719], "mapped", "\u5FF9"], [[194720, 194720], "mapped", "\u6081"], [[194721, 194721], "mapped", "\u393A"], [[194722, 194722], "mapped", "\u391C"], [[194723, 194723], "mapped", "\u6094"], [[194724, 194724], "mapped", "\u{226D4}"], [[194725, 194725], "mapped", "\u60C7"], [[194726, 194726], "mapped", "\u6148"], [[194727, 194727], "mapped", "\u614C"], [[194728, 194728], "mapped", "\u614E"], [[194729, 194729], "mapped", "\u614C"], [[194730, 194730], "mapped", "\u617A"], [[194731, 194731], "mapped", "\u618E"], [[194732, 194732], "mapped", "\u61B2"], [[194733, 194733], "mapped", "\u61A4"], [[194734, 194734], "mapped", "\u61AF"], [[194735, 194735], "mapped", "\u61DE"], [[194736, 194736], "mapped", "\u61F2"], [[194737, 194737], "mapped", "\u61F6"], [[194738, 194738], "mapped", "\u6210"], [[194739, 194739], "mapped", "\u621B"], [[194740, 194740], "mapped", "\u625D"], [[194741, 194741], "mapped", "\u62B1"], [[194742, 194742], "mapped", "\u62D4"], [[194743, 194743], "mapped", "\u6350"], [[194744, 194744], "mapped", "\u{22B0C}"], [[194745, 194745], "mapped", "\u633D"], [[194746, 194746], "mapped", "\u62FC"], [[194747, 194747], "mapped", "\u6368"], [[194748, 194748], "mapped", "\u6383"], [[194749, 194749], "mapped", "\u63E4"], [[194750, 194750], "mapped", "\u{22BF1}"], [[194751, 194751], "mapped", "\u6422"], [[194752, 194752], "mapped", "\u63C5"], [[194753, 194753], "mapped", "\u63A9"], [[194754, 194754], "mapped", "\u3A2E"], [[194755, 194755], "mapped", "\u6469"], [[194756, 194756], "mapped", "\u647E"], [[194757, 194757], "mapped", "\u649D"], [[194758, 194758], "mapped", "\u6477"], [[194759, 194759], "mapped", "\u3A6C"], [[194760, 194760], "mapped", "\u654F"], [[194761, 194761], "mapped", "\u656C"], [[194762, 194762], "mapped", "\u{2300A}"], [[194763, 194763], "mapped", "\u65E3"], [[194764, 194764], "mapped", "\u66F8"], [[194765, 194765], "mapped", "\u6649"], [[194766, 194766], "mapped", "\u3B19"], [[194767, 194767], "mapped", "\u6691"], [[194768, 194768], "mapped", "\u3B08"], [[194769, 194769], "mapped", "\u3AE4"], [[194770, 194770], "mapped", "\u5192"], [[194771, 194771], "mapped", "\u5195"], [[194772, 194772], "mapped", "\u6700"], [[194773, 194773], "mapped", "\u669C"], [[194774, 194774], "mapped", "\u80AD"], [[194775, 194775], "mapped", "\u43D9"], [[194776, 194776], "mapped", "\u6717"], [[194777, 194777], "mapped", "\u671B"], [[194778, 194778], "mapped", "\u6721"], [[194779, 194779], "mapped", "\u675E"], [[194780, 194780], "mapped", "\u6753"], [[194781, 194781], "mapped", "\u{233C3}"], [[194782, 194782], "mapped", "\u3B49"], [[194783, 194783], "mapped", "\u67FA"], [[194784, 194784], "mapped", "\u6785"], [[194785, 194785], "mapped", "\u6852"], [[194786, 194786], "mapped", "\u6885"], [[194787, 194787], "mapped", "\u{2346D}"], [[194788, 194788], "mapped", "\u688E"], [[194789, 194789], "mapped", "\u681F"], [[194790, 194790], "mapped", "\u6914"], [[194791, 194791], "mapped", "\u3B9D"], [[194792, 194792], "mapped", "\u6942"], [[194793, 194793], "mapped", "\u69A3"], [[194794, 194794], "mapped", "\u69EA"], [[194795, 194795], "mapped", "\u6AA8"], [[194796, 194796], "mapped", "\u{236A3}"], [[194797, 194797], "mapped", "\u6ADB"], [[194798, 194798], "mapped", "\u3C18"], [[194799, 194799], "mapped", "\u6B21"], [[194800, 194800], "mapped", "\u{238A7}"], [[194801, 194801], "mapped", "\u6B54"], [[194802, 194802], "mapped", "\u3C4E"], [[194803, 194803], "mapped", "\u6B72"], [[194804, 194804], "mapped", "\u6B9F"], [[194805, 194805], "mapped", "\u6BBA"], [[194806, 194806], "mapped", "\u6BBB"], [[194807, 194807], "mapped", "\u{23A8D}"], [[194808, 194808], "mapped", "\u{21D0B}"], [[194809, 194809], "mapped", "\u{23AFA}"], [[194810, 194810], "mapped", "\u6C4E"], [[194811, 194811], "mapped", "\u{23CBC}"], [[194812, 194812], "mapped", "\u6CBF"], [[194813, 194813], "mapped", "\u6CCD"], [[194814, 194814], "mapped", "\u6C67"], [[194815, 194815], "mapped", "\u6D16"], [[194816, 194816], "mapped", "\u6D3E"], [[194817, 194817], "mapped", "\u6D77"], [[194818, 194818], "mapped", "\u6D41"], [[194819, 194819], "mapped", "\u6D69"], [[194820, 194820], "mapped", "\u6D78"], [[194821, 194821], "mapped", "\u6D85"], [[194822, 194822], "mapped", "\u{23D1E}"], [[194823, 194823], "mapped", "\u6D34"], [[194824, 194824], "mapped", "\u6E2F"], [[194825, 194825], "mapped", "\u6E6E"], [[194826, 194826], "mapped", "\u3D33"], [[194827, 194827], "mapped", "\u6ECB"], [[194828, 194828], "mapped", "\u6EC7"], [[194829, 194829], "mapped", "\u{23ED1}"], [[194830, 194830], "mapped", "\u6DF9"], [[194831, 194831], "mapped", "\u6F6E"], [[194832, 194832], "mapped", "\u{23F5E}"], [[194833, 194833], "mapped", "\u{23F8E}"], [[194834, 194834], "mapped", "\u6FC6"], [[194835, 194835], "mapped", "\u7039"], [[194836, 194836], "mapped", "\u701E"], [[194837, 194837], "mapped", "\u701B"], [[194838, 194838], "mapped", "\u3D96"], [[194839, 194839], "mapped", "\u704A"], [[194840, 194840], "mapped", "\u707D"], [[194841, 194841], "mapped", "\u7077"], [[194842, 194842], "mapped", "\u70AD"], [[194843, 194843], "mapped", "\u{20525}"], [[194844, 194844], "mapped", "\u7145"], [[194845, 194845], "mapped", "\u{24263}"], [[194846, 194846], "mapped", "\u719C"], [[194847, 194847], "disallowed"], [[194848, 194848], "mapped", "\u7228"], [[194849, 194849], "mapped", "\u7235"], [[194850, 194850], "mapped", "\u7250"], [[194851, 194851], "mapped", "\u{24608}"], [[194852, 194852], "mapped", "\u7280"], [[194853, 194853], "mapped", "\u7295"], [[194854, 194854], "mapped", "\u{24735}"], [[194855, 194855], "mapped", "\u{24814}"], [[194856, 194856], "mapped", "\u737A"], [[194857, 194857], "mapped", "\u738B"], [[194858, 194858], "mapped", "\u3EAC"], [[194859, 194859], "mapped", "\u73A5"], [[194860, 194861], "mapped", "\u3EB8"], [[194862, 194862], "mapped", "\u7447"], [[194863, 194863], "mapped", "\u745C"], [[194864, 194864], "mapped", "\u7471"], [[194865, 194865], "mapped", "\u7485"], [[194866, 194866], "mapped", "\u74CA"], [[194867, 194867], "mapped", "\u3F1B"], [[194868, 194868], "mapped", "\u7524"], [[194869, 194869], "mapped", "\u{24C36}"], [[194870, 194870], "mapped", "\u753E"], [[194871, 194871], "mapped", "\u{24C92}"], [[194872, 194872], "mapped", "\u7570"], [[194873, 194873], "mapped", "\u{2219F}"], [[194874, 194874], "mapped", "\u7610"], [[194875, 194875], "mapped", "\u{24FA1}"], [[194876, 194876], "mapped", "\u{24FB8}"], [[194877, 194877], "mapped", "\u{25044}"], [[194878, 194878], "mapped", "\u3FFC"], [[194879, 194879], "mapped", "\u4008"], [[194880, 194880], "mapped", "\u76F4"], [[194881, 194881], "mapped", "\u{250F3}"], [[194882, 194882], "mapped", "\u{250F2}"], [[194883, 194883], "mapped", "\u{25119}"], [[194884, 194884], "mapped", "\u{25133}"], [[194885, 194885], "mapped", "\u771E"], [[194886, 194887], "mapped", "\u771F"], [[194888, 194888], "mapped", "\u774A"], [[194889, 194889], "mapped", "\u4039"], [[194890, 194890], "mapped", "\u778B"], [[194891, 194891], "mapped", "\u4046"], [[194892, 194892], "mapped", "\u4096"], [[194893, 194893], "mapped", "\u{2541D}"], [[194894, 194894], "mapped", "\u784E"], [[194895, 194895], "mapped", "\u788C"], [[194896, 194896], "mapped", "\u78CC"], [[194897, 194897], "mapped", "\u40E3"], [[194898, 194898], "mapped", "\u{25626}"], [[194899, 194899], "mapped", "\u7956"], [[194900, 194900], "mapped", "\u{2569A}"], [[194901, 194901], "mapped", "\u{256C5}"], [[194902, 194902], "mapped", "\u798F"], [[194903, 194903], "mapped", "\u79EB"], [[194904, 194904], "mapped", "\u412F"], [[194905, 194905], "mapped", "\u7A40"], [[194906, 194906], "mapped", "\u7A4A"], [[194907, 194907], "mapped", "\u7A4F"], [[194908, 194908], "mapped", "\u{2597C}"], [[194909, 194910], "mapped", "\u{25AA7}"], [[194911, 194911], "disallowed"], [[194912, 194912], "mapped", "\u4202"], [[194913, 194913], "mapped", "\u{25BAB}"], [[194914, 194914], "mapped", "\u7BC6"], [[194915, 194915], "mapped", "\u7BC9"], [[194916, 194916], "mapped", "\u4227"], [[194917, 194917], "mapped", "\u{25C80}"], [[194918, 194918], "mapped", "\u7CD2"], [[194919, 194919], "mapped", "\u42A0"], [[194920, 194920], "mapped", "\u7CE8"], [[194921, 194921], "mapped", "\u7CE3"], [[194922, 194922], "mapped", "\u7D00"], [[194923, 194923], "mapped", "\u{25F86}"], [[194924, 194924], "mapped", "\u7D63"], [[194925, 194925], "mapped", "\u4301"], [[194926, 194926], "mapped", "\u7DC7"], [[194927, 194927], "mapped", "\u7E02"], [[194928, 194928], "mapped", "\u7E45"], [[194929, 194929], "mapped", "\u4334"], [[194930, 194930], "mapped", "\u{26228}"], [[194931, 194931], "mapped", "\u{26247}"], [[194932, 194932], "mapped", "\u4359"], [[194933, 194933], "mapped", "\u{262D9}"], [[194934, 194934], "mapped", "\u7F7A"], [[194935, 194935], "mapped", "\u{2633E}"], [[194936, 194936], "mapped", "\u7F95"], [[194937, 194937], "mapped", "\u7FFA"], [[194938, 194938], "mapped", "\u8005"], [[194939, 194939], "mapped", "\u{264DA}"], [[194940, 194940], "mapped", "\u{26523}"], [[194941, 194941], "mapped", "\u8060"], [[194942, 194942], "mapped", "\u{265A8}"], [[194943, 194943], "mapped", "\u8070"], [[194944, 194944], "mapped", "\u{2335F}"], [[194945, 194945], "mapped", "\u43D5"], [[194946, 194946], "mapped", "\u80B2"], [[194947, 194947], "mapped", "\u8103"], [[194948, 194948], "mapped", "\u440B"], [[194949, 194949], "mapped", "\u813E"], [[194950, 194950], "mapped", "\u5AB5"], [[194951, 194951], "mapped", "\u{267A7}"], [[194952, 194952], "mapped", "\u{267B5}"], [[194953, 194953], "mapped", "\u{23393}"], [[194954, 194954], "mapped", "\u{2339C}"], [[194955, 194955], "mapped", "\u8201"], [[194956, 194956], "mapped", "\u8204"], [[194957, 194957], "mapped", "\u8F9E"], [[194958, 194958], "mapped", "\u446B"], [[194959, 194959], "mapped", "\u8291"], [[194960, 194960], "mapped", "\u828B"], [[194961, 194961], "mapped", "\u829D"], [[194962, 194962], "mapped", "\u52B3"], [[194963, 194963], "mapped", "\u82B1"], [[194964, 194964], "mapped", "\u82B3"], [[194965, 194965], "mapped", "\u82BD"], [[194966, 194966], "mapped", "\u82E6"], [[194967, 194967], "mapped", "\u{26B3C}"], [[194968, 194968], "mapped", "\u82E5"], [[194969, 194969], "mapped", "\u831D"], [[194970, 194970], "mapped", "\u8363"], [[194971, 194971], "mapped", "\u83AD"], [[194972, 194972], "mapped", "\u8323"], [[194973, 194973], "mapped", "\u83BD"], [[194974, 194974], "mapped", "\u83E7"], [[194975, 194975], "mapped", "\u8457"], [[194976, 194976], "mapped", "\u8353"], [[194977, 194977], "mapped", "\u83CA"], [[194978, 194978], "mapped", "\u83CC"], [[194979, 194979], "mapped", "\u83DC"], [[194980, 194980], "mapped", "\u{26C36}"], [[194981, 194981], "mapped", "\u{26D6B}"], [[194982, 194982], "mapped", "\u{26CD5}"], [[194983, 194983], "mapped", "\u452B"], [[194984, 194984], "mapped", "\u84F1"], [[194985, 194985], "mapped", "\u84F3"], [[194986, 194986], "mapped", "\u8516"], [[194987, 194987], "mapped", "\u{273CA}"], [[194988, 194988], "mapped", "\u8564"], [[194989, 194989], "mapped", "\u{26F2C}"], [[194990, 194990], "mapped", "\u455D"], [[194991, 194991], "mapped", "\u4561"], [[194992, 194992], "mapped", "\u{26FB1}"], [[194993, 194993], "mapped", "\u{270D2}"], [[194994, 194994], "mapped", "\u456B"], [[194995, 194995], "mapped", "\u8650"], [[194996, 194996], "mapped", "\u865C"], [[194997, 194997], "mapped", "\u8667"], [[194998, 194998], "mapped", "\u8669"], [[194999, 194999], "mapped", "\u86A9"], [[195e3, 195e3], "mapped", "\u8688"], [[195001, 195001], "mapped", "\u870E"], [[195002, 195002], "mapped", "\u86E2"], [[195003, 195003], "mapped", "\u8779"], [[195004, 195004], "mapped", "\u8728"], [[195005, 195005], "mapped", "\u876B"], [[195006, 195006], "mapped", "\u8786"], [[195007, 195007], "disallowed"], [[195008, 195008], "mapped", "\u87E1"], [[195009, 195009], "mapped", "\u8801"], [[195010, 195010], "mapped", "\u45F9"], [[195011, 195011], "mapped", "\u8860"], [[195012, 195012], "mapped", "\u8863"], [[195013, 195013], "mapped", "\u{27667}"], [[195014, 195014], "mapped", "\u88D7"], [[195015, 195015], "mapped", "\u88DE"], [[195016, 195016], "mapped", "\u4635"], [[195017, 195017], "mapped", "\u88FA"], [[195018, 195018], "mapped", "\u34BB"], [[195019, 195019], "mapped", "\u{278AE}"], [[195020, 195020], "mapped", "\u{27966}"], [[195021, 195021], "mapped", "\u46BE"], [[195022, 195022], "mapped", "\u46C7"], [[195023, 195023], "mapped", "\u8AA0"], [[195024, 195024], "mapped", "\u8AED"], [[195025, 195025], "mapped", "\u8B8A"], [[195026, 195026], "mapped", "\u8C55"], [[195027, 195027], "mapped", "\u{27CA8}"], [[195028, 195028], "mapped", "\u8CAB"], [[195029, 195029], "mapped", "\u8CC1"], [[195030, 195030], "mapped", "\u8D1B"], [[195031, 195031], "mapped", "\u8D77"], [[195032, 195032], "mapped", "\u{27F2F}"], [[195033, 195033], "mapped", "\u{20804}"], [[195034, 195034], "mapped", "\u8DCB"], [[195035, 195035], "mapped", "\u8DBC"], [[195036, 195036], "mapped", "\u8DF0"], [[195037, 195037], "mapped", "\u{208DE}"], [[195038, 195038], "mapped", "\u8ED4"], [[195039, 195039], "mapped", "\u8F38"], [[195040, 195040], "mapped", "\u{285D2}"], [[195041, 195041], "mapped", "\u{285ED}"], [[195042, 195042], "mapped", "\u9094"], [[195043, 195043], "mapped", "\u90F1"], [[195044, 195044], "mapped", "\u9111"], [[195045, 195045], "mapped", "\u{2872E}"], [[195046, 195046], "mapped", "\u911B"], [[195047, 195047], "mapped", "\u9238"], [[195048, 195048], "mapped", "\u92D7"], [[195049, 195049], "mapped", "\u92D8"], [[195050, 195050], "mapped", "\u927C"], [[195051, 195051], "mapped", "\u93F9"], [[195052, 195052], "mapped", "\u9415"], [[195053, 195053], "mapped", "\u{28BFA}"], [[195054, 195054], "mapped", "\u958B"], [[195055, 195055], "mapped", "\u4995"], [[195056, 195056], "mapped", "\u95B7"], [[195057, 195057], "mapped", "\u{28D77}"], [[195058, 195058], "mapped", "\u49E6"], [[195059, 195059], "mapped", "\u96C3"], [[195060, 195060], "mapped", "\u5DB2"], [[195061, 195061], "mapped", "\u9723"], [[195062, 195062], "mapped", "\u{29145}"], [[195063, 195063], "mapped", "\u{2921A}"], [[195064, 195064], "mapped", "\u4A6E"], [[195065, 195065], "mapped", "\u4A76"], [[195066, 195066], "mapped", "\u97E0"], [[195067, 195067], "mapped", "\u{2940A}"], [[195068, 195068], "mapped", "\u4AB2"], [[195069, 195069], "mapped", "\u{29496}"], [[195070, 195071], "mapped", "\u980B"], [[195072, 195072], "mapped", "\u9829"], [[195073, 195073], "mapped", "\u{295B6}"], [[195074, 195074], "mapped", "\u98E2"], [[195075, 195075], "mapped", "\u4B33"], [[195076, 195076], "mapped", "\u9929"], [[195077, 195077], "mapped", "\u99A7"], [[195078, 195078], "mapped", "\u99C2"], [[195079, 195079], "mapped", "\u99FE"], [[195080, 195080], "mapped", "\u4BCE"], [[195081, 195081], "mapped", "\u{29B30}"], [[195082, 195082], "mapped", "\u9B12"], [[195083, 195083], "mapped", "\u9C40"], [[195084, 195084], "mapped", "\u9CFD"], [[195085, 195085], "mapped", "\u4CCE"], [[195086, 195086], "mapped", "\u4CED"], [[195087, 195087], "mapped", "\u9D67"], [[195088, 195088], "mapped", "\u{2A0CE}"], [[195089, 195089], "mapped", "\u4CF8"], [[195090, 195090], "mapped", "\u{2A105}"], [[195091, 195091], "mapped", "\u{2A20E}"], [[195092, 195092], "mapped", "\u{2A291}"], [[195093, 195093], "mapped", "\u9EBB"], [[195094, 195094], "mapped", "\u4D56"], [[195095, 195095], "mapped", "\u9EF9"], [[195096, 195096], "mapped", "\u9EFE"], [[195097, 195097], "mapped", "\u9F05"], [[195098, 195098], "mapped", "\u9F0F"], [[195099, 195099], "mapped", "\u9F16"], [[195100, 195100], "mapped", "\u9F3B"], [[195101, 195101], "mapped", "\u{2A600}"], [[195102, 196605], "disallowed"], [[196606, 196607], "disallowed"], [[196608, 262141], "disallowed"], [[262142, 262143], "disallowed"], [[262144, 327677], "disallowed"], [[327678, 327679], "disallowed"], [[327680, 393213], "disallowed"], [[393214, 393215], "disallowed"], [[393216, 458749], "disallowed"], [[458750, 458751], "disallowed"], [[458752, 524285], "disallowed"], [[524286, 524287], "disallowed"], [[524288, 589821], "disallowed"], [[589822, 589823], "disallowed"], [[589824, 655357], "disallowed"], [[655358, 655359], "disallowed"], [[655360, 720893], "disallowed"], [[720894, 720895], "disallowed"], [[720896, 786429], "disallowed"], [[786430, 786431], "disallowed"], [[786432, 851965], "disallowed"], [[851966, 851967], "disallowed"], [[851968, 917501], "disallowed"], [[917502, 917503], "disallowed"], [[917504, 917504], "disallowed"], [[917505, 917505], "disallowed"], [[917506, 917535], "disallowed"], [[917536, 917631], "disallowed"], [[917632, 917759], "disallowed"], [[917760, 917999], "ignored"], [[918e3, 983037], "disallowed"], [[983038, 983039], "disallowed"], [[983040, 1048573], "disallowed"], [[1048574, 1048575], "disallowed"], [[1048576, 1114109], "disallowed"], [[1114110, 1114111], "disallowed"]];
});

// node_modules/tr46/index.js
var require_tr46 = __commonJS((exports2, module2) => {
  "use strict";
  var punycode = require_punycode();
  var regexes = require_regexes();
  var mappingTable = require_mappingTable();
  function containsNonASCII(str) {
    return /[^\x00-\x7F]/.test(str);
  }
  function findStatus(val, {useSTD3ASCIIRules}) {
    let start = 0;
    let end = mappingTable.length - 1;
    while (start <= end) {
      const mid = Math.floor((start + end) / 2);
      const target = mappingTable[mid];
      if (target[0][0] <= val && target[0][1] >= val) {
        if (target[1].startsWith("disallowed_STD3_")) {
          const newStatus = useSTD3ASCIIRules ? "disallowed" : target[1].slice(16);
          return [newStatus, ...target.slice(2)];
        }
        return target.slice(1);
      } else if (target[0][0] > val) {
        end = mid - 1;
      } else {
        start = mid + 1;
      }
    }
    return null;
  }
  function mapChars(domainName, {useSTD3ASCIIRules, processingOption}) {
    let hasError = false;
    let processed = "";
    for (const ch of domainName) {
      const [status, mapping] = findStatus(ch.codePointAt(0), {useSTD3ASCIIRules});
      switch (status) {
        case "disallowed":
          hasError = true;
          processed += ch;
          break;
        case "ignored":
          break;
        case "mapped":
          processed += mapping;
          break;
        case "deviation":
          if (processingOption === "transitional") {
            processed += mapping;
          } else {
            processed += ch;
          }
          break;
        case "valid":
          processed += ch;
          break;
      }
    }
    return {
      string: processed,
      error: hasError
    };
  }
  function validateLabel(label, {checkHyphens, checkBidi, checkJoiners, processingOption, useSTD3ASCIIRules}) {
    if (label.normalize("NFC") !== label) {
      return false;
    }
    const codePoints = Array.from(label);
    if (checkHyphens) {
      if (codePoints[2] === "-" && codePoints[3] === "-" || (label.startsWith("-") || label.endsWith("-"))) {
        return false;
      }
    }
    if (label.includes(".") || codePoints.length > 0 && regexes.combiningMarks.test(codePoints[0])) {
      return false;
    }
    for (const ch of codePoints) {
      const [status] = findStatus(ch.codePointAt(0), {useSTD3ASCIIRules});
      if (processingOption === "transitional" && status !== "valid" || processingOption === "nontransitional" && status !== "valid" && status !== "deviation") {
        return false;
      }
    }
    if (checkJoiners) {
      let last = 0;
      for (const [i, ch] of codePoints.entries()) {
        if (ch === "\u200C" || ch === "\u200D") {
          if (i > 0) {
            if (regexes.combiningClassVirama.test(codePoints[i - 1])) {
              continue;
            }
            if (ch === "\u200C") {
              const next = codePoints.indexOf("\u200C", i + 1);
              const test = next < 0 ? codePoints.slice(last) : codePoints.slice(last, next);
              if (regexes.validZWNJ.test(test.join(""))) {
                last = i + 1;
                continue;
              }
            }
          }
          return false;
        }
      }
    }
    if (checkBidi) {
      let rtl;
      if (regexes.bidiS1LTR.test(codePoints[0])) {
        rtl = false;
      } else if (regexes.bidiS1RTL.test(codePoints[0])) {
        rtl = true;
      } else {
        return false;
      }
      if (rtl) {
        if (!regexes.bidiS2.test(label) || !regexes.bidiS3.test(label) || regexes.bidiS4EN.test(label) && regexes.bidiS4AN.test(label)) {
          return false;
        }
      } else if (!regexes.bidiS5.test(label) || !regexes.bidiS6.test(label)) {
        return false;
      }
    }
    return true;
  }
  function isBidiDomain(labels) {
    const domain = labels.map((label) => {
      if (label.startsWith("xn--")) {
        try {
          return punycode.decode(label.substring(4));
        } catch (err) {
          return "";
        }
      }
      return label;
    }).join(".");
    return regexes.bidiDomain.test(domain);
  }
  function processing(domainName, options) {
    const {processingOption} = options;
    let {string, error} = mapChars(domainName, options);
    string = string.normalize("NFC");
    const labels = string.split(".");
    const isBidi = isBidiDomain(labels);
    for (const [i, origLabel] of labels.entries()) {
      let label = origLabel;
      let curProcessing = processingOption;
      if (label.startsWith("xn--")) {
        try {
          label = punycode.decode(label.substring(4));
          labels[i] = label;
        } catch (err) {
          error = true;
          continue;
        }
        curProcessing = "nontransitional";
      }
      if (error) {
        continue;
      }
      const validation = validateLabel(label, Object.assign({}, options, {
        processingOption: curProcessing,
        checkBidi: options.checkBidi && isBidi
      }));
      if (!validation) {
        error = true;
      }
    }
    return {
      string: labels.join("."),
      error
    };
  }
  function toASCII(domainName, {
    checkHyphens = false,
    checkBidi = false,
    checkJoiners = false,
    useSTD3ASCIIRules = false,
    processingOption = "nontransitional",
    verifyDNSLength = false
  } = {}) {
    if (processingOption !== "transitional" && processingOption !== "nontransitional") {
      throw new RangeError("processingOption must be either transitional or nontransitional");
    }
    const result = processing(domainName, {
      processingOption,
      checkHyphens,
      checkBidi,
      checkJoiners,
      useSTD3ASCIIRules
    });
    let labels = result.string.split(".");
    labels = labels.map((l) => {
      if (containsNonASCII(l)) {
        try {
          return "xn--" + punycode.encode(l);
        } catch (e) {
          result.error = true;
        }
      }
      return l;
    });
    if (verifyDNSLength) {
      const total = labels.join(".").length;
      if (total > 253 || total === 0) {
        result.error = true;
      }
      for (let i = 0; i < labels.length; ++i) {
        if (labels[i].length > 63 || labels[i].length === 0) {
          result.error = true;
          break;
        }
      }
    }
    if (result.error) {
      return null;
    }
    return labels.join(".");
  }
  function toUnicode(domainName, {
    checkHyphens = false,
    checkBidi = false,
    checkJoiners = false,
    useSTD3ASCIIRules = false
  } = {}) {
    const result = processing(domainName, {
      processingOption: "nontransitional",
      checkHyphens,
      checkBidi,
      checkJoiners,
      useSTD3ASCIIRules
    });
    return {
      domain: result.string,
      error: result.error
    };
  }
  module2.exports = {
    toASCII,
    toUnicode
  };
});

// node_modules/whatwg-url/lib/infra.js
var require_infra = __commonJS((exports2, module2) => {
  "use strict";
  function isASCIIDigit(c) {
    return c >= 48 && c <= 57;
  }
  function isASCIIAlpha(c) {
    return c >= 65 && c <= 90 || c >= 97 && c <= 122;
  }
  function isASCIIAlphanumeric(c) {
    return isASCIIAlpha(c) || isASCIIDigit(c);
  }
  function isASCIIHex(c) {
    return isASCIIDigit(c) || c >= 65 && c <= 70 || c >= 97 && c <= 102;
  }
  module2.exports = {
    isASCIIDigit,
    isASCIIAlpha,
    isASCIIAlphanumeric,
    isASCIIHex
  };
});

// node_modules/whatwg-url/lib/urlencoded.js
var require_urlencoded = __commonJS((exports2, module2) => {
  "use strict";
  var {isASCIIHex} = require_infra();
  function strictlySplitByteSequence(buf, cp) {
    const list = [];
    let last = 0;
    let i = buf.indexOf(cp);
    while (i >= 0) {
      list.push(buf.slice(last, i));
      last = i + 1;
      i = buf.indexOf(cp, last);
    }
    if (last !== buf.length) {
      list.push(buf.slice(last));
    }
    return list;
  }
  function replaceByteInByteSequence(buf, from, to) {
    let i = buf.indexOf(from);
    while (i >= 0) {
      buf[i] = to;
      i = buf.indexOf(from, i + 1);
    }
    return buf;
  }
  function percentEncode(c) {
    let hex = c.toString(16).toUpperCase();
    if (hex.length === 1) {
      hex = "0" + hex;
    }
    return "%" + hex;
  }
  function percentDecode(input) {
    const output = Buffer2.alloc(input.byteLength);
    let ptr = 0;
    for (let i = 0; i < input.length; ++i) {
      if (input[i] !== 37 || !isASCIIHex(input[i + 1]) || !isASCIIHex(input[i + 2])) {
        output[ptr++] = input[i];
      } else {
        output[ptr++] = parseInt(input.slice(i + 1, i + 3).toString(), 16);
        i += 2;
      }
    }
    return output.slice(0, ptr);
  }
  function parseUrlencoded(input) {
    const sequences = strictlySplitByteSequence(input, 38);
    const output = [];
    for (const bytes of sequences) {
      if (bytes.length === 0) {
        continue;
      }
      let name;
      let value;
      const indexOfEqual = bytes.indexOf(61);
      if (indexOfEqual >= 0) {
        name = bytes.slice(0, indexOfEqual);
        value = bytes.slice(indexOfEqual + 1);
      } else {
        name = bytes;
        value = Buffer2.alloc(0);
      }
      name = replaceByteInByteSequence(Buffer2.from(name), 43, 32);
      value = replaceByteInByteSequence(Buffer2.from(value), 43, 32);
      output.push([percentDecode(name).toString(), percentDecode(value).toString()]);
    }
    return output;
  }
  function serializeUrlencodedByte(input) {
    let output = "";
    for (const byte of input) {
      if (byte === 32) {
        output += "+";
      } else if (byte === 42 || byte === 45 || byte === 46 || byte >= 48 && byte <= 57 || byte >= 65 && byte <= 90 || byte === 95 || byte >= 97 && byte <= 122) {
        output += String.fromCodePoint(byte);
      } else {
        output += percentEncode(byte);
      }
    }
    return output;
  }
  function serializeUrlencoded(tuples, encodingOverride = void 0) {
    let encoding = "utf-8";
    if (encodingOverride !== void 0) {
      encoding = encodingOverride;
    }
    let output = "";
    for (const [i, tuple] of tuples.entries()) {
      const name = serializeUrlencodedByte(Buffer2.from(tuple[0]));
      let value = tuple[1];
      if (tuple.length > 2 && tuple[2] !== void 0) {
        if (tuple[2] === "hidden" && name === "_charset_") {
          value = encoding;
        } else if (tuple[2] === "file") {
          value = value.name;
        }
      }
      value = serializeUrlencodedByte(Buffer2.from(value));
      if (i !== 0) {
        output += "&";
      }
      output += `${name}=${value}`;
    }
    return output;
  }
  module2.exports = {
    percentEncode,
    percentDecode,
    parseUrlencoded(input) {
      return parseUrlencoded(Buffer2.from(input));
    },
    serializeUrlencoded
  };
});

// node_modules/whatwg-url/lib/url-state-machine.js
var require_url_state_machine = __commonJS((exports2, module2) => {
  "use strict";
  var punycode = require_punycode();
  var tr46 = require_tr46();
  var infra = require_infra();
  var {percentEncode, percentDecode} = require_urlencoded();
  var specialSchemes = {
    ftp: 21,
    file: null,
    http: 80,
    https: 443,
    ws: 80,
    wss: 443
  };
  var failure = Symbol("failure");
  function countSymbols(str) {
    return punycode.ucs2.decode(str).length;
  }
  function at(input, idx) {
    const c = input[idx];
    return isNaN(c) ? void 0 : String.fromCodePoint(c);
  }
  function isSingleDot(buffer2) {
    return buffer2 === "." || buffer2.toLowerCase() === "%2e";
  }
  function isDoubleDot(buffer2) {
    buffer2 = buffer2.toLowerCase();
    return buffer2 === ".." || buffer2 === "%2e." || buffer2 === ".%2e" || buffer2 === "%2e%2e";
  }
  function isWindowsDriveLetterCodePoints(cp1, cp2) {
    return infra.isASCIIAlpha(cp1) && (cp2 === 58 || cp2 === 124);
  }
  function isWindowsDriveLetterString(string) {
    return string.length === 2 && infra.isASCIIAlpha(string.codePointAt(0)) && (string[1] === ":" || string[1] === "|");
  }
  function isNormalizedWindowsDriveLetterString(string) {
    return string.length === 2 && infra.isASCIIAlpha(string.codePointAt(0)) && string[1] === ":";
  }
  function containsForbiddenHostCodePoint(string) {
    return string.search(/\u0000|\u0009|\u000A|\u000D|\u0020|#|%|\/|:|\?|@|\[|\\|\]/) !== -1;
  }
  function containsForbiddenHostCodePointExcludingPercent(string) {
    return string.search(/\u0000|\u0009|\u000A|\u000D|\u0020|#|\/|:|\?|@|\[|\\|\]/) !== -1;
  }
  function isSpecialScheme(scheme) {
    return specialSchemes[scheme] !== void 0;
  }
  function isSpecial(url) {
    return isSpecialScheme(url.scheme);
  }
  function isNotSpecial(url) {
    return !isSpecialScheme(url.scheme);
  }
  function defaultPort(scheme) {
    return specialSchemes[scheme];
  }
  function utf8PercentEncode(c) {
    const buf = Buffer2.from(c);
    let str = "";
    for (let i = 0; i < buf.length; ++i) {
      str += percentEncode(buf[i]);
    }
    return str;
  }
  function isC0ControlPercentEncode(c) {
    return c <= 31 || c > 126;
  }
  var extraUserinfoPercentEncodeSet = new Set([47, 58, 59, 61, 64, 91, 92, 93, 94, 124]);
  function isUserinfoPercentEncode(c) {
    return isPathPercentEncode(c) || extraUserinfoPercentEncodeSet.has(c);
  }
  var extraFragmentPercentEncodeSet = new Set([32, 34, 60, 62, 96]);
  function isFragmentPercentEncode(c) {
    return isC0ControlPercentEncode(c) || extraFragmentPercentEncodeSet.has(c);
  }
  var extraPathPercentEncodeSet = new Set([35, 63, 123, 125]);
  function isPathPercentEncode(c) {
    return isFragmentPercentEncode(c) || extraPathPercentEncodeSet.has(c);
  }
  function percentEncodeChar(c, encodeSetPredicate) {
    const cStr = String.fromCodePoint(c);
    if (encodeSetPredicate(c)) {
      return utf8PercentEncode(cStr);
    }
    return cStr;
  }
  function parseIPv4Number(input) {
    let R = 10;
    if (input.length >= 2 && input.charAt(0) === "0" && input.charAt(1).toLowerCase() === "x") {
      input = input.substring(2);
      R = 16;
    } else if (input.length >= 2 && input.charAt(0) === "0") {
      input = input.substring(1);
      R = 8;
    }
    if (input === "") {
      return 0;
    }
    let regex = /[^0-7]/;
    if (R === 10) {
      regex = /[^0-9]/;
    }
    if (R === 16) {
      regex = /[^0-9A-Fa-f]/;
    }
    if (regex.test(input)) {
      return failure;
    }
    return parseInt(input, R);
  }
  function parseIPv4(input) {
    const parts = input.split(".");
    if (parts[parts.length - 1] === "") {
      if (parts.length > 1) {
        parts.pop();
      }
    }
    if (parts.length > 4) {
      return input;
    }
    const numbers = [];
    for (const part of parts) {
      if (part === "") {
        return input;
      }
      const n = parseIPv4Number(part);
      if (n === failure) {
        return input;
      }
      numbers.push(n);
    }
    for (let i = 0; i < numbers.length - 1; ++i) {
      if (numbers[i] > 255) {
        return failure;
      }
    }
    if (numbers[numbers.length - 1] >= Math.pow(256, 5 - numbers.length)) {
      return failure;
    }
    let ipv4 = numbers.pop();
    let counter = 0;
    for (const n of numbers) {
      ipv4 += n * Math.pow(256, 3 - counter);
      ++counter;
    }
    return ipv4;
  }
  function serializeIPv4(address) {
    let output = "";
    let n = address;
    for (let i = 1; i <= 4; ++i) {
      output = String(n % 256) + output;
      if (i !== 4) {
        output = "." + output;
      }
      n = Math.floor(n / 256);
    }
    return output;
  }
  function parseIPv6(input) {
    const address = [0, 0, 0, 0, 0, 0, 0, 0];
    let pieceIndex = 0;
    let compress = null;
    let pointer = 0;
    input = punycode.ucs2.decode(input);
    if (input[pointer] === 58) {
      if (input[pointer + 1] !== 58) {
        return failure;
      }
      pointer += 2;
      ++pieceIndex;
      compress = pieceIndex;
    }
    while (pointer < input.length) {
      if (pieceIndex === 8) {
        return failure;
      }
      if (input[pointer] === 58) {
        if (compress !== null) {
          return failure;
        }
        ++pointer;
        ++pieceIndex;
        compress = pieceIndex;
        continue;
      }
      let value = 0;
      let length = 0;
      while (length < 4 && infra.isASCIIHex(input[pointer])) {
        value = value * 16 + parseInt(at(input, pointer), 16);
        ++pointer;
        ++length;
      }
      if (input[pointer] === 46) {
        if (length === 0) {
          return failure;
        }
        pointer -= length;
        if (pieceIndex > 6) {
          return failure;
        }
        let numbersSeen = 0;
        while (input[pointer] !== void 0) {
          let ipv4Piece = null;
          if (numbersSeen > 0) {
            if (input[pointer] === 46 && numbersSeen < 4) {
              ++pointer;
            } else {
              return failure;
            }
          }
          if (!infra.isASCIIDigit(input[pointer])) {
            return failure;
          }
          while (infra.isASCIIDigit(input[pointer])) {
            const number = parseInt(at(input, pointer));
            if (ipv4Piece === null) {
              ipv4Piece = number;
            } else if (ipv4Piece === 0) {
              return failure;
            } else {
              ipv4Piece = ipv4Piece * 10 + number;
            }
            if (ipv4Piece > 255) {
              return failure;
            }
            ++pointer;
          }
          address[pieceIndex] = address[pieceIndex] * 256 + ipv4Piece;
          ++numbersSeen;
          if (numbersSeen === 2 || numbersSeen === 4) {
            ++pieceIndex;
          }
        }
        if (numbersSeen !== 4) {
          return failure;
        }
        break;
      } else if (input[pointer] === 58) {
        ++pointer;
        if (input[pointer] === void 0) {
          return failure;
        }
      } else if (input[pointer] !== void 0) {
        return failure;
      }
      address[pieceIndex] = value;
      ++pieceIndex;
    }
    if (compress !== null) {
      let swaps = pieceIndex - compress;
      pieceIndex = 7;
      while (pieceIndex !== 0 && swaps > 0) {
        const temp = address[compress + swaps - 1];
        address[compress + swaps - 1] = address[pieceIndex];
        address[pieceIndex] = temp;
        --pieceIndex;
        --swaps;
      }
    } else if (compress === null && pieceIndex !== 8) {
      return failure;
    }
    return address;
  }
  function serializeIPv6(address) {
    let output = "";
    const seqResult = findLongestZeroSequence(address);
    const compress = seqResult.idx;
    let ignore0 = false;
    for (let pieceIndex = 0; pieceIndex <= 7; ++pieceIndex) {
      if (ignore0 && address[pieceIndex] === 0) {
        continue;
      } else if (ignore0) {
        ignore0 = false;
      }
      if (compress === pieceIndex) {
        const separator = pieceIndex === 0 ? "::" : ":";
        output += separator;
        ignore0 = true;
        continue;
      }
      output += address[pieceIndex].toString(16);
      if (pieceIndex !== 7) {
        output += ":";
      }
    }
    return output;
  }
  function parseHost(input, isNotSpecialArg = false) {
    if (input[0] === "[") {
      if (input[input.length - 1] !== "]") {
        return failure;
      }
      return parseIPv6(input.substring(1, input.length - 1));
    }
    if (isNotSpecialArg) {
      return parseOpaqueHost(input);
    }
    const domain = percentDecode(Buffer2.from(input)).toString();
    const asciiDomain = domainToASCII(domain);
    if (asciiDomain === failure) {
      return failure;
    }
    if (containsForbiddenHostCodePoint(asciiDomain)) {
      return failure;
    }
    const ipv4Host = parseIPv4(asciiDomain);
    if (typeof ipv4Host === "number" || ipv4Host === failure) {
      return ipv4Host;
    }
    return asciiDomain;
  }
  function parseOpaqueHost(input) {
    if (containsForbiddenHostCodePointExcludingPercent(input)) {
      return failure;
    }
    let output = "";
    const decoded = punycode.ucs2.decode(input);
    for (let i = 0; i < decoded.length; ++i) {
      output += percentEncodeChar(decoded[i], isC0ControlPercentEncode);
    }
    return output;
  }
  function findLongestZeroSequence(arr) {
    let maxIdx = null;
    let maxLen = 1;
    let currStart = null;
    let currLen = 0;
    for (let i = 0; i < arr.length; ++i) {
      if (arr[i] !== 0) {
        if (currLen > maxLen) {
          maxIdx = currStart;
          maxLen = currLen;
        }
        currStart = null;
        currLen = 0;
      } else {
        if (currStart === null) {
          currStart = i;
        }
        ++currLen;
      }
    }
    if (currLen > maxLen) {
      maxIdx = currStart;
      maxLen = currLen;
    }
    return {
      idx: maxIdx,
      len: maxLen
    };
  }
  function serializeHost(host) {
    if (typeof host === "number") {
      return serializeIPv4(host);
    }
    if (host instanceof Array) {
      return "[" + serializeIPv6(host) + "]";
    }
    return host;
  }
  function domainToASCII(domain, beStrict = false) {
    const result = tr46.toASCII(domain, {
      checkBidi: true,
      checkHyphens: false,
      checkJoiners: true,
      useSTD3ASCIIRules: beStrict,
      verifyDNSLength: beStrict
    });
    if (result === null) {
      return failure;
    }
    return result;
  }
  function trimControlChars(url) {
    return url.replace(/^[\u0000-\u001F\u0020]+|[\u0000-\u001F\u0020]+$/g, "");
  }
  function trimTabAndNewline(url) {
    return url.replace(/\u0009|\u000A|\u000D/g, "");
  }
  function shortenPath(url) {
    const {path} = url;
    if (path.length === 0) {
      return;
    }
    if (url.scheme === "file" && path.length === 1 && isNormalizedWindowsDriveLetter(path[0])) {
      return;
    }
    path.pop();
  }
  function includesCredentials(url) {
    return url.username !== "" || url.password !== "";
  }
  function cannotHaveAUsernamePasswordPort(url) {
    return url.host === null || url.host === "" || url.cannotBeABaseURL || url.scheme === "file";
  }
  function isNormalizedWindowsDriveLetter(string) {
    return /^[A-Za-z]:$/.test(string);
  }
  function URLStateMachine(input, base, encodingOverride, url, stateOverride) {
    this.pointer = 0;
    this.input = input;
    this.base = base || null;
    this.encodingOverride = encodingOverride || "utf-8";
    this.stateOverride = stateOverride;
    this.url = url;
    this.failure = false;
    this.parseError = false;
    if (!this.url) {
      this.url = {
        scheme: "",
        username: "",
        password: "",
        host: null,
        port: null,
        path: [],
        query: null,
        fragment: null,
        cannotBeABaseURL: false
      };
      const res2 = trimControlChars(this.input);
      if (res2 !== this.input) {
        this.parseError = true;
      }
      this.input = res2;
    }
    const res = trimTabAndNewline(this.input);
    if (res !== this.input) {
      this.parseError = true;
    }
    this.input = res;
    this.state = stateOverride || "scheme start";
    this.buffer = "";
    this.atFlag = false;
    this.arrFlag = false;
    this.passwordTokenSeenFlag = false;
    this.input = punycode.ucs2.decode(this.input);
    for (; this.pointer <= this.input.length; ++this.pointer) {
      const c = this.input[this.pointer];
      const cStr = isNaN(c) ? void 0 : String.fromCodePoint(c);
      const ret = this["parse " + this.state](c, cStr);
      if (!ret) {
        break;
      } else if (ret === failure) {
        this.failure = true;
        break;
      }
    }
  }
  URLStateMachine.prototype["parse scheme start"] = function parseSchemeStart(c, cStr) {
    if (infra.isASCIIAlpha(c)) {
      this.buffer += cStr.toLowerCase();
      this.state = "scheme";
    } else if (!this.stateOverride) {
      this.state = "no scheme";
      --this.pointer;
    } else {
      this.parseError = true;
      return failure;
    }
    return true;
  };
  URLStateMachine.prototype["parse scheme"] = function parseScheme(c, cStr) {
    if (infra.isASCIIAlphanumeric(c) || c === 43 || c === 45 || c === 46) {
      this.buffer += cStr.toLowerCase();
    } else if (c === 58) {
      if (this.stateOverride) {
        if (isSpecial(this.url) && !isSpecialScheme(this.buffer)) {
          return false;
        }
        if (!isSpecial(this.url) && isSpecialScheme(this.buffer)) {
          return false;
        }
        if ((includesCredentials(this.url) || this.url.port !== null) && this.buffer === "file") {
          return false;
        }
        if (this.url.scheme === "file" && (this.url.host === "" || this.url.host === null)) {
          return false;
        }
      }
      this.url.scheme = this.buffer;
      if (this.stateOverride) {
        if (this.url.port === defaultPort(this.url.scheme)) {
          this.url.port = null;
        }
        return false;
      }
      this.buffer = "";
      if (this.url.scheme === "file") {
        if (this.input[this.pointer + 1] !== 47 || this.input[this.pointer + 2] !== 47) {
          this.parseError = true;
        }
        this.state = "file";
      } else if (isSpecial(this.url) && this.base !== null && this.base.scheme === this.url.scheme) {
        this.state = "special relative or authority";
      } else if (isSpecial(this.url)) {
        this.state = "special authority slashes";
      } else if (this.input[this.pointer + 1] === 47) {
        this.state = "path or authority";
        ++this.pointer;
      } else {
        this.url.cannotBeABaseURL = true;
        this.url.path.push("");
        this.state = "cannot-be-a-base-URL path";
      }
    } else if (!this.stateOverride) {
      this.buffer = "";
      this.state = "no scheme";
      this.pointer = -1;
    } else {
      this.parseError = true;
      return failure;
    }
    return true;
  };
  URLStateMachine.prototype["parse no scheme"] = function parseNoScheme(c) {
    if (this.base === null || this.base.cannotBeABaseURL && c !== 35) {
      return failure;
    } else if (this.base.cannotBeABaseURL && c === 35) {
      this.url.scheme = this.base.scheme;
      this.url.path = this.base.path.slice();
      this.url.query = this.base.query;
      this.url.fragment = "";
      this.url.cannotBeABaseURL = true;
      this.state = "fragment";
    } else if (this.base.scheme === "file") {
      this.state = "file";
      --this.pointer;
    } else {
      this.state = "relative";
      --this.pointer;
    }
    return true;
  };
  URLStateMachine.prototype["parse special relative or authority"] = function parseSpecialRelativeOrAuthority(c) {
    if (c === 47 && this.input[this.pointer + 1] === 47) {
      this.state = "special authority ignore slashes";
      ++this.pointer;
    } else {
      this.parseError = true;
      this.state = "relative";
      --this.pointer;
    }
    return true;
  };
  URLStateMachine.prototype["parse path or authority"] = function parsePathOrAuthority(c) {
    if (c === 47) {
      this.state = "authority";
    } else {
      this.state = "path";
      --this.pointer;
    }
    return true;
  };
  URLStateMachine.prototype["parse relative"] = function parseRelative(c) {
    this.url.scheme = this.base.scheme;
    if (isNaN(c)) {
      this.url.username = this.base.username;
      this.url.password = this.base.password;
      this.url.host = this.base.host;
      this.url.port = this.base.port;
      this.url.path = this.base.path.slice();
      this.url.query = this.base.query;
    } else if (c === 47) {
      this.state = "relative slash";
    } else if (c === 63) {
      this.url.username = this.base.username;
      this.url.password = this.base.password;
      this.url.host = this.base.host;
      this.url.port = this.base.port;
      this.url.path = this.base.path.slice();
      this.url.query = "";
      this.state = "query";
    } else if (c === 35) {
      this.url.username = this.base.username;
      this.url.password = this.base.password;
      this.url.host = this.base.host;
      this.url.port = this.base.port;
      this.url.path = this.base.path.slice();
      this.url.query = this.base.query;
      this.url.fragment = "";
      this.state = "fragment";
    } else if (isSpecial(this.url) && c === 92) {
      this.parseError = true;
      this.state = "relative slash";
    } else {
      this.url.username = this.base.username;
      this.url.password = this.base.password;
      this.url.host = this.base.host;
      this.url.port = this.base.port;
      this.url.path = this.base.path.slice(0, this.base.path.length - 1);
      this.state = "path";
      --this.pointer;
    }
    return true;
  };
  URLStateMachine.prototype["parse relative slash"] = function parseRelativeSlash(c) {
    if (isSpecial(this.url) && (c === 47 || c === 92)) {
      if (c === 92) {
        this.parseError = true;
      }
      this.state = "special authority ignore slashes";
    } else if (c === 47) {
      this.state = "authority";
    } else {
      this.url.username = this.base.username;
      this.url.password = this.base.password;
      this.url.host = this.base.host;
      this.url.port = this.base.port;
      this.state = "path";
      --this.pointer;
    }
    return true;
  };
  URLStateMachine.prototype["parse special authority slashes"] = function parseSpecialAuthoritySlashes(c) {
    if (c === 47 && this.input[this.pointer + 1] === 47) {
      this.state = "special authority ignore slashes";
      ++this.pointer;
    } else {
      this.parseError = true;
      this.state = "special authority ignore slashes";
      --this.pointer;
    }
    return true;
  };
  URLStateMachine.prototype["parse special authority ignore slashes"] = function parseSpecialAuthorityIgnoreSlashes(c) {
    if (c !== 47 && c !== 92) {
      this.state = "authority";
      --this.pointer;
    } else {
      this.parseError = true;
    }
    return true;
  };
  URLStateMachine.prototype["parse authority"] = function parseAuthority(c, cStr) {
    if (c === 64) {
      this.parseError = true;
      if (this.atFlag) {
        this.buffer = "%40" + this.buffer;
      }
      this.atFlag = true;
      const len = countSymbols(this.buffer);
      for (let pointer = 0; pointer < len; ++pointer) {
        const codePoint = this.buffer.codePointAt(pointer);
        if (codePoint === 58 && !this.passwordTokenSeenFlag) {
          this.passwordTokenSeenFlag = true;
          continue;
        }
        const encodedCodePoints = percentEncodeChar(codePoint, isUserinfoPercentEncode);
        if (this.passwordTokenSeenFlag) {
          this.url.password += encodedCodePoints;
        } else {
          this.url.username += encodedCodePoints;
        }
      }
      this.buffer = "";
    } else if (isNaN(c) || c === 47 || c === 63 || c === 35 || isSpecial(this.url) && c === 92) {
      if (this.atFlag && this.buffer === "") {
        this.parseError = true;
        return failure;
      }
      this.pointer -= countSymbols(this.buffer) + 1;
      this.buffer = "";
      this.state = "host";
    } else {
      this.buffer += cStr;
    }
    return true;
  };
  URLStateMachine.prototype["parse hostname"] = URLStateMachine.prototype["parse host"] = function parseHostName(c, cStr) {
    if (this.stateOverride && this.url.scheme === "file") {
      --this.pointer;
      this.state = "file host";
    } else if (c === 58 && !this.arrFlag) {
      if (this.buffer === "") {
        this.parseError = true;
        return failure;
      }
      const host = parseHost(this.buffer, isNotSpecial(this.url));
      if (host === failure) {
        return failure;
      }
      this.url.host = host;
      this.buffer = "";
      this.state = "port";
      if (this.stateOverride === "hostname") {
        return false;
      }
    } else if (isNaN(c) || c === 47 || c === 63 || c === 35 || isSpecial(this.url) && c === 92) {
      --this.pointer;
      if (isSpecial(this.url) && this.buffer === "") {
        this.parseError = true;
        return failure;
      } else if (this.stateOverride && this.buffer === "" && (includesCredentials(this.url) || this.url.port !== null)) {
        this.parseError = true;
        return false;
      }
      const host = parseHost(this.buffer, isNotSpecial(this.url));
      if (host === failure) {
        return failure;
      }
      this.url.host = host;
      this.buffer = "";
      this.state = "path start";
      if (this.stateOverride) {
        return false;
      }
    } else {
      if (c === 91) {
        this.arrFlag = true;
      } else if (c === 93) {
        this.arrFlag = false;
      }
      this.buffer += cStr;
    }
    return true;
  };
  URLStateMachine.prototype["parse port"] = function parsePort(c, cStr) {
    if (infra.isASCIIDigit(c)) {
      this.buffer += cStr;
    } else if (isNaN(c) || c === 47 || c === 63 || c === 35 || isSpecial(this.url) && c === 92 || this.stateOverride) {
      if (this.buffer !== "") {
        const port = parseInt(this.buffer);
        if (port > Math.pow(2, 16) - 1) {
          this.parseError = true;
          return failure;
        }
        this.url.port = port === defaultPort(this.url.scheme) ? null : port;
        this.buffer = "";
      }
      if (this.stateOverride) {
        return false;
      }
      this.state = "path start";
      --this.pointer;
    } else {
      this.parseError = true;
      return failure;
    }
    return true;
  };
  var fileOtherwiseCodePoints = new Set([47, 92, 63, 35]);
  function startsWithWindowsDriveLetter(input, pointer) {
    const length = input.length - pointer;
    return length >= 2 && isWindowsDriveLetterCodePoints(input[pointer], input[pointer + 1]) && (length === 2 || fileOtherwiseCodePoints.has(input[pointer + 2]));
  }
  URLStateMachine.prototype["parse file"] = function parseFile(c) {
    this.url.scheme = "file";
    if (c === 47 || c === 92) {
      if (c === 92) {
        this.parseError = true;
      }
      this.state = "file slash";
    } else if (this.base !== null && this.base.scheme === "file") {
      if (isNaN(c)) {
        this.url.host = this.base.host;
        this.url.path = this.base.path.slice();
        this.url.query = this.base.query;
      } else if (c === 63) {
        this.url.host = this.base.host;
        this.url.path = this.base.path.slice();
        this.url.query = "";
        this.state = "query";
      } else if (c === 35) {
        this.url.host = this.base.host;
        this.url.path = this.base.path.slice();
        this.url.query = this.base.query;
        this.url.fragment = "";
        this.state = "fragment";
      } else {
        if (!startsWithWindowsDriveLetter(this.input, this.pointer)) {
          this.url.host = this.base.host;
          this.url.path = this.base.path.slice();
          shortenPath(this.url);
        } else {
          this.parseError = true;
        }
        this.state = "path";
        --this.pointer;
      }
    } else {
      this.state = "path";
      --this.pointer;
    }
    return true;
  };
  URLStateMachine.prototype["parse file slash"] = function parseFileSlash(c) {
    if (c === 47 || c === 92) {
      if (c === 92) {
        this.parseError = true;
      }
      this.state = "file host";
    } else {
      if (this.base !== null && this.base.scheme === "file" && !startsWithWindowsDriveLetter(this.input, this.pointer)) {
        if (isNormalizedWindowsDriveLetterString(this.base.path[0])) {
          this.url.path.push(this.base.path[0]);
        } else {
          this.url.host = this.base.host;
        }
      }
      this.state = "path";
      --this.pointer;
    }
    return true;
  };
  URLStateMachine.prototype["parse file host"] = function parseFileHost(c, cStr) {
    if (isNaN(c) || c === 47 || c === 92 || c === 63 || c === 35) {
      --this.pointer;
      if (!this.stateOverride && isWindowsDriveLetterString(this.buffer)) {
        this.parseError = true;
        this.state = "path";
      } else if (this.buffer === "") {
        this.url.host = "";
        if (this.stateOverride) {
          return false;
        }
        this.state = "path start";
      } else {
        let host = parseHost(this.buffer, isNotSpecial(this.url));
        if (host === failure) {
          return failure;
        }
        if (host === "localhost") {
          host = "";
        }
        this.url.host = host;
        if (this.stateOverride) {
          return false;
        }
        this.buffer = "";
        this.state = "path start";
      }
    } else {
      this.buffer += cStr;
    }
    return true;
  };
  URLStateMachine.prototype["parse path start"] = function parsePathStart(c) {
    if (isSpecial(this.url)) {
      if (c === 92) {
        this.parseError = true;
      }
      this.state = "path";
      if (c !== 47 && c !== 92) {
        --this.pointer;
      }
    } else if (!this.stateOverride && c === 63) {
      this.url.query = "";
      this.state = "query";
    } else if (!this.stateOverride && c === 35) {
      this.url.fragment = "";
      this.state = "fragment";
    } else if (c !== void 0) {
      this.state = "path";
      if (c !== 47) {
        --this.pointer;
      }
    }
    return true;
  };
  URLStateMachine.prototype["parse path"] = function parsePath(c) {
    if (isNaN(c) || c === 47 || isSpecial(this.url) && c === 92 || !this.stateOverride && (c === 63 || c === 35)) {
      if (isSpecial(this.url) && c === 92) {
        this.parseError = true;
      }
      if (isDoubleDot(this.buffer)) {
        shortenPath(this.url);
        if (c !== 47 && !(isSpecial(this.url) && c === 92)) {
          this.url.path.push("");
        }
      } else if (isSingleDot(this.buffer) && c !== 47 && !(isSpecial(this.url) && c === 92)) {
        this.url.path.push("");
      } else if (!isSingleDot(this.buffer)) {
        if (this.url.scheme === "file" && this.url.path.length === 0 && isWindowsDriveLetterString(this.buffer)) {
          if (this.url.host !== "" && this.url.host !== null) {
            this.parseError = true;
            this.url.host = "";
          }
          this.buffer = this.buffer[0] + ":";
        }
        this.url.path.push(this.buffer);
      }
      this.buffer = "";
      if (this.url.scheme === "file" && (c === void 0 || c === 63 || c === 35)) {
        while (this.url.path.length > 1 && this.url.path[0] === "") {
          this.parseError = true;
          this.url.path.shift();
        }
      }
      if (c === 63) {
        this.url.query = "";
        this.state = "query";
      }
      if (c === 35) {
        this.url.fragment = "";
        this.state = "fragment";
      }
    } else {
      if (c === 37 && (!infra.isASCIIHex(this.input[this.pointer + 1]) || !infra.isASCIIHex(this.input[this.pointer + 2]))) {
        this.parseError = true;
      }
      this.buffer += percentEncodeChar(c, isPathPercentEncode);
    }
    return true;
  };
  URLStateMachine.prototype["parse cannot-be-a-base-URL path"] = function parseCannotBeABaseURLPath(c) {
    if (c === 63) {
      this.url.query = "";
      this.state = "query";
    } else if (c === 35) {
      this.url.fragment = "";
      this.state = "fragment";
    } else {
      if (!isNaN(c) && c !== 37) {
        this.parseError = true;
      }
      if (c === 37 && (!infra.isASCIIHex(this.input[this.pointer + 1]) || !infra.isASCIIHex(this.input[this.pointer + 2]))) {
        this.parseError = true;
      }
      if (!isNaN(c)) {
        this.url.path[0] = this.url.path[0] + percentEncodeChar(c, isC0ControlPercentEncode);
      }
    }
    return true;
  };
  URLStateMachine.prototype["parse query"] = function parseQuery(c, cStr) {
    if (isNaN(c) || !this.stateOverride && c === 35) {
      if (!isSpecial(this.url) || this.url.scheme === "ws" || this.url.scheme === "wss") {
        this.encodingOverride = "utf-8";
      }
      const buffer2 = Buffer2.from(this.buffer);
      for (let i = 0; i < buffer2.length; ++i) {
        if (buffer2[i] < 33 || buffer2[i] > 126 || buffer2[i] === 34 || buffer2[i] === 35 || buffer2[i] === 60 || buffer2[i] === 62 || buffer2[i] === 39 && isSpecial(this.url)) {
          this.url.query += percentEncode(buffer2[i]);
        } else {
          this.url.query += String.fromCodePoint(buffer2[i]);
        }
      }
      this.buffer = "";
      if (c === 35) {
        this.url.fragment = "";
        this.state = "fragment";
      }
    } else {
      if (c === 37 && (!infra.isASCIIHex(this.input[this.pointer + 1]) || !infra.isASCIIHex(this.input[this.pointer + 2]))) {
        this.parseError = true;
      }
      this.buffer += cStr;
    }
    return true;
  };
  URLStateMachine.prototype["parse fragment"] = function parseFragment(c) {
    if (isNaN(c)) {
    } else if (c === 0) {
      this.parseError = true;
    } else {
      if (c === 37 && (!infra.isASCIIHex(this.input[this.pointer + 1]) || !infra.isASCIIHex(this.input[this.pointer + 2]))) {
        this.parseError = true;
      }
      this.url.fragment += percentEncodeChar(c, isFragmentPercentEncode);
    }
    return true;
  };
  function serializeURL(url, excludeFragment) {
    let output = url.scheme + ":";
    if (url.host !== null) {
      output += "//";
      if (url.username !== "" || url.password !== "") {
        output += url.username;
        if (url.password !== "") {
          output += ":" + url.password;
        }
        output += "@";
      }
      output += serializeHost(url.host);
      if (url.port !== null) {
        output += ":" + url.port;
      }
    } else if (url.host === null && url.scheme === "file") {
      output += "//";
    }
    if (url.cannotBeABaseURL) {
      output += url.path[0];
    } else {
      for (const string of url.path) {
        output += "/" + string;
      }
    }
    if (url.query !== null) {
      output += "?" + url.query;
    }
    if (!excludeFragment && url.fragment !== null) {
      output += "#" + url.fragment;
    }
    return output;
  }
  function serializeOrigin(tuple) {
    let result = tuple.scheme + "://";
    result += serializeHost(tuple.host);
    if (tuple.port !== null) {
      result += ":" + tuple.port;
    }
    return result;
  }
  module2.exports.serializeURL = serializeURL;
  module2.exports.serializeURLOrigin = function(url) {
    switch (url.scheme) {
      case "blob":
        try {
          return module2.exports.serializeURLOrigin(module2.exports.parseURL(url.path[0]));
        } catch (e) {
          return "null";
        }
      case "ftp":
      case "http":
      case "https":
      case "ws":
      case "wss":
        return serializeOrigin({
          scheme: url.scheme,
          host: url.host,
          port: url.port
        });
      case "file":
        return "null";
      default:
        return "null";
    }
  };
  module2.exports.basicURLParse = function(input, options) {
    if (options === void 0) {
      options = {};
    }
    const usm = new URLStateMachine(input, options.baseURL, options.encodingOverride, options.url, options.stateOverride);
    if (usm.failure) {
      return null;
    }
    return usm.url;
  };
  module2.exports.setTheUsername = function(url, username) {
    url.username = "";
    const decoded = punycode.ucs2.decode(username);
    for (let i = 0; i < decoded.length; ++i) {
      url.username += percentEncodeChar(decoded[i], isUserinfoPercentEncode);
    }
  };
  module2.exports.setThePassword = function(url, password) {
    url.password = "";
    const decoded = punycode.ucs2.decode(password);
    for (let i = 0; i < decoded.length; ++i) {
      url.password += percentEncodeChar(decoded[i], isUserinfoPercentEncode);
    }
  };
  module2.exports.serializeHost = serializeHost;
  module2.exports.cannotHaveAUsernamePasswordPort = cannotHaveAUsernamePasswordPort;
  module2.exports.serializeInteger = function(integer) {
    return String(integer);
  };
  module2.exports.parseURL = function(input, options) {
    if (options === void 0) {
      options = {};
    }
    return module2.exports.basicURLParse(input, {baseURL: options.baseURL, encodingOverride: options.encodingOverride});
  };
});

// node_modules/lodash.sortby/index.js
var require_lodash = __commonJS((exports2, module2) => {
  var LARGE_ARRAY_SIZE = 200;
  var FUNC_ERROR_TEXT = "Expected a function";
  var HASH_UNDEFINED = "__lodash_hash_undefined__";
  var UNORDERED_COMPARE_FLAG = 1;
  var PARTIAL_COMPARE_FLAG = 2;
  var INFINITY = 1 / 0;
  var MAX_SAFE_INTEGER = 9007199254740991;
  var argsTag = "[object Arguments]";
  var arrayTag = "[object Array]";
  var boolTag = "[object Boolean]";
  var dateTag = "[object Date]";
  var errorTag = "[object Error]";
  var funcTag = "[object Function]";
  var genTag = "[object GeneratorFunction]";
  var mapTag = "[object Map]";
  var numberTag = "[object Number]";
  var objectTag = "[object Object]";
  var promiseTag = "[object Promise]";
  var regexpTag = "[object RegExp]";
  var setTag = "[object Set]";
  var stringTag = "[object String]";
  var symbolTag = "[object Symbol]";
  var weakMapTag = "[object WeakMap]";
  var arrayBufferTag = "[object ArrayBuffer]";
  var dataViewTag = "[object DataView]";
  var float32Tag = "[object Float32Array]";
  var float64Tag = "[object Float64Array]";
  var int8Tag = "[object Int8Array]";
  var int16Tag = "[object Int16Array]";
  var int32Tag = "[object Int32Array]";
  var uint8Tag = "[object Uint8Array]";
  var uint8ClampedTag = "[object Uint8ClampedArray]";
  var uint16Tag = "[object Uint16Array]";
  var uint32Tag = "[object Uint32Array]";
  var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/;
  var reIsPlainProp = /^\w*$/;
  var reLeadingDot = /^\./;
  var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
  var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
  var reEscapeChar = /\\(\\)?/g;
  var reIsHostCtor = /^\[object .+?Constructor\]$/;
  var reIsUint = /^(?:0|[1-9]\d*)$/;
  var typedArrayTags = {};
  typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
  typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
  var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
  var freeSelf = typeof self == "object" && self && self.Object === Object && self;
  var root = freeGlobal || freeSelf || Function("return this")();
  var freeExports = typeof exports2 == "object" && exports2 && !exports2.nodeType && exports2;
  var freeModule = freeExports && typeof module2 == "object" && module2 && !module2.nodeType && module2;
  var moduleExports = freeModule && freeModule.exports === freeExports;
  var freeProcess = moduleExports && freeGlobal.process;
  var nodeUtil = function() {
    try {
      return freeProcess && freeProcess.binding("util");
    } catch (e) {
    }
  }();
  var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;
  function apply(func, thisArg, args) {
    switch (args.length) {
      case 0:
        return func.call(thisArg);
      case 1:
        return func.call(thisArg, args[0]);
      case 2:
        return func.call(thisArg, args[0], args[1]);
      case 3:
        return func.call(thisArg, args[0], args[1], args[2]);
    }
    return func.apply(thisArg, args);
  }
  function arrayMap(array, iteratee) {
    var index = -1, length = array ? array.length : 0, result = Array(length);
    while (++index < length) {
      result[index] = iteratee(array[index], index, array);
    }
    return result;
  }
  function arrayPush(array, values) {
    var index = -1, length = values.length, offset = array.length;
    while (++index < length) {
      array[offset + index] = values[index];
    }
    return array;
  }
  function arraySome(array, predicate) {
    var index = -1, length = array ? array.length : 0;
    while (++index < length) {
      if (predicate(array[index], index, array)) {
        return true;
      }
    }
    return false;
  }
  function baseProperty(key) {
    return function(object) {
      return object == null ? void 0 : object[key];
    };
  }
  function baseSortBy(array, comparer) {
    var length = array.length;
    array.sort(comparer);
    while (length--) {
      array[length] = array[length].value;
    }
    return array;
  }
  function baseTimes(n, iteratee) {
    var index = -1, result = Array(n);
    while (++index < n) {
      result[index] = iteratee(index);
    }
    return result;
  }
  function baseUnary(func) {
    return function(value) {
      return func(value);
    };
  }
  function getValue(object, key) {
    return object == null ? void 0 : object[key];
  }
  function isHostObject(value) {
    var result = false;
    if (value != null && typeof value.toString != "function") {
      try {
        result = !!(value + "");
      } catch (e) {
      }
    }
    return result;
  }
  function mapToArray(map) {
    var index = -1, result = Array(map.size);
    map.forEach(function(value, key) {
      result[++index] = [key, value];
    });
    return result;
  }
  function overArg(func, transform) {
    return function(arg) {
      return func(transform(arg));
    };
  }
  function setToArray(set) {
    var index = -1, result = Array(set.size);
    set.forEach(function(value) {
      result[++index] = value;
    });
    return result;
  }
  var arrayProto = Array.prototype;
  var funcProto = Function.prototype;
  var objectProto = Object.prototype;
  var coreJsData = root["__core-js_shared__"];
  var maskSrcKey = function() {
    var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
    return uid ? "Symbol(src)_1." + uid : "";
  }();
  var funcToString = funcProto.toString;
  var hasOwnProperty = objectProto.hasOwnProperty;
  var objectToString = objectProto.toString;
  var reIsNative = RegExp("^" + funcToString.call(hasOwnProperty).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
  var Symbol2 = root.Symbol;
  var Uint8Array2 = root.Uint8Array;
  var propertyIsEnumerable = objectProto.propertyIsEnumerable;
  var splice = arrayProto.splice;
  var spreadableSymbol = Symbol2 ? Symbol2.isConcatSpreadable : void 0;
  var nativeKeys = overArg(Object.keys, Object);
  var nativeMax = Math.max;
  var DataView2 = getNative(root, "DataView");
  var Map2 = getNative(root, "Map");
  var Promise2 = getNative(root, "Promise");
  var Set2 = getNative(root, "Set");
  var WeakMap = getNative(root, "WeakMap");
  var nativeCreate = getNative(Object, "create");
  var dataViewCtorString = toSource(DataView2);
  var mapCtorString = toSource(Map2);
  var promiseCtorString = toSource(Promise2);
  var setCtorString = toSource(Set2);
  var weakMapCtorString = toSource(WeakMap);
  var symbolProto = Symbol2 ? Symbol2.prototype : void 0;
  var symbolValueOf = symbolProto ? symbolProto.valueOf : void 0;
  var symbolToString = symbolProto ? symbolProto.toString : void 0;
  function Hash(entries) {
    var index = -1, length = entries ? entries.length : 0;
    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }
  function hashClear() {
    this.__data__ = nativeCreate ? nativeCreate(null) : {};
  }
  function hashDelete(key) {
    return this.has(key) && delete this.__data__[key];
  }
  function hashGet(key) {
    var data = this.__data__;
    if (nativeCreate) {
      var result = data[key];
      return result === HASH_UNDEFINED ? void 0 : result;
    }
    return hasOwnProperty.call(data, key) ? data[key] : void 0;
  }
  function hashHas(key) {
    var data = this.__data__;
    return nativeCreate ? data[key] !== void 0 : hasOwnProperty.call(data, key);
  }
  function hashSet(key, value) {
    var data = this.__data__;
    data[key] = nativeCreate && value === void 0 ? HASH_UNDEFINED : value;
    return this;
  }
  Hash.prototype.clear = hashClear;
  Hash.prototype["delete"] = hashDelete;
  Hash.prototype.get = hashGet;
  Hash.prototype.has = hashHas;
  Hash.prototype.set = hashSet;
  function ListCache(entries) {
    var index = -1, length = entries ? entries.length : 0;
    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }
  function listCacheClear() {
    this.__data__ = [];
  }
  function listCacheDelete(key) {
    var data = this.__data__, index = assocIndexOf(data, key);
    if (index < 0) {
      return false;
    }
    var lastIndex = data.length - 1;
    if (index == lastIndex) {
      data.pop();
    } else {
      splice.call(data, index, 1);
    }
    return true;
  }
  function listCacheGet(key) {
    var data = this.__data__, index = assocIndexOf(data, key);
    return index < 0 ? void 0 : data[index][1];
  }
  function listCacheHas(key) {
    return assocIndexOf(this.__data__, key) > -1;
  }
  function listCacheSet(key, value) {
    var data = this.__data__, index = assocIndexOf(data, key);
    if (index < 0) {
      data.push([key, value]);
    } else {
      data[index][1] = value;
    }
    return this;
  }
  ListCache.prototype.clear = listCacheClear;
  ListCache.prototype["delete"] = listCacheDelete;
  ListCache.prototype.get = listCacheGet;
  ListCache.prototype.has = listCacheHas;
  ListCache.prototype.set = listCacheSet;
  function MapCache(entries) {
    var index = -1, length = entries ? entries.length : 0;
    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }
  function mapCacheClear() {
    this.__data__ = {
      hash: new Hash(),
      map: new (Map2 || ListCache)(),
      string: new Hash()
    };
  }
  function mapCacheDelete(key) {
    return getMapData(this, key)["delete"](key);
  }
  function mapCacheGet(key) {
    return getMapData(this, key).get(key);
  }
  function mapCacheHas(key) {
    return getMapData(this, key).has(key);
  }
  function mapCacheSet(key, value) {
    getMapData(this, key).set(key, value);
    return this;
  }
  MapCache.prototype.clear = mapCacheClear;
  MapCache.prototype["delete"] = mapCacheDelete;
  MapCache.prototype.get = mapCacheGet;
  MapCache.prototype.has = mapCacheHas;
  MapCache.prototype.set = mapCacheSet;
  function SetCache(values) {
    var index = -1, length = values ? values.length : 0;
    this.__data__ = new MapCache();
    while (++index < length) {
      this.add(values[index]);
    }
  }
  function setCacheAdd(value) {
    this.__data__.set(value, HASH_UNDEFINED);
    return this;
  }
  function setCacheHas(value) {
    return this.__data__.has(value);
  }
  SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
  SetCache.prototype.has = setCacheHas;
  function Stack(entries) {
    this.__data__ = new ListCache(entries);
  }
  function stackClear() {
    this.__data__ = new ListCache();
  }
  function stackDelete(key) {
    return this.__data__["delete"](key);
  }
  function stackGet(key) {
    return this.__data__.get(key);
  }
  function stackHas(key) {
    return this.__data__.has(key);
  }
  function stackSet(key, value) {
    var cache = this.__data__;
    if (cache instanceof ListCache) {
      var pairs = cache.__data__;
      if (!Map2 || pairs.length < LARGE_ARRAY_SIZE - 1) {
        pairs.push([key, value]);
        return this;
      }
      cache = this.__data__ = new MapCache(pairs);
    }
    cache.set(key, value);
    return this;
  }
  Stack.prototype.clear = stackClear;
  Stack.prototype["delete"] = stackDelete;
  Stack.prototype.get = stackGet;
  Stack.prototype.has = stackHas;
  Stack.prototype.set = stackSet;
  function arrayLikeKeys(value, inherited) {
    var result = isArray2(value) || isArguments(value) ? baseTimes(value.length, String) : [];
    var length = result.length, skipIndexes = !!length;
    for (var key in value) {
      if ((inherited || hasOwnProperty.call(value, key)) && !(skipIndexes && (key == "length" || isIndex(key, length)))) {
        result.push(key);
      }
    }
    return result;
  }
  function assocIndexOf(array, key) {
    var length = array.length;
    while (length--) {
      if (eq(array[length][0], key)) {
        return length;
      }
    }
    return -1;
  }
  var baseEach = createBaseEach(baseForOwn);
  function baseFlatten(array, depth, predicate, isStrict, result) {
    var index = -1, length = array.length;
    predicate || (predicate = isFlattenable);
    result || (result = []);
    while (++index < length) {
      var value = array[index];
      if (depth > 0 && predicate(value)) {
        if (depth > 1) {
          baseFlatten(value, depth - 1, predicate, isStrict, result);
        } else {
          arrayPush(result, value);
        }
      } else if (!isStrict) {
        result[result.length] = value;
      }
    }
    return result;
  }
  var baseFor = createBaseFor();
  function baseForOwn(object, iteratee) {
    return object && baseFor(object, iteratee, keys);
  }
  function baseGet(object, path) {
    path = isKey(path, object) ? [path] : castPath(path);
    var index = 0, length = path.length;
    while (object != null && index < length) {
      object = object[toKey(path[index++])];
    }
    return index && index == length ? object : void 0;
  }
  function baseGetTag(value) {
    return objectToString.call(value);
  }
  function baseHasIn(object, key) {
    return object != null && key in Object(object);
  }
  function baseIsEqual(value, other, customizer, bitmask, stack) {
    if (value === other) {
      return true;
    }
    if (value == null || other == null || !isObject2(value) && !isObjectLike(other)) {
      return value !== value && other !== other;
    }
    return baseIsEqualDeep(value, other, baseIsEqual, customizer, bitmask, stack);
  }
  function baseIsEqualDeep(object, other, equalFunc, customizer, bitmask, stack) {
    var objIsArr = isArray2(object), othIsArr = isArray2(other), objTag = arrayTag, othTag = arrayTag;
    if (!objIsArr) {
      objTag = getTag(object);
      objTag = objTag == argsTag ? objectTag : objTag;
    }
    if (!othIsArr) {
      othTag = getTag(other);
      othTag = othTag == argsTag ? objectTag : othTag;
    }
    var objIsObj = objTag == objectTag && !isHostObject(object), othIsObj = othTag == objectTag && !isHostObject(other), isSameTag = objTag == othTag;
    if (isSameTag && !objIsObj) {
      stack || (stack = new Stack());
      return objIsArr || isTypedArray(object) ? equalArrays(object, other, equalFunc, customizer, bitmask, stack) : equalByTag(object, other, objTag, equalFunc, customizer, bitmask, stack);
    }
    if (!(bitmask & PARTIAL_COMPARE_FLAG)) {
      var objIsWrapped = objIsObj && hasOwnProperty.call(object, "__wrapped__"), othIsWrapped = othIsObj && hasOwnProperty.call(other, "__wrapped__");
      if (objIsWrapped || othIsWrapped) {
        var objUnwrapped = objIsWrapped ? object.value() : object, othUnwrapped = othIsWrapped ? other.value() : other;
        stack || (stack = new Stack());
        return equalFunc(objUnwrapped, othUnwrapped, customizer, bitmask, stack);
      }
    }
    if (!isSameTag) {
      return false;
    }
    stack || (stack = new Stack());
    return equalObjects(object, other, equalFunc, customizer, bitmask, stack);
  }
  function baseIsMatch(object, source, matchData, customizer) {
    var index = matchData.length, length = index, noCustomizer = !customizer;
    if (object == null) {
      return !length;
    }
    object = Object(object);
    while (index--) {
      var data = matchData[index];
      if (noCustomizer && data[2] ? data[1] !== object[data[0]] : !(data[0] in object)) {
        return false;
      }
    }
    while (++index < length) {
      data = matchData[index];
      var key = data[0], objValue = object[key], srcValue = data[1];
      if (noCustomizer && data[2]) {
        if (objValue === void 0 && !(key in object)) {
          return false;
        }
      } else {
        var stack = new Stack();
        if (customizer) {
          var result = customizer(objValue, srcValue, key, object, source, stack);
        }
        if (!(result === void 0 ? baseIsEqual(srcValue, objValue, customizer, UNORDERED_COMPARE_FLAG | PARTIAL_COMPARE_FLAG, stack) : result)) {
          return false;
        }
      }
    }
    return true;
  }
  function baseIsNative(value) {
    if (!isObject2(value) || isMasked(value)) {
      return false;
    }
    var pattern = isFunction(value) || isHostObject(value) ? reIsNative : reIsHostCtor;
    return pattern.test(toSource(value));
  }
  function baseIsTypedArray(value) {
    return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[objectToString.call(value)];
  }
  function baseIteratee(value) {
    if (typeof value == "function") {
      return value;
    }
    if (value == null) {
      return identity;
    }
    if (typeof value == "object") {
      return isArray2(value) ? baseMatchesProperty(value[0], value[1]) : baseMatches(value);
    }
    return property(value);
  }
  function baseKeys(object) {
    if (!isPrototype(object)) {
      return nativeKeys(object);
    }
    var result = [];
    for (var key in Object(object)) {
      if (hasOwnProperty.call(object, key) && key != "constructor") {
        result.push(key);
      }
    }
    return result;
  }
  function baseMap(collection, iteratee) {
    var index = -1, result = isArrayLike(collection) ? Array(collection.length) : [];
    baseEach(collection, function(value, key, collection2) {
      result[++index] = iteratee(value, key, collection2);
    });
    return result;
  }
  function baseMatches(source) {
    var matchData = getMatchData(source);
    if (matchData.length == 1 && matchData[0][2]) {
      return matchesStrictComparable(matchData[0][0], matchData[0][1]);
    }
    return function(object) {
      return object === source || baseIsMatch(object, source, matchData);
    };
  }
  function baseMatchesProperty(path, srcValue) {
    if (isKey(path) && isStrictComparable(srcValue)) {
      return matchesStrictComparable(toKey(path), srcValue);
    }
    return function(object) {
      var objValue = get(object, path);
      return objValue === void 0 && objValue === srcValue ? hasIn(object, path) : baseIsEqual(srcValue, objValue, void 0, UNORDERED_COMPARE_FLAG | PARTIAL_COMPARE_FLAG);
    };
  }
  function baseOrderBy(collection, iteratees, orders) {
    var index = -1;
    iteratees = arrayMap(iteratees.length ? iteratees : [identity], baseUnary(baseIteratee));
    var result = baseMap(collection, function(value, key, collection2) {
      var criteria = arrayMap(iteratees, function(iteratee) {
        return iteratee(value);
      });
      return {criteria, index: ++index, value};
    });
    return baseSortBy(result, function(object, other) {
      return compareMultiple(object, other, orders);
    });
  }
  function basePropertyDeep(path) {
    return function(object) {
      return baseGet(object, path);
    };
  }
  function baseRest(func, start) {
    start = nativeMax(start === void 0 ? func.length - 1 : start, 0);
    return function() {
      var args = arguments, index = -1, length = nativeMax(args.length - start, 0), array = Array(length);
      while (++index < length) {
        array[index] = args[start + index];
      }
      index = -1;
      var otherArgs = Array(start + 1);
      while (++index < start) {
        otherArgs[index] = args[index];
      }
      otherArgs[start] = array;
      return apply(func, this, otherArgs);
    };
  }
  function baseToString(value) {
    if (typeof value == "string") {
      return value;
    }
    if (isSymbol(value)) {
      return symbolToString ? symbolToString.call(value) : "";
    }
    var result = value + "";
    return result == "0" && 1 / value == -INFINITY ? "-0" : result;
  }
  function castPath(value) {
    return isArray2(value) ? value : stringToPath(value);
  }
  function compareAscending(value, other) {
    if (value !== other) {
      var valIsDefined = value !== void 0, valIsNull = value === null, valIsReflexive = value === value, valIsSymbol = isSymbol(value);
      var othIsDefined = other !== void 0, othIsNull = other === null, othIsReflexive = other === other, othIsSymbol = isSymbol(other);
      if (!othIsNull && !othIsSymbol && !valIsSymbol && value > other || valIsSymbol && othIsDefined && othIsReflexive && !othIsNull && !othIsSymbol || valIsNull && othIsDefined && othIsReflexive || !valIsDefined && othIsReflexive || !valIsReflexive) {
        return 1;
      }
      if (!valIsNull && !valIsSymbol && !othIsSymbol && value < other || othIsSymbol && valIsDefined && valIsReflexive && !valIsNull && !valIsSymbol || othIsNull && valIsDefined && valIsReflexive || !othIsDefined && valIsReflexive || !othIsReflexive) {
        return -1;
      }
    }
    return 0;
  }
  function compareMultiple(object, other, orders) {
    var index = -1, objCriteria = object.criteria, othCriteria = other.criteria, length = objCriteria.length, ordersLength = orders.length;
    while (++index < length) {
      var result = compareAscending(objCriteria[index], othCriteria[index]);
      if (result) {
        if (index >= ordersLength) {
          return result;
        }
        var order = orders[index];
        return result * (order == "desc" ? -1 : 1);
      }
    }
    return object.index - other.index;
  }
  function createBaseEach(eachFunc, fromRight) {
    return function(collection, iteratee) {
      if (collection == null) {
        return collection;
      }
      if (!isArrayLike(collection)) {
        return eachFunc(collection, iteratee);
      }
      var length = collection.length, index = fromRight ? length : -1, iterable = Object(collection);
      while (fromRight ? index-- : ++index < length) {
        if (iteratee(iterable[index], index, iterable) === false) {
          break;
        }
      }
      return collection;
    };
  }
  function createBaseFor(fromRight) {
    return function(object, iteratee, keysFunc) {
      var index = -1, iterable = Object(object), props = keysFunc(object), length = props.length;
      while (length--) {
        var key = props[fromRight ? length : ++index];
        if (iteratee(iterable[key], key, iterable) === false) {
          break;
        }
      }
      return object;
    };
  }
  function equalArrays(array, other, equalFunc, customizer, bitmask, stack) {
    var isPartial = bitmask & PARTIAL_COMPARE_FLAG, arrLength = array.length, othLength = other.length;
    if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
      return false;
    }
    var stacked = stack.get(array);
    if (stacked && stack.get(other)) {
      return stacked == other;
    }
    var index = -1, result = true, seen = bitmask & UNORDERED_COMPARE_FLAG ? new SetCache() : void 0;
    stack.set(array, other);
    stack.set(other, array);
    while (++index < arrLength) {
      var arrValue = array[index], othValue = other[index];
      if (customizer) {
        var compared = isPartial ? customizer(othValue, arrValue, index, other, array, stack) : customizer(arrValue, othValue, index, array, other, stack);
      }
      if (compared !== void 0) {
        if (compared) {
          continue;
        }
        result = false;
        break;
      }
      if (seen) {
        if (!arraySome(other, function(othValue2, othIndex) {
          if (!seen.has(othIndex) && (arrValue === othValue2 || equalFunc(arrValue, othValue2, customizer, bitmask, stack))) {
            return seen.add(othIndex);
          }
        })) {
          result = false;
          break;
        }
      } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, customizer, bitmask, stack))) {
        result = false;
        break;
      }
    }
    stack["delete"](array);
    stack["delete"](other);
    return result;
  }
  function equalByTag(object, other, tag, equalFunc, customizer, bitmask, stack) {
    switch (tag) {
      case dataViewTag:
        if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) {
          return false;
        }
        object = object.buffer;
        other = other.buffer;
      case arrayBufferTag:
        if (object.byteLength != other.byteLength || !equalFunc(new Uint8Array2(object), new Uint8Array2(other))) {
          return false;
        }
        return true;
      case boolTag:
      case dateTag:
      case numberTag:
        return eq(+object, +other);
      case errorTag:
        return object.name == other.name && object.message == other.message;
      case regexpTag:
      case stringTag:
        return object == other + "";
      case mapTag:
        var convert = mapToArray;
      case setTag:
        var isPartial = bitmask & PARTIAL_COMPARE_FLAG;
        convert || (convert = setToArray);
        if (object.size != other.size && !isPartial) {
          return false;
        }
        var stacked = stack.get(object);
        if (stacked) {
          return stacked == other;
        }
        bitmask |= UNORDERED_COMPARE_FLAG;
        stack.set(object, other);
        var result = equalArrays(convert(object), convert(other), equalFunc, customizer, bitmask, stack);
        stack["delete"](object);
        return result;
      case symbolTag:
        if (symbolValueOf) {
          return symbolValueOf.call(object) == symbolValueOf.call(other);
        }
    }
    return false;
  }
  function equalObjects(object, other, equalFunc, customizer, bitmask, stack) {
    var isPartial = bitmask & PARTIAL_COMPARE_FLAG, objProps = keys(object), objLength = objProps.length, othProps = keys(other), othLength = othProps.length;
    if (objLength != othLength && !isPartial) {
      return false;
    }
    var index = objLength;
    while (index--) {
      var key = objProps[index];
      if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
        return false;
      }
    }
    var stacked = stack.get(object);
    if (stacked && stack.get(other)) {
      return stacked == other;
    }
    var result = true;
    stack.set(object, other);
    stack.set(other, object);
    var skipCtor = isPartial;
    while (++index < objLength) {
      key = objProps[index];
      var objValue = object[key], othValue = other[key];
      if (customizer) {
        var compared = isPartial ? customizer(othValue, objValue, key, other, object, stack) : customizer(objValue, othValue, key, object, other, stack);
      }
      if (!(compared === void 0 ? objValue === othValue || equalFunc(objValue, othValue, customizer, bitmask, stack) : compared)) {
        result = false;
        break;
      }
      skipCtor || (skipCtor = key == "constructor");
    }
    if (result && !skipCtor) {
      var objCtor = object.constructor, othCtor = other.constructor;
      if (objCtor != othCtor && ("constructor" in object && "constructor" in other) && !(typeof objCtor == "function" && objCtor instanceof objCtor && typeof othCtor == "function" && othCtor instanceof othCtor)) {
        result = false;
      }
    }
    stack["delete"](object);
    stack["delete"](other);
    return result;
  }
  function getMapData(map, key) {
    var data = map.__data__;
    return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
  }
  function getMatchData(object) {
    var result = keys(object), length = result.length;
    while (length--) {
      var key = result[length], value = object[key];
      result[length] = [key, value, isStrictComparable(value)];
    }
    return result;
  }
  function getNative(object, key) {
    var value = getValue(object, key);
    return baseIsNative(value) ? value : void 0;
  }
  var getTag = baseGetTag;
  if (DataView2 && getTag(new DataView2(new ArrayBuffer(1))) != dataViewTag || Map2 && getTag(new Map2()) != mapTag || Promise2 && getTag(Promise2.resolve()) != promiseTag || Set2 && getTag(new Set2()) != setTag || WeakMap && getTag(new WeakMap()) != weakMapTag) {
    getTag = function(value) {
      var result = objectToString.call(value), Ctor = result == objectTag ? value.constructor : void 0, ctorString = Ctor ? toSource(Ctor) : void 0;
      if (ctorString) {
        switch (ctorString) {
          case dataViewCtorString:
            return dataViewTag;
          case mapCtorString:
            return mapTag;
          case promiseCtorString:
            return promiseTag;
          case setCtorString:
            return setTag;
          case weakMapCtorString:
            return weakMapTag;
        }
      }
      return result;
    };
  }
  function hasPath(object, path, hasFunc) {
    path = isKey(path, object) ? [path] : castPath(path);
    var result, index = -1, length = path.length;
    while (++index < length) {
      var key = toKey(path[index]);
      if (!(result = object != null && hasFunc(object, key))) {
        break;
      }
      object = object[key];
    }
    if (result) {
      return result;
    }
    var length = object ? object.length : 0;
    return !!length && isLength(length) && isIndex(key, length) && (isArray2(object) || isArguments(object));
  }
  function isFlattenable(value) {
    return isArray2(value) || isArguments(value) || !!(spreadableSymbol && value && value[spreadableSymbol]);
  }
  function isIndex(value, length) {
    length = length == null ? MAX_SAFE_INTEGER : length;
    return !!length && (typeof value == "number" || reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
  }
  function isIterateeCall(value, index, object) {
    if (!isObject2(object)) {
      return false;
    }
    var type = typeof index;
    if (type == "number" ? isArrayLike(object) && isIndex(index, object.length) : type == "string" && index in object) {
      return eq(object[index], value);
    }
    return false;
  }
  function isKey(value, object) {
    if (isArray2(value)) {
      return false;
    }
    var type = typeof value;
    if (type == "number" || type == "symbol" || type == "boolean" || value == null || isSymbol(value)) {
      return true;
    }
    return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || object != null && value in Object(object);
  }
  function isKeyable(value) {
    var type = typeof value;
    return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
  }
  function isMasked(func) {
    return !!maskSrcKey && maskSrcKey in func;
  }
  function isPrototype(value) {
    var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto;
    return value === proto;
  }
  function isStrictComparable(value) {
    return value === value && !isObject2(value);
  }
  function matchesStrictComparable(key, srcValue) {
    return function(object) {
      if (object == null) {
        return false;
      }
      return object[key] === srcValue && (srcValue !== void 0 || key in Object(object));
    };
  }
  var stringToPath = memoize(function(string) {
    string = toString(string);
    var result = [];
    if (reLeadingDot.test(string)) {
      result.push("");
    }
    string.replace(rePropName, function(match, number, quote, string2) {
      result.push(quote ? string2.replace(reEscapeChar, "$1") : number || match);
    });
    return result;
  });
  function toKey(value) {
    if (typeof value == "string" || isSymbol(value)) {
      return value;
    }
    var result = value + "";
    return result == "0" && 1 / value == -INFINITY ? "-0" : result;
  }
  function toSource(func) {
    if (func != null) {
      try {
        return funcToString.call(func);
      } catch (e) {
      }
      try {
        return func + "";
      } catch (e) {
      }
    }
    return "";
  }
  var sortBy = baseRest(function(collection, iteratees) {
    if (collection == null) {
      return [];
    }
    var length = iteratees.length;
    if (length > 1 && isIterateeCall(collection, iteratees[0], iteratees[1])) {
      iteratees = [];
    } else if (length > 2 && isIterateeCall(iteratees[0], iteratees[1], iteratees[2])) {
      iteratees = [iteratees[0]];
    }
    return baseOrderBy(collection, baseFlatten(iteratees, 1), []);
  });
  function memoize(func, resolver) {
    if (typeof func != "function" || resolver && typeof resolver != "function") {
      throw new TypeError(FUNC_ERROR_TEXT);
    }
    var memoized = function() {
      var args = arguments, key = resolver ? resolver.apply(this, args) : args[0], cache = memoized.cache;
      if (cache.has(key)) {
        return cache.get(key);
      }
      var result = func.apply(this, args);
      memoized.cache = cache.set(key, result);
      return result;
    };
    memoized.cache = new (memoize.Cache || MapCache)();
    return memoized;
  }
  memoize.Cache = MapCache;
  function eq(value, other) {
    return value === other || value !== value && other !== other;
  }
  function isArguments(value) {
    return isArrayLikeObject(value) && hasOwnProperty.call(value, "callee") && (!propertyIsEnumerable.call(value, "callee") || objectToString.call(value) == argsTag);
  }
  var isArray2 = Array.isArray;
  function isArrayLike(value) {
    return value != null && isLength(value.length) && !isFunction(value);
  }
  function isArrayLikeObject(value) {
    return isObjectLike(value) && isArrayLike(value);
  }
  function isFunction(value) {
    var tag = isObject2(value) ? objectToString.call(value) : "";
    return tag == funcTag || tag == genTag;
  }
  function isLength(value) {
    return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
  }
  function isObject2(value) {
    var type = typeof value;
    return !!value && (type == "object" || type == "function");
  }
  function isObjectLike(value) {
    return !!value && typeof value == "object";
  }
  function isSymbol(value) {
    return typeof value == "symbol" || isObjectLike(value) && objectToString.call(value) == symbolTag;
  }
  var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
  function toString(value) {
    return value == null ? "" : baseToString(value);
  }
  function get(object, path, defaultValue) {
    var result = object == null ? void 0 : baseGet(object, path);
    return result === void 0 ? defaultValue : result;
  }
  function hasIn(object, path) {
    return object != null && hasPath(object, path, baseHasIn);
  }
  function keys(object) {
    return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
  }
  function identity(value) {
    return value;
  }
  function property(path) {
    return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
  }
  module2.exports = sortBy;
});

// node_modules/whatwg-url/lib/URLSearchParams-impl.js
var require_URLSearchParams_impl = __commonJS((exports2) => {
  "use strict";
  var stableSortBy = require_lodash();
  var urlencoded = require_urlencoded();
  exports2.implementation = class URLSearchParamsImpl {
    constructor(constructorArgs, {doNotStripQMark = false}) {
      let init = constructorArgs[0];
      this._list = [];
      this._url = null;
      if (!doNotStripQMark && typeof init === "string" && init[0] === "?") {
        init = init.slice(1);
      }
      if (Array.isArray(init)) {
        for (const pair of init) {
          if (pair.length !== 2) {
            throw new TypeError("Failed to construct 'URLSearchParams': parameter 1 sequence's element does not contain exactly two elements.");
          }
          this._list.push([pair[0], pair[1]]);
        }
      } else if (typeof init === "object" && Object.getPrototypeOf(init) === null) {
        for (const name of Object.keys(init)) {
          const value = init[name];
          this._list.push([name, value]);
        }
      } else {
        this._list = urlencoded.parseUrlencoded(init);
      }
    }
    _updateSteps() {
      if (this._url !== null) {
        let query = urlencoded.serializeUrlencoded(this._list);
        if (query === "") {
          query = null;
        }
        this._url._url.query = query;
      }
    }
    append(name, value) {
      this._list.push([name, value]);
      this._updateSteps();
    }
    delete(name) {
      let i = 0;
      while (i < this._list.length) {
        if (this._list[i][0] === name) {
          this._list.splice(i, 1);
        } else {
          i++;
        }
      }
      this._updateSteps();
    }
    get(name) {
      for (const tuple of this._list) {
        if (tuple[0] === name) {
          return tuple[1];
        }
      }
      return null;
    }
    getAll(name) {
      const output = [];
      for (const tuple of this._list) {
        if (tuple[0] === name) {
          output.push(tuple[1]);
        }
      }
      return output;
    }
    has(name) {
      for (const tuple of this._list) {
        if (tuple[0] === name) {
          return true;
        }
      }
      return false;
    }
    set(name, value) {
      let found = false;
      let i = 0;
      while (i < this._list.length) {
        if (this._list[i][0] === name) {
          if (found) {
            this._list.splice(i, 1);
          } else {
            found = true;
            this._list[i][1] = value;
            i++;
          }
        } else {
          i++;
        }
      }
      if (!found) {
        this._list.push([name, value]);
      }
      this._updateSteps();
    }
    sort() {
      this._list = stableSortBy(this._list, [0]);
      this._updateSteps();
    }
    [Symbol.iterator]() {
      return this._list[Symbol.iterator]();
    }
    toString() {
      return urlencoded.serializeUrlencoded(this._list);
    }
  };
});

// node_modules/whatwg-url/lib/URLSearchParams.js
var require_URLSearchParams = __commonJS((exports2, module2) => {
  "use strict";
  var conversions = require_lib2();
  var utils = require_utils2();
  var impl = utils.implSymbol;
  var IteratorPrototype = Object.create(utils.IteratorPrototype, {
    next: {
      value: function next() {
        const internal = this[utils.iterInternalSymbol];
        const {target, kind, index} = internal;
        const values = Array.from(target[impl]);
        const len = values.length;
        if (index >= len) {
          return {value: void 0, done: true};
        }
        const pair = values[index];
        internal.index = index + 1;
        const [key, value] = pair.map(utils.tryWrapperForImpl);
        let result;
        switch (kind) {
          case "key":
            result = key;
            break;
          case "value":
            result = value;
            break;
          case "key+value":
            result = [key, value];
            break;
        }
        return {value: result, done: false};
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    [Symbol.toStringTag]: {
      value: "URLSearchParams Iterator",
      configurable: true
    }
  });
  var URLSearchParams = class {
    constructor() {
      const args = [];
      {
        let curArg = arguments[0];
        if (curArg !== void 0) {
          if (utils.isObject(curArg)) {
            if (curArg[Symbol.iterator] !== void 0) {
              if (!utils.isObject(curArg)) {
                throw new TypeError("Failed to construct 'URLSearchParams': parameter 1 sequence is not an iterable object.");
              } else {
                const V = [];
                const tmp = curArg;
                for (let nextItem of tmp) {
                  if (!utils.isObject(nextItem)) {
                    throw new TypeError("Failed to construct 'URLSearchParams': parameter 1 sequence's element is not an iterable object.");
                  } else {
                    const V2 = [];
                    const tmp2 = nextItem;
                    for (let nextItem2 of tmp2) {
                      nextItem2 = conversions["USVString"](nextItem2, {
                        context: "Failed to construct 'URLSearchParams': parameter 1 sequence's element's element"
                      });
                      V2.push(nextItem2);
                    }
                    nextItem = V2;
                  }
                  V.push(nextItem);
                }
                curArg = V;
              }
            } else {
              if (!utils.isObject(curArg)) {
                throw new TypeError("Failed to construct 'URLSearchParams': parameter 1 record is not an object.");
              } else {
                const result = Object.create(null);
                for (const key of Reflect.ownKeys(curArg)) {
                  const desc = Object.getOwnPropertyDescriptor(curArg, key);
                  if (desc && desc.enumerable) {
                    let typedKey = key;
                    let typedValue = curArg[key];
                    typedKey = conversions["USVString"](typedKey, {
                      context: "Failed to construct 'URLSearchParams': parameter 1 record's key"
                    });
                    typedValue = conversions["USVString"](typedValue, {
                      context: "Failed to construct 'URLSearchParams': parameter 1 record's value"
                    });
                    result[typedKey] = typedValue;
                  }
                }
                curArg = result;
              }
            }
          } else {
            curArg = conversions["USVString"](curArg, {context: "Failed to construct 'URLSearchParams': parameter 1"});
          }
        } else {
          curArg = "";
        }
        args.push(curArg);
      }
      return iface.setup(Object.create(new.target.prototype), args);
    }
    append(name, value) {
      if (!this || !module2.exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }
      if (arguments.length < 2) {
        throw new TypeError("Failed to execute 'append' on 'URLSearchParams': 2 arguments required, but only " + arguments.length + " present.");
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = conversions["USVString"](curArg, {
          context: "Failed to execute 'append' on 'URLSearchParams': parameter 1"
        });
        args.push(curArg);
      }
      {
        let curArg = arguments[1];
        curArg = conversions["USVString"](curArg, {
          context: "Failed to execute 'append' on 'URLSearchParams': parameter 2"
        });
        args.push(curArg);
      }
      return this[impl].append(...args);
    }
    delete(name) {
      if (!this || !module2.exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }
      if (arguments.length < 1) {
        throw new TypeError("Failed to execute 'delete' on 'URLSearchParams': 1 argument required, but only " + arguments.length + " present.");
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = conversions["USVString"](curArg, {
          context: "Failed to execute 'delete' on 'URLSearchParams': parameter 1"
        });
        args.push(curArg);
      }
      return this[impl].delete(...args);
    }
    get(name) {
      if (!this || !module2.exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }
      if (arguments.length < 1) {
        throw new TypeError("Failed to execute 'get' on 'URLSearchParams': 1 argument required, but only " + arguments.length + " present.");
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = conversions["USVString"](curArg, {
          context: "Failed to execute 'get' on 'URLSearchParams': parameter 1"
        });
        args.push(curArg);
      }
      return this[impl].get(...args);
    }
    getAll(name) {
      if (!this || !module2.exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }
      if (arguments.length < 1) {
        throw new TypeError("Failed to execute 'getAll' on 'URLSearchParams': 1 argument required, but only " + arguments.length + " present.");
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = conversions["USVString"](curArg, {
          context: "Failed to execute 'getAll' on 'URLSearchParams': parameter 1"
        });
        args.push(curArg);
      }
      return utils.tryWrapperForImpl(this[impl].getAll(...args));
    }
    has(name) {
      if (!this || !module2.exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }
      if (arguments.length < 1) {
        throw new TypeError("Failed to execute 'has' on 'URLSearchParams': 1 argument required, but only " + arguments.length + " present.");
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = conversions["USVString"](curArg, {
          context: "Failed to execute 'has' on 'URLSearchParams': parameter 1"
        });
        args.push(curArg);
      }
      return this[impl].has(...args);
    }
    set(name, value) {
      if (!this || !module2.exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }
      if (arguments.length < 2) {
        throw new TypeError("Failed to execute 'set' on 'URLSearchParams': 2 arguments required, but only " + arguments.length + " present.");
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = conversions["USVString"](curArg, {
          context: "Failed to execute 'set' on 'URLSearchParams': parameter 1"
        });
        args.push(curArg);
      }
      {
        let curArg = arguments[1];
        curArg = conversions["USVString"](curArg, {
          context: "Failed to execute 'set' on 'URLSearchParams': parameter 2"
        });
        args.push(curArg);
      }
      return this[impl].set(...args);
    }
    sort() {
      if (!this || !module2.exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }
      return this[impl].sort();
    }
    toString() {
      if (!this || !module2.exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }
      return this[impl].toString();
    }
    keys() {
      if (!this || !module2.exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }
      return module2.exports.createDefaultIterator(this, "key");
    }
    values() {
      if (!this || !module2.exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }
      return module2.exports.createDefaultIterator(this, "value");
    }
    entries() {
      if (!this || !module2.exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }
      return module2.exports.createDefaultIterator(this, "key+value");
    }
    forEach(callback) {
      if (!this || !module2.exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }
      if (arguments.length < 1) {
        throw new TypeError("Failed to execute 'forEach' on 'iterable': 1 argument required, but only 0 present.");
      }
      if (typeof callback !== "function") {
        throw new TypeError("Failed to execute 'forEach' on 'iterable': The callback provided as parameter 1 is not a function.");
      }
      const thisArg = arguments[1];
      let pairs = Array.from(this[impl]);
      let i = 0;
      while (i < pairs.length) {
        const [key, value] = pairs[i].map(utils.tryWrapperForImpl);
        callback.call(thisArg, value, key, this);
        pairs = Array.from(this[impl]);
        i++;
      }
    }
  };
  Object.defineProperties(URLSearchParams.prototype, {
    append: {enumerable: true},
    delete: {enumerable: true},
    get: {enumerable: true},
    getAll: {enumerable: true},
    has: {enumerable: true},
    set: {enumerable: true},
    sort: {enumerable: true},
    toString: {enumerable: true},
    keys: {enumerable: true},
    values: {enumerable: true},
    entries: {enumerable: true},
    forEach: {enumerable: true},
    [Symbol.toStringTag]: {value: "URLSearchParams", configurable: true},
    [Symbol.iterator]: {value: URLSearchParams.prototype.entries, configurable: true, writable: true}
  });
  var iface = {
    _mixedIntoPredicates: [],
    is(obj) {
      if (obj) {
        if (utils.hasOwn(obj, impl) && obj[impl] instanceof Impl.implementation) {
          return true;
        }
        for (const isMixedInto of module2.exports._mixedIntoPredicates) {
          if (isMixedInto(obj)) {
            return true;
          }
        }
      }
      return false;
    },
    isImpl(obj) {
      if (obj) {
        if (obj instanceof Impl.implementation) {
          return true;
        }
        const wrapper = utils.wrapperForImpl(obj);
        for (const isMixedInto of module2.exports._mixedIntoPredicates) {
          if (isMixedInto(wrapper)) {
            return true;
          }
        }
      }
      return false;
    },
    convert(obj, {context = "The provided value"} = {}) {
      if (module2.exports.is(obj)) {
        return utils.implForWrapper(obj);
      }
      throw new TypeError(`${context} is not of type 'URLSearchParams'.`);
    },
    createDefaultIterator(target, kind) {
      const iterator = Object.create(IteratorPrototype);
      Object.defineProperty(iterator, utils.iterInternalSymbol, {
        value: {target, kind, index: 0},
        configurable: true
      });
      return iterator;
    },
    create(constructorArgs, privateData) {
      let obj = Object.create(URLSearchParams.prototype);
      obj = this.setup(obj, constructorArgs, privateData);
      return obj;
    },
    createImpl(constructorArgs, privateData) {
      let obj = Object.create(URLSearchParams.prototype);
      obj = this.setup(obj, constructorArgs, privateData);
      return utils.implForWrapper(obj);
    },
    _internalSetup(obj) {
    },
    setup(obj, constructorArgs, privateData) {
      if (!privateData)
        privateData = {};
      privateData.wrapper = obj;
      this._internalSetup(obj);
      Object.defineProperty(obj, impl, {
        value: new Impl.implementation(constructorArgs, privateData),
        configurable: true
      });
      obj[impl][utils.wrapperSymbol] = obj;
      if (Impl.init) {
        Impl.init(obj[impl], privateData);
      }
      return obj;
    },
    interface: URLSearchParams,
    expose: {
      Window: {URLSearchParams},
      Worker: {URLSearchParams}
    }
  };
  module2.exports = iface;
  var Impl = require_URLSearchParams_impl();
});

// node_modules/whatwg-url/lib/URL-impl.js
var require_URL_impl = __commonJS((exports2) => {
  "use strict";
  var usm = require_url_state_machine();
  var urlencoded = require_urlencoded();
  var URLSearchParams = require_URLSearchParams();
  exports2.implementation = class URLImpl {
    constructor(constructorArgs) {
      const url = constructorArgs[0];
      const base = constructorArgs[1];
      let parsedBase = null;
      if (base !== void 0) {
        parsedBase = usm.basicURLParse(base);
        if (parsedBase === null) {
          throw new TypeError(`Invalid base URL: ${base}`);
        }
      }
      const parsedURL = usm.basicURLParse(url, {baseURL: parsedBase});
      if (parsedURL === null) {
        throw new TypeError(`Invalid URL: ${url}`);
      }
      const query = parsedURL.query !== null ? parsedURL.query : "";
      this._url = parsedURL;
      this._query = URLSearchParams.createImpl([query], {doNotStripQMark: true});
      this._query._url = this;
    }
    get href() {
      return usm.serializeURL(this._url);
    }
    set href(v) {
      const parsedURL = usm.basicURLParse(v);
      if (parsedURL === null) {
        throw new TypeError(`Invalid URL: ${v}`);
      }
      this._url = parsedURL;
      this._query._list.splice(0);
      const {query} = parsedURL;
      if (query !== null) {
        this._query._list = urlencoded.parseUrlencoded(query);
      }
    }
    get origin() {
      return usm.serializeURLOrigin(this._url);
    }
    get protocol() {
      return this._url.scheme + ":";
    }
    set protocol(v) {
      usm.basicURLParse(v + ":", {url: this._url, stateOverride: "scheme start"});
    }
    get username() {
      return this._url.username;
    }
    set username(v) {
      if (usm.cannotHaveAUsernamePasswordPort(this._url)) {
        return;
      }
      usm.setTheUsername(this._url, v);
    }
    get password() {
      return this._url.password;
    }
    set password(v) {
      if (usm.cannotHaveAUsernamePasswordPort(this._url)) {
        return;
      }
      usm.setThePassword(this._url, v);
    }
    get host() {
      const url = this._url;
      if (url.host === null) {
        return "";
      }
      if (url.port === null) {
        return usm.serializeHost(url.host);
      }
      return usm.serializeHost(url.host) + ":" + usm.serializeInteger(url.port);
    }
    set host(v) {
      if (this._url.cannotBeABaseURL) {
        return;
      }
      usm.basicURLParse(v, {url: this._url, stateOverride: "host"});
    }
    get hostname() {
      if (this._url.host === null) {
        return "";
      }
      return usm.serializeHost(this._url.host);
    }
    set hostname(v) {
      if (this._url.cannotBeABaseURL) {
        return;
      }
      usm.basicURLParse(v, {url: this._url, stateOverride: "hostname"});
    }
    get port() {
      if (this._url.port === null) {
        return "";
      }
      return usm.serializeInteger(this._url.port);
    }
    set port(v) {
      if (usm.cannotHaveAUsernamePasswordPort(this._url)) {
        return;
      }
      if (v === "") {
        this._url.port = null;
      } else {
        usm.basicURLParse(v, {url: this._url, stateOverride: "port"});
      }
    }
    get pathname() {
      if (this._url.cannotBeABaseURL) {
        return this._url.path[0];
      }
      if (this._url.path.length === 0) {
        return "";
      }
      return "/" + this._url.path.join("/");
    }
    set pathname(v) {
      if (this._url.cannotBeABaseURL) {
        return;
      }
      this._url.path = [];
      usm.basicURLParse(v, {url: this._url, stateOverride: "path start"});
    }
    get search() {
      if (this._url.query === null || this._url.query === "") {
        return "";
      }
      return "?" + this._url.query;
    }
    set search(v) {
      const url = this._url;
      if (v === "") {
        url.query = null;
        this._query._list = [];
        return;
      }
      const input = v[0] === "?" ? v.substring(1) : v;
      url.query = "";
      usm.basicURLParse(input, {url, stateOverride: "query"});
      this._query._list = urlencoded.parseUrlencoded(input);
    }
    get searchParams() {
      return this._query;
    }
    get hash() {
      if (this._url.fragment === null || this._url.fragment === "") {
        return "";
      }
      return "#" + this._url.fragment;
    }
    set hash(v) {
      if (v === "") {
        this._url.fragment = null;
        return;
      }
      const input = v[0] === "#" ? v.substring(1) : v;
      this._url.fragment = "";
      usm.basicURLParse(input, {url: this._url, stateOverride: "fragment"});
    }
    toJSON() {
      return this.href;
    }
  };
});

// node_modules/whatwg-url/lib/URL.js
var require_URL = __commonJS((exports2, module2) => {
  "use strict";
  var conversions = require_lib2();
  var utils = require_utils2();
  var impl = utils.implSymbol;
  var URL2 = class {
    constructor(url) {
      if (arguments.length < 1) {
        throw new TypeError("Failed to construct 'URL': 1 argument required, but only " + arguments.length + " present.");
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = conversions["USVString"](curArg, {context: "Failed to construct 'URL': parameter 1"});
        args.push(curArg);
      }
      {
        let curArg = arguments[1];
        if (curArg !== void 0) {
          curArg = conversions["USVString"](curArg, {context: "Failed to construct 'URL': parameter 2"});
        }
        args.push(curArg);
      }
      return iface.setup(Object.create(new.target.prototype), args);
    }
    toJSON() {
      if (!this || !module2.exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }
      return this[impl].toJSON();
    }
    get href() {
      if (!this || !module2.exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }
      return this[impl]["href"];
    }
    set href(V) {
      if (!this || !module2.exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }
      V = conversions["USVString"](V, {context: "Failed to set the 'href' property on 'URL': The provided value"});
      this[impl]["href"] = V;
    }
    toString() {
      if (!this || !module2.exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }
      return this[impl]["href"];
    }
    get origin() {
      if (!this || !module2.exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }
      return this[impl]["origin"];
    }
    get protocol() {
      if (!this || !module2.exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }
      return this[impl]["protocol"];
    }
    set protocol(V) {
      if (!this || !module2.exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }
      V = conversions["USVString"](V, {context: "Failed to set the 'protocol' property on 'URL': The provided value"});
      this[impl]["protocol"] = V;
    }
    get username() {
      if (!this || !module2.exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }
      return this[impl]["username"];
    }
    set username(V) {
      if (!this || !module2.exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }
      V = conversions["USVString"](V, {context: "Failed to set the 'username' property on 'URL': The provided value"});
      this[impl]["username"] = V;
    }
    get password() {
      if (!this || !module2.exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }
      return this[impl]["password"];
    }
    set password(V) {
      if (!this || !module2.exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }
      V = conversions["USVString"](V, {context: "Failed to set the 'password' property on 'URL': The provided value"});
      this[impl]["password"] = V;
    }
    get host() {
      if (!this || !module2.exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }
      return this[impl]["host"];
    }
    set host(V) {
      if (!this || !module2.exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }
      V = conversions["USVString"](V, {context: "Failed to set the 'host' property on 'URL': The provided value"});
      this[impl]["host"] = V;
    }
    get hostname() {
      if (!this || !module2.exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }
      return this[impl]["hostname"];
    }
    set hostname(V) {
      if (!this || !module2.exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }
      V = conversions["USVString"](V, {context: "Failed to set the 'hostname' property on 'URL': The provided value"});
      this[impl]["hostname"] = V;
    }
    get port() {
      if (!this || !module2.exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }
      return this[impl]["port"];
    }
    set port(V) {
      if (!this || !module2.exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }
      V = conversions["USVString"](V, {context: "Failed to set the 'port' property on 'URL': The provided value"});
      this[impl]["port"] = V;
    }
    get pathname() {
      if (!this || !module2.exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }
      return this[impl]["pathname"];
    }
    set pathname(V) {
      if (!this || !module2.exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }
      V = conversions["USVString"](V, {context: "Failed to set the 'pathname' property on 'URL': The provided value"});
      this[impl]["pathname"] = V;
    }
    get search() {
      if (!this || !module2.exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }
      return this[impl]["search"];
    }
    set search(V) {
      if (!this || !module2.exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }
      V = conversions["USVString"](V, {context: "Failed to set the 'search' property on 'URL': The provided value"});
      this[impl]["search"] = V;
    }
    get searchParams() {
      if (!this || !module2.exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }
      return utils.getSameObject(this, "searchParams", () => {
        return utils.tryWrapperForImpl(this[impl]["searchParams"]);
      });
    }
    get hash() {
      if (!this || !module2.exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }
      return this[impl]["hash"];
    }
    set hash(V) {
      if (!this || !module2.exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }
      V = conversions["USVString"](V, {context: "Failed to set the 'hash' property on 'URL': The provided value"});
      this[impl]["hash"] = V;
    }
  };
  Object.defineProperties(URL2.prototype, {
    toJSON: {enumerable: true},
    href: {enumerable: true},
    toString: {enumerable: true},
    origin: {enumerable: true},
    protocol: {enumerable: true},
    username: {enumerable: true},
    password: {enumerable: true},
    host: {enumerable: true},
    hostname: {enumerable: true},
    port: {enumerable: true},
    pathname: {enumerable: true},
    search: {enumerable: true},
    searchParams: {enumerable: true},
    hash: {enumerable: true},
    [Symbol.toStringTag]: {value: "URL", configurable: true}
  });
  var iface = {
    _mixedIntoPredicates: [],
    is(obj) {
      if (obj) {
        if (utils.hasOwn(obj, impl) && obj[impl] instanceof Impl.implementation) {
          return true;
        }
        for (const isMixedInto of module2.exports._mixedIntoPredicates) {
          if (isMixedInto(obj)) {
            return true;
          }
        }
      }
      return false;
    },
    isImpl(obj) {
      if (obj) {
        if (obj instanceof Impl.implementation) {
          return true;
        }
        const wrapper = utils.wrapperForImpl(obj);
        for (const isMixedInto of module2.exports._mixedIntoPredicates) {
          if (isMixedInto(wrapper)) {
            return true;
          }
        }
      }
      return false;
    },
    convert(obj, {context = "The provided value"} = {}) {
      if (module2.exports.is(obj)) {
        return utils.implForWrapper(obj);
      }
      throw new TypeError(`${context} is not of type 'URL'.`);
    },
    create(constructorArgs, privateData) {
      let obj = Object.create(URL2.prototype);
      obj = this.setup(obj, constructorArgs, privateData);
      return obj;
    },
    createImpl(constructorArgs, privateData) {
      let obj = Object.create(URL2.prototype);
      obj = this.setup(obj, constructorArgs, privateData);
      return utils.implForWrapper(obj);
    },
    _internalSetup(obj) {
    },
    setup(obj, constructorArgs, privateData) {
      if (!privateData)
        privateData = {};
      privateData.wrapper = obj;
      this._internalSetup(obj);
      Object.defineProperty(obj, impl, {
        value: new Impl.implementation(constructorArgs, privateData),
        configurable: true
      });
      obj[impl][utils.wrapperSymbol] = obj;
      if (Impl.init) {
        Impl.init(obj[impl], privateData);
      }
      return obj;
    },
    interface: URL2,
    expose: {
      Window: {URL: URL2},
      Worker: {URL: URL2}
    }
  };
  module2.exports = iface;
  var Impl = require_URL_impl();
});

// node_modules/whatwg-url/lib/public-api.js
var require_public_api = __commonJS((exports2) => {
  "use strict";
  exports2.URL = require_URL().interface;
  exports2.URLSearchParams = require_URLSearchParams().interface;
  exports2.parseURL = require_url_state_machine().parseURL;
  exports2.basicURLParse = require_url_state_machine().basicURLParse;
  exports2.serializeURL = require_url_state_machine().serializeURL;
  exports2.serializeHost = require_url_state_machine().serializeHost;
  exports2.serializeInteger = require_url_state_machine().serializeInteger;
  exports2.serializeURLOrigin = require_url_state_machine().serializeURLOrigin;
  exports2.setTheUsername = require_url_state_machine().setTheUsername;
  exports2.setThePassword = require_url_state_machine().setThePassword;
  exports2.cannotHaveAUsernamePasswordPort = require_url_state_machine().cannotHaveAUsernamePasswordPort;
  exports2.percentDecode = require_urlencoded().percentDecode;
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

// shim.js
var buffer = require_buffer();
var Buffer2 = buffer.Buffer;

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
function isObject(val) {
  return Boolean(val && val.type === ValueType.Object);
}
function isArray(val) {
  return Boolean(val && val.type === ValueType.Array);
}
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

// api.ts
var UserVisibleError = class extends Error {
  constructor(message, internalError) {
    super(message);
    this.isUserVisible = true;
    this.internalError = internalError;
  }
};
function isObjectPackFormula(fn) {
  return fn.resultType === Type.object;
}

// helpers/ensure.ts
function ensureUnreachable(value, message) {
  throw new Error(message || `Unreachable code hit with value ${String(value)}`);
}
function ensureExists(value, message) {
  if (typeof value === "undefined" || value === null) {
    throw new (getErrorConstructor(message))(message || `Expected value for ${String(value)}`);
  }
  return value;
}
function getErrorConstructor(message) {
  return message ? UserVisibleError : Error;
}

// helpers/object_utils.ts
function isDefined(obj) {
  return !isNil(obj);
}
function isNil(obj) {
  return typeof obj === "undefined" || obj === null;
}
function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
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

// testing/types.ts
var ParameterException = class extends Error {
};
var ResultValidationContext = class {
  constructor(contexts) {
    this.fieldContexts = contexts ? deepCopy(contexts) : [];
  }
  extendForProperty(propertyKey) {
    const newContext = {propertyKey, arrayIndices: []};
    return new ResultValidationContext([...this.fieldContexts, newContext]);
  }
  extendForIndex(arrayIndex) {
    const newContext = new ResultValidationContext(this.fieldContexts);
    const currentContext = newContext.fieldContexts[newContext.fieldContexts.length - 1];
    currentContext.arrayIndices.push(arrayIndex);
    return newContext;
  }
  generateFieldPath() {
    const fieldPath = this.fieldContexts.map((context) => this.generateFieldPathFromValidationContext(context));
    return fieldPath.join(".");
  }
  generateFieldPathFromValidationContext(context) {
    const {propertyKey, arrayIndices} = context;
    return `${propertyKey}${arrayIndices.map((idx) => `[${idx}]`)}`;
  }
};
var ResultValidationException = class extends Error {
  constructor(message, errors) {
    super(message);
    this.errors = errors;
  }
  static fromErrors(formulaName, errors) {
    const messages = errors.map((err) => err.message).join("\n");
    const message = `The following errors were found when validating the result of the formula "${formulaName}":
${messages}`;
    return new ResultValidationException(message, errors);
  }
};

// testing/validation.ts
var import_url2 = __toModule(require_public_api());

// helpers/string.ts
var EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
function isEmail(text) {
  return EMAIL_REGEX.test(text);
}

// testing/validation.ts
function validateParams(formula, args) {
  const {parameters, varargParameters} = formula;
  const numRequiredParams = parameters.filter((param) => !param.optional).length;
  if (args.length < numRequiredParams) {
    throw new ParameterException(`Expected at least ${numRequiredParams} parameter but only ${args.length} were provided.`);
  }
  if (args.length > parameters.length && !varargParameters) {
    throw new ParameterException(`Formula only accepts ${parameters.length} parameters but ${args.length} were provided.`);
  }
  const errors = [];
  for (let i = 0; i < parameters.length; i++) {
    const param = args[i];
    const paramDef = parameters[i];
    if (!paramDef.optional && !isDefined(param)) {
      errors.push({
        message: `Param ${i} "${paramDef.name}" is required but a value was not provided.`
      });
    }
  }
  if (errors.length) {
    const errorMsgs = errors.map((error) => error.message);
    throw new ParameterException(`The following parameter errors were found:
${errorMsgs.join("\n")}`);
  }
}
function validateResult(formula, result) {
  const maybeError = validateResultType(formula.resultType, result);
  if (maybeError) {
    throw ResultValidationException.fromErrors(formula.name, [maybeError]);
  }
  if (isObjectPackFormula(formula)) {
    validateObjectResult(formula, result);
  }
}
function validateResultType(resultType, result) {
  if (!isDefined(result)) {
    return {message: `Expected a ${resultType} result but got ${result}.`};
  }
  const typeOfResult = typeof result;
  switch (resultType) {
    case Type.boolean:
      return checkType(typeOfResult === "boolean", "boolean", result);
    case Type.date:
      return checkType(result instanceof Date, "date", result);
    case Type.html:
      return checkType(typeOfResult === "string", "html", result);
    case Type.image:
      return checkType(typeOfResult === "string", "image", result);
    case Type.number:
      return checkType(typeOfResult === "number", "number", result);
    case Type.object:
      return checkType(typeOfResult === "object", "object", result);
    case Type.string:
      return checkType(typeOfResult === "string", "string", result);
    default:
      return ensureUnreachable(resultType);
  }
}
function generateErrorFromValidationContext(context, schema, result) {
  const resultValue = typeof result === "string" ? `"${result}"` : result;
  const objectTrace = context.generateFieldPath();
  return {
    message: `Expected a ${schema.type} property for ${objectTrace} but got ${resultValue}.`
  };
}
function checkPropertyTypeAndCodaType(schema, result, context) {
  const errors = [generateErrorFromValidationContext(context, schema, result)];
  switch (schema.type) {
    case ValueType.Boolean: {
      const resultValidationError = checkType(typeof result === "boolean", "boolean", result);
      return resultValidationError ? errors : [];
    }
    case ValueType.Number: {
      const resultValidationError = checkType(typeof result === "number", "number", result);
      if (resultValidationError) {
        return errors;
      }
      if (!("codaType" in schema)) {
        return [];
      }
      switch (schema.codaType) {
        case ValueType.Slider:
          const sliderErrorMessage = tryParseSlider(result, schema);
          return sliderErrorMessage ? [sliderErrorMessage] : [];
        case ValueType.Scale:
          const scaleErrorMessage = tryParseScale(result, schema);
          return scaleErrorMessage ? [scaleErrorMessage] : [];
        case ValueType.Date:
        case ValueType.DateTime:
        case ValueType.Time:
        case ValueType.Percent:
        case ValueType.Currency:
        case void 0:
          return [];
        default:
          return ensureUnreachable(schema);
      }
    }
    case ValueType.String: {
      const resultValidationError = checkType(typeof result === "string", "string", result);
      if (resultValidationError) {
        return errors;
      }
      switch (schema.codaType) {
        case ValueType.Attachment:
        case ValueType.Embed:
        case ValueType.Image:
        case ValueType.ImageAttachment:
        case ValueType.Url:
          const urlErrorMessage = tryParseUrl(result, schema);
          return urlErrorMessage ? [urlErrorMessage] : [];
        case ValueType.Date:
        case ValueType.DateTime:
          const dateTimeErrorMessage = tryParseDateTimeString(result, schema);
          return dateTimeErrorMessage ? [dateTimeErrorMessage] : [];
        case ValueType.Duration:
        case ValueType.Time:
          return [];
        case ValueType.Html:
        case ValueType.Markdown:
        case void 0:
          return [];
        default:
          ensureUnreachable(schema);
      }
    }
    case ValueType.Array:
      return validateArray(result, schema, context);
    case ValueType.Object: {
      const resultValidationError = checkType(typeof result === "object", "object", result);
      if (resultValidationError) {
        return errors;
      }
      switch (schema.codaType) {
        case ValueType.Person:
          const personErrorMessage = tryParsePerson(result, schema);
          return personErrorMessage ? [personErrorMessage] : [];
        case ValueType.Reference:
        case void 0:
          return validateObject(result, schema, context);
        default:
          ensureUnreachable(schema);
      }
    }
    default:
      return ensureUnreachable(schema);
  }
}
function tryParseDateTimeString(result, schema) {
  const dateTime = result;
  if (isNaN(Date.parse(dateTime))) {
    return {message: `Failed to parse ${dateTime} as a ${schema.codaType}.`};
  }
}
function tryParseUrl(result, schema) {
  const invalidUrlError = {
    message: `Property with codaType "${schema.codaType}" must be a valid HTTP(S) url, but got "${result}".`
  };
  try {
    const url = new import_url2.URL(result);
    if (!(url.protocol === "http:" || url.protocol === "https:")) {
      return invalidUrlError;
    }
  } catch (error) {
    console.log(error.toString());
    return invalidUrlError;
  }
}
function tryParseSlider(result, schema) {
  const value = result;
  const {minimum, maximum} = schema;
  if (value < (minimum ?? 0)) {
    return {message: `Slider value ${result} is below the specified minimum value of ${minimum ?? 0}.`};
  }
  if (maximum && value > maximum) {
    return {message: `Slider value ${result} is greater than the specified maximum value of ${maximum}.`};
  }
}
function tryParseScale(result, schema) {
  const {maximum} = schema;
  const value = result;
  if (!Number.isInteger(result)) {
    return {message: `Scale value ${result} must be an integer.`};
  }
  if (value < 0) {
    return {message: `Scale value ${result} cannot be below 0.`};
  }
  if (value > maximum) {
    return {message: `Scale value ${result} is greater than the specified maximum value of ${maximum}.`};
  }
}
function tryParsePerson(result, schema) {
  const {id} = schema;
  const validId = ensureExists(id);
  const idError = checkFieldInResult(result, validId);
  if (idError) {
    return idError;
  }
  if (!isEmail(result[validId])) {
    return {message: `The id field for the person result must be an email string, but got "${result[validId]}".`};
  }
}
function checkFieldInResult(result, property) {
  if (!(property in result) || !result[property]) {
    return {
      message: `Schema declares required property "${property}" but this attribute is missing or empty.`
    };
  }
}
function checkType(typeMatches, expectedResultTypeName, result) {
  if (!typeMatches) {
    const resultValue = typeof result === "string" ? `"${result}"` : result;
    return {message: `Expected a ${expectedResultTypeName} result but got ${resultValue}.`};
  }
}
function validateObjectResult(formula, result) {
  const {schema} = formula;
  if (!schema) {
    return;
  }
  const validationContext = new ResultValidationContext();
  if (isArray(schema)) {
    const arrayValidationErrors = validateArray(result, schema, new ResultValidationContext().extendForProperty(formula.name));
    if (arrayValidationErrors.length) {
      throw ResultValidationException.fromErrors(formula.name, arrayValidationErrors);
    }
    return;
  }
  if (!isObject(schema)) {
    const error = {message: `Expected an object schema, but found ${JSON.stringify(schema)}.`};
    throw ResultValidationException.fromErrors(formula.name, [error]);
  }
  const errors = validateObject(result, schema, validationContext);
  if (errors.length) {
    throw ResultValidationException.fromErrors(formula.name, errors);
  }
}
function validateObject(result, schema, context) {
  const errors = [];
  for (const [propertyKey, propertySchema] of Object.entries(schema.properties)) {
    const value = result[propertyKey];
    if (propertySchema.required && isNil(value)) {
      errors.push({
        message: `Schema declares required property "${propertyKey}" but this attribute is missing or empty.`
      });
    }
    if (value) {
      const propertyLevelErrors = checkPropertyTypeAndCodaType(propertySchema, value, context.extendForProperty(propertyKey));
      errors.push(...propertyLevelErrors);
    }
  }
  if (schema.id && schema.id in result && !result[schema.id]) {
    errors.push({
      message: `Schema declares "${schema.id}" as an id property but an empty value was found in result.`
    });
  }
  return errors;
}
function validateArray(result, schema, context) {
  if (!Array.isArray(result)) {
    const error = {message: `Expected an ${schema.type} result but got ${result}.`};
    return [error];
  }
  const arrayItemErrors = [];
  const itemType = schema.items;
  for (let i = 0; i < result.length; i++) {
    const item = result[i];
    const propertyLevelErrors = checkPropertyTypeAndCodaType(itemType, item, context.extendForIndex(i));
    arrayItemErrors.push(...propertyLevelErrors);
  }
  return arrayItemErrors;
}

// testing/bundle_execution_helper.ts
async function executeSyncFormulaWithoutValidation(formula, params, context, maxIterations = 3) {
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
      validateParams(formula, params);
      const result = await formula.execute(params, context);
      validateResult(formula, result);
      return result;
    }
    const syncFormula = tryFindSyncFormula(manifest, formulaName);
    if (syncFormula) {
      const params = coerceParams(syncFormula, rawParams);
      validateParams(syncFormula, params);
      const result = await executeSyncFormulaWithoutValidation(syncFormula, params, context);
      validateResult(syncFormula, result);
      return result;
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
