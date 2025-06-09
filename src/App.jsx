import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import OurNature from "./pages/OurNature";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/*" element={<OurNature />} />
      </Routes>
    </Router>
  );
}
export default App;