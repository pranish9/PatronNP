export const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow ${className}`}>
      {children}
    </div>
  )
}

export default Card
