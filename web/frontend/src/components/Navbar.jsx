import React from 'react'
import "./Navbar.css"

function Navbar() {
  return (
    <>
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
  <div className="container-fluid">
    <a className="navbar-brand nav" href="#"> <text> MANIT </text> <p style={{color:'#FD6F00'}}>Bank</p></a>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav me-auto mb-2 mb-lg-0 navbar">
        <li className="nav-item m-3">
          <a className="nav-link active" aria-current="page" href="#">HOME</a>
        </li>
        <li  className="nav-item m-3">
          <a className="nav-link active" href="#">PERSONAL BANKING</a>
        </li>
        <li className="nav-item m-3">
          <a className="nav-link active" href="#">CORPORATE BANKING</a>
        </li>
        <li className="nav-item m-3">
          <a className="nav-link active" href="#">CONTACT</a>
        </li>
      </ul>
    </div>
  </div>
</nav>
    </>
  )
}

export default Navbar