import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { viewReportIssue } from "../../ReduxState/Users/Action/Action";
// import { toast } from "react-toastify";

const StatusBadge = ({ status }) => {
  const colorMap = {
    pending: "bg-yellow-500/20 text-yellow-200 ring-yellow-500/50",
    resolved: "bg-green-500/20 text-green-200 ring-green-500/50",
    inprogress: "bg-blue-500/20 text-blue-200 ring-blue-500/50",
    rejected: "bg-red-500/20 text-red-200 ring-red-500/50",
  };

  return (
    <span
      className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ring-1 transition-all duration-300 hover:ring-2 ${
        colorMap[status.toLowerCase()] ||
        "bg-gray-500/20 text-gray-200 ring-gray-500/50"
      }`}
      aria-label={`Status: ${status}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
    </span>
  );
};

const ViewComplain = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selectedIssue = useSelector(
    (state) => state.complainList?.selectedIssue
  );
  const { loading, error } = useSelector((state) => state.complainList || {});

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        await dispatch(viewReportIssue(id)).unwrap();
      } catch (err) {
        console.error("Failed to fetch issue:", err);
        const message =
          err?.status === 401
            ? "Session expired. Please log in again."
            : err?.status === 403
            ? "You are not authorized to view this complaint."
            : "Failed to load complaint details.";
        console.error(message);
        if (err?.status === 401) {
          navigate("/login");
        } else {
          navigate("/user/myIssue");
        }
      }
    };
    fetchIssue();
  }, [dispatch, id, navigate]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-70">
        <div className="text-white text-sm sm:text-base md:text-lg animate-pulse p-4 sm:p-6 bg-gray-800 rounded-lg shadow-xl">
          Loading...
        </div>
      </div>
    );
  }

  if (error || !selectedIssue) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-70">
        <div className="text-red-400 text-sm sm:text-base md:text-lg p-4 sm:p-6 bg-gray-800 rounded-lg shadow-xl">
          Error: {error || "Complaint not found"}
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-70 px-2 sm:px-4 md:px-6 lg:px-8 animate-fade"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative bg-white/20 backdrop-blur-lg w-full max-w-[95vw] sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl rounded-2xl sm:rounded-3xl shadow-2xl overflow-y-auto max-h-[90vh] p-3 sm:p-4 md:p-6 lg:p-8 border border-gray-300/30">
        <button
          onClick={() => navigate("/user/myIssue")}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-gray-700/50 rounded-full p-2 text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 min-w-[36px] sm:min-w-[40px] min-h-[36px] sm:min-h-[40px]"
          aria-label="Close complaint details"
        >
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <div className="text-center mb-4 sm:mb-6">
          <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white truncate px-2 sm:px-0">
            {selectedIssue.title}
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm md:text-base mt-1 sm:mt-2">
            {new Date(selectedIssue.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm md:text-base text-gray-300">
          <p>
            <strong className="text-white font-semibold">User:</strong>{" "}
            <span className="break-words">{selectedIssue.name || "N/A"}</span>
          </p>
          <p>
            <strong className="text-white font-semibold">Email:</strong>{" "}
            <span className="break-words">{selectedIssue.email || "N/A"}</span>
          </p>
          <p>
            <strong className="text-white font-semibold">Status:</strong>{" "}
            <StatusBadge status={selectedIssue.status.toLowerCase()} />
          </p>
          <p>
            <strong className="text-white font-semibold">Location:</strong>{" "}
            <span className="break-words">
              {selectedIssue.location || "N/A"}
            </span>
          </p>
          <p className="whitespace-pre-line">
            <strong className="text-white font-semibold">Description:</strong>{" "}
            <span className="break-words">
              {selectedIssue.description || "No description provided."}
            </span>
          </p>
          {selectedIssue.picture && (
            <div>
              <strong className="text-white font-semibold block mb-2">
                Image:
              </strong>
              <img
                src={selectedIssue.picture}
                alt={`Complaint ${selectedIssue.title}`}
                className="max-w-full h-24 sm:h-32 md:h-40 lg:h-48 xl:h-64 object-contain rounded-lg border border-gray-700 shadow-sm"
                loading="lazy"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewComplain;
