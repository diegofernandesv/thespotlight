import React from "react";
import styles from "./ProgressBar.module.css";

const ProgressBar = ({ currentStep = 1, totalSteps = 7 }) => {
  return (
    <div className={styles.progressContainer}>
      {Array.from({ length: totalSteps }, (_, index) => (
        <div
          key={index}
          className={`${styles.progressSegment} ${
            index < currentStep
              ? styles.progressSegmentActive
              : styles.progressSegmentInactive
          }`}
        />
      ))}
    </div>
  );
};

export default ProgressBar;
