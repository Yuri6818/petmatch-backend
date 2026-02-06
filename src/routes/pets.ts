// src/routes/pets.ts
// Routes for listing and fetching pets with optional filters.

import { Router, Request, Response } from "express";
import { supabase } from "../lib/supabase";

const petsRouter = Router();

/**
 * GET /pets
 * Optional query filters:
 *   - size
 *   - energy
 *   - friendliness
 *   - temperament
 *
 * Example:
 *   /pets?size=small&energy=high
 */
petsRouter.get("/", async (req: Request, res: Response) => {
  try {
    const filters = req.query;

    let query = supabase.from("pets").select("*");

    // Apply filters dynamically based on query params
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        query = query.eq(key, value);
      }
    });

    const { data: pets, error } = await query;

    if (error) {
      console.error("Error fetching pets:", error);
      return res.status(400).json({ error: error.message });
    }

    return res.json(pets);
  } catch (error) {
    console.error("Unexpected error in GET /pets:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /pets/:id
 * Fetch a single pet by its ID.
 */
petsRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { data: pet, error } = await supabase
      .from("pets")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching pet by id:", error);
      return res.status(404).json({ error: "Pet not found" });
    }

    return res.json(pet);
  } catch (error) {
    console.error("Unexpected error in GET /pets/:id:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default petsRouter;