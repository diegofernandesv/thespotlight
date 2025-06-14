import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProgressBar from "../components/ProgressBar";
import Continue from "../components/buttons/Continue";
import styles from "../css/MultiChoiceQuestion.module.css";

const MapPage = ({
  storyTitle = "Our Nature",
  stepIndicator = "7/7",
  currentStep = 7, // Define default value for currentStep
  totalSteps = 7,  // Define default value for totalSteps
}) => {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate("/map"); // Navigate to the map page
  };

  return (
    <div className={styles.container}>
      <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />


      <div className={styles.mainContent}>
        <div className={styles.contentWrapper}>
          <div className={styles.questionTitle}>
            <h2>You have 4 more spotlights to go.</h2>
            <p className={styles.smallText}>Results about your relationship to nature will show in the final booth.</p>
          </div>

          <div className={styles.continueButton}>
            <Continue onClick={handleContinue} text="Continue to the next Booth" />
          </div>
        </div>
      </div>

      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/42dafb875c9b4398572d80da33d9dedd6b933b90?placeholderIfAbsent=true"
        alt=""
        className={styles.backgroundImage}
      />

      <div className={styles.footerOverlay}>
        <div className={styles.footerText}>{storyTitle}</div>
        <div className={styles.footerText}>{stepIndicator}</div>
      </div>
    </div>
  );
};

export default MapPage;