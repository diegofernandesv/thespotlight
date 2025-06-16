import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Layout + Views
import Layout from "./Layout";
import MainScreen from "./views/MainScreen";
import QuizRoute from "./views/QuizRoute";

// Pages & Final Booth Views
import OurNature from "./pages/OurNature";
import ThankYouPage from "./pages/ThankYouPage";
import ThankYouPage2 from "./pages/ThankYouPage2";
import MapPage from "./pages/MapPage";
import Start from "./viewsFinalBooth/Start";
import QuestionView from "./viewsFinalBooth/QuestionView";
import TicketEntry2 from "./viewsFinalBooth/TicketEntry";
import TicketEntry from "./viewsOurNature/TicketEntry";

function App() {
  return (
    <Router>
      <Routes>
        {/* Original Main Routes */}
        <Route path="/thespotlight" element={<Layout />}>
          <Route index element={<MainScreen />} />
          <Route path="quiz" element={<QuizRoute />} />
        </Route>

        {/* Additional Pages */}
        <Route path="/" element={<OurNature />} />
        <Route path="/thank-you" element={<ThankYouPage />} />
        <Route path="/thank-you2" element={<ThankYouPage2 />} />
        <Route path="/map" element={<MapPage />} />

        {/* Final Booth Routes */}
        <Route path="/final-booth/start" element={<Start />} />
        <Route path="/final-booth/question-view" element={<QuestionView />} />
        <Route path="/ticket-entry2" element={<TicketEntry2 />} />
        <Route path="/ticket-entry" element={<TicketEntry />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
