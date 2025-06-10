import { Route, Routes } from "react-router-dom"
import AppLayout from "./components/layout/AppLayout"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"

function App() {

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<AppLayout><HomePage /></AppLayout>} />
    </Routes>
  )
}

export default App
