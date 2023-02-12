import React from "react";
import { Link } from "react-router-dom";
import "./Main.css";

function Pad() {
  return (
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
  );
}

export default Pad;
