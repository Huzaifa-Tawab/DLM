import React from "react";
import "./header.css";
import logo from "../../Assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
function Header() {
  const navi = useNavigate();
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
      <div className="Nav-links">
        <Link to={"/admin/agents"}>agents</Link>
      </div>
      <div className="login">
        <button
          onClick={() => {
            navi("/login");
          }}
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default Header;
