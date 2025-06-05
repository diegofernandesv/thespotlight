import { useState } from "react";
import TicketEntry from "./TicketEntry";
import QuestionView from "./QuestionView";

const QuizRoute = () => {
  const [ticket, setTicket] = useState(null);

  return (
    <>
      {!ticket ? (
        <TicketEntry onSubmit={setTicket} />
      ) : (
        <QuestionView ticket={ticket} />
      )}
    </>
  );
};

export default QuizRoute;