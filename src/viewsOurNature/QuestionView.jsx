import React, { useState, useRef, useEffect } from "react";
import MultiChoiceQuestion from "../components/MultiChoiceQuestion";
import FactPage from "../components/FactPage";
import { saveAnswers, updateExhibitionId } from "../supabaseClient";
import { supabase } from "../supabaseClient";

export const questions = [
  {
    question: "What stood out to you most in the story you just heard?",
    choices: [
      "The emotional connection to nature.",
      "It made me wonder if I'm doing enough.",
      "It reminded me how disconnected we are from where things come from.",
      "I'm not sure yet, it gave me something to think about.",
    ],
    fact: "Did you know? The Amazon rainforest produces 20% of the world's oxygen.",
    storyTitle: "Our Nature",
  },
  {
    question: "What's more important: protecting bees or ensuring high crop yields and stable food prices?",
    choices: ["Protecting bees", "Productivity"],
    fact: "Bees and other pollinators are essential for 75% of global food crops...",
    storyTitle: "Our Nature",
  },
  {
    question: "Your country bans plastic straws and builds wind turbines. But in other places, like India, pollution is rising fast. Does making all this effort still feel meaningful to you?",
    choices: [
      "Yes — progress has to start somewhere.",
      "No — it feels like we're fixing a leak in a sinking ship",
    ],
    fact: "Denmark cut emissions by 40% since 1990...",
    storyTitle: "Our Nature",
  },
  {
    question: "Artificial lights are causing birds and insects to disappear. Your street is brightly lit for safety and comfort. Would you vote to make your neighborhood darker?",
    choices: ["Yes", "No"],
    fact: "Artificial light at night disrupts migration, feeding...",
    storyTitle: "Our Nature",
  },
  {
    question: "A new highway promises faster travel across Jutland — but it threatens a rare hedgehog habitat. Would you still support it?",
    choices: ["Reroute the highway", "Cancel it", "Build it anyway"],
    fact: "European hedgehog populations have dropped by up to 70%...",
    storyTitle: "Our Nature",
  },
  {
    question: "To reduce carbon emissions, Denmark covers large open areas with wind turbines — but this drives away rare birds and disrupts their migration. Would you rather:",
    choices: ["Prioritize clean energy", "Protect untouched bird habitats"],
    fact: "Wind power supplies over 50% of Denmark's electricity...",
    storyTitle: "Our Nature",
  },
];

const totalSteps = questions.length * 2;

const QuestionView = ({ ticket }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveStatus, setSaveStatus] = useState({ show: false, success: false });
  const containerRef = useRef(null);

  const isFactStep = step % 2 === 1;
  const questionIndex = Math.floor(step / 2);
  const progressStep = questionIndex + 1;

  // Add a function to show and auto-hide save status
  const showSaveStatus = (success) => {
    setSaveStatus({ show: true, success });
    setTimeout(() => setSaveStatus({ show: false, success: false }), 2000);
  };

  // Load existing answers and verify ticket on mount
  useEffect(() => {
    const initializeQuestions = async () => {
      try {
        const ticketNumber = typeof ticket === "string" ? parseInt(ticket, 10) : ticket;
        
        if (!ticketNumber || isNaN(ticketNumber)) {
          throw new Error("Invalid ticket number");
        }

        // First verify the ticket exists and get any existing answers
        let { data: existingTicket, error: checkError } = await supabase
          .from("ticket_table")
          .select("ticket_number, answers, exhibition_id")
          .eq("ticket_number", ticketNumber)
          .single();

        // If ticket doesn't exist, throw an error. Creation should happen before this view.
        if (checkError || !existingTicket) {
          console.error("Error fetching ticket:", checkError);
          throw new Error(
            "Ticket not found or could not be fetched. Please go back and try again."
          );
        }

        // If exhibition_id is different or not set, update it
        if (existingTicket.exhibition_id !== "Our Nature") {
          const success = await updateExhibitionId(ticketNumber, "Our Nature");
          if (!success) {
            console.warn("Could not update exhibition_id");
          }
        }

        // Initialize answers array
        const existingAnswers = new Array(questions.length).fill(null);
        
        // If there are existing answers, convert them to array format
        if (existingTicket.answers) {
          for (let i = 0; i < questions.length; i++) {
            const questionKey = `Q${i + 1}`;
            const answer = existingTicket.answers[questionKey]?.answer;
            if (answer) {
              existingAnswers[i] = answer;
            }
          }
          console.log("Loaded existing answers:", existingAnswers);
        }

        setAnswers(existingAnswers);
        setIsLoading(false);
      } catch (error) {
        console.error("Error initializing questions:", error);
        setError(error.message);
        setIsLoading(false);
      }
    };

    initializeQuestions();
  }, [ticket]);

  const animateAndSetStep = (nextStep) => setStep(nextStep);

  const handleBack = () => {
    if (step > 0) animateAndSetStep(step - 1);
  };

  const handleSound = () => {
    console.log("🎧 Playing story audio...");
  };
  const handleContinue = async (answerObj) => {
    if (!isFactStep) {
      try {
        const ticketNumber = typeof ticket === "string" ? parseInt(ticket, 10) : ticket;
        
        if (!ticketNumber || isNaN(ticketNumber)) {
          throw new Error("Invalid ticket number");
        }

        // Update local state first
        const updatedAnswers = [...answers];
        updatedAnswers[questionIndex] = answerObj[`Q${questionIndex + 1}`].answer;
        setAnswers(updatedAnswers);
        
        // Build the full answers object
        const mergedAnswersObj = {};
        for (let i = 0; i < questions.length; i++) {
          mergedAnswersObj[`Q${i + 1}`] = {
            question: questions[i].question,
            answer: updatedAnswers[i] || "",
            timestamp: updatedAnswers[i] ? new Date().toISOString() : null,
          };
        }
        
        const success = await saveAnswers(ticketNumber, "Our Nature", mergedAnswersObj);
        
        
        // Move to next step only if save was successful
        if (step < totalSteps - 1) {
          animateAndSetStep(step + 1);
        }
      } catch (error) {
        console.error("Error saving answer:", error);
        showSaveStatus(false);
        setError(error.message);
      }
    } else if (step < totalSteps - 1) {
      // For fact steps, just move to next step
      animateAndSetStep(step + 1);
    } else {
      try {
        const ticketNumber = typeof ticket === "string" ? parseInt(ticket, 10) : ticket;

        if (!ticketNumber || isNaN(ticketNumber)) {
          throw new Error("Invalid ticket number");
        }

        // Create final answers object with all answers
        const finalAnswers = {};
        for (let i = 0; i < questions.length; i++) {
          finalAnswers[`Q${i + 1}`] = {
            question: questions[i].question,
            answer: answers[i] || "",
            timestamp: answers[i] ? new Date().toISOString() : null,
          };
        }

        console.log("Saving final answers:", finalAnswers);
        const success = await saveAnswers(ticketNumber, "Our Nature", finalAnswers);
        
        if (success) {
          console.log("✅ Successfully saved all answers!");
          showSaveStatus(true);
          animateAndSetStep(step + 1);
        } else {
          throw new Error("Failed to save final answers");
        }
      } catch (error) {
        console.error("Error during final save:", error);
        showSaveStatus(false);
      }
    }
  };

  if (questionIndex >= questions.length) {
    return (
      <div
        className="completionScreen"
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: 24,
        }}
      >
        🎉 You've completed the questions!
      </div>
    );
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div ref={containerRef} style={{ width: "100%" }}>
      {isFactStep ? (
        <FactPage
          fact={questions[questionIndex].fact}
          currentStep={progressStep}
          totalSteps={questions.length}
          onBack={handleBack}
          onSound={handleSound}
          onContinue={() =>
            step < totalSteps - 1
              ? animateAndSetStep(step + 1)
              : alert("Thanks again!")
          }
          storyTitle={questions[questionIndex].storyTitle}
          stepIndicator={`${progressStep}/${questions.length}`}
        />
      ) : (
        <MultiChoiceQuestion
          question={questions[questionIndex].question}
          choices={questions[questionIndex].choices}
          currentStep={progressStep}
          totalSteps={questions.length}
          onBack={handleBack}
          onSound={handleSound}
          onContinue={(selectedChoice) => {
            const answerObj = {
              [`Q${questionIndex + 1}`]: {
                question: questions[questionIndex].question,
                answer: selectedChoice,
                timestamp: new Date().toISOString()
              }
            };
            console.log("Sending answer object:", answerObj);
            handleContinue(answerObj);
          }}
          storyTitle={questions[questionIndex].storyTitle}
          stepIndicator={`${progressStep}/${questions.length}`}
        />
      )}
      {saveStatus.show && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            padding: "12px 24px",
            borderRadius: "8px",
            backgroundColor: saveStatus.success ? "#4caf50" : "#f44336",
            color: "white",
            zIndex: 1000,
            transition: "opacity 0.3s ease",
          }}
        >
          {saveStatus.success ? "Answer saved!" : "Failed to save answer"}
        </div>
      )}
    </div>
  );
};

export default QuestionView;
