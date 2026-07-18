import { useEffect, useState, Suspense, lazy } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import useThemeStore from "./stores/themeStore";
import { scheduleAutoLogout, isTokenExpired, logout } from "./utils/authTimer";
import { getPublicSettings } from "./services/platformService";

// Public Pages
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import ForgotPassword from "./pages/ForgotPassword";
import SignUp from "./pages/SignUp";
import VerifyOTPPage from "./pages/VerifyOTPPage";
import Explore from "./pages/Explore";
import Layout from "./components/creatorLayout/Layout";
// Protected Pages
import Dashboard from "./pages/Dashboard";
import Supporters from "./pages/Supporters";
import Memberships from "./pages/Memberships";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProtectedRoute from "./components/auth/AdminProtectedRoute";
import AccountPage from "./pages/AccountPage";
import OnboardingProfile from "./pages/OnboardingSteps/OnboardingProfile";
import OnboardingPhase2 from "./pages/OnboardingSteps/OnboardingPhase2";
import ExploreCreator from "./pages/CreatorPage/ExploreCreator";
// Creator Public Pages
import CreatorProfile from "./pages/OnboardingSteps/CreatorProfile";
import CreatorPosts from "./pages/CreatorPage/CreatorPosts";
import CreatorPostDetail from "./pages/CreatorPage/CreatorPostDetail";
import CreatorMembership from "./pages/CreatorPage/CreatorMembership";
import TipPaymentSuccess from "./pages/CreatorPage/TipPaymentSuccess";
import TipPaymentFailure from "./pages/CreatorPage/TipPaymentFailure";
import Integrations from "./pages/Integrations";
import Settings from "./pages/Settings";
import StreamAlertOverlay from "./pages/StreamAlertOverlay";

// Layouts
import PublicCreatorLayout from "./components/PublicCreatorLayout/PublicCreatorLayout";

// Shop + shop-checkout pages are lazy-loaded: their charting/payment-gateway
// dependencies are heavy and most visitors never touch the shop at all, so
// there's no reason to ship that code in the initial bundle everyone downloads.
const Posts = lazy(() => import("./pages/Posts"));
const PostEditor = lazy(() => import("./pages/PostEditor"));
const Shop = lazy(() => import("./pages/Shop"));
const ShopProductForm = lazy(() => import("./pages/ShopProductForm"));
const ShopDiscountForm = lazy(() => import("./pages/ShopDiscountForm"));
const CreatorShop = lazy(() => import("./pages/CreatorPage/CreatorShop"));
const CreatorShopItem = lazy(() => import("./pages/CreatorPage/CreatorShopItem"));
const CreatorCheckout = lazy(() => import("./pages/CreatorPage/CreatorCheckout"));
const PaymentSuccess = lazy(() => import("./pages/CreatorPage/PaymentSuccess"));
const PaymentFailure = lazy(() => import("./pages/CreatorPage/PaymentFailure"));

const RouteFallback = () => (
  <div className="min-h-[50vh] flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-patron-green-600 border-t-transparent rounded-full animate-spin" />
  </div>
);

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("accessToken");
  if (!token || isTokenExpired(token)) {
    return <Navigate to="/signin" replace />;
  }
  return children;
};

const MaintenancePage = () => (
  <div className="min-h-screen flex items-center justify-center bg-patron-gray-100 px-4">
    <div className="text-center max-w-md">
      <h1 className="text-2xl font-bold text-patron-black mb-2">We'll be right back</h1>
      <p className="text-patron-gray-500">PatronNP is temporarily down for maintenance. Please check back shortly.</p>
    </div>
  </div>
);

const AnnouncementBanner = ({ message }) => (
  <div className="bg-patron-black text-white text-sm text-center py-2 px-4">{message}</div>
);

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
    <Route path="support/success" element={<TipPaymentSuccess />} />
    <Route path="support/failure" element={<TipPaymentFailure />} />
  </>
);

const App = () => {
  const { isDark } = useThemeStore();
  const location = useLocation();
  const [platformSettings, setPlatformSettings] = useState(null);

  useEffect(() => {
    getPublicSettings()
      .then(setPlatformSettings)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      if (isTokenExpired(token)) {
        logout();
      } else {
        scheduleAutoLogout();
      }
    }

    const onStorage = (e) => {
      if (e.key === "accessToken") {
        scheduleAutoLogout();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Admin (and signin, so an admin can still log in) stay reachable during maintenance —
  // everyone else sees the maintenance page instead of the app.
  const isAdminOrAuthRoute =
    location.pathname.startsWith("/admin") ||
    location.pathname === "/signin" ||
    location.pathname === "/forgot-password";

  if (platformSettings?.maintenanceMode && !isAdminOrAuthRoute) {
    return <MaintenancePage />;
  }

  return (
    <>
    {platformSettings?.announcementBanner && !location.pathname.startsWith("/admin") && (
      <AnnouncementBanner message={platformSettings.announcementBanner} />
    )}
    <Suspense fallback={<RouteFallback />}>
    <Routes>
      {/* PUBLIC ROUTES — must come before /:username */}
      <Route path="/" element={<Home />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/verify-otp" element={<VerifyOTPPage />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/explore-creator" element={<ExploreCreator />} />
      <Route path="/stream-alert/:userKey" element={<StreamAlertOverlay />} />

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
      <Route
        path="/integrations"
        element={
          <ProtectedRoute>
            <Integrations />
          </ProtectedRoute>
        }
      />
      <Route
        path="/supporters"
        element={
          <ProtectedRoute>
            <Supporters />
          </ProtectedRoute>
        }
      />
      <Route
        path="/memberships"
        element={
          <ProtectedRoute>
            <Memberships />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        }
      />

      <Route
        path="/posts"
        element={
          <ProtectedRoute>
            <Posts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/posts/new/:type"
        element={
          <ProtectedRoute>
            <PostEditor />
          </ProtectedRoute>
        }
      />
      <Route
        path="/posts/edit/:id"
        element={
          <ProtectedRoute>
            <PostEditor />
          </ProtectedRoute>
        }
      />

      <Route
        path="/shop"
        element={
          <ProtectedRoute>
            <Shop />
          </ProtectedRoute>
        }
      />
      <Route
        path="/shop/new"
        element={
          <ProtectedRoute>
            <ShopProductForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/shop/:id/edit"
        element={
          <ProtectedRoute>
            <ShopProductForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/shop/discounts/new"
        element={
          <ProtectedRoute>
            <ShopDiscountForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/account"
        element={
          <ProtectedRoute>
            <AccountPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
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
    </Suspense>
    </>
  );
};

export default App;
