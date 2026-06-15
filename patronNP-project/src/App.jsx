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
// Creator Public Pages
import CreatorProfile from "./pages/OnboardingSteps/CreatorProfile";
import CreatorPosts from "./pages/CreatorPage/CreatorPosts";
import CreatorPostDetail from "./pages/CreatorPage/CreatorPostDetail";
import CreatorMembership from "./pages/CreatorPage/CreatorMembership";
import CreatorShop from "./pages/CreatorPage/CreatorShop";
import CreatorShopItem from "./pages/CreatorPage/CreatorShopItem";
import CreatorCheckout from "./pages/CreatorPage/CreatorCheckout";
import PaymentSuccess from "./pages/CreatorPage/PaymentSuccess";
import PaymentFailure from "./pages/CreatorPage/PaymentFailure";

// Layouts
import PublicCreatorLayout from "./components/PublicCreatorLayout/PublicCreatorLayout";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("accessToken");
  return isAuthenticated ? children : <Navigate to="/signin" replace />;
};

const creatorNestedRoutes = (
  <>
    <Route index element={<CreatorProfile />} />
    <Route path="posts" element={<CreatorPosts />} />
    <Route path="posts/:postId" element={<CreatorPostDetail />} />
    <Route path="membership" element={<CreatorMembership />} />
    <Route path="shop" element={<CreatorShop />} />
    <Route path="shop/:itemId" element={<CreatorShopItem />} />
    <Route path="checkout" element={<CreatorCheckout />} />
    <Route path="checkout/success" element={<PaymentSuccess />} />
    <Route path="checkout/failure" element={<PaymentFailure />} />
  </>
);

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
      {/* PUBLIC ROUTES — must come before /:username */}
      <Route path="/" element={<Home />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/verify-otp" element={<VerifyOTPPage />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/explore-creator" element={<ExploreCreator />} />

      {/* PROTECTED ROUTES — before /:username */}
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

      <Route element={<Layout />} />

      {/* PUBLIC CREATOR PAGES — /username and /@username (catch-all username) */}
      <Route path="/@:username" element={<PublicCreatorLayout />}>
        {creatorNestedRoutes}
      </Route>
      <Route path="/:username" element={<PublicCreatorLayout />}>
        {creatorNestedRoutes}
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
