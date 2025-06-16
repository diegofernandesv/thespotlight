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
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey
  });
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

console.log('Initializing Supabase client with URL:', supabaseUrl);

// Initialize Supabase client with error handling
let supabase;
try {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  });
  console.log('Supabase client initialized successfully');
} catch (error) {
  console.error('Error initializing Supabase client:', error);
  throw new Error('Failed to initialize Supabase client');
}

export { supabase };

// Type for answers object
type Answers = Record<string, any>;

// Add type for exhibition_id
type ExhibitionId = string | string[];

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
    // First get the existing ticket data
    const { data: existingData, error: fetchError } = await supabase
      .from("ticket_table")
      .select("answers, exhibition_id")
      .eq("ticket_number", ticket_number)
      .single();

    console.log("Fetched existingData:", existingData);

    if (fetchError) {
      console.error("Error fetching existing answers:", fetchError);
      return false;
    }

    // Get existing answers or initialize empty object
    const existingAnswers = existingData?.answers || {};
    
    // Handle exhibition_id as a proper JSON array
    let exhibitionIds: string[] = [];
    try {
      // If it's already a string that looks like JSON, parse it
      if (typeof existingData?.exhibition_id === 'string') {
        try {
          // Clean up the string by removing extra backslashes
          const cleanStr = existingData.exhibition_id.replace(/\\/g, '');
          exhibitionIds = JSON.parse(cleanStr);
        } catch {
          // If parsing fails, treat it as a single value
          exhibitionIds = [existingData.exhibition_id];
        }
      } 
      // If it's already an array, use it directly
      else if (Array.isArray(existingData?.exhibition_id)) {
        exhibitionIds = existingData.exhibition_id;
      }
      // If it's a single string, make it an array
      else if (existingData?.exhibition_id) {
        exhibitionIds = [existingData.exhibition_id];
      }
    } catch (e) {
      console.warn("Error parsing exhibition_id, starting fresh:", e);
      exhibitionIds = [];
    }

    // Add new exhibition_id if not present
    if (!exhibitionIds.includes(exhibition_id)) {
      exhibitionIds.push(exhibition_id);
    }

    // Create new merged answers object
    const mergedAnswers = {
      ...existingAnswers,
      ...answers
    };

    console.log("Saving merged answers:", mergedAnswers);
    console.log("Updated exhibition IDs:", exhibitionIds);

    const { error: updateError } = await supabase
      .from("ticket_table")
      .update({
        answers: mergedAnswers,
        exhibition_id: exhibitionIds // Store as a clean array
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

  try {
    // First get the existing exhibition_id
    const { data: existingData, error: fetchError } = await supabase
      .from("ticket_table")
      .select("exhibition_id")
      .eq("ticket_number", ticket_number)
      .single();

    if (fetchError) {
      console.error("Error fetching existing exhibition_id:", fetchError);
      return false;
    }

    // Handle exhibition_id as a proper JSON array
    let exhibitionIds: string[] = [];
    try {
      if (typeof existingData?.exhibition_id === 'string') {
        try {
          // Clean up the string by removing extra backslashes
          const cleanStr = existingData.exhibition_id.replace(/\\/g, '');
          exhibitionIds = JSON.parse(cleanStr);
        } catch {
          // If parsing fails, treat it as a single value
          exhibitionIds = [existingData.exhibition_id];
        }
      } else if (Array.isArray(existingData?.exhibition_id)) {
        exhibitionIds = existingData.exhibition_id;
      } else if (existingData?.exhibition_id) {
        exhibitionIds = [existingData.exhibition_id];
      }
    } catch (e) {
      console.warn("Error parsing exhibition_id, starting fresh:", e);
      exhibitionIds = [];
    }

    // Add new exhibition_id if not present
    if (!exhibitionIds.includes(exhibition_id)) {
      exhibitionIds.push(exhibition_id);
    }

    const { error: updateError } = await supabase
      .from("ticket_table")
      .update({ 
        exhibition_id: exhibitionIds // Store as a clean array
      })
      .eq("ticket_number", ticket_number);

    if (updateError) {
      console.error("❌ Supabase update error:", updateError);
      return false;
    }

    console.log("✅ Successfully updated exhibition_id to:", exhibitionIds);
    return true;
  } catch (error) {
    console.error("❌ Unexpected error updating exhibition_id:", error);
    return false;
  }
}
