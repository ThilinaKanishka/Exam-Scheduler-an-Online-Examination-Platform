import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Registration from "./components/Registration";
import Logging from "./components/Logging";

import Home from "./components/Home";
import Adminpanel from "./components/Adminpanel";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/Registration" element={<Registration />} />
        <Route path="/" element={<Logging />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Adminpanel" element={<Adminpanel />} />
        {/* Add student and admin dashboards here */}
      </Routes>
    </Router>
  );
}

export default App;
