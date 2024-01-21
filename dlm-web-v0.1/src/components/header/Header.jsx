// Header.jsx

import React, { useState } from "react";
import "./header.css";
import logo from "../../Assets/SoftXion.png";
import { Link, useNavigate } from "react-router-dom";
import isAdmin from "../../../IsAdmin";
import { auth } from "../../firebase";
import Dropdown from "rsuite/Dropdown";
import "rsuite/dist/rsuite.min.css";
import isLogedIn from "../../../isLogedIn";
import AddCatagory from "../Modals/AddCatagory";
import AddSociety from "../Modals/AddSociety";

function Header() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [ShowCatagoryModal, setShowCatagoryModal] = useState(false);
  const [ShowSocietyModal, setShowSocietyModal] = useState(false);
  const navi = useNavigate();

  function logout() {
    auth.signOut().then(() => {
      navi("/");
      localStorage.clear();
    });
  }

  const openCatagoryModal = () => {
    setShowCatagoryModal(true);
  };

  const closeCatagoryModal = () => {
    setShowCatagoryModal(false);
  };

  const closeSocietyModal = () => {
    setShowSocietyModal(false);
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <div className={`Header ${showSidebar ? "show-sidebar" : ""}`}>
      <div className="logo" onClick={() => navi("/")}>
        <img src={logo} alt="" />
      </div>

      {/* Media query for screens wider than 600px */}
      <div className="wide-navbar">
        {isLogedIn() && (
          <div className="Nav-links">
            <Link to={"/admin/home"}>Customer</Link>
            {isAdmin() && <Link to={"/admin/agents"}>Agents</Link>}
            {isAdmin() && <Link to={"/admin/blocked/"}>Blocked User</Link>}
            <Link to={"/admin/invoices"}>Invoices</Link>
            <Link to={"/admin/expense"}>Expenses</Link>
            <Link to={"/admin/store"}>Store</Link>
          </div>
        )}

        {/* Hide the sidebar toggle button on wide screens */}
        <div className="login">
          {isLogedIn() ? (
            <Dropdown title={isAdmin() ? "Admin" : "Agent"}>
              {isAdmin() && (
                <Dropdown.Item onClick={openCatagoryModal}>
                  Add Category
                </Dropdown.Item>
              )}
              {isAdmin() && (
                <Dropdown.Item
                  onClick={() => {
                    setShowSocietyModal(true);
                  }}
                >
                  Add Society
                </Dropdown.Item>
              )}
              <Dropdown.Item onClick={logout}>Logout</Dropdown.Item>
            </Dropdown>
          ) : (
            <span></span>
            // <button
            //   onClick={() => {
            //     navi("/login");
            //   }}
            // >
            //   Login
            // </button>
          )}
        </div>
      </div>

      {/* Sidebar Toggle Button for screens narrower than 600px */}
      <div className="login">
        {isLogedIn() ? (
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            ☰
          </button>
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

      {/* Sidebar Content for screens narrower than 600px */}
      <div className={`sidebar ${showSidebar ? "show" : ""} right-sidebar`}>
        <button className="close-sidebar" onClick={toggleSidebar}>
          ✕
        </button>

        {isLogedIn() && (
          <div className={`Nav-links ${showSidebar ? "show-sidebar" : ""}`}>
            <Link to={"/admin/home"} onClick={toggleSidebar}>
              Customer
            </Link>
            {isAdmin() && (
              <Link to={"/admin/agents"} onClick={toggleSidebar}>
                Agents
              </Link>
            )}
            <Link to={"/admin/invoices"} onClick={toggleSidebar}>
              Invoices
            </Link>
            <Link to={"/admin/expense"} onClick={toggleSidebar}>
              Expenses
            </Link>
            <Link to={"/admin/store"} onClick={toggleSidebar}>
              Store
            </Link>
          </div>
        )}
        {isLogedIn() && (
          <div>
            <div className="admin-dropdown">
              <Dropdown title={isAdmin ? "Admin" : "Agent"} placement="bottom">
                {isAdmin() && (
                  <Dropdown.Item onClick={openCatagoryModal}>
                    Add Category
                  </Dropdown.Item>
                )}
                {isAdmin() && (
                  <Dropdown.Item
                    onClick={() => {
                      setShowSocietyModal(true);
                    }}
                  >
                    Add Society
                  </Dropdown.Item>
                )}
                <Dropdown.Item onClick={logout}>Logout</Dropdown.Item>
              </Dropdown>
            </div>
          </div>
        )}
      </div>

      <AddCatagory onClose={closeCatagoryModal} showModal={ShowCatagoryModal} />
      <AddSociety onClose={closeSocietyModal} showModal={ShowSocietyModal} />
    </div>
  );
}

export default Header;
