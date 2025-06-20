import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Layout + Views
import Layout from "./Layout";
import MainScreen from "./viewsOurNature/MainScreen";
import QuizRoute from "./viewsOurNature/QuizRoute";

// Pages & Final Booth Views
import OurNature from "./pages/OurNature";
import ThankYouPage from "./pages/ThankYouPage";
import ThankYouPage2 from "./pages/ThankYouPage2";
import MapPage from "./pages/MapPage";
import Start from "./viewsFinalBooth/Start";
import QuestionView from "./viewsFinalBooth/QuestionView";
import TicketEntry2 from "./viewsFinalBooth/TicketEntry.jsx";
import TicketEntry from "./viewsOurNature/TicketEntry.jsx";
import TakeAPhoto from "./viewsFinalBooth/TakeAPhoto";
import SelectQuote from "./viewsFinalBooth/SelectQuote";
import Consent from "./viewsFinalBooth/Consent";
import PhotoFilters from "./viewsFinalBooth/PhotoFilters.jsx";
import PhotoOption from "./viewsFinalBooth/PhotoOption.jsx";
import Wrapped from "./pages/Wrapped.jsx";
import Wrapped2 from "./pages/Wrapped2.jsx";
import Wrapped3 from "./pages/Wrapped3.jsx";
import SpotlightWall from "./pages/SpotlightWall.jsx";

function App() {
  return (
    <BrowserRouter basename="/thespotlight/">
      <Routes>
        {/* Spotlight Section with Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<MainScreen />} />
          <Route path="quiz" element={<QuizRoute />} />
        </Route>

        {/* Main Pages */}
        <Route path="/home" element={<OurNature />} />
        <Route path="/thank-you" element={<ThankYouPage />} />
        <Route path="/thank-you2" element={<ThankYouPage2 />} />
        <Route path="/map" element={<MapPage />} />

        {/* Final Booth Views */}
        <Route path="/final-booth/start" element={<Start />} />
        <Route path="/final-booth/question-view" element={<QuestionView />} />
        <Route path="/ticket-entry2" element={<TicketEntry2 />} />
        <Route path="/ticket-entry" element={<TicketEntry />} />
        <Route path="/photo" element={<TakeAPhoto />} />
        <Route path="/quote" element={<SelectQuote />} />
        <Route path="/consent" element={<Consent />} />
        <Route path="/filters" element={<PhotoFilters />} />
        <Route path="/photoOption" element={<PhotoOption />} />
        <Route path="/wrapped" element={<Wrapped />} />
        <Route path="/wrapped2" element={<Wrapped2 />} />
        <Route path="/wrapped3" element={<Wrapped3 />} />
        <Route path="/spotlight-wall" element={<SpotlightWall />} />

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
