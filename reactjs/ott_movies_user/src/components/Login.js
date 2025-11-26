import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("http://127.0.0.1:8000/api/login", data)
      .then((response) => {
        if (!response.data.token) {
          alert("Token not found!");
          return;
        }
        localStorage.setItem("token", response.data.token);
        navigate("/home");
      })
      .catch(() => {
        alert("Login failed!");
      });
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
        padding: "20px",
      }}
    >
      <div
        className="col-md-5 col-lg-4"
        style={{
          background: "rgba(20, 20, 35, 0.85)",
          borderRadius: "20px",
          padding: "30px",
          boxShadow: "0px 0px 25px rgba(0,0,0,0.65)",
          backdropFilter: "blur(10px)",
        }}
      >
        <h2
          className="text-center fw-bold mb-4"
          style={{
            color: "#ffffff",
            fontSize: "30px",
            letterSpacing: "1px",
          }}
        >
          Login
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold" style={{ color: "#ddd" }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              className="form-control rounded-pill"
              placeholder="Enter your email"
              onChange={handleChange}
              required
              style={{
                background: "#1a1a2e",
                border: "1px solid #3a3a5c",
                color: "#fff",
              }}
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold" style={{ color: "#ddd" }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              className="form-control rounded-pill"
              placeholder="Enter your password"
              onChange={handleChange}
              required
              style={{
                background: "#1a1a2e",
                border: "1px solid #3a3a5c",
                color: "#fff",
              }}
            />
          </div>

          <button
            type="submit"
            className="btn w-100 fw-bold rounded-pill"
            style={{
              background: "linear-gradient(135deg, #8E2DE2, #4A00E0)",
              color: "#fff",
              padding: "12px 0",
              fontSize: "16px",
              boxShadow: "0px 4px 15px rgba(78,0,224,0.5)",
            }}
          >
            Login
          </button>
        </form>

        <p className="text-center mt-3" style={{ color: "#bbb" }}>
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-decoration-none"
            style={{ color: "#a78bfa" }}
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
