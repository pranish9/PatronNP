import React, { useState } from 'react';
import { 
  Home, LayoutDashboard, Search, Heart, Lock, ShoppingBag, 
  PenTool, ChevronDown, ChevronUp, FileText, Image, Mail, 
  Code, Zap, DollarSign, Settings as SettingsIcon, Menu, X 
} from 'lucide-react';

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState('Explore creators');
  const [isPublishOpen, setIsPublishOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuItems = [
    { name: 'Home', icon: Home },
    { name: 'View page', icon: LayoutDashboard },
    { name: 'Explore creators', icon: Search },
  ];

  const monetizeItems = [
    { name: 'Supporters', icon: Heart },
    { name: 'Memberships', icon: Lock },
    { name: 'Shop', icon: ShoppingBag },
  ];

  const publishItems = [
    { name: 'Posts', icon: FileText },
    { name: 'Gallery', icon: Image },
  ];

  const settingsItems = [
    { name: 'Integrations', icon: Code },   
    { name: 'Settings', icon: SettingsIcon },
  ];

  const NavItem = ({ item }) => (
    <div 
      onClick={() => { setActiveItem(item.name); setIsMobileOpen(false); }}
      className={`flex items-center gap-3 px-4 py-2 rounded-xl cursor-pointer transition-colors ${
        activeItem === item.name ? 'text-green-600 bg-green-50' : 'text-gray-600 hover:bg-gray-50'
      }`}
    >
      <item.icon size={20} />
      <span className="font-medium">{item.name}</span>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <button className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow" onClick={() => setIsMobileOpen(!isMobileOpen)}>
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar Overlay */}
      {isMobileOpen && <div className="md:hidden fixed inset-0 bg-black/50 z-30" onClick={() => setIsMobileOpen(false)} />}

      {/* Sidebar Container */}
      <aside className={`fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 z-40 transform transition-transform duration-300 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 overflow-y-auto`}>
        <div className="p-4 flex flex-col gap-6">
          <img src="/android-chrome-192x192.png" alt="Logo" className="w-10 h-10 m-2" />

          {/* Main Nav */}
          <nav className="flex flex-col gap-1">
            {menuItems.map((item) => <NavItem key={item.name} item={item} />)}
          </nav>

          {/* Monetize */}
          <div>
            <h2 className="px-4 text-xs font-semibold text-gray-400 uppercase mb-2">Monetize</h2>
            <div className="flex flex-col gap-1">
              {monetizeItems.map((item) => <NavItem key={item.name} item={item} />)}
              <div onClick={() => setIsPublishOpen(!isPublishOpen)} className="flex items-center justify-between px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-xl cursor-pointer">
                <div className="flex items-center gap-3"><PenTool size={20} /><span>Publish</span></div>
                {isPublishOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
              {isPublishOpen && <div className="pl-8 flex flex-col gap-1 mt-1">{publishItems.map((item) => <NavItem key={item.name} item={item} />)}</div>}
            </div>
          </div>

          {/* Settings */}
          <div>
            <h2 className="px-4 text-xs font-semibold text-gray-400 uppercase mb-2">Settings</h2>
            {settingsItems.map((item) => <NavItem key={item.name} item={item} />)}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;