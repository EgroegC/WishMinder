import { Route, Routes } from "react-router-dom"
import AppLayout from "./components/layout/AppLayout"
import HomePage from "./pages/HomePage"


function App() {

  return (
    <Routes>
      <Route path="/" element={<AppLayout><HomePage /></AppLayout>} />
    </Routes>
  )
}

export default App
