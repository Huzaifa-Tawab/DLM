import React, { useEffect } from "react";
import Loader from "../../components/loader/Loader";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";

function Logout() {
  const navi = useNavigate();

  useEffect(() => {
    auth.signOut().then(() => {
      navi("/");
      localStorage.clear();
    });
  }, []);

  return <Loader />;
}

export default Logout;
