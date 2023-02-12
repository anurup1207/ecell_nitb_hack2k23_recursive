import React from "react";
import "./Content.css";

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
                <a
                  href="/"
                  style={{ color: "#4461F2", textDecoration: "none" }}
                >
                  Register here!
                </a>
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
              width: "80%",
              paddingTop: "0.5rem",
              paddingBottom: "0.5rem",
            }}
          />
          <br />
          {/* <textarea name="pattern" className="mt-3 text-center colour rounded-3" id="" cols="50" rows="10" placeholder="Draw your pattern"></textarea><br /> */}
          <div className="patt colour mt-3 m-auto rounded-3">
            <text
              className="text-center "
              style={{
                opacity: ".7",
                justifyContent: "center",
                border: "2px solid",
              }}
            >
              Draw your pattern
            </text>
          </div>
          <p
            className="mt-2 text-end "
            style={{ right: "7rem", position: "relative" }}
          >
            Recover Password?
          </p>
          <button
            type="button"
            class="btn btn-primary mt-3"
            style={{ width: "80%" }}
          >
            Sign in
          </button>
        </div>
      </div>
    </>
  );
}

export default Content;
