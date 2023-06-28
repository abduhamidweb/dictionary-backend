import "../db/mongo.js";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import path from "path";
import usersRouter from "../routes/users.router.js";
import indexRouter from "../routes/index.routes.js";
import errorMiddleware from "../middleware/errorHandler.js";
import swaggerRouter from "../utils/swagger.js";

const app: Application = express();
const PORT: number = Number(process.env.PORT) || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(process.cwd(), "src", "public")));
app.use("/api/docs", swaggerRouter);
app.use("/api", usersRouter);
app.use("/api", indexRouter);

app.get("/api", async (req: Request, res: Response) => {
    try {
        res.status(200).json({
            success: true,
            message: "Welcome to the CodeCrafters campaign API",
            postmen: "https://documenter.getpostman.com/view/24139682/2s93si1pwE",
        });
    } catch (error: unknown) {
        res.status(500).json({ success: false, error: (error as Error).message });
    }
});

app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log("Server listening on port " + PORT);
});
