import React, { useState } from "react";
import SoundIcon from "./icons/SoundIcon";

const SoundButton = ({ onClick }) => {
  const [isMuted, setIsMuted] = useState(false);

  const handleClick = () => {
    setIsMuted(!isMuted);
    if (onClick) {
      onClick();
    }
  };

  return (
    <button onClick={handleClick} type="button">
      <SoundIcon isMuted={isMuted} />
    </button>
  );
};

export default SoundButton;
