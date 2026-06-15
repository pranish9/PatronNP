import Sidebar from "./Sidebar";

export const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-patron-gray-50 text-patron-black patron-container">
      <Sidebar />

      <div className="flex min-h-screen md:pl-64">
        <main className="flex-1 min-w-0 w-full pt-14 md:pt-0 overflow-x-hidden">
          <div className="max-w-7xl mx-auto w-full px-3 sm:px-4 md:px-6 py-4 sm:py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
