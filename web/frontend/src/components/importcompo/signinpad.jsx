import React,{useState} from "react";
import "./pad.css";
function Pad() {
  const [start, setStart] = useState(false);
  const signstart = () => {

  };
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
      <div id="watermark" onclick="signstart()">
        Draw your Pattern
      </div>
    </div>
  );
}

export default Pad;
