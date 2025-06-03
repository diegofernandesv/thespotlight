import "./App.css";
import TicketEntry from "./views/TicketEntry";
import QuestionView from "./views/QuestionView";
import { useState } from "react";

function App() {
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
}

export default App;
