import React from 'react';
// Import your logo from your assets folder
import logo from '/android-chrome-192x192.png'; 

const Footer = () => {
  return (
    <footer className="py-12 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Logo Section */}
        {/* Logo Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <img 
              src={logo} 
              alt="PatronNP Logo" 
              className="h-8 w-8 object-contain" 
            />
            <span className="font-bold text-xl text-emerald-600">PatronNP</span>
          </div>
          <p className="text-gray-500 text-sm">
            The all-in-one platform for Nepali creators to earn online.
          </p>
        </div>
        
        {/* Links Sections */}
        <div>
          <h4 className="font-bold text-gray-900 mb-4">Product</h4>
          <ul className="space-y-2 text-gray-600 text-sm cursor-pointer">
            <li className="hover:text-emerald-600 transition-colors">Features</li>
            <li className="hover:text-emerald-600 transition-colors">Pricing</li>
            <li className="hover:text-emerald-600 transition-colors">How it works</li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold text-gray-900 mb-4">Company</h4>
          <ul className="space-y-2 text-gray-600 text-sm cursor-pointer">
            <li className="hover:text-emerald-600 transition-colors">About</li>
            <li className="hover:text-emerald-600 transition-colors">Contact</li>
            <li className="hover:text-emerald-600 transition-colors">Blog</li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-gray-900 mb-4">Legal</h4>
          <ul className="space-y-2 text-gray-600 text-sm cursor-pointer">
            <li className="hover:text-emerald-600 transition-colors">Terms</li>
            <li className="hover:text-emerald-600 transition-colors">Privacy</li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-gray-100 text-center text-gray-400 text-sm">
        &copy; 2026 PatronNP. Made with ♥ in Kathmandu.
      </div>
    </footer>
  );
};

export default Footer;