import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar1";

function ChangePasswordPage() {
  const navigate = useNavigate();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/changepassword",
        {
          old_password: oldPassword,
          new_password: newPassword,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert(response.data.message || "Password updated successfully!");
      localStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      console.error("Password change failed:", error);
      alert(error.response?.data?.error || "Failed to update password!");
    }

    setLoading(false);
  };

  const handleCancel = () => {
    setOldPassword("");
    setNewPassword("");
  };

  return (
    <div
      className="container-fluid p-0"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(145deg, #0A0F24, #11172D)",
        color: "white",
      }}
    >

      <Navbar
        brand="Change Password"
        links={[]}
        rightComponent={
          <button
            className="btn btn-outline-info btn-sm"
            style={{ borderRadius: "8px" }}
            onClick={() => window.history.back()}
          >
            ⬅ Back
          </button>
        }
      />

      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "80vh", padding: "20px" }}
      >
        <div
          className="shadow-lg p-4"
          style={{
            width: "100%",
            maxWidth: "450px",
            borderRadius: "18px",
            background: "rgba(255, 255, 255, 0.08)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            boxShadow: "0px 8px 25px rgba(0, 255, 255, 0.1)",
          }}
        >
          <h3 className="text-center fw-bold mb-4 text-info">
            Change Password
          </h3>

          <form onSubmit={handleSave}>
            <div className="mb-3">
              <label className="form-label text-light">Old Password</label>
              <input
                type="password"
                className="form-control shadow-sm"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "white",
                  borderRadius: "10px",
                }}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label text-light">New Password</label>
              <input
                type="password"
                className="form-control shadow-sm"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "white",
                  borderRadius: "10px",
                }}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div className="d-flex justify-content-center gap-3 mt-4">
              <button
                type="submit"
                className="btn btn-info px-4 fw-semibold"
                style={{ borderRadius: "10px" }}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>

              <button
                type="button"
                className="btn btn-outline-danger px-4 fw-semibold"
                style={{ borderRadius: "10px" }}
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        .form-control:focus {
          border-color: #00eaff !important;
          box-shadow: 0 0 10px rgba(0, 255, 255, 0.3) !important;
        }

        .btn-info:hover {
          box-shadow: 0px 8px 20px rgba(0,255,255,0.4);
          transform: translateY(-2px);
          transition: 0.3s;
        }
      `}</style>
    </div>
  );
}

export default ChangePasswordPage;
