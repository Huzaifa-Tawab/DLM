import React, { useState, useEffect } from "react";
import SideBar from "../../components/Sidebar/sidebar";
import "./dashboard.css"; // Import your CSS file for styling
import Loader from "../../components/loader/Loader";
import CommingSoon from "../Commingsoon";

function FinanceDash() {
  const [isLoading, setisLoading] = useState(false);

  return <SideBar element={isLoading ? <Loader /> : <CommingSoon />} />;
}

export default FinanceDash;
