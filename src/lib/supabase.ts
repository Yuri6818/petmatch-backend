// src/lib/supabase.ts
// Centralized Supabase client used across all route files.

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Load environment variables from .env (development only)
dotenv.config();

// Extract required environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validate environment variables early to avoid silent failures
if (!supabaseUrl) {
  throw new Error("Missing SUPABASE_URL in environment variables.");
}

if (!supabaseServiceRoleKey) {
  throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY in environment variables.");
}

/**
 * Create and export a single shared Supabase client instance.
 *
 * NOTE:
 * - We use the SERVICE ROLE KEY here because this backend runs trusted server-side code.
 * - Never expose the service role key to the frontend.
 */
export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);