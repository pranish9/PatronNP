export const Sidebar = () => {
  return (
    <nav className="p-4 space-y-2">
      <a href="/dashboard" className="block p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-900">Dashboard</a>
      <a href="/" className="block p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-900">Settings</a>
      <a href="/" className="block p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-900">Profile</a>
    </nav>
  )
}