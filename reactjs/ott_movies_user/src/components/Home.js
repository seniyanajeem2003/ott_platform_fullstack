import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar1";
import SearchBar from "../components/SearchBar";
import Card from "../components/Card1";
import Pagination from "../components/Pagination";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function MoviesPage() {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [username, setUsername] = useState("User");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/movies")
      .then((res) => {
        setMovies(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load movies");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get("http://127.0.0.1:8000/api/user", {
        headers: { Authorization: `Token ${token}` },
      })
      .then((res) => {
        const user = res.data;
        const finalName =
          user.name?.trim() || user.email?.split("@")[0] || "User";
        setUsername(finalName);
      })
      .catch(() => setUsername("User"));
  }, []);

  const handleAddToWatchLater = (movieId) => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    axios
      .post(
        "http://127.0.0.1:8000/api/watchlater/add",
        { movie_id: movieId },
        { headers: { Authorization: `Token ${token}` } }
      )
      .then(() => alert("Added to Watch Later!"))
      .catch(() => alert("Failed to add!"));
  };

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    await axios.post(
      "http://127.0.0.1:8000/api/logout",
      {},
      { headers: { Authorization: `Token ${token}` } }
    );

    localStorage.removeItem("token");
    navigate("/login");
  };

  const filteredMovies = movies.filter((movie) =>
    (movie.title || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const moviesPerPage = 6;
  const totalPages = Math.ceil(filteredMovies.length / moviesPerPage);
  const currentMovies = filteredMovies.slice(
    (currentPage - 1) * moviesPerPage,
    currentPage * moviesPerPage
  );

  if (loading)
    return <h3 className="text-center mt-5 text-info">Loading movies...</h3>;

  if (error)
    return <h3 className="text-center mt-5 text-danger">{error}</h3>;

  return (
    <div
      className="container-fluid p-0"
      style={{
        background: "linear-gradient(145deg, #090D1F, #0F1630)",
        minHeight: "100vh",
        color: "white",
      }}
    >

      <Navbar
        brand={`Welcome, ${username}`}
        rightComponent={
          <div className="d-flex align-items-center gap-2">
            <a
              href="/new_pswrd"
              className="btn btn-sm"
              style={{
                borderRadius: "8px",
                padding: "6px 14px",
                background: "rgba(0, 255, 255, 0.15)",
                border: "1px solid rgba(0, 255, 255, 0.5)",
                color: "#00FFFF",
                fontWeight: "500",
                boxShadow: "0 0 15px rgba(0,255,255,0.4)",
              }}
            >
              Change Password
            </a>

            <button
              className="btn btn-sm"
              style={{
                borderRadius: "8px",
                padding: "6px 14px",
                background: "rgba(255, 80, 80, 0.15)",
                border: "1px solid rgba(255, 50, 50, 0.6)",
                color: "#FF4D4D",
                fontWeight: "500",
                boxShadow: "0 0 15px rgba(255,60,60,0.4)",
              }}
              onClick={() => setShowLogoutModal(true)}
            >
              Logout
            </button>
          </div>
        }
      />

      <div className="d-md-none p-3">
        <div className="dropdown w-100 text-center">
          <button
            className="btn w-100"
            style={{
              background: "rgba(138, 43, 226, 0.25)",
              border: "1px solid rgba(138, 43, 226, 0.6)",
              color: "#DDB8FF",
              borderRadius: "10px",
              fontWeight: "500",
            }}
            data-bs-toggle="dropdown"
          >
            ☰ Menu
          </button>
          <ul
            className="dropdown-menu w-100 mt-2 mobile-dropdown shadow"
            style={{
              background: "#1a1333",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            <li>
              <a className="dropdown-item text-light" href="/watchlist">
                Watch Later
              </a>
            </li>
            <li>
              <a className="dropdown-item text-light" href="/watchhistory">
                Watch History
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="d-flex">
        <div className="flex-grow-1 p-4">
          <div className="row mb-4">
            <div className="col-md-6">
              <SearchBar onSearch={(v) => setSearchTerm(v)} />
            </div>
          </div>

          <div className="row">
            {currentMovies.map((movie) => (
              <div key={movie.id} className="col-md-4 col-sm-6 mb-4">
                <div
                  className="shadow-lg p-2 card-hover"
                  style={{
                    borderRadius: "14px",
                    transition: "0.3s",
                  }}
                >
                  <Card
                    title={movie.title}
                    description={movie.description}
                    image={movie.image ? `http://127.0.0.1:8000${movie.image}` : ""}
                    link={`/watch/${movie.id}`}
                  >
                    <button
                      className="btn btn-outline-info w-100 mt-2"
                      onClick={() => handleAddToWatchLater(movie.id)}
                    >
                      + Add to Watch Later
                    </button>
                  </Card>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>

        {/* Sidebar */}
        <div
          className="d-none d-md-block p-4 shadow-lg"
          style={{
            width: "200px",
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(15px)",
          }}
        >
          <h5 className="fw-bold text-info">Lists</h5>
          <ul className="nav flex-column mt-3">
            <li className="nav-item mb-3">
              <a
                className="nav-link text-light"
                href="/watchlist"
                style={{ whiteSpace: "nowrap" }}
              >
                ➤ Watch Later
              </a>
            </li>
            <li className="nav-item mb-3">
              <a
                className="nav-link text-light"
                href="/watchhistory"
                style={{ whiteSpace: "nowrap" }}
              >
                ➤ Watch History
              </a>
            </li>
          </ul>
        </div>
      </div>

      <style>{`
        .card-hover:hover {
          transform: translateY(-6px) scale(1.03);
          box-shadow: 0px 10px 30px rgba(0, 255, 255, 0.25);
        }
      `}</style>

      {/* Logout modal */}
      {showLogoutModal && (
        <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.7)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div
              className="modal-content"
              style={{
                background: "#12182B",
                borderRadius: "10px",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "white",
              }}
            >
              <div className="modal-header border-0">
                <h5>Confirm Logout</h5>
                <button
                  className="btn-close btn-close-white"
                  onClick={() => setShowLogoutModal(false)}
                ></button>
              </div>
              <div className="modal-body">Are you sure?</div>
              <div className="modal-footer border-0">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowLogoutModal(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-danger" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MoviesPage;
