import React, { useState, useRef, useEffect } from "react";
import MultiChoiceQuestion from "../componentsf/MultiChoiceQuestion";
import FactPage from "../componentsf/FactPage";
import { saveAnswers, updateExhibitionId } from "../supabaseClient";
import { supabase } from "../supabaseClient";
import { useNavigate, useLocation } from "react-router-dom";

export const questions = [
  {
    question: "When you look back at all the booths, which topic made you think the most?",
    choices: [
      "Climate and the planet.",
      "Wildlife and biodiversity.",
      "People and cultures.",
    ],
    fact: "Climate, biodiversity, and human societies are closely linked. Changes in climate can harm wildlife and affect people's lives around the world.",
    storyTitle: "Final Booth",
  },
  {
    question: "After entering the booths, what do you think is most important for the future?",
    choices: ["Protecting nature.", "Changing how we live.", "Learning more about the world.","Working together."],
    fact: "Scientists agree that protecting nature, changing how we use resources, and working together are all needed to address global challenges.",
    storyTitle: "Final Booth",
  },
  {
    question: "If you had to choose one thing to share after visiting The Spotlight, what would it be?",
    choices: [
      "A fact I learned.",
      "A personal thought.",
      "A question I'm still thinking about.",
      "I wouldn't share anything.",
    ],
    fact: "Scientists agree that protecting nature, changing how we use resources, and working together are all needed to address global challenges.",
    storyTitle: "Final Booth",
  },
  {
    question: "Which of these do you think you can do after your visit?",
    choices: ["Talk to others about the topics.", "Make a small change in daily life.","Learn more from trusted sources.","Nothing for now."],
    fact: "Small actions and conversations can inspire others and help create bigger changes over time.",
    storyTitle: "Final Booth",
  },
  {
    question: "After the exhibitions, what do you think is the best next step?",
    choices: ["Keep exploring new topics.", "Focus on one issue that matters to me.", "Join a group or activity.","I'm not sure yet."],
    fact: "People are more likely to stay engaged when they take small steps that fit their interests and daily life.",
    storyTitle: "Final Booth",
  },
];

const totalSteps = questions.length * 2;

const QuestionView = () => {
  const location = useLocation();
  const ticket = location.state?.ticket;
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveStatus, setSaveStatus] = useState({ show: false, success: false });
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const isFactStep = step % 2 === 1;
  const questionIndex = Math.floor(step / 2);
  const progressStep = questionIndex + 1;

  // Add a function to show and auto-hide save status
  const showSaveStatus = (success) => {
    setSaveStatus({ show: true, success });
    setTimeout(() => setSaveStatus({ show: false, success: false }), 2000);
  };

  // Check if we're at the completion screen
  const isCompletionScreen = step >= totalSteps;

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
        if (existingTicket.exhibition_id !== "Final Booth") {
          const success = await updateExhibitionId(ticketNumber, "Final Booth");
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
        updatedAnswers[questionIndex] = answerObj[`Q${questionIndex + 8}`].answer;
        setAnswers(updatedAnswers);
        
        // Build the full answers object
        const mergedAnswersObj = {};
        for (let i = 0; i < questions.length; i++) {
          mergedAnswersObj[`Q${i + 8}`] = {
            question: questions[i].question,
            answer: updatedAnswers[i] || "",
            timestamp: updatedAnswers[i] ? new Date().toISOString() : null,
          };
        }
        
        const success = await saveAnswers(ticketNumber, "Final Booth", mergedAnswersObj);
        
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
          finalAnswers[`Q${i + 8}`] = {
            question: questions[i].question,
            answer: answers[i] || "",
            timestamp: answers[i] ? new Date().toISOString() : null,
          };
        }

        console.log("Saving final answers:", finalAnswers);
        const success = await saveAnswers(ticketNumber, "Final Booth", finalAnswers);
        
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

  if (isCompletionScreen) {
    return (
      <div
        className="completionScreen"
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "2rem",
          textAlign: "center",
          backgroundColor: "#f5f5f5",
          color: "#333",
          fontFamily: "inherit"
        }}
      >
        <h1 style={{ 
          fontSize: "2.5rem", 
          marginBottom: "1.5rem",
          fontWeight: "600"
        }}>
          Thank you for stepping into the spotlight of Final Booth.
        </h1>
        <p style={{ 
          fontSize: "1.25rem", 
          lineHeight: "1.6",
          maxWidth: "800px"
        }}>
          We hope this shed more light on complex, still-relevant issues and that you'll carry that awareness forward.
        </p>
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
          onContinue={() => {
            if (step < totalSteps - 1) {
              animateAndSetStep(step + 1);
            } else {
              navigate("/thank-you2");
            }
          }}
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
              [`Q${questionIndex + 8}`]: {
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
