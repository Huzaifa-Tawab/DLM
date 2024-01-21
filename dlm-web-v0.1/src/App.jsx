import React from "react";
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/print/invoice/:id" element={<PrintInvoice />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/details/plot" element={<PlotDetails />} />
        <Route path="/create/client/" element={<ClientRegistrationFrom />} />
        <Route
          path="/unauthorized"
          element={ <ErrorPage errorCode={401} errorMessage="Unauthorized Access" />}
        />
        <Route
        path="/notfound"
        element={ <ErrorPage errorCode={404} errorMessage="Not Found" />}
        />
        <Route element={<FinanceRoute />}>
          <Route path="/finance" element={<Finance />} />
          <Route path="/finance/unverified" element={<FinancePending />} />
        </Route>
        <Route path="/print/:id" element={<PrintFile />} />

        <Route element={<AdminRoutes />}>
          <Route path="/create/agent/" element={<AgentRegistrationForm />} />
          <Route path="/edit/agent/:id" element={<AgentEditForm />} />

          <Route path="/admin/agents" element={<AdminAgents />} />
          <Route path="/admin/home" element={<AdminHome />} />
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
