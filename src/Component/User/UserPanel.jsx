import React from "react";
import Side_Nav from "./Side_Nav";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "../ProtectedRoute";
import ComplainFrom from "./ComplainFrom";
import Profile from "./Profile";
import ProfileUpdate from "./ProfileUpdate";
import ComplainList from "./ComplainList";
import ViewComplain from "./ViewComplain";

const UserPanel = () => {
  return (
    <div className="flex flex-col gap-3 sm:flex-row h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="hidden sm:block">
        <Side_Nav />
      </div>
      <div className="flex-1 px-4 py-2 sm:px-4 sm:py-4 lg:px-6 lg:py-4 overflow-y-auto bg-gray-900 backdrop-blur-lg rounded-2xl shadow-2xl shadow-blue-500/20 m-2 sm:m-3 lg:m-4 transition-all duration-300 sm:ml-20 lg:ml-24">
        <div className="max-w-full sm:max-w-6xl lg:max-w-7xl mx-auto">
          <Routes>
            <Route
              index
              element={
                <ProtectedRoute allowedRoles={["ROLE_USER"]}>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="profile"
              element={
                <ProtectedRoute allowedRoles={["ROLE_USER"]}>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="update"
              element={
                <ProtectedRoute allowedRoles={["ROLE_USER"]}>
                  <ProfileUpdate />
                </ProtectedRoute>
              }
            />
            <Route
              path="complain-form"
              element={
                <ProtectedRoute allowedRoles={["ROLE_USER"]}>
                  <ComplainFrom />
                </ProtectedRoute>
              }
            />
            <Route
              path="myIssue"
              element={
                <ProtectedRoute allowedRoles={["ROLE_USER"]}>
                  <ComplainList />
                </ProtectedRoute>
              }
            />
            <Route
              path="viewIssue/:id"
              element={<ProtectedRoute allowedRoles={["ROLE_USER"]}><ViewComplain /></ProtectedRoute>}
            />
          </Routes>
        </div>
      </div>
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur-lg border-t border-gray-300/30 z-50">
        <Side_Nav isBottomNav={true} />
      </div>
    </div>
  );
};

export default UserPanel;
