import React from "react";
import styles from "./Continue.module.css"; // adjust if needed
import ArrowRightIcon from "../icons/ArrowRightIcon"; // adjust import path if needed

const Continue = ({ onClick, disabled = false, type = "button", children = "Continue" }) => (
  <button
    className={styles.continueButton}
    onClick={onClick}
    disabled={disabled}
    type={type}
  >
    <div className={styles.continueButtonText}>{children}</div>
    <div>
      <ArrowRightIcon />
    </div>
  </button>
);

export default Continue;