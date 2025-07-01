"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const verify_transporter = nodemailer_1.default.createTransport({
    host: 'smtp.hostinger.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.SMTP_VERIFY_USER,
        pass: process.env.SMTP_VERIFY_PASS
    }
});
exports.default = verify_transporter;
