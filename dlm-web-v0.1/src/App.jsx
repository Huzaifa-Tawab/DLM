import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

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
import SideBar from "./components/Sidebar/sidebar";
import Ham from "./components/Sidebar/Hamburger";
import Logout from "./pages/login/Logout";
import isLogedIn from "../isLogedIn";
import AddCategory from "./pages/admin/Addcategories";
import AddSociety from "./pages/admin/Addsociety";
import AdminSociety from "./pages/admin/Addsociety";
import AdminCategory from "./pages/admin/Addcategories";
import MarqueeInput from "./pages/Marquee/MarqueeInput";
import Wallet from "./pages/Wallet/Wallet";
import HomeNew from "./pages/home/HomeNew";
import Financedash from "./pages/Dashboard/Financedash";
import FinanceWithdrawal from "./pages/finance/FinanceWithdrawal";
import FinanceWithdrawalRequests from "./pages/finance/FinanceWithdrawalRequests";
import AdminPromos from "./pages/admin/AdminPromos";
import AdminDash from "./pages/Dashboard/Admindash";
import AgentDash from "./pages/Dashboard/Agentdash";
import FinanceDash from "./pages/Dashboard/Financedash";
import AdminPromosResults from "./pages/admin/AdminPromosResults";
import blocked from "./Assets/notfound.jpg";
import ChangePassword from "./pages/Forget Password/changepass";
import EditProfile from "./pages/Edit Profile/Editprofile";
import Schedule from "./pages/Schedule/Schedule";
// import Walletnew from "./pages/Wallet/walletnew";
import AdminWithdralView from "./pages/admin/AdminWithdralView";
import Employspaytable from "./pages/finance/Employspaytable";
import Emppayslip from "./pages/Print/Emppayslip";
import Emplysdetailsform from "./pages/forms/Emplysdetailsform";
import Empdetafinance from "./pages/finance/Empdetafinance";
import PaySlip from "./pages/forms/PaySlip";

function App() {
  const [open, setOpen] = useState();
  const [showSidebar, setShowSidebar] = useState(false);
  const handleClick = () => {
    setOpen(!open);
  };
  useEffect(() => {
    if (isLogedIn()) {
      setShowSidebar(true);
    } else {
      setShowSidebar(false);
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/employe/:id" element={<Empdetafinance />} />
        <Route path="/empdetailfrom" element={<Emplysdetailsform />} />
        <Route path="/print/payslip/:id" element={<Emppayslip />} />
        <Route path="/employtable" element={<Employspaytable />} />
        <Route path="/print/invoice/:id" element={<PrintInvoice />} />
        <Route path="/create/payslip/:uid" element={<PaySlip />} />
        <Route path="print/schedule/:id" element={<Schedule />} />
        {/* <Route path="/" element={<FinancePlotsView />} /> */}
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<HomeNew />} />
        {/* <Route
          path="/123"
          element={
            <SideBar open={open} setOpen={setOpen} handleClick={handleClick} />
          }
        /> */}

        <Route path="/login" element={<Login />} />
        {/* <Route path="/agent/walletnew" element={<Walletnew />} /> */}
        <Route path="/endsession" element={<Logout />} />
        <Route path="/details/plot" element={<PlotDetails />} />
        <Route path="/create/client/" element={<ClientRegistrationFrom />} />
        <Route
          path="/unauthorized"
          element={
            <ErrorPage errorCode={401} errorMessage="Unauthorized Access" />
          }
        />
        <Route
          path="/blocked"
          element={
            <ErrorPage
              errorCode={401}
              errorMessage="You Have Been Blocked"
              errorimage={blocked}
            />
          }
        />
        <Route
          path="/notfound"
          element={<ErrorPage errorCode={404} errorMessage="Not Found" />}
        />
        <Route element={<FinanceRoute />}>
          <Route path="/finance/history" element={<Finance />} />
          <Route path="/finance/dashboard" element={<Financedash />} />
          {/* <Route path="/admin/change password" element={<ChangePassword />} /> */}
          <Route path="/admin/edit profile" element={<EditProfile />} />
          <Route
            path="finance/withdrawal/history"
            element={<FinanceWithdrawal />}
          />
          <Route
            path="/finance/withdrawal/requests"
            element={<FinanceWithdrawalRequests />}
          />
          <Route path="/finance/dashboard" element={<FinanceDash />} />
          {/* <Route path="/finance" element={<FinancePlotsView />} /> */}
          <Route path="/finance/unverified" element={<FinancePending />} />
        </Route>
        <Route path="/print/:id" element={<PrintFile />} />

        <Route element={<AdminRoutes />}>
          <Route path="/agent/wallet" element={<Wallet />} />

          <Route path="/admin/marquee" element={<MarqueeInput />} />
          <Route path="/admin/withdraw" element={<AdminWithdralView />} />
          <Route path="/admin/promo/winners" element={<AdminPromosResults />} />
          <Route path="/admin/home" element={<AdminDash />} />
          <Route path="/agent/home" element={<AgentDash />} />
          <Route path="//admin/promo/active" element={<AdminPromos />} />
          <Route path="/admin/change password" element={<ChangePassword />} />
          <Route path="/admin/edit profile" element={<EditProfile />} />
          <Route path="/create/agent/" element={<AgentRegistrationForm />} />
          <Route path="/admin/blocked/" element={<BlockedUsers />} />
          <Route path="/edit/agent/:id" element={<AgentEditForm />} />
          {/* <Route path="/admin/categories" element={<AdminCategory />} /> */}
          {/* <Route path="/admin/societies" element={<AdminSociety />} /> */}
          <Route path="/admin/agents" element={<AdminAgents />} />
          <Route path="/admin/customers" element={<AdminHome />} />
          <Route path="/admin/invoices" element={<AdminInvoives />} />
          <Route path="/admin/store" element={<AdminStore />} />
          <Route path="/details/client/:id" element={<ClientDetails />} />
          <Route path="/details/agent/:id" element={<AgentDetails />} />
          <Route path="/create/client/" element={<ClientRegistrationFrom />} />
          <Route path="/edit/client/:id" element={<ClientEditForm />} />
          <Route path="/create/plot/" element={<PlotRegistrationForm />} />
          <Route path="/edit/plot/:id" element={<PlotEditForm />} />
          <Route path="/details/plot/:id" element={<AdminPlot />} />
          <Route path="/admin/expense" element={<AdminExpense />} />
          <Route path="/sub-admin/" element={<SubAdmin />} />
          <Route path="/create/plot/" element={<PlotRegistrationForm />} />
        </Route>
        {/* <Route path="*" element={<NoPage />} />  */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
