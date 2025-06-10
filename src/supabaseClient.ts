/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

// Add type declaration for Vite's import.meta.env
interface ImportMetaEnv {
  VITE_SUPABASE_URL: string;
  VITE_SUPABASE_ANON_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Supabase environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;

// Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type for answers object
type Answers = Record<string, any>;

/**
 * Updates the answers for an existing ticket in the 'ticket_table'.
 * @param ticket_number - Unique 4-digit ticket number as a number.
 * @param exhibition_id - ID of the exhibition (e.g., "Our Nature").
 * @param answers - Object containing quiz answers.
 * @returns true if successful, false otherwise.
 */
export async function saveAnswers(
  ticket_number: number,
  exhibition_id: string,
  answers: Answers
): Promise<boolean> {
  if (!ticket_number || !answers || !exhibition_id) {
    console.warn("Missing required fields.");
    return false;
  }

  try {
    // First get the existing answers to merge with new ones
    const { data: existingData, error: fetchError } = await supabase
      .from("ticket_table")
      .select("answers")
      .eq("ticket_number", ticket_number)
      .single();

    console.log("Fetched existingData:", existingData);

    if (fetchError) {
      console.error("Error fetching existing answers:", fetchError);
      return false;
    }

    // Defensive: ensure currentAnswers is always an object with responses
    let currentAnswers;
    if (
      existingData &&
      existingData.answers &&
      typeof existingData.answers === "object" &&
      existingData.answers.responses &&
      typeof existingData.answers.responses === "object"
    ) {
      currentAnswers = existingData.answers;
    } else {
      currentAnswers = { initialized: true, responses: {} };
    }
    console.log("currentAnswers:", currentAnswers);

    // Create new merged answers object
    const mergedAnswers = {
      initialized: true,
      responses: {
        ...currentAnswers.responses, // Keep all existing responses
        ...answers // answers is a flat object: { Qn: {...} }
      }
    };

    console.log("Saving merged answers:", mergedAnswers);

    const { error: updateError } = await supabase
      .from("ticket_table")
      .update({
        answers: mergedAnswers,
        exhibition_id: exhibition_id.trim()
      })
      .eq("ticket_number", ticket_number);

    if (updateError) {
      console.error("Error updating answers:", updateError);
      return false;
    } else {
      console.log("Successfully updated answers in DB.");
    }

    return true;
  } catch (error) {
    console.error("Unexpected error in saveAnswers:", error);
    return false;
  }
}


export async function getAnswersByTicketNumber(
  ticket_number: number
): Promise<Answers | null> {
  if (!ticket_number) {
    console.warn("Invalid ticket number.");
    return null;
  }

  console.log("Searching for ticket:", ticket_number, typeof ticket_number);

  const { data, error } = await supabase
    .from("ticket_table")
    .select("answers")
    .eq("ticket_number", ticket_number)
    .single();

  if (error) {
    console.error("Error fetching answers:", error.message);
    return null;
  }

  console.log("Found ticket data:", data);
  return data?.answers ?? null;
}

/**
 * Debug function to see all tickets in the database
 */
export async function getAllTickets() {
  const { data, error } = await supabase.from("ticket_table").select("*");
  
  if (error) {
    console.error("Error fetching all tickets:", error);
    return null;
  }
  
  console.log("All tickets in database:", data);
  return data;
}

/**
 * Test function to verify Supabase connection
 */
export async function testConnection(): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('ticket_table')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error("Connection test failed:", error);
      return false;
    }
    
    console.log("Connection successful, table exists");
    return true;
  } catch (err) {
    console.error("Connection error:", err);
    return false;
  }
}

export async function updateExhibitionId(
  ticket_number: number,
  exhibition_id: string
): Promise<boolean> {
  if (!ticket_number || !exhibition_id) {
    console.error("❌ Missing ticket_number or exhibition_id for update", { ticket_number, exhibition_id });
    return false;
  }
  console.log("🔍 Updating Supabase with:", { ticket_number, exhibition_id });

  const { data, error } = await supabase
    .from("ticket_table")
    .update({ exhibition_id: exhibition_id.trim() })
    .eq("ticket_number", ticket_number)
    .select(); // Get the updated row(s) back

  if (error) {
    console.error("❌ Supabase update error:", error);
    return false;
  }

  if (!data || data.length === 0) {
    console.warn("⚠️ No row found to update for ticket_number:", ticket_number);
    return false;
  }

  console.log("✅ Supabase update result:", data);
  return true;
}
