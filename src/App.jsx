import React from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import AdminPanel from "./Component/Admin/AdminPanel";
import NayiDishaRoute from "./Router/NayiDishaRoute";
import ProtectedRoute from "./Component/ProtectedRoute";
import VerifyEmail from "./Component/Auth/Verify";
import VerifyEmailPrompt from "./Component/Auth/EmailPromt";
import UserPanel from "./Component/User/UserPanel";
import { logout } from "./utils/Auth";
import HomePage from "./Component/NayiDisah.jsx/Home";

const Logout = () => {
  const navigate = useNavigate();
  React.useEffect(() => {
    logout();
    navigate("/");
  }, [navigate]);
  return null;
};

const App = () => {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<NayiDishaRoute />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/verify-email-prompt" element={<VerifyEmailPrompt />} />
        {/* <Route path="/logout" element={<NayiDishaRoute />} /> */}

        {/* Protected Routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/*"
          element={
            <ProtectedRoute allowedRoles={["ROLE_USER"]}>
              <UserPanel />
            </ProtectedRoute>
          }
        />

        {/* Unauthorized */}
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </>
  );
};

export default App;