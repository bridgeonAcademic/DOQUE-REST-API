import dotenv from "dotenv";
import express from "express";

const app = express();

dotenv.config();

const port = process.env.PORT || 3001;

app.use(express.json());

app.get("/", (_req, res) => {
	res.send("Hello World!");
});

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
