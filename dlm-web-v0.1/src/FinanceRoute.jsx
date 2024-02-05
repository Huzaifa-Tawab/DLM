import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import isLogedIn from "../isLogedIn";

import isFinance from "../IsFinance";

const FinanceRoute = () => {
  const auth = isFinance();
  return auth ? <Outlet /> : <Navigate to="/login" />;
};

export default FinanceRoute;
