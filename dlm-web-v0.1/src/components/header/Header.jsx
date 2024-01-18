import React from "react";
import "./header.css";
import logo from "../../Assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import isAdmin from "../../../IsAdmin";
import { auth } from "../../firebase";
import isLogedIn from "../../../isLogedIn";
function Header() {
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
      {isLogedIn() && (
        <div className="Nav-links">
          <Link to={"/admin/home"}>Customer</Link>
          {isAdmin() && <Link to={"/admin/agents"}>Agents</Link>}
          <Link to={"/admin/invoices"}>Invoices</Link>
          <Link to={"/admin/expense"}>Expenses</Link>
          <Link to={"/admin/store"}>Store</Link>
        </div>
      )}
      <div className="login">
        {isLogedIn() ? (
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

export default Header;
