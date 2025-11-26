import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const user = {
      name: formData.username,
      email: formData.email,
      password: formData.password,
    };

    axios
      .post("http://127.0.0.1:8000/api/signup", user)
      .then(() => navigate("/login"))
      .catch((error) => {
        if (error.response?.data?.errors) {
          alert(Object.values(error.response.data.errors).join(" "));
        } else {
          alert("Failed to connect to API");
        }
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
          background: "rgba(20, 20, 35, 0.8)",
          borderRadius: "20px",
          padding: "25px",
          boxShadow: "0px 0px 25px rgba(0,0,0,0.6)",
          backdropFilter: "blur(10px)",
        }}
      >
        <h2
          className="text-center fw-bold mb-4"
          style={{
            color: "#ffffff",
            fontSize: "32px",
            letterSpacing: "1px",
          }}
        >
          Create Account
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold" style={{ color: "#ddd" }}>
              Full Name
            </label>
            <input
              type="text"
              name="username"
              className="form-control rounded-pill"
              placeholder="Enter your name"
              onChange={handleChange}
              required
              style={{
                background: "#1a1a2e",
                border: "1px solid #3a3a5c",
                color: "#fff",
              }}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold" style={{ color: "#ddd" }}>
              Email Address
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

          <div className="mb-3">
            <label className="form-label fw-semibold" style={{ color: "#ddd" }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              className="form-control rounded-pill"
              placeholder="Create a password"
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
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              className="form-control rounded-pill"
              placeholder="Confirm password"
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
            Sign Up
          </button>
        </form>

        <p className="text-center mt-3 mb-1" style={{ color: "#bbb" }}>
          Already have an account?{" "}
          <Link
            to="/login"
            style={{ color: "#a78bfa", textDecoration: "none" }}
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
