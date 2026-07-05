const AdminSidebar = ({ tabs, activeTab, onTabChange }) => (
  <aside className="hidden lg:flex w-60 shrink-0 flex-col bg-patron-black text-white min-h-screen sticky top-0">
    <div className="px-5 py-5 border-b border-white/10">
      <span className="font-bold">PatronNP Admin</span>
    </div>
    <nav className="flex-1 px-3 py-4 space-y-1">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              isActive
                ? "bg-patron-green-900/40 text-patron-green-400 border-l-2 border-patron-green-400"
                : "text-patron-gray-300 hover:bg-white/5 hover:text-white border-l-2 border-transparent"
            }`}
          >
            <Icon size={16} />
            {tab.label}
          </button>
        );
      })}
    </nav>
  </aside>
);

export default AdminSidebar;
