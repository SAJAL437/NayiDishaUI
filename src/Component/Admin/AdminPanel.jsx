import React from "react";
import SideNav from "./SideNav";
import UserList from "./UserList";
import IssueList from "./Complains";
import Dashboard from "./Dashboard";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "../ProtectedRoute";
import ViewComplain from "./A_ViewComplain";

const AdminPanel = () => {
  return (
    <div className="flex flex-col gap-3 sm:flex-row h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* SideNav - Left Sidebar for sm+ */}
      <div className="hidden sm:block">
        <SideNav />
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 py-2 sm:px-4 sm:py-4 lg:px-6 lg:py-4 overflow-y-auto bg-gray-900 backdrop-blur-lg rounded-2xl shadow-2xl shadow-blue-500/20 m-2 sm:m-3 lg:m-4 transition-all duration-300 sm:ml-20 lg:ml-24">
        <div className="max-w-full sm:max-w-6xl lg:max-w-7xl mx-auto">
          <Routes>
            {/* Default route for /admin */}
            <Route
              index
              element={
                <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="dashboard"
              element={
                <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="user-list"
              element={
                <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
                  <UserList />
                </ProtectedRoute>
              }
            />
            <Route
              path="myIssue"
              element={
                <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
                  <IssueList />
                </ProtectedRoute>
              }
            />
            <Route
              path="Issue/:id"
              element={
                <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
                  <ViewComplain />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>

      {/* SideNav - Bottom Nav for mobile */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur-lg border-t border-gray-300/30 z-50">
        <SideNav isBottomNav={true} />
      </div>
    </div>
  );
};

export default AdminPanel;
