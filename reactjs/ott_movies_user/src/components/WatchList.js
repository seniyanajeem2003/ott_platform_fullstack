import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar1";
import SearchBar from "../components/SearchBar";
import Card from "../components/Card1";
import Pagination from "../components/Pagination";
import axios from "axios";

function WatchListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showSidebarDropdown, setShowSidebarDropdown] = useState(false);
  const [watchListMovies, setWatchListMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [movieToRemove, setMovieToRemove] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/watchlater/list", {
        headers: { Authorization: `Token ${token}` },
      })
      .then((res) => {
        setWatchListMovies(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load watchlist");
        setLoading(false);
      });
  }, [token]);

  const handleRemove = (movieId) => {
    axios
      .delete("http://127.0.0.1:8000/api/watchlater/remove", {
        headers: { Authorization: `Token ${token}` },
        data: { movie_id: movieId },
      })
      .then(() => {
        setWatchListMovies((prev) =>
          prev.filter((item) => item.movie.id !== movieId)
        );
      })
      .catch(() => alert("Failed to remove!"));
  };

  const filteredMovies = watchListMovies.filter((item) =>
    (item.movie?.title || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const moviesPerPage = 6;
  const totalPages = Math.ceil(filteredMovies.length / moviesPerPage);
  const indexOfLastMovie = currentPage * moviesPerPage;
  const currentMovies = filteredMovies.slice(
    indexOfLastMovie - moviesPerPage,
    indexOfLastMovie
  );

  if (loading)
    return <h3 className="text-center mt-5 text-info">Loading...</h3>;
  if (error)
    return <h3 className="text-center mt-5 text-danger">{error}</h3>;

  return (
    <div
      className="container-fluid p-0"
      style={{
        background: "linear-gradient(145deg, #0A0F24, #11172D)",
        minHeight: "100vh",
        color: "white",
      }}
    >
     
      <Navbar brand="Watch Later" links={[]} />

      <div className="d-flex">
        <div className="flex-grow-1 p-4">

          <div className="row mb-4 align-items-center">
            <div className="col-md-6">
              <SearchBar onSearch={(value) => setSearchTerm(value)} />
            </div>

            <div className="col-12 d-md-none mt-3 text-center">
              <button
                className="btn btn-info px-4 py-2"
                style={{
                  borderRadius: "10px",
                  boxShadow: "0px 0px 12px rgba(0,255,255,0.4)",
                }}
                onClick={() => setShowSidebarDropdown(!showSidebarDropdown)}
              >
                Lists
              </button>

              {showSidebarDropdown && (
                <ul
                  className="dropdown-menu show shadow mt-2"
                  style={{
                    left: "50%",
                    transform: "translateX(-50%)",
                    borderRadius: "12px",
                    background: "#1e233a",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <li>
                    <a className="dropdown-item text-light" href="/home" >
                      Home
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item text-light" href="/watchhistory">
                      Watch History
                    </a>
                  </li>
                </ul>
              )}
            </div>
          </div>

          <div className="row">
            {currentMovies.map((item) => (
              <div key={item.movie.id} className="col-md-4 col-sm-6 mb-4">
                <div
                  className="card-hover shadow-lg p-2"
                  style={{
                    transition: "0.3s",
                    borderRadius: "15px",
                    background: "rgba(20,25,45,0.6)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <Card
                    title={item.movie.title}
                    description={item.movie.description}
                    image={`http://127.0.0.1:8000${item.movie.image}`}
                    link={`/watch/${item.movie.id}`}
                  >
                    <button
                      className="btn btn-outline-danger w-100 mt-2"
                      style={{
                        borderRadius: "8px",
                        borderColor: "#ff4f6b",
                        color: "#ff4f6b",
                      }}
                      onClick={() => {
                        setMovieToRemove(item.movie.id);
                        setShowModal(true);
                      }}
                    >
                      Remove
                    </button>
                  </Card>
                </div>
              </div>
            ))}
          </div>

          {currentMovies.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          )}
        </div>

        <div
          className="d-none d-md-block p-4 shadow-lg"
          style={{
            width: "230px",
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(15px)",
            borderLeft: "2px solid rgba(255,255,255,0.15)",
            minHeight: "100vh",
          }}
        >
          <h5 className="fw-bold text-info">Lists</h5>
          <ul className="nav flex-column mt-3">
            <li className="nav-item mb-3">
              <a className="nav-link text-light fw-semibold" href="/home" style={{ whiteSpace: "nowrap" }}>
                ➤ Home
              </a>
            </li>
            <li className="nav-item mb-3">
              <a className="nav-link text-light fw-semibold" href="/watchhistory" style={{ whiteSpace: "nowrap" }}>
                ➤ Watch History
              </a>
            </li>
          </ul>
        </div>
      </div>

      {showModal && (
        <div
          className="modal fade show"
          style={{
            display: "block",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div
              className="modal-content"
              style={{
                background: "#14192d",
                color: "white",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              <div className="modal-header border-0">
                <h5 className="modal-title text-info">Remove Movie</h5>
                <button
                  className="btn-close btn-close-white"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">Are you sure you want to remove this movie?</div>
              <div className="modal-footer border-0">
                <button
                  className="btn btn-secondary"
                  style={{
                    background: "#1e253d",
                    border: "1px solid rgba(255,255,255,0.2)",
                  }}
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    handleRemove(movieToRemove);
                    setShowModal(false);
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .card-hover:hover {
          transform: translateY(-5px) scale(1.02);
          box-shadow: 0px 8px 25px rgba(0, 255, 255, 0.25);
        }
      `}</style>
    </div>
  );
}

export default WatchListPage;
