import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Registration from "./components/Registration";
import Logging from "./components/Logging";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Registration />} />
        <Route path="/login" element={<Logging />} />
        {/* Add student and admin dashboards here */}
      </Routes>
    </Router>
  );
}

export default App;
