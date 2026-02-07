// src/index.ts
// Main Express server entry point for the PetMatch backend.

import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

// Route imports
import petsRouter from "./routes/pets";
import favoritesRouter from "./routes/favorites";
import adoptionRouter from "./routes/adoption";
import tagsRouter from "./routes/tags";

// Load environment variables
dotenv.config();

const app = express();

// Parse JSON request bodies
app.use(express.json());

// Enable CORS (you can later restrict this to your frontend domain)
app.use(
  cors({
    origin: "*",
  })
);

/**
 * Health check / root route
 * Used by hosting platforms and quick status checks.
 */
app.get("/", (_req: Request, res: Response) => {
  res.send("PetMatch Backend is running 🐾");
});

// Mount feature routes
app.use("/pets", petsRouter);
app.use("/favorites", favoritesRouter);
app.use("/adoption", adoptionRouter);
app.use("/tags", tagsRouter);

// Use PORT from environment or fallback to 3000
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});