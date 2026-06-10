import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import useThemeStore from "./stores/themeStore";

// Public Pages
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import VerifyOTPPage from "./pages/VerifyOTPPage";
import Explore from "./pages/Explore";
import Layout from "./components/creatorLayout/Layout";
// Protected Pages
import Dashboard from "./pages/Dashboard";
import OnboardingProfile from "./pages/OnboardingSteps/OnboardingProfile";
import OnboardingPhase2 from "./pages/OnboardingSteps/OnboardingPhase2";
import ExploreCreator from "./pages/CreatorPage/ExploreCreator";
// Creator Public Page
import CreatorProfile from "./pages/OnboardingSteps/CreatorProfile";

// Layouts
import PublicCreatorLayout from "./components/PublicCreatorLayout/PublicCreatorLayout";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("accessToken");

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to="/signin" replace />
  );
};

const App = () => {
  const { isDark } = useThemeStore();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <Routes>
      {/* =========================
          PUBLIC ROUTES
      ========================== */}
      <Route path="/" element={<Home />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/verify-otp" element={<VerifyOTPPage />} />
      <Route path="/explore" element={<Explore />} />
<Route path="/explore-creator" element={<ExploreCreator />} />
      {/* =========================
          PUBLIC CREATOR PAGE
          Example:
          /pranish
          /ramsharma
          /@pranish
      ========================== */}
      <Route element={<PublicCreatorLayout />}>
        <Route path="/@:username" element={<CreatorProfile />} />
        <Route path="/:username" element={<CreatorProfile />} />
      </Route>
      <Route element={<Layout />}>
        
      </Route>
      {/* =========================
          PROTECTED ROUTES
      ========================== */}
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <OnboardingProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/payment-setup"
        element={
          <ProtectedRoute>
            <OnboardingPhase2 />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* =========================
          404 FALLBACK
      ========================== */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;