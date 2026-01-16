import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProtectedRoute from "../components/ProtectedRoute";

// Public Pages
import Home from "@/pages/public/home";
import NotFound from "@/pages/NotFound";
import Login from "@/pages/public/login";
import About from "@/pages/public/about";
import AccountActivation from "@/pages/public/resetPassword";
import TEST from "../pages/test";
import Register from "../pages/public/register";
import RC from "../pages/doctor/RC";
import ForgotPassword from "../pages/public/forgotPassword";
import { DoctorLayout } from "../layouts/DoctorLayout";
import Dashboard from "../pages/doctor/dashboard";
import Profile from "../pages/doctor/profile";
import { PublicLayout } from "../layouts/PublicLayout";
import GetActivationToken from "../pages/public/getActivationToken";

export default function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/get-activation-link" element={<GetActivationToken />} />

      {/* ===============Public Routes=============== */}
      <Route path="/doctor-registration" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<AccountActivation />} />
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/doctor" replace /> : <Login />
        }
      />

      <Route element={<PublicLayout />}>
        {/* ===============Public Routes=============== */}
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/about-us" element={<About />} />
      </Route>

      {/* ===============Protected Doctor Routes=============== */}
      <Route
        path="/doctor"
        element={
          <ProtectedRoute>
            <DoctorLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* ===============Private Routes=============== */}
      {/* <Route path='/test' element={<TEST />} /> */}
      {/* <Route path="/record" element={<RC />} /> */}
    </Routes>
  );
}
