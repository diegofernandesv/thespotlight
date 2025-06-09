
import BackIcon from "./icons/BackIcon";

const BackButton = ({ onClick }) => {
  return (
    <button onClick={onClick} type="button">
      <BackIcon />
    </button>
  );
};

export default BackButton;
