import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Route Imports
import authRouter from "./routes/auth.route.js";
import documentRouter from "./routes/document.route.js";
import adminRouter from "./routes/admin.route.js";
import complaintRouter from "./routes/complaint.route.js";
import analyticsRouter from "./routes/analytics.route.js";
import seedRouter from './routes/seed.route.js'

// Route Declarations
app.use("/api/v2/auth", authRouter);
app.use("/api/v2/documents", documentRouter);
app.use("/api/v2/admin", adminRouter); // Combines admin/mod/hr employee logic
app.use("/api/v2/complaints", complaintRouter);
app.use("/api/v2/analytics", analyticsRouter);
app.use('/api/v2/seed',seedRouter)

export { app };