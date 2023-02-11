import React from "react";
import { BrowserRouter as Router, Routes, Link, Route } from "react-router-dom";
import "./App.css";
import Main from "./components/Home/Main";
import Navbar from "./components/Home/Navbar";
import Login from "./components/Login/Login";

function App() {
  return (
    // <div>
    //   <Router>
    //     <Routes>
    //       <Route path="/" element={<Navbar/>}/>
    //       <Route path="/login">
    //         <Login />
    //       </Route>
    //     </Routes>
    //   </Router>
    // </div>
    <>
    {/* <Navbar/>
    <Main/> */}
    <Login/>
    </>
  );
}

export default App;
