import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar1";
import SearchBar from "../components/SearchBar";
import Card from "../components/Card1";
import Pagination from "../components/Pagination";

function WatchHistoryPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [watchHistoryMovies, setWatchHistoryMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSidebarDropdown, setShowSidebarDropdown] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/watchhistory/list", {
        headers: { Authorization: `Token ${token}` },
      })
      .then((res) => {
        setWatchHistoryMovies(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching history:", err);
        setLoading(false);
      });
  }, [token]);

  const moviesPerPage = 6;

  const filteredMovies = watchHistoryMovies.filter((item) =>
    (item.movie?.title || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredMovies.length / moviesPerPage);
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = filteredMovies.slice(indexOfFirstMovie, indexOfLastMovie);

  return (
    <div
      className="container-fluid p-0"
      style={{
        background: "linear-gradient(145deg, #0A0F24, #11172D)",
        minHeight: "100vh",
        color: "white",
      }}
    >
      <Navbar brand="Watch History" links={[]} />

      <div className="d-flex">

        <div className="flex-grow-1 p-4">
          <div className="row mb-4 align-items-center">
            <div className="col-md-6">
              <SearchBar onSearch={(value) => setSearchTerm(value)} />
            </div>

            <div className="col-12 d-md-none mt-3 text-center position-relative">
              <button
                className="btn btn-info px-4 py-2"
                style={{ borderRadius: "10px" }}
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
                  }}
                >
                  <li>
                    <a className="dropdown-item text-light" href="/home">
                      Home
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item text-light" href="/watchlist">
                      Watch Later
                    </a>
                  </li>
                </ul>
              )}
            </div>
          </div>

          {loading ? (
            <p className="text-center mt-4 text-info">Loading history...</p>
          ) : filteredMovies.length === 0 ? (
            <p className="text-center mt-4 text-muted">
              No movies found in watch history.
            </p>
          ) : (
            <div className="row">
              {currentMovies.map((item) => (
                <div key={item.id} className="col-md-4 col-sm-6 mb-4">
                  
                  <div
                    className="card-hover shadow-lg p-2"
                    style={{ borderRadius: "15px", transition: "0.3s" }}
                  >
                    <Card
                      title={item.movie?.title}
                      description={item.movie?.description}
                      image={
                        item.movie?.image
                          ? `http://127.0.0.1:8000${item.movie.image}`
                          : "/default-image.jpg"
                      }
                      link={`/watch/${item.movie?.id}`}
                    >
                      <button
                        className="btn btn-outline-info w-100 mt-2"
                        onClick={() => navigate(`/watch/${item.movie?.id}`)}
                      >
                        Watch Again
                      </button>
                    </Card>
                  </div>

                </div>
              ))}
            </div>
          )}

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
            width: "200px",
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(15px)",
            borderLeft: "2px solid rgba(255,255,255,0.15)",
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
              <a className="nav-link text-light fw-semibold" href="/watchlist" style={{ whiteSpace: "nowrap" }}>
                ➤ Watch Later
              </a>
            </li>
          </ul>
        </div>
      </div>

      <style>{`
        .card-hover:hover {
          transform: translateY(-5px) scale(1.02);
          box-shadow: 0px 8px 25px rgba(0, 255, 255, 0.25);
        }
      `}</style>
    </div>
  );
}

export default WatchHistoryPage;
