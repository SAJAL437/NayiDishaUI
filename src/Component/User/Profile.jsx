import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProfile,
  fetchComplaint,
} from "../../ReduxState/Users/Action/Action";
import MobileHeader from "./U_MobileHeader";

const UserProfileTemplate = () => {
  const dispatch = useDispatch();
  const { profile, loading, error } = useSelector(
    (state) => state.userProfile || {}
  );
  const report = useSelector((state) => state.complainList?.report || []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    phoneNumber: "",
    bio: "",
    profilePicture: null,
  });
  //   const [imagePreview, setImagePreview] = useState(null);
  const [showComplaints, setShowComplaints] = useState(false);

  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchComplaint());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFormData({
        phoneNumber: profile.phoneNumber || "",
        bio: profile.bio || "",
        profilePicture: null,
      });
    }
  }, [profile]);

  // Calculate complaint stats
  const totalComplaints = report.length;
  const pending = report.filter(
    (item) => item.status.toUpperCase() === "PENDING"
  ).length;
  const resolved = report.filter(
    (item) => item.status.toUpperCase() === "RESOLVED"
  ).length;
  const inProgress = report.filter(
    (item) => item.status.toUpperCase() === "INPROGRESS"
  ).length;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="text-center text-gray-300 text-sm sm:text-base font-semibold">
          <span className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500 mr-2"></span>
          Loading profile...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="text-center text-red-400 text-sm sm:text-base font-semibold bg-white/10 p-4 rounded-lg shadow-md">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 pb-8">
      <MobileHeader/>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-black/20 backdrop-blur-lg shadow-inner rounded-xl p-4 sm:p-6 lg:p-8">
          {/* User Intro Section */}
          <div className="mb-6 text-center">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white mb-2">
              Welcome, {profile?.name || "User"}!
            </h2>
            <p className="text-gray-300 text-xs sm:text-sm">
              Your profile summary and complaint status at a glance.
            </p>
          </div>

          {/* Profile and Complaint Sections */}
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
            {/* Profile Section */}
            <div className="w-full lg:w-1/2 bg-white/5 rounded-xl p-4 sm:p-6 flex flex-col items-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden border-2 border-blue-500 shadow-md transition-transform duration-300 hover:scale-105">
                <img
                  src={
                    profile?.picture ||
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQk2F9qWvoWdN621VFxuVPMxypnoQDLFNxzTPB7v_4-77Nw2KiuRx2T0m9Lnnq2jaG8W2s&usqp=CAU"
                  }
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="mt-4 w-full space-y-3 text-xs sm:text-sm text-gray-300 text-center sm:text-left">
                <p className="flex flex-row sm:items-center">
                  <span className="font-medium text-white mr-2">Email:</span>
                  {profile?.email || "N/A"}
                  <span
                    className={`ml-0 sm:ml-2 mt-1 sm:mt-0 text-xs font-semibold ${
                      profile?.verified ? "text-green-400" : "text-yellow-400"
                    }`}
                  >
                    {profile?.verified ? "(Verified)" : "(Not Verified)"}
                  </span>
                </p>
                <p className="flex flex-row sm:items-center">
                  <span className="font-medium text-white mr-2">Phone:</span>
                  {profile?.phoneNumber || "Not Provided"}
                </p>
                <p className="flex flex-row sm:items-center">
                  <span className="font-medium text-white mr-2">Status:</span>
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                      profile?.enabled
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {profile?.enabled ? "Online" : "Offline"}
                  </span>
                </p>
                <p className="flex flex-row sm:items-start">
                  <span className="font-medium text-white mr-2">About:</span>
                  <span className="text-gray-400 line-clamp-3">
                    {profile?.bio || "Not Provided"}
                  </span>
                </p>
              </div>
            </div>

            {/* Complaint Summary Section */}
            <div className="w-full lg:w-1/2 bg-white/5 rounded-xl p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold text-white border-b border-white/20 pb-2 mb-4">
                Complaint Overview
              </h3>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {[
                  {
                    label: "Total Complaints",
                    value: totalComplaints,
                    color: "blue",
                  },
                  { label: "Pending", value: pending, color: "yellow" },
                  { label: "Resolved", value: resolved, color: "green" },
                  { label: "In Progress", value: inProgress, color: "purple" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={`bg-${item.color}-500/10 rounded-lg p-3 sm:p-4 text-center shadow-sm transition-transform duration-200 hover:scale-105`}
                  >
                    <h4
                      className={`text-lg sm:text-xl font-bold text-${item.color}-400`}
                    >
                      {item.value}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-300">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* Complaint History */}
              <button
                onClick={() => setShowComplaints(!showComplaints)}
                className="mt-4 w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-sm sm:text-base transition-colors duration-200"
                aria-label={
                  showComplaints ? "Hide Complaints" : "Show Complaints"
                }
              >
                {showComplaints ? "Hide Complaints" : "Show Complaint History"}
              </button>

              {showComplaints && (
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-xs sm:text-sm text-gray-300">
                    <thead>
                      <tr className="border-b border-white/20">
                        <th className="py-2 px-3 text-left">Title</th>
                        <th className="py-2 px-3 text-left">Date</th>
                        <th className="py-2 px-3 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.slice(0, 5).length > 0 ? (
                        report.slice(0, 5).map((complaint) => (
                          <tr
                            key={complaint.id}
                            className="border-b border-white/10 hover:bg-white/5 transition-colors duration-200"
                          >
                            <td className="py-2 px-3">
                              {complaint.title || "N/A"}
                            </td>
                            <td className="py-2 px-3">
                              {complaint.createdAt
                                ? new Date(
                                    complaint.createdAt
                                  ).toLocaleDateString()
                                : "N/A"}
                            </td>
                            <td className="py-2 px-3">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                  complaint.status.toUpperCase() === "PENDING"
                                    ? "bg-yellow-500/20 text-yellow-400"
                                    : complaint.status.toUpperCase() ===
                                      "RESOLVED"
                                    ? "bg-green-500/20 text-green-400"
                                    : "bg-purple-500/20 text-purple-400"
                                }`}
                              >
                                {complaint.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="3"
                            className="py-4 text-center text-gray-400"
                          >
                            No complaints found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  {report.length > 5 && (
                    <p className="mt-2 text-xs sm:text-sm text-gray-400 text-center">
                      Showing top 5 complaints. Total complaints:{" "}
                      {report.length}.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileTemplate;
