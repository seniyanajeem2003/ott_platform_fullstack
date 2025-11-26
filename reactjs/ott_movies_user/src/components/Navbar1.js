import React from "react";


function Navbar({ brand, links = [], rightComponent }) {
  return (
    <nav
      style={{
        background: "linear-gradient(90deg, #1a1a1d, #2d1f46)",
        padding: "12px 25px",
        color: "white",
        backdropFilter: "blur(10px)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        boxShadow: "0 4px 15px rgba(0,0,0,0.6)",
        borderBottom: "1px solid rgba(138, 43, 226, 0.4)" 
      }}
      className="d-flex justify-content-between align-items-center"
    >
      <span
        className="fw-bold fs-4"
        style={{
          color: "#B592FF", 
          textShadow: "0 0 8px rgba(181, 146, 255, 0.6)"
        }}
      >
        {brand}
      </span>

      <div className="d-flex align-items-center gap-3">
        {rightComponent}
      </div>
    </nav>
  );
}

export default Navbar;
