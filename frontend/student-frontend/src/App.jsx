import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StudentLogin from "./pages/Students/StudentLogin";
import Dashboard from "./pages/Students/Dashboard";
import Profile from "./pages/Students/Profile";
import TestEntrance from "./pages/Students/TestEntrance";
import Test from "./pages/Students/Test";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/">
        <Route index element={<StudentLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/test-entrance" element={<TestEntrance />} />  
        <Route path="/test" element={<Test />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
