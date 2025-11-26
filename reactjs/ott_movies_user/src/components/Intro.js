import React from "react";
import { Link } from "react-router-dom";
import image from '../assets/bglanding.jpeg';


function LandingPage() {
  return (
    <div 
      className="min-vh-100 d-flex flex-column justify-content-center align-items-center text-center"
      style={{
        background: `url(${image}) no-repeat center center`,
        backgroundSize: "cover",
        color: "white",
        padding: "0 20px"
    }}

    >
      <div className="bg-dark bg-opacity-50 p-5 rounded-4">
        <h1 className="display-4 fw-bold mb-3">Stream Your Favorite Movies Anytime</h1>
        <p className="lead mb-4">Unlimited movies, TV shows, and more. Watch anywhere, anytime.</p>

        <div className="d-flex justify-content-center gap-3">
          <Link 
            to="/signup" 
            className="btn btn-lg text-white fw-bold"
            style={{
              background: "linear-gradient(90deg, #4e54c8, #8f94fb)",
              borderRadius: "50px",
              padding: "10px 30px"
            }}
          >
            Sign Up
          </Link>

          <Link 
            to="/login" 
            className="btn btn-lg text-white fw-bold"
            style={{
              background: "linear-gradient(90deg, #ff416c, #ff4b2b)",
              borderRadius: "50px",
              padding: "10px 30px"
            }}
          >
            Login
          </Link>
        </div>
      </div>

      <p className="mt-5" style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.8)" }}>
        Stream. Relax. Repeat.
      </p>
    </div>
  );
}

export default LandingPage;
