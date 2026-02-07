// src/routes/favorites.ts
// Routes for managing user favorites: add, list, delete, and update notes.

import { Router, Request, Response } from "express";
import { supabase } from "../lib/supabase";

const favoritesRouter = Router();

/**
 * POST /favorites
 * Add a pet to a user's favorites.
 *
 * Body:
 *   - user_id: string
 *   - pet_id: string (UUID referencing pets.id)
 *   - note?: string (optional)
 */
favoritesRouter.post("/", async (req: Request, res: Response) => {
  try {
    const { user_id, pet_id, note } = req.body;

    // Validate required fields
    if (!user_id || !pet_id) {
      return res.status(400).json({
        error: "user_id and pet_id are required fields.",
      });
    }

    // Insert favorite
    const { data, error } = await supabase
      .from("favorites")
      .insert({ user_id, pet_id, note })
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
 * Includes joined pet data for easy frontend display.
 */
favoritesRouter.get("/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const { data: favorites, error } = await supabase
      .from("favorites")
      .select("id, user_id, pet_id, note, created_at, pets(*)")
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

/**
 * DELETE /favorites/:id
 * Remove a favorite by its ID.
 */
favoritesRouter.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting favorite:", error);
      return res.status(400).json({ error: error.message });
    }

    return res.json({ message: "Favorite removed successfully." });
  } catch (error) {
    console.error("Unexpected error in DELETE /favorites/:id:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * PATCH /favorites/:id
 * Update the note on a favorite.
 *
 * Body:
 *   - note: string
 */
favoritesRouter.patch("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { note } = req.body;

    const { data, error } = await supabase
      .from("favorites")
      .update({ note })
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      console.error("Error updating favorite note:", error);
      return res.status(400).json({ error: error.message });
    }

    return res.json(data);
  } catch (error) {
    console.error("Unexpected error in PATCH /favorites/:id:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default favoritesRouter;