import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login/login";
import AdminHome from "./pages/admin/AdminHome";
import SubAdmin from "./pages/subadmin/SubAdmin";
import Home from "./pages/home/Home";
import PlotDetails from "./pages/plot/PlotDetails";
import ClientDetails from "./pages/admin/ClientDetails";
import AdminPlot from "./pages/admin/AdminPlot";
import ClientRegistrationFrom from "./pages/forms/ClientRegistrationForm";
import PlotRegistrationForm from "./pages/forms/PlotRegistrationForm";
import AgentRegistrationForm from "./pages/forms/AgentRegistrationForm";
import AgentRoutes from "./agentRoutes";
import AdminRoutes from "./adminRoutes";
import AdminAgents from "./pages/admin/AdminAgents";
import AdminExpense from "./pages/admin/AdminExpense";

import AdminInvoives from "./pages/admin/AdminInvoives";
import AdminStore from "./pages/admin/AdminStore";
import PrintInvoice from "./pages/Print/InvoicePrint";

import FinanceRoute from "./FinanceRoute";
import Finance from "./pages/finance/Finance";
import FinancePending from "./pages/finance/FinancePending";
import AgentDetails from "./pages/admin/AgentDetails";
import ClientEditForm from "./pages/forms/ClientEditForm";
import AgentEditForm from "./pages/forms/AgentEditForm";
import PlotEditForm from "./pages/forms/PlotEditForm";
import PrintFile from "./pages/Print/PrintFile";

import ErrorPage from "./pages/notfound/ErrorPage";
import BlockedUsers from "./pages/admin/BlockedUsers";
import FinancePlotsView from "./pages/finance/FinancePlotsView";
import Test from "./pages/Test";
import SideBar from "./components/Sidebar/sidebar";
import Ham from "./components/Sidebar/Hamburger";
import Logout from "./pages/login/Logout";
import styled from "styled-components";

const SideBarWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 250px;
  height: 100vh;
  display: block;
  z-index: 2;
  transition: transform 0.3s ease-in-out;
  @media (max-width: 775px) {
    transform: ${({ open }) => (open ? "translateX(0%)" : "translateX(-100%)")};
  }
`;
const PageWrapper = styled.div`
  position: fixed;
  top: 0;
  left: ${({ open }) => (open ? "0" : "250px")};
  width: calc(100% - 250px);
  height: 100vh;
  display: block;
  z-index: 0;
  transition: transform 0.3s ease-in-out;
  @media (max-width: 775px) {
    transform: ${({ open }) => (open ? "translateX(0%)" : "translateX(-100%)")};
  }
  background: red;
`;

const SideBarBody = styled.div`
  background: linear-gradient(0deg, #3358f4, #1d8cf8);
  height: 100vh;
  overflow: scroll;
  @media (max-width: 775px) {
    box-shadow: 0 16px 38px -12px rgba(0, 0, 0, 0.56),
      0 4px 25px 0 rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2);
  }
`;

const Unorderlist = styled.ul`
  position: relative;
  list-style: none;
  padding: 0;
  display: block;
  transition: all 0.5s ease;
`;
const NegativeSidebar = styled.div`
 z-index:2;
 position:fixed;
 left:0;
 right:0;
 top:0;
 width:100vw;
 height:100vh;
 opacity:${({ open }) => (open ? "1" : "0")};
 transition:opacity 224ms cubic-bezier(0.4,0,0.2,1) 0ms;
 @media(max-width:775px){
    pointer-events:${({ open }) => (open ? "auto" : "none")};
 }
 @media(max-width:775px){
  background-color:none; 
  pointer-events:none;
 `;

const makeButtons = [
  {
    to: "/",
    icon: <i className="fa-solid fa-house"></i>,
    title: "Dashboard",
  },
  {
    to: "dashboard/profile",
    icon: <i className="fa-solid fa-id-card"></i>,
    title: "Profile",
    subBtn: ["Add Docuemt", "Edit Profile", "Change Password"],
  },
  {
    to: "dashboard/features",
    icon: <i className="fa-solid fa-bag-shopping"></i>,
    title: "Features",
    subBtn: ["Pages", "Elements", "Portfolio"],
  },
  {
    to: "dashboard/revenue",
    icon: <i className="fa-solid fa-square-poll-vertical"></i>,
    title: "Revenue",
  },
  {
    to: "dashboard/analytics",
    icon: <i className="fa-solid fa-chart-pie"></i>,
    title: "Analytics",
  },
  {
    to: "dashboard/calendar",
    icon: <i className="fa-solid fa-calendar-days"></i>,
    title: "Calendar",
  },
  {
    to: "dashboard/messages",
    icon: <i className="fa-solid fa-comment"></i>,
    title: "Messages",
  },
  {
    to: "dashboard/wallets",
    icon: <i className="fa-solid fa-wallet"></i>,
    title: "Wallets",
    span: "New",
  },
  {
    to: "/endsession",
    icon: <i className="fa-solid fa-gear"></i>,
    title: "Log Out",
  },
];
function App() {
  const [open, setOpen] = useState();
  const handleClick = () => {
    setOpen(!open);
  };
  return (
    <BrowserRouter>
      <Ham open={open} handleClick={handleClick} />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/endsession" element={<Logout />} />
        <Route path="/details/plot" element={<PlotDetails />} />
        <Route path="/create/client/" element={<ClientRegistrationFrom />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
