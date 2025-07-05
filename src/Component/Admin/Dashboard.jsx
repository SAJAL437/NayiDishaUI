import React, { useEffect, useState } from "react";
import { FaBullseye } from "react-icons/fa";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { TbLogout } from "react-icons/tb";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProfile,
  fetchAllIssues,
  fetchAllUsers,
} from "../../ReduxState/Admin/Actions/Action";
import { RiMedalLine } from "react-icons/ri";
import { logout } from "../../utils/Auth";
// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // State for pagination
  const [complaintsPage, setComplaintsPage] = useState(0);
  const [usersPage, setUsersPage] = useState(0);
  const complaintsPerPage = 6;
  const usersPerPage = 3;

  const {
    item: user,
    loading: profileLoading,
    error: profileError,
  } = useSelector((state) => state.adminProfile || {});

  const {
    users = [],
    loading: usersLoading = false,
    error: usersError = null,
    totalUsers = 0,
  } = useSelector((state) => state.userList || {});

  const {
    issues = [],
    loading: issuesLoading = false,
    error: issuesError = null,
    // totalIssues = 0,
    // pendingIssues = 0,
  } = useSelector((state) => state.issueList || {});

  // Fetch data when page changes
  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(
      fetchAllIssues({
        page: complaintsPage,
        size: complaintsPerPage,
        sortBy: "createdAt",
      })
    );
    dispatch(
      fetchAllUsers({ page: usersPage, size: usersPerPage, sortBy: "id" })
    );
  }, [dispatch, complaintsPage, usersPage]);

  const handleRetry = () => {
    dispatch(fetchProfile());
    dispatch(
      fetchAllIssues({
        page: complaintsPage,
        size: complaintsPerPage,
        sortBy: "createdAt",
      })
    );
    dispatch(
      fetchAllUsers({ page: usersPage, size: usersPerPage, sortBy: "id" })
    );
  };

  // Pagination handlers
  const handleComplaintsPageChange = (newPage) => {
    if (
      newPage >= 0 &&
      newPage < Math.ceil(totalComplaints / complaintsPerPage)
    ) {
      setComplaintsPage(newPage);
    }
  };

  const handleUsersPageChange = (newPage) => {
    if (newPage >= 0 && newPage < Math.ceil(totalUsers / usersPerPage)) {
      setUsersPage(newPage);
    }
  };

  const totalComplaints = issues.length;
  const pending = issues.filter(
    (item) => item.status.toUpperCase() === "PENDING"
  ).length;
  const resolved = issues.filter(
    (item) => item.status.toUpperCase() === "RESOLVED"
  ).length;
  const inProgress = issues.filter(
    (item) => item.status.toUpperCase() === "INPROGRESS"
  ).length;

  // Compute dashboard metrics
  const dashboardMetrics = {
    totalUsers,
  };

  // Chart data for complaint statistics
  const chartData = {
    labels: ["Pending", "In Progress", "Resolved", "Rejected"],
    datasets: [
      {
        label: "Complaints",
        data: [pending, inProgress, resolved],
        backgroundColor: [
          "rgba(234, 179, 8, 0.6)", // yellow-500
          "rgba(168, 85, 247, 0.6)", // purple-500
          "rgba(34, 197, 94, 0.6)", // green-500
          "rgba(239, 68, 68, 0.6)", // red-500
        ],
        borderColor: [
          "rgba(234, 179, 8, 1)",
          "rgba(168, 85, 247, 1)",
          "rgba(34, 197, 94, 1)",
          "rgba(239, 68, 68, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "rgba(255, 255, 255, 0.1)" },
        ticks: {
          color: "rgba(255, 255, 255, 0.8)",
          font: { size: 12 },
          stepSize: 1, // Ensure whole numbers for complaint counts
        },
      },
      x: {
        grid: { display: false },
        ticks: {
          color: "rgba(255, 255, 255, 0.8)",
          font: { size: 12 },
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "rgba(255, 255, 255, 0.8)",
          font: { size: 12 },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleFont: { size: 12 },
        bodyFont: { size: 12 },
      },
    },
  };

  // Format status for display
  const formatStatus = (status) => {
    if (!status) return "Unknown";
    return status
      .toLowerCase()
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Check if chart data is valid (non-zero values)
  const isChartDataValid = chartData.datasets[0].data.some(
    (value) => value > 0
  );

  const handleLogout = () => {
    logout();
    navigate("/"); // Redirect to home
  };

  return (
    <div className="space-y-4 sm:space-y-6 py-16 sm:pt-0 sm:pb-0 bg-gray-900 min-h-screen">
      {/* Mobile Header */}
      <div className="sm:hidden fixed top-0 left-0 right-0 bg-white/10 backdrop-blur-lg border-b border-gray-300/30 z-50 p-2 flex justify-between items-center gap-2">
        <Link
          to="/"
          className="flex items-center space-x-2 text-base font-extrabold text-white drop-shadow-md hover:scale-105 transition-transform duration-300 group"
        >
          <img
            src="https://st.depositphotos.com/1364916/1400/v/450/depositphotos_14006320-stock-illustration-teamwork-union-logo-vector.jpg"
            alt="Logo"
            className="h-8 w-8 rounded-full border-2 border-white/50 shadow-md"
          />
          <span className="relative">
            <h1>NahiDisha</h1>
            <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-white/70 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
          </span>
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center justify-center p-2 sm:p-3 text-xl sm:text-2xl rounded-full text-gray-300 hover:text-white hover:bg-white/10 hover:scale-110 transition-all duration-300"
        >
          <TbLogout />
          <span className="absolute left-16 sm:left-20 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            Logout
          </span>
        </button>
      </div>

      {/* Error Messages */}
      {(profileError || usersError || issuesError) && (
        <div className="bg-red-500/20 text-red-200 p-4 rounded-lg text-center text-xs sm:text-sm">
          {profileError && <p>Profile Error: {profileError}</p>}
          {usersError && <p>Users Error: {usersError}</p>}
          {issuesError && <p>Complaints Error: {issuesError}</p>}
          <button
            onClick={handleRetry}
            className="mt-2 px-4 py-2 text-center bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors duration-200"
            aria-label="Retry fetching data"
          >
            SESSION TIMEOUT
            <br />
            Retry
          </button>
        </div>
      )}

      {/* Top Row: User Profile, Complaint Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* User Profile Section */}
        <div className="flex flex-col sm:flex-row gap-3 bg-white/10 backdrop-blur-lg shadow-inner p-4 sm:p-6 rounded-xl">
          {profileLoading ? (
            <div className="flex-1 text-center text-gray-400 text-sm">
              Loading profile...
            </div>
          ) : (
            <>
              <div className="flex-shrink-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full border-4 border-gray-300/30 overflow-hidden transition-all duration-300 hover:scale-105">
                  <img
                    src={
                      user?.picture ||
                      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQk2F9qWvoWdN621VFxuVPMxypnoQDLFNxzTPB7v_4-77Nw2KiuRx2T0m9Lnnq2jaG8W2s&usqp=CAU"
                    }
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="text-white text-base sm:text-lg font-semibold text-center mt-3 sm:mt-4">
                  {user?.name || "User Name"}
                </h2>
                <p className="text-indigo-200 text-center text-xs sm:text-sm">
                  {user?.email || "user@example.com"}
                </p>
              </div>
              <div className="mt-4 sm:mt-6 space-y-2 text-gray-200 text-xs sm:text-sm px-0 sm:px-4 text-center sm:text-left">
                <p>
                  <span className="font-semibold text-white">Phone:</span>{" "}
                  {user?.phoneNumber || "123-456-7890"}
                </p>
                <p>
                  <span className="font-semibold text-white">Status:</span>{" "}
                  {user?.enabled ? "Online" : "Offline"}
                </p>
                <p>
                  <span className="font-semibold text-white">Verified:</span>{" "}
                  {user?.emailvarified ? "Email Verified" : "Email Verified"}
                </p>
                <p>
                  <span className="font-semibold text-white">About:</span>{" "}
                  {user?.bio || "No info provided."}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Complaint Overview Section */}
        <div className="bg-white/10 backdrop-blur-lg shadow-inner p-4 sm:p-6 rounded-xl lg:col-span-2">
          <h3 className="text-lg sm:text-xl font-bold text-white border-b border-gray-300/30 pb-2 sm:pb-3 mb-4 sm:mb-6">
            Complaint Overview
          </h3>
          {issuesLoading ? (
            <div className="text-center text-gray-400 text-sm">
              Loading complaints...
            </div>
          ) : (
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-blue-500/20 rounded-lg p-3 sm:p-4 text-center shadow-sm transition-all duration-300 hover:scale-105 active:scale-95">
                <h4 className="text-lg sm:text-2xl font-bold text-blue-300">
                  {totalComplaints}
                </h4>
                <p className="text-xs sm:text-sm text-blue-200">
                  Total Complaints
                </p>
              </div>
              <div className="bg-yellow-500/20 rounded-lg p-3 sm:p-4 text-center shadow-sm transition-all duration-300 hover:scale-105 active:scale-95">
                <h4 className="text-lg sm:text-2xl font-bold text-yellow-300">
                  {dashboardMetrics.totalUsers}
                </h4>
                <p className="text-xs sm:text-sm text-yellow-200">
                  Total Users
                </p>
              </div>
              <div className="bg-yellow-500/20 rounded-lg p-3 sm:p-4 text-center shadow-sm transition-all duration-300 hover:scale-105 active:scale-95">
                <h4 className="text-lg sm:text-2xl font-bold text-yellow-300">
                  {pending}
                </h4>
                <p className="text-xs sm:text-sm text-yellow-200">
                  Pending Complaints
                </p>
              </div>
              <div className="bg-purple-500/20 rounded-lg p-3 sm:p-4 text-center shadow-sm transition-all duration-300 hover:scale-105 active:scale-95">
                <div className="flex flex-col items-center">
                  <h2 className="text-3xl sm:text-4xl font-bold text-purple-300">
                    <RiMedalLine />
                  </h2>

                  <p className="text-xs sm:text-sm font-bold text-purple-200">
                    ADMIN
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Middle Row: Users, Graph */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Users Section */}
        <div className="bg-white/10 backdrop-blur-lg shadow-inner p-4 sm:p-6 rounded-xl">
          <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">
            Users
          </h3>
          {usersLoading ? (
            <div className="text-center text-gray-400 text-sm">
              Loading users...
            </div>
          ) : users.length === 0 ? (
            <div className="text-center text-gray-400 text-sm">
              No users found.
            </div>
          ) : (
            <>
              <div className="space-y-2">
                {users.map((user, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center border border-gray-300/30 p-2 rounded-full transition-all duration-300 hover:bg-white/5 active:bg-white/10"
                  >
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full shadow-sm shadow-blue-300/50 overflow-hidden">
                      <img
                        src={
                          user.picture ||
                          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQk2F9qWvoWdN621VFxuVPMxypnoQDLFNxzTPB7v_4-77Nw2KiuRx2T0m9Lnnq2jaG8W2s&usqp=CAU"
                        }
                        alt={`Profile picture for ${user.name || "unknown"}`}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <div className="flex-1 ml-2">
                      <p className="text-white text-xs sm:text-sm font-semibold truncate">
                        {user.name || "Unknown"}
                      </p>
                      <p className="text-indigo-200 text-xs truncate">
                        {user.email || "No email"}
                      </p>
                    </div>
                    <button
                      className="bg-blue-500/20 text-blue-200 text-xs sm:text-sm cursor-pointer font-semibold px-1 sm:px-2 py-1 sm:py-2 rounded-full hover:bg-blue-500/40 transition-all duration-300 active:bg-blue-500/50"
                      aria-label={`View details for user ${
                        user.name || "unknown"
                      }`}
                    >
                      <FaBullseye />
                    </button>
                  </div>
                ))}
              </div>
              {/* Users Pagination */}
              <div className="mt-6 flex justify-between items-center">
                <button
                  onClick={() => handleUsersPageChange(usersPage - 1)}
                  disabled={usersPage === 0}
                  className={`px-3 py-1 text-sm rounded-lg ${
                    usersPage === 0
                      ? "bg-gray-600/50 text-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  } transition-colors duration-200`}
                >
                  Previous
                </button>
                <span className="text-sm text-gray-200">
                  Page {usersPage + 1} of{" "}
                  {Math.ceil(totalUsers / usersPerPage) || 1}
                </span>
                <button
                  onClick={() => handleUsersPageChange(usersPage + 1)}
                  disabled={
                    usersPage >= Math.ceil(totalUsers / usersPerPage) - 1
                  }
                  className={`px-3 py-1 text-sm rounded-lg ${
                    usersPage >= Math.ceil(totalUsers / usersPerPage) - 1
                      ? "bg-gray-600/50 text-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  } transition-colors duration-200`}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
        {/* Graph Section */}
        <div className="bg-white/10 backdrop-blur-lg shadow-inner p-4 sm:p-6 rounded-xl lg:col-span-2">
          <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">
            Complaint Statistics
          </h3>
          <div className="h-48 sm:h-64">
            {issuesLoading ? (
              <div className="text-center text-gray-400 text-sm h-full flex items-center justify-center">
                Loading chart...
              </div>
            ) : !isChartDataValid ? (
              <div className="text-center text-gray-400 text-sm h-full flex items-center justify-center">
                No complaint data available.
                {/* site is under maintenance. Please check back later. */}
              </div>
            ) : (
              <Bar data={chartData} options={chartOptions} />
            )}
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Complaints */}
      <div className="bg-white/10 backdrop-blur-lg shadow-inner p-4 sm:p-6 rounded-xl">
        <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">
          Recent Complaints
        </h3>
        {issuesLoading ? (
          <div className="text-center text-gray-400 text-sm">
            Loading complaints...
          </div>
        ) : issues.length === 0 ? (
          <div className="text-center text-gray-400 text-sm">
            No complaints found.
          </div>
        ) : (
          <>
            {/* Mobile Card Layout */}
            <div className="block sm:hidden space-y-3">
              {issues.map((complaint) => (
                <div
                  key={complaint.id}
                  className="bg-white/5 rounded-lg p-3 shadow-sm transition-all duration-300 hover:bg-white/10 active:bg-white/15"
                  aria-label={`Complaint ${complaint.title || "Untitled"}`}
                >
                  <p className="text-xs text-white font-semibold">
                    {complaint.title || "Untitled"}
                  </p>
                  <p className="text-xs text-gray-200">ID: {complaint.id}</p>
                  <p className="text-xs text-gray-200">
                    Date:{" "}
                    {complaint.createdAt
                      ? new Date(complaint.createdAt).toLocaleDateString()
                      : "N/A"}
                  </p>
                  <span
                    className={`px-2 py-1 rounded-full text-xs mt-2 inline-block ${
                      complaint.status === "PENDING"
                        ? "bg-yellow-500/20 text-yellow-200"
                        : complaint.status === "INPROGRESS"
                        ? "bg-purple-500/20 text-purple-200"
                        : complaint.status === "RESOLVED"
                        ? "bg-green-500/20 text-green-200"
                        : "bg-red-500/20 text-red-200"
                    }`}
                  >
                    {formatStatus(complaint.status)}
                  </span>
                </div>
              ))}
            </div>
            {/* Desktop Table Layout */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="min-w-full text-left text-xs sm:text-sm text-gray-200">
                <thead>
                  <tr className="border-b border-gray-200/20">
                    <th className="py-3 px-3 sm:px-4">ID</th>
                    <th className="py-3 px-3 sm:px-4">Title</th>
                    <th className="py-3 px-3 sm:px-4">Status</th>
                    <th className="py-3 px-3 sm:px-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {issues.map((complaint) => (
                    <tr
                      key={complaint.id}
                      className="border-b border-gray-200/20 hover:bg-white/5 transition-all duration-200"
                      aria-label={`Complaint ${complaint.title || "Untitled"}`}
                    >
                      <td className="py-3 px-3 sm:px-4">{complaint.id}</td>
                      <td className="py-3 px-3 sm:px-4">
                        {complaint.title || "N/A"}
                      </td>
                      <td className="py-3 px-3 sm:px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs sm:text-sm ${
                            complaint.status === "PENDING"
                              ? "bg-yellow-500/20 text-yellow-200"
                              : complaint.status === "INPROGRESS"
                              ? "bg-purple-500/20 text-purple-200"
                              : complaint.status === "RESOLVED"
                              ? "bg-green-500/20 text-green-200"
                              : "bg-red-500/20 text-red-200"
                          }`}
                        >
                          {formatStatus(complaint.status)}
                        </span>
                      </td>
                      <td className="py-3 px-3 sm:px-4">
                        {complaint.createdAt
                          ? new Date(complaint.createdAt).toLocaleDateString()
                          : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Complaints Pagination */}
            <div className="mt-4 flex justify-between items-center">
              <button
                onClick={() => handleComplaintsPageChange(complaintsPage - 1)}
                disabled={complaintsPage === 0}
                className={`px-3 py-1 text-sm rounded-lg ${
                  complaintsPage === 0
                    ? "bg-gray-600/50 text-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                } transition-colors duration-200`}
              >
                Previous
              </button>
              <span className="text-sm text-gray-200">
                Page {complaintsPage + 1} of{" "}
                {Math.ceil(totalComplaints / complaintsPerPage) || 1}
              </span>
              <button
                onClick={() => handleComplaintsPageChange(complaintsPage + 1)}
                disabled={
                  complaintsPage >=
                  Math.ceil(totalComplaints / complaintsPerPage) - 1
                }
                className={`px-3 py-1 text-sm rounded-lg ${
                  complaintsPage >=
                  Math.ceil(totalComplaints / complaintsPerPage) - 1
                    ? "bg-gray-600/50 text-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                } transition-colors duration-200`}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
