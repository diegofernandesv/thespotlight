import { useState } from "react";
import styles from "./SelectQuote.module.css";
import arrowIcon from "../assets/arrow_no_tail.svg";
import ContinueBlack from "../components/buttons/ContinueBlack";
import { useNavigate } from "react-router-dom";

const quotesData = [
  {
    quote: '“I stand up for _____________ because _____________”',
    option1Title: "I stand up for:",
    option2Title: "Because:",
    options1: [
      "Environmental justice",
      "Animal welfare",
      "Clean air & water",
      "Ecosystem preservation",
      "Sustainable living",
      "Climate education",
      "Wildlife protection",
      "Ocean conservation",
      "Zero-waste living",
      "Renewable energy",
      "Nature-based solutions",
      "Soil regeneration",
    ],
    options2: [
      "Everyone deserves a healthy planet",
      "Nature has no voice but we do",
      "Small actions create big ripples",
      "Our choices define the future",
      "Respect for life starts here",
      "Change begins with awareness",
      "The planet gives, we must give back",
      "We're all responsible for balance",
      "Standing up now protects tomorrow",
      "Collaboration is key to progress",
      "Protecting nature is protecting us",
      "Healthy planet = healthy people",
    ],
  },
  {
    quote: '“_____________ matters to me because _____________”',
    option1Title: "Matters to me",
    option2Title: "Because:",
    options1: [
      "Biodeiversity",
      "Forests",
      "Coral reefs",
      "Endangered species",
      "Climate action",
      "Clean oceans",
      "Freshwater ecosystems",
      "Arctic wildlife",
      "Polinators",
      "Sustainable agriculture",
      "Natural heritage",
      "Community green spaces",
    ],
    options2: [
      "They are essential to life",
      "Their loss affects us all",
      "Diversity keeps ecosystems strong",
      "Protecting them protects us",
      "Every species has value",
      "We learn from nature's resilience",
      "They support our well-being",
      "They hold solutions for the future",
      "A balanced planet benefits everyone",
      "Connection to nature builds empathy",
      "Nature's health is humanity's health",
      "They inspire awe and respect",
    ],
  },
  {
    quote: '“I feel connected to _____________ because _____________”',
    option1Title: "I feel connected to:",
    option2Title: "Because:",
    options1: [
      "Local nature",
      "Global ecosystems",
      "Wildlife",
      "Clean water sources",
      "Our shared enviroment",
      "Forest trails",
      "Costal landscapes",
      "Mountain paths",
      "Urban parks",
      "Family traditions in nature",
      "Natural history",
      "Cultural landscapes",
    ],
    options2: [
      "We all rely on the same planet",
      "Every breath depends on it",
      "It's part of who we are",
      "Nature heals and teaches",
      "It grounds me in the present",
      "It gives me perspective",
      "Shared experiences build community",
      "It offers peace in busy times",
      "It sparks my curiosity",
      "It's where I feel the most alive",
      "It inspires care and responsibility",
      "It reminds me of home",
    ],
  },
  {
    quote: '“The world needs more _____________ because _____________”',
    option1Title: "The world needs more",
    option2Title: "Because:",
    options1: [
      "Awareness",
      "Empathy",
      "Action",
      "Curiosity",
      "Respect for nature",
      "Collaboration",
      "Innovative solutions",
      "Compassion",
      "Resilience",
      "Accountability",
      "Mindfulness",
      "Inclusivity",
    ],
    options2: [
      "It drives positive change",
      "We protect what we understand",
      "Small steps inspire big movements",
      "Nature thrives when we care",
      "It connects people with the planet",
      "Understanding leads to action",
      "Every voice matters",
      "Shared efforts build strong futures",
      "Solutions come from cooperation",
      "Nature's balance depends on us",
      "Empathy builds lasting impact",
      "Curiosity leads to innovation",
    ],
  },
  // add more quote objects here as you want
];

const SelectQuote = () => {
    const photo = localStorage.getItem("capturedPhoto");

    const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
    const [selectedOption1, setSelectedOption1] = useState("");
    const [selectedOption2, setSelectedOption2] = useState("");
    const navigate = useNavigate();
    const { quote, options1, options2 } = quotesData[currentQuoteIndex];

    // Function to replace the blanks in the quote with selected options
    const renderQuote = () => {
        const parts = quote.split("_____________");

        // Determine if the first blank is at the beginning of the sentence
        const isFirstAtStart = parts[0].trim() === "“" || parts[0].trim() === "";

        const formattedOption1 = selectedOption1
            ? isFirstAtStart
            ? selectedOption1
            : selectedOption1.toLowerCase()
            : "_____________";

        const formattedOption2 = selectedOption2
            ? selectedOption2.toLowerCase()
            : "_____________";

        // Construct full string for localStorage
        const fullQuote = `${parts[0]}${formattedOption1}${parts[1]}${formattedOption2}${parts[2]}`;

        // Store the result in localStorage
        localStorage.setItem("renderedQuote", fullQuote);
        
        return (
            <>
            {parts[0]}
            <span>{formattedOption1}</span>
            {parts[1]}
            <span>{formattedOption2}</span>
            {parts[2]}
            </>
        );
    };


    const handleArrowClick = (direction) => {
    let newIndex =
        direction === "left"
        ? (currentQuoteIndex - 1 + quotesData.length) % quotesData.length
        : (currentQuoteIndex + 1) % quotesData.length;

    setCurrentQuoteIndex(newIndex);
    setSelectedOption1("");
    setSelectedOption2("");
    };

    return (
        <div className={styles.wrapper}>
            <img src={photo} alt="Captured" className={styles.image} />
            <div className={styles.quoteSelectorWrapper}>
            <h3>Select a quote</h3>
            <div className={styles.quoteSelector}>
                <img
                src={arrowIcon}
                alt="left"
                className={styles.arrowLeft}
                onClick={() => handleArrowClick("left")}
                />
                <div className={styles.quote}>
                <p>{renderQuote()}</p>
                </div>
                <img
                src={arrowIcon}
                alt="right"
                className={styles.arrowRight}
                onClick={() => handleArrowClick("right")}
                />
            </div>
            <div className={styles.optionsWrapper}>
                <div className={styles.otionList1Wrapper}>
                <p>I stand up for:</p>
                <ul>
                    {options1.map((item, idx) => (
                    <li key={idx} onClick={() => setSelectedOption1(item)}>
                        {item}
                    </li>
                    ))}
                </ul>
                </div>
                <div className={styles.otionList2Wrapper}>
                <p>Because:</p>
                <ul>
                    {options2.map((item, idx) => (
                    <li key={idx} onClick={() => setSelectedOption2(item)}>
                        {item}
                    </li>
                    ))}
                </ul>
                </div>
            </div>
            </div>
            <div className={styles.continueBtnWrapper}>
            <ContinueBlack onClick={() => navigate("/consent")}></ContinueBlack>
            </div>
        </div>
    );
};

export default SelectQuote;
