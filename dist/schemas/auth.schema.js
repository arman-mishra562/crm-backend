"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAccountSchema = exports.linkProfilePicSchema = exports.resendSchema = exports.verifySchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required'),
    email: zod_1.z.string().email('Invalid email'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
});
exports.verifySchema = zod_1.z.object({
    token: zod_1.z.string().nonempty('Token is required'),
});
exports.resendSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email'),
});
exports.linkProfilePicSchema = zod_1.z.object({
    key: zod_1.z.string().min(1, 'Media key is required'),
});
exports.deleteAccountSchema = zod_1.z.object({
    password: zod_1.z.string().min(1, 'Password confirmation is required'),
});
