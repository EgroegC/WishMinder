import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import HomePage from "./pages/HomePage";
import RequireAuth from "./components/AuthenticationForPages/RequireAuth";
import BirthdaysPage from "../src/pages/BirthdaysPage";
import NamedaysPage from "../src/pages/NamedaysPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        {/* Add other routes here */}
        <Route element={<RequireAuth />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/birthdays" element={<BirthdaysPage />} />
          <Route path="/namedays" element={<NamedaysPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
