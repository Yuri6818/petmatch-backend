// src/lib/supabase.ts
// Centralized Supabase client used across routes.

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Load environment variables from .env in development
dotenv.config();

// Validate required environment variables early
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error(
    "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment variables."
  );
}

// Export a single shared Supabase client instance
export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);