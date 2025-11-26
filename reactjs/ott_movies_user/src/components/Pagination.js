function Pagination({ currentPage, totalPages, onPageChange }) {
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) onPageChange(page);
  };

  return (
    <nav className="d-flex justify-content-center mt-4">
      <div className="d-flex gap-2">
        <button
          className="btn btn-sm"
          style={{
            background: "#5A4FCF",
            color: "white",
            borderRadius: "8px",
          }}
          disabled={currentPage === 1}
          onClick={() => goToPage(currentPage - 1)}
        >
          Prev
        </button>

        <span
          className="px-3 py-1 text-white"
          style={{
            background: "#1A1F27",
            borderRadius: "8px",
            fontWeight: "600",
          }}
        >
          {currentPage} / {totalPages}
        </span>

        <button
          className="btn btn-sm"
          style={{
            background: "#5A4FCF",
            color: "white",
            borderRadius: "8px",
          }}
          disabled={currentPage === totalPages}
          onClick={() => goToPage(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </nav>
  );
}

export default Pagination;
