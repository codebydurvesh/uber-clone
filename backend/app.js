import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { router as userRoutes } from "./routes/user.route.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/users", userRoutes);

export { app };
