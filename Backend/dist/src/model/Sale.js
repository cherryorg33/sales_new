"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaleBill = void 0;
// src/models/saleBill.model.ts
const mongoose_1 = __importStar(require("mongoose"));
const productSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    mfr: { type: String, required: true },
    batch: { type: String, required: true },
    expiry: { type: String, required: true },
    qty: { type: Number, required: true },
    mrp: { type: Number, required: true },
    gst: { type: Number, required: true },
    disc: { type: Number, required: true },
});
const saleBillSchema = new mongoose_1.Schema({
    location: { type: String, required: true },
    store: { type: String, required: true },
    consultant: { type: String, required: true },
    patientName: { type: String, required: true },
    mobile: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    op: { type: String, required: true },
    products: { type: [productSchema], required: true },
    paymentMode: { type: String, required: true },
    paymentType: { type: String, required: true },
    note: String,
    total: { type: Number, required: true },
    discountPercent: Number,
    discountAmount: Number,
    additionalCharges: Number,
    amountReceivable: { type: Number, required: true },
    amountReceived: { type: Number, required: true },
    due: { type: Number, required: true },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
exports.SaleBill = mongoose_1.default.model("SaleBill", saleBillSchema);
