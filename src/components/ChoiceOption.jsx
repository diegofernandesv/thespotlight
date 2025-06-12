import styles from "../css/ChoiceOption.module.css";

const ChoiceOption = ({ children, onClick, value, className = "", isActive, type = "button" }) => {
  return (
    <button
      className={`${styles.choiceOption} ${isActive ? styles.active : ''} ${className}`}
      onClick={() => onClick && onClick(value)}
      type={type}
    >
      {children}
    </button>
  );
};

export default ChoiceOption;
