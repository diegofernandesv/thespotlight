import React, { useState } from "react";
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
      console.log("✅ Ticket exists:", ticketNumberAsInt);
      setLoading(false);
      // Navigate to QuestionView
      window.location.href = `/viewsFinalBooth/QuestionView?ticket=${ticketNumberAsInt}`;
      return;
    }

    // Initialize answers with proper structure
    const initialAnswers = {};
    questions.forEach((q, i) => {
      initialAnswers[`Q${i + 1}`] = {
        question: q.question,
        answer: "",
        timestamp: null,
      };
    });
  

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

    // Navigate to QuestionView
    window.location.href = `/viewsFinalBooth/QuestionView?ticket=${ticketNumberAsInt}`;
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