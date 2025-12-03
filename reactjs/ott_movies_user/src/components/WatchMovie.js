import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar1";

function WatchMoviePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login again");
      navigate("/");
      return;
    }

    axios
      .get(`http://127.0.0.1:8000/api/get_movie/${id}/`, {
        headers: { Authorization: `Token ${token}` },
      })
      .then((res) => {
        setMovie(res.data);
        setLoading(false);

        axios.post(
          "http://127.0.0.1:8000/api/watchhistory/add",
          { movie_id: id },
          { headers: { Authorization: `Token ${token}` } }
        );
      })
      .catch((err) => {
        console.error("Error fetching movie:", err);
        setLoading(false);
      });

    axios
      .get(`http://127.0.0.1:8000/api/comments/${id}/`, {
        headers: { Authorization: `Token ${token}` },
      })
      .then((res) => {
        setComments(res.data);
      })
      .catch((err) => {
        console.error("Error loading comments:", err);
      });
  }, [id, navigate]);

  const handleAddComment = () => {
    if (!newComment.trim()) {
      alert("Comment cannot be empty");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Login expired. Please login again.");
      return;
    }

    axios
      .post(
        "http://127.0.0.1:8000/api/comments/add",
        {
          movie: id,
          comment: newComment,
        },
        {
          headers: { Authorization: `Token ${token}` },
        }
      )
      .then((res) => {
        setComments([res.data, ...comments]);
        setNewComment("");
      })
      .catch((err) => {
        console.error("Error adding comment:", err);
        alert("Failed to add comment");
      });
  };

  if (loading)
    return <p className="text-center text-light mt-5">Loading movie...</p>;

  if (!movie)
    return <p className="text-center text-light mt-5">Movie not found.</p>;

  return (
    <div
      className="container-fluid p-0"
      style={{
        background: "linear-gradient(180deg, #0d0d11, #1a1625)",
        minHeight: "100vh",
        color: "white",
      }}
    >
      <Navbar
        brand="Watch Movie"
        links={[]}
        rightComponent={
          <button
            className="btn"
            style={{
              background: "#8E5CFF",
              color: "white",
              borderRadius: "6px",
              padding: "6px 16px",
              fontWeight: "500",
              boxShadow: "0 0 10px rgba(142,92,255,0.5)",
            }}
            onClick={() => navigate("/home")}
          >
            Back to Home
          </button>
        }
      />

      <div
        className="container mt-5 p-4"
        style={{
          maxWidth: "850px",
          background: "rgba(255, 255, 255, 0.05)",
          borderRadius: "15px",
          boxShadow: "0 0 25px rgba(142, 92, 255, 0.15)",
          backdropFilter: "blur(8px)",
        }}
      >
        <h2 className="fw-bold" style={{ color: "#B592FF" }}>
          {movie.title}
        </h2>

        <p className="text-light" style={{ opacity: 0.7 }}>
          {movie.description}
        </p>

        <div
          className="mt-4 rounded overflow-hidden shadow"
          style={{
            border: "1px solid rgba(142,92,255,0.3)",
            borderRadius: "10px",
            boxShadow: "0 0 20px rgba(142,92,255,0.2)",
          }}
        >
          {movie.video_url?.includes("youtube.com") ? (
            <iframe
              width="100%"
              height="460"
              src={movie.video_url}
              title={movie.title}
              style={{ border: "none" }}
              allowFullScreen
            ></iframe>
          ) : (
            <video
              width="100%"
              height="460"
              controls
              style={{ borderRadius: "10px", background: "black" }}
            >
              <source
                src={`http://127.0.0.1:8000${movie.video_file}`}
                type="video/mp4"
              />
            </video>
          )}
        </div>

        <div
          className="mt-4 p-3"
          style={{ background: "#14141e", borderRadius: "10px" }}
        >
          <h5 className="text-light mb-3">Comments</h5>

          <div className="d-flex mb-3">
            <input
              type="text"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="form-control me-2"
              style={{
                background: "#1f1f2e",
                color: "white",
                border: "none",
              }}
            />
            <button
              type="button"
              onClick={handleAddComment}
              className="btn"
              style={{ background: "#8E5CFF", color: "white" }}
            >
              Post
            </button>
          </div>

          {comments.length === 0 ? (
            <p className="text-secondary">No comments yet.</p>
          ) : (
            comments.map((c) => (
              <div
                key={c.id}
                className="mb-2 p-2"
                style={{
                  background: "#1c1c2b",
                  borderRadius: "8px",
                  borderLeft: "3px solid #8E5CFF",
                }}
              >
                <strong style={{ color: "#B592FF" }}>{c.user_name}</strong>
                <p className="m-0 text-light">{c.comment}</p>
                <small className="text-secondary">
                  {new Date(c.created_at).toLocaleString()}
                </small>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default WatchMoviePage;
