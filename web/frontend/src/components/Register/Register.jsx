import React from "react";
import "./Register.css";

function Register() {
  return (
    // <div className="container-fluid">
    <>
    <div className="row fnt" style={{height:'100vh'}}>
      <div className="col-6 backColor text-center ">
        <h1 className="m-auto">XYZ Providers</h1>
        <p className="mt-2">Providing secure authentication solutions!</p>
        <button className="btn btn-primary rounded-3">Read More</button>
      </div>
      <div className="col-6 m-auto" style={{paddingLeft:'11.5rem'}}>
        <h1>Hello!</h1>
        <p>Register Your Organization</p>
        <input class="mainLoginInput rounded-3 ps-2" type="text" placeholder="&#61447; Organisation Name" />{" "}
        <br />
        <input
          class="mainLoginInput rounded-3 ps-2"
          type="text"
          placeholder="&#61442; Email Address"
        />{" "}
        <br />
        <input class="mainLoginInput rounded-3 ps-2" type="password" placeholder="&#61475; Password" />{" "}
        <br />
        <button className=" btn btn-primary rounded-3 mt-2" type="btn bg-primary" style={{width:'45%'}}>Register</button>
      </div>
    </div>
    </>
    // </div>
  );
}

export default Register;
