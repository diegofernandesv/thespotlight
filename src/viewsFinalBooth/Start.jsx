import Continue from "../componentsf/buttons/Continue";
import "./Start.css";
import finalBoothImage from "../assets/finalbooth.png"; // Import the image
import { useNavigate } from "react-router-dom";

function Start() {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate("/ticket-entry2"); // Navigate to the ticket entry page
  };

  return (
    <div className="start-root">
      <div className="start-content">
        <div className="start-step-text">
          Step into the quiz of
        </div>
        <div className="start-title">
          FINAL BOOTH
        </div>
        <div>
          <Continue onClick={handleContinue} />
        </div>
      </div>
      <img
        src={finalBoothImage} // Use the imported image
        alt=""
        className="start-bg-img"
      />
    </div>
  );
}

export default Start;
