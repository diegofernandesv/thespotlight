import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProgressBar from "../components/ProgressBar";
import BackButton from "../components/buttons/BackButton";
import SoundButton from "../components/SoundButton";
import Continue from "../components/buttons/Continue";
import styles from "../css/MultiChoiceQuestion.module.css";

const MultiChoiceQuestion = ({
  question = "",
  choices = [],
  currentStep = 7,
  totalSteps = 7,
  onBack,
  onSound,
  onChoiceSelect,
  onContinue,
  storyTitle = "Our Nature",
  stepIndicator = "7/7",
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
    navigate("/map"); // Ensure this navigates to the Map Page
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
            Thank you for stepping into the spotlight of Our Nature.<br />{" "}We hope this shed more light on complex, still-relevant issues and
              that you’ll carry that awareness forward.
          </div>

          <div className={styles.choicesContainer}>

          </div>

          <div className={styles.continueButton}>
            <Continue onClick={handleContinue} />
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

export default MultiChoiceQuestion;