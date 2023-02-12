import React, { useEffect, useState } from "react";
import "./pad.css";

function Pad() {
  const canvas = document.getElementById("drawpad");
  const paintboard = canvas.getContext("2d");
  const [start, setStart] = useState(false);
  const [mousePos, setMousePos] = useState({});
  const signstart = () => {
    setStart(!start);
  };
  useEffect(() => {
    if (!start) return;
    const handleMouseMove = (event) => {
      setMousePos({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [start]);
  useEffect(() => {
    
  }, [mousePos]);

  return (
    <div
      className="patt colour mt-3 m-auto rounded-3"
      id="drawpad"
      onClick={signstart}
    >
      <div id="watermark">Draw your Pattern</div>
    </div>
  );2
}

export default Pad;
