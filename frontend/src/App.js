import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage'; 
import HomePage from './pages/HomePage'; 



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<LoginPage />} />
        <Route path="/SignUp" element={<SignUpPage />} />
        <Route path="/HomePage" element={<HomePage />} />

      </Routes>
    </BrowserRouter>
  );
}
export default App;