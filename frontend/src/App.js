import { React, useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage'; 
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage'; 
import { UserContext } from './UserContext';
import ResetPasswordPage from './pages/ResetPasswordPage';

function App() {
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/SignUp" element={<SignUpPage />} />
          <Route path="/HomePage" element={<HomePage />} />
          <Route path="/ProfilePage" element={<ProfilePage />} />
          <Route path="/ResetPasswordPage" element={<ResetPasswordPage />} />
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}
export default App;