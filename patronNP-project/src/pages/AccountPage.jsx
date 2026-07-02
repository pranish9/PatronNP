import { useState } from "react";

import Layout from "../components/creatorLayout/Layout";
import EditProfileTab from "../components/account/EditProfileTab";
import PaymentsTab from "../components/account/PaymentsTab";
import FollowersTab from "../components/account/FollowersTab";

const TABS = ["Edit profile", "Payments", "Followers"];

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
          {activeTab === "Payments" && <PaymentsTab />}
          {activeTab === "Followers" && <FollowersTab />}
        </div>
      </div>
    </Layout>
  );
};

export default AccountPage;
