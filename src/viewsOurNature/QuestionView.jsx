import React, { useState, useRef, useEffect } from "react";
import MultiChoiceQuestion from "../components/MultiChoiceQuestion";
import FactPage from "../components/FactPage";
import { saveAnswers, updateExhibitionId } from "../supabaseClient";


const questions = [
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
  const containerRef = useRef(null);

  const isFactStep = step % 2 === 1;
  const questionIndex = Math.floor(step / 2);
  const progressStep = questionIndex + 1;

  // ✅ Update exhibition ID to "Our Nature" on mount
  useEffect(() => {
    const updateExhibition = async () => {
      if (!ticket) return;

      const ticketNumber = typeof ticket === 'string' ? parseInt(ticket, 10) : ticket;
      const exhibition_id = "Our Nature";

      if (isNaN(ticketNumber)) {
        console.warn("⚠️ Invalid ticket number:", ticket);
        return;
      }

      console.log("🧪 Trying to update ticket:", ticketNumber, "with exhibition_id:", exhibition_id);
      const success = await updateExhibitionId(ticketNumber, exhibition_id);
      if (!success) {
        console.warn("⚠️ Could not update exhibition_id in Supabase.");
      }
    };

    updateExhibition();
  }, [ticket]);

  const animateAndSetStep = (nextStep) => {
    setStep(nextStep);
  };

  const handleBack = () => {
    if (step > 0) animateAndSetStep(step - 1);
  };

  const handleSound = () => {
    console.log("🎧 Playing story audio...");
  };

  const handleContinue = async (selectedChoice) => {
    let updatedAnswers = answers;
    if (!isFactStep) {
      if (selectedChoice === undefined || selectedChoice === null) return;
      updatedAnswers = [...answers];
      updatedAnswers[questionIndex] = selectedChoice;
      setAnswers(updatedAnswers);
    }

    if (step < totalSteps - 1) {
      animateAndSetStep(step + 1);
    } else {
      const exhibition_id = questions[0]?.storyTitle || "Unknown";

      if (ticket) {
        const ticketNumber = typeof ticket === 'string' ? parseInt(ticket, 10) : ticket;
        if (isNaN(ticketNumber)) {
          alert("Error: Invalid ticket number");
          return;
        }

        const answersObject = {};
        questions.forEach((q, idx) => {
          answersObject[`Q${idx + 1}`] = updatedAnswers[idx] ?? null;
        });

        const success = await saveAnswers(ticketNumber, exhibition_id, answersObject);
        if (success) {
          alert("Thanks for completing the questions! Your answers have been saved.");
        } else {
          alert("There was an error saving your answers. Please try again.");
          return;
        }
      } else {
        alert("No ticket number provided. Answers not saved.");
      }

      animateAndSetStep(step + 1);
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
              : alert("Thank you for completing the questions!")
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
          onContinue={handleContinue}
          storyTitle={questions[questionIndex].storyTitle}
          stepIndicator={`${progressStep}/${questions.length}`}
        />
      )}
    </div>
  );
};

export default QuestionView;
