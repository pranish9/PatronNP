import { AlertCircle, CheckCircle } from 'lucide-react'

export const Input = ({ 
  label, 
  error, 
  icon: Icon,
  type = 'text',
  className = '',
  helperText,
  ...props 
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600" size={20} />
        )}
        <input
          type={type}
          className={`w-full px-4 py-2 ${Icon ? 'pl-10' : ''} rounded-lg border-2 transition-all duration-200
            bg-white dark:bg-slate-800 
            border-slate-200 dark:border-slate-700
            text-slate-900 dark:text-slate-100
            placeholder-slate-400 dark:placeholder-slate-500
            focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600 focus:ring-opacity-20
            disabled:bg-slate-100 dark:disabled:bg-slate-900 disabled:cursor-not-allowed
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
            ${className}`}
          {...props}
        />
      </div>
      {error && (
        <div className="mt-2 flex items-center gap-1 text-red-500 text-sm">
          <AlertCircle size={16} />
          {error}
        </div>
      )}
      {!error && helperText && (
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{helperText}</p>
      )}
    </div>
  )
}

export default Input
