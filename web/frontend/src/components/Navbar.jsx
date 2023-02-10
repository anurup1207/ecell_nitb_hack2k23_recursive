import React from 'react'
import "./Navbar.css"

function Navbar() {
  return (
    <>
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
  <div className="container-fluid">
    <a className="navbar-brand nav" href="#">MANIT <p style={{color:'#FD6F00'}}>Bank</p></a>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav me-auto mb-2 mb-lg-0 m-auto">
        <li className="nav-item m-3">
          <a className="nav-link active" aria-current="page" href="#">HOME</a>
        </li>
        <li  className="nav-item m-3">
          <a className="nav-link" href="#">PERSONAL BANKING</a>
        </li>
        <li className="nav-item m-3">
          <a className="nav-link" href="#">CORPORATE BANKING</a>
        </li>
        <li className="nav-item m-3">
          <a className="nav-link" href="#">CONTACT</a>
        </li>
      </ul>
    </div>
  </div>
</nav>
    </>
  )
}

export default Navbar