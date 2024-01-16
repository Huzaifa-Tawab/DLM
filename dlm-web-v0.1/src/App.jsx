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
import NotFound from "./pages/notfound/NotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/details/plot" element={<PlotDetails />} />
        <Route path="/create/client/" element={<ClientRegistrationFrom />} />
        <Route path="/404" element={<NotFound />} />

        <Route element={<AgentRoutes />}>
          <Route path="/sub-admin/" element={<SubAdmin />} />
          <Route path="/create/plot/" element={<PlotRegistrationForm />} />
        </Route>
        {/* <Route element={<AdminRoutes />}> */}
        <Route path="/create/agent/" element={<AgentRegistrationForm />} />
        <Route path="/admin/agents" element={<AdminAgents />} />
        <Route path="/admin/home" element={<AdminHome />} />
        <Route path="/details/client/:id" element={<ClientDetails />} />
        <Route path="/create/client/" element={<ClientRegistrationFrom />} />
        <Route path="/create/plot/" element={<PlotRegistrationForm />} />
        <Route path="/details/plot/:id" element={<AdminPlot />} />
        <Route path="/admin/expense" element={<AdminExpense />} />
        {/* </Route> */}
        {/* <Route path="*" element={<NoPage />} />  */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
