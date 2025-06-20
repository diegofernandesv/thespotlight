import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProgressBar from "../componentsf/ProgressBar";
import BackButton from "../components/buttons/BackButton";
import SoundButton from "../components/SoundButton";
import Continue from "../componentsf/buttons/Continue";
import styles from "../components/css/MultiChoiceQuestion.module.css";
import finalBoothImage from "../assets/finalbooth.png";

const ThankYouPage2 = ({
  question = "",
  choices = [],
  currentStep = 5,
  totalSteps = 5,
  onBack,
  onSound,
  onChoiceSelect,
  onContinue,
  storyTitle = "Final Booth",
  stepIndicator = "5/5",
  onSkip,
}) => {
  const navigate = useNavigate();
  const [selectedChoice, setSelectedChoice] = useState(null);

  const handleChoiceSelect = (choice) => {
    setSelectedChoice(choice);
    if (onChoiceSelect) {
      onChoiceSelect(choice);
    }
  };

  const handleContinue = () => {
    navigate("/wrapped"); // Ensure this navigates to the Wrapped Page
  };

  return (
    <div className={styles.container}>
      <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />

      <div className={styles.navigationContainer}>
        <div>
          <BackButton onClick={() => window.history.back()} />
        </div>
        <div>
          <SoundButton onClick={onSound} />
        </div>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.contentWrapper}>
          <div className={styles.questionTitle}>
            Are you ready to see your results?
          </div>

          <div className={styles.choicesContainer}>

          </div>

          <div className={styles.continueButton}>
            <Continue onClick={handleContinue} />
          </div>
        </div>
      </div>

      <img
        src={finalBoothImage}
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

export default ThankYouPage2;