import React, { useState } from "react";
import BackButton from "../components/BackButton";
import ProgressBar from "../components/ProgressBar";
import SoundButton from "../components/SoundButton";
import Continue from "../components/buttons/Continue";
import styles from "./TicketEntry.module.css";
import ticketgreen from "../assets/ticketgreen.png";
import { supabase } from "../supabaseClient";

const TicketEntry = ({
  onSubmit,
  onBack,
  onSound,
  currentStep = 0,
  totalSteps = 7,
}) => {
  const [ticketNumber, setTicketNumber] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmed = ticketNumber.trim();

    if (!trimmed) {
      setError("Please enter your ticket number.");
      return;
    }

    if (!/^\d{4}$/.test(trimmed)) {
      setError("Ticket number must be exactly 4 digits.");
      return;
    }

    setLoading(true);
    setError("");

    const ticketNumberAsInt = parseInt(trimmed, 10);

    // Check if ticket exists
    const { data: existing, error: fetchError } = await supabase
      .from("ticket_table")
      .select("ticket_number")
      .eq("ticket_number", ticketNumberAsInt)
      .maybeSingle();

    if (fetchError) {
      console.error("Error checking ticket:", fetchError);
      setError("Something went wrong. Please try again.");
      setLoading(false);
      return;
    }

    if (existing) {
      setError("This ticket number already exists.");
      setLoading(false);
      return;
    }

    // Initialize answers with proper structure
    const initialAnswers = null;
  

    // Insert new ticket
    const { error: insertError } = await supabase
      .from("ticket_table")
      .insert([{ 
        ticket_number: ticketNumberAsInt,
        exhibition_id: "Our Nature",
        answers: initialAnswers
      }]);

    if (insertError) {
      console.error("Error creating ticket:", insertError);
      setError("Failed to save ticket. Please try again.");
      setLoading(false);
      return;
    }

    console.log("✅ Successfully created ticket:", ticketNumberAsInt);

    if (onSubmit) {
      onSubmit(ticketNumberAsInt);
    }

    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />

      <div className={styles.navigationContainer}>
        <BackButton onClick={onBack} />
        <SoundButton onClick={onSound} />
      </div>

      <div className={styles.ticketEntryContainer}>
        <h2>Please Enter Your Ticket Number</h2>
        <img
          src={ticketgreen}
          alt="Ticket"
          className={styles.ticketImage}
          style={{ marginBottom: 16, width: 320, height: "auto" }}
        />

        <form onSubmit={handleSubmit} className={styles.ticketEntryForm}>
          <input
            type="text"
            value={ticketNumber}
            onChange={(e) => setTicketNumber(e.target.value)}
            placeholder="Example: 2145"
            className={styles.ticketInput}
            maxLength={4}
            inputMode="numeric"
          />
          {error && <div className={styles.error}>{error}</div>}
          <Continue
            onClick={handleSubmit}
            disabled={!ticketNumber || loading}
            type="submit"
          >
            {loading ? "Saving..." : "Continue"}
          </Continue>
        </form>
      </div>

      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/42dafb875c9b4398572d80da33d9dedd6b933b90?placeholderIfAbsent=true"
        alt=""
        className={styles.backgroundImage}
      />
    </div>
  );
};

export default TicketEntry;