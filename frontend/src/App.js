import { React, useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import RouteGuard from './components/RouteGuard';
import { setAuthToken } from './components/setAuthToken';
import VerifyUserPage from './pages/VerifyUserPage';

function App() {

  // check jwt token
  const token = localStorage.getItem("token");
  if (token) {
    setAuthToken(token);
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/SignUp" element={<SignUpPage />} />

        <Route path="/HomePage" element={<RouteGuard />}>
          <Route path="/HomePage" element={<HomePage />} />
        </Route>

        <Route path="/ProfilePage" element={<RouteGuard />}>
          <Route path="/ProfilePage" element={<ProfilePage />} />
        </Route>

        <Route path="/ResetPasswordPage" element={<ResetPasswordPage />} />
        <Route path="/VerifyUserPage" element={<VerifyUserPage />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;