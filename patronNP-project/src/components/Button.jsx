export const Button = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled = false,
  className = "",
  ...props
}) => {
  const baseClass =
    "font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-patron-green-600 hover:bg-patron-green-700 text-white shadow-sm",
    secondary:
      "bg-patron-gray-100 hover:bg-patron-gray-200 text-patron-black",
    outline:
      "border-2 border-patron-green-600 text-patron-green-700 hover:bg-patron-green-50",
    accent:
      "bg-patron-orange-500 hover:bg-patron-orange-600 text-white shadow-sm",
    ghost: "text-patron-gray-600 hover:bg-patron-gray-100",
    danger: "bg-red-600 hover:bg-red-700 text-white",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
    full: "w-full px-4 py-2.5 text-base",
  };

  return (
    <button
      className={`${baseClass} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
