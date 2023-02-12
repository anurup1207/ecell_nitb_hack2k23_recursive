import React from 'react'
import './App.css'
function App() {
  return (
    <>
      <div className="row fnt" style={{ height: "100vh" }}>
        <div className="col-6 backColor text-center ">
          <h1 className="m-auto">XYZ Providers</h1>
          <p className="mt-2">Providing secure authentication solutions!</p>
          <button className="btn btn-primary rounded-3">Read More</button>
        </div>
        <div className="col-6 m-auto" style={{ paddingLeft: "11.5rem" }}>
          <h1>Hello!</h1>
          <p>Register Your Organization</p>
          <form >
            <input
              className="mainLoginInput rounded-3 ps-2"
              type="text"
              // value={user}
              name='user'
              placeholder="&#61447; Organisation Name"
            />{" "}
            <br />
            <input
              className="mainLoginInput rounded-3 ps-2"
              type="text"
              placeholder="&#61442; Email Address"
            />{" "}
            <br />
            <input
              className="mainLoginInput rounded-3 ps-2"
              type="password"
              placeholder="&#61475; Password"
            />{" "}
            <br />
            <button
              className=" btn btn-primary rounded-3 mt-2"
              type="btn bg-primary"
              style={{ width: "45%" }}
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

export default App