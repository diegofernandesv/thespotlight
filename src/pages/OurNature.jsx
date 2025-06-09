import { useState } from "react";
import TicketEntry from "../viewsOurNature/TicketEntry";
import QuestionView from "../viewsOurNature/QuestionView";
import Start from "../viewsOurNature/Start";

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
