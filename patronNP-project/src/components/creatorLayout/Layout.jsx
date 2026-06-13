import Sidebar from "./Sidebar";
import RightSidebar from "./RightSidebar";

export const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50">
      <Sidebar />

      <div className="flex min-h-screen md:pl-64">
        <main className="flex-1 min-w-0 w-full pt-14 md:pt-0">
          <div className="max-w-7xl mx-auto w-full px-3 sm:px-4 md:px-0 py-4 sm:py-0">
            {children}
          </div>
        </main>

        <RightSidebar />
      </div>
    </div>
  );
};

export default Layout;
