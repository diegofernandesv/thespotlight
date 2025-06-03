import React from "react";

const BackIcon = () => {
  return (
    <svg
      width="72"
      height="24"
      viewBox="0 0 72 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex items-center gap-[3px]"
    >
      <mask
        id="mask0_1_3119"
        style={{ maskType: "alpha" }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="24"
        height="24"
      >
        <rect width="24" height="24" fill="#D9D9D9" />
      </mask>
      <g mask="url(#mask0_1_3119)">
        <path
          d="M16 22L6 12L16 2L17.775 3.775L9.55 12L17.775 20.225L16 22Z"
          fill="#1C1B1F"
        />
      </g>
      <text
        fill="black"
        xmlSpace="preserve"
        style={{ whiteSpace: "pre" }}
        fontFamily="Neue Montreal"
        fontSize="20"
        fontWeight="500"
        letterSpacing="0em"
      >
        <tspan x="27.3418" y="19.46">
          Back
        </tspan>
      </text>
    </svg>
  );
};

export default BackIcon;
