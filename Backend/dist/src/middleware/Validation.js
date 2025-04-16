"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saleBillSchema = void 0;
const zod_1 = require("zod");
const productSchema = zod_1.z.object({
    name: zod_1.z.string({ required_error: "Product name is required" }).nonempty("Product name cannot be empty"),
    mfr: zod_1.z.string({ required_error: "Manufacturer is required" }).nonempty("Manufacturer cannot be empty"),
    batch: zod_1.z.string({ required_error: "Batch is required" }).nonempty("Batch cannot be empty"),
    expiry: zod_1.z.string({ required_error: "Expiry date is required" }).nonempty("Expiry cannot be empty"),
    qty: zod_1.z.number({ required_error: "Quantity is required", invalid_type_error: "Quantity must be a number" }),
    mrp: zod_1.z.number({ required_error: "MRP is required", invalid_type_error: "MRP must be a number" }),
    gst: zod_1.z.number({ required_error: "GST is required", invalid_type_error: "GST must be a number" }),
    disc: zod_1.z.number({ required_error: "Discount is required", invalid_type_error: "Discount must be a number" }),
});
exports.saleBillSchema = zod_1.z.object({
    location: zod_1.z.string({ required_error: "Location is required" }).nonempty("Location cannot be empty"),
    store: zod_1.z.string({ required_error: "Store is required" }).nonempty("Store cannot be empty"),
    consultant: zod_1.z.string({ required_error: "Consultant is required" }).nonempty("Consultant cannot be empty"),
    patientName: zod_1.z.string({ required_error: "Patient name is required" }).nonempty("Patient name cannot be empty"),
    mobile: zod_1.z.string({ required_error: "Mobile number is required" }).nonempty("Mobile number cannot be empty"),
    age: zod_1.z.number({ required_error: "Age is required", invalid_type_error: "Age must be a number" }),
    gender: zod_1.z.string({ required_error: "Gender is required" }).nonempty("Gender cannot be empty"),
    op: zod_1.z.string({ required_error: "OP number is required" }).nonempty("OP cannot be empty"),
    products: zod_1.z.array(productSchema, { required_error: "At least one product is required" }).min(1, "Add at least one product"),
    paymentMode: zod_1.z.string({ required_error: "Payment mode is required" }).nonempty("Payment mode cannot be empty"),
    paymentType: zod_1.z.string({ required_error: "Payment type is required" }).nonempty("Payment type cannot be empty"),
    note: zod_1.z.string().optional(),
    total: zod_1.z.number({ required_error: "Total amount is required", invalid_type_error: "Total must be a number" }),
    discountPercent: zod_1.z.number({ invalid_type_error: "Discount percent must be a number" }).optional(),
    discountAmount: zod_1.z.number({ invalid_type_error: "Discount amount must be a number" }).optional(),
    additionalCharges: zod_1.z.number({ invalid_type_error: "Additional charges must be a number" }).optional(),
    amountReceivable: zod_1.z.number({ required_error: "Amount receivable is required", invalid_type_error: "Amount receivable must be a number" }),
    amountReceived: zod_1.z.number({ required_error: "Amount received is required", invalid_type_error: "Amount received must be a number" }),
    due: zod_1.z.number({ required_error: "Due amount is required", invalid_type_error: "Due must be a number" }),
});
