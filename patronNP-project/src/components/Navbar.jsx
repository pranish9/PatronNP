import React from 'react';
import { Link } from 'react-router-dom';
import { BiSearch } from 'react-icons/bi';

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-200">
      {/* Logo */}
      <div className="text-xl font-bold text-gray-800">
        <Link to="/"><span className="text-emerald-500">Tip</span>Nepal</Link>
      </div>

      {/* Search Bar */}
      <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 w-96">
        <BiSearch className="text-gray-400" />
        <input 
          type="text" 
          placeholder="Search creators e.g. aarav, sita..." 
          className="bg-transparent border-none outline-none ml-2 w-full text-sm"
        />
      </div>

      {/* Navigation Links */}
      <ul className="flex items-center gap-6 text-gray-600 font-medium">
        <li><Link to="/features" className="hover:text-emerald-600">Features</Link></li>
        <li><Link to="/how-it-works" className="hover:text-emerald-600">How it Works</Link></li>
        <li><Link to="/creators" className="hover:text-emerald-600">Creators</Link></li>
        <li><Link to="/pricing" className="hover:text-emerald-600">Pricing</Link></li>
        <li><Link to="/faq" className="hover:text-emerald-600">FAQ</Link></li>
      </ul>

      {/* Auth Actions */}
      <div className="flex items-center gap-4">
        <Link to="/login" className="text-gray-600 hover:text-gray-800 font-medium">Login</Link>
        <Link 
          to="/signup" 
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full font-medium transition-colors"
        >
          Sign Up
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;