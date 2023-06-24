import express from "express";
import bookRouter from "./book.routes.js"
import unitRouter from "./unit.routes.js"
import userRouter from "./user.routes.js"
import wordRouter from "./word.routes.js"
import authMiddleware from "../middleware/auth.js";

const router = express.Router();


router.use('/books', authMiddleware, bookRouter)
router.use('/units', authMiddleware, unitRouter)
router.use('/users', userRouter)
router.use('/words', authMiddleware, wordRouter)

export default router