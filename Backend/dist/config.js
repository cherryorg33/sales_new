"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config_Url = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.Config_Url = {
    PORT: process.env.PORT || 3000,
    MONGO_URL: process.env.MONGO_URL ||
        "mongodb+srv://ram:CyIRTMS6gYYdtBmt@cluster0.vtoa4.mongodb.net/sales",
    JWT_SECRET: process.env.JWT_SECREAT || "your_secret_key",
    EMAIL_USER: process.env.EMAIL_USER || "talariramcharan33@gmail.com",
    EMAIL_PASS: process.env.EMAIL_PASS || "amdq mqmf zmuk mbxt",
    EMAIL_SERVICE: process.env.EMAIL_SERVICE || "gmail",
    EMAIL_PORT: process.env.EMAIL_PORT || 587,
    EMAIL_HOST: process.env.EMAIL_HOST || "smtp.gmail.com",
};
