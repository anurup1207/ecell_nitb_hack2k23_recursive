import React from "react";
import "./Navbar.css";

function Navbar() {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <a className="navbar-brand ps-4 fs-3 navi" href="/">
            MANIT <span style={{ color: "#FD6F00" }}>Bank</span>
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0  right">
              <li className="nav-item m-4">
                <a className="nav-link active" aria-current="page" href="/">
                  HOME
                </a>
              </li>
              <li className="nav-item m-4">
                <a className="nav-link active" aria-current="page" href="/">
                  PERSONAL BANKING
                </a>
              </li>
              <li className="nav-item m-4">
                <a className="nav-link active" aria-current="page" href="/">
                  CORPORATE BANKING
                </a>
              </li>
              <li className="nav-item m-4">
                <a className="nav-link active" aria-current="page" href="/">
                  CONTACT
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
