import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import isLogedIn from "../isLogedIn";

const AdminRoutes = () => {
  // const [Auth, setauth] = useState(false);
  const auth = isLogedIn();
  // const auth = isLogedIn() && isAdmin();

  return auth ? <Outlet /> : <Navigate to="/login" />;
};

export default AdminRoutes;
