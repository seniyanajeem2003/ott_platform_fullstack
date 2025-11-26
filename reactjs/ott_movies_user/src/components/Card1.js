import React from "react";
import { Link } from "react-router-dom";

function Card({ title, description, image, link, children }) {
  return (
    <div
      style={{
        background: "#1A1F27",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 4px 15px rgba(0,0,0,0.4)",
        transition: "0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.03)";
        e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.5)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.4)";
      }}
      className="card h-100 border-0"
    >
      {link ? (
        <Link to={link}>
          <img
            src={image}
            alt={title}
            style={{
              width: "100%",
              height: "240px",
              objectFit: "cover",
              transition: "0.3s ease",
            }}
          />
        </Link>
      ) : (
        <img
          src={image}
          alt={title}
          style={{ width: "100%", height: "240px", objectFit: "cover" }}
        />
      )}

      <div style={{ padding: "15px", color: "white" }}>
        {link ? (
          <Link
            to={link}
            className="text-decoration-none"
            style={{ color: "#00C4FF" }}
          >
            <h5 className="fw-bold">{title}</h5>
          </Link>
        ) : (
          <h5 className="fw-bold">{title}</h5>
        )}

        <p className="text-white-50 mt-2" style={{ fontSize: "0.9rem" }}>
          {description.length > 80 ? description.slice(0, 80) + "..." : description}
        </p>

        {children && <div className="mt-3">{children}</div>}
      </div>
    </div>
  );
}

export default Card;
