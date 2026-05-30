import { Navbar } from './Navbar'

export const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50">
      <Navbar />
      <main className="max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  )
}

export default Layout
