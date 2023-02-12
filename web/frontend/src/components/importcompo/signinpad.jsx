import React from "react";
import { Link } from "react-router-dom";
import "./pad.css";
function Pad() {
    
    return (
    <div className="patt colour mt-3 m-auto rounded-3" id="drawpad">
      {/* <text
        className="text-center "
        style={{
          opacity: ".7",
          justifyContent: "center",
          border: "2px solid",
        }}
      >
        Draw your pattern
      </text> */}
      <div id="watermark">Draw your Pattern</div>
      
    </div>
  );
}

export default Pad;
