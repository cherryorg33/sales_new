import { Router } from "express";
import {
  createSaleBill,
  getAllSaleBills,
  getSaleBillById,
  deleteSaleBill
} from "../controller/sales";
import { asyncHandler } from "../middleware/AsyncHandler";


const router = Router();

router.post("/", asyncHandler(createSaleBill));
router.get("/", asyncHandler(getAllSaleBills));
router.get("/:id", asyncHandler(getSaleBillById));
router.delete("/:id", asyncHandler(deleteSaleBill));

export default router;
