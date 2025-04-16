import { z } from "zod";

const productSchema = z.object({
  name: z.string({ required_error: "Product name is required" }).nonempty("Product name cannot be empty"),
  mfr: z.string({ required_error: "Manufacturer is required" }).nonempty("Manufacturer cannot be empty"),
  batch: z.string({ required_error: "Batch is required" }).nonempty("Batch cannot be empty"),
  expiry: z.string({ required_error: "Expiry date is required" }).nonempty("Expiry cannot be empty"),
  qty: z.number({ required_error: "Quantity is required", invalid_type_error: "Quantity must be a number" }),
  mrp: z.number({ required_error: "MRP is required", invalid_type_error: "MRP must be a number" }),
  gst: z.number({ required_error: "GST is required", invalid_type_error: "GST must be a number" }),
  disc: z.number({ required_error: "Discount is required", invalid_type_error: "Discount must be a number" }),
});

export const saleBillSchema = z.object({
  location: z.string({ required_error: "Location is required" }).nonempty("Location cannot be empty"),
  store: z.string({ required_error: "Store is required" }).nonempty("Store cannot be empty"),
  consultant: z.string({ required_error: "Consultant is required" }).nonempty("Consultant cannot be empty"),
  patientName: z.string({ required_error: "Patient name is required" }).nonempty("Patient name cannot be empty"),
  mobile: z.string({ required_error: "Mobile number is required" }).nonempty("Mobile number cannot be empty"),
  age: z.number({ required_error: "Age is required", invalid_type_error: "Age must be a number" }),
  gender: z.string({ required_error: "Gender is required" }).nonempty("Gender cannot be empty"),
  op: z.string({ required_error: "OP number is required" }).nonempty("OP cannot be empty"),
  products: z.array(productSchema, { required_error: "At least one product is required" }).min(1, "Add at least one product"),
  paymentMode: z.string({ required_error: "Payment mode is required" }).nonempty("Payment mode cannot be empty"),
  paymentType: z.string({ required_error: "Payment type is required" }).nonempty("Payment type cannot be empty"),
  note: z.string().optional(),
  total: z.number({ required_error: "Total amount is required", invalid_type_error: "Total must be a number" }),
  discountPercent: z.number({ invalid_type_error: "Discount percent must be a number" }).optional(),
  discountAmount: z.number({ invalid_type_error: "Discount amount must be a number" }).optional(),
  additionalCharges: z.number({ invalid_type_error: "Additional charges must be a number" }).optional(),
  amountReceivable: z.number({ required_error: "Amount receivable is required", invalid_type_error: "Amount receivable must be a number" }),
  amountReceived: z.number({ required_error: "Amount received is required", invalid_type_error: "Amount received must be a number" }),
  due: z.number({ required_error: "Due amount is required", invalid_type_error: "Due must be a number" }),
});
