"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEmail = void 0;
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
function isEmail(text) {
    return EMAIL_REGEX.test(text);
}
exports.isEmail = isEmail;
