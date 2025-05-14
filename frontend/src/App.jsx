import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import LandingPage from './pages/reactPages/LANDING.jsx';
import SignUp from './pages/reactPages/SIGNUP.jsx';
import Login from './pages/reactPages/LOGIN.jsx';
import Home from './pages/reactPages/HOME.jsx';
import Profile from './pages/reactPages/Profile.jsx';

// ✅ Custom component to protect private routes
const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('user');
  return isAuthenticated ? children : <Navigate to="/" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/login' element={<Login />} />

        {/* ✅ Protected Home Route */}
        <Route path='/home' element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        } />
        <Route path='/profile' element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
