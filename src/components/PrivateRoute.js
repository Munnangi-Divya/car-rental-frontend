

import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function PrivateRoute({ children, allowedRoles }) {
  const location = useLocation();

  try {
    const token = localStorage.getItem("token");
    const userRaw = localStorage.getItem("user");
    const user = userRaw ? JSON.parse(userRaw) : null;

    // Not logged in → redirect to login
    if (!token || !user) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Role check
    if (allowedRoles && Array.isArray(allowedRoles) && allowedRoles.length > 0) {
      if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
      }
    }

    // Authorized
    return children;
  } catch (err) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
}
