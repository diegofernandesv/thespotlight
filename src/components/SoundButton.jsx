import React, { useState } from "react";
import SoundIcon from "./icons/SoundIcon";

const SoundButton = () => {
  const [isMuted, setIsMuted] = useState(false);

  const toggleSound = () => {
    setIsMuted(!isMuted);
  };

  return (
    <button onClick={toggleSound} type="button">
      <SoundIcon isMuted={isMuted} />
    </button>
  );
};

export default SoundButton;
