import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorMiddleware from './middlewares/error.middleware.js'

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());


import authRouter from "./routes/auth.route.js";
import documentRouter from "./routes/document.route.js";
import adminRouter from "./routes/admin.route.js";
import modRouter from "./routes/mod.route.js";
import complaintRouter from "./routes/complaint.route.js";
import analyticsRouter from "./routes/analytics.route.js";
import noticeRouter from "./routes/notice.route.js";
import financeRouter from "./routes/finance.route.js"; // NEW
import seedRouter from "./routes/seed.route.js";
import { isVerified } from "./middlewares/auth.middleware.js";

app.use("/api/v3/auth", authRouter); 
app.use("/api/v3/seed", seedRouter);

app.use(isVerified); 
app.use("/api/v3/documents", documentRouter);
app.use("/api/v3/complaints", complaintRouter);
app.use("/api/v3/notices", noticeRouter);
app.use("/api/v3/analytics", analyticsRouter);
app.use("/api/v3/finance", financeRouter);
app.use("/api/v3/admin", adminRouter);
app.use("/api/v3/mod", modRouter);

app.use(errorMiddleware);
export { app };