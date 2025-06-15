import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchComplaint,
  viewReportIssue,
} from "../../ReduxState/Users/Action/Action";
import { FaSearch, FaFilter, FaEye } from "react-icons/fa";
import MobileHeader from "./U_MobileHeader";
import { useNavigate } from "react-router-dom";

const StatusBadge = ({ status }) => {
  const colorMap = {
    pending: "bg-yellow-500/20 text-yellow-200 ring-yellow-500/50",
    resolved: "bg-green-500/20 text-green-200 ring-green-500/50",
    inprogress: "bg-blue-500/20 text-blue-200 ring-blue-500/50",
    rejected: "bg-red-500/20 text-red-200 ring-red-500/50",
  };

  return (
    <span
      className={`px-2 sm:px-3 py-1 rounded-full text-sm font-semibold ring-1 transition-all duration-300 hover:ring-2 ${
        colorMap[status?.toLowerCase()] ||
        "bg-gray-500/20 text-gray-200 ring-gray-500/50"
      }`}
      aria-label={`Status: ${status}`}
    >
      {status
        ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
        : "Unknown"}
    </span>
  );
};

const ComplainList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const report = useSelector((state) => state.complainList?.report || []);
  const { loading, error } = useSelector((state) => state.complainList || {});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [sortOrder, setSortOrder] = useState("desc");
  const [complaints, setComplaints] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowFilterDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch complaints
  useEffect(() => {
    dispatch(fetchComplaint());
  }, [dispatch]);

  // Validate and set complaints
  useEffect(() => {
    if (Array.isArray(report)) {
      const validatedComplaints = report.filter((issue) => {
        if (!issue.id || !issue.title || !issue.status) {
          console.warn("Invalid complaint data:", issue);
          return false;
        }
        return true;
      });
      setComplaints(validatedComplaints);
      setCurrentPage(1); // Reset to page 1 on new data
    } else {
      console.warn("Report is not an array:", report);
      setComplaints([]);
    }
  }, [report]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedStatus]);

  const handleView = async (issue) => {
    try {
      await dispatch(viewReportIssue(issue.id)).unwrap();
      navigate(`/user/viewIssue/${issue.id}`);
    } catch (error) {
      console.error("Failed to fetch complaint details:", error);
      const message =
        error?.status === 401
          ? "Session expired. Please log in again."
          : error?.status === 403
          ? "You are not authorized to view this complaint."
          : "Failed to load complaint details.";
      console.error(message);
      if (error?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  };

  const filteredComplaints = complaints
    .filter((issue) => {
      const title = (issue.title || "").toLowerCase();
      const name = (issue.name || "").toLowerCase();
      const status = (issue.status || "").toLowerCase();
      const search = searchTerm.toLowerCase();

      const matchesSearch = title.includes(search) || name.includes(search);
      const matchesStatus = selectedStatus
        ? status === selectedStatus.toLowerCase()
        : true;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

  const totalPages = Math.ceil(filteredComplaints.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedComplaints = filteredComplaints.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const statusOptions = ["Pending", "In Progress", "Resolved", "Rejected"];

  if (loading) {
    return (
      <div
        className="text-center text-gray-400 py-20 animate-pulse bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen"
        role="status"
        aria-live="polite"
      >
        <p className="text-lg md:text-xl font-semibold">
          Loading complaints...
        </p>
        <span className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mt-4"></span>
      </div>
    );
  }

  if (error) {
    return (
      <p
        className="text-center text-red-400 py-20 text-lg md:text-xl font-semibold bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen"
        role="alert"
        aria-live="polite"
      >
        Error: {error}
      </p>
    );
  }

  return (
    <div>
      <MobileHeader />
      <div className="bg-transparent mt-10 sm:mt-0 pb-10 sm:pb-0">
        <div className="p-3 sm:p-4 md:p-6 lg:p-8 max-w-5xl mx-auto" role="main">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white mb-2">
            My Complains
          </h2>
          <p className="text-gray-300 text-sm sm:text-base">
            View and manage your submitted complaints below.
          </p>

          {/* Search and Filter Controls */}
          {/* <div className="flex flex-row gap-3 sm:gap-4 mb-6">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by title or user..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/10 backdrop-blur-lg text-white placeholder-gray-400 border border-gray-300/30 rounded-lg py-2 sm:py-3 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm md:text-base"
                aria-label="Search complaints"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="flex items-center justify-center bg-blue-500/20 text-blue-200 p-2 sm:py-3 sm:px-6 rounded-lg hover:bg-blue-500/40 transition-all duration-300 min-w-[44px] min-h-[44px]"
                aria-label="Filter by status"
                aria-expanded={showFilterDropdown}
              >
                <FaFilter className="text-lg" />
                <span className="hidden sm:inline ml-2 text-sm md:text-base">
                  {selectedStatus || "Filter by Status"}
                </span>
              </button>
              {showFilterDropdown && (
                <div className="absolute left-0 sm:right-0 top-12 bg-white/10 backdrop-blur-lg border border-gray-300/30 rounded-lg shadow-lg z-10 min-w-[140px]">
                  <div className="py-2">
                    <button
                      onClick={() => {
                        setSelectedStatus("");
                        setShowFilterDropdown(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-white hover:bg-white/5 text-sm md:text-base ${
                        !selectedStatus ? "bg-blue-500/20 font-semibold" : ""
                      }`}
                      aria-current={!selectedStatus}
                    >
                      All
                    </button>
                    {statusOptions.map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          setSelectedStatus(status);
                          setShowFilterDropdown(false);
                        }}
                        className={`block w-full text-left px-4 py-2 text-white hover:bg-white/5 text-sm md:text-base ${
                          selectedStatus === status
                            ? "bg-blue-500/20 font-semibold"
                            : ""
                        }`}
                        aria-current={selectedStatus === status}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div> */}

          {filteredComplaints.length === 0 ? (
            <p
              className="text-center text-gray-400 py-20 text-lg md:text-xl font-semibold"
              role="status"
              aria-live="polite"
            >
              No complaints found.
            </p>
          ) : (
            <div className="overflow-x-auto bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl mt-4 sm:mt-6">
              <table className="w-full border-collapse min-w-[600px]">
                <thead
                  className="sticky top-0 bg-gradient-to-r from-gray-700 to-gray-600 text-white text-sm md:text-base font-semibold uppercase shadow-md"
                  role="rowgroup"
                >
                  <tr role="row">
                    <th
                      className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-left w-[60px]"
                      scope="col"
                    >
                      #
                    </th>
                    <th
                      className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-left min-w-[150px]"
                      scope="col"
                    >
                      Title
                    </th>
                    <th
                      className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-left w-[120px]"
                      scope="col"
                    >
                      Status
                    </th>
                    <th
                      className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-left min-w-[150px]"
                      scope="col"
                    >
                      Address
                    </th>
                    <th
                      className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-left w-[100px]"
                      scope="col"
                    >
                      Date
                    </th>
                    <th
                      className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-left w-[80px]"
                      scope="col"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody
                  className="divide-y divide-gray-700 text-sm md:text-base"
                  role="rowgroup"
                >
                  {paginatedComplaints.map((issue, index) => (
                    <tr
                      key={issue.id}
                      className="hover:bg-white/5 transition-all duration-300"
                      role="row"
                    >
                      <td
                        className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-gray-200"
                        role="cell"
                      >
                        {startIndex + index + 1}
                      </td>
                      <td
                        className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 truncate font-medium text-gray-200"
                        role="cell"
                      >
                        {issue.title || "N/A"}
                      </td>
                      <td
                        className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4"
                        role="cell"
                      >
                        <StatusBadge status={issue.status} />
                      </td>
                      <td
                        className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-gray-200"
                        role="cell"
                      >
                        {issue.address || "N/A"}
                      </td>
                      <td
                        className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-gray-400"
                        role="cell"
                      >
                        {issue.createdAt
                          ? new Date(issue.createdAt).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td
                        className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4"
                        role="cell"
                      >
                        <button
                          onClick={() => handleView(issue)}
                          className="bg-blue-500/20 text-blue-200 p-2 rounded-full hover:bg-blue-500/40 transition-all duration-300 min-w-[40px] min-h-[40px] flex items-center justify-center"
                          aria-label={`View details for complaint ${
                            issue.title || "unknown"
                          }`}
                        >
                          <FaEye />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 py-4 sm:py-6">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 sm:px-4 py-2 rounded-lg text-sm md:text-base font-medium transition-all duration-200 ${
                  currentPage === 1
                    ? "bg-gray-600/50 text-gray-400 cursor-not-allowed"
                    : "bg-blue-500/20 text-blue-200 hover:bg-blue-500/40"
                }`}
                aria-label="Previous page"
              >
                Previous
              </button>
              <span className="my-2 text-gray-50 sm:my-2">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 sm:px-4 py-2 rounded-lg text-sm md:text-base font-medium transition-all duration-200 ${
                  currentPage === totalPages
                    ? "bg-gray-600/50 text-gray-400 cursor-not-allowed"
                    : "bg-blue-500/20 text-blue-200 hover:bg-blue-500/40"
                }`}
                aria-label="Next page"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplainList;
