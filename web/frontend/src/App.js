import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Main from './components/Home/Main'
import Navbar from './components/Home/Navbar'
import Login from './components/Login/Login'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={[<Navbar />,<Main/>]}>
          <Route path="/login" element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
    // <Login/>
  )
}

export default App