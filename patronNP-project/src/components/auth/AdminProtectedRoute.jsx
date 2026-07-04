import { Navigate } from "react-router-dom";

import { getAuthUser } from "../../utils/auth";
import { isTokenExpired } from "../../utils/authTimer";

// Same JWT everything else uses — the token already carries a "role" claim
// (see JwtService.generateToken), so no extra API call is needed to gate this.
const AdminProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("accessToken");
  if (!token || isTokenExpired(token)) {
    return <Navigate to="/signin" replace />;
  }

  const user = getAuthUser();
  if (user?.role !== "ADMIN") {
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
