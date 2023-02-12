import React from "react";
import { Link } from "react-router-dom";
import Pad from "../importcompo/signuppad";
import "./Content.css";
// import Pad from "../importcompo/signuppad.jsx";

function Content() {
  return (
    <>
      <div className="row firstGrid">
        <div className="col-7 ib1">
          <div className="row secondGrid">
            <div className="col-5" id="grad">
              <h2 className="heading">
                Log in to <br />
                Internet Banking
              </h2>
              <p className="content mt-3">
                if you don't have an <br />
                account you can <br />
                <Link
                  to="/register"
                  style={{ color: "#4461F2", textDecoration: "none" }}
                >
                  Register here!
                </Link>
              </p>
            </div>
            <div className="col-7">
              <img
                src="Bank.jpg"
                className="image"
                height="100%"
                width="90%"
                alt=""
              />
            </div>
          </div>
        </div>
        <div className="col-5 ib2">
          <h4>Enter your credentials</h4>
          <input
            className="mt-3 text-center colour rounded-2"
            type="text"
            name="user"
            id=""
            placeholder="User ID"
            style={{
              width: "400px", 
              paddingTop: "0.5rem",
              paddingBottom: "0.5rem",
            }}
          />
          <br />
          {/* <textarea name="pattern" className="mt-3 text-center colour rounded-3" id="" cols="50" rows="10" placeholder="Draw your pattern"></textarea><br /> */}
          <Pad/>
          <p
            className="mt-2 text-end "
            style={{ right: "7rem", position: "relative" }}
          >
            Recover Password?
          </p>
          <button
            type="button"
            className="btn btn-primary mt-3"
            style={{ width: "400px" }}
          >
            Sign in
          </button>
        </div>
      </div>
    </>
  );
}

export default Content;
