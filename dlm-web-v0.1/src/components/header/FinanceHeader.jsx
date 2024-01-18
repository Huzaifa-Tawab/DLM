import React from "react";
import "./header.css";
import logo from "../../Assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import isAdmin from "../../../IsAdmin";
import { auth } from "../../firebase";
import isLogedIn from "../../../isLogedIn";
import isFinance from "../../../IsFinance";
function FinanceHeader() {
  const navi = useNavigate();
  function logout() {
    auth.signOut().then((e) => {
      navi("/");
      localStorage.clear();
    });
  }
  return (
    <div className="Header">
      <div
        className="logo"
        onClick={() => {
          navi("/");
        }}
      >
        <img src={logo} alt="" />
      </div>
      {isFinance() && (
        <div className="Nav-links">
          <Link to={"/finance"}>All Invioces</Link>
          <Link to={"/finance/unverified"}>Pending Invoices</Link>
        </div>
      )}
      <div className="login">
        {isFinance() ? (
          <button onClick={logout}>logout</button>
        ) : (
          <button
            onClick={() => {
              navi("/login");
            }}
          >
            Login
          </button>
        )}
      </div>
    </div>
  );
}

export default FinanceHeader;
