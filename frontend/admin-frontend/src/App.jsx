import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import Questions from "./pages/Admin/Questions";
import Students from "./pages/Admin/Students";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/">
        <Route index element={<AdminLogin />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/questions" element={<Questions />} />
        <Route path="/students" element={<Students />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
