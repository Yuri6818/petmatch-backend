// src/routes/favorites.ts
// Routes for saving and retrieving user favorite pets.

import { Router, Request, Response } from "express";
import { supabase } from "../lib/supabase";

const favoritesRouter = Router();

/**
 * POST /favorites
 * Body:
 *   - userId: string
 *   - petId: string (UUID referencing pets.id)
 */
favoritesRouter.post("/", async (req: Request, res: Response) => {
  try {
    const { userId, petId } = req.body;

    if (!userId || !petId) {
      return res
        .status(400)
        .json({ error: "userId and petId are required fields." });
    }

    const { data, error } = await supabase
      .from("favorites")
      .insert({ user_id: userId, pet_id: petId })
      .select("*")
      .single();

    if (error) {
      console.error("Error inserting favorite:", error);
      return res.status(400).json({ error: error.message });
    }

    return res.status(201).json(data);
  } catch (error) {
    console.error("Unexpected error in POST /favorites:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /favorites/:userId
 * Fetch all favorites for a given user.
 * Includes joined pet data.
 */
favoritesRouter.get("/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const { data: favorites, error } = await supabase
      .from("favorites")
      .select("id, user_id, pet_id, pets(*)")
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching favorites:", error);
      return res.status(400).json({ error: error.message });
    }

    return res.json(favorites);
  } catch (error) {
    console.error("Unexpected error in GET /favorites/:userId:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default favoritesRouter;