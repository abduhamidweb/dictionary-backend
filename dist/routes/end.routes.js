import express from "express";
import endContr from "../controllers/end.contr.js";
const router = express.Router();
router.post('/', endContr.end.bind(endContr));
export default router;
