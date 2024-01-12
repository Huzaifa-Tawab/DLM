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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/home" element={<AdminHome />} />
        <Route path="/details/plot/:id" element={<AdminPlot />} />
        <Route path="/sub-admin/" element={<SubAdmin />} />
        <Route path="/details/plot" element={<PlotDetails />} />
        <Route path="/details/client/:id" element={<ClientDetails />} />
        <Route path="/create/client/" element={<ClientRegistrationFrom />} />
        <Route path="/create/plot/" element={<PlotRegistrationForm />} />
        {/* <Route path="*" element={<NoPage />} />  */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
