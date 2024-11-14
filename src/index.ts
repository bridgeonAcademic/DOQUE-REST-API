import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import authRoutes from "./routes/authRoutes";
import spaceRoutes from "./routes/spaceRoutes";
import listRoutes from "./routes/listRoutes";
import adminRoutes from "./routes/admin/adminRoutes";

const app = express();

dotenv.config();

const port = process.env.PORT || 3001;

app.use(express.json());

app.get("/", (_req, res) => {
	res.send("Hello World!");
});

app.use("/auth", authRoutes);
app.use("/space", spaceRoutes);
app.use("/space", listRoutes);
app.use("/admin", adminRoutes);
app.use(globalErrorHandler);

mongoose
	.connect(process.env.MONGO_URI || "")
	.then(() => {
		app.listen(port, () => {
			console.log(`Server is running on port ${port}`);
		});
	})
	.catch((err) => {
		console.error(err);
	});
