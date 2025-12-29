import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { connectToDb } from "./db/db.js";

connectToDb();

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World");
});

export { app };
