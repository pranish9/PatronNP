import React, { useState } from 'react';
import { Search, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="w-8 h-8" />
          <span className="text-xl font-bold text-gray-900">PatronNP</span>
        </div>

        {/* Desktop Search Bar (Hidden on mobile) */}
        <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm"
            placeholder="Search creator..."
          />
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6 text-gray-600 text-sm font-medium">
          {['How it Works', 'Creators', 'Pricing', 'FAQ', 'Features'].map((item) => (
            <a key={item} href="#" className="hover:text-gray-900">{item}</a>
          ))}
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-4 ml-6">
          <button className="text-sm font-medium">Login</button>
          <button className="px-5 py-2 bg-orange-500 text-white rounded-full text-sm font-medium hover:bg-orange-600">
            Sign Up
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu (Visible only when isOpen is true) */}
      {isOpen && (
        <div className="md:hidden bg-white border-t p-4 flex flex-col gap-4">
          <input type="text" className="w-full p-2 border rounded-full" placeholder="Search..." />
          {['How it Works', 'Creators', 'Pricing', 'FAQ', 'Features'].map((item) => (
            <a key={item} href="#" className="text-gray-600">{item}</a>
          ))}
          <hr />
          <button className="text-left font-medium">Login</button>
          <button className="bg-orange-500 text-white py-2 rounded-full font-medium">Sign Up</button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;