import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../componentsf/BackButton";
import ProgressBar from "../componentsf/ProgressBar";
import SoundButton from "../componentsf/SoundButton";
import Continue from "../componentsf/buttons/Continue";
import styles from "./TicketEntry2.module.css";
import ticketgray from "../assets/ticketgray.png";
import finalBoothImage from "../assets/finalbooth.png"; // Import the image
import { supabase } from "../supabaseClient";
import { questions } from "./QuestionView";

const TicketEntry = ({
  onSubmit,
  onBack,
  onSound,
  currentStep = 0,
  totalSteps = 7,
}) => {
  const navigate = useNavigate();
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

    try {
      // Test Supabase connection first
      const { data: testData, error: testError } = await supabase
        .from("ticket_table")
        .select("count", { count: "exact", head: true });

      if (testError) {
        console.error("Supabase connection error:", testError);
        setError("Unable to connect to the server. Please try again later.");
        setLoading(false);
        return;
      }

      // Check if ticket exists
      const { data: existing, error: fetchError } = await supabase
        .from("ticket_table")
        .select("*")
        .eq("ticket_number", ticketNumberAsInt)
        .maybeSingle();

      if (fetchError) {
        console.error("Error checking ticket:", fetchError);
        setError("Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      if (existing) {
        console.log("✅ Ticket exists:", ticketNumberAsInt);
        
        // Keep ALL existing answers exactly as they are
        const currentAnswers = existing.answers || {};
        
        // Handle exhibition_id as an array
        let exhibitionIds = existing.exhibition_id || [];
        if (!Array.isArray(exhibitionIds)) {
          exhibitionIds = [exhibitionIds];
        }
        if (!exhibitionIds.includes("Final Booth")) {
          exhibitionIds.push("Final Booth");
        }

        // Update the existing ticket with the same answers and updated exhibition_id array
        const { error: updateError } = await supabase
          .from("ticket_table")
          .update({ 
            answers: currentAnswers, // Keep existing answers exactly as they are
            exhibition_id: exhibitionIds
          })
          .eq("ticket_number", ticketNumberAsInt);

        if (updateError) {
          console.error("Error updating ticket:", updateError);
          setError("Failed to update ticket. Please try again.");
          setLoading(false);
          return;
        }

        console.log("✅ Successfully updated ticket:", ticketNumberAsInt);
        setLoading(false);
        localStorage.setItem('ticket_number', ticketNumberAsInt);
        navigate("/final-booth/question-view", { state: { ticket: ticketNumberAsInt } });
        return;
      }

      // For new tickets, initialize with empty answers
      const initialAnswers = {};

      // Insert new ticket with exhibition_id as an array
      const { error: insertError } = await supabase
        .from("ticket_table")
        .insert([{ 
          ticket_number: ticketNumberAsInt,
          exhibition_id: ["Final Booth"],
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
      localStorage.setItem('ticket_number', ticketNumberAsInt);
      navigate("/final-booth/question-view", { state: { ticket: ticketNumberAsInt } });
    } catch (error) {
      console.error("Unexpected error:", error);
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
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
          src={ticketgray}
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
          <div className={styles.betweenButtons}>
            <button
              type="button"
              className={styles.skipStep}
              style={{
                all: "unset",
                background: "#fff",
                color: "#171B1C",
                fontWeight: 600,
                borderRadius: "24px",
                padding: "10px 18px",
                fontSize: "16px",
                fontFamily: "Neue Montreal",
              }}
              onClick={() => {
                if (onSubmit) onSubmit(null);
              }}
            >
              No ticket? Skip this step
            </button>
            <Continue
              onClick={handleSubmit}
              disabled={!ticketNumber || loading}
              type="submit"
            >
              {loading ? "Saving..." : "Continue"}
            </Continue>
          </div>
        </form>
      </div>

      <img
        src={finalBoothImage} // Use the imported image
        alt=""
        className={styles.backgroundImage}
      />
    </div>
  );
};

export default TicketEntry;