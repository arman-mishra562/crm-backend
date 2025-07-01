"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUserId = generateUserId;
const uuid_1 = require("uuid");
function generateUserId() {
    const suffix = (0, uuid_1.v4)().replace(/-/g, '').slice(0, 6).toUpperCase();
    return `${process.env.USERID_PREFIX}${suffix}`;
}
