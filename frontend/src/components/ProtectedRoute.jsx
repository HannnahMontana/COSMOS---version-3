import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import NotAuthorized from "../pages/NotAuthorized";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, isAdmin, loading } = useContext(UserContext);
  console.log("Protected", user, isAdmin);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <Navigate to="/auth" />;
  }

  if (adminOnly && !isAdmin) {
    // return <Navigate to="/not-authorized" />;
    return <NotAuthorized />;
  }

  return children;
}
