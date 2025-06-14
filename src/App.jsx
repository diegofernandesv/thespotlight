import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import OurNature from "./pages/OurNature";
import ThankYouPage from "./pages/ThankYouPage";
import MapPage from "./pages/MapPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<OurNature />} />
        <Route path="/thank-you" element={<ThankYouPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;