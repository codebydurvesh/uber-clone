import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { router as userRoutes } from "./routes/user.route.js";
import { router as captianRoutes } from "./routes/captain.route.js";
import { router as mapsRoutes } from "./routes/maps.route.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/users", userRoutes);

app.use("/captains", captianRoutes);

// Maps routes for location services (OSM + OpenRouteService)
app.use("/maps", mapsRoutes);

export { app };
