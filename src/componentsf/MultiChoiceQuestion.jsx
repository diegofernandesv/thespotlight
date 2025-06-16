import React, { useState } from "react";
import ProgressBar from "./ProgressBar";
import BackButton from "./BackButton";
import SoundButton from "./SoundButton";
import ChoiceOption from "./ChoiceOption";
import styles from "../componentsf/css/MultiChoiceQuestion.module.css";
import Continue from "./buttons/Continue";
import finalBoothImage from "../assets/finalbooth.png";

const MultiChoiceQuestion = ({
  question = "",
  choices = [],
  currentStep = 1,
  totalSteps = 7,
  onBack,
  onSound,
  onChoiceSelect,
  onContinue,
  storyTitle = "Our Nature",
  stepIndicator = "1/7",
  onSkip,
}) => {
  const [selectedChoice, setSelectedChoice] = useState(null);

  const handleChoiceSelect = (choice) => {
    setSelectedChoice(choice);
    if (onChoiceSelect) {
      onChoiceSelect(choice);
    }
  };

  const handleContinue = () => {
    if (onContinue && selectedChoice) {
      onContinue(selectedChoice);
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

      <div className={styles.mainContent}>
        <div className={styles.contentWrapper}>
          <div className={styles.questionTitle}>{question}</div>

          <div className={styles.choicesContainer}>
            {choices.map((choice, index) => (
              <ChoiceOption
                key={index}
                value={choice}
                onClick={handleChoiceSelect}
                isActive={selectedChoice === choice}
              >
                {choice}
              </ChoiceOption>
            ))}
          </div>
          <div className={styles.continueButton}>
            <Continue
              onClick={handleContinue}
              disabled={!selectedChoice}
            />
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

export default MultiChoiceQuestion;
