import { Route, Routes } from "react-router-dom"
import { ThemeProvider } from "./components/theme-provider"
import AppLayout from "./components/layout/AppLayout"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignUpPage"


function App() {

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/" element={<AppLayout><HomePage /></AppLayout>} />
      </Routes>
    </ThemeProvider>
  )
}

export default App
