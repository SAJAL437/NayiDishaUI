import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaSearch, FaFilter, FaEye, FaTrash, FaDownload } from "react-icons/fa";
import {
  fetchAllIssues,
  updateIssueStatus,
  deleteIssue,
  viewComplain,
} from "../../ReduxState/Admin/Actions/Action";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import MobileHeader from "./MobileHeader";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const statusOptions = ["PENDING", "INPROGRESS", "RESOLVED", "REJECTED"];

const StatusBadge = ({ status }) => {
  const colorMap = {
    PENDING: "bg-yellow-500/20 text-yellow-400",
    INPROGRESS: "bg-purple-500/20 text-purple-400",
    RESOLVED: "bg-green-600/20 text-green-400",
    REJECTED: "bg-red-500/20 text-red-400",
  };

  const normalizedStatus = status?.toUpperCase() || "N/A";
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-semibold ${
        colorMap[normalizedStatus] || "bg-gray-500/20 text-gray-400"
      }`}
      aria-label={`Status: ${normalizedStatus}`}
    >
      {normalizedStatus === "N/A"
        ? "N/A"
        : normalizedStatus.charAt(0) + normalizedStatus.slice(1).toLowerCase()}
    </span>
  );
};

const IssueList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    issues = [],
    loading,
    error,
    currentPage = 0,
    totalPages = 1,
  } = useSelector((state) => state.issueList || {});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const filterRef = useRef(null);
  const exportRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilterDropdown(false);
      }
      if (exportRef.current && !exportRef.current.contains(event.target)) {
        setShowExportDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch issues with debounced search and filter
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFetching(true);
      dispatch(
        fetchAllIssues({
          page: 0,
          size: 6,
          sortBy: "createdAt",
          search: searchTerm.trim().replace(/[^\w\s]/gi, ""),
          status: selectedStatus || undefined,
        })
      ).finally(() => setIsFetching(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [dispatch, searchTerm, selectedStatus]);

  const handlePageChange = (newPage) => {
    if (newPage < 0 || newPage >= totalPages) return;
    setIsFetching(true);
    dispatch(
      fetchAllIssues({
        page: newPage,
        size: 6,
        sortBy: "createdAt",
        search: searchTerm.trim().replace(/[^\w\s]/gi, ""),
        status: selectedStatus || undefined,
      })
    ).finally(() => setIsFetching(false));
  };

  const handleStatusChange = (id, newStatus) => {
    dispatch(updateIssueStatus({ id, status: newStatus })).then(() => {
      dispatch(
        fetchAllIssues({
          page: currentPage,
          size: 6,
          sortBy: "createdAt",
          search: searchTerm.trim().replace(/[^\w\s]/gi, ""),
          status: selectedStatus || undefined,
        })
      );
    });
  };

  const handleView = async (issue) => {
    try {
      await dispatch(viewComplain(issue.id)).unwrap();
      navigate(`/admin/Issue/${issue.id}`);
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

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this issue?")) {
      dispatch(deleteIssue(id))
        .then(() => {
          const newPage =
            issues.length === 1 && currentPage > 0
              ? currentPage - 1
              : currentPage;
          dispatch(
            fetchAllIssues({
              page: newPage,
              size: 6,
              sortBy: "createdAt",
              search: searchTerm.trim().replace(/[^\w\s]/gi, ""),
              status: selectedStatus || undefined,
            })
          );
          toast.success("Issue deleted successfully.");
        })
        .catch(() => {
          toast.error("Failed to delete issue.");
        });
    }
  };

  const handleRetry = () => {
    setIsFetching(true);
    dispatch(
      fetchAllIssues({
        page: 0,
        size: 6,
        sortBy: "createdAt",
        search: searchTerm.trim().replace(/[^\w\s]/gi, ""),
        status: selectedStatus || undefined,
      })
    ).finally(() => setIsFetching(false));
  };

  const exportToPDF = () => {
    try {
      if (!issues?.length) {
        toast.warn("No issues available to export.");
        return;
      }
      const doc = new jsPDF();
      doc.setFontSize(12);
      doc.text("Complaints Report", 20, 20);
      autoTable(doc, {
        startY: 30,
        head: [["ID", "Username", "Title", "Created At", "Status"]],
        body: issues.map((issue) => [
          issue.id || "N/A",
          issue.name || "N/A",
          issue.title || "N/A",
          issue.createdAt
            ? new Date(issue.createdAt).toLocaleDateString()
            : "N/A",
          issue.status
            ? issue.status.charAt(0) + issue.status.slice(1).toLowerCase()
            : "N/A",
        ]),
        theme: "striped",
        headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255] },
        bodyStyles: { textColor: [50, 50, 50] },
        styles: { fontSize: 8, cellPadding: 2 },
      });
      doc.save("complaints_report.pdf");
      toast.success("PDF exported successfully.");
    } catch (error) {
      if (import.meta.env.NODE_ENV !== "production") {
        console.error("Error exporting to PDF:", error);
      }
      toast.error("Failed to export PDF.");
    }
  };

  const exportToExcel = () => {
    try {
      if (!issues?.length) {
        toast.warn("No issues available to export.");
        return;
      }
      const data = issues.map((issue) => ({
        ID: issue.id || "N/A",
        Username: issue.name || "N/A",
        Title: issue.title || "N/A",
        "Created At": issue.createdAt
          ? new Date(issue.createdAt).toLocaleDateString()
          : "N/A",
        Status: issue.status
          ? issue.status.charAt(0) + issue.status.slice(1).toLowerCase()
          : "N/A",
      }));
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Complaints");
      XLSX.writeFile(wb, "complaints_report.xlsx");
      toast.success("Excel exported successfully.");
    } catch (error) {
      if (import.meta.env.NODE_ENV !== "production") {
        console.error("Error exporting to Excel:", error);
      }
      toast.error("Failed to export Excel.");
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setIsFetching(true);
    dispatch(
      fetchAllIssues({
        page: 0,
        size: 6,
        sortBy: "createdAt",
        search: searchTerm.trim().replace(/[^\w\s]/gi, ""),
        status: selectedStatus || undefined,
      })
    ).finally(() => setIsFetching(false));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape" && (showFilterDropdown || showExportDropdown)) {
      setShowFilterDropdown(false);
      setShowExportDropdown(false);
    }
  };

  if (loading && !issues.length && !error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="text-center text-gray-300 text-sm sm:text-base font-semibold flex items-center gap-2">
          <span className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></span>
          Loading issues...
        </div>
      </div>
    );
  }

  return (
    <div
      className="p-4 sm:p-6 lg:p-8 bg-gray-900 min-h-screen pb-12"
      onKeyDown={handleKeyDown}
    >
      <MobileHeader />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col  justify-between items-start  mb-6 gap-4 mt-10 sm:mt-0">
          <h2
            id="complaints-heading"
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white"
          >
            Users Complaints
          </h2>
          <p className="text-gray-300 text-sm sm:text-base">
            View and manage your users complaints below.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 text-center text-red-400 text-sm sm:text-base font-semibold bg-white/10 p-4 sm:p-6 rounded-lg shadow-md">
            <p>Error: {error}</p>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">
              Check console for details or contact support.
            </p>
            <button
              onClick={handleRetry}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm sm:text-base transition-colors duration-200"
              aria-label="Retry fetching issues"
            >
              Retry
            </button>
          </div>
        )}

        {/* Search and Filter */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex flex-row gap-3 sm:gap-4 mb-6"
        >
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by username or issue title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value.slice(0, 100))}
              className="w-full bg-white/10 backdrop-blur-lg text-white placeholder-gray-400 border border-white/20 rounded-lg py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              aria-label="Search issues"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm sm:text-base" />
            {isFetching && (
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500"></span>
            )}
          </div>

          <div className="relative flex gap-3 sm:gap-4">
            <div ref={filterRef}>
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="flex items-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm sm:text-base transition-colors duration-200 min-w-[44px] min-h-[44px] justify-center"
                aria-label="Filter by status"
                aria-expanded={showFilterDropdown}
                aria-controls="filter-options"
              >
                <FaFilter className="text-base sm:mr-2" />
                <span className="hidden sm:inline">
                  {selectedStatus
                    ? selectedStatus.charAt(0) +
                      selectedStatus.slice(1).toLowerCase()
                    : "Filter"}
                </span>
              </button>
              {showFilterDropdown && (
                <ul
                  id="filter-options"
                  role="listbox"
                  className="absolute top-full right-0 mt-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg shadow-lg z-20 w-40"
                >
                  <li
                    role="option"
                    aria-selected={!selectedStatus}
                    className="py-1"
                  >
                    <button
                      onClick={() => {
                        setSelectedStatus("");
                        setShowFilterDropdown(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-white hover:bg-white/5 text-sm ${
                        !selectedStatus ? "bg-blue-500/20" : ""
                      }`}
                    >
                      All
                    </button>
                  </li>
                  {statusOptions.map((status) => (
                    <li
                      key={status}
                      role="option"
                      aria-selected={selectedStatus === status}
                      className="py-1"
                    >
                      <button
                        onClick={() => {
                          setSelectedStatus(status);
                          setShowFilterDropdown(false);
                        }}
                        className={`block w-full text-left px-4 py-2 text-white hover:bg-white/5 text-sm ${
                          selectedStatus === status ? "bg-blue-500/20" : ""
                        }`}
                      >
                        {status.charAt(0) + status.slice(1).toLowerCase()}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div ref={exportRef}>
              <button
                onClick={() => setShowExportDropdown(!showExportDropdown)}
                className="flex items-center bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm sm:text-base transition-colors duration-200 min-w-[44px] min-h-[44px] justify-center"
                aria-label="Export data"
                aria-expanded={showExportDropdown}
                aria-controls="export-options"
              >
                <FaDownload className="text-base sm:mr-2" />
                <span className="hidden sm:inline">Export</span>
              </button>
              {showExportDropdown && (
                <ul
                  id="export-options"
                  role="listbox"
                  className="absolute top-full right-0 mt-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg shadow-lg z-20 w-40"
                >
                  <li role="option" className="py-1">
                    <button
                      onClick={() => {
                        exportToPDF();
                        setShowExportDropdown(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-white hover:bg-white/5 text-sm"
                    >
                      Export to PDF
                    </button>
                  </li>
                  <li role="option" className="py-1">
                    <button
                      onClick={() => {
                        exportToExcel();
                        setShowExportDropdown(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-white hover:bg-white/5 text-sm"
                    >
                      Export to Excel
                    </button>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </form>

        {/* Complaints List */}
        <div className="bg-white/10 backdrop-blur-lg shadow-inner rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm text-gray-200">
              <thead>
                <tr className="border-b border-white/20">
                  <th scope="col" className="py-3 px-4">
                    Username
                  </th>
                  <th scope="col" className="py-3 px-4">
                    Title
                  </th>
                  <th scope="col" className="py-3 px-4 hidden sm:table-cell">
                    Created At
                  </th>
                  <th scope="col" className="py-3 px-4">
                    Status
                  </th>
                  <th scope="col" className="py-3 px-4">
                    Change Status
                  </th>
                  <th scope="col" className="py-3 px-4">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {isFetching && !issues.length ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-gray-400">
                      Loading...
                    </td>
                  </tr>
                ) : issues.length ? (
                  issues.map((issue) => (
                    <tr
                      key={issue.id}
                      className="border-b border-white/10 hover:bg-white/5 transition-all duration-200"
                    >
                      <td className="py-3 px-4 truncate max-w-[150px]">
                        {issue.name || "N/A"}
                      </td>
                      <td className="py-3 px-4 truncate max-w-[200px]">
                        {issue.title || "N/A"}
                      </td>
                      <td className="py-3 px-4 text-gray-400 hidden sm:table-cell">
                        {issue.createdAt
                          ? new Date(issue.createdAt).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={issue.status} />
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={issue.status || ""}
                          onChange={(e) =>
                            handleStatusChange(issue.id, e.target.value)
                          }
                          className="bg-white/10 border border-white/20 rounded-lg py-1 px-2 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                          aria-label={`Change status for issue ${
                            issue.title || "unknown"
                          }`}
                        >
                          {statusOptions.map((status) => (
                            <option
                              key={status}
                              value={status}
                              className="text-black"
                            >
                              {status.charAt(0) + status.slice(1).toLowerCase()}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3 px-4 flex gap-2 ">
                        <button
                          onClick={() => handleView(issue)}
                          className=" text-blue-200 p-2 rounded-full cursor-pointer hover:bg-blue-500/40 transition-all duration-300 min-w-[40px] min-h-[40px] flex items-center justify-center"
                          aria-label={`View details for complaint ${
                            issue.title || "unknown"
                          }`}
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => handleDelete(issue.id)}
                          className=" text-red-600 p-2 rounded-full cursor-pointer transition-colors duration-200 min-w-[44px] min-h-[44px] flex items-center justify-center"
                          aria-label={`Delete issue ${
                            issue.title || "unknown"
                          }`}
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-gray-400">
                      No complaints found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-row justify-between items-center mt-6 text-gray-200 text-xs sm:text-sm gap-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0 || isFetching}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 min-w-[80px]"
              aria-label="Previous page"
            >
              Previous
            </button>
            <span className="my-2">
              Page {currentPage + 1} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage + 1 >= totalPages || isFetching}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 min-w-[80px]"
              aria-label="Next page"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default IssueList;
