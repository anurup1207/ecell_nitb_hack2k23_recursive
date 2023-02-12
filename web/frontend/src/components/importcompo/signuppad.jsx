import React, { useEffect, useState } from "react";
import "./pad.css";
import ReactDOM from "react-dom";
import CanvasDraw from "react-canvas-draw";

function Pad() {
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
  useEffect(() => {}, [mousePos]);

  return (
    <div>
      <div id="watermark">Draw Here    </div>
      <div
        className="patt"
        id="drawpad"
        style={{ height: 300, marginTop: 10, marginLeft: 110 }}
      >
        <CanvasDraw
          canvasWidth={400}
          canvasHeight={300}
          backgroundColor={"#EAF0F7"}
          brushRadius={10}
        />
      </div>
    </div>
  );
}

export default Pad;
