function SearchBar({ onSearch }) {
  return (
    <div className="d-flex align-items-center mb-3 gap-3">
      <input
        type="text"
        placeholder="Search movies..."
        onChange={(e) => onSearch(e.target.value)}
        style={{
          width: "320px",
          padding: "10px 16px",
          borderRadius: "30px",
          border: "1px solid #5A4FCF",
          background: "#0D1117",
          color: "white",
          boxShadow: "0 0 8px rgba(90, 79, 207, 0.4)",
        }}
      />
    </div>
  );
}

export default SearchBar;
