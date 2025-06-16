import { useState } from "react";
import TicketEntry from "../viewsFinalBooth/TicketEntry";
import QuestionView from "../viewsFinalBooth/QuestionView";
import Start from "../viewsFinalBooth/Start";

function OurNature() {
  const [showStart, setShowStart] = useState(true);
  const [ticket, setTicket] = useState(null);

  return (
    <>
      {showStart ? (
        <Start onContinue={() => setShowStart(false)} />
      ) : !ticket ? (
        <TicketEntry onSubmit={setTicket} onBack={() => setShowStart(true)} />
      ) : (
        <QuestionView ticket={ticket} />
      )}
    </>
  );
}

export default OurNature;
