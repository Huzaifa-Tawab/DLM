import { Outlet, Navigate } from "react-router-dom";
import isLogedIn from "../isLogedIn";
import isAdmin from "../IsAdmin";

const AgentRoutes = () => {
  const auth = isLogedIn() && !isAdmin();

  return auth ? <Outlet /> : <Navigate to="/login" />;
};

export default AgentRoutes;
