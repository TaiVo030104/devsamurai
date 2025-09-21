import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes/auth.route";

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/api", router);

export default app;