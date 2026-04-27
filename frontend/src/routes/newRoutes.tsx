import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProtectedRoute from "../components/ProtectedRoute";
import { route } from "./routePaths";

// layouts
import { DoctorLayout } from "../layouts/DoctorLayout";
import { PublicLayout } from "../layouts/PublicLayout";

// public pages
import Home from "@/pages/public/home";
import NotFound from "@/pages/public/NotFound";
import Login from "@/pages/public/login";
import About from "@/pages/public/about";
import Register from "../pages/public/register";
import ForgotPassword from "../pages/public/forgotPassword";
import AccountActivation from "../pages/public/resetPassword";
import GetActivationToken from "../pages/public/getActivationToken";

// doctor pages
import Dashboard from "../pages/doctor/dashboard";
import Profile from "../pages/doctor/profile";
import Patients from "@/pages/doctor/patients";
import Settings from "@/pages/doctor/setting";
import RecordingConsultationCard from "@/components/RecordingConsultationCard";
import ViewPatientDetails from "@/pages/doctor/viewPatientDetails";
import ViewPatientVisitDetails from "@/pages/doctor/viewPatientVisitDetails";
import ReviewPatientDetails from "@/pages/doctor/reviewPatientDetails";

export default function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route
        path={route.public.activationLink}
        element={
          isAuthenticated ? (
            <Navigate to={route.doctor.dashboard} replace />
          ) : (
            <GetActivationToken />
          )
        }
      />

      <Route path={route.public.register} element={<Register />} />
      <Route path={route.public.forgotPassword} element={<ForgotPassword />} />
      <Route
        path={route.public.resetPassword}
        element={<AccountActivation />}
      />

      <Route
        path={route.public.login}
        element={
          isAuthenticated ? (
            <Navigate to={route.doctor.dashboard} replace />
          ) : (
            <Login />
          )
        }
      />

      {/* Public Layout */}
      <Route element={<PublicLayout />}>
        <Route path={route.public.home} element={<Home />} />
        <Route path={route.public.about} element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Doctor Protected Routes */}
      <Route
        path={route.doctor.base}
        element={
          <ProtectedRoute>
            <DoctorLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />

        <Route path="patients">
          <Route index element={<Patients />} />
          <Route path=":id" element={<ViewPatientDetails />} />

          <Route path=":id/visit/:visitId">
            <Route index element={<ViewPatientVisitDetails />} />
            <Route path="review" element={<ReviewPatientDetails />} />
            {/* <Route path="billing" element={<Billing />} /> */}
            {/* <Route path="complete" element={<VisitComplete />} /> */}
          </Route>
        </Route>

        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
        <Route path="consultations" element={<RecordingConsultationCard />} />
      </Route>
    </Routes>
  );
}
