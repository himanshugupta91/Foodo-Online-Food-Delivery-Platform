import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import CustomerRoutes from "./CustomerRoutes";
import AdminRouters from "./AdminRouters";
import SuperAdmin from "../superAdmin/SuperAdmin";

const Routers = () => {
  const { auth } = useSelector((store) => store);

  return (
    <>
      {/* Top-level route split by role: customer surface, owner admin, and super-admin panel. */}

      <Routes>

        <Route
          path="/admin/restaurant/*"
          element={
            // Super admin should always use its own console, never owner routes.
            auth.user?.role === "ROLE_SUPER_ADMIN"
              ? <Navigate to="/super-admin" />
              : <AdminRouters />
          }
        />
        <Route path="/super-admin/*" element={<SuperAdmin />} />
        <Route path="/*" element={<CustomerRoutes />} />
      </Routes>
    </>

  );
};

export default Routers;
