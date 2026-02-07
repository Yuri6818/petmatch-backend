// src/routes/pets.ts
// All routes related to pets: creation, listing, filtering, updating,
// deleting, fetching by ID, recently added pets, featured pet,
// and pet image galleries.

import { Router, Request, Response } from "express";
import { supabase } from "../lib/supabase";

const petsRouter = Router();

/**
 * POST /pets
 * Create a new pet.
 */
petsRouter.post("/", async (req: Request, res: Response) => {
  try {
    const petData = req.body;

    if (!petData.name || !petData.size || !petData.energy) {
      return res.status(400).json({
        error: "name, size, and energy are required fields.",
      });
    }

    const { data, error } = await supabase
      .from("pets")
      .insert(petData)
      .select("*")
      .single();

    if (error) {
      console.error("Error creating pet:", error);
      return res.status(400).json({ error: error.message });
    }

    return res.status(201).json(data);
  } catch (error) {
    console.error("Unexpected error in POST /pets:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * PATCH /pets/:id
 * Update an existing pet.
 */
petsRouter.patch("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const { data, error } = await supabase
      .from("pets")
      .update(updates)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      console.error("Error updating pet:", error);
      return res.status(400).json({ error: error.message });
    }

    return res.json(data);
  } catch (error) {
    console.error("Unexpected error in PATCH /pets/:id:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * DELETE /pets/:id
 * Remove a pet from the database.
 */
petsRouter.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("pets")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting pet:", error);
      return res.status(400).json({ error: error.message });
    }

    return res.json({ message: "Pet deleted successfully." });
  } catch (error) {
    console.error("Unexpected error in DELETE /pets/:id:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /pets
 * Fetch all pets with optional filters, search, sorting, age ranges, and pagination.
 */
petsRouter.get("/", async (req: Request, res: Response) => {
  try {
    const {
      search,
      sort = "name",
      order = "asc",
      minAge,
      maxAge,
      page = "1",
      limit = "20",
      ...filters
    } = req.query;

    const pageNumber = Math.max(1, parseInt(page as string, 10));
    const limitNumber = Math.max(1, parseInt(limit as string, 10));
    const offset = (pageNumber - 1) * limitNumber;

    let query = supabase.from("pets").select("*", { count: "exact" });

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        query = query.eq(key, value);
      }
    });

    if (search) {
      query = query.ilike("name", `%${search}%`);
    }

    if (minAge) query = query.gte("age", Number(minAge));
    if (maxAge) query = query.lte("age", Number(maxAge));

    query = query.order(sort as string, {
      ascending: order === "asc",
    });

    query = query.range(offset, offset + limitNumber - 1);

    const { data: pets, count, error } = await query;

    if (error) {
      console.error("Error fetching pets:", error);
      return res.status(400).json({ error: error.message });
    }

    return res.json({
      page: pageNumber,
      limit: limitNumber,
      total: count,
      totalPages: count ? Math.ceil(count / limitNumber) : 1,
      pets,
    });
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

/**
 * GET /pets/recent
 * Returns the 10 most recently added pets.
 */
petsRouter.get("/recent", async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from("pets")
      .select("*")
      .order("id", { ascending: false })
      .limit(10);

    if (error) {
      console.error("Error fetching recent pets:", error);
      return res.status(400).json({ error: error.message });
    }

    return res.json(data);
  } catch (error) {
    console.error("Unexpected error in GET /pets/recent:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /pets/featured
 * Returns a "Pet of the Day" based on a date hash.
 */
petsRouter.get("/featured", async (_req: Request, res: Response) => {
  try {
    const { data: pets, error } = await supabase
      .from("pets")
      .select("*");

    if (error) {
      console.error("Error fetching pets for featured:", error);
      return res.status(400).json({ error: error.message });
    }

    if (!pets || pets.length === 0) {
      return res.json(null);
    }

    const today = new Date().toISOString().slice(0, 10);
    const hash = [...today].reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const index = hash % pets.length;

    return res.json(pets[index]);
  } catch (error) {
    console.error("Unexpected error in GET /pets/featured:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /pets/:id/images
 * Returns all images for a specific pet.
 */
petsRouter.get("/:id/images", async (req: Request, res: Response) => {
  try {
    const { id: petId } = req.params;

    const { data: images, error } = await supabase
      .from("pet_images")
      .select("*")
      .eq("pet_id", petId);

    if (error) {
      console.error("Error fetching pet images:", error);
      return res.status(400).json({ error: error.message });
    }

    return res.json(images);
  } catch (error) {
    console.error("Unexpected error in GET /pets/:id/images:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * POST /pets/:id/images
 * Add a new image to a pet.
 */
petsRouter.post("/:id/images", async (req: Request, res: Response) => {
  try {
    const { id: petId } = req.params;
    const { image_url } = req.body;

    if (!image_url) {
      return res.status(400).json({ error: "image_url is required" });
    }

    const { data, error } = await supabase
      .from("pet_images")
      .insert({ pet_id: petId, image_url })
      .select("*")
      .single();

    if (error) {
      console.error("Error inserting pet image:", error);
      return res.status(400).json({ error: error.message });
    }

    return res.status(201).json(data);
  } catch (error) {
    console.error("Unexpected error in POST /pets/:id/images:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default petsRouter;