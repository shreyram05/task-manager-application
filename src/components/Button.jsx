function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  className = "",
}) {
  const buttonStyle = {
    primary:
      "bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600",

    secondary:
      "bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600",

    danger:
      "bg-rose-100 text-rose-700 hover:bg-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:hover:bg-rose-900",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`rounded-lg px-4 py-2 font-semibold transition-colors ${buttonStyle[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;
