// src/models/saleBill.model.ts
import mongoose, { Document, Schema } from "mongoose";

interface IProduct {
  name: string;
  mfr: string;
  batch: string;
  expiry: string;
  qty: number;
  mrp: number;
  gst: number;
  disc: number;
}

export interface ISaleBill extends Document {
  location: string;
  store: string;
  consultant: string;
  patientName: string;
  mobile: string;
  age: number;
  gender: string;
  op: string;
  products: IProduct[];
  paymentMode: string;
  paymentType: string;
  note?: string;
  total: number;
  discountPercent?: number;
  discountAmount?: number;
  additionalCharges?: number;
  amountReceivable: number;
  amountReceived: number;
  due: number;
  createdAt: Date;
}

const productSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  mfr: { type: String, required: true },
  batch: { type: String, required: true },
  expiry: { type: String, required: true },
  qty: { type: Number, required: true },
  mrp: { type: Number, required: true },
  gst: { type: Number, required: true },
  disc: { type: Number, required: true },
});

const saleBillSchema = new Schema<ISaleBill>({
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

export const SaleBill = mongoose.model<ISaleBill>("SaleBill", saleBillSchema);
