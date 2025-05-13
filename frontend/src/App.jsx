import React from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LandingPage from './pages/reactPages/LANDING.jsx'
import SignUp from './pages/reactPages/SIGNUP.jsx'
import Login from './pages/reactPages/LOGIN.jsx'
import Home from './pages/reactPages/HOME.jsx'

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<LandingPage />} />
      <Route path='/home' element={<Home />} />
      <Route path='/sign-up' element={<SignUp />} />
      <Route path='/login' element={<Login />} />
    </Routes>
  </BrowserRouter>
  )
}

export default App
