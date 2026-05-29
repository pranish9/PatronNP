import React from 'react';

const AuthLayout = ({ children, fullWidth = false }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-8">
      <div className={`w-full bg-white rounded-2xl shadow-lg p-8 ${fullWidth ? 'max-w-3xl' : 'max-w-md'}`}>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
