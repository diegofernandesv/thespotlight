import React from "react";
import SoundIcon from "./icons/SoundIcon";

const SoundButton = ({ onClick }) => {
  return (
    <button onClick={onClick} type="button">
      <SoundIcon />
    </button>
  );
};

export default SoundButton;
