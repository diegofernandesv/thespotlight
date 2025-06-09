import React from "react";
import ProgressBar from "./ProgressBar";
import BackButton from "./BackButton";
import SoundButton from "./SoundButton";
import ArrowRightIcon from "./icons/ArrowRightIcon";
import styles from "../css/MultiChoiceQuestion.module.css";
import Continue from "./buttons/Continue";

const FactPage = ({
  fact = "Did you know? The Amazon rainforest produces 20% of the world's oxygen.",
  currentStep = 1,
  totalSteps = 7,
  onBack,
  onSound,
  onContinue,
  storyTitle = "Our Nature",
  stepIndicator = "1/7",
  backgroundImage = "https://cdn.builder.io/api/v1/image/assets/TEMP/42dafb875c9b4398572d80da33d9dedd6b933b90?placeholderIfAbsent=true",
}) => {
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
          <div className={styles.questionTitle}>{fact}</div>
          <Continue onClick={onContinue} />
        </div>
      </div>
      <img
        src={backgroundImage}
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

export default FactPage;
