import React from "react";
import { Link } from "react-router-dom";
import "./Register.css";

const Register = () => {
  return (
    <div className="row">
      <div
        className="col-6"
        style={{ backgroundColor: " #D7E0EA", height: "100vh" }}
      >
        <h4 className="ps-5 pt-3 fs-2">
          MANIT <span style={{ color: "#FD6F00" }}>Bank</span>
        </h4>
        <img
          className="text-center mt-5"
          src="register.png"
          alt="Register page image"
        />
      </div>
      <div className="col-6 mt-4" style={{borderRadius:'50rem'}}>
        <nav class="navbar navbar-expand-lg navbar-light bg-transparent">
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
            <ul class="navbar-nav me-auto mb-2 mb-lg-0 pos ">
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
        </nav>
        <div className='' style={{marginTop:'10rem',marginLeft:'5rem'}}>
        <h1>Create Account</h1>
        <form action="">
            <input className="mt-3 bord ps-2" type="text" name="name" placeholder="Name" />
            <br />
            <input className="mt-3 bord ps-2" type="text" name="ac num" placeholder="A/C Number" />
            <br />
            <input className="mt-3 bord ps-2" type="email" name="contact" placeholder="Email Address" />
            <br />
            <input className="mt-3 bord ps-2" type="text" name="uidai" placeholder="UIDAI" />
            <br />
            <Link to="/proceed"><button className="btn rounded-3 mt-5 ms-2 text-center" style={{backgroundColor:'#769BC1',width:'35%',color:'white'}}>Proceed</button></Link>
            <h5 className="mt-3 bord " style={{fontSize:'0.9rem'}}>Already have an account? <a href="">Login Now</a></h5>
        </form>
        </div>
      </div>
    </div>
  );
};

export default Register;