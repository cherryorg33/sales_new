import { Request, Response } from "express";
import { SaleBill } from "../model/Sale";
import { saleBillSchema } from "../middleware/Validation";

export const createSaleBill = async (req: Request, res: Response) => {
  try {
    console.log(req.body , "getting data")
    const parsed = saleBillSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success:false,
        message: parsed.error.errors.map((item) => item.message)
      })
    }

    const newSaleBill = new SaleBill(parsed.data);
    await newSaleBill.save();
    res.status(201).json({
      message: "SaleBill created successfully",
      saleBill: newSaleBill,
    });
  } catch (error:any) {
    console.error("Error creating sale bill:", error);
    res.status(500).json({
      message: "An error occurred while creating the sale bill",
      error: error.message,
    });
  }
};



export const getAllSaleBills = async (_req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, search = '', startDate, endDate } = _req.query;

    console.log(_req.query  , "query params")
    // Convert page and limit to numbers

    const pageNumber = parseInt(page as string, 10) || 1;
    const pageLimit = parseInt(limit as string, 10) || 10;

    const filterConditions: any = {};

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
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string),
      };
    }

    const totalSaleBills = await SaleBill.countDocuments(filterConditions);

    const saleBills = await SaleBill.find(filterConditions)
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
    } else {
      res.status(404).json({
        message: 'No sales available',
      });
    }
  } catch (error: any) {
    console.error('Error fetching sale bills:', error);
    res.status(500).json({
      message: 'An error occurred while fetching sale bills',
      error: error.message,
    });
  }
};



export const getSaleBillById = async (req: Request, res: Response) => {
  try {
    const saleBill = await SaleBill.findById(req.params.id);
    if (!saleBill) {
      return res.status(404).json({ message: "SaleBill not found" });
    }
    res.json(saleBill);
  } catch (error:any) {
    console.error("Error fetching sale bill by ID:", error);
    res.status(500).json({
      message: "An error occurred while fetching the sale bill",
      error: error.message,
    });
  }
};

export const deleteSaleBill = async (req: Request, res: Response) => {
  try {
    const saleBill = await SaleBill.findByIdAndDelete(req.params.id);
    if (!saleBill) {
      return res.status(404).json({ message: "SaleBill not found" });
    }
    res.json({ message: "Deleted successfully" });
  } catch (error:any) {
    console.error("Error deleting sale bill:", error);
    res.status(500).json({
      message: "An error occurred while deleting the sale bill",
      error: error.message,
    });
  }
};
