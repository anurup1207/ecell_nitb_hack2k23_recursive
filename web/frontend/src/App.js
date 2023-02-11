import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Main from "./components/Home/Main";
import Navbar from "./components/Home/Navbar";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={[<Navbar/>,<Main/>]}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
