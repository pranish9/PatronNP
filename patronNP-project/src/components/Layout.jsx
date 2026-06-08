

import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar' // Assuming you have or will create this

export const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 flex flex-col">
      {/* Top Navbar */}
      <Navbar />

      <div className="flex flex-1">
        {/* Sidebar - Hidden on small screens, visible on medium+ */}
        <aside className="hidden md:block w-64 border-r border-slate-200 dark:border-slate-800">
          <Sidebar />
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout
