import React from 'react'
import "./Navbar.css"

function Navbar() {
  return (
    <>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
  <div class="container-fluid">
    <a class="navbar-brand ps-4 fs-3 navi" href="#">MANIT <span style={{color:'#FD6F00'}}>Bank</span></a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0  right">
        <li class="nav-item m-4">
          <a class="nav-link active" aria-current="page" href="#">HOME</a>
        </li>
        <li class="nav-item m-4">
          <a class="nav-link active" aria-current="page" href="#">PERSONAL BANKING</a>
        </li>
        <li class="nav-item m-4">
          <a class="nav-link active" aria-current="page" href="#">CORPORATE BANKING</a>
        </li>
        <li class="nav-item m-4">
          <a class="nav-link active" aria-current="page" href="#">CONTACT</a>
        </li>
      </ul>
    </div>
  </div>
</nav>
    </>
  )
}

export default Navbar