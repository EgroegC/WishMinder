import { Routes, Route } from 'react-router-dom';
import HomePage from '../src/pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignUpPage';
import AppLayout from './components/layout/AppLayout';
import { ThemeProvider } from "@/components/theme-provider"
import PersistLogin from './components/authentication/PersistAuthForPages';
import RequireAuth from './components/authentication/AuthenticationForPage';
import CelebrationsPage from './pages/CelebarionsPage';
import AccountPage from './pages/AccountPage';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route element={<PersistLogin />}>
          <Route path="/" element={<AppLayout><HomePage /></AppLayout>} />
        </Route>
        <Route element={<RequireAuth />}>
          <Route path="/upcoming/celebrations" element={<AppLayout><CelebrationsPage /></AppLayout>} />
          <Route path="/account" element={<AppLayout><AccountPage /></AppLayout>} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;