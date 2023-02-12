import React from "react";
import "./Nav.css";

function Nav() {
  return (
    <>
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid">
          <a class="navbar-brand ps-5 fs-3" href="/">
            MANIT <span style={{ color: "#FD6F00" }}>Bank</span>
          </a>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0 manit">
              <li class="nav-item m-4">
                <a
                  class="nav-link active text-primary"
                  aria-current="page"
                  href="/"
                >
                  About
                </a>
              </li>
              <li class="nav-item m-4">
                <a
                  class="nav-link active text-primary"
                  aria-current="page"
                  href="/"
                >
                  Contact
                </a>
              </li>
              <li class="nav-item dropdown m-4">
                <a
                  class="nav-link dropdown-toggle"
                  href="/"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  English
                </a>
                <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                  <li>
                    <a class="dropdown-item" href="/">
                      Hindi
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item" href="/">
                      Spanish
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item" href="/">
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
