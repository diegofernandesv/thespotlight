import React from "react";
import styles from "./ContinueBlack.module.css"; // adjust if needed
import XIconBlack from "../icons/XIconBlack";

const DeclineBlack = ({ onClick, disabled = false, type = "button", children = "Continue" }) => (
  <button
    className={styles.continueButton}
    onClick={onClick}
    disabled={disabled}
    type={type}
  >
    <div className={styles.continueButtonText}>{children}</div>
    <div>
      <XIconBlack />
    </div>
  </button>
);

export default DeclineBlack;