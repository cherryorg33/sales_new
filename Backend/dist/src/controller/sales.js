"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSaleBill = exports.getSaleBillById = exports.getAllSaleBills = exports.createSaleBill = void 0;
const Sale_1 = require("../model/Sale");
const Validation_1 = require("../middleware/Validation");
const createSaleBill = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body, "getting data");
        const parsed = Validation_1.saleBillSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({
                success: false,
                message: parsed.error.errors.map((item) => item.message)
            });
        }
        const newSaleBill = new Sale_1.SaleBill(parsed.data);
        yield newSaleBill.save();
        res.status(201).json({
            message: "SaleBill created successfully",
            saleBill: newSaleBill,
        });
    }
    catch (error) {
        console.error("Error creating sale bill:", error);
        res.status(500).json({
            message: "An error occurred while creating the sale bill",
            error: error.message,
        });
    }
});
exports.createSaleBill = createSaleBill;
const getAllSaleBills = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = 1, limit = 10, search = '', startDate, endDate } = _req.query;
        console.log(_req.query, "query params");
        // Convert page and limit to numbers
        const pageNumber = parseInt(page, 10) || 1;
        const pageLimit = parseInt(limit, 10) || 10;
        const filterConditions = {};
        if (search) {
            filterConditions.$or = [
                { patientName: { $regex: search, $options: 'i' } },
                { consultant: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } },
                { store: { $regex: search, $options: 'i' } },
            ];
        }
        if (startDate && endDate) {
            filterConditions.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            };
        }
        const totalSaleBills = yield Sale_1.SaleBill.countDocuments(filterConditions);
        const saleBills = yield Sale_1.SaleBill.find(filterConditions)
            .skip((pageNumber - 1) * pageLimit)
            .limit(pageLimit)
            .sort({ createdAt: -1 });
        const totalPages = Math.ceil(totalSaleBills / pageLimit);
        if (saleBills.length > 0) {
            res.json({
                saleBills,
                pagination: {
                    page: pageNumber,
                    totalPages,
                    totalRecords: totalSaleBills,
                    limit: pageLimit,
                },
            });
        }
        else {
            res.status(404).json({
                message: 'No sales available',
            });
        }
    }
    catch (error) {
        console.error('Error fetching sale bills:', error);
        res.status(500).json({
            message: 'An error occurred while fetching sale bills',
            error: error.message,
        });
    }
});
exports.getAllSaleBills = getAllSaleBills;
const getSaleBillById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const saleBill = yield Sale_1.SaleBill.findById(req.params.id);
        if (!saleBill) {
            return res.status(404).json({ message: "SaleBill not found" });
        }
        res.json(saleBill);
    }
    catch (error) {
        console.error("Error fetching sale bill by ID:", error);
        res.status(500).json({
            message: "An error occurred while fetching the sale bill",
            error: error.message,
        });
    }
});
exports.getSaleBillById = getSaleBillById;
const deleteSaleBill = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const saleBill = yield Sale_1.SaleBill.findByIdAndDelete(req.params.id);
        if (!saleBill) {
            return res.status(404).json({ message: "SaleBill not found" });
        }
        res.json({ message: "Deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting sale bill:", error);
        res.status(500).json({
            message: "An error occurred while deleting the sale bill",
            error: error.message,
        });
    }
});
exports.deleteSaleBill = deleteSaleBill;
