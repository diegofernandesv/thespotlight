import { createClient } from '@supabase/supabase-js';

// Supabase environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;

// Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type for answers object
type Answers = Record<string, any>;

/**
 * Inserts a new ticket with answers into the 'ticket_table'.
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

  const payload = {
    ticket_number: ticket_number, // Keep as number, no .trim()
    exhibition_id: exhibition_id.trim(),
    answers,
    created_at: new Date().toISOString(),
  };

  console.log("Saving to Supabase:", payload);

  const { data, error } = await supabase.from("ticket_table").insert([payload]);

  if (error) {
    console.error("Error inserting ticket:", error);
    return false;
  }

  console.log("Inserted ticket:", data);
  return true;
}

/**
 * Fetches the answers for a given ticket number.
 * @param ticket_number - The ticket number to search (as number).
 * @returns The answers object or null if not found.
 */
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
  console.log("🔍 Updating Supabase with:", { ticket_number, exhibition_id });

  const { data, error } = await supabase
    .from("ticket_table")
    .update({ exhibition_id })
    .eq("ticket_number", ticket_number);

  if (error) {
    console.error("❌ Supabase update error:", error);
    return false;
  }

  console.log("✅ Supabase update result:", data);
  return true;
}
