import { useState, Suspense, lazy } from "react";

import Layout from "../components/creatorLayout/Layout";
import EditProfileTab from "../components/account/EditProfileTab";
import FollowersTab from "../components/account/FollowersTab";
import SupportTab from "../components/account/SupportTab";
import PayoutMethodTab from "../components/account/PayoutMethodTab";

// Payment/purchase history is only needed once someone actually clicks the
// "Payments" tab, so it's split into its own chunk instead of loading on
// every "My account" visit.
const PaymentsTab = lazy(() => import("../components/account/PaymentsTab"));

const TABS = ["Edit profile", "Payments", "Payout method", "Followers", "Support"];

const AccountPage = () => {
  const [activeTab, setActiveTab] = useState("Edit profile");

  return (
    <Layout>
      <div className="bg-patron-gray-100 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <h1 className="text-2xl font-bold text-patron-black">My account</h1>

          <div className="flex gap-6 border-b border-patron-gray-200">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-semibold border-b-2 -mb-px transition-colors ${
                  activeTab === tab
                    ? "text-patron-black border-patron-black"
                    : "text-patron-gray-400 border-transparent hover:text-patron-gray-600"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === "Edit profile" && <EditProfileTab />}
          {activeTab === "Payments" && (
            <Suspense
              fallback={
                <div className="bg-patron-white rounded-2xl shadow-sm p-5 sm:p-6 py-12 flex justify-center">
                  <div className="w-6 h-6 border-2 border-patron-green-600 border-t-transparent rounded-full animate-spin" />
                </div>
              }
            >
              <PaymentsTab />
            </Suspense>
          )}
          {activeTab === "Payout method" && <PayoutMethodTab />}
          {activeTab === "Followers" && <FollowersTab />}
          {activeTab === "Support" && <SupportTab />}
        </div>
      </div>
    </Layout>
  );
};

export default AccountPage;
