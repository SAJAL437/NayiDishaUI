import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import { fetchAllUsers } from "../../ReduxState/Admin/Actions/Action";
import MobileHeader from "./MobileHeader";

const UserList = () => {
  const dispatch = useDispatch();
  const {
    users = [],
    loading,
    error,
    currentPage = 0,
    totalPages = 1,
  } = useSelector((state) => state.userList || {});

  useEffect(() => {
    dispatch(fetchAllUsers({ page: 0, size: 6, sortBy: "id" }));
  }, [dispatch]);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      dispatch(fetchAllUsers({ page: newPage, size: 6, sortBy: "id" }));
    }
  };

  const handleSort = (field) => {
    dispatch(fetchAllUsers({ page: 0, size: 6, sortBy: field }));
  };

  const handleRetry = () => {
    dispatch(fetchAllUsers({ page: 0, size: 6, sortBy: "id" }));
  };

  if (loading && !users?.length) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="text-center text-gray-300 text-sm sm:text-base font-semibold flex items-center gap-2">
          <span className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></span>
          Loading users...
        </div>
      </div>
    );
  }

  if (error && !users?.length) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="text-center text-red-400 text-sm sm:text-base font-semibold bg-white/10 p-4 sm:p-6 rounded-lg shadow-md max-w-md w-full">
          <p>Error: {error}</p>
          <button
            onClick={handleRetry}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm sm:text-base transition-colors duration-200"
            aria-label="Retry fetching users"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 pb-12 bg-gray-900 min-h-screen">
      <MobileHeader />
      <div className="max-w-7xl mx-auto mt-8 sm:mt-10">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-white mb-2">
            Users
          </h2>
          <p className="text-gray-300 text-xs sm:text-sm">
            Manage user accounts and their statuses.
          </p>
        </div>

        {/* User List */}
        <div className="bg-white/10 backdrop-blur-lg shadow-inner rounded-xl overflow-hidden">
          {/* Mobile Card Layout */}
          <div className="block md:hidden space-y-4 p-4">
            {users.length > 0 ? (
              users.map((user) => (
                <div
                  key={user.id}
                  className="bg-white/5 rounded-lg p-4 shadow-sm transition-all duration-200 hover:bg-white/10"
                >
                  <div className="flex flex-col items-center text-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <img
                        src={
                          user.picture ||
                          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQk2F9qWvoWdN621VFxuVPMxypnoQDLFNxzTPB7v_4-77Nw2KiuRx2T0m9Lnnq2jaG8W2s&usqp=CAU"
                        }
                        alt={`Profile picture of ${user.name || "user"}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium text-white text-sm">
                        {user.name || "N/A"}
                      </div>
                      <div className="text-gray-400 text-xs">
                        {user.email || "N/A"}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs mt-5 sm:text-sm">
                    <p className="text-gray-400">
                      <span className="font-medium text-white">Verified: </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          user.verified
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {user.verified ? "Verified" : "Not Verified"}
                      </span>
                    </p>
                    <p className="text-gray-400">
                      <span className="font-medium text-white">Created: </span>
                      {user.createdAt
                        ? format(new Date(user.createdAt), "MM/dd/yyyy")
                        : "N/A"}
                    </p>
                    <p className="text-gray-400">
                      <span className="font-medium text-white">Role: </span>
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-400">
                        {user.role?.name || user.role || "USER"}
                      </span>
                    </p>
                    <p className="text-gray-400">
                      <span className="font-medium text-white">Enabled: </span>
                      <label className="inline-flex items-center cursor-not-allowed">
                        <input
                          type="checkbox"
                          checked={user.enabled || false}
                          disabled
                          className="sr-only peer"
                          aria-label={`Toggle enabled status for ${
                            user.name || "user"
                          } (currently disabled)`}
                        />
                        <div className="relative top-2 w-11 h-6 bg-gray-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500 opacity-50"></div>
                      </label>
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-400 text-sm">
                No users found.
              </div>
            )}
          </div>

          {/* Desktop Table Layout */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm text-gray-200">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="py-3 px-3 sm:px-4">Profile</th>
                  <th
                    className="py-3 px-3 sm:px-4 cursor-pointer hover:text-blue-400 transition-colors duration-200"
                    onClick={() => handleSort("name")}
                    aria-label="Sort by username"
                  >
                    Username
                  </th>
                  <th
                    className="py-3 px-3 sm:px-4 cursor-pointer hover:text-blue-400 transition-colors duration-200"
                    onClick={() => handleSort("verified")}
                    aria-label="Sort by email verification"
                  >
                    Email Verified
                  </th>
                  <th
                    className="py-3 px-3 sm:px-4 cursor-pointer hover:text-blue-400 transition-colors duration-200"
                    onClick={() => handleSort("createdAt")}
                    aria-label="Sort by created date"
                  >
                    Created At
                  </th>
                  <th
                    className="py-3 px-3 sm:px-4 cursor-pointer hover:text-blue-400 transition-colors duration-200"
                    onClick={() => handleSort("role")}
                    aria-label="Sort by role"
                  >
                    Role
                  </th>
                  <th
                    className="py-3 px-3 sm:px-4 cursor-pointer hover:text-blue-400 transition-colors duration-200"
                    onClick={() => handleSort("enabled")}
                    aria-label="Sort by enabled status"
                  >
                    Enabled
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-white/10 hover:bg-white/5 transition-all duration-200"
                    >
                      <td className="py-3 px-3 sm:px-4">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden">
                          <img
                            src={
                              user.picture ||
                              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQk2F9qWvoWdN621VFxuVPMxypnoQDLFNxzTPB7v_4-77Nw2KiuRx2T0m9Lnnq2jaG8W2s&usqp=CAU"
                            }
                            alt={`Profile picture of ${user.name || "user"}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="py-3 px-3 sm:px-4">
                        <div className="font-medium text-sm sm:text-base">
                          {user.name || "N/A"}
                        </div>
                        <div className="text-gray-400 text-xs sm:text-sm">
                          {user.email || "N/A"}
                        </div>
                      </td>
                      <td className="py-3 px-3 sm:px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            user.verified
                              ? "bg-green-500/20 text-green-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {user.verified ? "Verified" : "Not Verified"}
                        </span>
                      </td>
                      <td className="py-3 px-3 sm:px-4 text-gray-400 text-xs sm:text-sm">
                        {user.createdAt
                          ? format(new Date(user.createdAt), "MM/dd/yyyy")
                          : "N/A"}
                      </td>
                      <td className="py-3 px-3 sm:px-4">
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-400">
                          {user.role?.name || user.role || "USER"}
                        </span>
                      </td>
                      <td className="py-3 px-3 sm:px-4">
                        <label className="inline-flex items-center cursor-not-allowed">
                          <input
                            type="checkbox"
                            checked={user.enabled || false}
                            disabled
                            className="sr-only peer"
                            aria-label={`Toggle enabled status for ${
                              user.name || "user"
                            } (currently disabled)`}
                          />
                          <div className="relative w-11 h-6 bg-gray-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500 opacity-50"></div>
                        </label>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="py-4 px-4 text-center text-gray-400 text-sm"
                    >
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Enhanced Pagination */}
        {totalPages > 1 && (
          <nav
            className="flex flex-wrap justify-center items-center mt-6 gap-2 text-gray-200 text-xs sm:text-sm"
            aria-label="Pagination"
          >
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
              className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-600 hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 min-w-[80px] sm:min-w-[100px]"
              aria-label="Previous page"
            >
              Previous
            </button>
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {[...Array(totalPages).keys()].map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg transition-colors duration-200 min-w-[36px] sm:min-w-[40px] text-center ${
                    currentPage === page
                      ? "bg-blue-600 text-white"
                      : "bg-gray-600 hover:bg-gray-700"
                  }`}
                  aria-label={`Go to page ${page + 1}`}
                  aria-current={currentPage === page ? "page" : undefined}
                >
                  {page + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage + 1 >= totalPages}
              className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-600 hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 min-w-[80px] sm:min-w-[100px]"
              aria-label="Next page"
            >
              Next
            </button>
          </nav>
        )}
      </div>
    </div>
  );
};

export default UserList;
