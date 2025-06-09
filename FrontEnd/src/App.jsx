import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Registration from "./components/Registration";
import Logging from "./components/Logging";

import Home from "./components/Home";
import Adminpanel from "./components/Adminpanel";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Registration />} />
        <Route path="/login" element={<Logging />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Adminpanel" element={<Adminpanel />} />
        {/* Add student and admin dashboards here */}
      </Routes>
    </Router>
  );
}

export default App;
