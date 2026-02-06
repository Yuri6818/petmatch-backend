// src/index.ts
// Main Express server entry point for the PetMatch backend.

import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

import petsRouter from "./routes/pets";
import favoritesRouter from "./routes/favorites";

// Load environment variables
dotenv.config();

const app = express();

// Allow JSON request bodies
app.use(express.json());

// Enable CORS so Blitz's frontend can call this API
app.use(
  cors({
    origin: "*", // You can later restrict this to his frontend URL
  })
);

// Health check / root route
app.get("/", (req: Request, res: Response) => {
  res.send("PetMatch Backend is running 🐾");
});

// Mount feature routes
app.use("/pets", petsRouter);
app.use("/favorites", favoritesRouter);

// Use PORT from env or default to 3000
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});