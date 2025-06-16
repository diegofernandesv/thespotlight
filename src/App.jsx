import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import OurNature from "./pages/OurNature";
import ThankYouPage from "./pages/ThankYouPage";
import MapPage from "./pages/MapPage";
import Start from "./viewsFinalBooth/Start";
import TicketEntry2 from "./viewsFinalBooth/TicketEntry";
import TicketEntry from "./viewsOurNature/TicketEntry"; // Update the import path if the file is in a different location
import QuestionView from "./viewsFinalBooth/QuestionView";
import ThankYouPage2 from "./pages/ThankYouPage2";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<OurNature />} />
        <Route path="/thank-you" element={<ThankYouPage />} />
        <Route path="/thank-you2" element={<ThankYouPage2 />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/final-booth/start" element={<Start />} />
        <Route path="/final-booth/question-view" element={<QuestionView />} />
        <Route path="/ticket-entry2" element={<TicketEntry2 />} />
        <Route path="/ticket-entry" element={<TicketEntry />} />
        <Route path="/*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;