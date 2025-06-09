import { createClient } from '@supabase/supabase-js';

// Supabase environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;

// Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type for answers object (can be adjusted to your structure)
type Answers = Record<string, any>;

/**
 * Inserts a new ticket with answers into the 'tickets' table.
 * @param ticket_number - Unique 4-digit ticket number as a number.
 * @param exhibition_id - ID of the exhibition.
 * @param answers - Object containing quiz answers.
 * @returns true if successful, false otherwise.
 */
export async function saveAnswers(
  ticket_number: number,
  exhibition_id: string,
  answers: Answers
): Promise<boolean> {
  if (!ticket_number || !answers) {
    console.warn("Missing ticket number or answers.");
    return false;
  }

  const { data, error } = await supabase
    .from('ticket_table') // Use the correct table name here
    .insert([
      {
        ticket_number,
        exhibition_id: exhibition_id.trim(),
        answers,
      }
    ]);

  if (error) {
    console.error("Failed to save answers:", error.message);
    return false;
  }

  console.log("Ticket saved:", data);
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

  const { data, error } = await supabase
    .from('ticket_table')
    .select('answers')
    .eq('ticket_number', ticket_number)
    .single();

  if (error) {
    console.error("Error fetching answers:", error.message);
    return null;
  }

  return data?.answers ?? null;
}
