import { Route, Routes } from "react-router-dom"
import AppLayout from "./components/layout/AppLayout"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import { ThemeProvider } from "./components/theme-provider"

function App() {

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<AppLayout><HomePage /></AppLayout>} />
      </Routes>
    </ThemeProvider>
  )
}

export default App
