import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/**
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {("manufacturer"|"consumer")[]} [props.allowedRoles] - omit to allow any logged-in user
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const location = useLocation();
  const { isLoggedIn, role } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles?.length) {
    if (!allowedRoles.includes(role)) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
}
