import React from "react";

const SoundIcon = ({ isMuted }) => {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex w-[48px] h-[48px] flex-shrink-0 rounded-[24px] bg-[#FFF] cursor-pointer"
    >
      <rect width="48" height="48" rx="24" fill="white" />
      {isMuted ? (
        <path
          d="M11 19.2857V28.7143H16L24 35V13L16 19.2857H11ZM30 18L36 30M36 18L30 30"
          stroke="#2C3638"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M29 20.3333C29 20.3333 31 21.381 31 24C31 26.619 29 27.6667 29 27.6667M31 14.0476C35 16.1429 37 19.2857 37 24C37 28.7143 35 31.8571 31 33.9524M11 19.2857V28.7143H16L24 35V13L16 19.2857H11Z"
          stroke="#2C3638"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
};

export default SoundIcon;
