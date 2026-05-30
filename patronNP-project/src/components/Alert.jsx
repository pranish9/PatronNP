import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react'

export const Alert = ({ type = 'info', title, message, onClose }) => {
  const types = {
    info: { bg: 'bg-blue-50 dark:bg-blue-900', border: 'border-blue-200 dark:border-blue-800', icon: Info, color: 'text-blue-600 dark:text-blue-400', title: 'text-blue-900 dark:text-blue-100' },
    success: { bg: 'bg-green-50 dark:bg-green-900', border: 'border-green-200 dark:border-green-800', icon: CheckCircle, color: 'text-green-600 dark:text-green-400', title: 'text-green-900 dark:text-green-100' },
    warning: { bg: 'bg-yellow-50 dark:bg-yellow-900', border: 'border-yellow-200 dark:border-yellow-800', icon: AlertTriangle, color: 'text-yellow-600 dark:text-yellow-400', title: 'text-yellow-900 dark:text-yellow-100' },
    error: { bg: 'bg-red-50 dark:bg-red-900', border: 'border-red-200 dark:border-red-800', icon: AlertCircle, color: 'text-red-600 dark:text-red-400', title: 'text-red-900 dark:text-red-100' },
  }

  const config = types[type]
  const Icon = config.icon

  return (
    <div className={`${config.bg} border-l-4 ${config.border} rounded-lg p-4 flex gap-3`}>
      <Icon className={`${config.color} flex-shrink-0 mt-0.5`} size={20} />
      <div className="flex-1">
        {title && <h3 className={`font-semibold ${config.title}`}>{title}</h3>}
        {message && <p className={config.color}>{message}</p>}
      </div>
      {onClose && (
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
          ✕
        </button>
      )}
    </div>
  )
}

export default Alert
