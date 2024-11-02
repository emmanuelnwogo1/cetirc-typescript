import { Router } from "express";
import verifyToken from "../middlewares/authMiddleware";
import { getWithdrawCodeController } from "../controllers/withdrawCodeController";

const router = Router();

router.get("/withdraw-code", verifyToken, getWithdrawCodeController);

export default router;
