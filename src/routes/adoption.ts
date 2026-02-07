// src/routes/adoption.ts
// Routes for submitting and retrieving adoption requests.

import { Router, Request, Response } from "express";
import { supabase } from "../lib/supabase";

const adoptionRouter = Router();

/**
 * POST /adoption
 * Submit a new adoption request.
 *
 * Body:
 *   - user_id: string
 *   - pet_id: string (UUID)
 *   - message?: string
 */
adoptionRouter.post("/", async (req: Request, res: Response) => {
  try {
    const { user_id, pet_id, message } = req.body;

    // Validate required fields
    if (!user_id || !pet_id) {
      return res.status(400).json({
        error: "user_id and pet_id are required fields.",
      });
    }

    // Insert adoption request
    const { data, error } = await supabase
      .from("adoption_requests")
      .insert({
        user_id,
        pet_id,
        message,
        status: "pending", // default status
      })
      .select("*")
      .single();

    if (error) {
      console.error("Error submitting adoption request:", error);
      return res.status(400).json({ error: error.message });
    }

    return res.status(201).json(data);
  } catch (error) {
    console.error("Unexpected error in POST /adoption:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /adoption/:userId
 * Fetch all adoption requests for a specific user.
 * Includes joined pet data for easy frontend display.
 */
adoptionRouter.get("/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const { data, error } = await supabase
      .from("adoption_requests")
      .select("id, user_id, pet_id, message, status, created_at, pets(*)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching adoption requests:", error);
      return res.status(400).json({ error: error.message });
    }

    return res.json(data);
  } catch (error) {
    console.error("Unexpected error in GET /adoption/:userId:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default adoptionRouter;