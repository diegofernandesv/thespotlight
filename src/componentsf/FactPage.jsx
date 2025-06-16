import React from "react";
import ProgressBar from "./ProgressBar";
import BackButton from "./BackButton";
import SoundButton from "./SoundButton";
import ArrowRightIcon from "./icons/ArrowRightIcon";
import styles from "../componentsf/css/MultiChoiceQuestion.module.css";
import Continue from "./buttons/Continue";
import finalBoothImage from "../assets/finalbooth.png";

const FactPage = ({
  fact = "Did you know? The Amazon rainforest produces 20% of the world's oxygen.",
  currentStep = 1,
  totalSteps = 7,
  onBack,
  onSound,
  onContinue,
  storyTitle = "Our Nature",
  stepIndicator = "1/7",
  backgroundImage = finalBoothImage,
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
        src={finalBoothImage}
        alt="Background"
        className="backgroundImage"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "auto" /* Fixed: Wrapped auto in quotes */,
          objectFit: "cover",
        }}
      />
      <div className={styles.footerOverlay}>
        <div className={styles.footerText}>{storyTitle}</div>
        <div className={styles.footerText}>{stepIndicator}</div>
      </div>
    </div>
  );
};

export default FactPage;
