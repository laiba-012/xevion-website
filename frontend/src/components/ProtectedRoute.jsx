import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
        Loading...
      </div>
    );
  }

  // Admin specific protection
  if (roles.includes("admin")) {
    if (!user) {
      return <Navigate to="/admin/login" replace />;
    }
    const isAdmin = user.role === "admin" || user.email === "laibafatima0116@gmail.com" || user.email === "admin@xevion.com";
    if (!isAdmin) {
      return <Navigate to="/admin/login?error=unauthorized" replace />;
    }
    return children;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    const isAdmin = user.role === "admin" || user.email === "laibafatima0116@gmail.com" || user.email === "admin@xevion.com";
    if (isAdmin) {
      return <Navigate to="/admin" replace />;
    }
    if (user.role === "instructor") {
      return <Navigate to="/dashboard/instructor" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;