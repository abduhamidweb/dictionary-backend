import express from "express";
import authMiddleware from "../middleware/auth.js";
import startContr from "../controllers/start.contr.js";
const router = express.Router();
router.post('/', authMiddleware, startContr.start.bind(startContr));
export default router;
