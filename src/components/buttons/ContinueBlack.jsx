import React from "react";
import styles from "./ContinueBlack.module.css"; // adjust if needed
import ArrowRightIconBlack from "../icons/ArrowRightIconBlack";

const ContinueBlack = ({ onClick, disabled = false, type = "button", children = "Continue" }) => (
  <button
    className={styles.continueButton}
    onClick={onClick}
    disabled={disabled}
    type={type}
  >
    <div className={styles.continueButtonText}>{children}</div>
    <div>
      <ArrowRightIconBlack />
    </div>
  </button>
);

export default ContinueBlack;