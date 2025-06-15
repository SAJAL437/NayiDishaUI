import { Navigate } from "react-router-dom";
import { getUserRoles } from "../utils/Auth";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const roles = getUserRoles();

  const isAuthorized = roles.some(role => allowedRoles.includes(role));

  if (!isAuthorized) {
    // redirect to login or unauthorized page
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
