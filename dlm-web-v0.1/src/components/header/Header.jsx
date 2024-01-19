import React, { useState } from "react";
import "./header.css";
import logo from "../../Assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import isAdmin from "../../../IsAdmin";
import { auth } from "../../firebase";
import Dropdown from "rsuite/Dropdown";
import "rsuite/dist/rsuite.min.css";
import isLogedIn from "../../../isLogedIn";
import AddExpense from "../Modals/AddExpense";
import AddCatagory from "../Modals/AddCatagory";
import AddSociety from "../Modals/AddSociety";
function Header() {
  const [ShowCatagoryModal, setShowCatagoryModal] = useState(false);
  const [ShowSocietyModal, setShowSocietyModal] = useState(false);
  const navi = useNavigate();
  function logout() {
    auth.signOut().then((e) => {
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
          <Dropdown title={isAdmin ? "Admin" : "Agent"}>
            {isAdmin() && (
              <Dropdown.Item
                onClick={() => {
                  setShowCatagoryModal(true);
                }}
              >
                Add Catagory
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
          <button
            onClick={() => {
              navi("/login");
            }}
          >
            Login
          </button>
        )}
      </div>
      <AddCatagory onClose={closeCatagoryModal} showModal={ShowCatagoryModal} />
      <AddSociety onClose={closeSocietyModal} showModal={ShowSocietyModal} />
    </div>
  );
}

export default Header;
