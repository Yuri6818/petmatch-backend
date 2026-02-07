// src/routes/tags.ts
// Routes for managing tags and assigning them to pets.

import { Router, Request, Response } from "express";
import { supabase } from "../lib/supabase";

const tagsRouter = Router();

/**
 * GET /tags
 * Fetch all available tags.
 */
tagsRouter.get("/", async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase.from("tags").select("*");

    if (error) {
      console.error("Error fetching tags:", error);
      return res.status(400).json({ error: error.message });
    }

    return res.json(data);
  } catch (error) {
    console.error("Unexpected error in GET /tags:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * POST /tags
 * Create a new tag.
 *
 * Body:
 *   - name: string
 */
tagsRouter.post("/", async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Tag name is required." });
    }

    const { data, error } = await supabase
      .from("tags")
      .insert({ name })
      .select("*")
      .single();

    if (error) {
      console.error("Error creating tag:", error);
      return res.status(400).json({ error: error.message });
    }

    return res.status(201).json(data);
  } catch (error) {
    console.error("Unexpected error in POST /tags:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * POST /tags/assign
 * Assign a tag to a pet.
 *
 * Body:
 *   - pet_id: string
 *   - tag_id: string
 */
tagsRouter.post("/assign", async (req: Request, res: Response) => {
  try {
    const { pet_id, tag_id } = req.body;

    if (!pet_id || !tag_id) {
      return res.status(400).json({
        error: "pet_id and tag_id are required.",
      });
    }

    const { data, error } = await supabase
      .from("pet_tags")
      .insert({ pet_id, tag_id })
      .select("*")
      .single();

    if (error) {
      console.error("Error assigning tag:", error);
      return res.status(400).json({ error: error.message });
    }

    return res.status(201).json(data);
  } catch (error) {
    console.error("Unexpected error in POST /tags/assign:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /tags/pet/:petId
 * Fetch all tags assigned to a specific pet.
 */
tagsRouter.get("/pet/:petId", async (req: Request, res: Response) => {
  try {
    const { petId } = req.params;

    const { data, error } = await supabase
      .from("pet_tags")
      .select("id, pet_id, tag_id, tags(*)")
      .eq("pet_id", petId);

    if (error) {
      console.error("Error fetching pet tags:", error);
      return res.status(400).json({ error: error.message });
    }

    return res.json(data);
  } catch (error) {
    console.error("Unexpected error in GET /tags/pet/:petId:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default tagsRouter;