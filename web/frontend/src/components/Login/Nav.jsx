import React from "react";
import "./Nav.css";

function Nav() {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <a className="navbar-brand ps-5 fs-3" href="/">
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
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 manit">
              <li className="nav-item m-4">
                <a
                  className="nav-link active text-primary"
                  aria-current="page"
                  href="/"
                >
                  About
                </a>
              </li>
              <li className="nav-item m-4">
                <a
                  className="nav-link active text-primary"
                  aria-current="page"
                  href="/"
                >
                  Contact
                </a>
              </li>
              <li className="nav-item dropdown m-4">
                <a
                  className="nav-link dropdown-toggle"
                  href="/"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  English
                </a>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <li>
                    <a className="dropdown-item" href="/">
                      Hindi
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/">
                      Spanish
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/">
                      Chinese
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Nav;
