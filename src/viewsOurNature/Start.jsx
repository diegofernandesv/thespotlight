import Continue from "../components/buttons/Continue";
import "./Start.css";

function Start({ onContinue }) {
  return (
    <div className="start-root">
      <div className="start-content">
        <div className="start-step-text">
          Step into the quiz of
        </div>
        <div className="start-title">
          OUR NATURE
        </div>
        <div>
          <Continue onClick={onContinue} />
        </div>
      </div>
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/42dafb875c9b4398572d80da33d9dedd6b933b90?placeholderIfAbsent=true"
        alt=""
        className="start-bg-img"
      />
    </div>
  );
}

export default Start;
