import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export interface RepoRow {
  id: string;
  owner: string;
  name: string;
  full_name: string;
  description: string | null;
  language: string | null;
  stars: number | null;
  last_analyzed_at: string | null;
  created_at: string;
}

export interface RepoInsert {
  owner: string;
  name: string;
  full_name: string;
  description: string | null;
  language: string | null;
  stars: number;
  last_analyzed_at: string;
}

export interface ReportRow {
  id: string;
  repo_id: string;
  health_grade: string | null;
  activity_assessment: string | null;
  top_concerns: unknown;
  suggested_priorities: unknown;
  raw_data: unknown;
  ai_summary: string | null;
  generated_at: string;
}

export interface ReportInsert {
  repo_id: string;
  health_grade: string | null;
  activity_assessment: string | null;
  top_concerns: unknown;
  suggested_priorities: unknown;
  raw_data: unknown;
  ai_summary: string | null;
}

export type ServerSupabaseClient = SupabaseClient;

export function createServerClient(): ServerSupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set");
  }
  if (!serviceKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  }
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
