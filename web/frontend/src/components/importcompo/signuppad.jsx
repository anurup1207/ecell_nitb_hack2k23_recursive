import React from "react";
import { Link } from "react-router-dom";
import "./pad.css";
function Pad() {
  const [start, setStart] = useStte(false);
  const [mousePos, setMousePos] = useState({});
  const signstart = () => {
    setStart(true);
  };
  useEffect(() => {
    if (!start) return;
    const handleMouseMove = (event) => {
      setMousePos({ x: event.clientX, y: event.clientY });
      console.log(mousePos);
      
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [start]);

  return (
    <div className="patt colour mt-3 m-auto rounded-3" id="drawpad">
      <div id="watermark" onclick="signstart()">
        Draw your Pattern
      </div>
    </div>
  );
}

export default Pad;
