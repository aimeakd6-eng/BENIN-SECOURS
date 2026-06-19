import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = "https://yjoyalkuxobdemmrralj.supabase.co";
export const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlqb3lhbGt1eG9iZGVtbXJyYWxqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4NTcwOTEsImV4cCI6MjA5NDQzMzA5MX0.s6abWuYHmq2Za_2LnJypGjtqyqPAF4t9MpQxGLoW4dk";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
