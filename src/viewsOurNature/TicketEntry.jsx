import React, { useState } from "react";
import BackButton from "../components/BackButton";
import ProgressBar from "../components/ProgressBar";
import SoundButton from "../components/SoundButton";
import ChoiceOption from "../components/ChoiceOption";
import Continue from "../components/buttons/Continue";
import styles from "./TicketEntry.module.css";
import ticketgreen from "../assets/ticketgreen.png"; // Adjust the path if needed

const TicketEntry = ({
  onSubmit,
  onBack,
  onSound,
  currentStep = 0,
  totalSteps = 7,
}) => {
  const [ticketNumber, setTicketNumber] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!ticketNumber.trim()) {
      setError("Please enter your ticket number.");
      return;
    }
    setError("");
    if (onSubmit) {
      onSubmit(ticketNumber);
    }
  };

  return (
    <div className={styles.container}>
      <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />

      <div className={styles.navigationContainer}>
        <div>
          <BackButton onClick={onBack} />
        </div>
        <div>
          <SoundButton onClick={onSound} />
        </div>
      </div>
      
      <div className={styles.ticketEntryContainer}>
        <h2>Please Enter Your Ticket Number</h2>
          <img
          src={ticketgreen}
          alt="Ticket"
          className={styles.ticketImage}
          style={{ marginBottom: 16, width: 320, height: "auto" }} // adjust as needed or use CSS
        />
        <form onSubmit={handleSubmit} className={styles.ticketEntryForm}>
          <input
            type="text"
            value={ticketNumber}
            onChange={e => setTicketNumber(e.target.value)}
            placeholder="Example. 2145"
            className={styles.ticketInput}
          />
          {error && <div className={styles.error}>{error}</div>}
          <Continue
            onClick={handleSubmit}
            disabled={!ticketNumber}
            type="submit"
          >
            Continue
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
